const request = require("supertest");
const app = require("../app");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

afterAll(() => db.end());

beforeEach(() => seed(testData));

describe("General API Errors", () => {
  test("status: 404, should return a 404 error when a user tries to access an invalid path", () => {
    return request(app)
      .get("/api/badpath")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toEqual("path not found");
      });
  });
});
describe("GET /api/topics", () => {
  test("status: 200, should respond with an array of topic objects with slug and description properties ", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topics = response.body.topics;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("status: 200, should respond with an array of article objects, each with specific properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
              article_id: expect.any(Number),
            })
          );
        });
      });
  });

  test("should return the articles sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("status: 200, should return a single object with specified properties", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 2,
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
  test("status: 400, should return bad request when user tries to enter an invalid articleId", () => {
    return request(app)
      .get("/api/articles/9jieqio")
      .expect(400)
      .then((response) => {
        const error = response.body.msg;
        expect(error).toBe("400 Error - Bad Request");
      });
  });
  test("status: 404, should return not found when user tries to access an articleId that does not exist", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then((response) => {
        const error = response.body.msg;
        expect(error).toBe(
          "404 Error - An article with ID 999999 does not exist"
        );
      });
  });
});
