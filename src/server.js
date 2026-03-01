import express from 'express';
import router from './routes/routes.js';
import cors from 'cors';

const app = express();
const port = 3000;
const host = 'localhost';


app.use((req, res, next) => {
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        const contentType = req.headers['content-type'];
        if (!contentType || contentType !== 'application/json') {
            return res.status(415).json({
                status: 'error',
                message: "Only Accept JSON Format (Content-Type: application/json)"
            });
        }
    }
    next();
});
app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use('/', router);

// app.use(errorMiddleware)

app.listen(port, () => {
    console.log(`Server running at http://${host}:${port}`);
});
