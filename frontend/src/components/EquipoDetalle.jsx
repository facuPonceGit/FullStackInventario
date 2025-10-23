// frontend/src/components/EquipoDetalle.js - VERSIÓN MEJORADA
import { useEffect, useState } from "react";
import { obtenerDetalle } from "../api/equipos";
import Perifericos from "./Perifericos";
import Historial from "./Historial";
import CompraGarantia from "./CompraGarantia";
import Ubicacion from "./Ubicacion";
import Asignacion from "./Asignacion";
import { fmtDate } from "../utils/format";

export default function EquipoDetalle({ equipo, onEquipoUpdated }) {
    const [detalle, setDetalle] = useState(null);
    const [refreshCounter, setRefreshCounter] = useState(0);
    const [loading, setLoading] = useState(false);

    async function load() {
        if (!equipo?.id) return;
        setLoading(true);
        try {
            console.log("🔄 Cargando detalle del equipo:", equipo.id);
            const data = await obtenerDetalle(equipo.id);
            console.log("📦 Datos recibidos:", data);
            setDetalle(data);
            onEquipoUpdated?.();
        } catch (error) {
            console.error("❌ Error cargando detalle:", error);
            alert("Error al cargar los datos del equipo");
        } finally {
            setLoading(false);
        }
    }

    // Función para forzar recarga
    const forceRefresh = () => {
        console.log("🔄 Forzando actualización...");
        setRefreshCounter(prev => prev + 1);
    };

    useEffect(() => {
        load();
    }, [equipo?.id, refreshCounter]);

    if (!equipo)
        return (
            <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
                Seleccioná un equipo
            </div>
        );

    if (loading) {
        return (
            <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
                Cargando detalles del equipo...
            </div>
        );
    }

    return (
        <div style={{ display: "grid", gap: 16 }}>
            <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div>
                        <h3 style={{ margin: 0 }}>
                            Equipo #{equipo.id} — {equipo.nombre}
                        </h3>
                        <div style={{ marginTop: 8 }}>
                            <b>Código:</b> {equipo.codigoInventario} · <b>Marca:</b> {equipo.marca} ·{" "}
                            <b>Modelo:</b> {equipo.modelo} · <b>Tipo:</b> {equipo.tipo}
                        </div>

                        {detalle && (
                            <div style={{ marginTop: 8, fontSize: "0.9em" }}>
                                <b>Proveedor:</b> {detalle.proveedorNombre ?? "—"}{" "}
                                {" · "}
                                <b>Compra:</b>{" "}
                                {detalle.fechaAdquisicion ? fmtDate(detalle.fechaAdquisicion) : "—"}{" "}
                                {" · "}
                                <b>Garantía:</b>{" "}
                                {detalle.fechaVencGarantia ? fmtDate(detalle.fechaVencGarantia) : "—"}{" "}
                                {" · "}
                                <b>Ubicación:</b> {detalle.ubicacionNombre ?? "—"}
                            </div>
                        )}
                    </div>

                    {/* Botón para forzar actualización manual */}
                    <button
                        onClick={forceRefresh}
                        style={{
                            padding: "6px 12px",
                            backgroundColor: "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                            fontSize: "0.8em"
                        }}
                    >
                        ↻ Actualizar Vista
                    </button>
                </div>
            </div>

            {/* Pasar forceRefresh a todos los componentes hijos */}
            <CompraGarantia equipoId={equipo.id} detalle={detalle} onSaved={forceRefresh} />
            <Ubicacion equipoId={equipo.id} detalle={detalle} onSaved={forceRefresh} />
            <Perifericos equipoId={equipo.id} onSaved={forceRefresh} />
            <Historial equipoId={equipo.id} onSaved={forceRefresh} />
            <Asignacion equipoId={equipo.id} onSaved={forceRefresh} />
        </div>
    );
}
