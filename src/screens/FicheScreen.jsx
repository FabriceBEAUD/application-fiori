import { Card, Row, SectionLabel } from '../components/UI.jsx'
import { EMPLOYE } from '../data.js'

export default function FicheScreen() {
  return (
    <div style={{ background: '#f5f5f3', flex: 1, overflowY: 'auto' }}>
      {/* Hero */}
      <div style={{ background: '#0854A0', padding: '0 16px 20px' }}>
        <div style={{ background: '#1068C5', borderRadius: 16, padding: '18px 16px', display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 500, color: '#0854A0', flexShrink: 0 }}>
            {EMPLOYE.initials}
          </div>
          <div style={{ color: '#fff' }}>
            <div style={{ fontSize: 17, fontWeight: 500 }}>{EMPLOYE.nom}</div>
            <div style={{ fontSize: 12, opacity: .8, marginTop: 3 }}>Matricule · {EMPLOYE.matricule}</div>
            <div style={{ marginTop: 7, background: 'rgba(255,255,255,.18)', borderRadius: 20, padding: '3px 10px', fontSize: 11, display: 'inline-block' }}>
              ✓ {EMPLOYE.statut}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: 12 }}>
        <SectionLabel first>Informations personnelles</SectionLabel>
        <Card>
          <Row icon="👤" label="Nom complet"           value={EMPLOYE.nom} />
          <Row icon="📅" label="Date de naissance"     value={EMPLOYE.naissance} />
          <Row icon="✉️" label="Email professionnel"   value={EMPLOYE.email}     action="⧉" />
          <Row icon="📞" label="Téléphone"             value={EMPLOYE.telephone}  action="✏️" />
          <div style={{ display: 'flex', alignItems: 'center', padding: '13px 16px', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📍</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: '#888' }}>Adresse domicile</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{EMPLOYE.adresse}</div>
            </div>
            <span style={{ color: '#ccc', fontSize: 15 }}>✏️</span>
          </div>
        </Card>

        <SectionLabel>Poste & contrat</SectionLabel>
        <Card>
          <Row icon="💼" iconBg="#EAF3DE" iconColor="#3B6D11" label="Intitulé du poste" value={EMPLOYE.poste} />
          <Row icon="🏢" iconBg="#EAF3DE" iconColor="#3B6D11" label="Département"       value={EMPLOYE.departement} />
          <Row icon="👤" iconBg="#EAF3DE" iconColor="#3B6D11" label="Manager"           value={EMPLOYE.manager} />
          <Row icon="📋" iconBg="#FAEEDA" iconColor="#854F0B" label="Type de contrat"   value={EMPLOYE.contrat} />
          <div style={{ display: 'flex', alignItems: 'center', padding: '13px 16px', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#FAEEDA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📆</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: '#888' }}>Date d'entrée</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{EMPLOYE.entree}</div>
            </div>
          </div>
        </Card>
        <div style={{ height: 16 }} />
      </div>
    </div>
  )
}
