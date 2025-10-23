// frontend/src/components/EquipoList.jsx
import { useEffect, useState } from 'react';
import { Card, Table, Button, Badge, Spinner, InputGroup, Form } from 'react-bootstrap';
import { listarEquipos } from '../api/equipos';

export default function EquipoList({ onSelect, selectedEquipo }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const load = async () => {
        setLoading(true);
        try {
            setData(await listarEquipos());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const filteredData = data.filter(equipo =>
        equipo.codigoInventario.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipo.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipo.tipo?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Card className="h-100 shadow-sm">
            <Card.Header className="bg-white py-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="mb-0 fw-bold">
                        <i className="fas fa-list me-2"></i>
                        Equipos
                    </h5>
                    <Button variant="outline-primary" size="sm" onClick={load} className="flex-shrink-0">
                        <i className="fas fa-sync-alt"></i>
                    </Button>
                </div>

                <InputGroup size="sm">
                    <Form.Control
                        placeholder="Buscar equipos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <InputGroup.Text>
                        <i className="fas fa-search"></i>
                    </InputGroup.Text>
                </InputGroup>
            </Card.Header>

            <Card.Body className="p-0 d-flex flex-column">
                {loading ? (
                    <div className="text-center py-4 flex-grow-1 d-flex flex-column justify-content-center">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2 text-muted mb-0">Cargando equipos...</p>
                    </div>
                ) : (
                    <>
                        <div className="px-3 py-2 border-bottom bg-light">
                            <small className="text-muted">
                                Mostrando {filteredData.length} de {data.length} equipos
                            </small>
                        </div>

                        <div className="flex-grow-1" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            <Table hover className="mb-0">
                                <thead className="bg-light sticky-top">
                                    <tr>
                                        <th width="80">ID</th>
                                        <th width="120">Código</th>
                                        <th>Nombre</th>
                                        <th width="100" className="text-center">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map(equipo => (
                                        <tr
                                            key={equipo.id}
                                            onClick={() => onSelect?.(equipo)}
                                            style={{ cursor: 'pointer' }}
                                            className={selectedEquipo?.id === equipo.id ? 'table-active' : ''}
                                        >
                                            <td>
                                                <Badge bg="outline-secondary" text="dark" className="border">
                                                    #{equipo.id}
                                                </Badge>
                                            </td>
                                            <td>
                                                <small className="fw-semibold text-truncate d-block">
                                                    {equipo.codigoInventario}
                                                </small>
                                            </td>
                                            <td>
                                                <div className="d-flex flex-column">
                                                    <span className="fw-medium">{equipo.nombre}</span>
                                                    <small className="text-muted text-truncate">
                                                        {equipo.marca} {equipo.modelo}
                                                    </small>
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <Badge bg={equipo.activo ? "success" : "secondary"} className="fs-3">
                                                    {equipo.activo ? "✓" : "✗"}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </>
                )}

                {!loading && filteredData.length === 0 && (
                    <div className="text-center py-5 flex-grow-1 d-flex flex-column justify-content-center">
                        <i className="fas fa-inbox fa-2x text-muted mb-3 opacity-50"></i>
                        <p className="text-muted mb-2">
                            {searchTerm ? 'No se encontraron equipos' : 'No hay equipos registrados'}
                        </p>
                        {searchTerm && (
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => setSearchTerm('')}
                            >
                                Limpiar búsqueda
                            </Button>
                        )}
                    </div>
                )}
            </Card.Body>
        </Card>
    );
}
