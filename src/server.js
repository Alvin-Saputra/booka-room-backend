import express from 'express';
import router from './routes/routes.js';

const app = express();
const port = 3000;
const host = 'localhost';

app.use(express.json());

app.use('/', router);



// app.use(errorMiddleware)

app.listen(port, () => {
    console.log(`Server running at http://${host}:${port}`);
});
