export const EMPLOYE = {
  nom: 'Marie Lefebvre',
  initials: 'ML',
  matricule: '00045821',
  statut: 'CDI actif',
  email: 'm.lefebvre@entreprise.fr',
  telephone: '+33 6 12 34 56 78',
  adresse: '12 rue du Moulin, 69003 Lyon',
  naissance: '14 mars 1988',
  poste: 'Responsable Supply Chain',
  departement: 'Opérations — Lyon Sud',
  manager: 'Pierre Dumont',
  contrat: 'CDI — temps plein',
  entree: '03 septembre 2018',
  soldeCP: 18,
  soldeRTT: 4.5,
}

export const BULLETINS = [
  { mois: 'Mai 2025',     net: '3 248,50 €', taille: '142 Ko', nouveau: true  },
  { mois: 'Avril 2025',   net: '3 248,50 €', taille: '138 Ko', nouveau: false },
  { mois: 'Mars 2025',    net: '3 412,00 €', taille: '145 Ko', nouveau: false },
  { mois: 'Février 2025', net: '3 248,50 €', taille: '139 Ko', nouveau: false },
  { mois: 'Janvier 2025', net: '3 248,50 €', taille: '141 Ko', nouveau: false },
]

export const DEMANDES_INIT = [
  { id: 1, dates: '14 – 18 juil. 2025', type: 'Congés payés', jours: 5, depot: '02/06', statut: 'En attente' },
  { id: 2, dates: '24 – 25 avr. 2025',  type: 'RTT',          jours: 2, depot: '10/04', statut: 'Approuvée'  },
]

export const PERSONS_INIT = [
  { id: 1, nom: 'Clara Lefebvre',   lien: 'Conjointe',    ddn: '12/04/1989', ss: '2 89 04 69 …', mutuelle: true,  initials: 'CL', bg: '#FBEAF0', color: '#993556' },
  { id: 2, nom: 'Thomas Lefebvre',  lien: 'Enfant · 8 ans', ddn: '03/09/2016', ss: '—',           mutuelle: true,  initials: 'TL', bg: '#EAF3DE', color: '#27500A' },
]

export const PERSON_COLORS = [
  { bg: '#E6F1FB', color: '#0C447C' },
  { bg: '#FAEEDA', color: '#854F0B' },
  { bg: '#FAECE7', color: '#993C1D' },
  { bg: '#EEEDFE', color: '#3C3489' },
]

export const MONTHS = [
  'Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre',
]

export const DAYS_SHORT = ['Lu','Ma','Me','Je','Ve','Sa','Di']
