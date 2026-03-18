<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260207214938 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE cfe_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE tfpb_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE th_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE cfe (id INT NOT NULL, annee INT NOT NULL, departement INT NOT NULL, nom_commune VARCHAR(255) NOT NULL, taux_net DOUBLE PRECISION NOT NULL, montant_reel DOUBLE PRECISION NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE tfpb (id INT NOT NULL, annee INT NOT NULL, departement INT NOT NULL, nom_commune VARCHAR(255) NOT NULL, taux_net DOUBLE PRECISION NOT NULL, montant_reel DOUBLE PRECISION NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE th (id INT NOT NULL, annee INT NOT NULL, departement INT NOT NULL, nom_commune VARCHAR(255) NOT NULL, taux_net DOUBLE PRECISION NOT NULL, montant_reel DOUBLE PRECISION NOT NULL, PRIMARY KEY(id))');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP SEQUENCE cfe_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE tfpb_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE th_id_seq CASCADE');
        $this->addSql('DROP TABLE cfe');
        $this->addSql('DROP TABLE tfpb');
        $this->addSql('DROP TABLE th');
    }
}
