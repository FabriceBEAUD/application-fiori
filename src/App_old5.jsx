import { useState, useEffect } from 'react'

const SAP = '#0854A0'
const SAP_D = '#1068C5'

// ── DATA ─────────────────────────────────────────────────────
const EMPLOYE = { nom: "Fabrice BEAUD'HUIN", initials: 'FB', matricule: '00045822', statut: 'CDI actif', email: 'f.beaudhuin@entreprise.fr', telephone: '+33 6 12 34 56 78', adresse: '12 rue du Moulin, 69003 Lyon', naissance: '14 mars 1988', poste: 'Responsable Supply Chain', departement: 'Opérations — Lyon Sud', manager: 'Julien LATOURES', contrat: 'CDI — temps plein', entree: '03 septembre 2018', soldeCP: 18, soldeRTT: 4.5 }
const BULLETINS = [{ mois: 'Mai 2025', net: '3 248,50 €', taille: '142 Ko', nouveau: true }, { mois: 'Avril 2025', net: '3 248,50 €', taille: '138 Ko', nouveau: false }, { mois: 'Mars 2025', net: '3 412,00 €', taille: '145 Ko', nouveau: false }, { mois: 'Février 2025', net: '3 248,50 €', taille: '139 Ko', nouveau: false }, { mois: 'Janvier 2025', net: '3 248,50 €', taille: '141 Ko', nouveau: false }]
const DEMANDES_INIT = [{ id: 1, dates: '14–18 juil. 2025', type: 'Congés payés', jours: 5, depot: '02/06', statut: 'En attente' }, { id: 2, dates: '24–25 avr. 2025', type: 'RTT', jours: 2, depot: '10/04', statut: 'Approuvée' }]
const PERSONS_INIT = [{ id: 1, nom: 'Clara Lefebvre', lien: 'Conjointe', ddn: '12/04/1989', ss: '2 89 04 69 …', mutuelle: true, initials: 'CL', bg: '#FBEAF0', color: '#993556' }, { id: 2, nom: 'Thomas Lefebvre', lien: 'Enfant · 8 ans', ddn: '03/09/2016', ss: '—', mutuelle: true, initials: 'TL', bg: '#EAF3DE', color: '#27500A' }]
const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const DAYS_SHORT = ['Lu','Ma','Me','Je','Ve','Sa','Di']
const PERSON_COLORS = [{ bg: '#E6F1FB', color: '#0C447C' }, { bg: '#FAEEDA', color: '#854F0B' }, { bg: '#FAECE7', color: '#993C1D' }, { bg: '#EEEDFE', color: '#3C3489' }]
const FRAIS_INIT = [{ id: 1, date: '15/05/2025', type: 'Repas client', montant: '45,00 €', statut: 'Remboursé', justif: true }, { id: 2, date: '08/05/2025', type: 'Transport', montant: '32,50 €', statut: 'En attente', justif: true }, { id: 3, date: '02/05/2025', type: 'Hébergement', montant: '120,00 €', statut: 'Validé', justif: true }]
const MESSAGES_INIT = [{ id: 1, de: 'Service RH', sujet: 'Confirmation mutuelle 2025', date: '28/05', lu: false, contenu: 'Votre adhésion à la mutuelle pour 2025 a bien été enregistrée. Les nouvelles garanties sont actives depuis le 1er janvier.' }, { id: 2, de: 'Paie', sujet: 'Bulletin mai disponible', date: '27/05', lu: true, contenu: 'Votre bulletin de salaire du mois de mai 2025 est disponible dans votre espace personnel.' }, { id: 3, de: 'Formation RH', sujet: 'Rappel : entretien annuel', date: '20/05', lu: true, contenu: 'Votre entretien annuel est planifié le 15 juin. Pensez à préparer votre bilan de compétences.' }]

