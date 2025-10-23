// frontend/src/components/Ubicacion.jsx
import { useEffect, useState } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { listarUbicaciones } from '../api/catalogos';
import { cambiarUbicacion } from '../api/equipos';

export default function Ubicacion({ equipoId, detalle, onSaved }) {
    const [ubicaciones, setUbicaciones] = useState([]);
    const [selectedUbicacion, setSelectedUbicacion] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        listarUbicaciones().then(setUbicaciones);
    }, []);

    // Actualizar selección cuando cambia el detalle
    useEffect(() => {
        if (detalle) {
            setSelectedUbicacion(detalle.ubicacionId?.toString() || '');
        }
    }, [detalle]);

    const save = async () => {
        if (!equipoId) return;

        setLoading(true);
        try {
            // Convertir a número o null
            const ubicacionId = selectedUbicacion ? parseInt(selectedUbicacion) : null;
            await cambiarUbicacion(equipoId, ubicacionId);
            onSaved?.();
        } catch (error) {
            console.error("Error guardando ubicación:", error);
            alert("Error al guardar la ubicación");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="h-100">
            <Card.Header className="bg-white py-3">
                <h6 className="mb-0 fw-bold">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    Ubicación
                </h6>
            </Card.Header>
            <Card.Body>
                {/* Mostrar ubicación actual */}
                {detalle?.ubicacionNombre && (
                    <div className="mb-3 p-3 bg-light rounded">
                        <h6 className="mb-1 text-muted">Ubicación Actual:</h6>
                        <p className="mb-0 fw-semibold text-primary">{detalle.ubicacionNombre}</p>
                    </div>
                )}

                <Form>
                    <Row className="g-3">
                        <Col md={8}>
                            <Form.Group>
                                <Form.Label className="small fw-semibold">Seleccionar Ubicación</Form.Label>
                                <Form.Select
                                    value={selectedUbicacion}
                                    onChange={(e) => setSelectedUbicacion(e.target.value)}
                                    size="sm"
                                >
                                    <option value="">(sin ubicación)</option>
                                    {ubicaciones.map(u => (
                                        <option key={u.id} value={u.id}>
                                            {u.nombre}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <div className="d-grid" style={{ paddingTop: '1.7rem' }}>
                                <Button
                                    onClick={save}
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
