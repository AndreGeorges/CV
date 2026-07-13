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

// =================================================
//                   CHARACTER
// ======================================



function startCharacter() {

    const character = document.querySelector(".character");

    const animations = {

        walking: {
            image: "../images/walking.png",
            flip: false,
            frames: 5,
            frameWidth: 600,
            loop: true,
            bounce: true,
            frameDelay: 200
        },

        stopping: {
            image: "../images/stopping.png",
            flip: false,
            frames: 5,
            frameWidth: 600,
            loop: false,
            bounce: false,
            frameDelay: 120
        },

        standing: {
            image: "../images/standing.png",
            flip: false,
            frames: 5,
            frameWidth: 600,
            loop: true,
            bounce: false,
            frameDelay: 200
        },
        lookingup: {
            image: "../images/lookingup.png",
            flip: false,
            frames: 5,
            frameWidth: 600,
            loop: true,
            bounce: false,
            frameDelay: 200
        },
        turnaround: {
            image: "../images/turnaround.png",
            flip: false,
            frames: 5,
            frameWidth: 600,
            loop: false,
            bounce: true,
            frameDelay: 200
        },
        standing_fl: {
            image: "../images/standing_fl.png",
            flip: false,
            frames: 5,
            frameWidth: 600,
            loop: true,
            bounce: false,
            frameDelay: 200
        },
        lookingup_fl: {
            image: "../images/lookingup_fl.png",
            flip: false,
            frames: 5,
            frameWidth: 600,
            loop: true,
            bounce: false,
            frameDelay: 200
        },
        turnaround_right: {
            image: "../images/turnaround.png",
            flip: true,
            // offsetX: -600,
            frames: 5,
            frameWidth: 600,
            loop: false,
            bounce: true,
            frameDelay: 200
        },

    };

    let currentAnimation = animations.walking;
    let currentFrame = 0;
    let animationTime = 0;
    const frameDelay = 200;


    function setAnimation(animation) {

        if (currentAnimation === animation)
            return;

        currentAnimation = animation;

        currentFrame = 0;
        animationTime = 0;

        character.style.backgroundImage =
            `url(${animation.image})`;

        character.style.backgroundPosition = "0px 0px";
        character.style.transform = "scale(0.25)";
        character.classList.toggle("flip", animation.flip);
    }

    function upddateAnimation(deltaTime) {
        animationTime += deltaTime;
        if (animationTime < currentAnimation.frameDelay) {
            return;
        }
        animationTime = 0;
        currentFrame++;

        // fin du sprite sheet
        if (currentFrame >= currentAnimation.frames) {
            if (currentAnimation.loop) {
                currentFrame = 0;
            }
            else {
                currentFrame = currentAnimation.frames - 1;
                switch (state) {
                    case "stopping":
                        state = "standing";
                        stateTime = 0;
                        setAnimation(animations.standing);
                        break;
                    case "turnaround":
                        state = "standing_fl";
                        standingPhase = 5;
                        stateTime = 0;
                        setAnimation(animations.standing_fl);
                        break;
                    // case "turnaround_right":

                }

            }
        } // if
        character.style.backgroundPosition = `-${currentFrame * currentAnimation.frameWidth}px 0`;
    }

    // animation de départ
    setAnimation(animations.walking);

    // -----------------------------
    // Déplacement
    // -----------------------------
    const speed = 0.8;

    let x = -100;
    let direction = 1;

    let startTime = null;
    let lastTime = null;

    let state = "walking";
    let stateTime = 0;
    let standingPhase = 1;
    // const standingDelay= 5000;
    const targetX = window.innerWidth * 0.01;
    const secondTargetX = window.innerWidth * 0.4;

    // -----------------------------
    // Boucle principale
    // -----------------------------
    function animate(time) {

        if (lastTime === null) {
            startTime = time;
            lastTime = time;
        }

        const deltaTime = time - lastTime;
        lastTime = time;
        stateTime += deltaTime;

        upddateAnimation(deltaTime);
        if (state === "walking" || state === "walkingtoSecondPosition") {
            x += speed * direction * deltaTime / 16;
        }
        if (state === "walking" && x >= targetX) {
            // character.style.transformOrigin = "bottom left";
            state = "stopping";
            setAnimation(animations.stopping);
        }
        if (state === "standing" && standingPhase === 1 && stateTime >= 3000) {
            state = "lookingup";
            stateTime = 0;
            setAnimation(animations.lookingup);
        }
        if (state === "lookingup" && standingPhase === 1 && stateTime >= 3000) {
            state = "standing";
            stateTime = 0;
            standingPhase = 2;
            setAnimation(animations.standing);
        }
        if (state === "standing" && standingPhase === 2 && stateTime >= 3000) {
            state = "walkingtoSecondPosition";
            stateTime = 0;
            standingPhase = 3;
            setAnimation(animations.walking);
        }
        if (state === "walkingtoSecondPosition" && x >= secondTargetX) {
            state = "stopping";
            standingPhase = 3;
            setAnimation(animations.stopping);
        }
        if (state === "standing" && standingPhase === 3 && stateTime >= 3000) {
            state = "lookingup";
            stateTime = 0;
            standingPhase = 4;
            setAnimation(animations.lookingup);
        }
        if (state === "lookingup" && standingPhase === 4 && stateTime >= 3000) {
            state = "turnaround";
            stateTime = 0;
            standingPhase = 5;
            setAnimation(animations.turnaround);
        }
        if (state === "standing_fl" && standingPhase === 5 && stateTime >= 1000) {
            state = "lookingup_fl";
            stateTime = 0;
            // standingPhase = 5;
            setAnimation(animations.lookingup_fl);
        }
        // if (state === "lookingup_fl" && standingPhase === 5 && stateTime >= 3000) {
        //     // character.style.transformOrigin = "bottom center";
        //     state = "turnaround_right";
        //     stateTime = 0;
        //     setAnimation(animations.turnaround_right);
        // }

        if (x > window.innerWidth) {

            direction = -1;

            // character.style.transform =
            //     "scaleX(-1) scale(0.25)";

        }

        if (x < -100) {

            direction = 1;

            // character.style.transform =
            //     "scale(0.25)";
        }
        character.style.left = x + "px";
        const elapsed = time - startTime;

        if (currentAnimation.bounce) {
            const bounce =
                Math.sin(elapsed / 150) * 1.2;
            character.style.bottom =
                bounce + "px";
        }
        else {
            character.style.bottom = "0px";
        }
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

}

