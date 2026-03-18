<?php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\HttpClient\HttpClient;
use ZipArchive;

#[AsCommand(
    name: 'app:prepare-data',
    description: 'Télécharge les ZIP, extrait les données/mapping et convertit en CSV'
)]
class PrepareDataCommand extends Command
{
    private const SOURCE_URLS = [
        2022 => 'https://www.data.gouv.fr/api/1/datasets/r/f698847a-7533-474d-a962-9ae475f5ba11',
        2021 => 'https://www.data.gouv.fr/api/1/datasets/r/93b570b9-9a73-46c5-9448-ce5c7e4141dd',
        2020 => 'https://www.data.gouv.fr/api/1/datasets/r/9079e7d5-f5e0-4076-8882-b1a19a059301',
        2019 => 'https://www.data.gouv.fr/api/1/datasets/r/d97800cd-f7ad-415f-aeb7-27711007596d',
        2018 => 'https://www.data.gouv.fr/api/1/datasets/r/b498805f-7315-41ac-85a0-1f4773449d28',
    ];

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $client = HttpClient::create();

        $dataDirectory = 'data';
        if (!is_dir($dataDirectory)) {
            mkdir($dataDirectory, 0777, true);
            $io->note("Le dossier $dataDirectory a été créé.");
        }

        foreach (self::SOURCE_URLS as $annee => $url) {
            $io->title("Traitement de l'année $annee");

            $zipPath = "$dataDirectory/temp_$annee.zip";
            $xlsxDataPath = "$dataDirectory/REI_$annee.xlsx";
            $xlsxMappingPath = "$dataDirectory/mapping_$annee.xlsx";
            $csvDataPath = "$dataDirectory/REI_$annee.csv";

            if (!file_exists($xlsxDataPath) && !file_exists($csvDataPath)) {
                $io->info("Téléchargement du ZIP depuis data.gouv.fr...");
                
                $response = $client->request('GET', $url);
                if ($response->getStatusCode() !== 200) {
                    $io->error("Impossible d'accéder à l'URL pour l'année $annee");
                    continue;
                }

                $fileHandler = fopen($zipPath, 'w');
                foreach ($client->stream($response) as $chunk) {
                    fwrite($fileHandler, $chunk->getContent());
                }
                fclose($fileHandler);

                $zip = new ZipArchive();
                if ($zip->open($zipPath) === TRUE) {
                    $internalDataName = null;
                    $internalMappingName = null;

                    for ($i = 0; $i < $zip->numFiles; $i++) {
                        $filename = $zip->getNameIndex($i);
                        $isXlsx = str_ends_with(strtolower($filename), '.xlsx');
                        $containsRei = mb_stripos($filename, 'REI') !== false;
                        $containsTrace = mb_stripos($filename, 'trace') !== false;

                        if ($isXlsx && $containsRei) {
                            if ($containsTrace) {
                                $internalMappingName = $filename;
                            } else {
                                $internalDataName = $filename;
                            }
                        }
                    }

                    if ($internalDataName) {
                        $io->note("Extraction données : $internalDataName -> REI_$annee.xlsx");
                        copy("zip://$zipPath#$internalDataName", $xlsxDataPath);
                    }

                    if ($internalMappingName) {
                        $io->note("Extraction mapping : $internalMappingName -> mapping_$annee.xlsx");
                        copy("zip://$zipPath#$internalMappingName", $xlsxMappingPath);
                    }

                    $zip->close();
                    if (file_exists($zipPath)) unlink($zipPath);
                } else {
                    $io->error("Échec de l'ouverture du ZIP pour l'année $annee");
                    continue;
                }
            }

            if (file_exists($xlsxDataPath) && !file_exists($csvDataPath)) {
                $io->info("Conversion de REI_$annee.xlsx en CSV...");
                
                shell_exec("xlsx2csv $xlsxDataPath $csvDataPath -d ';'");

                if (file_exists($csvDataPath)) {
                    $io->success("Fichier CSV généré : REI_$annee.csv");
                    unlink($xlsxDataPath); 
                } else {
                    $io->error("Erreur lors de la conversion CSV pour REI_$annee.xlsx");
                }
            }
        }

        $io->success("Tous les fichiers ont été nommés et préparés avec succès !");
        return Command::SUCCESS;
    }
}