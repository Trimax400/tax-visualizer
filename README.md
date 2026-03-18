# Tax Visualizer — Web Fullstack Lab

Projet académique (Master 2 Informatique - Université Le Havre Normandie)
Réalisé en binôme, ce projet est une vitrine technique démontrant la mise en place d'une architecture fullstack moderne et conteneurisée.

## Présentation
Tax Visualizer est un laboratoire de développement permettant de visualiser les statistiques de la fiscalité directe locale en France. L'application exploite les données ouvertes [du gouvernement](https://www.data.gouv.fr/datasets/impots-locaux-fichier-de-recensement-des-elements-dimposition-a-la-fiscalite-directe-locale-rei-3). pour proposer une analyse graphique de 4 taxes spécifiques sur une période de 5 ans.

Note : Ce projet est une démonstration technique et n'a pas vocation à être utilisé comme outil d'analyse officielle.

## Démo
Le projet est déployé et consultable ici : https://taxes.trimax400.com

La documentation liée à l'api est disponible ici : https://taxes.trimax400.com/api/docs

## Stack Technique
L'architecture est entièrement conteneurisée avec Docker, séparant les responsabilités pour une meilleure scalabilité :

### Backend (API)
Framework : API Platform (basé sur Symfony)

Base de données : PostgreSQL

Fonctionnalités : Exposition d'une API REST documentée, filtres complexes, et gestion des statistiques agrégées.

### Frontend
Framework : Next.js (React)

Visualisation : D3.js pour des rendus graphiques interactifs et performants.

Styling : Tailwind CSS

### Infrastructure
Docker & Docker Compose : Orchestration des services (PHP, Database, Frontend).

