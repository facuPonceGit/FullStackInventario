// frontend/src/App.jsx
import { useState } from 'react';
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap';
import EquipoForm from './components/EquipoForm';
import EquipoList from './components/EquipoList';
import EquipoDetalle from './components/EquipoDetalle';

export default function App() {
    const [refreshKey, setRefreshKey] = useState(0);
    const [selected, setSelected] = useState(null);

    return (
        <>
            {/* Header/Navigation */}
            <Navbar bg="primary" variant="dark" expand="lg" className="mb-3 shadow-sm">
                <Container fluid>
                    <Navbar.Brand href="#" className="fw-bold">
                        <i className="fas fa-laptop-code me-2"></i>
                        Sistema de Inventario
                    </Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="#equipos" className="fw-semibold">
                            <i className="fas fa-desktop me-1"></i>
                            Equipos
                        </Nav.Link>
                        <Nav.Link href="#reportes" className="fw-semibold">
                            <i className="fas fa-chart-bar me-1"></i>
                            Reportes
                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>

            {/* Main Content */}
            <Container fluid className="px-3">
                <Row className="g-3">
                    {/* Sidebar - Lista y Formulario */}
                    <Col lg={4} className="d-flex flex-column gap-3">
                        <div className="flex-grow-0">
                            <EquipoForm onCreated={() => setRefreshKey(k => k + 1)} />
                        </div>
                        <div className="flex-grow-1" style={{ minHeight: '400px' }}>
                            <EquipoList
                                key={refreshKey}
                                onSelect={setSelected}
                                selectedEquipo={selected}
                            />
                        </div>
                    </Col>

                    {/* Main Content - Detalles */}
                    <Col lg={8}>
                        <EquipoDetalle equipo={selected} onEquipoUpdated={() => setRefreshKey(k => k + 1)} />
                    </Col>
                </Row>
            </Container>

            {/* Footer */}
            <footer className="bg-light text-center py-3 mt-4 border-top">
                <Container fluid>
                    <p className="mb-0 text-muted small">
                        &copy; 2025 Sistema de Inventario - Desarrollado con React y .NET
                    </p>
                </Container>
            </footer>
        </>
    );
}
