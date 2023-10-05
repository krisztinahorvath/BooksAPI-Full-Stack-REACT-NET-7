// export const BACKEND_URL = "https://sdibookapi.azurewebsites.net/api";

export const BACKEND_URL = "http://localhost:5184/api";


export function formatDate(date: Date | string | undefined) {
    return date == null || date == undefined	? "N/A"
        : new Date(date).toLocaleString()
}