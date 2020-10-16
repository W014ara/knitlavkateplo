window.onload = function () {
    renderTableInfoProduct();
    checkStorage(); 
};
// admin.html
const allCatalog = document.querySelector('.all-catalog'),
    addProduct = document.querySelector('.add-product'),
    catalogMain = document.querySelector('.main-data__catalog'),
    addProductMain = document.querySelector('.main-data__add-product'),
    // кнопка в форме class="getProduct"
    sendProduct = document.querySelector('.sendProduct'),
    tableBody = document.querySelector('.tableBody'),
    tableAllData = document.querySelector('.main-data__catalog__table'),
    saveData = document.querySelector('.main-data__catalog__button__saveData'),
    buttonDeleteProduct = document.querySelector('.buttonDeleteProduct');

const getProduct = document.getElementById('getProduct');
// Првоерка инпута на числа до 100
const regexSale = /^(\d|\d\d)$/;
/*  Отображение блоков по нажатию на toggleSideBard
    e - событие 
    rem - какой классу далить 
    add - какой класс добавить
*/
const addClassNone = (event, rem, add, styleNone = 'none', styleBlock) => {
    event.preventDefault();
    rem.style.display = styleBlock;
    add.style.display = styleNone;
};
// Events
allCatalog.addEventListener('click', e => {
    addClassNone(e, catalogMain, addProductMain, 'none', 'block');
    sidebar.style.minHeight = `${document.querySelector('.main-content').clientHeight}px`
});
addProduct.addEventListener('click', e => {
    addClassNone(e, addProductMain, catalogMain, 'none', 'flex');
    sidebar.style.minHeight = `${document.querySelector('.main-content').clientHeight}px`
});
document.getElementById('sidebar-toggle').addEventListener('click', () => {
    sidebar.style.minHeight = `${document.querySelector('.main-content').clientHeight}px`;
});
// "Добавление товара"
sendProduct.addEventListener('click', e => {
    e.preventDefault();
	// console.log($('#photo').files);
	let form = new FormData();
	// console.log($('#photo').prop('files')[0]);
	form.append("name", String(document.getElementById('name').value));
	form.append("size", String(size.value));
	form.append("color", String(color.value));
    form.append("price", Number(price.value));
    form.append("product_description", String(document.getElementById('description').value));
	form.append("photo", $('#photo').prop('files')[0]);
    $.ajax({
        // beforeSend: 
        type: "POST",
        data: form,
        processData: false,
	    contentType: false,
	    mimeType: "multipart/form-data",
	    url: "https://knitlavkateplo.ru/api/v1/product",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem(0)}`,
        },
        success: function (data) {
            alert("Товар добавлен");
        },
        statusCode: {
            400: () => {
                alert(`Форма "добавление товара" некоректна, проверьте поля! 
                    Цена: вводиться только цифрами, 
                    фото: обязательно должно быть заполнены, фото не должны повторяться 
                    все остальные поля принимают любые символы`);
            },
            404: () => {
                alert("Товаров нету в базе");
            },
            500: () => {
                alert("Ошибка сервера");
            },
            502: () => {
                alert("Ошибка сервера");
            },
        },
    });
    document.getElementById('name').value = '';
    document.getElementById('size').value = '';
    document.getElementById('color').value = '';
    document.getElementById('price').value = '';
    document.getElementById('description').value = '';
    document.getElementById('photo').value = '';
    $("#photoTextFile").html(`<b></b>`);
});
// Обновление товара
saveData.addEventListener('click', e => {
    const idProduct = {
        id: [],
        saleValue: [],
    }
    $.ajax({
        type: 'GET',
        // url
        url: 'https://knitlavkateplo.ru/api/v1/product',
        async: false,
        success: (data) => {
            for (let i = 0; i < data.length; i++) {
                idProduct.id.push(Number(data[i].id));
                idProduct.saleValue.push(Number(data[i].sale));
            }
        },
    })
    for (let iter = 0; iter < idProduct.id.length; iter++) {
        if (idProduct.saleValue[iter] === Number(document.getElementById(`inputSale${idProduct.id[iter]}`).value)) {

        } else if (!(idProduct.saleValue[iter] === Number(document.getElementById(`inputSale${idProduct.id[iter]}`).value)) && regexSale.exec(Number(document.getElementById(`inputSale${idProduct.id[iter]}`).value))) {
            $.ajax({
                type: "PUT",
                data: JSON.stringify({
                    name: "",
                    size: "",
                    color: "",
                    price: 0,
                    sale: Number(document.getElementById(`inputSale${idProduct.id[iter]}`).value),
                    photo: "",
                }),
                // url
                url: `https://knitlavkateplo.ru/api/v1/product/${idProduct.id[iter]}`,
                async: false,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(0)}`,
                },
                success: function (data) {
                    document.getElementById(`inputSale${idProduct.id[iter]}`).style.color = 'black'
                    alert("Товар обновлен");
                },
                statusCode: {
                    400: () => {
                        alert("Такая фотография товара уже присутствует");
                    },
                    404: () => {
                        alert("Товаров нету в базе")
                    },
                    502: () => {
                        alert("Ошибка сервера");
                    },
                },
            })
        } else {
            document.getElementById(`inputSale${idProduct.id[iter]}`).style.color = 'red';
        }
    }
});
// Удаление товара
buttonDeleteProduct.addEventListener('click', e => {
    $.ajax({
        type: "DELETE",
        // url
        url: `https://knitlavkateplo.ru/api/v1/product/${document.getElementById('deleteProductFormAdmin').value}`,
        async: false,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem(0)}`,
        },
        statusCode: {
            200: () => {
                alert("Товар удален");
            },
            404: () => {
                alert("Номер товара не найден");
            },
            502: () => {
                alert("Ошибка сервера");
            },
        },
    })
    document.getElementById('deleteProductFormAdmin').value = '';
});
// Вставка названия пути и фото
photo.addEventListener('change', e => {
    // img = photo.value
    // console.log()
    $("#photoTextFile").html(`<b>${(photo.value.split('\\')).pop()}</b>`);
});

/* Функция которая обрабатывает получаемый путь 
    pathImg - путь получаемый с бд
    возвращает название картинки
*/
function dataBaseImgPath(pathImg) {
    return pathImg.split('/').pop();
}
/*  Функция которая проверяет на наличие localSotrage:
    timeRedirect - с какой задержкой происходит редирект
    timeDelete - с какой задержкой происходит удаление localStorage
*/
function checkStorage() {
    if (localStorage.getItem(0) === null) {
        setTimeout(() => {
            alert("Вы не авторизованы");
            // Редирект
            window.location.href = "https://knitlavkateplo.ru/signIn.html";
        }, 1000)
    }
}
// // "Список товаров"
function renderTableInfoProduct() {
    $.ajax({
        type: 'GET',
        // url
        url: 'https://knitlavkateplo.ru/api/v1/product',
        async: false,
        success: function (data) {
            // Преобразование true\false
            const truFal = (str) => {
                if (str === true) return str = 'Есть';
                else if (str === false) return str = 'Нет';
            }
            // <td>${truFal(data[number].in_stock)}</td>
            for (let number = 0; number < data.length; ++number) {
                const table = `
                    <tr>
                        <td>${number+1}</td>
                        <td>${data[number].id}</td>
                        <td>${data[number].name}</td>
                        <td>${data[number].price}</td>
                        <td>${data[number].size}</td>
                        <td>${data[number].color}</td>
                        <td class="tdDescription">${data[number].product_description}</td>
                        <td>
                            <input class="tableBodyInput" type="text" value="${data[number].sale}" id="inputSale${data[number].id}">
                        </td>
                        <td class="url">${dataBaseImgPath(data[number].photo)}</td>

                    </tr>
                `;
                tableBody.insertAdjacentHTML('beforeBegin', table);
            }
        },
        statusCode: {
            404: () => {
                alert("Товаров нет в базе")
            },
            502: () => {
                alert("Ошибка сервера");
            },
        }
    });
    // <td>
    //     <label>
    //         <input type='checkbox' id="inputCheck${data[number].id}">
    //         <span></span>
    //     </label>
    // </td>
    // <td>${number}</td>
    // <td>${data[number].name}</td>
    // <td>${data[number].price}</td>
    // <td>${data[number].size}</td>
    // <td>${data[number].composition}</td>
    // <td>${data[number].color}</td>
    // <td>${data[number].recommendations}</td>
    // <td>${data[number].brand}</td>
    // <td>${data[number].country}</td>
    // <td>${truFal(data[number].in_stock)}</td>
    // <td>${data[number].sale}</td>
    // <td class="url">${data[number].photo}</td>
    
        // } else {
    //     // Удаление localStorage через 2 часа использования
    //     setInterval(() => {
    //         alert("Требуется подтвердить авторизацию !")
    //         localStorage.removeItem(0);
    //         // Редирект
    //         window.location.href = "https://knitlavkateplo.ru/signIn.html";
    //     }, timeDelete);
    // }
}

// toggleSidebar
$(document).ready(function () {
    $("[data-toggle]").click(function () {
        var toggle_el = $(this).data("toggle");
        $(toggle_el).toggleClass("open-sidebar");
    });
});
$(".swipe-area").swipe({
    swipeStatus: function (event, phase, direction, distance, duration, fingers) {
        if (phase == "move" && direction == "right") {
            $(".container").addClass("open-sidebar");
            return false;
        }
        if (phase == "move" && direction == "left") {
            $(".container").removeClass("open-sidebar");
            return false;
        }
    }
});