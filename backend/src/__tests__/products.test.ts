import request from "supertest";
import { app } from "../app";
import { AppDataSource } from "../ormconfig";
import { Product } from "../entities/Product";
import { User } from "../entities/User";
import { Category } from "../entities/Category";
import jwt from "jsonwebtoken";

describe("Product API Routes", () => {
    let authToken: string;
    let testCategoryId: number;
    const testUser = {
        email: "testuser@example.com",
        password: "Test123456*",
        username: "TestUser",
    };
    const testProduct = {
        name: "Test Product",
        categoryId: 0,
        price: "10.00",
        quantity: 10,
    };
    let createdProductId: number;
    let testUserId: string;

    beforeAll(async () => {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const userRepository = AppDataSource.getRepository(User);
        let user = await userRepository.findOne({
            where: { email: testUser.email },
        });

        if (!user) {
            user = new User();
            user.email = testUser.email;
            user.password = testUser.password;
            user.username = testUser.username;
            await userRepository.save(user);
        }
        testUserId = user.email;

        authToken = jwt.sign(
            { email: testUser.email },
            process.env.JWT_SECRET!,
            {
                expiresIn: "1h",
            }
        );

        const categoryRepository = AppDataSource.getRepository(Category);
        const category = new Category();
        category.name = "Test Category";
        category.description = "Test Description";
        category.isActive = true;
        const savedCategory = await categoryRepository.save(category);
        testCategoryId = savedCategory.id;

        testProduct.categoryId = testCategoryId;
    });

    afterAll(async () => {
        await AppDataSource.getRepository(Product).delete({
            user: { email: testUserId },
        });

        await AppDataSource.getRepository(Category).delete({
            id: testCategoryId,
        });

        await AppDataSource.getRepository(User).delete({ email: testUserId });

        await AppDataSource.destroy();
    });

    describe("GET /api/v1/products", () => {
        beforeAll(async () => {
            const product = new Product();
            Object.assign(product, testProduct);
            const user = await AppDataSource.getRepository(User).findOneOrFail({
                where: { email: testUserId },
            });
            product.user = user;
            const category = await AppDataSource.getRepository(
                Category
            ).findOneOrFail({
                where: { id: testCategoryId },
            });
            product.category = category;
            const savedProduct = await AppDataSource.getRepository(
                Product
            ).save(product);
            createdProductId = savedProduct.id;
        });

        afterAll(async () => {
            await AppDataSource.getRepository(Product).delete({
                user: { email: testUserId },
            });
        });

        it("should return all products for authenticated user", async () => {
            const response = await request(app)
                .get("/api/v1/products")
                .set("Authorization", `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        it("should return 401 without authentication token", async () => {
            const response = await request(app).get("/api/v1/products");

            expect(response.status).toBe(401);
        });
    });

    describe("POST /api/v1/products", () => {
        afterEach(async () => {
            await AppDataSource.getRepository(Product).delete({
                user: { email: testUserId },
            });
        });

        it("should create a new product with valid data", async () => {
            const response = await request(app)
                .post("/api/v1/products")
                .set("Authorization", `Bearer ${authToken}`)
                .send(testProduct);

            expect(response.status).toBe(201);
            expect(response.body).toMatchObject({
                name: testProduct.name,
                category: {
                    id: testCategoryId,
                    name: "Test Category",
                },
                price: testProduct.price,
                quantity: testProduct.quantity,
            });
            expect(response.body.id).toBeDefined();

            const product = await AppDataSource.getRepository(Product).findOne({
                where: { id: response.body.id },
            });
            expect(product).not.toBeNull();
        });

        it("should return 400 for missing name", async () => {
            const { name, ...invalidProduct } = testProduct;
            const response = await request(app)
                .post("/api/v1/products")
                .set("Authorization", `Bearer ${authToken}`)
                .send(invalidProduct);

            expect(response.status).toBe(400);
            expect(response.body.errors).toContain(
                "The name field is required."
            );
        });

        it("should return 400 for duplicate product name", async () => {
            await request(app)
                .post("/api/v1/products")
                .set("Authorization", `Bearer ${authToken}`)
                .send(testProduct);

            const response = await request(app)
                .post("/api/v1/products")
                .set("Authorization", `Bearer ${authToken}`)
                .send(testProduct);

            expect(response.status).toBe(500);
        });

        it("should return 400 for invalid price", async () => {
            const response = await request(app)
                .post("/api/v1/products")
                .set("Authorization", `Bearer ${authToken}`)
                .send({
                    ...testProduct,
                    price: -10,
                });

            expect(response.status).toBe(400);
            expect(response.body.errors).toContain(
                "The price must be greater than 0."
            );
        });
    });

    describe("PUT /api/v1/products/:id", () => {
        beforeEach(async () => {
            const product = new Product();
            Object.assign(product, testProduct);
            const user = await AppDataSource.getRepository(User).findOneOrFail({
                where: { email: testUserId },
            });
            product.user = user;
            const category = await AppDataSource.getRepository(
                Category
            ).findOneOrFail({
                where: { id: testCategoryId },
            });
            product.category = category;
            const savedProduct = await AppDataSource.getRepository(
                Product
            ).save(product);
            createdProductId = savedProduct.id;
        });

        afterEach(async () => {
            await AppDataSource.getRepository(Product).delete({
                user: { email: testUserId },
            });
        });

        it("should update an existing product", async () => {
            const updatedData = {
                name: "Updated Product",
                categoryId: testCategoryId,
                price: 200,
                quantity: 20,
            };

            const response = await request(app)
                .put(`/api/v1/products/${createdProductId}`)
                .set("Authorization", `Bearer ${authToken}`)
                .send(updatedData);

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                name: updatedData.name,
                category: {
                    id: testCategoryId,
                    name: "Test Category",
                },
                price: updatedData.price,
                quantity: updatedData.quantity,
            });

            const product = await AppDataSource.getRepository(Product).findOne({
                where: { id: createdProductId },
            });
            expect(product?.name).toBe(updatedData.name);
        });

        it("should return 400 for invalid quantity", async () => {
            const response = await request(app)
                .put(`/api/v1/products/${createdProductId}`)
                .set("Authorization", `Bearer ${authToken}`)
                .send({
                    ...testProduct,
                    quantity: -5,
                });

            expect(response.status).toBe(400);
            expect(response.body.errors).toContain(
                "The quantity cannot be negative."
            );
        });
    });

    describe("DELETE /api/v1/products/:id", () => {
        beforeEach(async () => {
            const product = new Product();
            Object.assign(product, testProduct);
            const user = await AppDataSource.getRepository(User).findOneOrFail({
                where: { email: testUserId },
            });
            product.user = user;
            const category = await AppDataSource.getRepository(
                Category
            ).findOneOrFail({
                where: { id: testCategoryId },
            });
            product.category = category;
            const savedProduct = await AppDataSource.getRepository(
                Product
            ).save(product);
            createdProductId = savedProduct.id;
        });

        it("should delete an existing product", async () => {
            const response = await request(app)
                .delete(`/api/v1/products/${createdProductId}`)
                .set("Authorization", `Bearer ${authToken}`);

            expect(response.status).toBe(204);

            const product = await AppDataSource.getRepository(Product).findOne({
                where: { id: createdProductId },
            });
            expect(product).toBeNull();
        });

        it("should return 404 for non-existent product", async () => {
            const response = await request(app)
                .delete("/api/v1/products/9999")
                .set("Authorization", `Bearer ${authToken}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe(
                "Product not found or not owned by user"
            );
        });
    });
});
