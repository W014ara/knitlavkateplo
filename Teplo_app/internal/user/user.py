from dataclasses import dataclass
from datetime import datetime


@dataclass
class User:
    id: int
    username: str
    password: str
    uuid: str
    created_at: datetime

    def to_json(self) -> dict:
        """Метод представления объекта в словарь

        :return: Словарь с полями объекта
        :rtype: dct
        """
        dct = {
            "id": self.id,
            "username": self.username,
            "password": self.password,
            "uuid": self.uuid,
            "created_at": str(self.created_at)
            }
        return dct
