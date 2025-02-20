## Symfony React Application

Une application fullstack utilisant Symfony 7.2 pour le backend, React pour le frontend, et une infrastructure Docker complète.

## Prérequis

- Docker et Docker Compose installés sur votre machine
- Git
- Un terminal
- Minimum 4GB de RAM disponible

## Structure du Projet

```
symfony-react-app/
├── back/                 # Backend Symfony
├── front/                # Frontend React
└── docker/               # Configuration Docker
    ├── nginx/           # Configuration Nginx
    ├── php/             # Configuration PHP-FPM
    └── ...
```

## Installation

1. **Cloner le projet**
   ```
   git clone [URL_DU_REPO]
   cd symfony-react-app
   ```

2. **Configuration des variables d'environnement**

   Créez un fichier `.env` à la racine du projet backend :
   ```
   cd back
   cp .env.example .env
   ```

   Ajustez les variables suivantes dans le fichier `.env` :
   ```
   DATABASE_URL="mysql://user:password@mysql:3306/app_db?serverVersion=8.0"
   ```

3. **Démarrage des conteneurs Docker**
   ```
   docker-compose up -d
   ```

4. **Installation des dépendances Backend**
   ```
   docker exec -it php composer install
   ```

5. **Création et migration de la base de données**
   ```
   docker exec -it php php bin/console doctrine:database:create
   docker exec -it php php bin/console doctrine:migrations:migrate
   ```

## Accès aux services

Une fois l'installation terminée, vous pouvez accéder aux différents services :

- **Frontend (React)** : http://localhost:3000
- **Backend (Symfony)** : http://localhost:80
- **PHPMyAdmin** : http://localhost:8080
  - Utilisateur : user (selon votre configuration)
  - Mot de passe : password (selon votre configuration)

## Commandes utiles

### Docker
```
# Démarrer les conteneurs
docker-compose up -d

# Arrêter les conteneurs
docker-compose down

# Voir les logs
docker-compose logs -f

# Reconstruire les images
docker-compose build
```

### Backend (Symfony)
```
# Accéder au conteneur PHP
docker exec -it php bash

# Créer une migration
docker exec -it php php bin/console make:migration

# Exécuter les migrations
docker exec -it php php bin/console doctrine:migrations:migrate

# Vider le cache
docker exec -it php php bin/console cache:clear
```

## Architecture du projet

### Backend (Symfony 7.2)
- Framework : Symfony 7.2
- PHP : 8.3
- Base de données : MySQL 8.0
- Bundles principaux :
  - doctrine/doctrine-bundle
  - symfony/security-bundle
  - nelmio/cors-bundle

### Frontend (React)
- Framework : React
- Port : 3000

### Infrastructure Docker
- Nginx (serveur web)
- PHP-FPM 8.3
- MySQL 8.0
- PHPMyAdmin
- Conteneur Frontend React

## Résolution des problèmes courants

### Problèmes de permissions
Si vous rencontrez des problèmes de permissions avec les fichiers générés par Symfony :
```
docker exec -it php chown -R www-data:www-data var/
```

### Problèmes de connexion à la base de données
Vérifiez que :
1. Le service MySQL est bien démarré
2. Les informations de connexion dans le `.env` sont correctes
3. La base de données existe

## Développement

Pour travailler efficacement sur le projet :

1. Le hot-reload est activé sur le frontend (http://localhost:3000)
2. Les modifications du backend sont immédiatement prises en compte
3. XDebug est configuré pour le débogage (configuration IDE nécessaire)

## Support

Pour toute question ou problème :
1. Consultez la documentation officielle de [Symfony](https://symfony.com/doc) ou [React](https://reactjs.org/docs)
2. Ouvrez une issue sur le dépôt GitHub du projet
