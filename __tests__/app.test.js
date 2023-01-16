const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => db.end());

describe("app", () => {
  describe("GET /api/topics", () => {
    it("responds with a status 200", () => {
      return request(app).get("/api/topics").expect(200);
    });
    it("responds with an array of topic objects", () => {
      return request(app)
        .get("/api/topics")
        .then((res) => {
          let topics = res.body.topics;
          expect(topics).toBeInstanceOf(Array);
        });
    });
    it("responds with an array of topic objects with the correct length", () => {
      return request(app)
        .get("/api/topics")
        .then((res) => {
          let topics = res.body.topics;
          expect(topics.length).toBe(3);
        });
    });
    it("responds with an array of topic objects with expected properties and values", () => {
      return request(app)
        .get("/api/topics")
        .then((res) => {
          let topics = res.body.topics;
          expect(topics).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              }),
            ])
          );
        });
    });
    it("responds with a status 500 when an issue occurs", () => {
      jest.spyOn(db, "query").mockImplementation(() => {
        throw new Error("Mocked database error");
      });

      return request(app).get("/api/topics").expect(500);
    });
  });
});
