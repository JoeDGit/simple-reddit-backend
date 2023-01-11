const db = require('../db/connection');

exports.selectArticles = (topic, sort_by = 'created_at', order = 'desc') => {
  return db.query(`SELECT DISTINCT topic FROM articles`).then((topics) => {
    const validTopicQueries = topics.rows.map((topic) => topic.topic);
    const validSortByQueries = [
      'title',
      'topic',
      'author',
      'body',
      'created_at',
      'votes',
      'comment_count',
    ];
    const validOrderQueries = ['asc', 'desc'];
    const queryValues = [];
    if (!validOrderQueries.includes(order)) {
      return Promise.reject({
        status: 400,
        msg: 'bad request - invalid sort order',
      });
    }
    if (!validSortByQueries.includes(sort_by)) {
      return Promise.reject({
        status: 400,
        msg: 'bad request - cannot sort results by that column',
      });
    }
    if (topic && !validTopicQueries.includes(topic)) {
      return Promise.reject({
        status: 400,
        msg: 'bad request - invalid topic',
      });
    }

    let SQL = `
SELECT articles.*, COUNT(comments.article_id) AS comment_count
FROM articles
LEFT JOIN comments ON comments.article_id = articles.article_id`;

    if (topic) {
      SQL += ` WHERE topic = $1`;
      queryValues.push(topic);
    }

    SQL += ` GROUP BY articles.article_id
ORDER BY ${sort_by} ${order}`;

    return db.query(SQL, queryValues).then((articles) => {
      return articles.rows;
    });
  });
};

exports.selectArticleById = (articleId) => {
  const SQL = `
  SELECT articles.*, COUNT(comments.article_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id`;

  return db.query(SQL, [articleId]).then((article) => {
    const selectedArticle = article.rows[0];
    if (!selectedArticle) {
      return Promise.reject({
        status: 404,
        msg: `404 Error - An article with ID ${articleId} does not exist`,
      });
    }
    return selectedArticle;
  });
};

exports.selectArticleComments = (articleId) => {
  const SQL = `
  SELECT * FROM comments
  WHERE article_id = $1`;
  return db.query(SQL, [articleId]).then((comments) => {
    return comments.rows;
  });
};

exports.checkIfArticleExists = (articleId) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `404 Error - An article with ID ${articleId} does not exist`,
        });
      }
    });
};

exports.insertArticleComment = (articleId, userComment) => {
  const { username, body } = userComment;
  const SQL = `
  INSERT INTO comments 
  (author, body, article_id)
  VALUES ($1, $2, $3)
  RETURNING *`;
  return db.query(SQL, [username, body, articleId]).then((comment) => {
    const commentBody = comment.rows[0].body;
    return commentBody;
  });
};

exports.updateArticleVotes = (articleId, voteChange) => {
  const { inc_votes } = voteChange;
  const SQL = `
  UPDATE articles
  SET votes = votes + $2
  WHERE article_id = $1
  RETURNING *`;
  return db.query(SQL, [articleId, inc_votes]).then((article) => {
    const articleBody = article.rows[0];
    return articleBody;
  });
};

exports.insertArticle = (newArticle) => {
  const { author, title, body, topic } = newArticle;
  const SQL = `
  INSERT INTO articles
  (author, title, body, topic)
  VALUES($1, $2, $3, $4)
  RETURNING *`;
  return db.query(SQL, [author, title, body, topic]).then((article) => {
    return article.rows[0];
  });
};
