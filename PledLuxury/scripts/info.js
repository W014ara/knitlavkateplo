window.onload = function () {
    if (localStorage.getItem(0)) {
        localStorage.removeItem(0)
    }
};
const burger = document.querySelector('.burger');
const burger_btn = document.querySelector('.burger-btn');
const mobile_rightSection = document.querySelector('.mobile-header');
const image = document.querySelector('.main_photo');
const currentProduct_id = document.location.search.toString().split('=')[1];
let sale_flag = true;

toggleClass(burger_btn, burger);
burger_btn.addEventListener('click', function (e) {
    if (!burger.classList.contains('active')) document.querySelector('.main').style.marginTop = '0rem';
    else document.querySelector('.main').style.marginTop = '17rem';
})
toggleClass(burger, mobile_rightSection);

//Zoom
image.addEventListener('mousemove', function (e) {
    if (this.classList.contains('sale')) {
        this.classList.remove('sale');
        sale_flag = false;
    }
    let width = image.offsetWidth;
    let height = image.offsetHeight;

    let mouseX = e.offsetX;
    let mouseY = e.offsetY;

    let bgPosX = (mouseX / width * 100);
    let bgPosY = (mouseY / height * 100);

    image.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
});

image.addEventListener('mouseleave', function () {
    image.style.backgroundPosition = "center";
    if (!sale_flag) this.classList.add('sale');
});



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
    return (price - ((sale / 100) * price));
}

/**
 * @function remove
 * @param {array} array: Obj.Array
 * @param {sale} index: number
 */
function remove(array, index) {
    return array.slice(0, index).concat(
        array.slice(index + 1));
}


/**
 * @function getRandomElements
 * @param {array} array: Obj.Array
 * @param {count} count: number
 */
function getRandomElements(array, count) {
    if (count > array.length || count < 0) return "Error";
    else if (count === 0) return array;
    else {
        let new_array = [];
        for (let index = 0; index < count; ++index) {
            let new_index = Math.floor(getRandomInt(array.length));
            console.log(new_index);
            if (array.length === 1) {
                new_index = 0;
                new_array.push(array[new_index]);
            } else {
                new_array.push(array[new_index]);
            }
            array = remove(array, new_index);
        }
        return new_array;
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
window.onload = (function () {
    if (currentProduct_id === undefined) console.log(1);
    else {
        $.ajax({
            type: 'GET',
            url: `https://knitlavkateplo.ru/api/v1/product/${currentProduct_id}`,
            async: false,
            success: function (data) {
                document.querySelector('.main_photo').style.backgroundImage = `url('https://knitlavkateplo.ru/${data.photo}')`;
                document.querySelector('.description .title h1').innerHTML = data.name;
                document.querySelector('.description .text').innerHTML = `
                                <h1>Описание товара</h1>
                                <p>
                                    ${data.product_description}
                                    <br><br> 
                                    <span>Цвет: </span> ${data.color}
                                    <br><br> 
                                    <span>Размер: </span> ${data.size}
                                </p>`;
                // <span>Бренд: </span> ${data.brand}
                // <br><br> 
                // <span>Состав: </span> ${data.composition}
                // <br><br> 
                // <span>Рекомендации по уходу: </span> ${data.recommendations}
                // <br><br>
                // <span>Страна производитель: </span> ${data.country}
                if (data.sale === 0) {
                    document.querySelector('.main_photo').classList.remove('sale');
                    document.querySelector('.description .price').childNodes[1].remove();
                    document.querySelector('.description .price .normal_price').innerHTML = `<div class="normal_price">
                    <h1>${data.price} руб.</h1>
                </div>`;
                } else {
                    document.querySelector('.description .price .sale h1').innerHTML = `${data.price} руб.`;
                    document.querySelector('.description .price .normal_price').innerHTML = `<div class="normal_price">
                    <h1>${changePriceFromSale(data.price, data.sale)} руб.</h1>
                </div>`;
                }
            }
        })
    }
    $.ajax({
        type: 'GET',
        url: `https://knitlavkateplo.ru/api/v1/product`,
        async: false,
        success: function (data) {
            let newArr = getRandomElements(data, 3);
            if (newArr !== "Error") {
                newArr = getRandomElements(data, 3).sort();
                document.querySelector('.more-products .products').innerHTML = "";
                for (let index = 0; index < newArr.length; ++index) {
                    if (newArr[index].sale === 0) {
                        const new_card = `<div class="product-${index + 1}">
                                            <img src="https://knitlavkateplo.ru/${newArr[index].photo}" alt="">
                                            <div class="title">
                                                <h2>${newArr[index].name}</h2>
                                            </div>
                                            <div class="price">
                                                <div class="normal-price">
                                                    <h2>${newArr[index].price} руб.</h1>
                                                </div>
                                            </div>
                                            <div class="more-btn" data-number=${newArr[index].id}>
                                                Подробнее
                                            </div>
                                        </div>`
                        document.querySelector('.more-products .products').insertAdjacentHTML('beforeend', new_card);
                    } else {
                        const new_card = `<div class="product-${index + 1} sale">
                                            <img src="https://knitlavkateplo.ru/${newArr[index].photo}" alt="">
                                            <div class="title">
                                                <h2>${newArr[index].name}</h2>
                                            </div>
                                            <div class="price">
                                                <div class="sale-price">
                                                    <h2>${newArr[index].price} руб.</h1>
                                                </div>
                                                <div class="normal-price">
                                                    <h2>${changePriceFromSale(newArr[index].price, newArr[index].sale)} руб.</h1>
                                                </div>
                                            </div>
                                            <div class="more-btn" data-number=${newArr[index].id}>
                                                Подробнее
                                            </div>
                                        </div>`
                        document.querySelector('.more-products .products').insertAdjacentHTML('beforeend', new_card);
                    }
                }
            }
        }
    })
    for (elem of document.querySelectorAll('.more-btn')) {
        elem.addEventListener('click', function (e) {
            window.location.href = `info.html?number=${this.dataset.number}`;
        })
    };
})()

document.querySelector('.back-btn').addEventListener('click', function (e) {
    window.location.href = 'index.html';
})