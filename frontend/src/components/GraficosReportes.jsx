// frontend/src/components/GraficosReportes.jsx
import { useEffect, useRef } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import Chart from 'chart.js/auto';

export default function GraficosReportes({ resumen, garantias, asignaciones }) {
    const chartTipoRef = useRef(null);
    const chartGarantiasRef = useRef(null);
    const chartAsignacionesRef = useRef(null);

    const chartTipoInstance = useRef(null);
    const chartGarantiasInstance = useRef(null);
    const chartAsignacionesInstance = useRef(null);

    useEffect(() => {
        if (resumen?.distribucionPorTipo && chartTipoRef.current) {
            // Destruir gráfico anterior si existe
            if (chartTipoInstance.current) {
                chartTipoInstance.current.destroy();
            }

            const ctx = chartTipoRef.current.getContext('2d');
            chartTipoInstance.current = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: resumen.distribucionPorTipo.map(item => item.tipo),
                    datasets: [{
                        data: resumen.distribucionPorTipo.map(item => item.cantidad),
                        backgroundColor: [
                            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
                            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                        ],
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'right',
                        },
                        title: {
                            display: true,
                            text: 'Distribución por Tipo de Equipo'
                        }
                    }
                }
            });
        }
    }, [resumen]);

    useEffect(() => {
        if (garantias && chartGarantiasRef.current) {
            if (chartGarantiasInstance.current) {
                chartGarantiasInstance.current.destroy();
            }

            const ctx = chartGarantiasRef.current.getContext('2d');
            chartGarantiasInstance.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Vigentes', 'Por Vencer', 'Vencidas', 'Sin Garantía'],
                    datasets: [{
                        label: 'Cantidad de Equipos',
                        data: [
                            garantias.garantiasVigentes,
                            garantias.garantiasPorVencer,
                            garantias.garantiasVencidas,
                            garantias.sinGarantia
                        ],
                        backgroundColor: [
                            '#28a745',
                            '#ffc107',
                            '#dc3545',
                            '#6c757d'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Estado de Garantías'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }, [garantias]);

    useEffect(() => {
        if (asignaciones?.asignacionesPorArea && chartAsignacionesRef.current) {
            if (chartAsignacionesInstance.current) {
                chartAsignacionesInstance.current.destroy();
            }

            const ctx = chartAsignacionesRef.current.getContext('2d');
            chartAsignacionesInstance.current = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: asignaciones.asignacionesPorArea.map(item => item.area),
                    datasets: [{
                        data: asignaciones.asignacionesPorArea.map(item => item.cantidad),
                        backgroundColor: [
                            '#007bff', '#6610f2', '#6f42c1', '#e83e8c', '#fd7e14',
                            '#20c997', '#17a2b8', '#ffc107', '#28a745', '#dc3545'
                        ],
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                        },
                        title: {
                            display: true,
                            text: 'Asignaciones por Área'
                        }
                    }
                }
            });
        }
    }, [asignaciones]);

    // Cleanup al desmontar el componente
    useEffect(() => {
        return () => {
            if (chartTipoInstance.current) chartTipoInstance.current.destroy();
            if (chartGarantiasInstance.current) chartGarantiasInstance.current.destroy();
            if (chartAsignacionesInstance.current) chartAsignacionesInstance.current.destroy();
        };
    }, []);

    return (
        <Row className="g-3 mt-4">
            <Col lg={4}>
                <Card className="border-0 shadow-sm h-100">
                    <Card.Header className="bg-white border-0">
                        <h6 className="mb-0 fw-bold">
                            <i className="fas fa-chart-pie me-2 text-primary"></i>
                            Distribución por Tipo
                        </h6>
                    </Card.Header>
                    <Card.Body>
                        <canvas ref={chartTipoRef}></canvas>
                    </Card.Body>
                </Card>
            </Col>

            <Col lg={4}>
                <Card className="border-0 shadow-sm h-100">
                    <Card.Header className="bg-white border-0">
                        <h6 className="mb-0 fw-bold">
                            <i className="fas fa-chart-bar me-2 text-warning"></i>
                            Estado de Garantías
                        </h6>
                    </Card.Header>
                    <Card.Body>
                        <canvas ref={chartGarantiasRef}></canvas>
                    </Card.Body>
                </Card>
            </Col>

            <Col lg={4}>
                <Card className="border-0 shadow-sm h-100">
                    <Card.Header className="bg-white border-0">
                        <h6 className="mb-0 fw-bold">
                            <i className="fas fa-chart-pie me-2 text-info"></i>
                            Asignaciones por Área
                        </h6>
                    </Card.Header>
                    <Card.Body>
                        <canvas ref={chartAsignacionesRef}></canvas>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}
