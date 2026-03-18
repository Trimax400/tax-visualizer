<?php

namespace App\DataFixtures;

use App\Entity\Tfpnb;
use App\Entity\Tfpb;
use App\Entity\Th;
use App\Entity\Cfe;
use App\Entity\Departement;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixture extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $dept = new Departement();
        $dept->setNom('Eure');
        $dept->setCode('27');
        $dept->setRegion('Normandie');
        $manager->persist($dept);

        $taxClasses = [Tfpnb::class, Tfpb::class, Th::class, Cfe::class];

        foreach ($taxClasses as $taxClass) {
            for ($i = 0; $i < 10; $i++) {
                $taxe = new $taxClass();
                $taxe->setAnnee(2022);
                $taxe->setNomCommune('Commune ' . $i);
                $taxe->setTauxNet(15.5 + $i);
                $taxe->setMontantReel(1000.0 * $i);
                $taxe->setDepartement($dept);
                
                $manager->persist($taxe);
            }
        }

        $manager->flush();
    }
}