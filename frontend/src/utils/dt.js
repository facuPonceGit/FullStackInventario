// frontend/src/utils/dt.js
// Conversión segura entre <input type="date|datetime-local"> y Date/ISO

// YYYY-MM-DD (para inputs)
const pad = (n) => String(n).padStart(2, "0");

export const toInputDate = (v) => {
    if (!v) return "";
    const d = new Date(v);
    if (isNaN(d)) return "";
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const toInputDateTime = (v) => {
    if (!v) return "";
    const d = new Date(v);
    if (isNaN(d)) return "";
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// De un <input type="date"> (YYYY-MM-DD) a Date (UTC)
export const parseFromInputDate = (s) => {
    if (!s) return null;
    // anclamos a medianoche UTC para evitar TZ raras
    const d = new Date(`${s}T00:00:00Z`);
    return isNaN(d) ? null : d;
};

// De un <input type="datetime-local"> a Date (interpretada como local)
export const parseFromInputDateTime = (s) => {
    if (!s) return null;
    const d = new Date(s);
    return isNaN(d) ? null : d;
};
