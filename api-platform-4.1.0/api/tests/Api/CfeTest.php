<?php

namespace App\Tests;

use App\Tests\Api\AbstractTaxTest;

class CfeTest extends AbstractTaxTest
{
    protected function getResourceUrl(): string { return '/cves'; }
    protected function getResourceName(): string { return 'Cfe'; }
    protected function getExpectedNomCommune(): string { return 'Commune 0'; }
    protected function getExpectedTauxNet(): float { return 15.5; }
    protected function getExpectedStatValueTaux(): int { return 20; }
    protected function getExpectedStatValueMontant(): int { return 45000; }
}