function navigateToLogin() {
  if (!window.location.href.includes("platform=android")) {
    window.location.href = "/login?redirect=" + window.location.pathname;
  }
}

function chromeShare() {
  if (navigator.share) {
    var whatsappUrl = profileData.shareUrl;
    var whatsappHref = document.querySelector(".whatsapp-share").getAttribute("href");
    whatsappHref = whatsappHref + " " + encodeURIComponent(whatsappUrl);
  }
}

function glammInsider(isLoggedIn, profileData, rewards) {
  var i;
  var signIn = document.querySelector(".sign-in");
  if (signIn) {
    signIn.href = "/login";
  }
  var birthdayWant = document.querySelector(".js-birthday-events");
  if (birthdayWant) {
    birthdayWant.href = "/glamm-insider#birthday-popup";
  }

  var acc = document.querySelectorAll(".cust-accordrion-panel-wrapper");
  if (acc && acc.forEach) {
    acc.forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.stopImmediatePropagation();
        var panel = this.querySelector(".cust-accordrion-panel");
        if (panel) {
          this.classList.remove("active");
          if (panel.style.display === "block") {
            panel.style.display = "none";
            this.classList.remove("active");
          } else {
            panel.style.display = "block";
            this.classList.add("active");
          }
        }
      });
    });
  }

  if (isLoggedIn) {
    var removeSignIn = document.querySelector(".insider-notlogin");
    if (removeSignIn) {
      removeSignIn.style.display = "none";
    }

    var joinNow = document.querySelectorAll(".join-now");
    if (joinNow) {
      for (i = 0; i < joinNow.length; i++) {
        joinNow[i].style.display = "none";
      }
    }

    var setName = document.querySelector(".glamm-insider-name");
    var setPhone = document.querySelector(".glamm-insider-number");
    var levelName = document.querySelector(".level");
    var rewardPoints = document.querySelector(".reward-points");
    var network = document.querySelector(".network");
    if (setName && profileData) {
      setName.innerHTML = profileData.firstName;
    }
    if (setPhone && profileData) {
      setPhone.innerHTML = profileData.phoneNumber;
    }
    if (levelName && profileData) {
      levelName.innerHTML = profileData.memberType.levelName.toUpperCase();
    }
    if (network) {
      network.innerHTML = (rewards && rewards.circle && rewards.circle.total) || 0;
    }
    if (rewardPoints) {
      rewardPoints.innerHTML = (rewards && rewards.currentBalance) || 0;
    }

    var cashbackOnPurchase = document.querySelectorAll(".cashbackonpurchase");
    var hideForCashback = document.querySelectorAll(".hide-for-cashback");
    var showForCashback = document.querySelectorAll(".show-for-cashback");
    var insiderTopBanner = document.querySelector(".insider-top-banner");
    var welComeGlammInsider = document.querySelector(".welComeGlammInsider");
    var profileImage = document.getElementsByClassName("profile-image");
    var glamminsiderBackBtn = document.querySelector(".back-to-glamminsider");
    var shopnowBtn = document.querySelector(".shop-now-btn");

    if (profileImage[0] && profileData && profileData.meta.profileImage && profileData.meta.profileImage.original) {
      profileImage[0].style.backgroundImage = "url(" + profileData.meta.profileImage.original + ")";
    } else if (profileImage[0]) {
      profileImage[0].style.backgroundImage = "url(https://files.myglamm.com/site-images/original/ic-user.png)";
    }

    if (window.location.href.includes("request_source=mobile_app")) {
      var onlyForApp = document.querySelector(".only-for-apps");

      if (onlyForApp) {
        onlyForApp.classList.remove("m-hide-for-mob");
        onlyForApp.style.display = "block";
      }
    }

    if (cashbackOnPurchase.length > 0) {
      cashbackOnPurchase.forEach(element => {
        element.addEventListener("click", function (e) {
          window.scrollTo(0, 0);
          e.preventDefault();
          if (glamminsiderBackBtn) {
            glamminsiderBackBtn.classList.remove("hide");
            element.style.display = "block";
          }
          if (shopnowBtn) {
            shopnowBtn.classList.remove("hide");
          }
          if (hideForCashback.length > 0) {
            hideForCashback.forEach(element => {
              element.style.display = "none";
            });
          }
          if (showForCashback.length > 0) {
            showForCashback.forEach(element => {
              element.classList.remove("is-loggedin");
              if (insiderTopBanner) {
                insiderTopBanner.classList.remove("logged-in");
              }
              if (welComeGlammInsider) {
                welComeGlammInsider.classList.remove("logged-in");
              }
              element.style.display = "block";
            });
          }
        });
      });
    }

    if (glamminsiderBackBtn) {
      glamminsiderBackBtn.addEventListener("click", function (e) {
        if (hideForCashback.length > 0) {
          hideForCashback.forEach(element => {
            element.style.display = "block";
          });
        }
        if (showForCashback.length > 0) {
          showForCashback.forEach(element => {
            element.classList.add("is-loggedin");
            if (insiderTopBanner) {
              insiderTopBanner.classList.add("logged-in");
            }
            if (welComeGlammInsider) {
              welComeGlammInsider.classList.add("logged-in");
            }
            element.style.display = "none";
          });
        }
      });
    }
  } else {
    if (joinNow) {
      for (i = 0; i < joinNow.length; i++) {
        joinNow[i].style.display = "none";
      }
    }
    var details = document.querySelector(".insider-detail");
    var cardSwiper = document.querySelector(".for-m-mob-site");
    if (details) {
      details.style.display = "none";
    }
    if (cardSwiper) {
      cardSwiper.style.display = "none";
    }
  }
}

