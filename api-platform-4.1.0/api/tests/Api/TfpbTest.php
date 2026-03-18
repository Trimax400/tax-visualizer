<?php

namespace App\Tests;

use App\Tests\Api\AbstractTaxTest;

class TfpbTest extends AbstractTaxTest
{
    protected function getResourceUrl(): string { return '/tfpbs'; }
    protected function getResourceName(): string { return 'Tfpb'; }
    protected function getExpectedNomCommune(): string { return 'Commune 0'; }
    protected function getExpectedTauxNet(): float { return 15.5; }
    protected function getExpectedStatValueTaux(): int { return 20; }
    protected function getExpectedStatValueMontant(): int { return 45000; }
}