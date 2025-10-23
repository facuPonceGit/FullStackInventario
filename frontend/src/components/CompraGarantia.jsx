// frontend/src/components/CompraGarantia.jsx
import { useEffect, useState } from "react";
import { Card, Form, Button, Row, Col, Badge } from "react-bootstrap";
import { actualizarCompraGarantia } from "../api/equipos";
import { listarProveedores } from "../api/catalogos";
import { toInputDate, parseFromInputDate } from "../utils/dt";
import { fmtDate } from "../utils/format";

export default function CompraGarantia({ equipoId, detalle, onSaved }) {
    const [form, setForm] = useState({ compra: "", garantia: "", proveedorId: "" });
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        listarProveedores().then(setProveedores);
    }, []);

    useEffect(() => {
        if (detalle) {
            setForm({
                compra: toInputDate(detalle.fechaAdquisicion),
                garantia: toInputDate(detalle.fechaVencGarantia),
                proveedorId: detalle.proveedorId?.toString() || "",
            });
        }
    }, [detalle]);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const save = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                compra: form.compra ? parseFromInputDate(form.compra) : null,
                garantia: form.garantia ? parseFromInputDate(form.garantia) : null,
                proveedorId: form.proveedorId ? parseInt(form.proveedorId) : null,
            };
            await actualizarCompraGarantia(equipoId, payload);
            onSaved?.();
        } catch (error) {
            console.error("Error guardando compra/garantía:", error);
            alert("Error al guardar los datos");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="h-100">
            <Card.Header className="bg-white py-3">
                <h6 className="mb-0 fw-bold">
                    <i className="fas fa-shopping-cart me-2"></i>
                    Compra y Garantía
                </h6>
            </Card.Header>
            <Card.Body>
                {/* Mostrar información actual */}
                {(detalle?.fechaAdquisicion || detalle?.fechaVencGarantia || detalle?.proveedorNombre) && (
                    <div className="mb-3 p-3 bg-light rounded">
                        <h6 className="mb-2 text-muted">Información Actual:</h6>
                        <Row className="g-2 small">
                            {detalle.fechaAdquisicion && (
                                <Col xs={6}>
                                    <strong>Compra:</strong> {fmtDate(detalle.fechaAdquisicion)}
                                </Col>
                            )}
                            {detalle.fechaVencGarantia && (
                                <Col xs={6}>
                                    <strong>Garantía:</strong> {fmtDate(detalle.fechaVencGarantia)}
                                </Col>
                            )}
                            {detalle.proveedorNombre && (
                                <Col xs={12}>
                                    <strong>Proveedor:</strong> {detalle.proveedorNombre}
                                </Col>
                            )}
                        </Row>
                    </div>
                )}

                <Form onSubmit={save}>
                    <Row className="g-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="small fw-semibold">Fecha Compra</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="compra"
                                    value={form.compra}
                                    onChange={onChange}
                                    size="sm"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="small fw-semibold">Venc. Garantía</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="garantia"
                                    value={form.garantia}
                                    onChange={onChange}
                                    size="sm"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label className="small fw-semibold">Proveedor</Form.Label>
                                <Form.Select
                                    name="proveedorId"
                                    value={form.proveedorId}
                                    onChange={onChange}
                                    size="sm"
                                >
                                    <option value="">(sin proveedor)</option>
                                    {proveedores.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.nombre}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <div className="d-grid">
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={loading}
                                    variant="primary"
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-save me-2"></i>
                                            Guardar
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
}
