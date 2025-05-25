export const parseDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    return date.toISOString().slice(0, 10);
};

export const parseDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" });
}