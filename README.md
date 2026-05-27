# Mon Espace RH — Fiori-style Mobile App

Application RH self-service style **SAP Fiori**, développée en React + Vite.  
Conçue pour être démontrée à un client SAP BTP sans nécessiter de licence SAP utilisateur.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![Vite](https://img.shields.io/badge/Vite-5-646cff)

---

## Fonctionnalités

| Écran | Fonctionnalités |
|-------|----------------|
| **Ma fiche** | Informations personnelles, poste, contrat |
| **Congés** | Calendrier interactif, calcul jours ouvrés, envoi de demande, historique |
| **Bulletins de paie** | Liste par année, téléchargement PDF simulé |
| **Personnes à charge** | Ajout/suppression, mutuelle, justificatifs |

---

## Stack technique

- **Frontend** : React 18 + Vite 5
- **Styles** : CSS-in-JS (inline styles), zéro dépendance UI
- **Données** : Mock statiques (prêt à brancher sur OData SAP / API REST)
- **Cible** : Mobile-first, viewport 360px (iPhone standard)

---

## Installation

```bash
# 1. Cloner le repo
git clone https://github.com/TON-USER/rh-fiori-app.git
cd rh-fiori-app

# 2. Installer les dépendances
npm install

# 3. Lancer en développement
npm run dev
```

L'app tourne sur [http://localhost:5173](http://localhost:5173)

---

## Build production

```bash
npm run build
npm run preview
```

---

## Structure du projet

```
src/
├── App.jsx                  # Composant racine + navigation
├── main.jsx                 # Point d'entrée React
├── index.css                # Reset CSS global
├── data.js                  # Données mock centralisées
├── components/
│   └── UI.jsx               # Composants réutilisables (Card, Row, Toast…)
└── screens/
    ├── FicheScreen.jsx      # Fiche personnelle
    ├── CongesScreen.jsx     # Demande de congés + calendrier
    ├── PaieScreen.jsx       # Bulletins de paie
    └── FamilleScreen.jsx    # Personnes à charge
```

---

## Roadmap vers SAP BTP / Fiori réel

1. **Authentification** → Remplacer les données mock par un appel IAS/BTP (token SAML/OIDC)
2. **Données** → Brancher chaque écran sur un service OData SAP HCM ou SuccessFactors
3. **Déploiement** → Packager en SAPUI5 ou déployer le build Vite dans HTML5 App Repository (BTP)
4. **Workflow congés** → Intégrer le service `LeaveRequestService` + notification manager

---

## Contacts

Développé dans le cadre d'un POC SAP BTP — Fiori sans licence utilisateur SAP.
