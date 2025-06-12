const request = require("supertest");
const app = require("../../app");
const User = require("../../models/user.model");

// const mongoose = require("mongoose");
// describe("DB Test Run", () => {
//   test("Database connection is established", async () => {
//     expect(mongoose.connection.readyState).toBe(1); // 1 means connected
//   });
//   test("User model is defined", () => {
//     expect(User).toBeDefined();
//   });
//   test("User model has a username field", () => {
//     const user = new User({
//       first_name: "test",
//       last_name: "user",
//       email: "testuser@test.com",
//       password: "testpass",
//     });
//     expect(user.email).toBeDefined();
//   });
//   test("User model can save a user", async () => {
//     const user = new User({
//       first_name: "test",
//       last_name: "user",
//       email: "testuser@test.com",
//       password: "testpass",
//     });
//     await user.save();
//     const foundUser = await User.findOne({ email: "testuser@test.com" });
//     expect(foundUser).toBeDefined();
//     expect(foundUser.email).toBe("testuser@test.com");
//     console.log("Users count after saving:", await User.countDocuments());
//   });

//   // --- Crucial Test to Prove Clearing ---
//   test("Database is cleared after previous test", async () => {
//     // This test runs AFTER the `afterEach` from the previous test has executed.
//     // Therefore, there should be no users.
//     const userCount = await User.countDocuments();
//     expect(userCount).toBe(0);
//     console.log("User count in 'Database is cleared' test:", userCount); // Should be 0
//   });

//   test("Another user can be saved in a clean state", async () => {
//     // This test confirms that after clearing, you can save new data
//     const user = new User({
//       first_name: "new",
//       last_name: "user",
//       email: "newuser@test.com",
//       password: "newpass",
//     });
//     await user.save();
//     const foundUser = await User.findOne({ email: "newuser@test.com" });
//     expect(foundUser).toBeDefined();
//     expect(foundUser.email).toBe("newuser@test.com");
//   });
// });

describe("User Authentication", () => {
  describe("POST /signup", () => {
    beforeEach(async () => {
      await User.deleteMany({});
    });

    it("Should create user with valid email and password", async () => {
      const userData = {
        first_name: "TestUserFirstName",
        last_name: "TestUserLastName",
        email: "test.user@example.com",
        password: "TestPassword123!",
        bio: "This is a test bio for a test user account used in automated testing scenarios.",
        avatar: "https://test-example.com/test-avatar.jpg",
        social_links: {
          twitter: "testuser_twitter",
          linkedin: "testuser_linkedin",
          github: "testuser_github",
          website: "https://testuser.example.com",
        },
      };

      const response = await request(app)
        .post("/api/auth/signup")
        .send(userData);

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe("User registered successfully");
      expect(response.body.data.user).toHaveProperty("id");
      expect(response.body.data.user).toHaveProperty("email");
      expect(response.body.data).toHaveProperty("token");
    });

    it("Should return JWT token after successful signup", async () => {
      const userData = {
        first_name: "TestUserFirstName",
        last_name: "TestUserLastName",
        email: "test.user@example.com",
        password: "TestPassword123!",
        bio: "This is a test bio for a test user account used in automated testing scenarios.",
        avatar: "https://test-example.com/test-avatar.jpg",
        social_links: {
          twitter: "testuser_twitter",
          linkedin: "testuser_linkedin",
          github: "testuser_github",
          website: "https://testuser.example.com",
        },
      };

      const response = await request(app)
        .post("/api/auth/signup")
        .send(userData);

      expect(response.statusCode).toBe(201);
      expect(response.body.data).toHaveProperty("token");
      expect(response.body.data.token).toMatch(
        /^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/
      );
    });

    it("Should return user data without password in response", async () => {
      const userData = {
        first_name: "TestUserFirstName",
        last_name: "TestUserLastName",
        email: "test.user@example.com",
        password: "TestPassword123!",
      };

      const response = await request(app)
        .post("/api/auth/signup")
        .send(userData);
      expect(response.statusCode).toBe(201);
      expect(response.body.data.user).not.toHaveProperty("password");
    });

    it("Should reject signup with invalid email format", async () => {
      const userData = {
        first_name: "TestUserFirstName",
        last_name: "TestUserLastName",
        email: "invalidemailformat",
        password: "TestPassword123!",
      };

      const response = await request(app)
        .post("/api/auth/signup")
        .send(userData);

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe("Please provide a valid email address");
    });

    it("Should reject signup with missing required fields", async () => {
      const userData = {
        first_name: "",
        email: "test.user@example.com",
        password: "TestPassword123!",
      };

      const response = await request(app)
        .post("/api/auth/signup")
        .send(userData);

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(
        "First Name cannot be empty, Last Name is required"
      );
    });

    it("Should reject signup with password shorter than minimum length", async () => {
      const userData = {
        first_name: "TestUserFirstName",
        last_name: "TestUserLastName",
        email: "test.user@example.com",
        password: "Test",
      };

      const response = await request(app)
        .post("/api/auth/signup")
        .send(userData);

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(
        "Password must be at least 6 characters long"
      );
    });

    it("Should reject signup with existing email address", async () => {
      const userData = {
        first_name: "TestUserFirstName",
        last_name: "TestUserLastName",
        email: "test.user@example.com",
        password: "TestPassword123!",
      };
      await request(app).post("/api/auth/signup").send(userData);

      const duplicateUser = {
        first_name: "DuplicateUserFirstName",
        last_name: "DuplicateUserLastName",
        email: "test.user@example.com",
        password: "TestPassword123!",
      };

      const response = await request(app)
        .post("/api/auth/signup")
        .send(duplicateUser);

      expect(response.statusCode).toBe(409);
      expect(response.body.error).toBe("Email already registered");
    });
  });

  describe("POST /login", () => {
    beforeAll(async () => {
      const userData = {
        first_name: "TestUserFirstName",
        last_name: "TestUserLastName",
        email: "test.user@example.com",
        password: "TestPassword123!",
      };

      await request(app).post("/api/auth/signup").send(userData);
    });

    it("Should return JWT token with valid credentials", async () => {
      const loginData = {
        email: "test.user@example.com",
        password: "TestPassword123!",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(typeof response.body.data.token).toBe("string");
      expect(response.body.message).toBe("Login successful");
    });

    it("Should return user data without password in response", async () => {
      const loginData = {
        email: "test.user@example.com",
        password: "TestPassword123!",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData);

      expect(response.statusCode).toBe(200);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.id).toBeDefined();
      expect(response.body.data.user.email).toBe("test.user@example.com");
      expect(response.body.data.user.password).toBeUndefined();
    });

    it("Should reject login with incorrect password", async () => {
      const loginData = {
        email: "test.user@example.com",
        password: "WrongPassword123!",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData);

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("Invalid email or password");
    });

    it("Should reject login with missing email", async () => {
      const loginData = {
        password: "TestPassword123!",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData);

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("Email is required");
    });

    it("Should reject login with missing password", async () => {
      const loginData = {
        email: "test.user@example.com",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData);

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("Password is required");
    });

    it("Should reject login with non-existent email", async () => {
      const loginData = {
        email: "nonexistent@example.com",
        password: "TestPassword123!",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData);

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("Invalid email or password");
    });

    it("Should reject login with invalid email format", async () => {
      const loginData = {
        email: "invalid-email-format",
        password: "TestPassword123!",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData);

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("email");
    });

    it("Should reject login with empty request body", async () => {
      const response = await request(app).post("/api/auth/login").send({});

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });
});
