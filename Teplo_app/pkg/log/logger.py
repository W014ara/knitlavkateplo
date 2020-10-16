import logging

from Teplo_app.pkg.log.abc_logger import Logger


class STDLogger(Logger):
    """Класс стандартного логгера.
    :param Logger: абстракный класс от которого будут наследоваться все логгеры
    :type Logger: абстрактный класс
    """
    def __init__(self, logger: Logger):
        self.logger = logger

    def info(self, msg: str):
        self.logger.info(msg)

    def warning(self, msg: str):
        self.logger.warning(msg)

    def error(self, msg: str):
        self.logger.error(msg)

    def critical(self, msg: str):
        self.logger.error(msg)


def new_logger(logger_name: str) -> STDLogger:
    """Возвращает стандартный логгер.
    :param logger_name: имя логгера.
    :type logger_name: string
    :return: логгер
    :rtype: logging.Logger
    """
    std_logger = logging.getLogger(logger_name)
    std_logger.setLevel(logging.DEBUG)
    st = logging.FileHandler('info.log', encoding='UTF-8')
    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
    st.setFormatter(formatter)
    std_logger.addHandler(st)

    logger = STDLogger(std_logger)

    return logger
