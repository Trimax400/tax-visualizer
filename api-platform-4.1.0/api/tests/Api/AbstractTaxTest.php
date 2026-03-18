<?php

namespace App\Tests\Api;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;

abstract class AbstractTaxTest extends ApiTestCase
{
    abstract protected function getResourceUrl(): string;
    abstract protected function getResourceName(): string;
    abstract protected function getExpectedNomCommune(): string;
    abstract protected function getExpectedTauxNet(): float;
    abstract protected function getExpectedStatValueTaux(): int|float;
    abstract protected function getExpectedStatValueMontant(): int|float;

    public function testGetCollection(): void
    {
        $client = static::createClient();
        $response = $client->request('GET', $this->getResourceUrl() . '?page=1');
        
        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $this->assertJsonContains([
            '@context' => '/contexts/' . $this->getResourceName(),
            '@id' => $this->getResourceUrl(),
            '@type' => 'Collection',
            'member' => [
                [
                    'nomCommune' => $this->getExpectedNomCommune(),
                    'tauxNet' => $this->getExpectedTauxNet(),
                ],
            ],
        ]);
    }

    public function testGet(): void
    {
        $client = static::createClient();
        $response = $client->request('GET', $this->getResourceUrl() . '?page=1');
        $data = $response->toArray();
        
        $iri = $data['member'][0]['@id']; 

        $client->request('GET', $iri);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@id' => $iri,
            '@type' => $this->getResourceName(),
            'nomCommune' => $this->getExpectedNomCommune(),
            'tauxNet' => $this->getExpectedTauxNet(),
        ]);
    }

    public function testStatsEndpoint(): void
    {
        $client = static::createClient();
        
        $client->request('GET', $this->getResourceUrl() . '/stats?metric=taux');
        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@context' => '/contexts/' . $this->getResourceName(),
            '@id' => $this->getResourceUrl() . '/stats',
            '@type' => 'Collection',
            'member' => [
                [
                    'label' => 'Normandie',
                    'value' => $this->getExpectedStatValueTaux(),
                ]
            ],
        ]);

        $client->request('GET', $this->getResourceUrl() . '/stats?metric=montant');
        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@context' => '/contexts/' . $this->getResourceName(),
            '@id' => $this->getResourceUrl() . '/stats',
            '@type' => 'Collection',
            'member' => [
                [
                    'label' => 'Normandie',
                    'value' => $this->getExpectedStatValueMontant(),
                ]
            ],
        ]);
    }
}