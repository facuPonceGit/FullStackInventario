// frontend/src/components/Inicio.jsx
import { Card, Container, Row, Col, Badge } from 'react-bootstrap';

export default function Inicio() {
    return (
        <Container fluid className="px-3 py-4">
            <Row className="justify-content-center">
                <Col lg={10} xl={8}>
                    {/* Header Principal */}
                    <Card className="border-0 shadow-sm mb-4 bg-primary text-white">
                        <Card.Body className="text-center py-5">
                            <div className="mb-4">
                                <i className="fas fa-laptop-code fa-4x mb-3 text-white-50"></i>
                                <h1 className="display-4 fw-bold mb-3">Sistema de Gestion de Inventario Informatico</h1>
                                <p className="lead mb-0 opacity-75">
                                    Trabajo Final Integrador - Administración de Recursos
                                </p>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Información del Proyecto */}
                    <Row className="g-4">
                        <Col md={6}>
                            <Card className="h-100 border-0 shadow-sm">
                                <Card.Header className="bg-white border-0 py-3">
                                    <h5 className="mb-0 fw-bold text-primary">
                                        <i className="fas fa-info-circle me-2"></i>
                                        Información del Proyecto
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    <div className="mb-3">
                                        <Badge bg="secondary" className="mb-2">Materia</Badge>
                                        <p className="mb-0 fw-semibold">Administración de Recursos - 2025</p>
                                    </div>
                                    <div className="mb-3">
                                        <Badge bg="secondary" className="mb-2">Universidad Tecnologica Nacional</Badge>
                                        <p className="mb-0 fw-semibold">Facultad Regional Tucumán</p>
                                    </div>
                                    <div className="mb-3">
                                        <Badge bg="secondary" className="mb-2">Docentes</Badge>
                                        <p className="mb-0 fw-semibold">Cordero, Lucas Elio</p>
                                        <p className="mb-0 fw-semibold">Ugarte, Fernando Gabriel</p>
                                        <p className="mb-0 fw-semibold">QUIROGA HAMOUD, MARIA CELESTE
</p>

                                    </div>
                                    <div>
                                        <Badge bg="secondary" className="mb-2">Integrantes</Badge>
                                        <p className="mb-0 fw-semibold">Ponce, Aldo Facundo.</p>
                                        <p className="mb-0 fw-semibold">Veliz, Hector Matias.</p>
                                        <p className="mb-0 fw-semibold">Facundo, Singh.</p>
                                        <p className="mb-0 fw-semibold">Orellana Aguilera, Lucas Agustin</p>
                                        <p className="mb-0 fw-semibold">Cattolica, Patricio</p>


                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={6}>
                            <Card className="h-100 border-0 shadow-sm">
                                <Card.Header className="bg-white border-0 py-3">
                                    <h5 className="mb-0 fw-bold text-primary">
                                        <i className="fas fa-bullseye me-2"></i>
                                        Objetivos
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    <ul className="list-unstyled mb-0">

                                        <li className="mb-2">
                                            <i className="fas fa-check text-success me-2"></i>
                                            Inicio intuitivo con informacion general del proyecto.
                                        </li>

                                        <li className="mb-2">
                                            <i className="fas fa-check text-success me-2"></i>
                                            Navegabilidad clara.
                                        </li>

                                        <li className="mb-2">
                                            <i className="fas fa-check text-success me-2"></i>
                                            Alta de nuevos equipos informáticos.
                                        </li>

                                        <li className="mb-2">
                                            <i className="fas fa-check text-success me-2"></i>
                                            Busqueda y seleccion clara de equipos.
                                        </li>


                                        <li className="mb-2">
                                            <i className="fas fa-check text-success me-2"></i>
                                            Gestión de garantías, proveedores y ubicacion.
                                        </li>

                                        <li className="mb-2">
                                            <i className="fas fa-check text-success me-2"></i>
                                            Control de periféricos y componentes (agregar perifericos con su historico de agregados).
                                        </li>

                                        <li className="mb-2">
                                            <i className="fas fa-check text-success me-2"></i>
                                            Seguimiento de asignaciones a usuarios con historial de asignaciones.
                                        </li>

                                        <li className="mb-0">
                                            <i className="fas fa-check text-success me-2"></i>
                                            Registro de cambios con hstorial  de los mismos.
                                        </li>

                                        <li className="mb-2">
                                            <i className="fas fa-check text-success me-2"></i>
                                            Reportes ejecutivos dinamicos y graficos con opcion de descarga en formato pdf o planilla excel (.PDF , .xlsx ).
                                        </li>

                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Características Técnicas */}
                    <Card className="border-0 shadow-sm mt-4">
                        <Card.Header className="bg-white border-0 py-3">
                            <h5 className="mb-0 fw-bold text-primary">
                                <i className="fas fa-cogs me-2"></i>
                                Características Técnicas
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <Row className="g-4">
                                <Col md={4}>
                                    <div className="text-center">
                                        <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                                            <i className="fas fa-desktop fa-2x text-primary"></i>
                                        </div>
                                        <h6 className="fw-bold">Frontend</h6>
                                        <p className="text-muted small mb-0">
                                            React.js + Bootstrap<br />
                                            Interfaz responsiva<br />
                                            Componentes modulares
                                        </p>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="text-center">
                                        <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                                            <i className="fas fa-server fa-2x text-success"></i>
                                        </div>
                                        <h6 className="fw-bold">Backend</h6>
                                        <p className="text-muted small mb-0">
                                            .NET 8 + C#<br />
                                            API RESTful<br />
                                            Entity Framework
                                        </p>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="text-center">
                                        <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                                            <i className="fas fa-database fa-2x text-warning"></i>
                                        </div>
                                        <h6 className="fw-bold">Base de Datos</h6>
                                        <p className="text-muted small mb-0">
                                            MySQL<br />
                                            Esquema normalizado<br />
                                            Transacciones robustas.
                                        </p>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* Mensaje de Agradecimiento */}
                    <Card className="border-0 shadow-sm mt-4 bg-light">
                        <Card.Body className="text-center py-4">
                            <h6 className="fw-bold text-muted mb-3">
                                <i className="fas fa-graduation-cap me-2 text-primary"></i>
                                Agradecimiento Final
                            </h6>
                            <p className="text-muted mb-0">
                                Queremos expresar nuestro agradecimiento a los docentes de <strong>Administración de Recursos</strong> por su guía y acompañamiento durante el cursado,
                                por haber sido pilares fundamentales, compartiendo su conocimiento y experiencias prácticas en clase para enfrentar futuros desafío, creando un espacio de aprendizaje en el cual desarrollar habilidades para enfrentarnos a problemas reales y grandes desafíos.
                                Gracias por todo!


                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
