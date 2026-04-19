# Catalog Service - NestJS + PostgreSQL

Este microservicio maneja la gestión del catálogo de productos dentro de una arquitectura de microservicios.

---

## Tecnologías

- NestJS
- PostgreSQL
- TypeORM
- Swagger
- Axios (para comunicación entre microservicios)
- class-validator / class-transformer

---

## Configuración

1. Clonar el proyecto  
2. Instalar dependencias

```bash
npm install
```

3. Crear archivo `.env`

```
PORT=3001

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=admin
DB_NAME=catalog-db
```

---

## Base de datos

Entidad `products`:

- id (UUID)
- name (nombre del producto)
- description (texto opcional)
- price (decimal)
- stock (entero)
- created_at (timestamp)

---

## Ejecutar proyecto

```bash
npm run start:dev
```

---

## Swagger

La documentación de la API está disponible en:

```
http://localhost:3001/docs
```

---

## Endpoints

### Crear producto

POST /products

Body:
```json
{
  "name": "Camiseta",
  "description": "Camiseta algodón",
  "price": 25.99,
  "stock": 10
}
```

---

### Obtener producto por ID

GET /products/:id

---

### Validar producto y stock

POST /products/validate

Body:
```json
{
  "id": "uuid",
  "quantity": 2
}
```

---

### Disminuir stock

POST /products/decrease-stock

Body:
```json
{
  "id": "uuid",
  "quantity": 2
}
```

---

## Flujo del catálogo

1. Se crean productos en el catálogo  
2. El order-service consulta este servicio para validar productos  
3. Se valida stock antes de crear una orden  
4. Se descuenta stock después de confirmar compras  
5. Toda la comunicación entre microservicios es vía HTTP  

---

## Arquitectura

Este servicio forma parte de una arquitectura de microservicios:

- auth-service → autenticación y JWT  
- catalog-service → gestión de productos  
- order-service → gestión de órdenes  

Cada servicio tiene su propia base de datos y no comparte lógica interna.

---

## Recomendaciones de arquitectura

- No exponer lógica de órdenes en este servicio  
- Mantener consistencia de stock en operaciones críticas  
- Usar validación estricta con DTOs  
- Toda comunicación con otros microservicios debe ser vía HTTP o eventos  
- Swagger debe mantenerse sincronizado con DTOs  

---

## Buenas prácticas implementadas

- Validación de datos con class-validator  
- Uso de DTOs para entrada de datos  
- Separación de responsabilidades (Controller / Service)  
- Manejo de errores controlado  
- Comunicación entre microservicios desacoplada  
- Documentación completa con Swagger  

---

## Mejoras futuras

- Reserva de stock (pre-checkout)  
- Eventos con RabbitMQ o Kafka  
- Cache con Redis  
- Historial de cambios de inventario  
- Búsqueda avanzada de productos  
- Transacciones distribuidas (Saga pattern)

---

## Autor

ALX