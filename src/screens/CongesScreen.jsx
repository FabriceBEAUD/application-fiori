import { useState } from 'react'
import { Card, SectionLabel, StatusBadge, PrimaryButton, Toast, useToast } from '../components/UI.jsx'
import { EMPLOYE, DEMANDES_INIT, MONTHS, DAYS_SHORT } from '../data.js'

function countWorkdays(start, end) {
  if (!start || !end) return 0
  let n = 0, d = new Date(start)
  while (d <= end) { const dow = d.getDay(); if (dow !== 0 && dow !== 6) n++; d.setDate(d.getDate() + 1) }
  return n
}

function fmtTs(ts) {
  const d = new Date(ts)
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()].substring(0, 3)}. ${d.getFullYear()}`
}

export default function CongesScreen() {
  const [year, setYear]         = useState(2025)
  const [month, setMonth]       = useState(5)
  const [selStart, setSelStart] = useState(null)
  const [selEnd, setSelEnd]     = useState(null)
  const [type, setType]         = useState('Congés payés')
  const [comment, setComment]   = useState('')
  const [demandes, setDemandes] = useState(DEMANDES_INIT)
  const [toast, showToast]      = useToast()

  const changeMonth = (dir) => {
    let m = month + dir, y = year
    if (m < 0) { m = 11; y-- }
    if (m > 11) { m = 0; y++ }
    setMonth(m); setYear(y)
  }

  const dateTs = (d) => new Date(year, month, d).getTime()

  const handleDay = (d) => {
    const ts = dateTs(d)
    if (!selStart || selEnd || ts < selStart) { setSelStart(ts); setSelEnd(null) }
    else if (ts === selStart) { setSelStart(null); setSelEnd(null) }
    else setSelEnd(ts)
  }

  const nbJours = countWorkdays(selStart ? new Date(selStart) : null, selEnd ? new Date(selEnd) : null)

  const envoyer = () => {
    if (!selStart || !selEnd) { alert('Sélectionne une période.'); return }
    const s = new Date(selStart), e = new Date(selEnd)
    const label = `${String(s.getDate()).padStart(2, '0')} – ${String(e.getDate()).padStart(2, '0')} ${MONTHS[e.getMonth()].substring(0, 3)}. ${e.getFullYear()}`
    setDemandes(prev => [{ id: Date.now(), dates: label, type, jours: nbJours, depot: new Date().toLocaleDateString('fr-FR'), statut: 'En attente' }, ...prev])
    setSelStart(null); setSelEnd(null); setComment('')
    showToast(`Demande envoyée à ${EMPLOYE.manager}`)
  }

  // Build calendar cells
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDow    = (new Date(year, month, 1).getDay() + 6) % 7
  const prevDays    = new Date(year, month, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDow; i++) cells.push({ day: prevDays - firstDow + 1 + i, other: true })
  for (let d = 1; d <= daysInMonth; d++) {
    const ts = dateTs(d)
    const dow = (new Date(year, month, d).getDay() + 6) % 7
    cells.push({ day: d, ts, isStart: selStart === ts, isEnd: selEnd === ts, inRange: selStart && selEnd && ts > selStart && ts < selEnd, weekend: dow >= 5, today: year === 2025 && month === 5 && d === 3 })
  }
  const rem = cells.length % 7 === 0 ? 0 : 7 - (cells.length % 7)
  for (let i = 1; i <= rem; i++) cells.push({ day: i, other: true })

  return (
    <div style={{ background: '#f5f5f3', flex: 1, overflowY: 'auto' }}>
      {/* Soldes */}
      <div style={{ background: '#0854A0', padding: '0 16px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[{ val: EMPLOYE.soldeCP, lbl: 'Congés payés' }, { val: EMPLOYE.soldeRTT, lbl: 'RTT' }].map(h => (
            <div key={h.lbl} style={{ background: '#1068C5', borderRadius: 14, padding: 14 }}>
              <div style={{ color: '#fff', fontSize: 26, fontWeight: 500 }}>{h.val}</div>
              <div style={{ color: 'rgba(255,255,255,.75)', fontSize: 11, marginTop: 3 }}>{h.lbl}</div>
              <div style={{ color: 'rgba(255,255,255,.55)', fontSize: 10, marginTop: 2 }}>jours restants</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: 12 }}>
        <Toast msg={toast.msg} show={toast.show} />

        {/* Calendrier */}
        <SectionLabel first>Sélectionne tes dates</SectionLabel>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 10px' }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{MONTHS[month]} {year}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['←', '→'].map((a, i) => (
                <button key={a} onClick={() => changeMonth(i === 0 ? -1 : 1)}
                  style={{ background: 'none', border: '0.5px solid #ddd', borderRadius: 8, width: 28, height: 28, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', padding: '0 12px', gap: 2 }}>
            {DAYS_SHORT.map(d => <div key={d} style={{ textAlign: 'center', fontSize: 10, color: '#aaa', fontWeight: 500, padding: '4px 0' }}>{d}</div>)}
            {cells.map((c, i) => {
              let bg = 'transparent', color = c.other ? '#ccc' : c.weekend ? '#bbb' : '#1a1a1a', fw = 400
              if (c.isStart || c.isEnd) { bg = '#0854A0'; color = '#fff'; fw = 500 }
              else if (c.inRange) { bg = '#E6F1FB'; color = '#0C447C' }
              if (c.today && !c.isStart && !c.isEnd) { fw = 500; color = '#0854A0' }
              return (
                <div key={i} onClick={() => !c.other && handleDay(c.day)}
                  style={{ textAlign: 'center', fontSize: 12, padding: '6px 2px', borderRadius: 8, cursor: c.other ? 'default' : 'pointer', background: bg, color, fontWeight: fw, transition: 'background .1s', userSelect: 'none', position: 'relative' }}>
                  {c.day}
                  {c.today && !c.isStart && !c.isEnd && <span style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#0854A0', display: 'block' }} />}
                </div>
              )
            })}
          </div>
          <div style={{ padding: '10px 16px 14px', borderTop: '0.5px solid #f0f0f0', display: 'flex', gap: 16, alignItems: 'center' }}>
            {[{ lbl: 'Début', val: selStart ? fmtTs(selStart) : '—' }, { lbl: 'Fin', val: selEnd ? fmtTs(selEnd) : selStart ? 'Sélectionner…' : '—' }].map(s => (
              <div key={s.lbl} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '.05em' }}>{s.lbl}</div>
                <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }}>{s.val}</div>
              </div>
            ))}
            {selEnd && <div style={{ background: '#EAF3DE', color: '#3B6D11', borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap' }}>{nbJours} j. ouvrés</div>}
          </div>
        </Card>

        {/* Détails */}
        <SectionLabel>Détails</SectionLabel>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', padding: '13px 16px', gap: 12, borderBottom: '0.5px solid #f0f0f0' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏷</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: '#888' }}>Type de congé</div>
              <select value={type} onChange={e => setType(e.target.value)}
                style={{ fontSize: 13, background: 'none', border: 'none', outline: 'none', width: '100%', color: '#1a1a1a', cursor: 'pointer', fontFamily: 'inherit' }}>
                {['Congés payés', 'RTT', 'Congé sans solde', 'Récupération'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', padding: '13px 16px', gap: 12, borderBottom: '0.5px solid #f0f0f0' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#FAEEDA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>👤</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: '#888' }}>Approbateur</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{EMPLOYE.manager}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', padding: '13px 16px', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f5f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📝</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: '#888' }}>Commentaire (optionnel)</div>
              <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Ex : vacances en famille…"
                style={{ fontSize: 13, background: 'none', border: 'none', outline: 'none', width: '100%', color: '#1a1a1a', fontFamily: 'inherit' }} />
            </div>
          </div>
        </Card>

        {/* Historique */}
        <SectionLabel>Demandes en cours</SectionLabel>
        <Card>
          {demandes.map((d, i) => (
            <div key={d.id} style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', gap: 12, borderBottom: i < demandes.length - 1 ? '0.5px solid #f0f0f0' : 'none' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.statut === 'Approuvée' ? '#3B6D11' : d.statut === 'Refusée' ? '#A32D2D' : '#854F0B', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{d.dates}</div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{d.type} · {d.jours} jours · Déposée le {d.depot}</div>
              </div>
              <StatusBadge statut={d.statut} />
            </div>
          ))}
        </Card>

        <PrimaryButton onClick={envoyer}>✈ Envoyer la demande</PrimaryButton>
        <div style={{ height: 16 }} />
      </div>
    </div>
  )
}
