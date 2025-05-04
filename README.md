# My Inventory App

**My Inventory App** es una aplicación web completa para la gestión de productos y categorías de inventario. Ofrece un entorno moderno y adaptable, con autenticación segura, control detallado del inventario y una experiencia de usuario optimizada tanto para escritorio como para dispositivos móviles.

## ¿Cómo ejecutarlo?

### 1. Clona el repositorio:

```bash
git clone hhttps://github.com/pulidxxx/my-inventory-app.git
```

### 2. Accede al directorio del proyecto:

```bash
cd my-inventory-app
```

### 3. Configura las variables de entorno:

Crea un archivo `.env` en la carpeta de frontend y otro en la de backend y define las variables necesarias. Puedes usar el archivo `.env.example` como referencia.

### 4. Configura la base de datos:

Asegúrate de crear una base de datos en postgres con el mismo nombre especificado en las variables de entorno. No es necesario realizar configuraciones adicionales, ya que la aplicación se conectará automáticamente utilizando las credenciales proporcionadas.

### 5. Inicia la aplicación:

#### Iniciar el Backend:

```bash
cd backend
npm install
npm run start
```

#### Iniciar el Frontend:

```bash
cd frontend
npm install
npm run dev
```

### 6. Ejecuta las pruebas (opcional):

En cada carpeta (frontend o backend), puedes correr las pruebas con:

```bash
npm test
```

### 7. Accede a la aplicación:

Abre tu navegador y ve a `http://localhost:5173`.

### 8. Rutas del Backend:

El backend expone las siguientes rutas para interactuar con la API:

-   **GET `/api/v1/products`**: Obtiene todos los productos.
-   **POST `/api/v1/products`**: Crea un nuevo producto.
-   **PUT `/api/v1/products/:id`**: Actualiza un producto existente por ID.
-   **DELETE `/api/v1/products/:id`**: Elimina un producto existente por ID.

#### Categorías:

-   **GET `/api/v1/categories`**: Obtiene todas las categorías.
-   **POST `/api/v1/categories`**: Crea una nueva categoría.
-   **PUT `/api/v1/categories/:id`**: Actualiza una categoría existente por ID.
-   **DELETE `/api/v1/categories/:id`**: Elimina una categoría existente por ID.

#### Autenticación:

-   **POST `/api/v1/auth/register`**: Registra un nuevo usuario.
-   **POST `/api/v1/auth/login`**: Inicia sesión y obtiene un token de acceso.
-   **POST `/api/v1/auth/refresh-token`**: Obtiene un nuevo token de acceso utilizando un token de actualización.
