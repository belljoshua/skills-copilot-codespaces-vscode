// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const fs = require('fs');
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create comments.json if it doesn't exist
const commentPath = path.join(__dirname, 'comments.json');
if (!fs.existsSync(commentPath)) {
  fs.writeFileSync(commentPath, '[]');
}

// GET comments
app.get('/comments', (req, res) => {
  fs.readFile(commentPath, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.send(data);
    }
  });
});

// POST comment
app.post('/comments', (req, res) => {
  const { body } = req;
  fs.readFile(commentPath, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      const comments = JSON.parse(data);
      const newComment = {
        id: comments.length,
        name: body.name,
        comment: body.comment,
      };
      comments.push(newComment);
      fs.writeFile(commentPath, JSON.stringify(comments), (err) => {
        if (err) {
          console.log(err);
          res.status(500).send(err);
        } else {
          res.send(newComment);
        }
      });
    }
  });
});

// PUT comment
app.put('/comments/:id', (req, res) => {
  const { id } = req.params;
  const { body } = req;
  fs.readFile(commentPath, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      const comments = JSON.parse(data);
      const index = comments.findIndex((comment) => comment.id === parseInt(id));
      if (index === -1) {
        res.status(404).send({ message: `Comment with id ${id} not found` });
      } else {
        comments[index].name = body.name;
        comments[index].comment = body.comment;
        fs.writeFile(commentPath, JSON.stringify(comments), (err) => {
          if (err) {
            console