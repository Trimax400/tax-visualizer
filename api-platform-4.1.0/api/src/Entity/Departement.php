<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Repository\DepartementRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
#[ApiResource(
    operations: [
        new Get(),
        new GetCollection()
    ],
    normalizationContext: ['groups' => ['dept:read']]
)]
class Departement
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['dept:read', 'taxe:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 3, unique: true)]
    #[Groups(['dept:read', 'taxe:read'])]
    private ?string $code = null;

    #[ORM\Column(length: 100)]
    #[Groups(['dept:read', 'taxe:read'])]
    private ?string $nom = null;

    #[ORM\Column(length: 100)]
    #[Groups(['dept:read', 'taxe:read'])]
    private ?string $region = null;


    #[ORM\OneToMany(mappedBy: 'departement', targetEntity: Tfpnb::class)]
    private Collection $tfpnbs;
    #[ORM\OneToMany(mappedBy: 'departement', targetEntity: Tfpb::class)]
    private Collection $tfpbs;
    #[ORM\OneToMany(mappedBy: 'departement', targetEntity: Cfe::class)]
    private Collection $cfes;
    #[ORM\OneToMany(mappedBy: 'departement', targetEntity: Th::class)]
    private Collection $ths;

    public function __construct()
    {
        $this->tfpnbs = new ArrayCollection();
        $this->tfpbs = new ArrayCollection();
        $this->ths = new ArrayCollection();
        $this->cfes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCode(): ?string
    {
        return $this->code;
    }

    public function setCode(string $code): static
    {
        $this->code = $code;
        return $this;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;
        return $this;
    }

    public function getRegion(): ?string
    {
        return $this->region;
    }

    public function setRegion(string $region): static
    {
        $this->region = $region;
        return $this;
    }

    public function getTfpnbs(): Collection
    {
        return $this->tfpnbs;
    }

        public function getTfpbs(): Collection
    {
        return $this->tfpbs;
    }

        public function getCfes(): Collection
    {
        return $this->cfes;
    }

        public function getThs(): Collection
    {
        return $this->ths;
    }
}