/* =========================================================
   GSAP
========================================================= */

gsap.registerPlugin(ScrollTrigger);


/* =========================================================
   ELEMENTS
========================================================= */

const navbar = document.querySelector(".navbar");

const navStats = document.querySelector(".nav-stats");

const navStatsValue =
    document.querySelector(".nav-stats-value");

const navToggle =
    document.querySelector(".nav-toggle");

const navToggleText =
    document.querySelector(".nav-toggle-text");

const navLinks =
    document.querySelectorAll(".navbar a");

const hero = document.querySelector(".hero-scroll");

const heroFade =
    document.querySelector(".hero-fade");

const heroMarqueeTrack =
    document.querySelector(".hero-marquee-track");

const heroLabel =
    document.querySelector(".hero-label");

const heroTitle =
    document.querySelector(".hero-title");

const heroDescription =
    document.querySelector(".hero-description");

const heroBottom =
    document.querySelector(".hero-bottom");

const scrollCounter =
    document.querySelector(".scroll-counter");

const currentNumber =
    document.querySelector(".current-number");

const model = document.querySelector(".model");

const leftCard1 =
    document.querySelector(".card-left-1");

const leftCard2 =
    document.querySelector(".card-left-2");

const rightCard1 =
    document.querySelector(".card-right-1");

const rightCard2 =
    document.querySelector(".card-right-2");

const projectCards =
    gsap.utils.toArray(".project-card");

const socialCards =
    gsap.utils.toArray(".social-card");

const socialVideos =
    gsap.utils.toArray(".social-video");

const brandCells =
    gsap.utils.toArray(".brand-cell");

const workItems =
    gsap.utils.toArray(".work-item");

const skillBoxes =
    gsap.utils.toArray(".skill-box");

const experienceItems =
    gsap.utils.toArray(".experience-item");


/* =========================================================
   PREFERENCES
========================================================= */

const reduceMotionQuery =
    window.matchMedia("(prefers-reduced-motion: reduce)");

const hoverQuery =
    window.matchMedia("(hover: hover) and (pointer: fine)");

const mobileQuery =
    window.matchMedia("(max-width: 800px)");

const reduceMotion = () =>
    reduceMotionQuery.matches;

const counterTarget =
    Number(navStatsValue?.dataset.counterTarget || 148);


/* =========================================================
   SOCIAL VIDEOS — AUTOPLAY
========================================================= */

socialVideos.forEach((video) => {

    const playVideo = () => {

        const playback = video.play();

        if (playback && playback.catch) {
            playback.catch(() => {});
        }
    };

    if (video.readyState >= 2) {
        playVideo();
    }

    video.addEventListener("loadeddata", playVideo, {
        once: true
    });
});


/* =========================================================
   HEADER — SIZING
========================================================= */

const getCompactWidth = () =>
    mobileQuery.matches
        ? window.innerWidth - 48
        : Math.min(440, window.innerWidth - 44);

const getExpandedWidth = () =>
    Math.min(
        window.innerWidth - 24,
        window.innerWidth * 0.95
    );

const getCompactHeight = () =>
    mobileQuery.matches ? 48 : 54;

let headerExpanded = false;

let hasCounted = false;

let counterTween = null;


gsap.set(navbar, {
    width: getCompactWidth()
});


/* =========================================================
   HEADER — STATS / COUNTER
========================================================= */

function setStatsAccessibility(visible) {

    navStats.setAttribute(
        "aria-hidden",
        visible ? "false" : "true"
    );
}


function revealStats(duration) {

    gsap.to(navStats, {
        autoAlpha: 1,
        x: 0,
        duration: reduceMotion() ? 0 : duration,
        ease: "power3.out",
        overwrite: true
    });
}


function hideStats() {

    gsap.to(navStats, {
        autoAlpha: 0,
        x: 18,
        duration: reduceMotion() ? 0 : 0.25,
        ease: "power2.in",
        overwrite: true
    });
}


function startCounter() {

    if (hasCounted) {
        return;
    }

    hasCounted = true;

    if (reduceMotion()) {

        navStatsValue.textContent = counterTarget;

        return;
    }

    const counterState = {
        value: 0
    };

    counterTween = gsap.to(counterState, {
        value: counterTarget,
        duration: 1.3,
        ease: "power2.out",
        onUpdate() {

            navStatsValue.textContent =
                Math.round(counterState.value);
        }
    });
}


/* =========================================================
   HEADER — EXPAND / COLLAPSE
========================================================= */

function setToggleState(expanded) {

    navToggle.setAttribute(
        "aria-expanded",
        expanded ? "true" : "false"
    );

    navToggleText.textContent =
        expanded ? "Close" : "Menu";
}


