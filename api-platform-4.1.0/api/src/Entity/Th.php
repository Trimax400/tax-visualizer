<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use App\Entity\Departement;

#[ORM\Entity]
#[ApiResource(
    operations: [
        new GetCollection(
            filters: [
                'tax.search_filter',
                'tax.order_filter',
            ]
        ),
        new GetCollection(
            uriTemplate: '/ths/stats',
            name: 'get_th_stats',
            provider: \App\State\TaxRegionStatsProvider::class,
            openapi: new \ApiPlatform\OpenApi\Model\Operation(
                summary: 'Statistiques globales (taux et montants) pour la TH',
                description: 'Permet de récupérer moyennes et totaux groupés par région, département ou code.',
                parameters: [
                    new \ApiPlatform\OpenApi\Model\Parameter(
                        name: 'annee',
                        in: 'query',
                        schema: ['type' => 'integer', 'default' => 2022]
                    ),
                    new \ApiPlatform\OpenApi\Model\Parameter(
                        name: 'groupBy',
                        in: 'query',
                        schema: [
                            'type' => 'string', 
                            'enum' => ['region', 'departement', 'code'],
                            'default' => 'region'
                        ]
                    ),
                    new \ApiPlatform\OpenApi\Model\Parameter(
                        name: 'metric',
                        in: 'query',
                        schema: ['type' => 'string', 'enum' => ['taux', 'montant'], 'default' => 'taux'],
                        description: 'Choisir la donnée à calculer'
                    )
                ]
            )
        ),
        new Get()
    ]
)]
class Th
{
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    #[ORM\GeneratedValue(strategy: 'SEQUENCE')]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $annee = null;

    #[ORM\ManyToOne(targetEntity: Departement::class, inversedBy: 'ths')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Departement $departement = null;

    #[ORM\Column(length: 255)]
    private ?string $nomCommune = null;

    #[ORM\Column]
    private ?float $tauxNet = null;

    #[ORM\Column]
    private ?float $montantReel = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAnnee(): ?int
    {
        return $this->annee;
    }

    public function setAnnee(int $annee): static
    {
        $this->annee = $annee;

        return $this;
    }

    public function getDepartement(): ?Departement
    {
        return $this->departement;
    }

    public function setDepartement(?Departement $departement): static
    {
        $this->departement = $departement;

        return $this;
    }

    public function getNomCommune(): ?string
    {
        return $this->nomCommune;
    }

    public function setNomCommune(string $nomCommune): static
    {
        $this->nomCommune = $nomCommune;

        return $this;
    }

    public function getTauxNet(): ?float
    {
        return $this->tauxNet;
    }

    public function setTauxNet(float $tauxNet): static
    {
        $this->tauxNet = $tauxNet;

        return $this;
    }

    public function getMontantReel(): ?float
    {
        return $this->montantReel;
    }

    public function setMontantReel(float $montantReel): static
    {
        $this->montantReel = $montantReel;

        return $this;
    }

}