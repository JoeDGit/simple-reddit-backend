const request = require('supertest');
const app = require('../app');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');

afterAll(() => db.end());

beforeEach(() => seed(testData));

describe('General API Errors', () => {
  test('status: 404, should return a 404 error when a user tries to access an invalid path', () => {
    return request(app)
      .get('/api/badpath')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toEqual('path not found');
      });
  });
});
describe('GET /api', () => {
  test('status: 200, should return information regarding each endpoing in the api', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then((response) => {
        const apiInfo = require('../endpoints.json');

        expect(response.body).toEqual(apiInfo);
      });
  });
});
describe('GET /api/topics', () => {
  test('status: 200, should respond with an array of topic objects with slug and description properties ', () => {
    return request(app)
      .get('/api/topics')
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

describe('GET /api/articles', () => {
  test('status: 200, should respond with an array of article objects, each with specific properties', () => {
    return request(app)
      .get('/api/articles')
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

  test('should return the articles sorted by date in descending order', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeSortedBy('created_at', {
          descending: true,
        });
      });
  });
});

describe('GET /api/articles queries', () => {
  test('status: 200, should accept a query: topic, filtering articles by the topic value provided', () => {
    return request(app)
      .get('/api/articles?topic=cats')
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toHaveLength(1);
      });
  });
  test('status: 200, should sort articles by date by default ', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeSortedBy(articles.created_at, {
          descending: true,
        });
      });
  });
  test('status: 200, should accept a query: sort_by that allows a user to sort articles by any valid column ', () => {
    return request(app)
      .get('/api/articles?sort_by=author')
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeSortedBy(articles.author, {
          descending: true,
        });
      });
  });
  test('status: 200, should sort queries by descending by default', () => {
    return request(app)
      .get('/api/articles?sort_by=author')
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeSortedBy(articles.author, {
          descending: true,
        });
      });
  });
  test('status: 200, should accept a query order that allows the user change the sort order', () => {
    return request(app)
      .get('/api/articles?sort_by=author&order=asc')
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeSortedBy(articles.author);
      });
  });

  test('status: 200, should allow for mixed case queries', () => {
    return request(app)
      .get('/api/articles?toPic=miTCh&soRt_by=AuTHor&order=Asc')
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toHaveLength(11);
        expect(articles).toBeSortedBy(articles.author);
      });
  });

  test('status: 400, should return bad request when user tries to filter by an invalid topic ', () => {
    return request(app)
      .get('/api/articles?topic=hats')
      .expect(400)
      .then((response) => {
        const error = response.body.msg;
        expect(error).toBe('bad request - invalid topic');
      });
  });
  test('status: 400, should return bad request when a user tries to sort_by an invalid column', () => {
    return request(app)
      .get('/api/articles?topic=cats&sort_by=goiejkioe')
      .expect(400)
      .then((response) => {
        const error = response.body.msg;
        expect(error).toBe('bad request - cannot sort results by that column');
      });
  });
  test('status: 400, should return bad request when a user tries to order the results by an invalid value', () => {
    return request(app)
      .get('/api/articles?topic=cats&sort_by=author&order=up')
      .expect(400)
      .then((response) => {
        const error = response.body.msg;
        expect(error).toBe('bad request - invalid sort order');
      });
  });
});

describe('GET /api/articles/:article_id', () => {
  test('status: 200, should return a single object with specified properties', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 1,
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: '11',
          })
        );
      });
  });
  test('status: 400, should return bad request when user tries to enter an invalid articleId', () => {
    return request(app)
      .get('/api/articles/9jieqio')
      .expect(400)
      .then((response) => {
        const error = response.body.msg;
        expect(error).toBe('400 Error - Bad Request');
      });
  });
  test('status: 404, should return not found when user tries to access an articleId that does not exist', () => {
    return request(app)
      .get('/api/articles/999999')
      .expect(404)
      .then((response) => {
        const error = response.body.msg;
        expect(error).toBe(
          '404 Error - An article with ID 999999 does not exist'
        );
      });
  });
});

describe('GET /api/articles/:article_id/comments', () => {
  test('status: 200, should return an array of comments for the given article Id, each with specified properties', () => {
    return request(app)
      .get('/api/articles/1/comments')
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
  test('status: 200, should return an empty array when an article has no comments', () => {
    return request(app)
      .get('/api/articles/7/comments')
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments).toHaveLength(0);
      });
  });
  test('status: 400, should return bad request when user tries to access comments for an invalid articleId', () => {
    return request(app)
      .get('/api/articles/ng3o253/comments')
      .expect(400)
      .then((response) => {
        const error = response.body.msg;
        expect(error).toBe('400 Error - Bad Request');
      });
  });
  test('status: 404, should return not found when user tries to access comments for an articleId that does not exist', () => {
    return request(app)
      .get('/api/articles/10101010/comments')
      .expect(404)
      .then((response) => {
        const error = response.body.msg;
        expect(error).toBe(
          '404 Error - An article with ID 10101010 does not exist'
        );
      });
  });
});

