// frontend/src/components/Historial.jsx
import { useEffect, useState } from "react";
import { Card, ListGroup, Form, Button, Row, Col, Alert, Badge } from "react-bootstrap";
import { listarHistorial, registrarCambio } from "../api/equipos";
import { parseFromInputDateTime, toInputDateTime } from "../utils/dt";
import { fmtDateTime } from "../utils/format";

export default function Historial({ equipoId, onSaved }) {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ descripcion: "", usuario: "", fecha: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    async function load() {
        if (!equipoId) return;
        try {
            const data = await listarHistorial(equipoId);
            data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            setItems(data);
        } catch (error) {
            console.error("Error cargando historial:", error);
            setError("Error al cargar el historial");
        }
    }

    useEffect(() => {
        load();
    }, [equipoId]);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const add = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const payload = {
                descripcion: form.descripcion?.trim() || null,
                usuario: form.usuario?.trim() || null,
                fecha: form.fecha ? parseFromInputDateTime(form.fecha) : null,
            };
            await registrarCambio(equipoId, payload);
            setForm({ descripcion: "", usuario: "", fecha: "" });
            setSuccess(true);
            load();
            onSaved?.();
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error("Error registrando cambio:", error);
            setError("Error al registrar el cambio");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">
                    <i className="fas fa-history me-2"></i>
                    Historial de Cambios
                </h5>
                <Badge bg="secondary">{items.length} registros</Badge>
            </div>

            {success && (
                <Alert variant="success" className="py-2">
                    <i className="fas fa-check me-2"></i>
                    Cambio registrado exitosamente
                </Alert>
            )}

            {error && (
                <Alert variant="danger" className="py-2">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                </Alert>
            )}

            {/* Lista del Historial */}
            <Card className="mb-4">
                <Card.Header>
                    <h6 className="mb-0">
                        <i className="fas fa-list me-2"></i>
                        Registro de Cambios
                    </h6>
                </Card.Header>
                <Card.Body className="p-0">
                    {items.length > 0 ? (
                        <ListGroup variant="flush">
                            {items.map((h) => (
                                <ListGroup.Item key={h.id} className="px-3 py-2">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div className="flex-grow-1">
                                            <p className="mb-1">{h.descripcion}</p>
                                            {h.usuario && (
                                                <small className="text-muted">
                                                    <i className="fas fa-user me-1"></i>
                                                    {h.usuario}
                                                </small>
                                            )}
                                        </div>
                                        <div className="text-end">
                                            <Badge bg="light" text="dark" className="ms-2">
                                                {fmtDateTime(h.fecha)}
                                            </Badge>
                                        </div>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : (
                        <div className="text-center py-4">
                            <i className="fas fa-history fa-2x text-muted mb-3"></i>
                            <p className="text-muted mb-0">No hay registros en el historial</p>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Formulario para nuevo registro */}
            <Card>
                <Card.Header>
                    <h6 className="mb-0">
                        <i className="fas fa-plus me-2"></i>
                        Registrar Nuevo Cambio
                    </h6>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={add}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Descripción del Cambio *</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        name="descripcion"
                                        placeholder="Describa el cambio realizado..."
                                        value={form.descripcion}
                                        onChange={onChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Usuario</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="usuario"
                                        placeholder="Quién realizó el cambio"
                                        value={form.usuario}
                                        onChange={onChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Fecha y Hora</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        name="fecha"
                                        value={toInputDateTime(form.fecha)}
                                        onChange={onChange}
                                    />
                                    <Form.Text className="text-muted">
                                        Si no se especifica, se usará la fecha actual
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="d-grid">
                            <Button
                                type="submit"
                                disabled={loading}
                                variant="primary"
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Registrando...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-save me-2"></i>
                                        Registrar Cambio
                                    </>
                                )}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}
