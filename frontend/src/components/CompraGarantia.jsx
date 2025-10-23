// frontend/src/components/CompraGarantia.js - VERSIÓN CORREGIDA
import { useEffect, useState } from "react";
import { actualizarCompraGarantia } from "../api/equipos";
import { listarProveedores } from "../api/catalogos";
import { toInputDate, parseFromInputDate } from "../utils/dt";

export default function CompraGarantia({ equipoId, detalle, onSaved }) {
    const [f, setF] = useState({ compra: "", garantia: "", proveedorId: "" });
    const [proveedores, setProveedores] = useState([]);

    // Cargar proveedores al montar el componente
    useEffect(() => {
        listarProveedores().then(setProveedores);
    }, []);

    // Actualizar formulario cuando cambia el detalle
    useEffect(() => {
        if (detalle) {
            setF({
                compra: toInputDate(detalle.fechaAdquisicion),
                garantia: toInputDate(detalle.fechaVencGarantia),
                proveedorId: detalle.proveedorId?.toString() || "",
            });
        }
    }, [detalle]);

    const onChange = (e) => setF({ ...f, [e.target.name]: e.target.value });

    const save = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                compra: f.compra ? parseFromInputDate(f.compra) : null,
                garantia: f.garantia ? parseFromInputDate(f.garantia) : null,
                proveedorId: f.proveedorId ? parseInt(f.proveedorId) : null,
            };
            await actualizarCompraGarantia(equipoId, payload);
            alert("Datos guardados correctamente");
            onSaved?.(); // refresca la ficha
        } catch (error) {
            console.error("Error guardando compra/garantía:", error);
            alert("Error al guardar los datos");
        }
    };

    return (
        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
            <h4>Compra y Garantía</h4>
            <form onSubmit={save} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, alignItems: "end" }}>
                <div>
                    <label style={{ display: "block", marginBottom: 4, fontSize: "0.9em" }}>
                        Fecha Compra:
                    </label>
                    <input
                        type="date"
                        name="compra"
                        value={f.compra}
                        onChange={onChange}
                        style={{ width: "100%", padding: "6px" }}
                    />
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: 4, fontSize: "0.9em" }}>
                        Venc. Garantía:
                    </label>
                    <input
                        type="date"
                        name="garantia"
                        value={f.garantia}
                        onChange={onChange}
                        style={{ width: "100%", padding: "6px" }}
                    />
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: 4, fontSize: "0.9em" }}>
                        Proveedor:
                    </label>
                    <select
                        name="proveedorId"
                        value={f.proveedorId}
                        onChange={onChange}
                        style={{ width: "100%", padding: "6px" }}
                    >
                        <option value="">(sin proveedor)</option>
                        {proveedores.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    style={{
                        padding: "6px 12px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer"
                    }}
                >
                    Guardar
                </button>
            </form>
        </div>
    );
}
