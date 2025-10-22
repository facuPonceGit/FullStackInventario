import { useState } from 'react'
import EquipoForm from './components/EquipoForm'
import EquipoList from './components/EquipoList'
import EquipoDetalle from './components/EquipoDetalle'

export default function App() {
    const [refreshKey, setRefreshKey] = useState(0)
    const [selected, setSelected] = useState(null)

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 16, display: 'grid', gap: 16 }}>
            <h1>Inventario (React + .NET API)</h1>

            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 2fr' }}>
                <div style={{ display: 'grid', gap: 16 }}>
                    <EquipoForm onCreated={() => setRefreshKey(k => k + 1)} />
                    {/* Forzar reload de la lista al crear */}
                    <EquipoList key={refreshKey} onSelect={setSelected} />
                </div>

                <EquipoDetalle equipo={selected} />
            </div>
        </div>
    )
}
