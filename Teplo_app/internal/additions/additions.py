import os
from datetime import datetime, timedelta

import pytz
from PIL import Image

from flask_restful import request, wraps
from werkzeug.datastructures import FileStorage


timezone = pytz.timezone('Europe/Moscow')


def auth_required(fn):
    """Метод декоратор для проверки авторизации пользователя
    :return: Продолжение / прерывание обращения к API
    """
    @wraps(fn)
    def wrapper(self, **kwargs):
        if request.headers.get('Authorization') is None:
            return {"error": "no auth"}, 401

        request_token = request.headers.get('Authorization').split(' ')[-1]

        db_token = self.user_storage.get_uuid(request_token)
        if db_token is None:
            return {"error": "no auth"}, 401

        if db_token.created_at + timedelta(hours=12) > datetime.now(timezone):
            return fn(self, **kwargs)
        else:
            return {"error": "no auth"}, 401

    return wrapper


def save_image(file_path: str, input_file: FileStorage):
    """Метод сохранения картинки в формате png
    :param file_path: Путь сохранения
    :type file_path: string
    :param input_file: Входящий файл из запроса с формы
    :type input_file: werkzeug.FileStorage
    """
    photo_path = os.path.join(file_path + input_file.filename)
    in_file = input_file.filename.split(".")

    if in_file[-1] == "png":
        input_file.save(os.path.join(file_path, input_file.filename))

    else:
        new_file_path = file_path + in_file[0] + ".png"
        input_file.save(os.path.join(file_path, input_file.filename))
        img = Image.open(photo_path).convert("RGB")
        img.save(new_file_path, "png")
        os.remove(os.path.join(file_path, input_file.filename))
