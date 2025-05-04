import request from "supertest";
import { app } from "../app";
import { AppDataSource } from "../ormconfig";
import { Category } from "../entities/Category";
import { User } from "../entities/User";
import { Product } from "../entities/Product";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

describe("Category API Routes", () => {
    let authToken: string;
    let testUser: User;
    let testCategory: Category;
    let testProduct: Product;

    const generateUniqueName = (prefix: string) => {
        return `${prefix}-${uuidv4().substring(0, 8)}`;
    };

    const generateTestUser = () => {
        return {
            email: `testuser-${uuidv4()}@example.com`,
            password: `Test123456*${uuidv4().substring(0, 4)}`,
            username: `TestUser-${uuidv4().substring(0, 4)}`,
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

    const createTestCategory = async () => {
        const categoryRepository = AppDataSource.getRepository(Category);
        const category = new Category();
        category.name = generateUniqueName("TestCategory");
        category.description = "Test Description";
        category.isActive = true;
        return await categoryRepository.save(category);
    };

    const createTestProduct = async (category: Category, user: User) => {
        const product = new Product();
        product.name = generateUniqueName("TestProduct");
        product.price = 10;
        product.quantity = 10;
        product.user = user;
        product.category = category;
        return await AppDataSource.getRepository(Product).save(product);
    };

    beforeAll(async () => {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        await AppDataSource.getRepository(Product).delete({});
        await AppDataSource.getRepository(Category).delete({});
        await AppDataSource.getRepository(User).delete({});

        testUser = await createTestUser();

        authToken = jwt.sign(
            { email: testUser.email },
            process.env.JWT_SECRET!,
            { expiresIn: "1h" }
        );
    });

    afterAll(async () => {
        await AppDataSource.getRepository(Product).delete({});
        await AppDataSource.getRepository(Category).delete({});
        await AppDataSource.getRepository(User).delete({
            email: testUser.email,
        });
        await AppDataSource.destroy();
    });

    describe("GET /api/v1/categories", () => {
        beforeEach(async () => {
            testCategory = await createTestCategory();
        });

        afterEach(async () => {
            await AppDataSource.getRepository(Category).delete({
                id: testCategory.id,
            });
        });

        it("should return all categories for authenticated user", async () => {
            const response = await request(app)
                .get("/api/v1/categories")
                .set("Authorization", `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(
                response.body.some((c: any) => c.id === testCategory.id)
            ).toBe(true);
        });

        it("should return 401 without authentication token", async () => {
            const response = await request(app).get("/api/v1/categories");
            expect(response.status).toBe(401);
        });
    });

    describe("POST /api/v1/categories", () => {
        afterEach(async () => {
            await AppDataSource.getRepository(Category).delete({
                name: "New Test Category",
            });
        });

        it("should create a new category with valid data", async () => {
            const newCategory = {
                name: "New Test Category",
                description: "New Test Description",
            };

            const response = await request(app)
                .post("/api/v1/categories")
                .set("Authorization", `Bearer ${authToken}`)
                .send(newCategory);

            expect(response.status).toBe(201);
            expect(response.body).toMatchObject({
                name: newCategory.name,
                description: newCategory.description,
                isActive: true,
            });
        });

        it("should return 400 for missing name", async () => {
            const response = await request(app)
                .post("/api/v1/categories")
                .set("Authorization", `Bearer ${authToken}`)
                .send({
                    description: "Test Description",
                });

            expect(response.status).toBe(400);
            expect(response.body.errors).toContain(
                "The name field is required."
            );
        });

        it("should return 400 for duplicate category name", async () => {
            const existingCategory = await createTestCategory();

            const response = await request(app)
                .post("/api/v1/categories")
                .set("Authorization", `Bearer ${authToken}`)
                .send({
                    name: existingCategory.name,
                    description: "Test Description",
                });

            expect(response.status).toBe(400);
            expect(response.body.errors).toContain(
                "A category with this name already exists."
            );

            await AppDataSource.getRepository(Category).delete({
                id: existingCategory.id,
            });
        });
    });

    describe("PUT /api/v1/categories/:id", () => {
        beforeEach(async () => {
            testCategory = await createTestCategory();
        });

        afterEach(async () => {
            await AppDataSource.getRepository(Category).delete({
                id: testCategory.id,
            });
        });

        it("should update an existing category", async () => {
            const updatedData = {
                name: "Updated Category Name",
                description: "Updated Description",
                isActive: false,
            };

            const response = await request(app)
                .put(`/api/v1/categories/${testCategory.id}`)
                .set("Authorization", `Bearer ${authToken}`)
                .send(updatedData);

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(updatedData);
        });

        it("should return 404 for non-existent category", async () => {
            const response = await request(app)
                .put("/api/v1/categories/9999")
                .set("Authorization", `Bearer ${authToken}`)
                .send({
                    name: "Test",
                    description: "Test",
                });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Category not found");
        });

        it("should return 400 for invalid data", async () => {
            const response = await request(app)
                .put(`/api/v1/categories/${testCategory.id}`)
                .set("Authorization", `Bearer ${authToken}`)
                .send({
                    name: "",
                    description: "Test",
                });

            expect(response.status).toBe(400);
            expect(response.body.errors).toContain(
                "The name field is required."
            );
        });
    });

    describe("DELETE /api/v1/categories/:id", () => {
        beforeEach(async () => {
            testCategory = await createTestCategory();
        });

        afterEach(async () => {
            await AppDataSource.getRepository(Product).delete({});
            await AppDataSource.getRepository(Category).delete({
                name: testCategory.name,
            });
        });

        it("should delete an empty category", async () => {
            const response = await request(app)
                .delete(`/api/v1/categories/${testCategory.id}`)
                .set("Authorization", `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Category deleted successfully");

            const deletedCategory = await AppDataSource.getRepository(
                Category
            ).findOne({
                where: { id: testCategory.id },
            });
            expect(deletedCategory).toBeNull();
        });

        it("should return 404 for non-existent category", async () => {
            const response = await request(app)
                .delete("/api/v1/categories/9999")
                .set("Authorization", `Bearer ${authToken}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Category not found");
        });

        it("should return 400 for category with products", async () => {
            testProduct = await createTestProduct(testCategory, testUser);

            const response = await request(app)
                .delete(`/api/v1/categories/${testCategory.id}`)
                .set("Authorization", `Bearer ${authToken}`);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe(
                "Cannot delete category with associated products"
            );
        });
    });
});
