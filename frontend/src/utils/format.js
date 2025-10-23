// frontend/src/utils/format.js
// Funciones de formateo robustas (aceptan "2025-10-21 12:34:00", ISO, Date, etc.)

export const parseAnyDate = (v) => {
    if (!v) return null;
    if (v instanceof Date) return isNaN(v) ? null : v;

    if (typeof v === "string") {
        // normalizamos "YYYY-MM-DD HH:mm:ss" -> "YYYY-MM-DDTHH:mm:ss"
        let s = v.trim();
        if (s.length >= 10 && s[10] === " ") s = s.replace(" ", "T");
        // si no viene con Z, lo tomamos como UTC para evitar desfasajes raros
        const tryUtc = s.endsWith("Z") ? s : s + "Z";
        const d = new Date(tryUtc);
        if (!isNaN(d)) return d;

        // último intento "tal cual"
        const d2 = new Date(v);
        return isNaN(d2) ? null : d2;
    }

    return null;
};

export const fmtDate = (v) => {
    const d = parseAnyDate(v);
    return d ? d.toLocaleDateString("es-AR") : "—";
};

export const fmtDateTime = (v) => {
    const d = parseAnyDate(v);
    return d ? d.toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" }) : "—";
};
