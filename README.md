# Сайт по продаже вязанной продукции

## Структура репозитория

```
../Teplo
├── PledLuxury                      # Директория с фронтендом   
├── Teplo_app/                      # Пакет с внутренней реализацией сайта
│   ├── handlers/                   # Директория реализации API
│   │   └── api.py
│   ├── internal/                   # Директория реализаций внутренних структур
│   │   ├── additions/              # Директория реализаций вспомогательных функций
│   │   │   └── additions.py
│   │   ├── postgres/               # Директория реализаций методов работы с базой данных
│   │   │   ├── database.py
│   │   │   ├── product_storage.py
│   │   │   └── user_storage.py
│   │   ├── product/
│   │   │   └── product.py
│   │   └── user/
│   │       └── user.py
├── app.py                          # Точка входа программы
├── requirements.txt                # Файл с зависимостями
```

## Перед запуском

### 1. Создаем виртуальное окружение:
```
python -m venv venv
```

### 2. Активируем окружение:

Linux:
```
$ source venv/bin/activate
``` 

Windows:
```
> venv\Scripts\activate.bat
``` 

### 3. Устанавливаем зависимости:
```
$ pip install -r requirements.txt
``` 

### 4. Добавляем временные переменные среды, инициализируем базу данных и запускаем проект. При первом запуске будет создана папка instance, в которой будет находится база данных приложения:

Linux:
```
$ export FLASK_APP=Teplo_app
$ export FLASK_ENV=development
$ flask init-db
$ flask run
```

Windows:
```
> set FLASK_APP="Teplo_app"
> set FLASK_ENV=development
> flask init-db
> flask run
```

### В случае успешного запуска в консоли выведится сообщение о успешном запуске сервера:
```
* Serving Flask app "Teplo_app" (lazy loading)
* Environment: development
* Debug mode: on
* Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
* Restarting with stat
* Debugger is active!
* Debugger PIN: 273-856-993
```