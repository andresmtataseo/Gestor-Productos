CREATE DATABASE gestor_productos;

USE gestor_productos;

CREATE TABLE productos
(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(100)   NOT NULL,
    descripcion TEXT           NOT NULL,
    precio      DECIMAL(10, 2) NOT NULL,
    stock       INT            NOT NULL
);

-- Insertar productos en la tabla
INSERT INTO productos (nombre, descripcion, precio, stock)
VALUES ('Laptop HP Pavilion', 'Laptop de 15 pulgadas con procesador Intel Core i5 y 8GB de RAM.', 899.99, 10),
       ('Smartphone Samsung Galaxy S21',
        'Teléfono inteligente con pantalla AMOLED de 6.2 pulgadas y 128GB de almacenamiento.', 799.99, 15),
       ('Tablet Apple iPad Air', 'Tablet con pantalla Retina de 10.9 pulgadas y chip A14 Bionic.', 599.99, 20),
       ('Monitor LG UltraGear', 'Monitor gaming de 27 pulgadas con resolución QHD y tasa de refresco de 144Hz.', 349.99,
        8),
       ('Teclado Mecánico Corsair K95', 'Teclado mecánico para gaming con switches Cherry MX y retroiluminación RGB.',
        199.99, 12),
       ('Mouse Logitech G502', 'Mouse para gaming con sensor óptico de alta precisión y 11 botones programables.',
        79.99, 25),
       ('Auriculares Sony WH-1000XM4', 'Auriculares inalámbricos con cancelación de ruido y hasta 30 horas de batería.',
        349.99, 5),
       ('Impresora Epson EcoTank', 'Impresora de tanque de tinta con bajo costo por página y conectividad Wi-Fi.',
        299.99, 7),
       ('Disco Duro Externo Seagate', 'Disco duro externo de 2TB con conexión USB 3.0 y diseño portátil.', 89.99, 30),
       ('Cámara Canon EOS Rebel T7', 'Cámara réflex digital con sensor CMOS de 24.1MP y grabación de video Full HD.',
        499.99, 3);