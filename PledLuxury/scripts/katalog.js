window.onload = function () {
    if (localStorage.getItem(0)) {
        localStorage.removeItem(0)
    } 
};

const burger = document.querySelector('.burger');
const burger_btn = document.querySelector('.burger-btn');
const mobile_rightSection = document.querySelector('.mobile-header');
const product_div = document.querySelector('.katalog_products');

toggleClass(burger_btn, burger);
burger_btn.addEventListener('click', function (e) {
    if (!burger.classList.contains('active')) document.querySelector('.main').style.marginTop = '0rem';
    else document.querySelector('.main').style.marginTop = '17rem';
})
toggleClass(burger, mobile_rightSection);


//Toggle elem for click event
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

/**
 * @function changePriceFromSale
 * @param {price} price:Number
 * @param {sale} sale:Number
 */
function changePriceFromSale(price, sale) {
    return Math.round((price - ((sale / 100) * price)));
}


window.onload = function() {
    renderAllCards();
    for(elem of document.querySelectorAll('.more-btn')){
        elem.addEventListener('click', function(e){
            window.location.href = `info.html?number=${this.dataset.number}`;
        })
    };
    document.querySelector('.back-btn').addEventListener('click', function (e){
        window.location.href = 'index.html';
    })
};

function renderAllCards() {
    $.ajax({
        type: 'GET',
        url: 'https://knitlavkateplo.ru/api/v1/product',
        async: false,
        success: function(data) {
            // console.log(data);
            product_div.innerHTML = "";
            for (let number = data.length - 1; number >= 0; --number) {
                if (data[number].sale === 0) {
                    const card = `
                    <div class='product'>
                        <img src="https://knitlavkateplo.ru/${data[number].photo}" alt="">
                        <div class="title">
                            <h2>${data[number].name}</h2>
                        </div>
                        <div class="price">
                            <!-- <div class="sale-price">
                                <h2>5000 руб.</h1>
                            </div> -->
                            <div class="normal-price">
                                <h2>${data[number].price} руб.</h1>
                            </div>
                        </div>
                        <div class="more-btn" data-number=${data[number].id}>
                            Подробнее
                        </div>
                    </div>
                `;
                product_div.insertAdjacentHTML('afterbegin', card);
                } else {
                    const card = `
                        <div class="product sale">
                            <img src="https://knitlavkateplo.ru/${data[number].photo}" alt="">
                            <div class="title">
                                <h2>${data[number].name}</h2>
                            </div>
                            <div class="price">
                                <div class="sale-price">
                                    <h2>${data[number].price} руб.</h1>
                                </div>
                                <div class="normal-price">
                                 <h2>${changePriceFromSale(data[number].price, data[number].sale)} руб.</h1>
                                </div>
                            </div>
                            <div class="more-btn" data-number=${data[number].id}>
                                Подробнее
                            </div>
                        </div>`;
                    product_div.insertAdjacentHTML('afterbegin', card);
                }
            }
        }
    })
}