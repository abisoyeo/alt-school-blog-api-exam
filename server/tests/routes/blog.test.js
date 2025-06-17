const request = require("supertest");
const Blog = require("../../models/blog.model");
const User = require("../../models/user.model");
const Tag = require("../../models/tag.model");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../../app");

let testUser;
let testTag1;
let testTag2;

const createTestBlogs = async (authorId, tag1Id, tag2Id) => {
  return Blog.create([
    {
      title: "Published Blog 1",
      description: "Description for blog 1",
      body: "This is the body of published blog 1.",
      state: "published",
      author: authorId,
      tags: [tag1Id, tag2Id],
      read_count: 1,
    },
    {
      title: "Published Blog 2",
      description: "Description for blog 2",
      body: "This is the body of published blog 2.",
      state: "published",
      author: authorId,
      tags: [tag2Id],
      read_count: 5,
    },
    {
      title: "Draft Blog 1",
      description: "Description for draft 1",
      body: "This is the body of draft blog 1.",
      state: "draft",
      author: authorId,
      tags: [tag1Id],
      read_count: 0,
    },
  ]);
};

beforeAll(async () => {
  testUser = await User.create({
    first_name: "TestAuthorFirstName",
    last_name: "TestAuthorLastName",
    email: "test.author@example.com",
    password: "TestPassword123!",
  });

  testTag1 = await Tag.create({ name: "technology" });
  testTag2 = await Tag.create({ name: "programming" });
});

describe("Authentication Middleware", () => {
  it("Should allow access with valid JWT token", async () => {
    let authToken;
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "test.author@example.com",
      password: "TestPassword123!",
    });

    authToken = loginResponse.body.data.token;

    const response = await request(app)
      .get("/api/blogs/me")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.message).toBe("Your blogs fetched successfully");
  });

  it("Should reject access with missing token", async () => {
    const response = await request(app).get("/api/blogs/me");
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("No auth token");
  });

  it("Should reject access with invalid token", async () => {
    const response = await request(app)
      .get("/api/blogs/me")
      .set("Authorization", "Bearer invalidtoken");
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("jwt malformed");
  });

  it("Should reject access with expired token", async () => {
    const expiredToken = jwt.sign(
      { user: { id: testUser._id } },
      process.env.JWT_SECRET,
      { expiresIn: "1ms" }
    );

    const response = await request(app)
      .get("/api/blogs/me")
      .set("Authorization", `Bearer ${expiredToken}`);
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("jwt expired");
  });

  it("Should reject access with token for non-existent user", async () => {
    const fakeUserId = new mongoose.Types.ObjectId();

    const invalidUserToken = jwt.sign(
      { user: { id: fakeUserId } },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const response = await request(app)
      .get("/api/blogs/me")
      .set("Authorization", `Bearer ${invalidUserToken}`);

    console.log(response.body);
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe(
      "Invalid or expired token. Please login again."
    );
  });
});