function checkUserRefer(isLoggedIn, profileData) {
  var i;
  var signUp = document.querySelectorAll(".signup");
  if (signUp) {
    [].forEach.call(signUp, function (signUp) {
      signUp.href = "/login";
    });
  }
  var howitWorks = document.querySelector(".referral-howitwork");
  if (howitWorks) {
    var imges = document.querySelectorAll("img");
    for (i = 0; i < imges.length; i++) {
      imges[i].style.display = "initial";
    }
  }
  var trackReferal = document.querySelector(".track-referrals");
  if (trackReferal) {
    trackReferal.href = "/dashboard";
  }
  var referScreen = document.querySelectorAll(".hide-for-notloggedin");
  var signupRefer = document.querySelectorAll(".is-loggedin");
  var referCode = document.querySelector(".refer-code");
  var welComeGlammInsider = document.querySelector(".welComeGlammInsider");
  var insiderTopBanner = document.querySelector(".insider-top-banner");
  if (isLoggedIn) {
    if (referCode && profileData) {
      referCode.innerHTML = profileData.referenceCode;
    }

    if (welComeGlammInsider) {
      welComeGlammInsider.classList.add("logged-in");
    }

    if (insiderTopBanner) {
      insiderTopBanner.classList.add("logged-in");
    }

    if (signupRefer.length > 0) {
      signupRefer.forEach(element => {
        element.style.display = "none";
      });
    }
  } else {
    if (referScreen.length > 0) {
      referScreen.forEach(element => {
        element.style.display = "none";
      });
    }
    if (welComeGlammInsider) {
      welComeGlammInsider.classList.remove("logged-in");
    }
    if (insiderTopBanner) {
      insiderTopBanner.classList.remove("logged-in");
    }
  }

  if (isLoggedIn && profileData) {
    var whatsappUrl = profileData && profileData.shareUrl ? profileData.shareUrl : "";
    if (document.querySelector(".whatsapp-share")) {
      var whatsappHref = document.querySelector(".whatsapp-share").getAttribute("href");
      whatsappHref = whatsappHref + " " + encodeURIComponent(whatsappUrl);
      document.querySelector(".whatsapp-share").setAttribute("href", whatsappHref);
    }
    var smsUrl = profileData.shareUrl;
    if (document.querySelector(".sms-share")) {
      var smsRef = document.querySelector(".sms-share").getAttribute("href");
      smsRef = smsRef + " " + encodeURIComponent(smsUrl);
      document.querySelector(".sms-share").setAttribute("href", smsRef);
    }
    if (document.querySelector(".ref-copyLink")) {
      document.querySelector(".copy").addEventListener("click", function () {
        var d = profileData.shareUrl.split("/");
        d.pop();
        copyLink = `${d.join("/")}?rc=${profileData.referenceCode}`;
        navigator.clipboard.writeText(copyLink);
        var copiedText = document.createElement("p");
        copiedText.style.fontSize = "12px";
        copiedText.innerHTML = "Link copied!";
        document.querySelector(".ref-copyLink").append(copiedText);
        setTimeout(() => {
          copiedText.parentNode.removeChild(copiedText);
        }, 1000);
      });
    }
  }
}

