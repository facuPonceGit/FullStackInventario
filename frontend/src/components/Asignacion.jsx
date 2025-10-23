// frontend/src/components/Asignacion.js
import { useEffect, useState } from "react";
import { listarUsuariosAsignados } from "../api/catalogos";
import {
    asignarUsuario,
    obtenerAsignacionVigente,
    listarAsignaciones,
} from "../api/equipos";
import { parseFromInputDateTime, toInputDateTime } from "../utils/dt";
import { fmtDateTime } from "../utils/format";

export default function Asignacion({ equipoId, onSaved }) { // 
    const [usuarios, setUsuarios] = useState([]);
    const [vigente, setVigente] = useState(null);
    const [hist, setHist] = useState([]);
    const [f, setF] = useState({ usuarioId: "", fechaDesde: "", observacion: "" });

    async function refresh() {
        if (!equipoId) return;

        try {
            // Vigente - ahora viene como objeto simple o null
            const v = await obtenerAsignacionVigente(equipoId);
            setVigente(v);

            // Historial - ahora viene como array de objetos con estructura consistente
            const h = await listarAsignaciones(equipoId);
            setHist(h || []);
        } catch (error) {
            console.error("Error cargando asignaciones:", error);
        }
    }

    useEffect(() => {
        listarUsuariosAsignados().then(setUsuarios);
    }, []);

    useEffect(() => {
        refresh();
    }, [equipoId]);

    const onChange = (e) => setF({ ...f, [e.target.name]: e.target.value });

    const save = async (e) => {
        e.preventDefault();
        if (!f.usuarioId) {
            alert("Selecciona un usuario");
            return;
        }

        try {
            const payload = {
                usuarioId: Number(f.usuarioId),
                observacion: f.observacion?.trim() || null,
                fechaDesde: f.fechaDesde ? parseFromInputDateTime(f.fechaDesde) : null,
            };
            await asignarUsuario(equipoId, payload);
            setF({ usuarioId: "", fechaDesde: "", observacion: "" });
            await refresh();
            onSaved?.(); // ← AGREGAR esta línea para notificar al padre
        } catch (error) {
            console.error("Error asignando usuario:", error);
            alert("Error al asignar usuario");
        }
    };

    return (
        <div style={{ display: "grid", gap: 12, padding: "12px", border: "1px solid #ddd", borderRadius: 8 }}>
            <h4 style={{ margin: 0 }}>Gestión de Asignaciones</h4>

            {/* Asignación Vigente */}
            <div style={{ padding: 8, backgroundColor: "#f5f5f5", borderRadius: 4 }}>
                <strong>Asignación Vigente: </strong>
                {vigente && vigente.usuarioId ? (
                    <span>
                        {vigente.nombre}
                        {vigente.email && ` (${vigente.email})`}
                        {` - Desde: ${fmtDateTime(vigente.fechaDesde)}`}
                    </span>
                ) : (
                    <span style={{ color: "#666" }}>— Sin asignación activa —</span>
                )}
            </div>

            {/* Formulario de Nueva Asignación */}
            <form onSubmit={save} style={{ display: "grid", gap: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 8 }}>
                    <div>
                        <label style={{ display: "block", marginBottom: 4, fontSize: "0.9em" }}>
                            Usuario:
                        </label>
                        <select
                            name="usuarioId"
                            value={f.usuarioId}
                            onChange={onChange}
                            required
                            style={{ width: "100%", padding: "6px" }}
                        >
                            <option value="">Seleccionar usuario...</option>
                            {usuarios.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.nombre} {u.area ? `(${u.area})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: 4, fontSize: "0.9em" }}>
                            Fecha Desde:
                        </label>
                        <input
                            type="datetime-local"
                            name="fechaDesde"
                            value={toInputDateTime(f.fechaDesde)}
                            onChange={onChange}
                            style={{ width: "100%", padding: "6px" }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: 4, fontSize: "0.9em" }}>
                            Observación:
                        </label>
                        <input
                            name="observacion"
                            placeholder="Observación opcional..."
                            value={f.observacion}
                            onChange={onChange}
                            style={{ width: "100%", padding: "6px" }}
                        />
                    </div>

                    <div style={{ display: "flex", alignItems: "end" }}>
                        <button
                            type="submit"
                            style={{
                                padding: "6px 12px",
                                whiteSpace: "nowrap",
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: 4,
                                cursor: "pointer"
                            }}
                        >
                            Asignar
                        </button>
                    </div>
                </div>
            </form>

            {/* Historial de Asignaciones */}
            <div>
                <h5 style={{ margin: "16px 0 8px 0" }}>Historial de Asignaciones</h5>
                {hist.length === 0 ? (
                    <p style={{ color: "#666", fontStyle: "italic" }}>No hay historial de asignaciones</p>
                ) : (
                    <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#f8f9fa" }}>
                                    <th style={{ textAlign: "left", padding: "8px", border: "1px solid #ddd" }}>Usuario</th>
                                    <th style={{ textAlign: "left", padding: "8px", border: "1px solid #ddd" }}>Desde</th>
                                    <th style={{ textAlign: "left", padding: "8px", border: "1px solid #ddd" }}>Hasta</th>
                                    <th style={{ textAlign: "left", padding: "8px", border: "1px solid #ddd" }}>Observación</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hist.map((a) => (
                                    <tr key={a.id}>
                                        <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                                            {a.usuarioNombre}
                                            {a.usuarioEmail && <br />}
                                            {a.usuarioEmail && <small style={{ color: "#666" }}>{a.usuarioEmail}</small>}
                                        </td>
                                        <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                                            {fmtDateTime(a.fechaDesde)}
                                        </td>
                                        <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                                            {a.fechaHasta ? fmtDateTime(a.fechaHasta) : "—"}
                                        </td>
                                        <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                                            {a.observacion || "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
