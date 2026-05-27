import { useState } from 'react'
import { TopBar, NavBar } from './components/UI.jsx'
import FicheScreen   from './screens/FicheScreen.jsx'
import CongesScreen  from './screens/CongesScreen.jsx'
import PaieScreen    from './screens/PaieScreen.jsx'
import FamilleScreen from './screens/FamilleScreen.jsx'

const TITLES = {
  fiche:   'Ma fiche RH',
  conges:  'Demande de congés',
  paie:    'Mes bulletins de paie',
  famille: 'Personnes à charge',
}

export default function App() {
  const [screen, setScreen] = useState('fiche')

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0 8px', minHeight: '100vh', background: '#e8e8e6' }}>
      <div style={{
        width: 360,
        background: '#f5f5f3',
        borderRadius: 28,
        border: '1px solid #ddd',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '92vh',
        boxShadow: '0 8px 32px rgba(0,0,0,.12)',
      }}>
        {/* Status bar */}
        <div style={{ background: '#0854A0', padding: '10px 20px 8px', display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
          <span style={{ color: '#fff', fontSize: 11, fontWeight: 500 }}>9:41</span>
          <span style={{ color: '#fff', fontSize: 11 }}>📶 🔋</span>
        </div>

        <TopBar
          title={TITLES[screen]}
          onBack={screen !== 'fiche' ? () => setScreen('fiche') : null}
          onAdd={screen === 'famille' ? () => {} : null}
        />

        {screen === 'fiche'   && <FicheScreen />}
        {screen === 'conges'  && <CongesScreen />}
        {screen === 'paie'    && <PaieScreen />}
        {screen === 'famille' && <FamilleScreen />}

        <NavBar screen={screen} setScreen={setScreen} />
      </div>
    </div>
  )
}