describe("Blog Controller", () => {
  let blogId;
  beforeEach(async () => {
    await Blog.deleteMany({});
    blogId = await createTestBlogs(testUser._id, testTag1._id, testTag2._id);
  });
  describe("Public Blog Access", () => {
    describe("GET /blogs", () => {
      it("Should return only published blogs", async () => {
        const response = await request(app).get("/api/blogs");
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBeDefined();
        response.body.data.forEach((blog) => {
          expect(blog.state).toBe("published");
        });
      });
      it("Should return paginated blogs", async () => {
        const response = await request(app).get("/api/blogs?page=1&limit=2");
        expect(response.statusCode).toBe(200);
        expect(response.body.data.length).toBeLessThanOrEqual(2);
        expect(response.body.pagination).toBeDefined();
        expect(response.body.pagination.currentPage).toBe(1);
        expect(response.body.pagination.itemsPerPage).toBe(2);
      });
      it("Should return filtered blog based on query strings", async () => {
        const response = await request(app).get(
          "/api/blogs?title=Published Blog 1&author=TestAuthorFirstName&tags=technology"
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.length).toBeGreaterThan(0);
        expect(response.body.data[0].title).toBe("Published Blog 1");
        expect(response.body.data[0].author.first_name).toBe(
          "TestAuthorFirstName"
        );
        expect(response.body.data[0].tags[0].name).toBe("technology");
      });
      it("Should return ordered blog based on query string", async () => {
        const response = await request(app).get(
          "/api/blogs?sort_by=read_count&order=desc"
        );
        expect(response.body.data[0].read_count).toBeGreaterThanOrEqual(
          response.body.data[1].read_count
        );
      });
    });
    describe("GET /blogs/:id", () => {
      it("Should return a single published blog", async () => {
        const response = await request(app).get(`/api/blogs/${blogId[0]._id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.title).toBe("Published Blog 1");
      });
      it("Should increment blog read count", async () => {
        const initialResponse = await request(app).get(
          `/api/blogs/${blogId[0]._id}`
        );
        expect(initialResponse.body.data.read_count).toBe(2);

        const response = await request(app).get(`/api/blogs/${blogId[0]._id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.data.read_count).toBe(3);
      });
      it("Should return 404 for non-existent blog", async () => {
        const response = await request(app).get(
          "/api/blogs/60d5f484f1b2c8b8f8e4e4e4"
        );
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe(
          "Blog post not found or not published"
        );
      });
      it("Should return 404 for unpublished blog ", async () => {
        const response = await request(app).get(`/api/blogs/${blogId[2]._id}`);
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe(
          "Blog post not found or not published"
        );
      });
    });
  });

  describe("Author Blog Access", () => {
    let authToken;
    beforeAll(async () => {
      const loginResponse = await request(app).post("/api/auth/login").send({
        email: "test.author@example.com",
        password: "TestPassword123!",
      });

      authToken = loginResponse.body.data.token;
    });

    it("Should return all author's blogs", async () => {
      const response = await request(app)
        .get("/api/blogs/me")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.length).toBeGreaterThan(0);
      response.body.data.forEach((blog) => {
        expect(blog.author._id).toBe(testUser._id.toString());
      });
    });

    it("Should return paginated blogs", async () => {
      const response = await request(app)
        .get("/api/blogs/me?page=1&limit=2")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.data.length).toBeLessThanOrEqual(2);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.itemsPerPage).toBe(2);
    });

    it("Should filter blogs by state (draft/published)", async () => {
      const response = await request(app)
        .get("/api/blogs/me?state=published")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.data).toBeDefined();
      response.body.data.forEach((blog) => {
        expect(blog.state).toBe("published");
      });
    });

    it("Should return a single author blog", async () => {
      const response = await request(app)
        .get(`/api/blogs/me/${blogId[0]._id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.title).toBe("Published Blog 1");
      expect(response.body.data.author._id).toBe(testUser._id.toString());
    });

    it("Should create blog with valid data", async () => {
      const newBlog = {
        title: "New Blog",
        description: "This is a new blog description.",
        body: "This is the body of the new blog.",
        tags: ["newTag1", "newTag2"],
      };

      const response = await request(app)
        .post("/api/blogs/me")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newBlog);

      expect(response.statusCode).toBe(201);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.title).toBe(newBlog.title);
      expect(response.body.data.author.toString()).toBe(
        testUser._id.toString()
      );
    });

    it("Should create and assign tags", async () => {
      const newBlog = {
        title: "Blog with Tags",
        description: "This blog has tags.",
        body: "This is the body of the blog with tags.",
        tags: ["newTag1", "newTag2"],
      };

      const response = await request(app)
        .post("/api/blogs/me")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newBlog);

      expect(response.statusCode).toBe(201);
      expect(response.body.data.tags).toBeDefined();
      expect(response.body.data.tags.length).toBe(2);

      const createdTag1 = await Tag.findOne({ name: "newTag1" });
      const createdTag2 = await Tag.findOne({ name: "newTag2" });

      expect(createdTag1).toBeDefined();
      expect(createdTag2).toBeDefined();

      const blogTags = response.body.data.tags.map((tag) => tag.toString());
      expect(blogTags).toContain(createdTag1._id.toString());
      expect(blogTags).toContain(createdTag2._id.toString());
    });

    it("Should update own blog with valid data", async () => {
      const updatedBlog = {
        title: "Updated Blog Title",
        description: "Updated description for the blog.",
        body: "This is the updated body of the blog.",
        tags: ["updatedTag1", "updatedTag2"],
      };

      const response = await request(app)
        .put(`/api/blogs/me/${blogId[0]._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updatedBlog);

      expect(response.statusCode).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.title).toBe(updatedBlog.title);
      expect(response.body.data.description).toBe(updatedBlog.description);
      expect(response.body.data.body).toBe(updatedBlog.body);
    });

    it("Should publish own blog", async () => {
      const response = await request(app)
        .patch(`/api/blogs/me/${blogId[2]._id}/publish`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.state).toBe("published");
    });

    it("Should delete author blog", async () => {
      const response = await request(app)
        .delete(`/api/blogs/me/${blogId[0]._id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Blog deleted successfully");

      const deletedBlog = await Blog.findById(blogId[0]._id);
      expect(deletedBlog).toBeNull();
    });

    it("Should reject update of non-owned blog", async () => {
      const otherUser = new User({
        first_name: "Other",
        last_name: "User",
        email: "other.user@example.com",
        password: "OtherPassword123!",
      });
      await otherUser.save();

      const otherUserBlog = new Blog({
        title: "Other User's Blog",
        description: "This belongs to someone else",
        body: "Content by other user",
        author: otherUser._id,
        state: "published",
        tags: [],
      });
      await otherUserBlog.save();

      const updatedBlog = {
        title: "Updated Blog Title",
        description: "Updated description for the blog.",
        body: "This is the updated body of the blog.",
        tags: ["updatedTag1", "updatedTag2"],
      };

      const response = await request(app)
        .put(`/api/blogs/me/${otherUserBlog._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updatedBlog);

      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe("Blog not found");
    });
  });
});
