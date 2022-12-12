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
