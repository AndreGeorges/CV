// va chercher ressource externe, ex: navbar, footer, wrapper

function include(id, fichier, callback) {
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

            if (callback) {
                callback();
            }
        })
        .catch(err => console.error("Include error:", err));
}

// attend que toute la page soit loadee avant d'executer le javascript
document.addEventListener("DOMContentLoaded", () => {

    include("navbar", "partials/navbar.html");
    include("footer", "partials/footer.html", startCharacter);
    include("wrapper", "partials/wrapper.html");

});

// pour imprimer le CV
const printCol = document.getElementById("printcol");

if (printCol) {
    printCol.addEventListener('click', function () {
        print();
    });
}


const printBw = document.getElementById("printbw");

if (printBw) {
    printBw.addEventListener('click', function () {
        document.body.classList.add("bw");
        print();
    });
}


// page portfolio
function enlargeVideo(smallVideo) {
    var fullVideo = document.getElementById("imageBox");
    fullVideo.src = smallVideo.src;
}

// character



function startCharacter() {

    const character = document.querySelector(".character");

    const speed = 0.8;
    let x = -100;
    x = parseFloat(x);
    let direction = 1;


    let startTime = null;
    let lastTime = null;

    let state = "walking";
    const targetX = window.innerWidth * 0.4;

    function animate(time) {

        if (lastTime == null) {
            startTime = time;
            lastTime = time;
        }

        let deltaTime = time - lastTime;
        lastTime = time;

        if (state === "walking") {
            x += speed * direction * deltaTime / 16;
        }


        // const characterWidth = character.getBoundingClientRect().width;
        if (x > window.innerWidth) {
            // x = window.innerWidth + 100;
            // x = window.innerWidth + characterWidth;

            direction = -1;

            character.style.transform =
                "scaleX(-1) scale(0.25)";
        }


        // limite gauche
        if (x < -100) {

            direction = 1;

            character.style.transform =
                "scale(0.25)";
        }

        const elapsed = time - startTime;

        character.style.left = x + "px";

        // rebond
        const bounce = Math.sin(elapsed / 150) * 1.2;

        character.style.bottom = bounce + "px";


        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
    // animate();
    animateWalking();
}



function animateWalking() {
    const character = document.querySelector(".character");

    let frame = 0;
    const frameWidth = 600;
    const totalFrames = 5;

    setInterval(() => {
        frame++;
        if (frame >= totalFrames) {
            frame = 0;
        }
        character.style.backgroundPosition = `-${frame * frameWidth}px 0`;
    }, 200);
}









