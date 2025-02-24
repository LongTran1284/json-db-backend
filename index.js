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

const port = 3000;
app.listen(port, () => {
    console.log('server is running at', port)
})