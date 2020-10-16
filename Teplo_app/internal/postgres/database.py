from dataclasses import dataclass

import psycopg2

# SQL файл с запросами на создание базы данных
schema_file = 'schema.sql'


@dataclass
class Config:
    """Класс конфигурации подключения к базе данных"""

    database: str
    user: str
    password: str
    host: str
    port: str


@dataclass
class DB:
    """Класс базы данных"""

    session: int

    def close(self):
        self.session.close()


def new(cfg: Config) -> DB:
    """Функция создания подключения к базе данных

    :return: объект базы данных
    :rtype: DB
    """
    db = psycopg2.connect(
        database=cfg.database,
        user=cfg.user,
        password=cfg.password,
        host=cfg.host,
        port=cfg.port
    )

    return DB(session=db)
