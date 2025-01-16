import Swiper from "swiper";
import "swiper/swiper-bundle.css";

const swiper = new Swiper(".swiper-container", {
  slidesPerView: 1, // 한 번에 보여줄 슬라이드 수
  spaceBetween: 10, // 슬라이드 간 간격
  // navigation: {
  //   nextEl: ".swiper-button-next",
  //   prevEl: ".swiper-button-prev",
  // },
  loop: true, // 무한 루프
});
