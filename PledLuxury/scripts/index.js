window.onload = function () {
    if (localStorage.getItem(0)) {
        localStorage.removeItem(0)
    } 
};


const burger = document.querySelector('.burger');
const burger_btn = document.querySelector('.burger-btn');
const mobile_rightSection = document.querySelector('.mobile-header');

const mobile_katalog = document.querySelector('.burger .katalog');
const mobile_about = document.querySelector('.burger .about');
const mobile_delivery = document.querySelector('.burger .delivery');
const mobile_gallery = document.querySelector('.burger .gallery');
const mobile_callback = document.querySelector('.burger .callback');

const default_katalog = document.querySelector('.left-panel .katalog');
const default_about = document.querySelector('.left-panel .about');
const default_delivery = document.querySelector('.left-panel .delivery');
const default_gallery = document.querySelector('.left-panel .gallery');
const default_callback = document.querySelector('.left-panel .callback');

toggleClass(burger_btn, burger);
burger_btn.addEventListener('click', function (e) {
    if (!burger.classList.contains('active')) document.querySelector('.main').style.marginTop = '0rem';
    else document.querySelector('.main').style.marginTop = '43rem';
})
toggleClass(burger, mobile_rightSection);


mobile_katalog.addEventListener('click', function(e){
    document.querySelector('.main .katalog').scrollIntoView();
})

mobile_about.addEventListener('click', function(e){
    document.querySelector('.main .about').scrollIntoView();
})

mobile_delivery.addEventListener('click', function(e){
    document.querySelector('.main .pay-and-delivery').scrollIntoView();
})

mobile_gallery.addEventListener('click', function(e){
    document.querySelector('.main .gallery').scrollIntoView();
})

mobile_callback.addEventListener('click', function(e){
    document.querySelector('.main .callback').scrollIntoView();
})


default_katalog.addEventListener('click', function(e){
    document.querySelector('.main .katalog').scrollIntoView();
})

default_about.addEventListener('click', function(e){
    document.querySelector('.main .about').scrollIntoView();
})

default_delivery.addEventListener('click', function(e){
    document.querySelector('.main .pay-and-delivery').scrollIntoView();
})

default_gallery.addEventListener('click', function(e){
    document.querySelector('.main .gallery').scrollIntoView();
})

default_callback.addEventListener('click', function(e){
    document.querySelector('.main .callback').scrollIntoView();
})


// accordionJq-.questions-block
$('.accordion').accordion({
    heightStyle: 'content',
    animate: 700,
    active: true,
    collapsible: true,
    header: '> .accordion-item > .accordion-header'
});
const swiper = new Swiper('.swiper-container-1', {
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


/**
 * @function toggleClass Jquery realisation toggle class (add active)
 * @param {clickEl} Document Obj: Current click element 
 * @param {changeEL}  Document Obj: Current changable element
 */
function toggleClass(clickEL, changeEL) {
    let flag = false;
    clickEL.addEventListener('click', function (e) {
        if (!flag) {
            changeEL.classList.add("active");
            flag = true;
        }
        else {
            changeEL.classList.remove("active");
            flag = false;
        }
    })
}

//Old code
// const
//     catalog = document.querySelector('.catalog'),
//     contacts = document.querySelector('.contacts'),
//     gallery = document.querySelector('.gallery'),
//     payAndDelivery = document.querySelector('.payANDdelivery'),
//     productInfo = document.querySelector('.productInfo'),
//     set = document.querySelector('.set');

// catalog.addEventListener('click', e => {
//     e.preventDefault()
//     document.querySelector('.market-block').scrollIntoView();
// });

// contacts.addEventListener('click', e => {
//     e.preventDefault()
//     document.querySelector('.contacts-block').scrollIntoView();
// });

// gallery.addEventListener('click', e => {
//     e.preventDefault()
//     document.querySelector('.gallery-block').scrollIntoView();
// });

// payAndDelivery.addEventListener('click', e => {
//     e.preventDefault()
//     document.querySelector('.payANDdelivery-block').scrollIntoView();
// });

// productInfo.addEventListener('click', e => {
//     e.preventDefault()
//     document.querySelector('.productInfo-block').scrollIntoView();
// });

// // set.addEventListener('click', e =>{
// //   e.preventDefault()
// //   document.querySelector('.set-block').scrollIntoView();
// // });

// // Swiper-slider-.headPhoto-block
// const swiper = new Swiper('.headPhoto-block__swiper', {
//     slidesPerView: 1,
//     spaceBetween: 30,
//     speed: 400,
//     loop: true,
//     autoplay: {
//         delay: 3000
//     },
//     pagination: {
//         el: '.swiper-pagination',
//         clickable: true,
//     },
//     navigation: {
//         nextEl: '.swiper-button-next',
//         prevEl: '.swiper-button-prev',
//     },
// });
// // Swiper-slider-vertical-.gallery-block
// const swiperGallery = new Swiper('.gallery-block__swiper', {
//     effect: 'cube',
//     grabCursor: true,
//     direction: 'vertical',
//     loop: true,
//     mousewheel: true,
//     centeredSlides: true,
//     autoplay: {
//         delay: 5000,
//     },
//     spaceBetween: 30,
//     pagination: {
//         el: '.swiper-pagination',
//         clickable: true,
//     },
// });
// // accordionJq-.questions-block
// $('.accordion').accordion({
//     heightStyle: 'content',
//     animate: 700,
//     active: true,
//     collapsible: true,
//     header: '> .accordion-item > .accordion-header'
// });


// $('.market-block_pruducts__product__info-btn').click(function(e) {
//     window.location.href = `info.html?/number=${this.dataset.number}`;
// })

// $('.market-block_pruducts__productReverse__info-btn').click(function(e) {
//     window.location.href = `info.html?/number=${this.dataset.number}`;
// })