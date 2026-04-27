// initialize the scroll function
function loco() {

    gsap.registerPlugin(ScrollTrigger);

    // Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll
    const locoScroll = new LocomotiveScroll({
        el: document.querySelector("#main"),
        smooth: true
    });

    // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
    locoScroll.on("scroll", ScrollTrigger.update);

    // tell ScrollTrigger to use these proxy methods for the "#main" element since Locomotive Scroll is hijacking things
    ScrollTrigger.scrollerProxy("#main", {

        scrollTop(value) {
            return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
        }, // we don't have to define a scrollLeft because we're only scrolling vertically.

        getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },

        // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
        pinType: document.querySelector("#main").style.transform ? "transform" : "fixed"

    });

    // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

    // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
    ScrollTrigger.refresh();

}

// calling the scroll function
loco();


/* ------------------------ ALL VIDEO CONTROLS SCRIPT ---------------------- */

// selecting all video boxes and adding event listeners to play and pause buttons
const videoBoxes = document.querySelectorAll(".video-box");

videoBoxes.forEach((box) => {

    const video = box.querySelector("video");
    const playBtn = box.querySelector(".play");
    const pauseBtn = box.querySelector(".pause");

    // looping all videos
    video.loop = true;

    // play
    playBtn.addEventListener("click", () => {
        video.play();

        playBtn.classList.remove("active");
        pauseBtn.classList.add("active");
    });

    // pause
    pauseBtn.addEventListener("click", () => {
        video.pause();

        pauseBtn.classList.remove("active");
        playBtn.classList.add("active");
    });

    const circle = box.querySelector(".progress-ring__circle");
    const radius = 18;
    const circumference = 2 * Math.PI * radius;

    // initial setup
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;

    // update on time change
    video.addEventListener("timeupdate", () => {
        const progress = video.currentTime / video.duration;

        const offset = circumference - progress * circumference;
        circle.style.strokeDashoffset = offset;
    });

});


/* ------------------------ PAGE ONE SCROLL TRIGGER ------------------------ */

// scroll trigger for page one hero content (video to play on scroll)
gsap.to("#page-one", {

    scrollTrigger: {
        trigger: "#page-one",
        start: "1% top",
        end: "bottom top",
        scroller: "#main",
    },

    onStart: () => {
        document.querySelector("#page-one>.heroVideo").play();
    }

});

// pinning page one
gsap.to("#page-one", {
    scrollTrigger: {
        trigger: "#page-one",
        start: "top top",
        end: "bottom top",
        scroller: "#main",
        pin: true,
    }
})

/* ------------------------ PAGE TWO SCROLL TRIGGER ------------------------ */

// scroll trigger for page two to show the subnav
gsap.to(".subnav", {
    scrollTrigger: {
        trigger: "#page-two",
        start: "top 5%",
        end: "top top",
        scroller: "#main",
        scrub: true,

        onEnter: () => {
            document.querySelector(".subnav").classList.add("show");
        },

        onLeaveBack: () => {
            document.querySelector(".subnav").classList.remove("show");
        }

    }
});


/* ------------------------ PAGE TWO SCROLL TRIGGER ------------------------ */

// scroll trigger for page three video to play and pause on scroll
const pageThreeVideo = document.querySelector("#page-three video");

ScrollTrigger.create({
    trigger: "#page-three",
    start: "top 70%",  
    end: "bottom top",
    scroller: "#main",

    onEnter: () => {
        pageThreeVideo.play();
    },

    onEnterBack: () => {
        pageThreeVideo.play();
    },

    onLeave: () => {
        pageThreeVideo.pause();
    },

    onLeaveBack: () => {
        pageThreeVideo.pause();
    },
    
});

