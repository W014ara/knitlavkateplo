const sw = new Swiper('.swiper-container-Gal', {
    slidesPerView: 1,
    spaceBetween: 30,
    speed: 400,
    loop: true,
    autoplay: {
        delay: 3000
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        // when window width is >= 320px
        320: {
          slidesPerView: 1,
          spaceBetween: 20
        },
        // when window width is >= 480px
        480: {
          slidesPerView: 1,
          spaceBetween: 30
        },
        // when window width is >= 640px
        640: {
          slidesPerView: 1,
          spaceBetween: 40
        },
        800: {
          slidesPerView: 1,
          spaceBetween: 40
        },
        1024: {
            slidesPerView: 1,
            spaceBetween: 40
        },
        1152: {
            slidesPerView: 1,
            spaceBetween: 40
        },
        1400: {
            slidesPerView: 1,
            spaceBetween: 40
        },
        1600: {
            slidesPerView: 1,
            spaceBetween: 40
        },
        1680: {
            slidesPerView: 1,
            spaceBetween: 40
        },
        1920: {
            slidesPerView: 1,
            spaceBetween: 40
        },
        2048: {
            slidesPerView: 1,
            spaceBetween: 40
        },
        2560: {
          slidesPerView: 1,
          spaceBetween: 40
        },
        3840: {
          slidesPerView: 1,
          spaceBetween: 40
        },
    }
});