function expandHeader() {

    if (headerExpanded) {
        return;
    }

    headerExpanded = true;

    navbar.classList.add("is-expanded");

    setToggleState(true);
    setStatsAccessibility(true);

    let targetHeight = getCompactHeight();

    if (mobileQuery.matches) {

        const previousHeight = navbar.style.height;

        navbar.style.height = "auto";

        targetHeight = navbar.offsetHeight;

        navbar.style.height =
            previousHeight || `${getCompactHeight()}px`;
    }

    gsap.killTweensOf(navbar);

    gsap.to(navbar, {
        width: getExpandedWidth(),
        height: targetHeight,
        borderRadius: mobileQuery.matches ? 24 : 30,
        duration: reduceMotion() ? 0 : 0.7,
        ease: "power3.out",
        overwrite: true
    });

    revealStats(0.5);
    startCounter();
}


function collapseHeader() {

    if (!headerExpanded) {
        return;
    }

    headerExpanded = false;

    setToggleState(false);
    setStatsAccessibility(false);
    hideStats();

    gsap.killTweensOf(navbar);

    gsap.to(navbar, {
        width: getCompactWidth(),
        height: getCompactHeight(),
        borderRadius: 50,
        duration: reduceMotion() ? 0 : 0.55,
        ease: "power3.out",
        overwrite: true,
        onComplete() {

            navbar.classList.remove("is-expanded");

            navbar.style.height = "";
        }
    });
}


function toggleHeader() {

    if (headerExpanded) {

        collapseHeader();

    } else {

        expandHeader();
    }
}


/* =========================================================
   HEADER — POINTER / TOUCH EVENTS
========================================================= */

navbar.addEventListener("pointerenter", (event) => {

    if (event.pointerType === "mouse" && hoverQuery.matches) {

        expandHeader();
    }
});


navbar.addEventListener("pointerleave", (event) => {

    if (event.pointerType === "mouse" && hoverQuery.matches) {

        collapseHeader();
    }
});


navbar.addEventListener("click", (event) => {

    if (hoverQuery.matches) {
        return;
    }

    if (event.target.closest("a")) {
        return;
    }

    if (event.target.closest(".nav-toggle")) {
        return;
    }

    toggleHeader();
});


navToggle.addEventListener("click", (event) => {

    event.stopPropagation();

    toggleHeader();
});


navLinks.forEach((link) => {

    link.addEventListener("click", () => {

        if (headerExpanded) {
            collapseHeader();
        }
    });
});


document.addEventListener("pointerdown", (event) => {

    if (
        headerExpanded &&
        !hoverQuery.matches &&
        !navbar.contains(event.target)
    ) {

        collapseHeader();
    }
});


/* =========================================================
   HERO — COUNTER
========================================================= */

function updateCounter(progress) {

    if (!currentNumber) {
        return;
    }

    let number;

    if (progress < 0.25) {

        number = "01";

    } else if (progress < 0.50) {

        number = "02";

    } else if (progress < 0.75) {

        number = "03";

    } else {

        number = "04";
    }

    if (currentNumber.textContent !== number) {

        currentNumber.textContent = number;
    }
}


/* =========================================================
   HERO — SCROLL ANIMATION
========================================================= */

function buildHeroAnimation({
    leftX,
    rightX,
    lift,
    secondLift,
    pinEnd
}) {

    gsap.set(leftCard1, {
        x: leftX,
        y: lift,
        rotate: -3,
        scale: 0.9,
        opacity: 0,
        clipPath: "inset(0% 0% 100% 0%)"
    });

    gsap.set(leftCard2, {
        x: leftX * 1.18,
        y: secondLift,
        rotate: -4,
        scale: 0.9,
        opacity: 0,
        clipPath: "inset(0% 0% 100% 0%)"
    });

    gsap.set(rightCard1, {
        x: rightX,
        y: lift,
        rotate: 3,
        scale: 0.9,
        opacity: 0,
        clipPath: "inset(0% 0% 100% 0%)"
    });

    gsap.set(rightCard2, {
        x: rightX * 1.18,
        y: secondLift,
        rotate: 4,
        scale: 0.9,
        opacity: 0,
        clipPath: "inset(0% 0% 100% 0%)"
    });

    gsap.set(model, {
        scale: 1
    });

    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: pinEnd,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                updateCounter(self.progress);
            }
        }
    });


    timeline.to(
        heroLabel,
        {
            y: -24,
            opacity: 0.35,
            duration: 0.8,
            ease: "none"
        },
        0
    );


    timeline.to(
        heroTitle,
        {
            y: -90,
            scale: 0.92,
            opacity: 0.9,
            duration: 1.2,
            ease: "none"
        },
        0
    );


    timeline.to(
        heroDescription,
        {
            y: -35,
            opacity: 0.15,
            duration: 0.8,
            ease: "none"
        },
        0
    );


    timeline.to(
        model,
        {
            scale: 1.06,
            y: -18,
            duration: 2.4,
            ease: "none"
        },
        0
    );


    timeline.to(
        leftCard1,
        {
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.15,
            ease: "power3.out"
        },
        0.35
    );


    timeline.to(
        rightCard1,
        {
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.15,
            ease: "power3.out"
        },
        0.5
    );


    timeline.to(
        leftCard2,
        {
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.2,
            ease: "power3.out"
        },
        0.9
    );


    timeline.to(
        rightCard2,
        {
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.2,
            ease: "power3.out"
        },
        1.05
    );


    timeline.to(
        model,
        {
            scale: 1.12,
            y: -30,
            duration: 1.9,
            ease: "power1.inOut"
        },
        1.15
    );


    timeline.to(
        heroTitle,
        {
            y: -180,
            opacity: 0,
            duration: 1.1,
            ease: "power2.in"
        },
        1.35
    );


    timeline.to(
        [heroBottom, scrollCounter],
        {
            opacity: 0,
            duration: 0.6,
            ease: "none"
        },
        1.5
    );


    timeline.to(
        heroFade,
        {
            opacity: 1,
            duration: 1.1,
            ease: "none"
        },
        2.2
    );

    return timeline;
}