function referAndEarn(isLoggedIn) {
  if (document.getElementsByClassName("is-loggedin") != null) {
    if (document.getElementsByClassName("is-loggedin").length > 0) {
      let classArray = document.getElementsByClassName("is-loggedin");
      for (let index = 0; index < classArray.length; index++) {
        var element = classArray[index];
        element.display = "none";
      }
    }
  }

  var moreBtn = document.querySelector(".more");
  if (moreBtn !== null) {
    if (moreBtn && navigator.share) {
      moreBtn.addEventListener("click", function () {
        alert("Error");
      });
    } else {
      moreBtn.style.display = "none";
    }
  }

  /* copy text*/
  // if (document.getElementsByClassName("copy")) {
  //   let copy = document.getElementsByClassName("copy")[0];
  //   if (document.querySelector(".copy") != null) {
  //     document.querySelector(".copy").addEventListener("click", function() {
  //       alert("Error");
  //     });
  //     //this.renderer.addClass(copy, "ga-shared-link");
  //   }
  // }
  /* copy text*/

  if (document.getElementsByClassName("m-hide-for-mob") != null) {
    if (document.getElementsByClassName("m-hide-for-mob").length > 0) {
      let classArray = document.getElementsByClassName("m-hide-for-mob");
      for (let index = 0; index < classArray.length; index++) {
        var element = classArray[index];
        element.style.display = "none";
      }
    }
  }

  if (document.getElementsByClassName("hide-mob-beauty") != null) {
    if (document.getElementsByClassName("hide-mob-beauty").length > 0) {
      let classArray = document.getElementsByClassName("hide-mob-beauty");
      for (let index = 0; index < classArray.length; index++) {
        var element = classArray[index];
        element.style.display = "none";
      }
    }
  }

  if (document.getElementsByClassName("hide") != null && isLoggedIn) {
    if (document.getElementsByClassName("hide").length > 0) {
      let classArray = document.getElementsByClassName("hide");
      for (let index = 0; index < classArray.length; index++) {
        var element = classArray[index];
        element.style.display = "block";
      }
    }
  }

  if (document.getElementsByClassName("join-now").length > 0) {
    let classArray = document.getElementsByClassName("join-now");
    for (let index = 0; index < classArray.length; index++) {
      var ele = classArray[index];
      ele.addEventListener("click", navigateToLogin);
    }
  }

  if (document.getElementsByClassName("signup") != null) {
    if (document.getElementsByClassName("signup").length > 0) {
      let classArray = document.getElementsByClassName("signup");
      for (let index = 0; index < classArray.length; index++) {
        var ele = classArray[index];
        ele.removeAttribute("href");
        ele.addEventListener("click", navigateToLogin);
      }
    }
  }
}

