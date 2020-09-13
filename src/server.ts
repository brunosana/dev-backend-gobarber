import express from 'express';
const app = express();

import routes from './routes/index';

app.use(express.json());

app.use(routes);

app.listen(3333, () => console.log("🚀 Server started on port 3333"));