// ── HELPERS ───────────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState({ show: false, msg: '' })
  const show = (msg) => { setToast({ show: true, msg }); setTimeout(() => setToast({ show: false, msg: '' }), 2500) }
  return [toast, show]
}
function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768)
  useEffect(() => { const h = () => setMobile(window.innerWidth < 768); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h) }, [])
  return mobile
}
function Toast({ msg, show }) {
  return <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#27500A', color: '#fff', borderRadius: 12, padding: '12px 20px', fontSize: 13, opacity: show ? 1 : 0, transition: 'opacity .3s', pointerEvents: 'none', zIndex: 9999, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 8 }}>{show && <><span>✓</span><span>{msg}</span></>}</div>
}
function SL({ children, first }) { return <div style={{ fontSize: 11, fontWeight: 500, color: '#aaa', letterSpacing: '.06em', textTransform: 'uppercase', margin: first ? '2px 0 6px 2px' : '20px 0 8px 2px' }}>{children}</div> }
function Card({ children, style }) { return <div style={{ background: '#fff', borderRadius: 14, border: '0.5px solid #e5e5e5', overflow: 'hidden', ...style }}>{children}</div> }
function Row({ icon, iconBg, iconColor, label, value, action, last }) { return <div style={{ display: 'flex', alignItems: 'center', padding: '13px 16px', gap: 12, borderBottom: last ? 'none' : '0.5px solid #f0f0f0' }}><div style={{ width: 32, height: 32, borderRadius: 8, background: iconBg || '#E6F1FB', color: iconColor || '#185FA5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>{icon}</div><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12, color: '#888' }}>{label}</div><div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div></div>{action && <span style={{ color: '#ccc', fontSize: 15 }}>{action}</span>}</div> }
function StatusBadge({ s }) { const m = { 'Approuvée': ['#EAF3DE','#3B6D11'], 'Refusée': ['#FCEBEB','#A32D2D'], 'En attente': ['#FAEEDA','#854F0B'], 'Remboursé': ['#EAF3DE','#3B6D11'], 'Validé': ['#E6F1FB','#185FA5'] }; const [bg, c] = m[s] || m['En attente']; return <span style={{ background: bg, color: c, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap' }}>{s}</span> }
function PBtn({ children, onClick, style }) { return <button onClick={onClick} style={{ padding: '12px 20px', background: SAP, color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', ...style }}>{children}</button> }

// ── DASHBOARD ─────────────────────────────────────────────────
function Dashboard({ setScreen }) {
  const kpis = [{ icon: '🏖', label: 'Congés restants', val: '18 j.', sub: 'CP · expire déc. 2025', color: '#E6F1FB', tc: '#185FA5' }, { icon: '⏱', label: 'RTT restants', val: '4,5 j.', sub: 'À poser avant juin', color: '#EAF3DE', tc: '#3B6D11' }, { icon: '📄', label: 'Dernier bulletin', val: '3 248 €', sub: 'Mai 2025 · disponible', color: '#FAEEDA', tc: '#854F0B' }, { icon: '👨‍👩‍👦', label: 'Personnes à charge', val: '2', sub: 'Mutuelle active', color: '#FBEAF0', tc: '#993556' }]
  const alerts = [{ icon: '🔔', msg: 'Bulletin mai 2025 disponible', action: 'paie', color: '#E6F1FB' }, { icon: '⚠️', msg: 'Solde RTT bas — 4,5 j. restants', action: 'conges', color: '#FAEEDA' }, { icon: '✉️', msg: '1 message non lu du service RH', action: 'messages', color: '#FBEAF0' }]
  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 500, color: '#1a1a1a' }}>Bonjour, Fabrice 👋</div>
        <div style={{ fontSize: 14, color: '#888', marginTop: 4 }}>Mercredi 28 mai 2025</div>
      </div>
      <SL first>Mes indicateurs</SL>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 8 }}>
        {kpis.map(k => (
          <div key={k.label} style={{ background: k.color, borderRadius: 14, padding: '16px 18px', cursor: 'pointer', border: `0.5px solid ${k.tc}22` }} onClick={() => setScreen(k.action || 'fiche')}>
            <div style={{ fontSize: 24 }}>{k.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 500, color: k.tc, marginTop: 8 }}>{k.val}</div>
            <div style={{ fontSize: 12, color: k.tc, marginTop: 2, opacity: .8 }}>{k.label}</div>
            <div style={{ fontSize: 11, color: k.tc, marginTop: 4, opacity: .6 }}>{k.sub}</div>
          </div>
        ))}
      </div>
      <SL>Alertes & notifications</SL>
      <Card>
        {alerts.map((a, i) => (
          <div key={i} onClick={() => setScreen(a.action)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: i < alerts.length - 1 ? '0.5px solid #f0f0f0' : 'none', cursor: 'pointer', background: 'transparent', transition: 'background .1s' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{a.icon}</div>
            <div style={{ flex: 1, fontSize: 14, color: '#1a1a1a' }}>{a.msg}</div>
            <span style={{ color: '#ccc', fontSize: 16 }}>›</span>
          </div>
        ))}
      </Card>
      <SL>Accès rapides</SL>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
        {[{ icon: '🏖', label: 'Poser des congés', s: 'conges' }, { icon: '🧾', label: 'Note de frais', s: 'frais' }, { icon: '📜', label: 'Attestation', s: 'attestations' }, { icon: '✉️', label: 'Messagerie RH', s: 'messages' }].map(b => (
          <div key={b.s} onClick={() => setScreen(b.s)} style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: 14, padding: '16px 14px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 24 }}>{b.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── FICHE ─────────────────────────────────────────────────────
function Fiche() {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ background: SAP, borderRadius: 16, padding: '20px 20px 24px', marginBottom: 24 }}>
        <div style={{ background: SAP_D, borderRadius: 14, padding: '18px 16px', display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 500, color: SAP, flexShrink: 0 }}>{EMPLOYE.initials}</div>
          <div style={{ color: '#fff' }}>
            <div style={{ fontSize: 18, fontWeight: 500 }}>{EMPLOYE.nom}</div>
            <div style={{ fontSize: 13, opacity: .8, marginTop: 3 }}>Matricule · {EMPLOYE.matricule}</div>
            <div style={{ marginTop: 8, background: 'rgba(255,255,255,.18)', borderRadius: 20, padding: '3px 12px', fontSize: 12, display: 'inline-block' }}>✓ {EMPLOYE.statut}</div>
          </div>
        </div>
      </div>
      <SL first>Informations personnelles</SL>
      <Card>
        <Row icon="👤" label="Nom complet" value={EMPLOYE.nom} />
        <Row icon="📅" label="Date de naissance" value={EMPLOYE.naissance} />
        <Row icon="✉️" label="Email professionnel" value={EMPLOYE.email} action="⧉" />
        <Row icon="📞" label="Téléphone" value={EMPLOYE.telephone} action="✏️" />
        <Row icon="📍" label="Adresse domicile" value={EMPLOYE.adresse} action="✏️" last />
      </Card>
      <SL>Poste & contrat</SL>
      <Card>
        <Row icon="💼" iconBg="#EAF3DE" iconColor="#3B6D11" label="Intitulé du poste" value={EMPLOYE.poste} />
        <Row icon="🏢" iconBg="#EAF3DE" iconColor="#3B6D11" label="Département" value={EMPLOYE.departement} />
        <Row icon="👤" iconBg="#EAF3DE" iconColor="#3B6D11" label="Manager" value={EMPLOYE.manager} />
        <Row icon="📋" iconBg="#FAEEDA" iconColor="#854F0B" label="Type de contrat" value={EMPLOYE.contrat} />
        <Row icon="📆" iconBg="#FAEEDA" iconColor="#854F0B" label="Date d'entrée" value={EMPLOYE.entree} last />
      </Card>
    </div>
  )
}

// ── CONGÉS ────────────────────────────────────────────────────
function Conges() {
  const [year, setYear] = useState(2025), [month, setMonth] = useState(5)
  const [selStart, setSelStart] = useState(null), [selEnd, setSelEnd] = useState(null)
  const [type, setType] = useState('Congés payés'), [comment, setComment] = useState('')
  const [demandes, setDemandes] = useState(DEMANDES_INIT)
  const [toast, showToast] = useToast()
  const chgMo = (d) => { let m = month + d, y = year; if (m < 0) { m = 11; y-- } if (m > 11) { m = 0; y++ } setMonth(m); setYear(y) }
  const dateTs = (d) => new Date(year, month, d).getTime()
  const handleDay = (d) => { const ts = dateTs(d); if (!selStart || selEnd || ts < selStart) { setSelStart(ts); setSelEnd(null) } else if (ts === selStart) { setSelStart(null); setSelEnd(null) } else setSelEnd(ts) }
  const countWD = (s, e) => { if (!s || !e) return 0; let n = 0, d = new Date(s); while (d <= e) { if (d.getDay() !== 0 && d.getDay() !== 6) n++; d.setDate(d.getDate() + 1) } return n }
  const fmtTs = (ts) => { const d = new Date(ts); return `${String(d.getDate()).padStart(2,'0')} ${MONTHS[d.getMonth()].substring(0,3)}. ${d.getFullYear()}` }
  const nb = countWD(selStart ? new Date(selStart) : null, selEnd ? new Date(selEnd) : null)
  const dim = new Date(year, month + 1, 0).getDate(), fDow = (new Date(year, month, 1).getDay() + 6) % 7, prev = new Date(year, month, 0).getDate()
  const cells = []
  for (let i = 0; i < fDow; i++) cells.push({ day: prev - fDow + 1 + i, other: true })
  for (let d = 1; d <= dim; d++) { const ts = dateTs(d), dow = (new Date(year, month, d).getDay() + 6) % 7; cells.push({ day: d, ts, isStart: selStart === ts, isEnd: selEnd === ts, inRange: selStart && selEnd && ts > selStart && ts < selEnd, weekend: dow >= 5, today: year === 2025 && month === 5 && d === 3 }) }
  const rem = cells.length % 7 === 0 ? 0 : 7 - (cells.length % 7)
  for (let i = 1; i <= rem; i++) cells.push({ day: i, other: true })
  const envoyer = () => {
    if (!selStart || !selEnd) { alert('Sélectionne une période.'); return }
    const s = new Date(selStart), e = new Date(selEnd)
    const label = `${String(s.getDate()).padStart(2,'0')}–${String(e.getDate()).padStart(2,'0')} ${MONTHS[e.getMonth()].substring(0,3)}. ${e.getFullYear()}`
    setDemandes(prev => [{ id: Date.now(), dates: label, type, jours: nb, depot: new Date().toLocaleDateString('fr-FR'), statut: 'En attente' }, ...prev])
    setSelStart(null); setSelEnd(null); setComment(''); showToast('Demande envoyée à ' + EMPLOYE.manager)
  }
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        {[{ val: EMPLOYE.soldeCP, lbl: 'Congés payés', sub: 'jours restants' }, { val: EMPLOYE.soldeRTT, lbl: 'RTT', sub: 'jours restants' }].map(h => (
          <div key={h.lbl} style={{ background: SAP_D, borderRadius: 14, padding: 18 }}>
            <div style={{ color: '#fff', fontSize: 28, fontWeight: 500 }}>{h.val}</div>
            <div style={{ color: 'rgba(255,255,255,.75)', fontSize: 12, marginTop: 4 }}>{h.lbl}</div>
            <div style={{ color: 'rgba(255,255,255,.55)', fontSize: 11, marginTop: 2 }}>{h.sub}</div>
          </div>
        ))}
      </div>
      <SL first>Sélectionne tes dates</SL>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 10px' }}>
          <div style={{ fontSize: 14, fontWeight: 500 }}>{MONTHS[month]} {year}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['←','→'].map((a,i) => <button key={a} onClick={() => chgMo(i===0?-1:1)} style={{ background:'none',border:'0.5px solid #ddd',borderRadius:8,width:28,height:28,cursor:'pointer',fontSize:14 }}>{a}</button>)}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', padding: '0 12px', gap: 2 }}>
          {DAYS_SHORT.map(d => <div key={d} style={{ textAlign:'center',fontSize:10,color:'#aaa',fontWeight:500,padding:'4px 0' }}>{d}</div>)}
          {cells.map((c,i) => { let bg='transparent',color=c.other?'#ccc':c.weekend?'#bbb':'#1a1a1a',fw=400; if(c.isStart||c.isEnd){bg=SAP;color='#fff';fw=500} else if(c.inRange){bg='#E6F1FB';color='#0C447C'} if(c.today&&!c.isStart&&!c.isEnd){fw=500;color=SAP} return <div key={i} onClick={()=>!c.other&&handleDay(c.day)} style={{ textAlign:'center',fontSize:12,padding:'6px 2px',borderRadius:8,cursor:c.other?'default':'pointer',background:bg,color,fontWeight:fw,userSelect:'none' }}>{c.day}</div> })}
        </div>
        <div style={{ padding:'10px 16px 14px',borderTop:'0.5px solid #f0f0f0',display:'flex',gap:16,alignItems:'center' }}>
          {[{lbl:'Début',val:selStart?fmtTs(selStart):'—'},{lbl:'Fin',val:selEnd?fmtTs(selEnd):selStart?'Sélectionner…':'—'}].map(s=><div key={s.lbl} style={{flex:1,textAlign:'center'}}><div style={{fontSize:10,color:'#aaa',textTransform:'uppercase',letterSpacing:'.05em'}}>{s.lbl}</div><div style={{fontSize:13,fontWeight:500,marginTop:2}}>{s.val}</div></div>)}
          {selEnd&&<div style={{background:'#EAF3DE',color:'#3B6D11',borderRadius:20,padding:'5px 14px',fontSize:12,fontWeight:500,whiteSpace:'nowrap'}}>{nb} j. ouvrés</div>}
        </div>
      </Card>
      <SL>Détails de la demande</SL>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display:'flex',alignItems:'center',padding:'13px 16px',gap:12,borderBottom:'0.5px solid #f0f0f0' }}>
          <div style={{ width:32,height:32,borderRadius:8,background:'#E6F1FB',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16 }}>🏷</div>
          <div style={{ flex:1 }}><div style={{ fontSize:12,color:'#888' }}>Type de congé</div><select value={type} onChange={e=>setType(e.target.value)} style={{ fontSize:13,background:'none',border:'none',outline:'none',width:'100%',color:'#1a1a1a',cursor:'pointer',fontFamily:'inherit' }}>{['Congés payés','RTT','Congé sans solde','Récupération'].map(o=><option key={o}>{o}</option>)}</select></div>
        </div>
        <div style={{ display:'flex',alignItems:'center',padding:'13px 16px',gap:12,borderBottom:'0.5px solid #f0f0f0' }}>
          <div style={{ width:32,height:32,borderRadius:8,background:'#FAEEDA',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16 }}>👤</div>
          <div style={{ flex:1 }}><div style={{ fontSize:12,color:'#888' }}>Approbateur</div><div style={{ fontSize:14,fontWeight:500 }}>{EMPLOYE.manager}</div></div>
        </div>
        <div style={{ display:'flex',alignItems:'center',padding:'13px 16px',gap:12 }}>
          <div style={{ width:32,height:32,borderRadius:8,background:'#f5f5f3',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16 }}>📝</div>
          <div style={{ flex:1 }}><div style={{ fontSize:12,color:'#888' }}>Commentaire</div><input value={comment} onChange={e=>setComment(e.target.value)} placeholder="Ex : vacances en famille…" style={{ fontSize:13,background:'none',border:'none',outline:'none',width:'100%',fontFamily:'inherit' }}/></div>
        </div>
      </Card>
      <PBtn onClick={envoyer} style={{ width:'100%',marginBottom:24 }}>✈ Envoyer la demande</PBtn>
      <SL>Historique des demandes</SL>
      <Card>
        {demandes.map((d,i)=>(
          <div key={d.id} style={{ display:'flex',alignItems:'center',padding:'14px 16px',gap:12,borderBottom:i<demandes.length-1?'0.5px solid #f0f0f0':'none' }}>
            <div style={{ width:8,height:8,borderRadius:'50%',background:d.statut==='Approuvée'?'#3B6D11':d.statut==='Refusée'?'#A32D2D':'#854F0B',flexShrink:0 }}/>
            <div style={{ flex:1 }}><div style={{ fontSize:13,fontWeight:500 }}>{d.dates}</div><div style={{ fontSize:11,color:'#888',marginTop:2 }}>{d.type} · {d.jours}j · Déposée le {d.depot}</div></div>
            <StatusBadge s={d.statut}/>
          </div>
        ))}
      </Card>
      <Toast msg={toast.msg} show={toast.show}/>
    </div>
  )
}

// ── PAIE ─────────────────────────────────────────────────────
function Paie() {
  const [yf, setYf] = useState('2025')
  const [toast, showToast] = useToast()
  return (
    <div style={{ padding: 24 }}>
      <div style={{ background: SAP_D, borderRadius: 16, padding: 20, marginBottom: 24 }}>
        <div style={{ color:'rgba(255,255,255,.7)',fontSize:11,fontWeight:500,textTransform:'uppercase',letterSpacing:'.05em' }}>Dernier salaire net</div>
        <div style={{ color:'#fff',fontSize:32,fontWeight:500,margin:'6px 0 4px' }}>{BULLETINS[0].net}</div>
        <div style={{ color:'rgba(255,255,255,.7)',fontSize:13 }}>{BULLETINS[0].mois} · disponible depuis le 28/05</div>
      </div>
      <div style={{ display:'flex',gap:8,marginBottom:16 }}>
        {['2025','2024','2023','2022'].map(y=><div key={y} onClick={()=>setYf(y)} style={{ padding:'5px 14px',borderRadius:20,fontSize:12,fontWeight:500,border:'0.5px solid #ddd',cursor:'pointer',background:yf===y?SAP:'#fff',color:yf===y?'#fff':'#888' }}>{y}</div>)}
      </div>
      <Card>
        {BULLETINS.map((b,i)=>(
          <div key={b.mois} style={{ display:'flex',alignItems:'center',padding:'14px 16px',gap:12,borderBottom:i<BULLETINS.length-1?'0.5px solid #f0f0f0':'none' }}>
            <div style={{ width:38,height:38,borderRadius:10,background:'#EAF3DE',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0 }}>📄</div>
            <div style={{ flex:1 }}><div style={{ fontSize:14,fontWeight:500 }}>{b.mois}</div><div style={{ fontSize:12,color:'#888',marginTop:2 }}>PDF · {b.taille}</div></div>
            <div style={{ display:'flex',flexDirection:'column',alignItems:'flex-end',gap:5 }}>
              <div style={{ fontSize:14,fontWeight:500 }}>{b.net}</div>
              <div style={{ display:'flex',gap:6,alignItems:'center' }}>
                {b.nouveau&&<span style={{ background:'#EAF3DE',color:'#3B6D11',borderRadius:20,padding:'2px 8px',fontSize:10,fontWeight:500 }}>Nouveau</span>}
                <button onClick={()=>showToast(`Bulletin ${b.mois} téléchargé`)} style={{ background:'#E6F1FB',color:'#185FA5',border:'none',borderRadius:20,padding:'4px 10px',fontSize:11,fontWeight:500,cursor:'pointer',fontFamily:'inherit' }}>⬇ PDF</button>
              </div>
            </div>
          </div>
        ))}
      </Card>
      <Toast msg={toast.msg} show={toast.show}/>
    </div>
  )
}

// ── ATTESTATIONS ──────────────────────────────────────────────
function Attestations() {
  const [modal, setModal] = useState(null)
  const [sent, setSent] = useState([])
  const [toast, showToast] = useToast()
  const types = [{ icon:"📋", title:"Attestation employeur", desc:"Certifie votre contrat de travail actif", delay:"24h" }, { icon:"💰", title:"Attestation de salaire", desc:"Indique votre remuneration mensuelle brute/nette", delay:"48h" }, { icon:"🏠", title:"Attestation pour logement", desc:"Pour dossier locatif ou pret immobilier", delay:"48h" }, { icon:"🎓", title:"Certificat de travail", desc:"En cas de depart de entreprise", delay:"72h" }]
  const envoyer = () => { setSent(prev => [{ id: Date.now(), type: modal.title, date: new Date().toLocaleDateString('fr-FR'), statut: 'En cours' }, ...prev]); setModal(null); showToast('Demande envoyée — réponse sous ' + modal.delay) }
  return (
    <div style={{ padding: 24 }}>
      <div style={{ fontSize: 14, color: '#666', marginBottom: 20, lineHeight: 1.6, background: '#E6F1FB', borderRadius: 12, padding: '12px 16px' }}>
        ℹ️ Les attestations sont générées par le service RH et envoyées par email sous 24 à 72h selon le type.
      </div>
      <SL first>Choisir un type d'attestation</SL>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        {types.map(t => (
          <div key={t.title} onClick={() => setModal(t)} style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: 14, padding: '18px 16px', cursor: 'pointer', transition: 'border-color .15s' }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{t.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{t.title}</div>
            <div style={{ fontSize: 12, color: '#888', lineHeight: 1.4, marginBottom: 10 }}>{t.desc}</div>
            <div style={{ fontSize: 11, color: '#3B6D11', background: '#EAF3DE', borderRadius: 20, padding: '2px 10px', display: 'inline-block' }}>⏱ {t.delay}</div>
          </div>
        ))}
      </div>
      {sent.length > 0 && <>
        <SL>Mes demandes en cours</SL>
        <Card>
          {sent.map((s,i) => (
            <div key={s.id} style={{ display:'flex',alignItems:'center',padding:'14px 16px',gap:12,borderBottom:i<sent.length-1?'0.5px solid #f0f0f0':'none' }}>
              <div style={{ fontSize:20 }}>📋</div>
              <div style={{ flex:1 }}><div style={{ fontSize:13,fontWeight:500 }}>{s.type}</div><div style={{ fontSize:11,color:'#888',marginTop:2 }}>Demandée le {s.date}</div></div>
              <StatusBadge s={s.statut}/>
            </div>
          ))}
        </Card>
      </>}
      {modal && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.45)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20 }}>
          <div style={{ background:'#fff',borderRadius:20,padding:28,maxWidth:400,width:'100%' }}>
            <div style={{ fontSize:32,marginBottom:12 }}>{modal.icon}</div>
            <div style={{ fontSize:18,fontWeight:500,marginBottom:8 }}>{modal.title}</div>
            <div style={{ fontSize:13,color:'#666',marginBottom:20,lineHeight:1.5 }}>{modal.desc}<br/><span style={{ color:'#3B6D11',fontWeight:500 }}>Délai : {modal.delay}</span></div>
            <div style={{ fontSize:12,color:'#888',marginBottom:8 }}>Adresse email de réception</div>
            <input defaultValue={EMPLOYE.email} style={{ width:'100%',padding:'10px 12px',border:'0.5px solid #ddd',borderRadius:10,fontSize:13,marginBottom:20,fontFamily:'inherit' }}/>
            <div style={{ display:'flex',gap:10 }}>
              <button onClick={()=>setModal(null)} style={{ flex:1,padding:12,background:'none',border:'0.5px solid #ddd',borderRadius:10,fontSize:14,cursor:'pointer',fontFamily:'inherit' }}>Annuler</button>
              <button onClick={envoyer} style={{ flex:2,padding:12,background:SAP,color:'#fff',border:'none',borderRadius:10,fontSize:14,fontWeight:500,cursor:'pointer',fontFamily:'inherit' }}>Envoyer la demande</button>
            </div>
          </div>
        </div>
      )}
      <Toast msg={toast.msg} show={toast.show}/>
    </div>
  )
}

