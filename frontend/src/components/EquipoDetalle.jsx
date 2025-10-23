// frontend/src/components/EquipoDetalle.jsx
import { useEffect, useState } from "react";
import { Card, Row, Col, Badge, Button, Spinner, Tabs, Tab } from "react-bootstrap";
import { obtenerDetalle } from "../api/equipos";
import Perifericos from "./Perifericos";
import Historial from "./Historial";
import CompraGarantia from "./CompraGarantia";
import Ubicacion from "./Ubicacion";
import Asignacion from "./Asignacion";
import { fmtDate } from "../utils/format";

export default function EquipoDetalle({ equipo, onEquipoUpdated }) {
    const [detalle, setDetalle] = useState(null);
    const [refreshCounter, setRefreshCounter] = useState(0);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("general");

    async function load() {
        if (!equipo?.id) {
            setDetalle(null);
            return;
        }
        setLoading(true);
        try {
            const data = await obtenerDetalle(equipo.id);
            setDetalle(data);
            onEquipoUpdated?.();
        } catch (error) {
            console.error("Error cargando detalle:", error);
            alert("Error al cargar los datos del equipo");
        } finally {
            setLoading(false);
        }
    }

    const forceRefresh = () => {
        setRefreshCounter(prev => prev + 1);
    };

    useEffect(() => {
        load();
    }, [equipo?.id, refreshCounter]);

    // Estado vacío - no mostrar nada hasta que se seleccione un equipo
    if (!equipo) {
        return (
            <Card className="h-100 border-dashed">
                <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center text-muted py-5">
                    <i className="fas fa-mouse-pointer fa-3x mb-3 opacity-50"></i>
                    <h5 className="fw-normal">Seleccione un equipo</h5>
                    <p className="mb-0">Haga clic en un equipo de la lista para ver sus detalles</p>
                </Card.Body>
            </Card>
        );
    }

    if (loading) {
        return (
            <Card className="h-100">
                <Card.Body className="d-flex flex-column justify-content-center align-items-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted">Cargando detalles del equipo...</p>
                </Card.Body>
            </Card>
        );
    }

    return (
        <div className="h-100 d-flex flex-column">
            {/* Header compacto con información como texto */}
            <Card className="mb-3 shadow-sm">
                <Card.Body className="py-3">
                    <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-2">
                                <Badge bg="secondary" className="fs-6 me-2">#{equipo.id}</Badge>
                                <h4 className="mb-0 fw-bold text-truncate">{equipo.nombre}</h4>
                            </div>

                            {/* Información del equipo como TEXTO */}
                            <Row className="g-3">
                                <Col sm={6} md={3}>
                                    <div>
                                        <small className="text-muted d-block">Código</small>
                                        <strong className="text-primary">{equipo.codigoInventario}</strong>
                                    </div>
                                </Col>
                                <Col sm={6} md={3}>
                                    <div>
                                        <small className="text-muted d-block">Marca</small>
                                        <strong>{equipo.marca || "—"}</strong>
                                    </div>
                                </Col>
                                <Col sm={6} md={3}>
                                    <div>
                                        <small className="text-muted d-block">Modelo</small>
                                        <strong>{equipo.modelo || "—"}</strong>
                                    </div>
                                </Col>
                                <Col sm={6} md={3}>
                                    <div>
                                        <small className="text-muted d-block">Tipo</small>
                                        <Badge bg="info" className="fw-normal">{equipo.tipo || "Sin tipo"}</Badge>
                                    </div>
                                </Col>
                            </Row>

                            {/* Información adicional si está disponible en el detalle */}
                            {detalle && (
                                <Row className="g-3 mt-2 pt-2 border-top">
                                    {(detalle.fechaAdquisicion || detalle.fechaVencGarantia) && (
                                        <Col sm={6} md={4}>
                                            <div>
                                                <small className="text-muted d-block">Compra/Garantía</small>
                                                <small>
                                                    {detalle.fechaAdquisicion ? fmtDate(detalle.fechaAdquisicion) : "—"} /{" "}
                                                    {detalle.fechaVencGarantia ? fmtDate(detalle.fechaVencGarantia) : "—"}
                                                </small>
                                            </div>
                                        </Col>
                                    )}
                                    {detalle.proveedorNombre && (
                                        <Col sm={6} md={4}>
                                            <div>
                                                <small className="text-muted d-block">Proveedor</small>
                                                <small>{detalle.proveedorNombre}</small>
                                            </div>
                                        </Col>
                                    )}
                                    {detalle.ubicacionNombre && (
                                        <Col sm={6} md={4}>
                                            <div>
                                                <small className="text-muted d-block">Ubicación</small>
                                                <small>{detalle.ubicacionNombre}</small>
                                            </div>
                                        </Col>
                                    )}
                                </Row>
                            )}
                        </div>
                        <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={forceRefresh}
                            className="flex-shrink-0"
                        >
                            <i className="fas fa-sync-alt"></i>
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            {/* Tabs mejorados */}
            <Card className="flex-grow-1 shadow-sm">
                <Card.Body className="p-0 d-flex flex-column h-100">
                    <Tabs
                        activeKey={activeTab}
                        onSelect={(tab) => setActiveTab(tab)}
                        className="px-3 pt-3 border-bottom"
                        fill
                    >
                        <Tab eventKey="general" title={
                            <span className="d-flex align-items-center">
                                <i className="fas fa-info-circle me-2"></i>
                                General
                            </span>
                        }>
                            <div className="p-3 flex-grow-1">
                                <Row className="g-3">
                                    <Col xl={6}>
                                        <CompraGarantia equipoId={equipo.id} detalle={detalle} onSaved={forceRefresh} />
                                    </Col>
                                    <Col xl={6}>
                                        <Ubicacion equipoId={equipo.id} detalle={detalle} onSaved={forceRefresh} />
                                    </Col>
                                </Row>
                            </div>
                        </Tab>

                        <Tab eventKey="perifericos" title={
                            <span className="d-flex align-items-center">
                                <i className="fas fa-keyboard me-2"></i>
                                Periféricos
                                {detalle?.perifericos?.length > 0 && (
                                    <Badge bg="primary" className="ms-1">
                                        {detalle.perifericos.length}
                                    </Badge>
                                )}
                            </span>
                        }>
                            <div className="p-3 flex-grow-1">
                                <Perifericos equipoId={equipo.id} onSaved={forceRefresh} />
                            </div>
                        </Tab>

                        <Tab eventKey="asignaciones" title={
                            <span className="d-flex align-items-center">
                                <i className="fas fa-users me-2"></i>
                                Asignaciones
                            </span>
                        }>
                            <div className="p-3 flex-grow-1">
                                <Asignacion equipoId={equipo.id} onSaved={forceRefresh} />
                            </div>
                        </Tab>

                        <Tab eventKey="historial" title={
                            <span className="d-flex align-items-center">
                                <i className="fas fa-history me-2"></i>
                                Historial
                                {detalle?.historial?.length > 0 && (
                                    <Badge bg="primary" className="ms-1">
                                        {detalle.historial.length}
                                    </Badge>
                                )}
                            </span>
                        }>
                            <div className="p-3 flex-grow-1">
                                <Historial equipoId={equipo.id} onSaved={forceRefresh} />
                            </div>
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </div>
    );
}
