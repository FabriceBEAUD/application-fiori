import { useState } from 'react'
import { Card, SectionLabel, Toast, useToast, FieldBox, InfoCard } from '../components/UI.jsx'
import { PERSONS_INIT, PERSON_COLORS } from '../data.js'

export default function FamilleScreen({ onAdd }) {
  const [persons, setPersons] = useState(PERSONS_INIT)
  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState({ nom: '', lien: 'Conjoint(e)', ddn: '', mutuelle: 'Oui' })
  const [toast, showToast]    = useToast()

  const conjoint = persons.filter(p => p.lien.toLowerCase().includes('conjoint')).length
  const enfant   = persons.filter(p => p.lien.toLowerCase().includes('enfant')).length

  const deletePerson = (id, nom) => {
    setPersons(prev => prev.filter(p => p.id !== id))
    showToast(`${nom} supprimé(e)`)
  }

  const addPerson = () => {
    if (!form.nom.trim()) { alert('Saisis un nom.'); return }
    const initials = form.nom.trim().split(' ').map(w => w[0] || '').join('').substring(0, 2).toUpperCase()
    const c = PERSON_COLORS[persons.length % PERSON_COLORS.length]
    const ddnFmt = form.ddn ? new Date(form.ddn).toLocaleDateString('fr-FR') : '—'
    setPersons(prev => [...prev, { id: Date.now(), nom: form.nom, lien: form.lien, ddn: ddnFmt, ss: '—', mutuelle: form.mutuelle === 'Oui', initials, ...c }])
    setForm({ nom: '', lien: 'Conjoint(e)', ddn: '', mutuelle: 'Oui' })
    setModal(false)
    showToast(`${form.nom} ajouté(e)`)
  }

  return (
    <div style={{ background: '#f5f5f3', flex: 1, overflowY: 'auto' }}>
      {/* Hero */}
      <div style={{ background: '#0854A0', padding: '0 16px 20px' }}>
        <div style={{ background: '#1068C5', borderRadius: 16, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#fff', fontSize: 26, fontWeight: 500 }}>{persons.length} personne{persons.length > 1 ? 's' : ''}</div>
            <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 12, marginTop: 2 }}>déclarées à charge</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ background: 'rgba(255,255,255,.18)', color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 500 }}>❤ {conjoint} conjoint</span>
            <span style={{ background: 'rgba(255,255,255,.18)', color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 500 }}>👶 {enfant} enfant</span>
          </div>
        </div>
      </div>

      <div style={{ padding: 12 }}>
        <Toast msg={toast.msg} show={toast.show} />

        <SectionLabel first>Personnes déclarées</SectionLabel>
        {persons.map(p => (
          <div key={p.id} style={{ background: '#fff', borderRadius: 14, border: '0.5px solid #e5e5e5', padding: '14px 16px', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 500, color: p.color, flexShrink: 0 }}>{p.initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 500 }}>{p.nom}</div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{p.lien}</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button style={{ width: 32, height: 32, borderRadius: 8, border: '0.5px solid #ddd', background: 'none', cursor: 'pointer', fontSize: 15 }}>✏️</button>
                <button onClick={() => deletePerson(p.id, p.nom)} style={{ width: 32, height: 32, borderRadius: 8, border: '0.5px solid #ddd', background: 'none', cursor: 'pointer', fontSize: 15 }}>🗑</button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <FieldBox label="Date de naissance" value={p.ddn} />
              <FieldBox label="N° SS" value={p.ss} />
              <FieldBox label="Couverture mutuelle" value={p.mutuelle ? 'Rattachée · ayant droit' : 'Non rattachée'} color={p.mutuelle ? '#3B6D11' : '#A32D2D'} full />
            </div>
          </div>
        ))}

        {/* Justificatifs */}
        <SectionLabel>Justificatifs</SectionLabel>
        <Card>
          {[
            { icon: '❤️', bg: '#FBEAF0', nom: 'Acte de mariage',          date: '12/01/2023' },
            { icon: '📜', bg: '#EAF3DE', nom: 'Acte de naissance — Thomas', date: '12/01/2023' },
          ].map((d, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', gap: 12, borderBottom: '0.5px solid #f0f0f0' }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: d.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>{d.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{d.nom}</div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Ajouté le {d.date} · PDF</div>
              </div>
              <span style={{ color: '#aaa', fontSize: 16 }}>⬇</span>
            </div>
          ))}
          <div onClick={() => showToast('Fonctionnalité : upload de justificatif')} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', gap: 12, cursor: 'pointer' }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: '#f5f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>⬆️</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#185FA5' }}>Ajouter un justificatif</div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Photo ou PDF acceptés</div>
            </div>
            <span style={{ color: '#aaa', fontSize: 16 }}>›</span>
          </div>
        </Card>

        <div style={{ marginTop: 14, marginBottom: 14 }}>
          <InfoCard>
            Ces informations alimentent ta mutuelle, la paie et le calcul de tes avantages familiaux. Toute modification est transmise au service RH sous 48 h.
          </InfoCard>
        </div>

        <button onClick={() => setModal(true)} style={{ width: '100%', padding: 14, background: 'none', color: '#0854A0', border: '0.5px dashed #185FA5', borderRadius: 12, fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}>
          + Ajouter une personne à charge
        </button>
        <div style={{ height: 16 }} />
      </div>

      {/* Modal ajout */}
      {modal && (
        <div style={{ background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', minHeight: 400 }}>
          <div style={{ background: '#fff', borderRadius: '20px 20px 0 0', padding: '20px 16px 24px', width: '100%' }}>
            <div style={{ width: 36, height: 4, background: '#e0e0e0', borderRadius: 2, margin: '0 auto 16px' }} />
            <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>Nouvelle personne à charge</div>
            {[
              { lbl: 'Lien de parenté', id: 'lien', type: 'select', opts: ['Conjoint(e)', 'Enfant', 'Enfant garde alternée', 'Parent', 'Autre'] },
              { lbl: 'Nom et prénom',   id: 'nom',  type: 'text',   placeholder: 'Ex : Sophie Martin' },
              { lbl: 'Date de naissance', id: 'ddn', type: 'date' },
              { lbl: 'Rattachement mutuelle', id: 'mutuelle', type: 'select', opts: ['Oui', 'Non'] },
            ].map(f => (
              <div key={f.id} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>{f.lbl}</label>
                {f.type === 'select'
                  ? <select value={form[f.id]} onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))}
                      style={{ width: '100%', fontSize: 14, color: '#1a1a1a', background: '#f5f5f3', border: '0.5px solid #ddd', borderRadius: 10, padding: '10px 12px', fontFamily: 'inherit' }}>
                      {f.opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                  : <input type={f.type} value={form[f.id]} onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))} placeholder={f.placeholder}
                      style={{ width: '100%', fontSize: 14, color: '#1a1a1a', background: '#f5f5f3', border: '0.5px solid #ddd', borderRadius: 10, padding: '10px 12px', fontFamily: 'inherit' }} />
                }
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={() => setModal(false)} style={{ flex: 1, padding: 12, background: 'none', border: '0.5px solid #ddd', borderRadius: 10, fontSize: 14, color: '#888', cursor: 'pointer', fontFamily: 'inherit' }}>Annuler</button>
              <button onClick={addPerson} style={{ flex: 2, padding: 12, background: '#0854A0', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
