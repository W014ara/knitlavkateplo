CREATE TABLE products(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'Название товара',
    product_description TEXT DEFAULT '',
    size TEXT DEFAULT '',
    composition TEXT DEFAULT '',
    color TEXT NOT NULL DEFAULT '',
    recommendations TEXT DEFAULT '',
    brand TEXT DEFAULT '',
    country TEXT DEFAULT '',
    price DOUBLE PRECISION NOT NULL DEFAULT 0,
    in_stock BOOLEAN NOT NULL DEFAULT true,
    sale INTEGER DEFAULT 0,
    photo TEXT DEFAULT ''
);

CREATE TABLE users(
    id BIGSERIAL PRIMARY KEY,
    username TEXT NOT NULL DEFAULT 'username',
    password TEXT NOT NULL DEFAULT 'password',
    uuid TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()  
);