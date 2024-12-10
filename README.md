# PlantesShop - Site de Vente de Plantes en Ligne

Une boutique en ligne moderne pour la vente de plantes, construite avec HTML, CSS, JavaScript et Node.js.

## Fonctionnalités

- Catalogue de plantes avec images et descriptions
- Panier d'achat interactif
- Paiement sécurisé via Stripe
- Interface utilisateur responsive et moderne
- Animations et effets visuels
- Page de confirmation de commande personnalisée

## Prérequis

- Node.js >= 14.0.0
- npm >= 6.0.0
- Compte Stripe (pour le traitement des paiements)

## Installation

1. Cloner le repository :
```bash
git clone [URL_DU_REPO]
cd plantes-en-ligne
```

2. Installer les dépendances :
```bash
# Pour le frontend
npm install

# Pour le backend
cd server
npm install
```

3. Configuration :
- Créer un fichier `.env` dans le dossier `server` avec les variables suivantes :
```
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete
STRIPE_PUBLIC_KEY=pk_test_votre_cle_publique
PORT=3000
```

## Développement

1. Démarrer le serveur de développement frontend :
```bash
npm start
```

2. Démarrer le serveur backend :
```bash
cd server
npm run dev
```

## Déploiement en Production

### Frontend (Vercel/Netlify)

1. Créer un compte sur Vercel ou Netlify
2. Connecter votre repository GitHub
3. Configurer les variables d'environnement :
   - `STRIPE_PUBLIC_KEY`
4. Déployer avec les paramètres par défaut

### Backend (Heroku)

1. Créer un compte Heroku
2. Installer Heroku CLI
3. Déployer le backend :
```bash
cd server
heroku create
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a [nom-de-votre-app]
git push heroku main
```

4. Configurer les variables d'environnement sur Heroku :
```bash
heroku config:set STRIPE_SECRET_KEY=sk_live_votre_cle_secrete
heroku config:set STRIPE_PUBLIC_KEY=pk_live_votre_cle_publique
```

### Configuration Post-Déploiement

1. Mettre à jour les URLs dans `script.js` avec votre domaine de production
2. Mettre à jour les URLs de redirection Stripe dans `server.js`
3. Mettre à jour les clés Stripe en production

## Sécurité

- Ne jamais commiter les fichiers `.env`
- Utiliser HTTPS en production
- Configurer les en-têtes de sécurité appropriés
- Mettre en place une protection CSRF
- Activer CORS avec les domaines autorisés uniquement

## Support

Pour toute question ou problème, veuillez ouvrir une issue sur GitHub.

## Licence

MIT
