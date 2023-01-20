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
  describe("GET /api/topics endpoint", () => {
    it("responds with a status 200 if successful", () => {
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
        throw new Error("Internal Server Error");
      });

      return Promise.all([request(app).get("/api/topics").expect(500)]).then(
        ([res1]) => {
          expect(res1.body.message).toEqual("Internal Server Error");
        }
      );
    });
  });

  describe("GET /api/articles endpoint", () => {
    it("responds with a status 200 if successful", () => {
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
        throw new Error("Internal Server Error");
      });

      return Promise.all([request(app).get("/api/articles").expect(500)]).then(
        ([res1]) => {
          expect(res1.body.message).toEqual("Internal Server Error");
        }
      );
    });
  });

  describe("GET /api/articles/:article_id endpoint", () => {
    it("responds with a status 200 if successful", () => {
      return request(app).get("/api/articles/1").expect(200);
    });
    it("responds with only one article", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((res) => {
          let article = res.body.article;
          expect(article.length).toBe(1);
        });
    });
    it("responds with an article object with the correct properties", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((res) => {
          let article = res.body.article;
          expect(article).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
              }),
            ])
          );
        });
    });
    it("handles variety of ids!", () => {
      return Promise.all([
        request(app).get("/api/articles/2/").expect(200),
        request(app).get("/api/articles/12/").expect(200),
      ]).then(([res1, res2]) => {
        expect(res1.body.article.length).toBe(1);
        expect(res2.body.article.length).toBe(1);
      });
    });
    it("responds with an error code of 404 if the article cannot be found", () => {
      return Promise.all([
        request(app).get("/api/articles/200").expect(404),
      ]).then(([res1]) => {
        expect(res1.body.message).toEqual("Article not found");
      });
    });
    it("responds with an error code of 400 if the id passed in is invalid", () => {
      return Promise.all([
        request(app).get("/api/articles/example").expect(400),
        request(app).get("/api/articles/example1").expect(400),
        request(app).get("/api/articles/{}").expect(400),
        request(app).get("/api/articles/[]").expect(400),
      ]).then(([res1, res2, res3, res4]) => {
        expect(res1.body.message).toEqual("Bad Request: ID must be a number");
        expect(res2.body.message).toEqual("Bad Request: ID must be a number");
        expect(res3.body.message).toEqual("Bad Request: ID must be a number");
        expect(res4.body.message).toEqual("Bad Request: ID must be a number");
      });
    });
    it("responds with an error code of 500 for all of other errors", () => {
      jest.spyOn(db, "query").mockImplementation(() => {
        throw new Error("Internal Server Error");
      });

      return Promise.all([
        request(app).get("/api/articles/1").expect(500),
      ]).then(([res1]) => {
        expect(res1.body.message).toEqual("Internal Server Error");
      });
    });
  });

  describe("GET /api/articles/:article_id/comments endpoint", () => {
    it("responds with a status 200 if successful", () => {
      return request(app).get("/api/articles/1/comments").expect(200);
    });
    it("responds with an array of comments with the correct amount for the id searched", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((res) => {
          let comments = res.body.comments;
          expect(comments.length).toBe(11);
        });
    });
    it("responds with an array of comment objects with the correct properties", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((res) => {
          let comments = res.body.comments;
          expect(comments).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                author: expect.any(String),
                comment_id: expect.any(Number),
                article_id: expect.any(Number),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              }),
            ])
          );
        });
    });
    it("handles variety of ids!", () => {
      return Promise.all([
        request(app).get("/api/articles/9/comments").expect(200),
        request(app).get("/api/articles/3/comments").expect(200),
      ]).then(([res1, res2]) => {
        expect(res1.body.comments.length).toBe(2);
        expect(res2.body.comments.length).toBe(2);
      });
    });
    it("responds with an array of comment objects sorted descending by created_at (newest comment first)", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((res) => {
          let comments = res.body.comments;
          expect(comments).toBeSortedBy("created_at", { descending: true });
        });
    });
    it("responds with an error code of 404 if no comments can be found with article_id value", () => {
      return Promise.all([
        request(app).get("/api/articles/200/comments").expect(404),
      ]).then(([res1]) => {
        expect(res1.body.message).toEqual(
          "No comments found with matching article ID"
        );
      });
    });
    it("responds with an error code of 400 if the id passed in is invalid", () => {
      return Promise.all([
        request(app).get("/api/articles/example/comments").expect(400),
        request(app).get("/api/articles/example1/comments").expect(400),
        request(app).get("/api/articles/{}/comments").expect(400),
        request(app).get("/api/articles/[]/comments").expect(400),
      ]).then(([res1, res2, res3, res4]) => {
        expect(res1.body.message).toEqual("Bad Request: ID must be a number");
        expect(res2.body.message).toEqual("Bad Request: ID must be a number");
        expect(res3.body.message).toEqual("Bad Request: ID must be a number");
        expect(res4.body.message).toEqual("Bad Request: ID must be a number");
      });
    });
    it("responds with an error code of 500 for all of other errors", () => {
      jest.spyOn(db, "query").mockImplementation(() => {
        throw new Error("Internal Server Error");
      });

      return Promise.all([
        request(app).get("/api/articles/1/comments").expect(500),
      ]).then(([res1]) => {
        expect(res1.body.message).toEqual("Internal Server Error");
      });
    });
  });

  describe("POST /api/articles/:article_id/comments endpoint", () => {
    const testComment = {
      username: "lurker",
      body: "I am not crazy! I know he swapped those numbers! I knew it was 1216. One after Magna Carta. As if I could ever make such a mistake. Never. Never! I just - I just couldn't prove it. He - he covered his tracks, he got that idiot at the copy shop to lie for him. You think this is something? You think this is bad? This? This chicanery? He's done worse. That billboard! Are you telling me that a man just happens to fall like that? No! He orchestrated it! Jimmy! He defecated through a sunroof! And I saved him! And I shouldn't have. I took him into my own firm! What was I thinking? He'll never change. He'll never change! Ever since he was 9, always the same! Couldn't keep his hands out of the cash drawer! But not our Jimmy! Couldn't be precious Jimmy! Stealing them blind! And he gets to be a lawyer!? What a sick joke! I should've stopped him when I had the chance! And you - you have to stop him! You-",
    };
    it("responds with a status 201 if successful", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send(testComment)
        .expect(201);
    });
    it("responds with the posted comment", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send(testComment)
        .expect(201)
        .then((res) => {
          let comment = res.body;
          expect(comment).toEqual(
            expect.objectContaining({
              author: testComment.username,
              comment_id: expect.any(Number),
              article_id: 1,
              body: testComment.body,
              created_at: expect.any(String),
              votes: 0,
            })
          );
        });
    });
    it("actually adds the comment to the database", () => {
      return request(app)
        .post("/api/articles/3/comments")
        .send(testComment)
        .expect(201)
        .then((comment) => {
          return request(app)
            .get("/api/articles/3/comments")
            .expect(200)
            .then((res) => {
              const comments = res.body.comments;
              expect(comments[0]).toEqual(
                expect.objectContaining({
                  author: testComment.username,
                  comment_id: comment.body.comment_id,
                  article_id: 3,
                  body: testComment.body,
                  created_at: expect.any(String),
                  votes: 0,
                })
              );
            });
        });
    });

    it("handles variety of ids!", () => {
      return Promise.all([
        request(app)
          .post("/api/articles/9/comments")
          .send(testComment)
          .expect(201),
        request(app)
          .post("/api/articles/11/comments")
          .send(testComment)
          .expect(201),
      ]).then(([newComment1, newComment2]) => {
        return Promise.all([
          request(app).get("/api/articles/9/comments").expect(200),
          request(app).get("/api/articles/11/comments").expect(200),
        ]).then(([res1, res2]) => {
          const comments1 = res1.body.comments;
          const comments2 = res2.body.comments;
          expect(comments1[0]).toEqual(
            expect.objectContaining({
              author: testComment.username,
              comment_id: newComment1.body.comment_id,
              article_id: 9,
              body: testComment.body,
              created_at: expect.any(String),
              votes: 0,
            })
          );
          expect(comments2[0]).toEqual(
            expect.objectContaining({
              author: testComment.username,
              comment_id: newComment2.body.comment_id,
              article_id: 11,
              body: testComment.body,
              created_at: expect.any(String),
              votes: 0,
            })
          );
        });
      });
    });
    it("responds with an error code of 404 and appropriate message if article_id passed in for new comment does not exist", () => {
      return Promise.all([
        request(app)
          .post("/api/articles/200/comments")
          .send(testComment)
          .expect(404),
      ]).then(([res1]) => {
        expect(res1.body.message).toEqual(
          "Cannot post comment to article that does not exist"
        );
      });
    });
    it("responds with an error code of 400 and appropriate message if the id passed in is invalid", () => {
      return Promise.all([
        request(app)
          .post("/api/articles/example/comments")
          .send(testComment)
          .expect(400),
        request(app)
          .post("/api/articles/example1/comments")
          .send(testComment)
          .expect(400),
        request(app)
          .post("/api/articles/{}/comments")
          .send(testComment)
          .expect(400),
        request(app)
          .post("/api/articles/[]/comments")
          .send(testComment)
          .expect(400),
      ]).then(([res1, res2, res3, res4]) => {
        expect(res1.body.message).toEqual("Bad Request: ID must be a number");
        expect(res2.body.message).toEqual("Bad Request: ID must be a number");
        expect(res3.body.message).toEqual("Bad Request: ID must be a number");
        expect(res4.body.message).toEqual("Bad Request: ID must be a number");
      });
    });
    it("responds with an error code of 400 and appropriate message if request is incorrectly formatted", () => {
      const incorrectComment = "username: 'lurker', body: 'hello world'";
      return request(app)
        .post("/api/articles/1/comments")
        .send(incorrectComment)
        .expect(400)
        .then((res) => {
          expect(res.body.message).toEqual(
            "Bad Request: Missing username/body or request formatted incorrectly"
          );
        });
    });
    it("responds with an error code of 400 and appropriate message if username/body/both are not present", () => {
      let incorrectComment = {
        pizza: "yummy",
        sleep: false,
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(incorrectComment)
        .expect(400)
        .then((res) => {
          expect(res.body.message).toEqual(
            "Bad Request: Missing username/body or request formatted incorrectly"
          );
        })
        .then(() => {
          incorrectComment = {
            pizza: "yummy",
            body: "fizzy lifting drinks",
          };
          return request(app)
            .post("/api/articles/1/comments")
            .send(incorrectComment)
            .expect(400)
            .then((res) => {
              expect(res.body.message).toEqual(
                "Bad Request: Missing username/body or request formatted incorrectly"
              );
            });
        })
        .then(() => {
          incorrectComment = {
            username: "lurker",
            kitties: "cuddly",
          };
          return request(app)
            .post("/api/articles/1/comments")
            .send(incorrectComment)
            .expect(400)
            .then((res) => {
              expect(res.body.message).toEqual(
                "Bad Request: Missing username/body or request formatted incorrectly"
              );
            });
        });
    });

    it("ignores erroneous properties, but still processes the request using correct properties", () => {
      let acceptableComment = {
        username: "lurker",
        cool: false,
        likes: "making tests",
        body: "Posting in a legendary thread!",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(acceptableComment)
        .expect(201)
        .then((comment) => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then((res) => {
              const comments = res.body.comments;
              expect(comments[0]).toEqual(
                expect.objectContaining({
                  author: acceptableComment.username,
                  comment_id: comment.body.comment_id,
                  article_id: 1,
                  body: acceptableComment.body,
                  created_at: expect.any(String),
                  votes: 0,
                })
              );
            });
        });
    });

    it("responds with an error code of 500 for all of other errors", () => {
      jest.spyOn(db, "query").mockImplementation(() => {
        throw new Error("Internal Server Error");
      });

      return Promise.all([
        request(app)
          .post("/api/articles/1/comments")
          .send(testComment)
          .expect(500),
      ]).then(([res]) => {
        expect(res.body.message).toEqual("Internal Server Error");
      });
    });
  });

  describe("PATCH /api/articles/:article_id endpoint", () => {
    const testVote = {
      inc_votes: 1,
    };
    it("responds with a status 200 if successful", () => {
      return request(app).patch("/api/articles/1/").send(testVote).expect(200);
    });
    it("responds with the updated article", () => {
      return request(app)
        .patch("/api/articles/1/")
        .send(testVote)
        .expect(200)
        .then((res) => {
          const article = res.body.article;
          expect(article).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
              }),
            ])
          );
        });
    });
    it("actually updates the article", () => {
      return request(app)
        .patch("/api/articles/1/")
        .send(testVote)
        .expect(200)
        .then(() => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then((res) => {
              const article = res.body.article;
              expect(article[0].votes).toEqual(101);
            });
        });
    });
    it("handles negative votes correctly", () => {
      const negativeVote = {
        inc_votes: -1,
      };
      return request(app)
        .patch("/api/articles/1/")
        .send(negativeVote)
        .expect(200)
        .then(() => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then((res) => {
              const article = res.body.article;
              expect(article[0].votes).toEqual(99);
            });
        });
    });
    it("handles negative vote totals correctly (IN THE DATABASE)", () => {
      const negativeVote = {
        inc_votes: -101,
      };
      return request(app)
        .patch("/api/articles/1")
        .send(negativeVote)
        .expect(200)
        .then(() => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then((res) => {
              const article = res.body.article;
              expect(article[0].votes).toEqual(-1);
            });
        });
    });
    it("responds with an error code of 404 and appropriate message if article_id passed in for patch does not exist", () => {
      return Promise.all([
        request(app).patch("/api/articles/200").send(testVote).expect(404),
      ]).then(([res1]) => {
        expect(res1.body.message).toEqual(
          "Cannot edit votes of article that does not exist"
        );
      });
    });
    it("responds with an error code of 400 and appropriate message if the id passed in is invalid", () => {
      return Promise.all([
        request(app).patch("/api/articles/hello").send(testVote).expect(400),
        request(app).patch("/api/articles/hello1").send(testVote).expect(400),
        request(app).patch("/api/articles/{}").send(testVote).expect(400),
        request(app).patch("/api/articles/[]").send(testVote).expect(400),
      ]).then(([res1, res2, res3, res4]) => {
        expect(res1.body.message).toEqual("Bad Request: ID must be a number");
        expect(res2.body.message).toEqual("Bad Request: ID must be a number");
        expect(res3.body.message).toEqual("Bad Request: ID must be a number");
        expect(res4.body.message).toEqual("Bad Request: ID must be a number");
      });
    });
    it("responds with an error code of 400 and appropriate message if request is formatted incorrectly", () => {
      const incorrectVote = "inc_votes: 1";
      return request(app)
        .patch("/api/articles/1")
        .send(incorrectVote)
        .expect(400)
        .then((res) => {
          expect(res.body.message).toEqual(
            "Bad Request: Missing vote increment amount or request formatted incorrectly"
          );
        });
    });
    it("responds with an error code of 400 and appropriate message if inc_votes property is not present", () => {
      const incorrectVote = {
        pizza: "yummy",
      };
      return request(app)
        .patch("/api/articles/1")
        .send(incorrectVote)
        .expect(400)
        .then((res) => {
          expect(res.body.message).toEqual(
            "Bad Request: Missing vote increment amount or request formatted incorrectly"
          );
        });
    });
    it("ignores erroneous properties, but still processes the request using correct properties", () => {
      let acceptableVote = {
        pizza: "yummy",
        cool: false,
        likes: "making tests",
        inc_votes: 1,
      };
      return request(app)
        .patch("/api/articles/1/")
        .send(acceptableVote)
        .expect(200)
        .then(() => {
          return request(app)
            .get("/api/articles/1/")
            .expect(200)
            .then((res) => {
              const article = res.body.article;
              expect(article[0]).toEqual(
                expect.objectContaining({
                  article_id: 1,
                  title: "Living in the shadow of a great man",
                  topic: "mitch",
                  author: "butter_bridge",
                  body: "I find this existence challenging",
                  created_at: expect.any(String),
                  votes: 101,
                  article_img_url: expect.any(String),
                })
              );
            });
        });
    });

    it("responds with an error code of 500 for all of other errors", () => {
      jest.spyOn(db, "query").mockImplementation(() => {
        throw new Error("Internal Server Error");
      });

      return Promise.all([
        request(app).patch("/api/articles/1").send(testVote).expect(500),
      ]).then(([res]) => {
        expect(res.body.message).toEqual("Internal Server Error");
      });
    });
  });

  describe("GET /api/users endpoint", () => {
    it("responds with a status 200 if successful", () => {
      return request(app).get("/api/users").expect(200);
    });
    it("responds with an array of user objects", () => {
      return request(app)
        .get("/api/users")
        .then((res) => {
          let users = res.body.users;
          expect(users).toBeInstanceOf(Array);
        });
    });
    it("responds with an array of user objects with the correct length", () => {
      return request(app)
        .get("/api/users")
        .then((res) => {
          let users = res.body.users;
          expect(users.length).toBe(4);
        });
    });
    it("responds with an array of user objects with expected properties and values", () => {
      return request(app)
        .get("/api/users")
        .then((res) => {
          let users = res.body.users;
          expect(users).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              }),
            ])
          );
        });
    });
    it("responds with a status 500 when an issue occurs", () => {
      jest.spyOn(db, "query").mockImplementation(() => {
        throw new Error("Internal Server Error");
      });

      return Promise.all([request(app).get("/api/users").expect(500)]).then(
        ([res1]) => {
          expect(res1.body.message).toEqual("Internal Server Error");
        }
      );
    });
  });

  describe("GET /api/articles endpoint (now with queries!)", () => {
    it("handles a 'topic' filter as a query", () => {
      return request(app).get("/api/articles?topic=mitch").expect(200);
    });
    it("only returns matching topic articles when using topic filter", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then((res) => {
          const articles = res.body.articles;
          articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });
    it("handles an 'author' filter as a query", () => {
      return request(app).get("/api/articles?author=icellusedkars").expect(200);
    });
    it("only returns matching author articles when using author filter", () => {
      return request(app)
        .get("/api/articles?author=icellusedkars")
        .expect(200)
        .then((res) => {
          const articles = res.body.articles;
          articles.forEach((article) => {
            expect(article.author).toBe("icellusedkars");
          });
        });
    });
    it("handles both filters simultaneously and returns a correctly double filtered result!", () => {
      return request(app)
        .get("/api/articles?author=rogersop&topic=cats")
        .expect(200)
        .then((res) => {
          const articles = res.body.articles;
          articles.forEach((article) => {
            expect(article.author).toBe("rogersop"),
              expect(article.topic).toBe("cats");
          });
        });
    });
    it("handles a 'sort_by' query that sorts articles by any valid column", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then((res) => {
          const articles = res.body.articles;
          expect(articles).toBeSortedBy("title", { descending: true });
        });
    });
    it("responds with an error code of 400 and appropriate message if invalid column is passed through", () => {
      return request(app)
        .get("/api/articles?sort_by=pizza")
        .expect(400)
        .then((res) => {
          expect(res.body.message).toBe("Invalid sort category");
        });
    });
    it("handles an 'order' query that allows to sort articles by either ascending or descending", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then((res) => {
          const articles = res.body.articles;
          expect(articles).toBeSortedBy("created_at", { ascending: true });
        });
    });
    it("responds with an error code of 400 and appropriate message if invalid order is passed through", () => {
      return request(app)
        .get("/api/articles?order=pizza")
        .expect(400)
        .then((res) => {
          expect(res.body.message).toBe(
            "Invalid sort order (must be 'asc' or 'desc')"
          );
        });
    });
    it("allows simultaneous 'sort_by' and 'order_by' queries", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=asc")
        .expect(200)
        .then((res) => {
          const articles = res.body.articles;
          expect(articles).toBeSortedBy("title", { ascending: true });
        });
    });
    it("allows simultaneous use of all queries (chaos ensues)", () => {
      return request(app)
        .get(
          "/api/articles?sort_by=article_id&order=asc&author=icellusedkars&topic=mitch"
        )
        .expect(200)
        .then((res) => {
          const articles = res.body.articles;
          expect(articles).toBeSortedBy("article_id", { ascending: true }),
            articles.forEach((article) => {
              expect(article.author).toBe("icellusedkars"),
                expect(article.topic).toBe("mitch");
            });
        });
    });
  });

  describe("GET /api/articles/:article_id (now with comment count!)", () => {
    it("responds with a comment_count property", () => {
      return request(app)
        .get("/api/articles/1")
        .then((res) => {
          let article = res.body.article;
          expect(article[0]).toHaveProperty("comment_count");
        });
    });
    it("responds with the correct comment count", () => {
      return request(app)
        .get("/api/articles/1")
        .then((res) => {
          let article = res.body.article;
          expect(article[0].comment_count).toBe(11);
        });
    });
  });
  describe("DELETE /api/comments/:comment_id endpoint", () => {
    it("responds with a status 204 no content on successful deletion", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });
    it("actually actually delete the comment", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(() => {
          return request(app)
            .get("/api/articles/9/comments")
            .expect(200)
            .then((res) => {
              const comments = res.body.comments;
              expect(comments.length).toBeGreaterThan(0),
                comments.forEach((comment) => {
                  expect(comment.comment_id).not.toBe(1);
                });
            });
        });
    });
    it("responds with an error code of 404 and appropriate error message if no comment is found with provided comment_id", () => {
      return request(app)
        .delete("/api/comments/99")
        .expect(404)
        .then((res) => {
          expect(res.body.message).toBe(
            "Cannot delete comment that does not exist"
          );
        });
    });

    it("responds with an error code of 400 and appropriate error message if the id passed in is invalid", () => {
      return Promise.all([
        request(app).delete("/api/comments/example").expect(400),
        request(app).delete("/api/comments/example1").expect(400),
        request(app).delete("/api/comments/[]").expect(400),
        request(app).delete("/api/comments/{}").expect(400),
      ]).then(([res1, res2, res3, res4]) => {
        expect(res1.body.message).toEqual("Bad Request: ID must be a number");
        expect(res2.body.message).toEqual("Bad Request: ID must be a number");
        expect(res3.body.message).toEqual("Bad Request: ID must be a number");
        expect(res4.body.message).toEqual("Bad Request: ID must be a number");
      });
    });
  });
});
