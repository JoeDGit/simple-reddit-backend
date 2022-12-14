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

describe("GET /api/articles/:article_id/comments", () => {
  test("status: 200, should return an array of comments for the given article Id, each with specified properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  test("status: 200, should return an empty array when an article has no comments", () => {
    return request(app)
      .get("/api/articles/7/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments).toHaveLength(0);
      });
  });
  test("status: 400, should return bad request when user tries to access comments for an invalid articleId", () => {
    return request(app)
      .get("/api/articles/ng3o253/comments")
      .expect(400)
      .then((response) => {
        const error = response.body.msg;
        expect(error).toBe("400 Error - Bad Request");
      });
  });
  test("status: 404, should return not found when user tries to access comments for an articleId that does not exist", () => {
    return request(app)
      .get("/api/articles/10101010/comments")
      .expect(404)
      .then((response) => {
        const error = response.body.msg;
        expect(error).toBe(
          "404 Error - An article with ID 10101010 does not exist"
        );
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("status: 201, should post an object to comments with the specified properties", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "butter_bridge", body: "Hello world" })
      .expect(201)
      .then((response) => {
        const comment = response.body;
        expect(comment).toEqual(
          expect.objectContaining({
            comment: "Hello world",
          })
        );
      })
      .then(() => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(200)
          .then((response) => {
            expect(response.body.comments).toHaveLength(1);
          });
      });
  });
  test("status: 400, should return bad request when body is missing required fields", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ body: "Hello world" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("400 Error - Bad Request");
      });
  });
  test("status: 400, should return bad request when user tries to post a comment to an invalid article id", () => {
    return request(app)
      .post("/api/articles/2wqte/comments")
      .send({ username: "butter_bridge", body: "Hello world" })
      .expect(400)
      .then((response) => {
        const error = response.body.msg;
        expect(error).toBe("400 Error - Bad Request");
      });
  });

  test("status: 404, should return not found when user tries to post a comment to an article that does not exist ", () => {
    return request(app)
      .post("/api/articles/200000/comments")
      .send({ username: "butter_bridge", body: "Hello world" })
      .expect(404)
      .then((response) => {
        const error = response.body.msg;
        expect(error).toBe("path not found");
      });
  });
  test("status: 404, should return not found when a post request is made by a user not in the database", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "JoeDGit", body: "Hello world" })
      .expect(404)
      .then((response) => {
        const error = response.body.msg;
        expect(error).toBe("path not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("status: 200, should increase an articles votes returning the updated object when passed a positive number", () => {
    return request(app)
      .patch("/api/articles/3/")
      .send({ inc_votes: 5 })
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 3,
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            author: "icellusedkars",
            body: "some gifs",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 5,
          })
        );
      });
  });
  test("status: 200, decrease an articles votes returning the updated object when passed a negative number", () => {
    return request(app)
      .patch("/api/articles/1/")
      .send({ inc_votes: -100 })
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 0,
          })
        );
      });
  });
  test("status: 400, should return bad request when user tries update votes on an invalid article id", () => {
    return request(app)
      .patch("/api/articles/jwqte/")
      .send({ inc_votes: 20 })
      .expect(400)
      .then((response) => {
        const error = response.body.msg;
        expect(error).toBe("400 Error - Bad Request");
      });
  });
  test("status: 400, should return bad request when user enters a malformed body", () => {
    return request(app)
      .patch("/api/articles/1/")
      .send({})
      .expect(400)
      .then((response) => {
        const error = response.body.msg;
        expect(error).toBe("400 Error - Bad Request");
      });
  });
  test("status: 400, should return bad request when user enters an incorrect data type in the request body", () => {
    return request(app)
      .patch("/api/articles/1/")
      .send({ inc_votes: "hello" })
      .expect(400)
      .then((response) => {
        const error = response.body.msg;
        expect(error).toBe("400 Error - Bad Request");
      });
  });
  test("status: 404, should return path not found when user tries to update votes on an article that does not exist ", () => {
    return request(app)
      .patch("/api/articles/200000/")
      .send({ inc_votes: 20 })
      .expect(404)
      .then((response) => {
        const error = response.body.msg;
        expect(error).toBe(
          "404 Error - An article with ID 200000 does not exist"
        );
      });
  });
});
