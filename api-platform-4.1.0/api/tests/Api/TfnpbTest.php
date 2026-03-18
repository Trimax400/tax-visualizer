<?php

namespace App\Tests;

use App\Tests\Api\AbstractTaxTest;

class TfpnbTest extends AbstractTaxTest
{
    protected function getResourceUrl(): string { return '/tfpnbs'; }
    protected function getResourceName(): string { return 'Tfpnb'; }
    protected function getExpectedNomCommune(): string { return 'Commune 0'; }
    protected function getExpectedTauxNet(): float { return 15.5; }
    protected function getExpectedStatValueTaux(): int { return 20; }
    protected function getExpectedStatValueMontant(): int { return 45000; }
}