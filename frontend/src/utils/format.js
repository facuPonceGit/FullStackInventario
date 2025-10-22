// src/utils/format.js
import { parseAnyDate } from './dt';

export const fmtDate = (v) => {
    const d = parseAnyDate(v);
    return d ? d.toLocaleDateString('es-AR') : '—';
};

export const fmtDateTime = (v) => {
    const d = parseAnyDate(v);
    return d
        ? d.toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })
        : '—';
};
