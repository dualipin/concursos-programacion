export const parseDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    return date.toISOString().slice(0, 10);
};

/**
 * Convierte una cadena de fecha en formato MySQL (YYYY-MM-DD)
 * @param dateStr La cadena de fecha a convertir (puede ser 'DD-MM-YYYY' o cualquier formato que Date pueda parsear)
 * @returns La fecha en formato MySQL o null si la fecha es inválida
 */
export const toMySQLDate = (dateStr: string) => {
    // Check if the date is in DD-MM-YYYY format
    const ddmmyyyyPattern = /^(\d{2})-(\d{2})-(\d{4})$/;
    const match = dateStr.match(ddmmyyyyPattern);

    let date;
    if (match) {
        // Convert from DD-MM-YYYY to YYYY-MM-DD for proper parsing
        const [_, day, month, year] = match;
        date = new Date(`${year}-${month}-${day}`);
    } else {
        date = new Date(dateStr);
    }

    if (isNaN(date.getTime())) return null;
    return date.toISOString().slice(0, 10); // Formato YYYY-MM-DD para MySQL
};

export const parseDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" });
}