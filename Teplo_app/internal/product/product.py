from dataclasses import dataclass


@dataclass
class Product:
    """Класс товара"""
    id: int
    name: str
    product_description: str
    size: str
    composition: str
    color: str
    recommendations: str
    brand: str
    country: str
    price: float
    in_stock: bool
    sale: int
    photo: str

    def to_json(self) -> dict:
        """Метод представления объекта в словарь

        :return: Словарь с полями объекта
        :rtype: dct
        """

        dct = {
            "id": self.id,
            "name": self.name,
            "product_description": self.product_description,
            "size": self.size,
            "composition": self.composition,
            "color": self.color,
            "recommendations": self.recommendations,
            "brand": self.brand,
            "country": self.country,
            "price": self.price,
            "in_stock": self.in_stock,
            "sale": self.sale,
            "photo": self.photo,
            }
        return dct
