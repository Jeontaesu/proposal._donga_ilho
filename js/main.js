$(document).ready(function () {
  $(".owl-carousel").owlCarousel({
    loop: false,
    center: true,
    items: 3.6,
    margin: 150,
    dots: false,
  });
});

window.addEventListener("load", function () {
  gsap.registerPlugin(ScrollTrigger);

  // let tl = gsap.timeline({
  //   scrollTrigger: {
  //     trigger: ".sc__ilho",
  //     scrub: 1,
  //     end: "200%",
  //     pin: true,
  //   },
  // });
  // tl.from(".sc__ilho .ilhoFoundation", { opacity: 0, yPercent: 20 });
  // .to(".mobile", {scale: 1});

  let tl = gsap.timeline();

  tl.from(".sc__ilho .ilhoFoundation", {
    opacity: 0,
    duration: 1,
    yPercent: 20,
    // ease:'linear'
  });

  gsap.from(".sc__start .sc__area-title > *", {
    scrollTrigger: {
      trigger: ".sc__start",
      start: "0% 70%",
      end: "80% 100%",
      scrub: 2,
    },
    opacity: 0,
    stagger: 0.1,
    yPercent: 100,
    duration: 0.5,
  });
  gsap.from(".sc__partner .inner > *", {
    scrollTrigger: {
      trigger: ".sc__partner",
      start: "0% 70%",
      end: "80% 100%",
      scrub: 2,
    },
    opacity: 0,
    stagger: 0.1,
    yPercent: 100,
    duration: 0.5,
  });
  gsap.from(".sc__news .sc__area > *", {
    scrollTrigger: {
      trigger: ".sc__news",
      start: "30% 60%",
      end: "80% 100%",
      scrub: 2,
    },
    opacity: 0,
    stagger: 0.1,
    yPercent: 100,
    duration: 1,
  });

  const slideUp = document.querySelectorAll('[data-js="slideup"]');
  slideUp.forEach(function (item) {
    gsap.to(item, {
      scrollTrigger: {
        trigger: item,
        start: "0 60%",
        end: "bottom",
        stagger: 2,
        scrub: 1,
        onEnter: () => {
          item.classList.add("act");
        },
        onLeave: () => {
          item.classList.remove("act");
        },
        onEnterBack: () => {
          item.classList.add("act");
        },
        onLeaveBack: () => {
          item.classList.remove("act");
        },
      },
    });
  });

  const objects = document.querySelectorAll(".sc__start .obj");

  // 각 객체의 초기 위치와 이동 방향을 설정합니다.
  const animations = [
    { y: 100, from: "left" }, // 1번 obj: 좌측에서
    { y: 100, from: "right" }, // 2번 obj: 우측에서
    { y: 100, from: "bottom" }, // 3번 obj: 아래에서
    { y: 100, from: "left-bottom" }, // 4번 obj: 좌측 아래에서
  ];

  // 각 객체에 대해 애니메이션을 설정합니다.
  objects.forEach((obj, index) => {
    const { y, from } = animations[index];

    // 초기 위치 설정
    let initialX = 0;
    let initialY = y;

    if (from === "left") {
      initialX = -100; // 좌측에서 시작
    } else if (from === "right") {
      initialX = 100; // 우측에서 시작
    } else if (from === "bottom") {
      initialY = 100; // 아래에서 시작
      initialX = 0; // 수평 위치는 0
    } else if (from === "left-bottom") {
      initialX = -50; // 좌측 아래에서 수평 위치
      initialY = 100; // 수직 위치는 아래에서
    }

    // 객체의 초기 상태를 설정합니다.
    gsap.set(obj, { opacity: 0, x: initialX, y: initialY });

    // ScrollTrigger를 사용하여 스크롤 위치에 따라 애니메이션을 설정합니다.
    ScrollTrigger.create({
      trigger: obj, // 트리거 요소
      start: "top 80%", // 스크롤 위치
      onEnter: () => {
        // 객체가 나타날 때 애니메이션 실행
        gsap.to(obj, {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 1,
          delay: index * 0.2, // 순차적으로 나타나게 하기 위해 지연 추가
        });
      },
      onLeaveBack: () => {
        // 스크롤을 위로 올렸을 때 객체를 초기화
        gsap.to(obj, {
          opacity: 0,
          x: initialX,
          y: initialY,
          duration: 1,
        });
      },
    });
  });
});
