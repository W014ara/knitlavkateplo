window.onload = function () {
    checkLocalStorage();
}

const logInBut = document.querySelector('.logInBut');

logInBut.addEventListener('click', e => {
    e.preventDefault();
    const dataLogIn = {
        "username": login.value,
        "password": password.value,
    }
    $.ajax({
        type: "POST",
        data: JSON.stringify(dataLogIn),
        // url
        url: "https://knitlavkateplo.ru/api/v1/user",
        success: function (data) {
            if (localStorage.length === 0) {
                localStorage.setItem(0, data.token);
                // Редирект при авторизации
                setTimeout(() => {
                    // Редирект
                    window.location.href = "https://knitlavkateplo.ru/admin.html";
                }, 0)
                login.value = '';
                password.value = '';
                login.style.border = '';
                password.style.border = '';
            } else if (localStorage.length >= 1) {
                login.value = '';
                password.value = '';
            }
        },
        statusCode : {
            401: () => {
                login.style.border = '1.5px solid red';
                password.style.border = '1.5px solid red';
            },
            502: () => {
                alert("Ошибка сервера");
            },  
        }, 
    });
})
/* Функция проверяющая на наличие токена:
    Если токен есть, редирект
*/
function checkLocalStorage () {
    if (localStorage.getItem(0)) {
        setTimeout(() => {
            // Редирект
            window.location.href = "https://knitlavkateplo.ru/admin.html";
        }, 5)
    }
}
