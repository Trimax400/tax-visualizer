<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use Doctrine\ORM\EntityManagerInterface;

class TaxRegionStatsProvider implements ProviderInterface
{
    public function __construct(private EntityManagerInterface $em) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $request = $context['request'] ?? null;
        $annee = $request ? (int)$request->query->get('annee', 2022) : 2022;
        $groupByParam = $request ? $request->query->get('groupBy', 'region') : 'region';
        
        $metric = $request ? $request->query->get('metric', 'taux') : 'taux';

        $allowedGroupBy = [
            'region'      => 'd.region',
            'departement' => 'd.nom',
            'code'        => 'd.code'
        ];

        $groupField = $allowedGroupBy[$groupByParam] ?? 'd.region';
        $entityClass = $operation->getClass();

        $qb = $this->em->createQueryBuilder();
        $qb->select($groupField . ' as label')
        ->from($entityClass, 't')
        ->join('t.departement', 'd')
        ->where('t.annee = :annee')
        ->setParameter('annee', $annee)
        ->groupBy('label');

        if ($metric === 'montant') {
            $qb->addSelect('SUM(t.montantReel) as value');
            $qb->orderBy('value', 'DESC');
        } else {
            $qb->addSelect('AVG(t.tauxNet) as value');
            $qb->orderBy('value', 'DESC');
        }

        return $qb->getQuery()->getResult();
    }
}