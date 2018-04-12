import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.get('/yo', (req, res) => {
  res.send('YO!');
});

const server = app.listen(3000, () => console.log(`Server running at localhost:${server.address().port}`));
