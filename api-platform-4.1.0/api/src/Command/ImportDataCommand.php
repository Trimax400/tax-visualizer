<?php 

namespace App\Command;

use App\Entity\Tfpnb;
use App\Entity\Tfpb;
use App\Entity\Th;
use App\Entity\Cfe;
use Doctrine\ORM\EntityManagerInterface;
use OpenSpout\Reader\XLSX\Reader;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Stopwatch\Stopwatch;

#[AsCommand(name: 'app:import-xlsx', description: 'Importation REI via CSV et Mapping via OpenSpout')]
class ImportDataCommand extends Command
{
    private const MAPPING_DICTIONARY = [
        'DEP' => 'DEPT', 'LIBCOM' => 'COMMUNE',
        'B12' => 'TFPNB_TAUX', 'B13' => 'TFPNB_MONTANT',
        'E12' => 'TFPB_TAUX', 'E13' => 'TFPB_MONTANT',
        'H12' => 'TH_TAUX', 'H13' => 'TH_MONTANT',
        'P12' => 'CFE_TAUX', 'P13' => 'CFE_MONTANT',
    ];

    private array $departements = [];

    private const ANNEES_A_TRAITER = [2018, 2019, 2020, 2021, 2022]; 

    public function __construct(private EntityManagerInterface $em) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $stopwatch = new Stopwatch();

        $stopwatch->start('import-global');

        $loadDepts = function () {
            $this->departements = [];

            $rows = $this->em->getConnection()->fetchAllAssociative(
                'SELECT id, code FROM departement'
            );

            foreach ($rows as $row) {
                $this->departements[$row['code']] = (int) $row['id'];
            }
        };

        $loadDepts();

        if (empty($this->departements)) {
            $io->error("La table Departement est vide ! Veuillez exécuter la commande : sudo docker compose exec php php bin/console app:fill-depts");
            return Command::FAILURE;
        }
        

        foreach (self::ANNEES_A_TRAITER as $annee) {
            $io->section("Importation de l'année $annee");

            $mappingFile = "data/mapping_$annee.xlsx";
            $dataFile = "data/REI_$annee.csv";

            if (!file_exists($mappingFile) || !file_exists($dataFile)) {
                $io->error("Fichiers manquants pour $annee");
                continue;
            }

            $colMapping = $this->loadYearlyMapping($mappingFile);

            if (($handle = fopen($dataFile, "r")) !== FALSE) {
                $io->progressStart();
                $index = 0;

                while (($rowData = fgetcsv($handle, 0, ";", '"', "\\")) !== FALSE) {
                    $index++;
                    if ($index === 1) continue;

                    $this->createEntry(Tfpnb::class, $annee, $rowData, $colMapping);
                    $this->createEntry(Tfpb::class, $annee, $rowData, $colMapping);
                    $this->createEntry(Th::class, $annee, $rowData, $colMapping);
                    $this->createEntry(Cfe::class, $annee, $rowData, $colMapping);

                    if ($index % 500 === 0) {
                        $this->em->flush();
                        $this->em->clear();

                        $io->progressAdvance(500);
                    }
                }
                
                $this->em->flush();
                $this->em->clear();
                fclose($handle);
                $io->progressFinish();
                $io->success("Année $annee terminée !");
            }
        }

        $globalEvent = $stopwatch->stop('import-global');
        $dureeTotale = number_format($globalEvent->getDuration() / 1000 / 60, 2);
        
        $io->success("Toutes les données ont été importées avec succès en $dureeTotale minutes !");

        return Command::SUCCESS;
    }
    private function loadYearlyMapping(string $filename): array
    {
        $reader = new Reader();
        $reader->open($filename);

        $mappingResult = [];

        foreach ($reader->getSheetIterator() as $sheet) {
            foreach ($sheet->getRowIterator() as $row) {
                $cells = $row->toArray();
                
                $codeAdmin = trim((string)($cells[1] ?? '')); 
                $codeAdmin = $this->decodeUnicodeEscape($codeAdmin);
                
                if (isset(self::MAPPING_DICTIONARY[$codeAdmin])) {
                    $cleMetier = self::MAPPING_DICTIONARY[$codeAdmin];
                    $mappingResult[$cleMetier] = (int)$cells[0] - 1; 
                }
            }
            break;
        }

        $reader->close();
        return $mappingResult;
    }

private function createEntry(string $className, int $annee, array $rowData, array $mapping): void
    {
        if (!isset($mapping['DEPT'], $mapping['COMMUNE'])) return;

        $rawDept = (string)($rowData[$mapping['DEPT']] ?? '');
        $codeDept = $this->decodeUnicodeEscape($rawDept);
        
        $codeDept = str_pad($codeDept, 2, '0', STR_PAD_LEFT);

        $deptId = $this->departements[$codeDept] ?? null;
        if (!$deptId) {
            return;
        }

        $prefix = strtoupper((new \ReflectionClass($className))->getShortName());
        $idxTaux = $mapping[$prefix . '_TAUX'] ?? null;

        if ($idxTaux === null || !isset($rowData[$idxTaux]) || $rowData[$idxTaux] === '') {
            return;
        }

        $entity = new $className();
        $entity->setAnnee($annee);
        
        $deptRef = $this->em->getReference(\App\Entity\Departement::class, $deptId);
        $entity->setDepartement($deptRef);

        $nomCommune = (string)($rowData[$mapping['COMMUNE']] ?? '');
        $entity->setNomCommune($this->decodeUnicodeEscape($nomCommune));

        $idxMontant = $mapping[$prefix . '_MONTANT'] ?? null;
        $rawTaux = $this->decodeUnicodeEscape($rowData[$idxTaux]);
        $taux = str_replace(',', '.', $rowData[$idxTaux]);
        $entity->setTauxNet((float)$taux);

        if ($idxMontant !== null && isset($rowData[$idxMontant])) {
            $montant = str_replace(',', '.', $rowData[$idxMontant]);
            $entity->setMontantReel((float)$montant);
        }

        $this->em->persist($entity);
    }

    private function decodeUnicodeEscape(string $value): string
    {
        return preg_replace_callback('/_x([0-9A-Fa-f]{4})_/', function ($matches) {
            return mb_convert_encoding(pack('H*', $matches[1]), 'UTF-8', 'UCS-2BE');
        }, $value);
    }
}