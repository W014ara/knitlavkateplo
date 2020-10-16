import uuid
import pytz

from dataclasses import dataclass
from datetime import datetime

from Teplo_app.internal.postgres import database
from Teplo_app.internal.user import user

select_users_fields = "id, username, password, uuid, created_at"
timezone = pytz.timezone('Europe/Moscow')


@dataclass
class Storage:
    """Реализация класса Storage

    :return: Класс хранилища
    :rtype: Storage
    """
    # Объект базы данных
    db: database.DB

    select_query_all_users = "SELECT " + select_users_fields + \
                             " FROM users ORDER BY id"

    select_query_all_users_by_username = "SELECT " + select_users_fields + \
                                         " FROM users WHERE username=%s " + \
                                         "ORDER BY id"

    update_query_uuid = "UPDATE users set uuid=%s, created_at=%s " + \
                        "WHERE id=%s RETURNING uuid"

    select_query_by_uuid = "SELECT " + select_users_fields + \
                           " FROM users WHERE uuid=%s "

    def find_user(self, username: str) -> user.User:
        """Поиск продукта по id

        :param username: Логин пользователя
        :type username: str
        :param password: Пароль пользователя
        :type username: str
        :return: Объект User по результату запроса
        :rtype: user.User
        """
        cur = self.db.session.cursor()
        cur.execute(self.select_query_all_users_by_username, (username,))
        row = cur.fetchone()
        if row is not None:
            return scan(row)
        else:
            return None

    def get_token(self, id: int) -> bool:
        """Обновление uuid пользователя по его ID
        :param id: ID пользователя
        :type id: int
        :return: Статус обновления запроса
        :rtype: bool
        """
        cur = self.db.session.cursor()
        try:
            cur.execute(self.update_query_uuid, (
                    str(uuid.uuid4()),
                    datetime.now(timezone), id))

            self.db.session.commit()
            data = cur.fetchone()
            if data != []:
                return data[0]
            else:
                return None

        except Exception:
            return None

    def get_uuid(self, query_uuid: str) -> bool:
        """Метод проверки uuid

        :param uuid: Токен из заголовка запроса
        :type uuid: str
        :return: Пользователь с данным uuid
        :rtype: bool
        """
        cur = self.db.session.cursor()
        cur.execute(self.select_query_by_uuid, (query_uuid, ))
        row = cur.fetchone()
        if row is not None:
            return scan(row)
        else:
            return None


def scan(data: tuple) -> user.User:
    """Функция преобразования SQL ответа в объект User

    :param data: SQL ответ в виде кортежа
    :type data: tuple
    :return: Объект продукта
    :rtype: user.User
    """
    return user.User(
        id=data[0],
        username=data[1],
        password=data[2],
        uuid=data[3],
        created_at=data[4]
    )


def scan_users(data):
    """Функция преобразования SQL ответа в список объектов Product

    :param data: SQL ответ в виде списка кортежей
    :type data: List[tuple]
    :return: Список объектов продуктов
    :rtype: List[product.Product]
    """
    users = []

    for row in data:
        user = scan(row)
        users.append(user)

    return users
