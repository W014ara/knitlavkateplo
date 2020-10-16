import os

from flask import request
from flask_restful import Resource

from Teplo_app.pkg.log import logger
from Teplo_app.internal.additions.additions import (auth_required,
                                                    save_image)
from Teplo_app.internal.postgres import product_storage, user_storage
from Teplo_app.internal.product import product
from Teplo_app.internal.user import user

WORK_DIR = os.path.abspath("/var/www/teplo.ru/")
BASE_IMG_DIR = "db_img/"
photo_dir = os.path.join(WORK_DIR, BASE_IMG_DIR)


class ProductResource(Resource):
    """Класс-ресурс для Flask-restful"""

    def __init__(self,
                 file_logger: logger.Logger,
                 product_storage: product_storage.Storage,
                 user_storage: user_storage.Storage):

        self.file_logger = file_logger
        self.product_storage = product_storage
        self.user_storage = user_storage

    def get(self, id):
        """GET запрос об информации о продукте по product/<int: id>

        :param id: ID товара в URL
        :type id: int
        :return: JSON с информацией о товаре и статус кодом
        :rtype: JSON
        """
        product_ = self.product_storage.find_by_id(id)
        if product_ is not None:
            return product_.to_json(), 200
        else:
            return {"error": "not found"}, 404

    @auth_required
    def delete(self, id: int):
        """DELETE запрос на удаление продукта по ID в product/<int: id>

        :param id: ID товара в URL
        :type id: int
        :return: JSON ответ со статус кодом
        :rtype: JSON
        """
        if self.product_storage.find_by_id(id) is None:
            return {"error": "not found"}, 404

        photo_name = self.product_storage.find_by_id(id).photo
        photo_path = os.path.join(WORK_DIR, photo_name)

        if self.product_storage.delete(id):
            try:
                os.remove(photo_path)
                self.file_logger.info(f"Удалён продукт под ID: {id}")
                return {"message": "success"}, 200
            except Exception:
                self.file_logger.warning(f"Фото {photo_name} не удалено. \
                                     Возможно уже было удалено на сервере")
                return {"error": "file not found"}, 400
        else:
            return {"error": "file not found"}, 400

    @auth_required
    def put(self, id: int):
        """PUT запрос на обновление информации продукта по ID в prodcut/<int: id>

        :param id: ID товара
        :type id: int
        :return: JSON ответ со статус кодом
        :rtype: JSON
        """
        data = request.get_json(force=True)
        product = transpose_product(data)

        if product is None:
            return {"error": "invalid input, object invalid"}, 400

        if self.product_storage.update(product, id):
            self.file_logger.info(f"Товар id: {id} обновлён")
            return {"message": "success"}, 200

        else:
            return {"error": "not found"}, 404


class ProductListResource(Resource):
    """Класс-ресурс для Flask-restful"""

    def __init__(self,
                 file_logger: logger.Logger,
                 product_storage: product_storage.Storage,
                 user_storage: user_storage.Storage):

        self.file_logger = file_logger
        self.product_storage = product_storage
        self.user_storage = user_storage

    def get(self):
        """GET запрос на вывод всех товаров по api/v1/product

        :return: JSON ответ со статус кодом
        :rtype: JSON
        """
        products_ = self.product_storage.find_all()
        product_list = []
        for pr in products_:
            product_list.append(pr.to_json())

        if product_list != []:
            return product_list, 200
        else:
            return {"error": "not found"}, 404

    @auth_required
    def post(self):
        """POST запрос на вставку нового товара по api/v1/product

        :return: JSON ответ со статус кодом
        :rtype: JSON
        """
        data = dict(request.form)
        photo = request.files.get('photo')

        if (photo is None) or (data.get('price') == 'NaN'):
            return {"error": "invalid input, object invalid"}, 400

        if os.path.exists(photo_dir + photo.filename.split(".")[0] + ".png"):
            return {"error": "file already exists"}, 400

        data['photo'] = BASE_IMG_DIR + photo.filename.split(".")[0] + ".png"
        product = transpose_product(data)

        if product is None:
            return {"error": "invalid input, object invalid"}, 400

        if self.product_storage.insert(product):
            try:
                save_image(photo_dir, photo)
                self.file_logger.info(f"Добавлено и cконвертировано фото: {photo.filename} " + # noqa
                                      f"по пути: {photo_dir}")
                return {"message": "success"}, 201
            except Exception:
                os.remove(photo_dir + photo.filename)
                self.file_logger.info("Полученное фото не удалось сохранить")
                return {"error": "wrong photo type"}, 400
        else:
            return {"error": "can't insert data in database. " +
                    "Check your params values"}, 400


class UserResource(Resource):
    """Класс-ресурс для Flask-restful"""

    def __init__(self,
                 file_logger: logger.Logger,
                 user_storage: user_storage.Storage):

        self.file_logger = file_logger
        self.user_storage = user_storage

    def get(self):
        """Метод вывода всех пользователей (На продакшене удалить

        :return: JSON ответ список пользователей в баззе
        :rtype: JSON
        """
        users_ = self.user_storage.get_users()
        user_list = []

        for item in users_:
            user_list.append(item.to_json())

        if user_list != []:
            return user_list, 200
        else:
            return {"error": "not found"}, 404

    def post(self):
        """POST авторизация и выдача токена пользователю

        :return: JSON ответ с токеном
        :rtype: JSON
        """
        data = request.get_json(force=True)

        user_json = transpose_user(data)

        if user_json is None:
            return {"error": "invalid input, object invalid"}, 400

        user_json.password = user_json.password
        user_result = self.user_storage.find_user(user_json.username)

        if user_result is None or user_result.password != user_json.password: # noqa 
            return {"error": "wrong user data"}, 401

        self.file_logger.info(f"Пользователь под id: {user_result.id} "
                              "зашёл в админскую панель")
        return {"token": self.user_storage.get_token(user_result.id)}, 200


def transpose_product(data: dict) -> product.Product:
    """Метод преобразования JSON, полученного в POST запросе в объект Product

    :param data: JSON, отправленный вместе с POST запросом
    :type data: JSON
    :return: Объект Product
    :rtype: product.Product или None
    """
    try:
        return product.Product(
            id=0,
            name=data["name"],
            product_description=data.get("product_description", ""),
            size=data["size"],
            composition=data.get("composition", ""),
            color=data["color"],
            recommendations=data.get("recommendations", ""),
            brand=data.get("brand", ""),
            country=data.get("country", ""),
            price=data["price"],
            in_stock=data.get("in_stock", True),
            sale=data.get("sale", 0),
            photo=data["photo"],
        )
    except KeyError:
        return None


def transpose_user(data: dict) -> user.User:
    """Метод преобразования JSON, полученного в POST запросе в объект User

    :param data: JSON, отправленный вместе с POST запросом
    :type data: JSON
    :return: Объект User
    :rtype: user.User или None
    """
    try:
        return user.User(
            id=0,
            username=data["username"],
            password=data["password"],
            uuid='',
            created_at='',
        )
    except KeyError:
        return None