function videoModals() {
  if (document.querySelector(".lit-popup-video")) {
    let imgVideoArray = document.getElementsByClassName("lit-popup-video");
    for (let i = 0; i < imgVideoArray.length; i++) {
      imgVideoArray[i].addEventListener("click", function (e) {
        var data = e.srcElement.parentNode.dataset.href;
        var event = new CustomEvent("show-lit-popup-video", {
          bubbles: true,
          detail: data,
        });
        document.dispatchEvent(event);
      });
    }
  }
}

function activateSliders() {
  var ele = document.getElementsByClassName("custom-swiper-pagination")[0];
  var swiperWithNavigation = document.getElementsByClassName("swiper-pagination-navigation")[0];
  var productSwiper = document.getElementsByClassName("product-swiper-container")[0];
  var productSwiperType2 = document.getElementsByClassName("product-swiper-container-type2")[0];
  var swiperCoryNavigation = document.getElementsByClassName("swiper-cory-video-container")[0];
  if (swiperCoryNavigation) {
    var swiper = new Swiper(".swiper-cory-video-container", {
      observer: true,
      direction: "horizontal",
      navigation: false,
      pagination: false,
      width: 380,
    });
  }

  var glowSliderCenterMode = new Swiper(".glow-slider-center-mode");

  var glowSliderBullets = new Swiper(".glow-slider-bullets", {
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
      dynamicMainBullets: 4,
    },
  });

  if (ele) {
    var swiper = new Swiper(".swiper-container", {
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
        dynamicMainBullets: 4,
      },
    });
  } else if (swiperWithNavigation) {
    var swiper = new Swiper(".swiper-pagination-navigation", {
      slidesPerView: 1,
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
  } else {
    var swiper = new Swiper(".swiper-container", {
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }
  let swContArr = document.getElementsByClassName("swiper-container");
  if (swContArr.length) {
    let swSlide = document.getElementsByClassName("swiper-slide");
    if (swSlide) {
      for (let i = 0; i < swSlide.length; i++) {
        swSlide[i].className += " ss-additional";

        if (document.getElementsByClassName("swiper-wrapper")[i]) {
          document.getElementsByClassName("swiper-wrapper")[i].style.display = "flex";
          if (document.getElementsByClassName("swiper-button-next")[i]) {
            document.getElementsByClassName("swiper-button-next")[i].style.position = "absolute";
          }
          if (document.getElementsByClassName("swiper-button-prev")[i]) {
            document.getElementsByClassName("swiper-button-prev")[i].style.position = "absolute";
          }
          document.getElementsByClassName("swiper-container")[i].className += " sc-additional";
        }
      }
    }
    for (let i = 0; i < swContArr.length; i++) {
      let noOfSlide = swContArr[i].childNodes[0].childNodes.length;
      if (noOfSlide < 2 && noOfSlide > 0) {
        swContArr[i].childNodes[1].style.display = "none";
        swContArr[i].childNodes[2].style.display = "none";
      }
    }
  }
}

// Changing the Links Desktop Links provided on Static Page to Mobile Links
/*
function staticLinkRedirect() {
  const desktopLinks = document.querySelectorAll("a");
  if (desktopLinks) {
    desktopLinks.forEach(url => {
      if (url.href.includes("www")) {
        url.href = url.href.replace("www", "m");
      }
    });
  }
}
*/

function fire() {
  if (window.isLocalStorageAvailable && !window.isLocalStorageAvailable()) {
    return;
  }
  var isLoggedIn = localStorage.getItem("memberId");
  var profileData = JSON.parse(localStorage.getItem("profile"));
  var rewards = JSON.parse(localStorage.getItem("rewards"));
  glammInsider(isLoggedIn, profileData, rewards);
  checkUserRefer(isLoggedIn, profileData);
  referAndEarn(isLoggedIn);
  (function () {
    var swiperInterval = setInterval(function () {
      if (window.Swiper) {
        activateSliders();
        clearInterval(swiperInterval);
      }
    }, 200);
  })();
  videoModals();
}
fire();
