// frontend/src/components/Historial.js - AGREGAR onSaved
import { useEffect, useState } from "react";
import { listarHistorial, registrarCambio } from "../api/equipos";
import { parseFromInputDateTime, toInputDateTime } from "../utils/dt";
import { fmtDateTime } from "../utils/format";

export default function Historial({ equipoId, onSaved }) { // ← Agregar onSaved
    const [items, setItems] = useState([]);
    const [f, setF] = useState({ descripcion: "", usuario: "", fecha: "" });

    async function load() {
        if (!equipoId) return;
        const data = await listarHistorial(equipoId);
        data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        setItems(data);
    }

    useEffect(() => {
        load();
    }, [equipoId]);

    const onChange = (e) => setF({ ...f, [e.target.name]: e.target.value });

    const add = async (e) => {
        e.preventDefault();
        const payload = {
            descripcion: f.descripcion?.trim() || null,
            usuario: f.usuario?.trim() || null,
            fecha: f.fecha ? parseFromInputDateTime(f.fecha) : null,
        };
        await registrarCambio(equipoId, payload);
        setF({ descripcion: "", usuario: "", fecha: "" });
        load();
        onSaved?.(); // ← Notificar actualización
    };

    return (
        <div style={{ display: "grid", gap: 8 }}>
            <h4>Historial de cambios</h4>
            <ul>
                {items.map((h) => (
                    <li key={h.id}>
                        <b>{fmtDateTime(h.fecha)}</b>
                        {h.descripcion ? ` — ${h.descripcion}` : ""}
                        {h.usuario && ` (${h.usuario})`}
                    </li>
                ))}
            </ul>
            <form onSubmit={add} style={{ display: "grid", gap: 8, gridTemplateColumns: "2fr 1fr 1fr auto" }}>
                <input name="descripcion" placeholder="Descripción" value={f.descripcion} onChange={onChange} />
                <input name="usuario" placeholder="Usuario" value={f.usuario} onChange={onChange} />
                <input type="datetime-local" name="fecha" value={toInputDateTime(f.fecha)} onChange={onChange} />
                <button>Registrar</button>
            </form>
        </div>
    );

    // En cualquier componentes
    useEffect(() => {
        console.log("Detalle actualizado:", detalle);
    }, [detalle]);


}