// ── NOTES DE FRAIS ────────────────────────────────────────────
function Frais() {
  const [frais, setFrais] = useState(FRAIS_INIT)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ date:'', type:'Repas client', montant:'', desc:'' })
  const [toast, showToast] = useToast()
  const total = frais.filter(f=>f.statut!=='Remboursé').length
  const types = ['Repas client','Transport','Hébergement','Matériel','Autre']
  const ajouter = () => {
    if (!form.montant) { alert('Saisis un montant.'); return }
    setFrais(prev => [{ id: Date.now(), date: form.date || new Date().toLocaleDateString('fr-FR'), type: form.type, montant: form.montant + ' €', statut: 'En attente', justif: false }, ...prev])
    setForm({ date:'', type:'Repas client', montant:'', desc:'' }); setModal(false); showToast('Note de frais soumise')
  }
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:12,marginBottom:24 }}>
        {[{ val: frais.length, lbl:'Total soumises', bg:'#E6F1FB', tc:'#185FA5' }, { val: frais.filter(f=>f.statut==='En attente').length, lbl:'En attente', bg:'#FAEEDA', tc:'#854F0B' }, { val: frais.filter(f=>f.statut==='Remboursé').length, lbl:'Remboursées', bg:'#EAF3DE', tc:'#3B6D11' }].map(k=>(
          <div key={k.lbl} style={{ background:k.bg,borderRadius:14,padding:'16px 18px' }}>
            <div style={{ fontSize:26,fontWeight:500,color:k.tc }}>{k.val}</div>
            <div style={{ fontSize:12,color:k.tc,marginTop:4,opacity:.8 }}>{k.lbl}</div>
          </div>
        ))}
      </div>
      <Card style={{ marginBottom: 16 }}>
        {frais.map((f,i)=>(
          <div key={f.id} style={{ display:'flex',alignItems:'center',padding:'14px 16px',gap:12,borderBottom:i<frais.length-1?'0.5px solid #f0f0f0':'none' }}>
            <div style={{ width:36,height:36,borderRadius:10,background:'#E6F1FB',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0 }}>🧾</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13,fontWeight:500 }}>{f.type}</div>
              <div style={{ fontSize:11,color:'#888',marginTop:2 }}>{f.date} · {f.justif?'Justificatif joint':'Sans justificatif'}</div>
            </div>
            <div style={{ display:'flex',flexDirection:'column',alignItems:'flex-end',gap:5 }}>
              <div style={{ fontSize:14,fontWeight:500 }}>{f.montant}</div>
              <StatusBadge s={f.statut}/>
            </div>
          </div>
        ))}
      </Card>
      <PBtn onClick={()=>setModal(true)} style={{ width:'100%' }}>+ Nouvelle note de frais</PBtn>
      {modal && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.45)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20 }}>
          <div style={{ background:'#fff',borderRadius:20,padding:28,maxWidth:420,width:'100%' }}>
            <div style={{ fontSize:18,fontWeight:500,marginBottom:20 }}>Nouvelle note de frais</div>
            {[{ lbl:'Type de dépense', id:'type', type:'select' }, { lbl:'Date de la dépense', id:'date', type:'date' }, { lbl:'Montant (€)', id:'montant', type:'number', placeholder:'Ex : 45.50' }, { lbl:'Description', id:'desc', type:'text', placeholder:'Ex : Déjeuner avec client Renault' }].map(f=>(
              <div key={f.id} style={{ marginBottom:14 }}>
                <label style={{ fontSize:12,color:'#888',display:'block',marginBottom:4 }}>{f.lbl}</label>
                {f.type==='select'
                  ? <select value={form[f.id]} onChange={e=>setForm(p=>({...p,[f.id]:e.target.value}))} style={{ width:'100%',fontSize:14,background:'#f5f5f3',border:'0.5px solid #ddd',borderRadius:10,padding:'10px 12px',fontFamily:'inherit' }}>{types.map(o=><option key={o}>{o}</option>)}</select>
                  : <input type={f.type} value={form[f.id]} onChange={e=>setForm(p=>({...p,[f.id]:e.target.value}))} placeholder={f.placeholder} style={{ width:'100%',fontSize:14,background:'#f5f5f3',border:'0.5px solid #ddd',borderRadius:10,padding:'10px 12px',fontFamily:'inherit' }}/>
                }
              </div>
            ))}
            <div style={{ border:'1.5px dashed #ddd',borderRadius:10,padding:'16px',textAlign:'center',marginBottom:20,cursor:'pointer',color:'#888',fontSize:13 }}>📎 Cliquer pour joindre un justificatif</div>
            <div style={{ display:'flex',gap:10 }}>
              <button onClick={()=>setModal(false)} style={{ flex:1,padding:12,background:'none',border:'0.5px solid #ddd',borderRadius:10,fontSize:14,cursor:'pointer',fontFamily:'inherit' }}>Annuler</button>
              <button onClick={ajouter} style={{ flex:2,padding:12,background:SAP,color:'#fff',border:'none',borderRadius:10,fontSize:14,fontWeight:500,cursor:'pointer',fontFamily:'inherit' }}>Soumettre</button>
            </div>
          </div>
        </div>
      )}
      <Toast msg={toast.msg} show={toast.show}/>
    </div>
  )
}