const heroMedia = gsap.matchMedia();


heroMedia.add(
    "(prefers-reduced-motion: reduce)",
    () => {

        gsap.set(projectCards, {
            clearProps: "all"
        });

        gsap.set(projectCards, {
            opacity: 1,
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            clipPath: "none"
        });

        gsap.set(heroFade, {
            opacity: 0
        });

        updateCounter(1);
    }
);


heroMedia.add(
    "(prefers-reduced-motion: no-preference) and (min-width: 801px)",
    () => {

        buildHeroAnimation({
            leftX: 300,
            rightX: -300,
            lift: 150,
            secondLift: 220,
            pinEnd: "+=260%"
        });
    }
);


heroMedia.add(
    "(prefers-reduced-motion: no-preference) and (max-width: 800px)",
    () => {

        buildHeroAnimation({
            leftX: 160,
            rightX: -160,
            lift: 110,
            secondLift: 160,
            pinEnd: "+=220%"
        });
    }
);


/* =========================================================
   HERO — NAME MARQUEE
========================================================= */

const marqueeMedia = gsap.matchMedia();


marqueeMedia.add(
    "(min-width: 801px) and (prefers-reduced-motion: no-preference)",
    () => {

        gsap.to(heroMarqueeTrack, {
            xPercent: -50,
            duration: 32,
            ease: "none",
            repeat: -1
        });
    }
);


/* =========================================================
   SECTION REVEALS
========================================================= */

const pageContext = gsap.context(() => {

    socialCards.forEach((card, index) => {

        gsap.from(card, {
            y: 80,
            opacity: 0,
            duration: 1,
            delay: index * 0.1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".social-videos",
                start: "top 82%",
                toggleActions: "play none none reverse"
            }
        });
    });


    gsap.from(brandCells, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.035,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".brands-grid",
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });


    workItems.forEach((item) => {

        gsap.from(item, {
            y: 80,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });


    skillBoxes.forEach((box, index) => {

        gsap.from(box, {
            y: 60,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.04,
            ease: "power3.out",
            scrollTrigger: {
                trigger: box,
                start: "top 90%",
                toggleActions: "play none none reverse"
            }
        });
    });


    experienceItems.forEach((item) => {

        gsap.from(item, {
            y: 60,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });


    let navbarHidden = false;

    ScrollTrigger.create({
        start: "top -120",
        end: 99999,
        onUpdate: (self) => {

            if (self.direction === 1 && !navbarHidden) {

                navbarHidden = true;

                gsap.to(navbar, {
                    y: -90,
                    duration: 0.45,
                    ease: "power3.out"
                });

            } else if (self.direction === -1 && navbarHidden) {

                navbarHidden = false;

                gsap.to(navbar, {
                    y: 0,
                    duration: 0.45,
                    ease: "power3.out"
                });
            }
        },
        onLeaveBack: () => {

            navbarHidden = false;

            gsap.to(navbar, {
                y: 0,
                duration: 0.45,
                ease: "power3.out"
            });
        }
    });
});


/* =========================================================
   RESIZE / LOAD / CLEANUP
========================================================= */

let resizeTimer = null;

window.addEventListener("resize", () => {

    if (!headerExpanded) {

        gsap.set(navbar, {
            width: getCompactWidth()
        });
    }

    window.clearTimeout(resizeTimer);

    resizeTimer = window.setTimeout(() => {

        ScrollTrigger.refresh();

    }, 160);
});


window.addEventListener("load", () => {

    ScrollTrigger.refresh();
});


window.addEventListener("pagehide", () => {

    pageContext.revert();

    heroMedia.revert();

    marqueeMedia.revert();

    if (counterTween) {
        counterTween.kill();
    }
});
