import request from "supertest";
import { app } from "../app";
import { AppDataSource } from "../ormconfig";
import { Product } from "../entities/Product";
import { User } from "../entities/User";
import { Category } from "../entities/Category";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

describe("Product API Routes", () => {
    let authToken: string;

    const generateTestUser = () => {
        const uniqueId = uuidv4().substring(0, 8);
        return {
            email: `testuser${uniqueId}@example.com`,
            password: `Test123456*${uniqueId}`,
            username: `TestUser${uniqueId}`,
        };
    };

    const createTestUser = async () => {
        const testUser = generateTestUser();
        const userRepository = AppDataSource.getRepository(User);
        let user = new User();
        user.email = testUser.email;
        user.password = testUser.password;
        user.username = testUser.username;
        user = await userRepository.save(user);
        return user;
    };

    const createAuthToken = (email: string) => {
        return jwt.sign({ email }, process.env.JWT_SECRET!, {
            expiresIn: "1h",
        });
    };

    const createTestCategory = async () => {
        const categoryRepository = AppDataSource.getRepository(Category);
        const category = new Category();
        category.name = "Test Category";
        category.description = "Test Description";
        category.isActive = true;
        return await categoryRepository.save(category);
    };

    const createTestProduct = async (userId: string, categoryId: number) => {
        const product = new Product();
        product.name = "Test Product";
        product.price = 10;
        product.quantity = 10;

        const user = await AppDataSource.getRepository(User).findOneOrFail({
            where: { email: userId },
        });
        product.user = user;

        const category = await AppDataSource.getRepository(
            Category
        ).findOneOrFail({
            where: { id: categoryId },
        });
        product.category = category;

        return await AppDataSource.getRepository(Product).save(product);
    };

    beforeAll(async () => {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
    });

    afterAll(async () => {
        await AppDataSource.destroy();
    });

    describe("GET /api/v1/products", () => {
        let testUser: User;
        let testCategory: Category;
        let testProduct: Product;

        beforeAll(async () => {
            testUser = await createTestUser();
            testCategory = await createTestCategory();
            testProduct = await createTestProduct(
                testUser.email,
                testCategory.id
            );
            authToken = createAuthToken(testUser.email);
        });

        afterAll(async () => {
            await AppDataSource.getRepository(Product).delete({
                id: testProduct.id,
            });
            await AppDataSource.getRepository(Category).delete({
                id: testCategory.id,
            });
            await AppDataSource.getRepository(User).delete({
                email: testUser.email,
            });
        });

        it("should return all products for authenticated user", async () => {
            const response = await request(app)
                .get("/api/v1/products")
                .set("Authorization", `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(
                response.body.some((p: any) => p.id === testProduct.id)
            ).toBe(true);
        });

        it("should return 401 without authentication token", async () => {
            const response = await request(app).get("/api/v1/products");
            expect(response.status).toBe(401);
        });
    });

    describe("POST /api/v1/products", () => {
        let testUser: User;
        let testCategory: Category;

        beforeEach(async () => {
            testUser = await createTestUser();
            testCategory = await createTestCategory();
            authToken = createAuthToken(testUser.email);
        });

        afterEach(async () => {
            await AppDataSource.getRepository(Product).delete({
                user: { email: testUser.email },
            });
            await AppDataSource.getRepository(Category).delete({
                id: testCategory.id,
            });
            await AppDataSource.getRepository(User).delete({
                email: testUser.email,
            });
        });

        it("should create a new product with valid data", async () => {
            const testProduct = {
                name: "New Test Product",
                categoryId: testCategory.id,
                price: "15.00",
                quantity: 5,
            };

            const response = await request(app)
                .post("/api/v1/products")
                .set("Authorization", `Bearer ${authToken}`)
                .send(testProduct);

            expect(response.status).toBe(201);
            expect(response.body).toMatchObject({
                name: testProduct.name,
                price: testProduct.price,
                quantity: testProduct.quantity,
            });
        });

        it("should return 400 for missing name", async () => {
            const response = await request(app)
                .post("/api/v1/products")
                .set("Authorization", `Bearer ${authToken}`)
                .send({
                    categoryId: testCategory.id,
                    price: "15.00",
                    quantity: 5,
                });

            expect(response.status).toBe(400);
            expect(response.body.errors).toContain(
                "The name field is required."
            );
        });
    });

    describe("PUT /api/v1/products/:id", () => {
        let testUser: User;
        let testCategory: Category;
        let testProduct: Product;

        beforeEach(async () => {
            testUser = await createTestUser();
            testCategory = await createTestCategory();
            testProduct = await createTestProduct(
                testUser.email,
                testCategory.id
            );
            authToken = createAuthToken(testUser.email);
        });

        afterEach(async () => {
            await AppDataSource.getRepository(Product).delete({
                id: testProduct.id,
            });
            await AppDataSource.getRepository(Category).delete({
                id: testCategory.id,
            });
            await AppDataSource.getRepository(User).delete({
                email: testUser.email,
            });
        });

        it("should update an existing product", async () => {
            const updatedData = {
                name: "Updated Product Name",
                categoryId: testCategory.id,
                price: 25,
                quantity: 10,
            };

            const response = await request(app)
                .put(`/api/v1/products/${testProduct.id}`)
                .set("Authorization", `Bearer ${authToken}`)
                .send(updatedData);

            expect(response.status).toBe(200);
        });
    });

    describe("DELETE /api/v1/products/:id", () => {
        let testUser: User;
        let testCategory: Category;
        let testProduct: Product;

        beforeEach(async () => {
            testUser = await createTestUser();
            testCategory = await createTestCategory();
            testProduct = await createTestProduct(
                testUser.email,
                testCategory.id
            );
            authToken = createAuthToken(testUser.email);
        });

        afterEach(async () => {
            await AppDataSource.getRepository(Category).delete({
                id: testCategory.id,
            });
            await AppDataSource.getRepository(User).delete({
                email: testUser.email,
            });
        });

        it("should delete an existing product", async () => {
            const response = await request(app)
                .delete(`/api/v1/products/${testProduct.id}`)
                .set("Authorization", `Bearer ${authToken}`);

            expect(response.status).toBe(204);

            const deletedProduct = await AppDataSource.getRepository(
                Product
            ).findOne({
                where: { id: testProduct.id },
            });
            expect(deletedProduct).toBeNull();
        });
    });
});
