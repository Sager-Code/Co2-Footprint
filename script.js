// Funktion zum Laden der JSON-Daten und Befüllen der Tabelle
async function loadTableData() {
    try {
        const response = await fetch("emissions.json"); // Stelle sicher, dass diese Datei existiert
        if (!response.ok) {
            throw new Error(`HTTP-Fehler: ${response.status}`);
        }
        const data = await response.json();

        const tableBody = document.querySelector("#emissionsTable tbody");
        tableBody.innerHTML = ""; // Leert die Tabelle

        data.forEach((entry) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${entry.land}</td>
                <td>${entry.unternehmen}</td>
                <td>${entry.emissionen}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Fehler beim Laden der JSON-Daten:", error);
    }
}

// Filterfunktion für die Tabelle
document.querySelector("#filterInput").addEventListener("input", (event) => {
    const filterValue = event.target.value.toLowerCase();
    const rows = document.querySelectorAll("#emissionsTable tbody tr");

    rows.forEach((row) => {
        const rowText = row.textContent.toLowerCase();
        row.style.display = rowText.includes(filterValue) ? "" : "none";
    });
});

// Funktion zur Sortierung der Tabelle
document.querySelectorAll("#emissionsTable th").forEach((header, index) => {
    header.addEventListener("click", () => {
        const tableBody = document.querySelector("#emissionsTable tbody");
        const rows = Array.from(tableBody.querySelectorAll("tr"));

        // Wechselnde Sortierreihenfolge
        const ascending = !header.classList.contains("ascending");
        header.classList.toggle("ascending", ascending);
        header.classList.toggle("descending", !ascending);

        rows.sort((a, b) => {
            const aText = a.children[index].textContent.trim();
            const bText = b.children[index].textContent.trim();

            // Numerisch sortieren, wenn Werte Zahlen sind
            if (!isNaN(aText) && !isNaN(bText)) {
                return ascending ? aText - bText : bText - aText;
            }

            // Alphabetisch sortieren
            return ascending
                ? aText.localeCompare(bText)
                : bText.localeCompare(aText);
        });

        // Neu sortierte Zeilen einfügen
        rows.forEach((row) => tableBody.appendChild(row));
    });
});

// Funktion zur Anpassung der Ausrichtung basierend auf der Sprachkultur
function adjustDirection() {
    const htmlElement = document.documentElement;
    const direction = htmlElement.lang === "ar" || htmlElement.lang === "he" ? "rtl" : "ltr";

    // Anpassung der Ausrichtung
    document.body.style.direction = direction;

    // Seitliches Menü anpassen
    const asideMenu = document.querySelector("aside");
    if (asideMenu) {
        asideMenu.style.textAlign = direction === "rtl" ? "right" : "left";
    }

    // Tabelle für RTL oder LTR anpassen
    const table = document.querySelector("#emissionsTable");
    if (table) {
        table.style.direction = direction;
    }
}

// Lade die Sprachkultur-Anpassung und die Daten bei Seitenstart
document.addEventListener("DOMContentLoaded", () => {
    adjustDirection();
    loadTableData(); // Stelle sicher, dass die Tabelle geladen wird
});
