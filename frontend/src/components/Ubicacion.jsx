// frontend/src/components/Ubicacion.js - VERSIÓN CORREGIDA
import { useEffect, useState } from 'react'
import { listarUbicaciones } from '../api/catalogos'
import { cambiarUbicacion } from '../api/equipos'

export default function Ubicacion({ equipoId, detalle, onSaved }) {
    const [ubicaciones, setUbicaciones] = useState([])
    const [sel, setSel] = useState('')

    useEffect(() => {
        listarUbicaciones().then(setUbicaciones)
    }, [])

    // Actualizar selección cuando cambia el detalle
    useEffect(() => {
        if (detalle) {
            setSel(detalle.ubicacionId?.toString() || '');
        }
    }, [detalle])

    const save = async () => {
        try {
            // Convertir a número o null
            const ubicacionId = sel ? parseInt(sel) : null;
            await cambiarUbicacion(equipoId, ubicacionId);
            alert("Ubicación guardada correctamente");
            onSaved?.();
        } catch (error) {
            console.error("Error guardando ubicación:", error);
            alert("Error al guardar la ubicación");
        }
    }

    return (
        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'end' }}>
                <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 8px 0" }}>Ubicación</h4>
                    <select
                        value={sel}
                        onChange={(e) => setSel(e.target.value)}
                        style={{ width: "100%", padding: "6px" }}
                    >
                        <option value="">(sin ubicación)</option>
                        {ubicaciones.map(u => (
                            <option key={u.id} value={u.id}>
                                {u.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={save}
                    style={{
                        padding: "6px 12px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer"
                    }}
                >
                    Guardar
                </button>
            </div>
            {detalle?.ubicacionNombre && (
                <div style={{ marginTop: 8, fontSize: "0.9em", color: "#666" }}>
                    Actual: <strong>{detalle.ubicacionNombre}</strong>
                </div>
            )}
        </div>
    )
}
