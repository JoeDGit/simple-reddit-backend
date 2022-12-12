const db = require("../db/connection");

exports.selectArticles = () => {
  const SQL = `
  SELECT articles.*, COUNT(comments.article_id) AS comment_count
FROM articles
LEFT JOIN comments ON comments.article_id = articles.article_id
GROUP BY articles.article_id
ORDER BY created_at desc;`;
  return db.query(SQL).then((articles) => {
    return articles.rows;
  });
};

exports.selectArticleById = (articleId) => {
  const SQL = `
SELECT * FROM articles
WHERE article_id = $1;`;

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
