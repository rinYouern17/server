import express from 'express';
import bodyParser from 'body-parser';
import userRouter from './routes/users.js';
import Products from './routes/products.js';

const app = express();
const PORT = 5000;

app.use(bodyParser.json());


app.use('/users', userRouter);
app.use('/products', Products);
app.get('/', (req, res) => { res.send('Hello from rin......') });

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`))
