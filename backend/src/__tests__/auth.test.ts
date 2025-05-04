import request from "supertest";
import { app } from "../app";
import { AppDataSource } from "../ormconfig";
import { User } from "../entities/User";
import { Product } from "../entities/Product";

describe("Auth API Routes", () => {
    const testUser = {
        email: "testuser@example.com",
        password: "Test123456*",
        username: "TestUser",
    };

    beforeAll(async () => {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
    });

    afterAll(async () => {
        if (AppDataSource.isInitialized) {
            await AppDataSource.getRepository(Product)
                .createQueryBuilder()
                .delete()
                .where("userEmail = :email", { email: testUser.email })
                .execute();

            await AppDataSource.getRepository(User)
                .createQueryBuilder()
                .delete()
                .where("email = :email", { email: testUser.email })
                .execute();

            await AppDataSource.destroy();
        }
    });

    describe("POST /api/v1/auth/register", () => {
        afterEach(async () => {
            await AppDataSource.getRepository(Product)
                .createQueryBuilder()
                .delete()
                .where("userEmail = :email", { email: testUser.email })
                .execute();

            await AppDataSource.getRepository(User)
                .createQueryBuilder()
                .delete()
                .where("email = :email", { email: testUser.email })
                .execute();
        });

        it("should register a new user successfully", async () => {
            const response = await request(app)
                .post("/api/v1/auth/register")
                .send(testUser);

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                message: "User registered successfully",
                email: testUser.email,
            });

            const user = await AppDataSource.getRepository(User).findOne({
                where: { email: testUser.email },
            });
            expect(user).not.toBeNull();
            expect(user?.username).toBe(testUser.username);
        });

        it("should return 400 for invalid email format", async () => {
            const response = await request(app)
                .post("/api/v1/auth/register")
                .send({
                    ...testUser,
                    email: "invalid-email",
                });

            expect(response.status).toBe(400);
            expect(response.body.errors).toContain("Must be a valid email.");
        });

        it("should return 400 for duplicate email", async () => {
            await request(app).post("/api/v1/auth/register").send(testUser);

            const response = await request(app)
                .post("/api/v1/auth/register")
                .send(testUser);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                errors: ["Error registering user"],
            });
        });
    });

    describe("POST /api/v1/auth/login", () => {
        beforeAll(async () => {
            await request(app).post("/api/v1/auth/register").send(testUser);
        });

        afterAll(async () => {
            await AppDataSource.getRepository(Product)
                .createQueryBuilder()
                .delete()
                .where("userEmail = :email", { email: testUser.email })
                .execute();

            await AppDataSource.getRepository(User)
                .createQueryBuilder()
                .delete()
                .where("email = :email", { email: testUser.email })
                .execute();
        });

        it("should login successfully with valid credentials", async () => {
            const response = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    email: testUser.email,
                    password: testUser.password,
                });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                accessToken: expect.any(String),
                refreshToken: expect.any(String),
                username: testUser.username,
            });
        });

        it("should return 400 for invalid password", async () => {
            const response = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    email: testUser.email,
                    password: "Wrong-password*",
                });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ errors: ["Invalid credentials"] });
        });

        it("should return 400 for missing email", async () => {
            const response = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    password: testUser.password,
                });

            expect(response.status).toBe(400);
            expect(response.body.errors).toContain("Must be a valid email.");
        });
    });

    describe("POST /api/v1/auth/refresh-token", () => {
        let refreshToken: string;

        beforeAll(async () => {
            await request(app).post("/api/v1/auth/register").send(testUser);
            const loginResponse = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    email: testUser.email,
                    password: testUser.password,
                });
            refreshToken = loginResponse.body.refreshToken;
        });

        afterAll(async () => {
            await AppDataSource.getRepository(Product)
                .createQueryBuilder()
                .delete()
                .where("userEmail = :email", { email: testUser.email })
                .execute();

            await AppDataSource.getRepository(User)
                .createQueryBuilder()
                .delete()
                .where("email = :email", { email: testUser.email })
                .execute();
        });

        it("should return new access token with valid refresh token", async () => {
            const response = await request(app)
                .post("/api/v1/auth/refresh-token")
                .send({ token: refreshToken });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                accessToken: expect.any(String),
            });
        });

        it("should return 401 when no token is provided", async () => {
            const response = await request(app)
                .post("/api/v1/auth/refresh-token")
                .send({});

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                message: "Refresh token is required",
            });
        });

        it("should return 403 for invalid refresh token", async () => {
            const response = await request(app)
                .post("/api/v1/auth/refresh-token")
                .send({ token: "invalid-token" });

            expect(response.status).toBe(403);
            expect(response.body).toEqual({
                message: "Invalid refresh token",
            });
        });
    });
});
