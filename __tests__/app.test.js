const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => {
  return seed(testData);
});

afterEach(() => {
  jest.restoreAllMocks();
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
  describe("GET /api/articles", () => {
    it("responds with a status 200", () => {
      return request(app).get("/api/articles").expect(200);
    });
    it("responds with an array of article objects", () => {
      return request(app)
        .get("/api/articles")
        .then((res) => {
          let articles = res.body.articles;
          expect(articles).toBeInstanceOf(Array);
        });
    });
    it("responds with an array of article objects with the correct length", () => {
      return request(app)
        .get("/api/articles")
        .then((res) => {
          let articles = res.body.articles;
          expect(articles.length).toBe(12);
        });
    });
    it("responds with an array of article objects with expected properties and values", () => {
      return request(app)
        .get("/api/articles")
        .then((res) => {
          let articles = res.body.articles;
          expect(articles).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(Number),
              }),
            ])
          );
        });
    });
    it("has an accurate comment count!", () => {
      return request(app)
        .get("/api/articles")
        .then((res) => {
          let articles = res.body.articles;
          expect(articles[5].comment_count).toBe(11);
        });
    });
    it("responds with an array of objects sorted by created_at in descending order (newest first)", () => {
      return request(app)
        .get("/api/articles")
        .then((res) => {
          let articles = res.body.articles;
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
    it("responds with a status 500 when an issue occurs", () => {
      jest.spyOn(db, "query").mockImplementation(() => {
        throw new Error("Mocked database error");
      });

      return request(app).get("/api/articles").expect(500);
    });
  });
});
