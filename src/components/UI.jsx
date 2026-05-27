import { useState } from 'react'

const SAP_BLUE = '#0854A0'
const SAP_BLUE_D = '#1068C5'

export { SAP_BLUE, SAP_BLUE_D }

export function useToast() {
  const [toast, setToast] = useState({ show: false, msg: '' })
  const showToast = (msg) => {
    setToast({ show: true, msg })
    setTimeout(() => setToast({ show: false, msg: '' }), 2500)
  }
  return [toast, showToast]
}

export function Toast({ msg, show }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: '#27500A', color: '#fff', borderRadius: 12,
      padding: '12px 16px', fontSize: 13, marginBottom: 12,
      opacity: show ? 1 : 0, transition: 'opacity .3s',
      minHeight: 20, pointerEvents: 'none',
    }}>
      {show && <><span style={{ fontSize: 18 }}>checkmark</span><span>{msg}</span></>}
    </div>
  )
}

export function SectionLabel({ children, first }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 500, color: '#aaa',
      letterSpacing: '.06em', textTransform: 'uppercase',
      margin: first ? '2px 0 6px 2px' : '14px 0 6px 2px',
    }}>
      {children}
    </div>
  )
}

export function Card({ children, style }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '0.5px solid #e5e5e5', overflow: 'hidden', ...style }}>
      {children}
    </div>
  )
}

export function Row({ icon, iconBg, iconColor, label, value, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '13px 16px', gap: 12, borderBottom: '0.5px solid #f0f0f0' }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: iconBg || '#E6F1FB', color: iconColor || '#185FA5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: '#888' }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
      </div>
      {action && <span style={{ color: '#ccc', fontSize: 15 }}>{action}</span>}
    </div>
  )
}

export function FieldBox({ label, value, color, full }) {
  return (
    <div style={{ background: '#f7f7f5', borderRadius: 10, padding: '9px 12px', gridColumn: full ? '1/-1' : undefined }}>
      <div style={{ fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 500, color: color || '#1a1a1a', marginTop: 2 }}>{value}</div>
    </div>
  )
}

export function StatusBadge({ statut }) {
  const map = {
    'Approuvee':  { bg: '#EAF3DE', color: '#3B6D11' },
    'Refusee':    { bg: '#FCEBEB', color: '#A32D2D' },
    'En attente': { bg: '#FAEEDA', color: '#854F0B' },
  }
  const s = map[statut] || map['En attente']
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap' }}>
      {statut}
    </span>
  )
}

export function PrimaryButton({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', padding: 14, background: SAP_BLUE, color: '#fff',
      border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 500,
      cursor: 'pointer', display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: 8, marginTop: 16, fontFamily: 'inherit',
    }}>
      {children}
    </button>
  )
}

export function InfoCard({ children }) {
  return (
    <Card style={{ padding: '14px 16px' }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <span style={{ color: '#185FA5', fontSize: 18, flexShrink: 0 }}>i</span>
        <div style={{ fontSize: 12, color: '#666', lineHeight: 1.5 }}>{children}</div>
      </div>
    </Card>
  )
}

export function TopBar({ title, onBack, onAdd }) {
  return (
    <div style={{ background: SAP_BLUE, padding: '10px 16px 14px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
      {onBack && <span onClick={onBack} style={{ color: '#fff', fontSize: 20, cursor: 'pointer', padding: '2px 4px' }}>back</span>}
      <div style={{ flex: 1, color: '#fff', fontSize: 16, fontWeight: 500 }}>{title}</div>
      {onAdd && <span onClick={onAdd} style={{ color: '#fff', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}>+</span>}
    </div>
  )
}

export function NavBar({ screen, setScreen }) {
  const items = [
    { id: 'fiche',   icon: 'U', label: 'Ma fiche'  },
    { id: 'conges',  icon: 'C', label: 'Conges'    },
    { id: 'paie',    icon: 'P', label: 'Paie'      },
    { id: 'famille', icon: 'F', label: 'Famille'   },
  ]
  return (
    <div style={{ background: '#fff', borderTop: '0.5px solid #e5e5e5', display: 'flex', justifyContent: 'space-around', padding: '10px 0 14px', flexShrink: 0 }}>
      {items.map(i => (
        <div key={i.id} onClick={() => setScreen(i.id)} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 3, fontSize: 10, color: screen === i.id ? SAP_BLUE : '#999',
          cursor: 'pointer', padding: '0 8px',
        }}>
          <span style={{ fontSize: 22 }}>{i.icon}</span>
          <span style={{ fontWeight: screen === i.id ? 500 : 400 }}>{i.label}</span>
        </div>
      ))}
    </div>
  )
}
