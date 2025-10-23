// frontend/src/components/Perifericos.jsx
import { useEffect, useState } from 'react';
import { Card, Table, Form, Button, Row, Col, Alert, Badge } from 'react-bootstrap';
import { listarPerifericos, agregarPeriferico } from '../api/equipos';

export default function Perifericos({ equipoId, onSaved }) {
    const [list, setList] = useState([]);
    const [form, setForm] = useState({ tipo: '', marca: '', modelo: '', numeroSerie: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const load = async () => {
        try {
            const perifericos = await listarPerifericos(equipoId);
            setList(perifericos);
        } catch (error) {
            console.error("Error cargando periféricos:", error);
            setError("Error al cargar los periféricos");
        }
    };

    useEffect(() => {
        if (equipoId) load();
    }, [equipoId]);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const add = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await agregarPeriferico(equipoId, form);
            setForm({ tipo: '', marca: '', modelo: '', numeroSerie: '' });
            setSuccess(true);
            load();
            onSaved?.();
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error("Error agregando periférico:", error);
            setError("Error al agregar el periférico");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">
                    <i className="fas fa-keyboard me-2"></i>
                    Periféricos del Equipo
                </h5>
                <Badge bg="secondary">{list.length} registros</Badge>
            </div>

            {success && (
                <Alert variant="success" className="py-2">
                    <i className="fas fa-check me-2"></i>
                    Periférico agregado exitosamente
                </Alert>
            )}

            {error && (
                <Alert variant="danger" className="py-2">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                </Alert>
            )}

            {/* Lista de Periféricos */}
            <Card className="mb-4">
                <Card.Header>
                    <h6 className="mb-0">
                        <i className="fas fa-list me-2"></i>
                        Lista de Periféricos
                    </h6>
                </Card.Header>
                <Card.Body className="p-0">
                    {list.length > 0 ? (
                        <Table striped hover responsive className="mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th width="20%">Tipo</th>
                                    <th width="20%">Marca</th>
                                    <th width="20%">Modelo</th>
                                    <th width="30%">Número de Serie</th>
                                    <th width="10%">ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.map(p => (
                                    <tr key={p.id}>
                                        <td>
                                            <Badge bg="primary">{p.tipo}</Badge>
                                        </td>
                                        <td>{p.marca || "—"}</td>
                                        <td>{p.modelo || "—"}</td>
                                        <td>
                                            <code>{p.numeroSerie || "—"}</code>
                                        </td>
                                        <td>
                                            <small className="text-muted">#{p.id}</small>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <div className="text-center py-4">
                            <i className="fas fa-keyboard fa-2x text-muted mb-3"></i>
                            <p className="text-muted mb-0">No hay periféricos registrados</p>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Formulario para agregar periférico */}
            <Card>
                <Card.Header>
                    <h6 className="mb-0">
                        <i className="fas fa-plus me-2"></i>
                        Agregar Nuevo Periférico
                    </h6>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={add}>
                        <Row>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tipo *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="tipo"
                                        placeholder="Monitor, Teclado, etc."
                                        value={form.tipo}
                                        onChange={onChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Marca</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="marca"
                                        placeholder="Marca"
                                        value={form.marca}
                                        onChange={onChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Modelo</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="modelo"
                                        placeholder="Modelo"
                                        value={form.modelo}
                                        onChange={onChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Número de Serie</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="numeroSerie"
                                        placeholder="Número de serie"
                                        value={form.numeroSerie}
                                        onChange={onChange}
                                    />
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
                                        Agregando...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-plus me-2"></i>
                                        Agregar Periférico
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
