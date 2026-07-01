function include(id, fichier) {
    fetch(fichier)
        .then(res => {
            if (!res.ok) {
                throw new Error("HTTP " + res.status);
            }
            return res.text();
        })
        .then(html => {
            const el = document.getElementById(id);
            if (!el) {
                console.error("ID introuvable:", id);
                return;
            }
            el.innerHTML = html;
        })
        .catch(err => console.error("Include error:", err));
}

// attend que toute la page soit loadee avant d'executer le javascript
document.addEventListener("DOMContentLoaded", () => {

    include("navbar", "partials/navbar.html");
    include("footer", "partials/footer.html");
    include("wrapper", "partials/wrapper.html");

});

// pour imprimer le CV
const printBtn = document.getElementById("print");
printBtn.addEventListener('click', function () {
    print();
});