// ── MESSAGERIE ────────────────────────────────────────────────
function Messages() {
  const [messages, setMessages] = useState(MESSAGES_INIT)
  const [selected, setSelected] = useState(null)
  const [compose, setCompose] = useState(false)
  const [newMsg, setNewMsg] = useState({ sujet:'', corps:'' })
  const [toast, showToast] = useToast()
  const nonLus = messages.filter(m=>!m.lu).length
  const ouvrir = (m) => { setMessages(prev=>prev.map(msg=>msg.id===m.id?{...msg,lu:true}:msg)); setSelected(m) }
  const envoyer = () => { if(!newMsg.corps) return; showToast('Message envoyé au service RH'); setCompose(false); setNewMsg({sujet:'',corps:''}) }
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20 }}>
        <div style={{ display:'flex',gap:8,alignItems:'center' }}>
          <div style={{ fontSize:16,fontWeight:500 }}>Messagerie RH</div>
          {nonLus>0&&<span style={{ background:'#0854A0',color:'#fff',borderRadius:20,padding:'2px 8px',fontSize:11,fontWeight:500 }}>{nonLus}</span>}
        </div>
        <PBtn onClick={()=>setCompose(true)}>✏️ Nouveau message</PBtn>
      </div>
      {selected ? (
        <div>
          <button onClick={()=>setSelected(null)} style={{ background:'none',border:'none',cursor:'pointer',color:SAP,fontSize:14,marginBottom:16,padding:0,fontFamily:'inherit',display:'flex',alignItems:'center',gap:4 }}>← Retour</button>
          <Card style={{ padding:24 }}>
            <div style={{ fontSize:16,fontWeight:500,marginBottom:8 }}>{selected.sujet}</div>
            <div style={{ fontSize:12,color:'#888',marginBottom:20 }}>De : {selected.de} · {selected.date}</div>
            <div style={{ fontSize:14,color:'#333',lineHeight:1.7 }}>{selected.contenu}</div>
            <div style={{ marginTop:24,paddingTop:20,borderTop:'0.5px solid #f0f0f0' }}>
              <div style={{ fontSize:12,color:'#888',marginBottom:8 }}>Répondre</div>
              <textarea placeholder="Votre réponse…" rows={4} style={{ width:'100%',padding:'10px 12px',border:'0.5px solid #ddd',borderRadius:10,fontSize:13,fontFamily:'inherit',resize:'vertical' }}/>
              <PBtn style={{ marginTop:12 }} onClick={()=>{ showToast('Réponse envoyée'); setSelected(null) }}>Envoyer la réponse</PBtn>
            </div>
          </Card>
        </div>
      ) : (
        <Card>
          {messages.map((m,i)=>(
            <div key={m.id} onClick={()=>ouvrir(m)} style={{ display:'flex',alignItems:'center',padding:'14px 16px',gap:12,borderBottom:i<messages.length-1?'0.5px solid #f0f0f0':'none',cursor:'pointer',background:m.lu?'transparent':'#F0F6FF' }}>
              <div style={{ width:38,height:38,borderRadius:'50%',background:m.lu?'#f5f5f3':'#E6F1FB',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0 }}>👤</div>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                  <div style={{ fontSize:13,fontWeight:m.lu?400:600,color:'#1a1a1a' }}>{m.de}</div>
                  <div style={{ fontSize:11,color:'#aaa' }}>{m.date}</div>
                </div>
                <div style={{ fontSize:13,color:m.lu?'#888':'#1a1a1a',fontWeight:m.lu?400:500,marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{m.sujet}</div>
              </div>
              {!m.lu&&<div style={{ width:8,height:8,borderRadius:'50%',background:SAP,flexShrink:0 }}/>}
            </div>
          ))}
        </Card>
      )}
      {compose && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.45)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20 }}>
          <div style={{ background:'#fff',borderRadius:20,padding:28,maxWidth:480,width:'100%' }}>
            <div style={{ fontSize:18,fontWeight:500,marginBottom:20 }}>Nouveau message</div>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12,color:'#888',display:'block',marginBottom:4 }}>Destinataire</label>
              <select style={{ width:'100%',fontSize:14,background:'#f5f5f3',border:'0.5px solid #ddd',borderRadius:10,padding:'10px 12px',fontFamily:'inherit' }}>
                <option>Service RH</option><option>Service Paie</option><option>Formation</option><option>Manager — {EMPLOYE.manager}</option>
              </select>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12,color:'#888',display:'block',marginBottom:4 }}>Sujet</label>
              <input value={newMsg.sujet} onChange={e=>setNewMsg(p=>({...p,sujet:e.target.value}))} placeholder="Ex : Question sur ma mutuelle" style={{ width:'100%',fontSize:14,background:'#f5f5f3',border:'0.5px solid #ddd',borderRadius:10,padding:'10px 12px',fontFamily:'inherit' }}/>
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:12,color:'#888',display:'block',marginBottom:4 }}>Message</label>
              <textarea value={newMsg.corps} onChange={e=>setNewMsg(p=>({...p,corps:e.target.value}))} placeholder="Votre message…" rows={5} style={{ width:'100%',fontSize:14,background:'#f5f5f3',border:'0.5px solid #ddd',borderRadius:10,padding:'10px 12px',fontFamily:'inherit',resize:'vertical' }}/>
            </div>
            <div style={{ display:'flex',gap:10 }}>
              <button onClick={()=>setCompose(false)} style={{ flex:1,padding:12,background:'none',border:'0.5px solid #ddd',borderRadius:10,fontSize:14,cursor:'pointer',fontFamily:'inherit' }}>Annuler</button>
              <button onClick={envoyer} style={{ flex:2,padding:12,background:SAP,color:'#fff',border:'none',borderRadius:10,fontSize:14,fontWeight:500,cursor:'pointer',fontFamily:'inherit' }}>Envoyer</button>
            </div>
          </div>
        </div>
      )}
      <Toast msg={toast.msg} show={toast.show}/>
    </div>
  )
}

