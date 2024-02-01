const isLoggedIn = localStorage.getItem("memberId");
const profile = JSON.parse(localStorage.getItem("profile"));

function ready(fn) {
  if (document.readyState != "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}
ready(() => {
  let guestContent = document.querySelectorAll(".is-loggedin");
  if (guestContent) {
    if (isLoggedIn) {
      guestContent.forEach(contnent => {
        contnent.style.display = "none";
      });
      let referal = document.querySelector(".referral-share-sec");
      if (referal) {
        referalCode = document.querySelector("h3");
        referalCode.innerText = profile.referenceCode.toUpperCase();

        // Facebook Redirection
        facebook = document.querySelector(".fb");
        facebook.parentNode.target = "_blank";
        facebook.parentNode.href = "https://www.facebook.com/sharer?u=" + profile.shareUrl + "&rc=" + profile.referenceCode;

        // Twitter Redirection
        twitter = document.querySelector(".twitter");
        twitter.parentNode.target = "blank";
        twitter.parentNode.href = "https://twitter.com/intent/tweet?url=" + profile.shareUrl + "&rc=" + profile.referenceCode;

        // Copy Link
        const span = document.querySelector(".copy-link");
        const copy = span.parentNode;
        copy.addEventListener("click", event => {
          navigator.clipboard.writeText(profile.shareUrl);
          window.alert("Share Url Copied");
        });
      }
    } else if (document.querySelector(".hide-for-notloggedin ")) {
      document.querySelector(".hide-for-notloggedin ").style.display = "none";
    }
  }
});

setTimeout(() => {
  const setDetails = () => {
    let glammInsider = document.querySelector(".glamm-insider-user");

    if (glammInsider) {
      if (isLoggedIn) {
        // glammInsider.style.display = "none";
        const setName = document.querySelector(".glamm-insider-name");
        const setPhone = document.querySelector(".glamm-insider-number");
        setName.innerHTML = profile.firstName;
        setPhone.innerHTML = profile.phoneNumber;
      } else {
        const neverContent = document.querySelector(".insider-reward-never-content");
        document.querySelector(".insider-detail").style.display = "none";
        if (neverContent) {
          neverContent.style.display = "none";
        }
      }
    }
  };
  setDetails();

  const buy = document.querySelectorAll(".buy-now.is-loggedin");
  if (buy && isLoggedIn) {
    buy.forEach(ele => {
      ele.style.display = "none";
    });
  }

  // Signup Buttons on Static Page
  const joinNow = document.querySelectorAll(".join-now");
  if (!isLoggedIn && joinNow) {
    joinNow.forEach(element => {
      if (window.location.href === `${window.location.origin}${window.location.pathname}#signup`) {
        element.addEventListener("click", () => {
          window.location.reload();
        });
      } else {
        element.href = `${window.location.pathname}/#signup`;
      }
    });
  }

  const signUp = document.querySelector(".signup");
  if (signUp) {
    if (window.location.href === `${window.location.origin}${window.location.pathname}#signup`) {
      signUp.addEventListener("click", () => {
        window.location.reload();
      });
    } else {
      signUp.href = `${window.location.pathname}/#signup`;
    }
  }

  const liveGlamour = document.querySelectorAll("a");
  if (liveGlamour) {
    liveGlamour.forEach(val => {
      if (val.innerHTML === "Sign in to Live Glamorous!") {
        if (window.location.href === `${window.location.origin}${window.location.pathname}#signup`) {
          val.addEventListener("click", () => {
            window.location.reload();
          });
        } else {
          val.addEventListener("click", () => {
            window.location.href = `${window.location.origin}${window.location.pathname}/#signup`;
          });
        }
        console.log(val);
      }
    });
  }
  // End of signUp Buttons

  // Image Modal /press
  $(".image-gallery").magnificPopup({
    delegate: "a",
    type: "image",
    closeOnContentClick: false,
    closeBtnInside: false,
    mainClass: "mfp-with-zoom mfp-img-mobile",
    gallery: {
      enabled: true,
    },
    zoom: {
      enabled: true,
      duration: 300, // don't foget to change the duration also in CSS
      opener(element) {
        return element.find("img");
      },
    },
  });

  // Video Modal
  $(".popup-youtube").magnificPopup({
    disableOn: 310,
    type: "iframe",
    mainClass: "mfp-fade",
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false,
    callbacks: {
      open() {
        $("body").addClass("noscroll");
      },
      close() {
        $("body").removeClass("noscroll");
      },
    },
  });

  var pageSlider = new Swiper(".squadSlider", {
    slidesPerView: 2,
    watchOverflow: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      992: {
        slidesPerView: 2,
      },
      604: {
        slidesPerView: 1,
      },
    },
  });

  var gkowSlider = new Swiper(".glow-product-gallery", {
    slidesPerView: 3,
    watchOverflow: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      1280: {
        slidesPerView: 3,
      },
    },
  });

  var pageSlider = new Swiper(".pageSlider", {
    slidesPerView: 2,
    spaceBetween: 30,
    width: 1160,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      1500: {
        width: 860,
      },
      992: {
        slidesPerView: 2,
      },
    },
  });

  var swiperBlogContainer = new Swiper(".swiper-slider-container", {
    slidesPerView: 1,
    spaceBetween: 30,
    width: 1160,
    watchOverflow: true,
    navigation: true,
    autoHeight: false,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      1500: {
        width: 1366,
      },
      640: {
        slidesPerView: 1,
      },
    },
  });
  var looksSlide = new Swiper(".glamm-ex-img-gallery", {
    slidesPerView: 4,
    watchOverflow: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      1366: {
        slidesPerView: 4,
      },
      1280: {
        slidesPerView: 3,
      },
      767: {
        slidesPerView: 2,
      },
      604: {
        slidesPerView: 1,
      },
    },
  });
  var looksSlide = new Swiper(".testimonials-gallery", {
    slidesPerView: 4,
    watchOverflow: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      767: {
        slidesPerView: 1,
      },
      604: {
        slidesPerView: 1,
      },
    },
  });
  var looksSlide = new Swiper(".glamm-ex-video-slider", {
    slidesPerView: 1,
    watchOverflow: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      1366: {
        slidesPerView: 1,
      },
      1280: {
        slidesPerView: 1,
      },
      767: {
        slidesPerView: 1,
      },
      604: {
        slidesPerView: 1,
      },
    },
  });
  var looksSlide = new Swiper(".poductSliderConfig", {
    slidesPerView: 3,
    watchOverflow: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      767: {
        slidesPerView: 2,
      },
      604: {
        slidesPerView: 1,
      },
    },
  });
  var brProductSlide = new Swiper(".poductSliderConfig", {
    slidesPerView: 3,
    watchOverflow: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      767: {
        slidesPerView: 2,
      },
      604: {
        slidesPerView: 1,
      },
    },
  });

  var looksSlide = new Swiper(".pose-product-gallery", {
    slidesPerView: 3,
    watchOverflow: true,
    // autoHeight: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      1280: {
        slidesPerView: 3,
      },
      767: {
        slidesPerView: 2,
      },
    },
  });
  var x = new Swiper(".slidesPerView-one", {
    slidesPerView: 1,
    watchOverflow: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
  var xPage = new Swiper(".swiper-pagination-navigation", {
    slidesPerView: 1,
    watchOverflow: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
    },
    mousewheel: true,
    keyboard: true,
  });
  var x = new Swiper(".mm-swiper-container", {
    slidesPerView: 4,
    watchOverflow: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      1366: {
        slidesPerView: 4,
      },
      1280: {
        slidesPerView: 3,
      },
      767: {
        slidesPerView: 2,
      },
      604: {
        slidesPerView: 1,
      },
    },
  });
  var productGallery = new Swiper(".common-product-gallery", {
    slidesPerView: 3,
    watchOverflow: true,
    // autoHeight: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      1280: {
        slidesPerView: 3,
      },
      767: {
        slidesPerView: 2,
      },
    },
  });
  var acc = document.querySelectorAll(".cust-accordrion-panel-wrapper");
  if (acc) {
    acc.forEach(el => {
      el.addEventListener("click", function () {
        var panel = this.querySelector(".cust-accordrion-panel");
        this.classList.remove("active");
        if (panel.style.display === "block") {
          panel.style.display = "none";
          this.classList.remove("active");
          this.classList.remove("modalOpen");
        } else {
          panel.style.display = "block";
          this.classList.add("active");
          this.classList.add("modalOpen");
          panel.style.maxHeight = "632px";
        }
      });
    });
  }

  var readdescription = document.querySelectorAll(".read-description");
  if (readdescription) {
    readdescription.forEach(el => {
      el.addEventListener("click", function () {
        // If text is shown less, then show complete
        if (this.getAttribute("for") == 0) {
          this.setAttribute("for", 1);
          // this.style.display = "block";
          var hgt = this.parentElement.previousSibling.children[0].scrollHeight;
          this.parentElement.previousSibling.style.height = hgt + "px";
          this.innerHTML = "Read Less";
        }
        // If text is shown complete, then show less
        else if (this.getAttribute("for") == 1) {
          this.setAttribute("for", 0);
          // this.style.display = "inline";
          this.innerHTML = "Read More";
          this.parentElement.previousSibling.style.height = "104px";
        }
      });
    });
  }

  $(".pre-tryo-look").slick({
    slidesToShow: 4,
    slidesToScroll: 4,
    dots: false,
    infinite: true,
    arrows: true,
    focusOnSelect: true,
    prevArrow: "<a href='#' class='slick-prev'><span><i class='ico icon-chevron-left'></i></span></a>",
    nextArrow: "<a href='#' class='slick-next'><span><i class='ico icon-chevron-right'></i></span></a>",
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });
  $(".lit-pre-product").slick({
    slidesToShow: 4,
    slidesToScroll: 4,
    dots: false,
    infinite: false,
    arrows: true,
    focusOnSelect: true,
    prevArrow: "<a href='#' class='slick-prev'><span><i class='ico icon-chevron-left'></i></span></a>",
    nextArrow: "<a href='#' class='slick-next'><span><i class='ico icon-chevron-right'></i></span></a>",
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });
  $(".mob-product-banner").slick({
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    speed: 3000,
    slidesToShow: 1,
    prevArrow: "<a href='#' class='slick-prev'><span><i class='ico icon-chevron-left'></i></span></a>",
    nextArrow: "<a href='#' class='slick-next'><span><i class='ico icon-chevron-right'></i></span></a>",
    fade: true,
    cssEase: "liner",
  });

  $(".myglamm-store").slick({
    autoplay: true,
    autoplaySpeed: 2000,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    prevArrow: "<a href='#' class='slick-prev'><span><i class='ico icon-chevron-left'></i></span></a>",
    nextArrow: "<a href='#' class='slick-next'><span><i class='ico icon-chevron-right'></i></span></a>",
  });
  $(".recommended-services").slick({
    slidesToShow: 3,
    slidesToScroll: 3,
    dots: false,
    infinite: false,
    prevArrow: "<a href='#' class='slick-prev'><span><i class='ico icon-chevron-left'></i></span></a>",
    nextArrow: "<a href='#' class='slick-next'><span><i class='ico icon-chevron-right'></i></span></a>",
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 639,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });
  $(".glamm-customer-view-slider").slick({
    slidesToShow: 5,
    slidesToScroll: 5,
    dots: false,
    infinite: false,
    prevArrow: "<a href='#' class='slick-prev'><span><i class='ico icon-chevron-left'></i></span></a>",
    nextArrow: "<a href='#' class='slick-next'><span><i class='ico icon-chevron-right'></i></span></a>",
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 639,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });

  $(".address-wrap").slick({
    slidesToShow: 3,
    slidesToScroll: 3,
    dots: false,
    infinite: false,
    prevArrow: "<a href='#' class='slick-prev'><span><i class='ico icon-chevron-left'></i></span></a>",
    nextArrow: "<a href='#' class='slick-next'><span><i class='ico icon-chevron-right'></i></span></a>",
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: "unslick",
      },
    ],
  });
  $(".product-avialbel-option").slick({
    slidesToShow: 6,
    slidesToScroll: 6,
    dots: false,
    infinite: false,
    prevArrow: "<a href='#' class='slick-prev'><span><i class='ico icon-chevron-left'></i></span></a>",
    nextArrow: "<a href='#' class='slick-next'><span><i class='ico icon-chevron-right'></i></span></a>",
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 639,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });
  $(".product-images").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: false,
    infinite: true,
  });
  $(".store-images").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: false,
    infinite: true,
  });
  $(".glamminsider-veriableWidth-slider").slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: false,
    arrows: false,
    infinite: false,
    responsive: [
      {
        breakpoint: 1184,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          variableWidth: true,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          variableWidth: true,
        },
      },
    ],
  });

  $(".time-line-content").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    arrows: false,
    asNavFor: ".the-timeline",
    fade: true,
  });
  $(".the-timeline").slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    dots: false,
    autoplay: false,
    autoplaySpeed: 3000,
    infinite: false,
    centerMode: false,
    focusOnSelect: true,
    asNavFor: ".time-line-content",
    arrows: false,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });
  $(".brand-story-banner")
    .on("init", slick => {
      $(".brand-story-banner").fadeIn(1500);
    })
    .slick({
      autoplay: false,
      autoplaySpeed: 2000,
      infinite: true,
      speed: 1000,
      slidesToShow: 1,
      fade: true,
      cssEase: "linear",
      prevArrow: "<a href='javascript:void(0);' class='slick-prev'><span><i class='ico icon-chevron-left'></i></span></a>",
      nextArrow: "<a href='javascript:void(0);' class='slick-next'><span><i class='ico icon-chevron-right'></i></span></a>",
      arrows: false,
      dots: false,
      asNavFor: ".brand-story-banner-bottom",
      responsive: [
        {
          breakpoint: 767,
          settings: {
            dots: true,
            fade: false,
            autoplaySpeed: 2000,
            speed: 500,
          },
        },
      ],
    });
  $(".brand-story-banner-bottom").slick({
    autoplay: false,
    autoplaySpeed: 2000,
    infinite: true,
    speed: 1000,
    slidesToShow: 6,
    slidesToScroll: 1,
    asNavFor: ".brand-story-banner",
    dots: true,
    vertical: false,
    focusOnSelect: true,
  });
  $(".chartity-partner-text").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    dots: false,
    asNavFor: ".chartity-partner-logo",
  });
  $(".chartity-partner-logo").slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: ".chartity-partner-text",
    dots: false,
    centerMode: true,
    focusOnSelect: true,
    infinite: true,
    prevArrow: "<a href='#' class='slick-prev'><span><i class='ico icon-chevron-left'></i></span></a>",
    nextArrow: "<a href='#' class='slick-next'><span><i class='ico icon-chevron-right'></i></span></a>",
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
          focusOnSelect: false,
        },
      },
    ],
  });
  $(".membership-offer-slider").slick({
    slidesToShow: 4,
    slidesToScroll: 4,
    dots: false,
    infinite: false,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          dots: false,
          variableWidth: true,
        },
      },
      {
        breakpoint: 639,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          variableWidth: true,
        },
      },
    ],
  });
  $(".chartity-organistion-partner").slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: false,
    centerMode: true,
    focusOnSelect: true,
    infinite: true,
    prevArrow: "<a href='#' class='slick-prev'><span><i class='ico icon-chevron-left'></i></span></a>",
    nextArrow: "<a href='#' class='slick-next'><span><i class='ico icon-chevron-right'></i></span></a>",
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
          focusOnSelect: false,
        },
      },
    ],
  });
  $(".slider-product-video-lit").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    //asNavFor: '.slider-product-video',
    dots: false,
    focusOnSelect: true,
    arrows: true,
    prevArrow: "<a href='#' class='slick-prev'><span><i class='ico icon-chevron-left'></i></span></a>",
    nextArrow: "<a href='#' class='slick-next'><span><i class='ico icon-chevron-right'></i></span></a>",
    responsive: [
      {
        breakpoint: 1028,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 639,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });

  $(".recommended-product").slick({
    slidesToShow: 3,
    slidesToScroll: 3,
    dots: false,
    infinite: false,
    prevArrow: "<a href='#' class='slick-prev'><span><i class='ico icon-chevron-left'></i></span></a>",
    nextArrow: "<a href='#' class='slick-next'><span><i class='ico icon-chevron-right'></i></span></a>",
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 639,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });
}, 1500);
