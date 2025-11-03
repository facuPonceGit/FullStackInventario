// frontend/src/api/reportes.js
import client from "./client";

export const obtenerResumen = () =>
    client.get("/api/Reportes/resumen").then(r => r.data);

export const obtenerGarantias = () =>
    client.get("/api/Reportes/garantias").then(r => r.data);

export const obtenerAsignaciones = () =>
    client.get("/api/Reportes/asignaciones").then(r => r.data);

export const descargarExcel = () =>
    client.get("/api/Reportes/excel", { responseType: 'blob' });

export const descargarPdf = () =>
    client.get("/api/Reportes/pdf", { responseType: 'blob' });