// ── FAMILLE ───────────────────────────────────────────────────
function Famille() {
  const [persons, setPersons] = useState(PERSONS_INIT)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ nom:'', lien:'Conjoint(e)', ddn:'', mutuelle:'Oui' })
  const [toast, showToast] = useToast()
  const del = (id, nom) => { setPersons(p=>p.filter(x=>x.id!==id)); showToast(nom+' supprimé(e)') }
  const add = () => {
    if(!form.nom.trim()){alert('Saisis un nom.');return}
    const initials=form.nom.trim().split(' ').map(w=>w[0]||'').join('').substring(0,2).toUpperCase()
    const c=PERSON_COLORS[persons.length%PERSON_COLORS.length]
    setPersons(p=>[...p,{id:Date.now(),nom:form.nom,lien:form.lien,ddn:form.ddn?new Date(form.ddn).toLocaleDateString('fr-FR'):'—',ss:'—',mutuelle:form.mutuelle==='Oui',initials,...c}])
    setForm({nom:'',lien:'Conjoint(e)',ddn:'',mutuelle:'Oui'}); setModal(false); showToast(form.nom+' ajouté(e)')
  }
  return (
    <div style={{ padding:24 }}>
      <div style={{ background:SAP_D,borderRadius:16,padding:'16px 20px',marginBottom:24,display:'flex',justifyContent:'space-between',alignItems:'center' }}>
        <div><div style={{ color:'#fff',fontSize:24,fontWeight:500 }}>{persons.length} personne{persons.length>1?'s':''}</div><div style={{ color:'rgba(255,255,255,.7)',fontSize:12,marginTop:2 }}>déclarées à charge</div></div>
        <div style={{ display:'flex',flexDirection:'column',gap:6 }}>
          <span style={{ background:'rgba(255,255,255,.18)',color:'#fff',borderRadius:20,padding:'4px 12px',fontSize:11,fontWeight:500 }}>❤ {persons.filter(p=>p.lien.toLowerCase().includes('conjoint')).length} conjoint</span>
          <span style={{ background:'rgba(255,255,255,.18)',color:'#fff',borderRadius:20,padding:'4px 12px',fontSize:11,fontWeight:500 }}>👶 {persons.filter(p=>p.lien.toLowerCase().includes('enfant')).length} enfant</span>
        </div>
      </div>
      {persons.map(p=>(
        <div key={p.id} style={{ background:'#fff',borderRadius:14,border:'0.5px solid #e5e5e5',padding:'16px',marginBottom:12 }}>
          <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:12 }}>
            <div style={{ width:42,height:42,borderRadius:'50%',background:p.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:500,color:p.color,flexShrink:0 }}>{p.initials}</div>
            <div style={{ flex:1 }}><div style={{ fontSize:15,fontWeight:500 }}>{p.nom}</div><div style={{ fontSize:12,color:'#888',marginTop:2 }}>{p.lien}</div></div>
            <div style={{ display:'flex',gap:6 }}>
              <button style={{ width:32,height:32,borderRadius:8,border:'0.5px solid #ddd',background:'none',cursor:'pointer',fontSize:15 }}>✏️</button>
              <button onClick={()=>del(p.id,p.nom)} style={{ width:32,height:32,borderRadius:8,border:'0.5px solid #ddd',background:'none',cursor:'pointer',fontSize:15 }}>🗑</button>
            </div>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:8 }}>
            {[{lbl:'Date de naissance',val:p.ddn},{lbl:'N° SS',val:p.ss},{lbl:'Mutuelle',val:p.mutuelle?'Rattachée · ayant droit':'Non rattachée',color:p.mutuelle?'#3B6D11':'#A32D2D',full:true}].map(f=>(
              <div key={f.lbl} style={{ background:'#f7f7f5',borderRadius:10,padding:'9px 12px',gridColumn:f.full?'1/-1':undefined }}>
                <div style={{ fontSize:10,color:'#aaa',textTransform:'uppercase',letterSpacing:'.04em' }}>{f.lbl}</div>
                <div style={{ fontSize:13,fontWeight:500,color:f.color||'#1a1a1a',marginTop:2 }}>{f.val}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <button onClick={()=>setModal(true)} style={{ width:'100%',padding:14,background:'none',color:SAP,border:'0.5px dashed #185FA5',borderRadius:12,fontSize:14,fontWeight:500,cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}>+ Ajouter une personne à charge</button>
      {modal&&(
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.45)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20 }}>
          <div style={{ background:'#fff',borderRadius:20,padding:28,maxWidth:400,width:'100%' }}>
            <div style={{ fontSize:18,fontWeight:500,marginBottom:20 }}>Nouvelle personne à charge</div>
            {[{lbl:'Lien de parenté',id:'lien',type:'select',opts:['Conjoint(e)','Enfant','Enfant garde alternée','Parent','Autre']},{lbl:'Nom et prénom',id:'nom',type:'text',placeholder:'Ex : Sophie Martin'},{lbl:'Date de naissance',id:'ddn',type:'date'},{lbl:'Rattachement mutuelle',id:'mutuelle',type:'select',opts:['Oui','Non']}].map(f=>(
              <div key={f.id} style={{ marginBottom:12 }}>
                <label style={{ fontSize:12,color:'#888',display:'block',marginBottom:4 }}>{f.lbl}</label>
                {f.type==='select'?<select value={form[f.id]} onChange={e=>setForm(p=>({...p,[f.id]:e.target.value}))} style={{ width:'100%',fontSize:14,background:'#f5f5f3',border:'0.5px solid #ddd',borderRadius:10,padding:'10px 12px',fontFamily:'inherit' }}>{f.opts.map(o=><option key={o}>{o}</option>)}</select>:<input type={f.type} value={form[f.id]} onChange={e=>setForm(p=>({...p,[f.id]:e.target.value}))} placeholder={f.placeholder} style={{ width:'100%',fontSize:14,background:'#f5f5f3',border:'0.5px solid #ddd',borderRadius:10,padding:'10px 12px',fontFamily:'inherit' }}/>}
              </div>
            ))}
            <div style={{ display:'flex',gap:10,marginTop:8 }}>
              <button onClick={()=>setModal(false)} style={{ flex:1,padding:12,background:'none',border:'0.5px solid #ddd',borderRadius:10,fontSize:14,cursor:'pointer',fontFamily:'inherit' }}>Annuler</button>
              <button onClick={add} style={{ flex:2,padding:12,background:SAP,color:'#fff',border:'none',borderRadius:10,fontSize:14,fontWeight:500,cursor:'pointer',fontFamily:'inherit' }}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
      <Toast msg={toast.msg} show={toast.show}/>
    </div>
  )
}

// ── APP PRINCIPALE ────────────────────────────────────────────
const NAV_ITEMS = [
  { id:'dashboard', icon:'🏠', label:'Tableau de bord' },
  { id:'fiche',     icon:'👤', label:'Ma fiche' },
  { id:'conges',    icon:'🏖', label:'Congés' },
  { id:'paie',      icon:'📄', label:'Bulletins' },
  { id:'famille',   icon:'👨‍👩‍👦', label:'Famille' },
  { id:'attestations', icon:'📋', label:'Attestations' },
  { id:'frais',     icon:'🧾', label:'Notes de frais' },
  { id:'messages',  icon:'✉️', label:'Messagerie' },
]
const TITLES = { dashboard:'Tableau de bord', fiche:'Ma fiche RH', conges:'Congés', paie:'Bulletins de paie', famille:'Famille', attestations:'Attestations', frais:'Notes de frais', messages:'Messagerie RH' }


// ── CHATBOT RH ────────────────────────────────────────────────
function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Bonjour Fabrice ! Je suis votre assistant RH. Je peux vous aider sur vos congés, bulletins, attestations, notes de frais ou toute question RH. Comment puis-je vous aider ?" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useState(null)

  const CONTEXT = `Tu es un assistant RH virtuel pour l'entreprise. Tu aides l'employé Fabrice BEAUD'HUIN (matricule 00045822, Responsable Supply Chain, département Opérations Lyon Sud, manager Julien LATOURES, CDI depuis le 03/09/2018).
Données actuelles : 18 jours de congés payés restants, 4.5 jours de RTT restants, dernier salaire net 3248.50 EUR (mai 2025), 2 personnes à charge (conjoint + 1 enfant), mutuelle active.
Réponds toujours en français, de façon concise et professionnelle. Tu peux aider sur : soldes de congés, bulletins de paie, attestations, notes de frais, mutuelle, contrat, procédures RH. Si tu ne sais pas, oriente vers le service RH (service.rh@entreprise.fr).`

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user', content: input }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: CONTEXT,
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      })
      const data = await res.json()
      const reply = data.content?.[0]?.text || "Désolé, je n'ai pas pu répondre. Contactez le service RH."
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Une erreur est survenue. Veuillez réessayer ou contacter le service RH." }])
    }
    setLoading(false)
  }

  const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  const suggestions = ["Combien de congés il me reste ?", "Comment demander une attestation ?", "Quand est mon prochain bulletin ?"]

  return (
    <>
      {/* Bouton flottant */}
      <div onClick={() => setOpen(!open)} style={{ position:'fixed', bottom:24, right:24, width:56, height:56, borderRadius:'50%', background:'#0854A0', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', zIndex:1000, boxShadow:'0 4px 16px rgba(8,84,160,.35)', fontSize:24, transition:'transform .2s', transform:open?'rotate(45deg)':'rotate(0)' }}>
        {open ? '✕' : '💬'}
      </div>

      {/* Fenêtre chat */}
      {open && (
        <div style={{ position:'fixed', bottom:92, right:24, width:360, height:520, background:'#fff', borderRadius:20, border:'0.5px solid #e5e5e5', display:'flex', flexDirection:'column', zIndex:999, overflow:'hidden', boxShadow:'0 8px 32px rgba(0,0,0,.12)' }}>

          {/* Header */}
          <div style={{ background:'#0854A0', padding:'14px 16px', display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:'rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🤖</div>
            <div>
              <div style={{ color:'#fff', fontSize:14, fontWeight:500 }}>Assistant RH</div>
              <div style={{ color:'rgba(255,255,255,.7)', fontSize:11 }}>Disponible 24h/24</div>
            </div>
            <div style={{ marginLeft:'auto', width:8, height:8, borderRadius:'50%', background:'#4ade80' }}/>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:'auto', padding:'12px 14px', display:'flex', flexDirection:'column', gap:10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display:'flex', justifyContent:m.role==='user'?'flex-end':'flex-start' }}>
                <div style={{ maxWidth:'80%', padding:'10px 14px', borderRadius:m.role==='user'?'16px 16px 4px 16px':'16px 16px 16px 4px', background:m.role==='user'?'#0854A0':'#f5f5f3', color:m.role==='user'?'#fff':'#1a1a1a', fontSize:13, lineHeight:1.5 }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display:'flex', justifyContent:'flex-start' }}>
                <div style={{ padding:'10px 14px', borderRadius:'16px 16px 16px 4px', background:'#f5f5f3', fontSize:13, color:'#888' }}>
                  <span style={{ display:'inline-flex', gap:4 }}>
                    <span style={{ animation:'bounce 1s infinite 0s', display:'inline-block' }}>•</span>
                    <span style={{ animation:'bounce 1s infinite .2s', display:'inline-block' }}>•</span>
                    <span style={{ animation:'bounce 1s infinite .4s', display:'inline-block' }}>•</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions (si 1 seul message) */}
          {messages.length === 1 && (
            <div style={{ padding:'0 14px 10px', display:'flex', flexDirection:'column', gap:6, flexShrink:0 }}>
              {suggestions.map(s => (
                <div key={s} onClick={() => { setInput(s); }} style={{ background:'#E6F1FB', color:'#0854A0', borderRadius:20, padding:'6px 14px', fontSize:12, cursor:'pointer', fontWeight:500 }}>{s}</div>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding:'10px 14px', borderTop:'0.5px solid #f0f0f0', display:'flex', gap:8, flexShrink:0 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Posez votre question RH…"
              style={{ flex:1, padding:'10px 14px', border:'0.5px solid #e5e5e5', borderRadius:24, fontSize:13, outline:'none', fontFamily:'inherit', background:'#f9f9f9' }}
            />
            <button onClick={send} disabled={!input.trim() || loading} style={{ width:38, height:38, borderRadius:'50%', background:input.trim()?'#0854A0':'#e5e5e5', color:'#fff', border:'none', cursor:input.trim()?'pointer':'default', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'background .15s' }}>
              ➤
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }`}</style>
    </>
  )
}

export default function App() {
  const [screen, setScreen] = useState('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const isMobile = useIsMobile()
  const nonLus = MESSAGES_INIT.filter(m=>!m.lu).length

  const Sidebar = () => (
    <div style={{ width:220,background:'#fff',borderRight:'0.5px solid #e5e5e5',display:'flex',flexDirection:'column',height:'100%',flexShrink:0 }}>
      <div style={{ padding:'20px 16px 16px',borderBottom:'0.5px solid #f0f0f0' }}>
        <div style={{ background:SAP,borderRadius:10,padding:'10px 14px',display:'flex',alignItems:'center',gap:10 }}>
          <div style={{ width:32,height:32,borderRadius:'50%',background:'rgba(255,255,255,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:500,color:'#fff' }}>FB</div>
          <div><div style={{ color:'#fff',fontSize:13,fontWeight:500 }}>Fabrice BEAUD'HUIN</div><div style={{ color:'rgba(255,255,255,.7)',fontSize:11 }}>Matricule 00045821</div></div>
        </div>
      </div>
      <nav style={{ flex:1,padding:'12px 8px',overflowY:'auto' }}>
        {NAV_ITEMS.map(i=>(
          <div key={i.id} onClick={()=>setScreen(i.id)} style={{ display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:10,marginBottom:2,cursor:'pointer',background:screen===i.id?'#E6F1FB':'transparent',color:screen===i.id?SAP:'#555',fontWeight:screen===i.id?500:400,fontSize:13,position:'relative',transition:'background .15s' }}>
            <span style={{ fontSize:18 }}>{i.icon}</span>
            <span>{i.label}</span>
            {i.id==='messages'&&nonLus>0&&<span style={{ position:'absolute',right:10,background:SAP,color:'#fff',borderRadius:20,padding:'1px 7px',fontSize:10,fontWeight:500 }}>{nonLus}</span>}
          </div>
        ))}
      </nav>
      <div style={{ padding:'12px 16px',borderTop:'0.5px solid #f0f0f0',fontSize:12,color:'#aaa',textAlign:'center' }}>Mon Espace RH · v2.0</div>
    </div>
  )

  const MobileNav = () => (
    <div style={{ background:'#fff',borderTop:'0.5px solid #e5e5e5',display:'flex',justifyContent:'space-around',padding:'8px 0 12px',flexShrink:0 }}>
      {NAV_ITEMS.slice(0,4).map(i=>(
        <div key={i.id} onClick={()=>setScreen(i.id)} style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:2,fontSize:10,color:screen===i.id?SAP:'#999',cursor:'pointer',padding:'0 6px' }}>
          <span style={{ fontSize:20 }}>{i.icon}</span>
          <span style={{ fontWeight:screen===i.id?500:400 }}>{i.label}</span>
        </div>
      ))}
      <div onClick={()=>setMenuOpen(!menuOpen)} style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:2,fontSize:10,color:['attestations','frais','messages','famille'].includes(screen)?SAP:'#999',cursor:'pointer',padding:'0 6px' }}>
        <span style={{ fontSize:20 }}>⋯</span>
        <span>Plus</span>
      </div>
    </div>
  )

  const renderScreen = () => {
    if(screen==='dashboard') return <Dashboard setScreen={setScreen}/>
    if(screen==='fiche') return <Fiche/>
    if(screen==='conges') return <Conges/>
    if(screen==='paie') return <Paie/>
    if(screen==='famille') return <Famille/>
    if(screen==='attestations') return <Attestations/>
    if(screen==='frais') return <Frais/>
    if(screen==='messages') return <Messages/>
    return <Dashboard setScreen={setScreen}/>
  }

  if(isMobile) return (
    <div style={{ display:'flex',flexDirection:'column',height:'100vh',background:'#f5f5f3',fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
      <div style={{ background:SAP,padding:'10px 16px 14px',display:'flex',alignItems:'center',gap:10,flexShrink:0 }}>
        {screen!=='dashboard'&&<span onClick={()=>setScreen('dashboard')} style={{ color:'#fff',fontSize:20,cursor:'pointer' }}>←</span>}
        <div style={{ flex:1,color:'#fff',fontSize:16,fontWeight:500 }}>{TITLES[screen]}</div>
        <span style={{ color:'#fff',fontSize:11 }}>📶 🔋</span>
      </div>
      <div style={{ flex:1,overflowY:'auto' }}>{renderScreen()}</div>
      <MobileNav/>
      <ChatBot/>
      {menuOpen&&(
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.45)',zIndex:100 }} onClick={()=>setMenuOpen(false)}>
          <div style={{ position:'absolute',bottom:80,left:0,right:0,background:'#fff',borderRadius:'20px 20px 0 0',padding:'16px 8px 8px' }} onClick={e=>e.stopPropagation()}>
            <div style={{ width:36,height:4,background:'#e0e0e0',borderRadius:2,margin:'0 auto 16px' }}/>
            {NAV_ITEMS.slice(4).map(i=>(
              <div key={i.id} onClick={()=>{setScreen(i.id);setMenuOpen(false)}} style={{ display:'flex',alignItems:'center',gap:12,padding:'14px 20px',borderBottom:'0.5px solid #f0f0f0',cursor:'pointer',fontSize:14 }}>
                <span style={{ fontSize:22 }}>{i.icon}</span><span>{i.label}</span>
                {i.id==='messages'&&nonLus>0&&<span style={{ marginLeft:'auto',background:SAP,color:'#fff',borderRadius:20,padding:'2px 8px',fontSize:11 }}>{nonLus}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div style={{ display:'flex',height:'100vh',background:'#f5f5f3',fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
      <Sidebar/>
      <div style={{ flex:1,display:'flex',flexDirection:'column',overflow:'hidden' }}>
        <div style={{ background:'#fff',padding:'16px 28px',borderBottom:'0.5px solid #e5e5e5',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0 }}>
          <div style={{ fontSize:18,fontWeight:500,color:'#1a1a1a' }}>{TITLES[screen]}</div>
          <div style={{ display:'flex',alignItems:'center',gap:12 }}>
            <div style={{ position:'relative',cursor:'pointer' }} onClick={()=>setScreen('messages')}>
              <span style={{ fontSize:20 }}>🔔</span>
              {nonLus>0&&<span style={{ position:'absolute',top:-4,right:-4,background:SAP,color:'#fff',borderRadius:'50%',width:16,height:16,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:500 }}>{nonLus}</span>}
            </div>
            <div style={{ display:'flex',alignItems:'center',gap:8,cursor:'pointer' }}>
              <div style={{ width:34,height:34,borderRadius:'50%',background:SAP,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:500,color:'#fff' }}>FB</div>
              <div style={{ fontSize:13 }}><div style={{ fontWeight:500 }}>Fabrice BEAUD'HUIN</div><div style={{ color:'#888',fontSize:11 }}>Matricule 00045821</div></div>
            </div>
          </div>
        </div>
        <div style={{ flex:1,overflowY:'auto' }}>{renderScreen()}</div>
      </div>
      <ChatBot/>
    </div>
  )
}
