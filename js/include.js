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
            image: "images/walking.png",
            frames: 5,
            frameWidth: 600,
            loop: true,
            bounce: true,
            frameDelay: 200
        },

        stopping: {
            image: "images/stopping.png",
            frames: 5,
            frameWidth: 600,
            loop: false,
            bounce: false,
            frameDelay: 120
        },

        standing: {
            image: "images/standing.png",
            frames: 5,
            frameWidth: 600,
            loop: true,
            bounce: false,
            frameDelay: 200
        },
        lookingup: {
            image: "images/lookingup.png",
            frames: 5,
            frameWidth: 600,
            loop: true,
            bounce: false,
            frameDelay: 200
        },
        turnaround: {
            image: "images/turnaround.png",
            flip: false,
            frames: 5,
            frameWidth: 600,
            loop: false,
            bounce: true,
            frameDelay: 250
        },
        standing_fl: {
            image: "images/standing_fl.png",
            frames: 5,
            frameWidth: 600,
            loop: true,
            bounce: false,
            frameDelay: 200
        },
        lookingup_fl: {
            image: "images/lookingup_fl.png",
            frames: 5,
            frameWidth: 600,
            loop: true,
            bounce: false,
            frameDelay: 200
        },
        turnaround_right: {
            image: "images/turnaround.png",
            flip: true,
            reverse: true,
            frames: 5,
            frameWidth: 600,
            loop: false,
            bounce: true,
            frameDelay: 250
        },
        sitting: {
            image: "images/sitting_also_good.png",
            frames: 5,
            frameWidth: 600,
            loop: false,
            bounce: false,
            frameDelay: 250
        },
        sitting_long: {
            image: "images/sitting_fl_lt.png",
            frames: 5,
            frameWidth: 600,
            loop: true,
            bounce: false,
            frameDelay: 250
        }

    };

    let currentAnimation = animations.walking;
    let currentFrame = 0;
    let animationTime = 0;
    const frameDelay = 200;


    function setAnimation(animation) {

        if (currentAnimation === animation)
            return;

        currentAnimation = animation;

        if (animation.reverse) {
            currentFrame = animation.frames - 1;
        } else {
            currentFrame = 0;
        }

        animationTime = 0;
        console.log(animation.image);
        character.style.backgroundImage =
            `url(${animation.image})`;

        character.style.backgroundPosition = "0px 0px";
        character.style.transform = "scale(  0.30)";
        character.classList.toggle("flip", animation.flip);
    }

    function upddateAnimation(deltaTime) {
        animationTime += deltaTime;
        if (animationTime < currentAnimation.frameDelay) {
            return;
        }
        animationTime = 0;
        if (currentAnimation.reverse) {
            currentFrame--;
        } else {
            currentFrame++;

        }

        // fin du sprite sheet
        if (
            (!currentAnimation.reverse && currentFrame >= currentAnimation.frames) ||
            (currentAnimation.reverse && currentFrame < 0)

        ) {
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
                        // standingPhase = 5;
                        stateTime = 0;
                        setAnimation(animations.standing_fl);
                        break;
                    case "turnaround_right":
                        state = "walking";
                        // standingPhase = 6;
                        stateTime = 0;
                        setAnimation(animations.walking);
                        break;
                    case "sitting":
                        state = "sitting_long";
                        stateTime = 0;
                        setAnimation(animations.sitting_long);
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
    const thirdTargetX = window.innerWidth * 0.75;

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
        if (state === "walking" && x >= targetX && x < secondTargetX) {
            state = "stopping";
            setAnimation(animations.stopping);
        }
        if (state === "standing" && standingPhase === 1 && stateTime >= 100) {
            state = "lookingup";
            stateTime = 0;
            setAnimation(animations.lookingup);
        }
        if (state === "lookingup" && standingPhase === 1 && stateTime >= 1000) {
            state = "standing";
            stateTime = 0;
            standingPhase = 2;
            setAnimation(animations.standing);
        }
        if (state === "standing" && standingPhase === 2 && stateTime >= 1000) {
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
        if (state === "standing" && standingPhase === 3 && stateTime >= 1000) {
            state = "lookingup";
            stateTime = 0;
            standingPhase = 4;
            setAnimation(animations.lookingup);
        }
        if (state === "lookingup" && standingPhase === 4 && stateTime >= 1000) {
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
        if (state === "lookingup_fl" && standingPhase === 5 && stateTime >= 1000) {
            state = "turnaround_right";
            stateTime = 0;
            standingPhase = 6;
            setAnimation(animations.turnaround_right);
        }
        if (state === "walking" && standingPhase === 6 && x >= thirdTargetX) {
            state = "stopping";
            stateTime = 0;
            setAnimation(animations.stopping);
        }
        if (state === "standing" && standingPhase === 6) {
            state = "turnaround";
            stateTime = 0;
            setAnimation(animations.turnaround);
        }
        if (state === "standing_fl" && standingPhase === 6 && stateTime >= 1000) {
            state = "sitting";
            stateTime = 0;
            setAnimation(animations.sitting);
        }




        if (x > window.innerWidth) {

            direction = -1;

            // character.style.transform =
            //     "scaleX(-1) scale(  0.30)";

        }

        if (x < -100) {

            direction = 1;

            // character.style.transform =
            //     "scale(  0.30)";
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

