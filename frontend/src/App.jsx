// frontend/src/App.jsx
import { Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import EquipoForm from './components/EquipoForm';
import EquipoList from './components/EquipoList';
import EquipoDetalle from './components/EquipoDetalle';
import Reportes from './components/Reportes';
import Inicio from './components/Inicio';

export default function App() {
    const [refreshKey, setRefreshKey] = useState(0);
    const [selected, setSelected] = useState(null);
    const [currentView, setCurrentView] = useState('inicio'); // 'inicio', 'equipos', 'reportes'

    const renderContent = () => {
        switch (currentView) {
            case 'equipos':
                return (
                    <Row className="g-3">
                        <Col lg={4} className="d-flex flex-column gap-3">
                            <EquipoForm onCreated={() => setRefreshKey(k => k + 1)} />
                            <EquipoList
                                key={refreshKey}
                                onSelect={setSelected}
                                selectedEquipo={selected}
                            />
                        </Col>
                        <Col lg={8}>
                            <EquipoDetalle equipo={selected} onEquipoUpdated={() => setRefreshKey(k => k + 1)} />
                        </Col>
                    </Row>
                );
            case 'reportes':
                return <Reportes />;
            case 'inicio':
            default:
                return <Inicio />;
        }
    };

    return (
        <>
            {/* Header/Navigation */}
            <Navbar bg="primary" variant="dark" expand="lg" className="mb-3 shadow-sm">
                <Container fluid>
                    <Navbar.Brand
                        href="#"
                        onClick={() => setCurrentView('inicio')}
                        style={{ cursor: 'pointer' }}
                        className="fw-bold"
                    >
                        <i className="fas fa-laptop-code me-2"></i>
                        Inicio
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link
                                href="#equipos"
                                onClick={() => setCurrentView('equipos')}
                                className="fw-semibold"
                                active={currentView === 'equipos'}
                            >
                                <i className="fas fa-desktop me-1"></i>
                                Equipos
                            </Nav.Link>
                            <Nav.Link
                                href="#reportes"
                                onClick={() => setCurrentView('reportes')}
                                className="fw-semibold"
                                active={currentView === 'reportes'}
                            >
                                <i className="fas fa-chart-bar me-1"></i>
                                Reportes
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Main Content */}
            <Container fluid className="px-3">
                {renderContent()}
            </Container>

            {/* Footer */}
            <footer className="bg-light text-center py-3 mt-4 border-top">
                <Container fluid>
                    <p className="mb-0 text-muted small">
                        &copy; 2025 Sistema de Inventario - UTN FRT - Administración de Recursos - Trabajo Final Integrador
                    </p>
                </Container>
            </footer>
        </>
    );
}