describe('POST /api/articles/:article_id/comments', () => {
  test('status: 201, should post an object to comments with the specified properties', () => {
    return request(app)
      .post('/api/articles/2/comments')
      .send({ username: 'butter_bridge', body: 'Hello world' })
      .expect(201)
      .then((response) => {
        const comment = response.body;
        expect(comment).toEqual(
          expect.objectContaining({
            comment: 'Hello world',
          })
        );
      })
      .then(() => {
        return request(app)
          .get('/api/articles/2/comments')
          .expect(200)
          .then((response) => {
            expect(response.body.comments).toHaveLength(1);
          });
      });
  });
  test('status: 400, should return bad request when body is missing required fields', () => {
    return request(app)
      .post('/api/articles/2/comments')
      .send({ body: 'Hello world' })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('400 Error - Bad Request');
      });
  });
  test('status: 400, should return bad request when user tries to post a comment to an invalid article id', () => {
    return request(app)
      .post('/api/articles/2wqte/comments')
      .send({ username: 'butter_bridge', body: 'Hello world' })
      .expect(400)
      .then((response) => {
        const error = response.body.msg;
        expect(error).toBe('400 Error - Bad Request');
      });
  });

  test('status: 404, should return not found when user tries to post a comment to an article that does not exist ', () => {
    return request(app)
      .post('/api/articles/200000/comments')
      .send({ username: 'butter_bridge', body: 'Hello world' })
      .expect(404)
      .then((response) => {
        const error = response.body.msg;
        expect(error).toBe('path not found');
      });
  });
  test('status: 404, should return not found when a post request is made by a user not in the database', () => {
    return request(app)
      .post('/api/articles/2/comments')
      .send({ username: 'JoeDGit', body: 'Hello world' })
      .expect(404)
      .then((response) => {
        const error = response.body.msg;
        expect(error).toBe('path not found');
      });
  });
});

describe('PATCH /api/articles/:article_id', () => {
  test('status: 200, should increase an articles votes returning the updated object when passed a positive number', () => {
    return request(app)
      .patch('/api/articles/3/')
      .send({ inc_votes: 5 })
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 3,
            title: 'Eight pug gifs that remind me of mitch',
            topic: 'mitch',
            author: 'icellusedkars',
            body: 'some gifs',
            created_at: '2020-11-03T09:12:00.000Z',
            votes: 5,
          })
        );
      });
  });
  test('status: 200, decrease an articles votes returning the updated object when passed a negative number', () => {
    return request(app)
      .patch('/api/articles/1/')
      .send({ inc_votes: -100 })
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 0,
          })
        );
      });
  });
  test('status: 400, should return bad request when user tries update votes on an invalid article id', () => {
    return request(app)
      .patch('/api/articles/jwqte/')
      .send({ inc_votes: 20 })
      .expect(400)
      .then((response) => {
        const error = response.body.msg;
        expect(error).toBe('400 Error - Bad Request');
      });
  });
  test('status: 400, should return bad request when user enters a malformed body', () => {
    return request(app)
      .patch('/api/articles/1/')
      .send({})
      .expect(400)
      .then((response) => {
        const error = response.body.msg;
        expect(error).toBe('400 Error - Bad Request');
      });
  });
  test('status: 400, should return bad request when user enters an incorrect data type in the request body', () => {
    return request(app)
      .patch('/api/articles/1/')
      .send({ inc_votes: 'hello' })
      .expect(400)
      .then((response) => {
        const error = response.body.msg;
        expect(error).toBe('400 Error - Bad Request');
      });
  });
  test('status: 404, should return path not found when user tries to update votes on an article that does not exist ', () => {
    return request(app)
      .patch('/api/articles/200000/')
      .send({ inc_votes: 20 })
      .expect(404)
      .then((response) => {
        const error = response.body.msg;
        expect(error).toBe(
          '404 Error - An article with ID 200000 does not exist'
        );
      });
  });
});

describe('GET /api/users', () => {
  test('status: 200, should return an array of objects with the specified properties', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then((response) => {
        const users = response.body.users;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe('DELETE /api/comments/:comment_id', () => {
  test('status: 204, should delete the given comment by comment_id and return status 204 no content', () => {
    return request(app)
      .delete('/api/comments/2')
      .expect(204)
      .then((response) => {
        expect(response.status).toEqual(204);
      });
  });

  test('status: 400, should return 400 - bad request when user enters an invalid comment id', () => {
    return request(app)
      .delete('/api/comments/hello')
      .expect(400)
      .then((response) => {
        const error = response.body.msg;
        expect(error).toBe('bad request - invalid comment ID');
      });
  });

  test('status: 404, Should return 404 - comment not found when passed a non-existent but valid comment id', () => {
    return request(app)
      .delete('/api/comments/10000')
      .expect(404)
      .then((response) => {
        const error = response.body.msg;
        expect(error).toBe(
          '404 Error - A comment with ID: 10000 does not exist'
        );
      });
  });
});
