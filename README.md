# News site api

## Link to live version:

https://news-site-backend.onrender.com/

---

## Summary

This project provides a backend to a news site that allows a user to to view articles, comments, and registered users from a database.
The project is written using `express.js` and `postgresql`. Tests are written in `jest`

It includes support for:

- Viewing articles by Id
- Viewing a list of all articles
- Sorting articles by title, topic, author, body, created_at, votes, comment count, and article_id in ascending or descending order
- Updating an article's vote count
- Viewing a list of topics
- Viewing comments by article Id
- Posting a new comment to an article
- Deleting a comment by comment Id
- Viewing a list of all registered users
- Viewing a specific user's information by username

## Setup instructions

### Getting started

1.  `git clone https://github.com/JoeDGit/news-site-backend`
2.  run `npm install` to install the project dependencies.
3.  Create two .env files in the root directory `.env.test` and `.env.development`
4.  Add `PGDATABASE=nc_news_test` to the `.env.test` file and `PGDATABASE=nc_news` to the `.env.development` file.
5.  Setup the databases using the command `npm run setup-dbs`
6.  The test database will be seeded with test data every time the test suite runs. To seed the development database with development data run `npm run seed`
7.  To run tests use the command `npm test`

---

## Minimum versions

The minimum version of `Node.js` is `>= 18.11.0` and the minimum version of `Postgres` is `>=12.12`
