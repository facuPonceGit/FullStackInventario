// frontend/src/components/Reportes.jsx
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge } from 'react-bootstrap';
import {
    obtenerResumen,
    obtenerGarantias,
    obtenerAsignaciones,
    descargarExcel,
    descargarPdf
} from '../api/reportes';
import GraficosReportes from './GraficosReportes';


export default function Reportes() {
    const [resumen, setResumen] = useState(null);
    const [garantias, setGarantias] = useState(null);
    const [asignaciones, setAsignaciones] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState({ excel: false, pdf: false });


    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const [res, gar, asig] = await Promise.all([
                obtenerResumen(),
                obtenerGarantias(),
                obtenerAsignaciones()
            ]);
            setResumen(res);
            setGarantias(gar);
            setAsignaciones(asig);
        } catch (error) {
            console.error("Error cargando reportes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDescargarExcel = async () => {
        setDownloading(prev => ({ ...prev, excel: true }));
        try {
            const response = await descargarExcel();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `reporte_inventario_${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            // Mostrar notificación de éxito
            alert('Reporte Excel descargado exitosamente');
        } catch (error) {
            console.error("Error descargando Excel:", error);
            alert('Error al descargar el reporte Excel');
        } finally {
            setDownloading(prev => ({ ...prev, excel: false }));
        }
    };

    const handleDescargarPdf = async () => {
        setDownloading(prev => ({ ...prev, pdf: true }));
        try {
            const response = await descargarPdf();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `reporte_inventario_${new Date().toISOString().split('T')[0]}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            // Mostrar notificación de éxito
            alert('Reporte PDF descargado exitosamente');
        } catch (error) {
            console.error("Error descargando PDF:", error);
            alert('Error al descargar el reporte PDF');
        } finally {
            setDownloading(prev => ({ ...prev, pdf: false }));
        }
    };








    if (loading) {
        return (
            <Container fluid className="px-3 py-4">
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando reportes...</span>
                    </div>
                    <p className="mt-3 text-muted">Cargando reportes ejecutivos...</p>
                </div>
            </Container>
        );
    }

    return (
        <Container fluid className="px-3 py-4">
            {/* Header */}
            <Row className="mb-4">
                <Col>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="mb-1 fw-bold">
                                <i className="fas fa-chart-bar me-2 text-primary"></i>
                                Reportes Ejecutivos
                            </h2>
                            <p className="text-muted mb-0">
                                Dashboard de métricas y análisis para toma de decisiones
                            </p>
                        </div>
                        <div>
                            <Button
                                variant="success"
                                className="me-2"
                                onClick={handleDescargarExcel}
                                disabled={downloading.excel}
                            >
                                {downloading.excel ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Generando...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-file-excel me-2"></i>
                                        Exportar Excel
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleDescargarPdf}
                                disabled={downloading.pdf}
                            >
                                {downloading.pdf ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Generando...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-file-pdf me-2"></i>
                                        Exportar PDF
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* KPIs Principales */}
            <Row className="g-3 mb-4">
                <Col md={3}>
                    <Card className="h-100 border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <div className="text-primary mb-2">
                                <i className="fas fa-laptop fa-2x"></i>
                            </div>
                            <h3 className="text-primary mb-1">{resumen?.totalEquipos}</h3>
                            <p className="text-muted mb-0">Total Equipos</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="h-100 border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <div className="text-success mb-2">
                                <i className="fas fa-check-circle fa-2x"></i>
                            </div>
                            <h3 className="text-success mb-1">{resumen?.equiposActivos}</h3>
                            <p className="text-muted mb-0">Equipos Activos</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="h-100 border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <div className="text-info mb-2">
                                <i className="fas fa-users fa-2x"></i>
                            </div>
                            <h3 className="text-info mb-1">{resumen?.equiposAsignados}</h3>
                            <p className="text-muted mb-0">Equipos Asignados</p>
                        </Card.Body>
                    </Card>
                </Col>


                <Col md={3}>
                    <Card className="h-100 border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <div className="text-secondary mb-2">
                                <i className="fas fa-laptop-medical fa-2x"></i>
                            </div>
                            <h3 className="text-secondary mb-1">{resumen?.equiposSinAsignar}</h3>
                            <p className="text-muted mb-0">Equipos Sin Asignar</p>
                        </Card.Body>
                    </Card>
                </Col>


                <Col md={3}>
                    <Card className="h-100 border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <div className="text-warning mb-2">
                                <i className="fas fa-shield-alt fa-2x"></i>
                            </div>
                            <h3 className="text-warning mb-1">{garantias?.garantiasVigentes}</h3>
                            <p className="text-muted mb-0">Garantías Vigentes</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="g-3">
                {/* Distribución por Tipo */}
                <Col lg={6}>
                    <Card className="h-100 border-0 shadow-sm">
                        <Card.Header className="bg-white border-0">
                            <h5 className="mb-0 fw-bold">
                                <i className="fas fa-chart-pie me-2 text-primary"></i>
                                Distribución por Tipo
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            {resumen?.distribucionPorTipo && resumen.distribucionPorTipo.length > 0 ? (
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th>Tipo</th>
                                            <th className="text-center">Cantidad</th>
                                            <th className="text-center">Porcentaje</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resumen.distribucionPorTipo.map(item => (
                                            <tr key={item.tipo}>
                                                <td>
                                                    <Badge bg="primary" className="me-2">
                                                        {item.tipo.substring(0, 3).toUpperCase()}
                                                    </Badge>
                                                    {item.tipo}
                                                </td>
                                                <td className="text-center fw-bold">{item.cantidad}</td>
                                                <td className="text-center">
                                                    <Badge bg="outline-secondary" text="dark">
                                                        {item.porcentaje}%
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <div className="text-center py-4 text-muted">
                                    <i className="fas fa-inbox fa-2x mb-3 opacity-50"></i>
                                    <p>No hay datos de distribución</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Estado de Garantías */}
                <Col lg={6}>
                    <Card className="h-100 border-0 shadow-sm">
                        <Card.Header className="bg-white border-0">
                            <h5 className="mb-0 fw-bold">
                                <i className="fas fa-calendar-check me-2 text-warning"></i>
                                Estado de Garantías
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <Row className="text-center mb-3">
                                <Col md={3}>
                                    <div className="border rounded p-2 bg-success bg-opacity-10">
                                        <h4 className="text-success mb-1">{garantias?.garantiasVigentes}</h4>
                                        <small className="text-muted">Vigentes</small>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="border rounded p-2 bg-warning bg-opacity-10">
                                        <h4 className="text-warning mb-1">{garantias?.garantiasPorVencer}</h4>
                                        <small className="text-muted">Por Vencer</small>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="border rounded p-2 bg-danger bg-opacity-10">
                                        <h4 className="text-danger mb-1">{garantias?.garantiasVencidas}</h4>
                                        <small className="text-muted">Vencidas</small>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="border rounded p-2 bg-secondary bg-opacity-10">
                                        <h4 className="text-secondary mb-1">{garantias?.sinGarantia}</h4>
                                        <small className="text-muted">Sin Garantía</small>
                                    </div>
                                </Col>
                            </Row>

                            {garantias?.proximasAVencer && garantias.proximasAVencer.length > 0 && (
                                <div>
                                    <h6 className="mb-3">Próximas a Vencer (30 días):</h6>
                                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                        {garantias.proximasAVencer.map(item => (
                                            <div key={item.equipoId} className="d-flex justify-content-between align-items-center border-bottom py-2">
                                                <div>
                                                    <strong>{item.codigoInventario}</strong>
                                                    <br />
                                                    <small className="text-muted">{item.nombre}</small>
                                                </div>
                                                <Badge bg={item.diasRestantes < 15 ? "danger" : "warning"}>
                                                    {item.diasRestantes} días
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="g-3 mt-3">
                {/* Asignaciones por Área */}
                <Col lg={6}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white border-0">
                            <h5 className="mb-0 fw-bold">
                                <i className="fas fa-network-wired me-2 text-info"></i>
                                Asignaciones por Área
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            {asignaciones?.asignacionesPorArea && asignaciones.asignacionesPorArea.length > 0 ? (
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th>Área</th>
                                            <th className="text-center">Equipos</th>
                                            <th className="text-center">Distribución</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {asignaciones.asignacionesPorArea.map(item => (
                                            <tr key={item.area}>
                                                <td>{item.area}</td>
                                                <td className="text-center fw-bold">{item.cantidad}</td>
                                                <td className="text-center">
                                                    <div className="progress" style={{ height: '8px' }}>
                                                        <div
                                                            className="progress-bar bg-info"
                                                            style={{ width: `${item.porcentaje}%` }}
                                                        ></div>
                                                    </div>
                                                    <small className="text-muted">{item.porcentaje}%</small>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <div className="text-center py-4 text-muted">
                                    <i className="fas fa-users fa-2x mb-3 opacity-50"></i>
                                    <p>No hay asignaciones activas</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Top Usuarios con más Equipos */}
                <Col lg={6}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white border-0">
                            <h5 className="mb-0 fw-bold">
                                <i className="fas fa-trophy me-2 text-warning"></i>
                                Top Usuarios
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            {asignaciones?.topUsuarios && asignaciones.topUsuarios.length > 0 ? (
                                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {asignaciones.topUsuarios.map((usuario, index) => (
                                        <div key={index} className="d-flex justify-content-between align-items-center border-bottom py-2">
                                            <div>
                                                <strong>{usuario.usuarioNombre}</strong>
                                                <br />
                                                <small className="text-muted">{usuario.area}</small>
                                            </div>
                                            <div className="text-end">
                                                <Badge bg="primary" className="fs-6">
                                                    {usuario.cantidadEquipos} equipos
                                                </Badge>
                                                <div>
                                                    <small className="text-muted">
                                                        {index === 0 && '🥇 '}
                                                        {index === 1 && '🥈 '}
                                                        {index === 2 && '🥉 '}
                                                        Top {index + 1}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-muted">
                                    <i className="fas fa-user fa-2x mb-3 opacity-50"></i>
                                    <p>No hay datos de usuarios</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>


                <GraficosReportes
                    resumen={resumen}
                    garantias={garantias}
                    asignaciones={asignaciones}
                />

            </Row>
        </Container>
    );
}
