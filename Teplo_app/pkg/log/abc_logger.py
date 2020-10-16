from abc import ABC, abstractmethod


class Logger(ABC):
    @abstractmethod
    def info(self, msg: str) -> str:
        pass

    @abstractmethod
    def warning(self, msg: str) -> str:
        pass

    @abstractmethod
    def error(self, msg: str) -> str:
        pass

    @abstractmethod
    def critical(self, msg: str) -> str:
        pass
