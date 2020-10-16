from flask import Flask
from flask_cors import CORS
from flask_restful import Api

from Teplo_app.pkg.log import logger

from Teplo_app.handlers.api import (ProductListResource, ProductResource,
                                    UserResource)
from Teplo_app.internal.postgres import database, product_storage, user_storage


def configDB():
    cfgDB = database.Config(
        database='teplo',
        user='teplo',
        password='dxuwZsR5QKgDApY',
        host='localhost',
        port='5432'
    )

    return cfgDB


app = Flask(__name__,
            instance_relative_config=True)

app.config.from_mapping(
    SECRET_KEY="yFrwu8QQA5dRS2ssoo3MDI!aInvDhz")

CORS(app)
api = Api(app)

file_logger = logger.new_logger("file_log")

# Инициализация базы данных
cfgDB = configDB()
db = database.new(cfgDB)
pr_storage = product_storage.Storage(db)
user_storage = user_storage.Storage(db)

# Добавление путей основных методов
api.add_resource(ProductResource, "/api/v1/product/<int:id>",
                 resource_class_args=(file_logger, pr_storage, user_storage))
api.add_resource(ProductListResource, "/api/v1/product",
                 resource_class_args=(file_logger, pr_storage, user_storage))
api.add_resource(UserResource, "/api/v1/user",
                 resource_class_args=(file_logger, user_storage, ))

if __name__ == "__main__":
    app.run(debug=True)
