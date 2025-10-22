// src/utils/dt.js

// Muestra en <input type="datetime-local"> sin desplazar zona
export function toInputDateTime(value) {
    if (!value) return '';
    const d = value instanceof Date ? value : parseAnyDate(value);
    if (!d) return '';
    const dd = new Date(d);
    dd.setMinutes(dd.getMinutes() - dd.getTimezoneOffset());
    return dd.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
}

// Convierte del string del input -> ISO (UTC con Z)
export function parseFromInput(inputValue) {
    if (!inputValue) return null;
    const d = new Date(inputValue); // interpreta como hora local
    return isNaN(d) ? null : d.toISOString();
}

/**
 * Parser tolerante:
 * - "YYYY-MM-DDTHH:mm:ss" (ISO sin Z) ✅
 * - "YYYY-MM-DD HH:mm:ss" (MySQL) ✅
 * - number (epoch) ✅
 * - Date ✅
 * - ignora "0000-00-00 00:00:00" ❌
 */
export function parseAnyDate(v) {
    if (!v) return null;
    if (v instanceof Date) return isNaN(v) ? null : v;
    if (typeof v === 'number') {
        const d = new Date(v);
        return isNaN(d) ? null : d;
    }
    if (typeof v !== 'string') {
        const d = new Date(v);
        return isNaN(d) ? null : d;
    }

    const s = v.trim();
    if (!s || s === '0000-00-00 00:00:00') return null;

    // 1) Probar ISO o MySQL normalizando el espacio -> 'T'
    {
        const isoish = s.replace(' ', 'T');
        const d = new Date(isoish);
        if (!isNaN(d)) return d;
    }

    // 2) Parse manual YYYY-MM-DD[ T]HH:mm[:ss]
    const m = s.match(
        /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/
    );
    if (m) {
        const [, y, mo, da, h, mi, se = '0'] = m;
        const d = new Date(
            Number(y),
            Number(mo) - 1,
            Number(da),
            Number(h),
            Number(mi),
            Number(se)
        );
        return isNaN(d) ? null : d;
    }

    return null;
}
