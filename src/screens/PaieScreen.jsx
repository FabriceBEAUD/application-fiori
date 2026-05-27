import { useState } from 'react'
import { Card, SectionLabel, Toast, useToast, InfoCard } from '../components/UI.jsx'
import { BULLETINS } from '../data.js'

const YEARS = ['2025', '2024', '2023', '2022']

export default function PaieScreen() {
  const [yearFilter, setYearFilter] = useState('2025')
  const [toast, showToast] = useToast()

  return (
    <div style={{ background: '#f5f5f3', flex: 1, overflowY: 'auto' }}>
      {/* Hero dernier bulletin */}
      <div style={{ background: '#0854A0', padding: '0 16px 20px' }}>
        <div style={{ background: '#1068C5', borderRadius: 16, padding: 16 }}>
          <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.05em' }}>Dernier salaire net</div>
          <div style={{ color: '#fff', fontSize: 28, fontWeight: 500, margin: '4px 0 2px' }}>{BULLETINS[0].net}</div>
          <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 12 }}>{BULLETINS[0].mois} · disponible depuis le 28/05</div>
        </div>
      </div>

      <div style={{ padding: 12 }}>
        <Toast msg={toast.msg} show={toast.show} />

        {/* Filtre années */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, overflowX: 'auto' }}>
          {YEARS.map(y => (
            <div key={y} onClick={() => setYearFilter(y)} style={{
              flexShrink: 0, padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500,
              border: '0.5px solid #ddd', cursor: 'pointer', transition: 'all .15s',
              background: yearFilter === y ? '#0854A0' : '#fff',
              color: yearFilter === y ? '#fff' : '#888',
            }}>{y}</div>
          ))}
        </div>

        {/* Liste bulletins */}
        <Card>
          {BULLETINS.map((b, i) => (
            <div key={b.mois} style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', gap: 12, borderBottom: i < BULLETINS.length - 1 ? '0.5px solid #f0f0f0' : 'none' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: '#EAF3DE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>📄</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{b.mois}</div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Disponible · PDF · {b.taille}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{b.net}</div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {b.nouveau && <span style={{ background: '#EAF3DE', color: '#3B6D11', borderRadius: 20, padding: '2px 8px', fontSize: 10, fontWeight: 500 }}>Nouveau</span>}
                  <button onClick={() => showToast(`Bulletin ${b.mois} téléchargé`)}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#E6F1FB', color: '#185FA5', border: 'none', borderRadius: 20, padding: '4px 10px', fontSize: 11, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                    ⬇ PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Card>

        <SectionLabel>À savoir</SectionLabel>
        <InfoCard>
          Les bulletins sont disponibles le dernier jour ouvré du mois. Ils sont conservés 5 ans. Pour toute question, contacte le service paie.
        </InfoCard>
        <div style={{ height: 16 }} />
      </div>
    </div>
  )
}
