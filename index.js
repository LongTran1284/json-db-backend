const express = require('express');
const cors = require('cors');
const orderRouter = require('./routes/order.route')
const authRouter = require('./routes/auth.route')
const emailRouter = require('./routes/email.route')

const app = express();
app.use(cors());
app.use(express.json())

app.use('/api/v1/order', orderRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/email', emailRouter);

app.get('/', (req, res) => {
    res.send("Hello World!!")
});

app.get('/favicon.ico', (req, res) => res.status(204).end());
// const ignoreFavicon = (req, res, next) => {
//     if (req.originalUrl.includes('favicon.ico')) {
//        res.status(204).end()       
//     }
//     next();
// };
// app.use(ignoreFavicon);

const port = 3000;
app.listen(port, () => {
    console.log('server is running at', port)
})