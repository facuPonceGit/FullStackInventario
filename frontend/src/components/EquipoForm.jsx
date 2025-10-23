// frontend/src/components/EquipoForm.jsx
import { useState } from 'react';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { crearEquipo } from '../api/equipos';

// Estado inicial completamente vacío
const initial = {
    codigoInventario: '',
    nombre: '',
    marca: '',
    modelo: '',
    tipo: '',
    numeroSerie: ''
};

export default function EquipoForm({ onCreated }) {
    const [form, setForm] = useState(initial);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await crearEquipo({ ...form });
            setForm(initial); // Resetear a valores vacíos
            setSuccess(true);
            onCreated?.();
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.response?.data?.message ?? err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-white">
                <h5 className="mb-0 fw-bold">
                    <i className="fas fa-plus-circle me-2"></i>
                    Nuevo Equipo
                </h5>
            </Card.Header>

            <Card.Body>
                {success && (
                    <Alert variant="success" className="py-2 small">
                        <i className="fas fa-check me-2"></i>
                        Equipo creado exitosamente!
                    </Alert>
                )}

                {error && (
                    <Alert variant="danger" className="py-2 small">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        {error}
                    </Alert>
                )}

                <Form onSubmit={submit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-semibold">Código Inventario *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="codigoInventario"
                                    placeholder="Ej: TAG-IT-0001"
                                    value={form.codigoInventario}
                                    onChange={onChange}
                                    required
                                    autoComplete="off"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-semibold">Nombre *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre"
                                    placeholder="Ej: Notebook Lenovo T14"
                                    value={form.nombre}
                                    onChange={onChange}
                                    required
                                    autoComplete="off"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-semibold">Marca</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="marca"
                                    placeholder="Ej: Lenovo"
                                    value={form.marca}
                                    onChange={onChange}
                                    autoComplete="off"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-semibold">Modelo</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="modelo"
                                    placeholder="Ej: T14"
                                    value={form.modelo}
                                    onChange={onChange}
                                    autoComplete="off"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-semibold">Tipo</Form.Label>
                                <Form.Select
                                    name="tipo"
                                    value={form.tipo}
                                    onChange={onChange}
                                >
                                    <option value="">Seleccionar tipo...</option>
                                    <option value="Notebook">Notebook</option>
                                    <option value="Desktop">Desktop</option>
                                    <option value="Workstation">Workstation</option>
                                    <option value="Servidor">Servidor</option>
                                    <option value="Monitor">Monitor</option>
                                    <option value="Impresora">Impresora</option>
                                    <option value="Tablet">Tablet</option>
                                    <option value="Telefono">Teléfono</option>
                                    <option value="Otro">Otro</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label className="small fw-semibold">Número de Serie</Form.Label>
                        <Form.Control
                            type="text"
                            name="numeroSerie"
                            placeholder="Ej: SN123456789"
                            value={form.numeroSerie}
                            onChange={onChange}
                            autoComplete="off"
                        />
                    </Form.Group>

                    <div className="d-grid">
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={loading}
                            size="sm"
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    Creando...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save me-2"></i>
                                    Crear Equipo
                                </>
                            )}
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
}
