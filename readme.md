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
   > **Note importante**: Les dépendances Symfony (dossier vendor) sont installées directement dans le conteneur Docker PHP. 
   > Le dossier vendor n'est pas synchronisé avec votre machine locale pour des raisons de performance.
   > Si vous avez besoin d'accéder aux dépendances, utilisez `docker exec -it php bash` pour entrer dans le conteneur.

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

### Problèmes avec les dépendances Composer
Si vous rencontrez des problèmes avec les dépendances :
```bash
# Nettoyer le cache Composer dans le conteneur
docker exec -it php composer clear-cache

# Réinstaller toutes les dépendances
docker exec -it php composer install --no-cache

# Vérifier les dépendances installées
docker exec -it php composer show
```

## Développement

Pour travailler efficacement sur le projet :

1. Le hot-reload est activé sur le frontend (http://localhost:3000)
2. Les modifications du backend sont immédiatement prises en compte
3. XDebug est configuré pour le débogage (configuration IDE nécessaire)

## Support

Pour toute question ou problème :
1. Consultez la documentation officielle de [Symfony](https://symfony.com/doc) ou [React](https://reactjs.org/docs)
2. Ouvrez une issue sur le dépôt GitHub du projet

## Authentification JWT

L'application utilise JWT (JSON Web Tokens) pour l'authentification. Voici les endpoints disponibles :

### Configuration initiale des clés JWT

Avant de pouvoir utiliser l'authentification JWT, vous devez générer les clés :

```bash
# Créer le dossier pour les clés
mkdir -p config/jwt

# Générer la clé privée
openssl genpkey -out config/jwt/private.pem -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096 -pass pass:your_secret_passphrase

# Générer la clé publique
openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem -pubout -passin pass:your_secret_passphrase
```

Assurez-vous de :
1. Remplacer `your_secret_passphrase` par une passphrase sécurisée
2. Configurer la même passphrase dans votre fichier `.env.local`
3. Ne jamais commiter les clés JWT dans Git

### Endpoints d'authentification

- **Login** : `POST /api/login_check`
  ```json
  {
    "email": "user@example.com",
    "password": "your_password"
  }
  ```
  Réponse :
  ```json
  {
    "token": "eyJ0eXAiOiJKV1QiLC..."
  }
  ```

- **Register** : `POST /api/register`
  ```json
  {
    "email": "user@example.com",
    "password": "your_password"
  }
  ```

- **Get User Info** : `GET /api/me`
  Headers requis :
  ```
  Authorization: Bearer {your_jwt_token}
  ```

### Utilisation des tokens JWT

Pour accéder aux routes protégées, incluez le token JWT dans le header Authorization :
```
Authorization: Bearer {your_jwt_token}
```

Le token a une durée de validité de 1 heure. Après expiration, vous devrez vous reconnecter.

### Sécurité

- Les clés JWT sont stockées dans `config/jwt/`
- Les fichiers `.pem` sont ignorés par Git
- La passphrase est stockée dans les variables d'environnement
- Chaque environnement (dev, staging, prod) doit avoir ses propres clés
- Les tokens expirent après 1 heure