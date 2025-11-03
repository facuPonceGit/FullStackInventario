// backend/Services/ReportesService.cs
using BackendApi.Data;
using BackendApi.Dtos;
using ClosedXML.Excel;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace BackendApi.Services
{
    public interface IReportesService
    {
        Task<ReporteResumenDto> ObtenerResumenAsync();
        Task<ReporteGarantiasDto> ObtenerEstadoGarantiasAsync();
        Task<ReporteAsignacionesDto> ObtenerAsignacionesAsync();
        Task<byte[]> GenerarReporteExcelAsync();
        Task<byte[]> GenerarReportePdfAsync();
    }

    public class ReportesService : IReportesService
    {
        private readonly IDatabaseProvider _db;
        public ReportesService(IDatabaseProvider db) => _db = db;

        public async Task<ReporteResumenDto> ObtenerResumenAsync()
        {
            var totalEquipos = await _db.QuerySingleOrDefaultAsync<int>("SELECT COUNT(*) FROM equipos");
            var activos = await _db.QuerySingleOrDefaultAsync<int>("SELECT COUNT(*) FROM equipos WHERE Activo = 1");
            var asignados = await _db.QuerySingleOrDefaultAsync<int>(
                "SELECT COUNT(DISTINCT EquipoId) FROM asignaciones WHERE FechaHasta IS NULL");

            var porTipo = await _db.QueryAsync<EquiposPorTipoDto>(@"
                SELECT Tipo, COUNT(*) as Cantidad, 
                       ROUND((COUNT(*) * 100.0 / CAST(@Total AS DECIMAL)), 2) as Porcentaje
                FROM equipos 
                WHERE Tipo IS NOT NULL AND Tipo != ''
                GROUP BY Tipo 
                ORDER BY Cantidad DESC",
                new { Total = totalEquipos });

            var porUbicacion = await _db.QueryAsync<EquiposPorUbicacionDto>(@"
                SELECT u.Nombre as Ubicacion, COUNT(*) as Cantidad,
                       ROUND((COUNT(*) * 100.0 / CAST(@Total AS DECIMAL)), 2) as Porcentaje
                FROM equipos e
                LEFT JOIN ubicaciones u ON u.Id = e.UbicacionId
                GROUP BY u.Nombre
                ORDER BY Cantidad DESC",
                new { Total = totalEquipos });

            return new ReporteResumenDto
            {
                TotalEquipos = totalEquipos,
                EquiposActivos = activos,
                EquiposInactivos = totalEquipos - activos,
                EquiposAsignados = asignados,
                EquiposSinAsignar = totalEquipos - asignados,
                DistribucionPorTipo = porTipo,
                DistribucionPorUbicacion = porUbicacion
            };
        }

        public async Task<ReporteGarantiasDto> ObtenerEstadoGarantiasAsync()
        {
            var hoy = DateTime.Today;
            var treintaDias = hoy.AddDays(30);

            var garantiasVigentes = await _db.QuerySingleOrDefaultAsync<int>(@"
                SELECT COUNT(*) FROM equipos 
                WHERE FechaVencGarantia > @TreintaDias",
                new { TreintaDias = treintaDias });

            var garantiasPorVencer = await _db.QuerySingleOrDefaultAsync<int>(@"
                SELECT COUNT(*) FROM equipos 
                WHERE FechaVencGarantia BETWEEN @Hoy AND @TreintaDias",
                new { Hoy = hoy, TreintaDias = treintaDias });

            var garantiasVencidas = await _db.QuerySingleOrDefaultAsync<int>(@"
                SELECT COUNT(*) FROM equipos 
                WHERE FechaVencGarantia < @Hoy",
                new { Hoy = hoy });

            var sinGarantia = await _db.QuerySingleOrDefaultAsync<int>(@"
                SELECT COUNT(*) FROM equipos 
                WHERE FechaVencGarantia IS NULL");

            var proximasAVencer = await _db.QueryAsync<GarantiaProximaVencerDto>(@"
                SELECT e.Id as EquipoId, e.CodigoInventario, e.Nombre, 
                       e.FechaVencGarantia as FechaVencimiento,
                       DATEDIFF(e.FechaVencGarantia, @Hoy) as DiasRestantes
                FROM equipos e
                WHERE e.FechaVencGarantia BETWEEN @Hoy AND @TreintaDias
                ORDER BY e.FechaVencGarantia ASC",
                new { Hoy = hoy, TreintaDias = treintaDias });

            return new ReporteGarantiasDto
            {
                GarantiasVigentes = garantiasVigentes,
                GarantiasPorVencer = garantiasPorVencer,
                GarantiasVencidas = garantiasVencidas,
                SinGarantia = sinGarantia,
                ProximasAVencer = proximasAVencer
            };
        }

        public async Task<ReporteAsignacionesDto> ObtenerAsignacionesAsync()
        {
            var totalAsignaciones = await _db.QuerySingleOrDefaultAsync<int>(
                "SELECT COUNT(*) FROM asignaciones WHERE FechaHasta IS NULL");

            var porArea = await _db.QueryAsync<AsignacionesPorAreaDto>(@"
                SELECT u.Area, COUNT(*) as Cantidad,
                       ROUND((COUNT(*) * 100.0 / CAST(@Total AS DECIMAL)), 2) as Porcentaje
                FROM asignaciones a
                JOIN usuarios_asignados u ON u.Id = a.UsuarioId
                WHERE a.FechaHasta IS NULL
                GROUP BY u.Area
                ORDER BY Cantidad DESC",
                new { Total = totalAsignaciones });

            var topUsuarios = await _db.QueryAsync<UsuarioConMasEquiposDto>(@"
                SELECT u.Nombre as UsuarioNombre, u.Area, COUNT(*) as CantidadEquipos
                FROM asignaciones a
                JOIN usuarios_asignados u ON u.Id = a.UsuarioId
                WHERE a.FechaHasta IS NULL
                GROUP BY u.Id, u.Nombre, u.Area
                ORDER BY CantidadEquipos DESC
                LIMIT 10");

            return new ReporteAsignacionesDto
            {
                TotalAsignacionesActivas = totalAsignaciones,
                AsignacionesPorArea = porArea,
                TopUsuarios = topUsuarios
            };
        }

        public async Task<byte[]> GenerarReporteExcelAsync()
        {
            var resumen = await ObtenerResumenAsync();
            var garantias = await ObtenerEstadoGarantiasAsync();
            var asignaciones = await ObtenerAsignacionesAsync();

            using var workbook = new XLWorkbook();

            // Hoja 1: Resumen Ejecutivo
            var wsResumen = workbook.Worksheets.Add("Resumen Ejecutivo");

            // Título
            wsResumen.Cell(1, 1).Value = "REPORTE EJECUTIVO - SISTEMA DE INVENTARIO";
            wsResumen.Cell(1, 1).Style.Font.Bold = true;
            wsResumen.Cell(1, 1).Style.Font.FontSize = 16;
            wsResumen.Range(1, 1, 1, 6).Merge();

            // KPIs
            wsResumen.Cell(3, 1).Value = "MÉTRICAS PRINCIPALES";
            wsResumen.Cell(3, 1).Style.Font.Bold = true;

            var kpis = new[]
            {
                new { Texto = "Total de Equipos", Valor = resumen.TotalEquipos },
                new { Texto = "Equipos Activos", Valor = resumen.EquiposActivos },
                new { Texto = "Equipos Asignados", Valor = resumen.EquiposAsignados },
                new { Texto = "Equipos Sin Asignar", Valor = resumen.EquiposSinAsignar },
                new { Texto = "Garantías Vigentes", Valor = garantias.GarantiasVigentes },
                new { Texto = "Garantías por Vencer", Valor = garantias.GarantiasPorVencer }
            };

            for (int i = 0; i < kpis.Length; i++)
            {
                wsResumen.Cell(4 + i, 1).Value = kpis[i].Texto;
                wsResumen.Cell(4 + i, 2).Value = kpis[i].Valor;
            }

            // Hoja 2: Distribución por Tipo
            var wsTipo = workbook.Worksheets.Add("Distribución por Tipo");
            wsTipo.Cell(1, 1).Value = "DISTRIBUCIÓN DE EQUIPOS POR TIPO";
            wsTipo.Cell(1, 1).Style.Font.Bold = true;

            wsTipo.Cell(3, 1).Value = "Tipo";
            wsTipo.Cell(3, 2).Value = "Cantidad";
            wsTipo.Cell(3, 3).Value = "Porcentaje";

            int row = 4;
            foreach (var item in resumen.DistribucionPorTipo)
            {
                wsTipo.Cell(row, 1).Value = item.Tipo;
                wsTipo.Cell(row, 2).Value = item.Cantidad;
                // CORRECCIÓN: Convertir decimal a double antes de la división
                wsTipo.Cell(row, 3).Value = (double)item.Porcentaje / 100.0;
                wsTipo.Cell(row, 3).Style.NumberFormat.Format = "0.00%";
                row++;
            }

            // Hoja 3: Estado de Garantías
            var wsGarantias = workbook.Worksheets.Add("Estado de Garantías");
            wsGarantias.Cell(1, 1).Value = "ESTADO DE GARANTÍAS";
            wsGarantias.Cell(1, 1).Style.Font.Bold = true;

            var estadosGarantia = new[]
            {
                new { Estado = "Garantías Vigentes", Valor = garantias.GarantiasVigentes },
                new { Estado = "Por Vencer (30 días)", Valor = garantias.GarantiasPorVencer },
                new { Estado = "Garantías Vencidas", Valor = garantias.GarantiasVencidas },
                new { Estado = "Sin Garantía", Valor = garantias.SinGarantia }
            };

            for (int i = 0; i < estadosGarantia.Length; i++)
            {
                wsGarantias.Cell(3 + i, 1).Value = estadosGarantia[i].Estado;
                wsGarantias.Cell(3 + i, 2).Value = estadosGarantia[i].Valor;
            }

            // Próximas a vencer
            if (garantias.ProximasAVencer.Any())
            {
                wsGarantias.Cell(8, 1).Value = "EQUIPOS CON GARANTÍA PRÓXIMA A VENCER";
                wsGarantias.Cell(8, 1).Style.Font.Bold = true;

                wsGarantias.Cell(9, 1).Value = "Código";
                wsGarantias.Cell(9, 2).Value = "Nombre";
                wsGarantias.Cell(9, 3).Value = "Fecha Vencimiento";
                wsGarantias.Cell(9, 4).Value = "Días Restantes";

                row = 10;
                foreach (var item in garantias.ProximasAVencer)
                {
                    wsGarantias.Cell(row, 1).Value = item.CodigoInventario;
                    wsGarantias.Cell(row, 2).Value = item.Nombre;
                    wsGarantias.Cell(row, 3).Value = item.FechaVencimiento;
                    wsGarantias.Cell(row, 3).Style.NumberFormat.Format = "dd/mm/yyyy";
                    wsGarantias.Cell(row, 4).Value = item.DiasRestantes;
                    row++;
                }
            }

            // Hoja 4: Asignaciones
            var wsAsignaciones = workbook.Worksheets.Add("Asignaciones");
            wsAsignaciones.Cell(1, 1).Value = "REPORTE DE ASIGNACIONES";
            wsAsignaciones.Cell(1, 1).Style.Font.Bold = true;

            wsAsignaciones.Cell(3, 1).Value = "Total Asignaciones Activas:";
            wsAsignaciones.Cell(3, 2).Value = asignaciones.TotalAsignacionesActivas;

            // Asignaciones por Área
            wsAsignaciones.Cell(5, 1).Value = "ASIGNACIONES POR ÁREA";
            wsAsignaciones.Cell(5, 1).Style.Font.Bold = true;

            wsAsignaciones.Cell(6, 1).Value = "Área";
            wsAsignaciones.Cell(6, 2).Value = "Cantidad";
            wsAsignaciones.Cell(6, 3).Value = "Porcentaje";

            row = 7;
            foreach (var item in asignaciones.AsignacionesPorArea)
            {
                wsAsignaciones.Cell(row, 1).Value = item.Area;
                wsAsignaciones.Cell(row, 2).Value = item.Cantidad;
                // CORRECCIÓN: Convertir decimal a double antes de la división
                wsAsignaciones.Cell(row, 3).Value = (double)item.Porcentaje / 100.0;
                wsAsignaciones.Cell(row, 3).Style.NumberFormat.Format = "0.00%";
                row++;
            }

            // Top Usuarios
            wsAsignaciones.Cell(row + 2, 1).Value = "TOP USUARIOS CON MÁS EQUIPOS";
            wsAsignaciones.Cell(row + 2, 1).Style.Font.Bold = true;

            wsAsignaciones.Cell(row + 3, 1).Value = "Usuario";
            wsAsignaciones.Cell(row + 3, 2).Value = "Área";
            wsAsignaciones.Cell(row + 3, 3).Value = "Cantidad de Equipos";

            int topRow = row + 4;
            foreach (var usuario in asignaciones.TopUsuarios)
            {
                wsAsignaciones.Cell(topRow, 1).Value = usuario.UsuarioNombre;
                wsAsignaciones.Cell(topRow, 2).Value = usuario.Area;
                wsAsignaciones.Cell(topRow, 3).Value = usuario.CantidadEquipos;
                topRow++;
            }

            // Ajustar columnas al contenido
            wsResumen.Columns().AdjustToContents();
            wsTipo.Columns().AdjustToContents();
            wsGarantias.Columns().AdjustToContents();
            wsAsignaciones.Columns().AdjustToContents();

            // Convertir a array de bytes
            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }

        public async Task<byte[]> GenerarReportePdfAsync()
        {
            var resumen = await ObtenerResumenAsync();
            var garantias = await ObtenerEstadoGarantiasAsync();
            var asignaciones = await ObtenerAsignacionesAsync();

            // Configurar QuestPDF
            QuestPDF.Settings.License = LicenseType.Community;

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(10));

                    page.Header()
                        .AlignCenter()
                        .Text("REPORTE EJECUTIVO - SISTEMA DE INVENTARIO")
                        .SemiBold().FontSize(16).FontColor(Colors.Blue.Medium);

                    page.Content()
                        .PaddingVertical(1, Unit.Centimetre)
                        .Column(column =>
                        {
                            column.Spacing(20);

                            // Sección 1: Métricas Principales
                            column.Item().Background(Colors.Grey.Lighten3).Padding(10).Column(innerColumn =>
                            {
                                innerColumn.Spacing(5);
                                innerColumn.Item().Text("MÉTRICAS PRINCIPALES").SemiBold().FontSize(12);
                                innerColumn.Item().Row(row =>
                                {
                                    row.RelativeItem().Background(Colors.White).Padding(5).Text($"Total Equipos: {resumen.TotalEquipos}").SemiBold();
                                    row.RelativeItem().Background(Colors.White).Padding(5).Text($"Equipos Activos: {resumen.EquiposActivos}").SemiBold();
                                    row.RelativeItem().Background(Colors.White).Padding(5).Text($"Equipos Asignados: {resumen.EquiposAsignados}").SemiBold();
                                    row.RelativeItem().Background(Colors.White).Padding(5).Text($"Equipos Sin Asignar: {resumen.EquiposSinAsignar}").SemiBold();
                                });
                            });

                            // Sección 2: Distribución por Tipo
                            column.Item().Background(Colors.Grey.Lighten3).Padding(10).Column(innerColumn =>
                            {
                                innerColumn.Spacing(5);
                                innerColumn.Item().Text("DISTRIBUCIÓN POR TIPO").SemiBold().FontSize(12);
                                innerColumn.Item().Table(table =>
                                {
                                    table.ColumnsDefinition(columns =>
                                    {
                                        columns.ConstantColumn(100);
                                        columns.ConstantColumn(80);
                                        columns.ConstantColumn(80);
                                    });

                                    table.Header(header =>
                                    {
                                        header.Cell().Background(Colors.Blue.Medium).Padding(5).Text("Tipo").FontColor(Colors.White);
                                        header.Cell().Background(Colors.Blue.Medium).Padding(5).Text("Cantidad").FontColor(Colors.White);
                                        header.Cell().Background(Colors.Blue.Medium).Padding(5).Text("Porcentaje").FontColor(Colors.White);
                                    });

                                    foreach (var item in resumen.DistribucionPorTipo)
                                    {
                                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(item.Tipo);
                                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(item.Cantidad.ToString());
                                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text($"{item.Porcentaje}%");
                                    }
                                });
                            });

                            // Sección 3: Estado de Garantías
                            column.Item().Background(Colors.Grey.Lighten3).Padding(10).Column(innerColumn =>
                            {
                                innerColumn.Spacing(5);
                                innerColumn.Item().Text("ESTADO DE GARANTÍAS").SemiBold().FontSize(12);
                                innerColumn.Item().Row(row =>
                                {
                                    row.RelativeItem().Background(Colors.White).Padding(5).Text($"Vigentes: {garantias.GarantiasVigentes}").SemiBold();
                                    row.RelativeItem().Background(Colors.White).Padding(5).Text($"Por Vencer: {garantias.GarantiasPorVencer}").SemiBold();
                                    row.RelativeItem().Background(Colors.White).Padding(5).Text($"Vencidas: {garantias.GarantiasVencidas}").SemiBold();
                                    row.RelativeItem().Background(Colors.White).Padding(5).Text($"Sin Garantía: {garantias.SinGarantia}").SemiBold();
                                });

                                if (garantias.ProximasAVencer.Any())
                                {
                                    innerColumn.Item().Container().PaddingTop(10).Column(proximasColumn =>
                                    {
                                        proximasColumn.Item().Text("PRÓXIMAS A VENCER (30 DÍAS)").SemiBold().FontSize(10);
                                        proximasColumn.Item().Table(table =>
                                        {
                                            table.ColumnsDefinition(columns =>
                                            {
                                                columns.ConstantColumn(80);
                                                columns.RelativeColumn();
                                                columns.ConstantColumn(80);
                                                columns.ConstantColumn(80);
                                            });

                                            table.Header(header =>
                                            {
                                                header.Cell().Background(Colors.Blue.Medium).Padding(5).Text("Código").FontColor(Colors.White);
                                                header.Cell().Background(Colors.Blue.Medium).Padding(5).Text("Nombre").FontColor(Colors.White);
                                                header.Cell().Background(Colors.Blue.Medium).Padding(5).Text("Vencimiento").FontColor(Colors.White);
                                                header.Cell().Background(Colors.Blue.Medium).Padding(5).Text("Días Rest.").FontColor(Colors.White);
                                            });

                                            foreach (var item in garantias.ProximasAVencer)
                                            {
                                                table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(item.CodigoInventario);
                                                table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(item.Nombre);
                                                table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(item.FechaVencimiento.ToString("dd/MM/yyyy"));
                                                table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(item.DiasRestantes.ToString());
                                            }
                                        });
                                    });
                                }
                            });

                            // Sección 4: Asignaciones
                            column.Item().Background(Colors.Grey.Lighten3).Padding(10).Column(innerColumn =>
                            {
                                innerColumn.Spacing(5);
                                innerColumn.Item().Text("ASIGNACIONES").SemiBold().FontSize(12);
                                innerColumn.Item().Text($"Total Asignaciones Activas: {asignaciones.TotalAsignacionesActivas}").SemiBold();

                                innerColumn.Item().Container().PaddingTop(10).Column(asignacionesAreaColumn =>
                                {
                                    asignacionesAreaColumn.Item().Text("ASIGNACIONES POR ÁREA").SemiBold().FontSize(10);
                                    asignacionesAreaColumn.Item().Table(table =>
                                    {
                                        table.ColumnsDefinition(columns =>
                                        {
                                            columns.RelativeColumn();
                                            columns.ConstantColumn(80);
                                            columns.ConstantColumn(80);
                                        });

                                        table.Header(header =>
                                        {
                                            header.Cell().Background(Colors.Blue.Medium).Padding(5).Text("Área").FontColor(Colors.White);
                                            header.Cell().Background(Colors.Blue.Medium).Padding(5).Text("Cantidad").FontColor(Colors.White);
                                            header.Cell().Background(Colors.Blue.Medium).Padding(5).Text("Porcentaje").FontColor(Colors.White);
                                        });

                                        foreach (var item in asignaciones.AsignacionesPorArea)
                                        {
                                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(item.Area);
                                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(item.Cantidad.ToString());
                                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text($"{item.Porcentaje}%");
                                        }
                                    });
                                });

                                if (asignaciones.TopUsuarios.Any())
                                {
                                    innerColumn.Item().Container().PaddingTop(10).Column(topUsuariosColumn =>
                                    {
                                        topUsuariosColumn.Item().Text("TOP USUARIOS CON MÁS EQUIPOS").SemiBold().FontSize(10);
                                        topUsuariosColumn.Item().Table(table =>
                                        {
                                            table.ColumnsDefinition(columns =>
                                            {
                                                columns.RelativeColumn();
                                                columns.RelativeColumn();
                                                columns.ConstantColumn(80);
                                            });

                                            table.Header(header =>
                                            {
                                                header.Cell().Background(Colors.Blue.Medium).Padding(5).Text("Usuario").FontColor(Colors.White);
                                                header.Cell().Background(Colors.Blue.Medium).Padding(5).Text("Área").FontColor(Colors.White);
                                                header.Cell().Background(Colors.Blue.Medium).Padding(5).Text("Cantidad").FontColor(Colors.White);
                                            });

                                            foreach (var usuario in asignaciones.TopUsuarios)
                                            {
                                                table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(usuario.UsuarioNombre);
                                                table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(usuario.Area);
                                                table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(usuario.CantidadEquipos.ToString());
                                            }
                                        });
                                    });
                                }
                            });

                            // Pie de página
                            column.Item().AlignCenter().Text(text =>
                            {
                                text.Span("Generado el ").SemiBold();
                                text.Span(DateTime.Now.ToString("dd/MM/yyyy HH:mm")).SemiBold();
                            });
                        });

                    page.Footer()
                        .AlignCenter()
                        .Text(x =>
                        {
                            x.Span("Página ");
                            x.CurrentPageNumber();
                            x.Span(" de ");
                            x.TotalPages();
                        });
                });
            });

            return document.GeneratePdf();
        }
    }
}