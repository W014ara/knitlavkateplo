from dataclasses import dataclass
from typing import List

from Teplo_app.internal.postgres import database
from Teplo_app.internal.product import product

insert_product_fields = "name, product_description, size, " + \
                             "composition, color, recommendations, " + \
                             "brand, country, price, in_stock, sale, photo"

select_all_product_fields = "id, " + insert_product_fields


@dataclass
class Storage:
    """Реализация класса Storage

    :return: Класс хранилища
    :rtype: Storage
    """
    # Объект базы данных
    db: database.DB

    select_query_all_products = "SELECT " + select_all_product_fields + \
                                " FROM products ORDER BY id"

    select_query_product_by_id = "SELECT " + select_all_product_fields + \
                                 " FROM products WHERE id = %s"

    insert_query_product = "INSERT INTO products (" + \
                           insert_product_fields + ") VALUES " + \
                           "(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"

    update_query_sale = "UPDATE products SET sale=%s " + \
                        "WHERE id=%s RETURNING id"

    delete_query_product = "DELETE FROM products WHERE id = %s RETURNING id"

    def find_by_id(self, id: int) -> product:
        """Поиск продукта по id

        :param id: ID товара в базе данных
        :type id: int
        :return: Объект Product по результату запроса
        :rtype: product.Product
        """
        cur = self.db.session.cursor()
        cur.execute(self.select_query_product_by_id, (id,))
        row = cur.fetchone()
        if row is not None:
            return scan(row)
        else:
            return None

    def find_all(self) -> List[product.Product]:
        """Вывод всех товаров из базы данных

        :return: Список продуктов Product из базы данных
        :rtype: List[product.Product]
        """
        cur = self.db.session.cursor()
        cur.execute(self.select_query_all_products)
        data = cur.fetchall()
        products = scan_products(data)
        return products

    def insert(self, product: product.Product) -> bool:
        """Метод вставки товара в базу данных

        :param product: Вставляемый объект
        :type product: product.Product
        :return: Статус операции вставки
        :rtype: bool
        """
        cur = self.db.session.cursor()
        try:
            cur.execute(self.insert_query_product, (
                product.name,
                product.product_description,
                product.size,
                product.composition,
                product.color,
                product.recommendations,
                product.brand,
                product.country,
                product.price,
                product.in_stock,
                product.sale,
                product.photo
            ))
            self.db.session.commit()
            return True
        except Exception:
            self.db.session.rollback()
            return False

    def delete(self, id: int) -> bool:
        """Метод удаления товара из базы данных

        :param id: ID удаляемого товара
        :type id: int
        :return: Статус операции удаления
        :rtype: bool
        """
        cur = self.db.session.cursor()
        cur.execute(self.delete_query_product, (id, ))
        data = cur.fetchone()
        if data == []:
            return False
        else:
            self.db.session.commit()
            return True

    def update(self, product: product.Product, id: int) -> bool:
        """Метод обновления информации о товаре в базе данных

        :param product: Объект с новыми данными
        :type product: product.Product
        :param id: ID товара
        :type id: int
        :return: Статус операции обновления
        :rtype: bool
        """
        try:
            cur = self.db.session.cursor()
            cur.execute(self.update_query_sale, (
                product.sale, id))
            data = cur.fetchone()
            if data is None:
                return False
            else:
                self.db.session.commit()
                return True
        except Exception:
            self.db.session.rollback()
            return False


def scan(data: tuple) -> product.Product:
    """Функция преобразования SQL ответа в объект Product

    :param data: SQL ответ в виде кортежа
    :type data: tuple
    :return: Объект продукта
    :rtype: product.Product
    """
    return product.Product(
        id=data[0],
        name=data[1],
        product_description=data[2],
        size=data[3],
        composition=data[4],
        color=data[5],
        recommendations=data[6],
        brand=data[7],
        country=data[8],
        price=data[9],
        in_stock=bool(data[10]),
        sale=data[11],
        photo=data[12]
    )


def scan_products(data: List[tuple]) -> List[product.Product]:
    """Функция преобразования SQL ответа в список объектов Product

    :param data: SQL ответ в виде списка кортежей
    :type data: List[tuple]
    :return: Список объектов продуктов
    :rtype: List[product.Product]
    """
    products = []

    for row in data:
        pr = scan(row)
        products.append(pr)

    return products
