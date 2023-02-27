const express = require('express');
require('dotenv').config();
const app = express()

const bodyParser = require('body-parser')
const database = require('./Database/connection')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const port = process.env.PORT;

const packageroute = require('./Routes/packageRoute');
const userroute = require(`./Routes/userRoute`)
const product_route = require(`./Routes/product_route`)
const team_route = require(`./Routes/team_route`)
const payment_route= require('./Routes/paymentRoute')

const error = require('./Controller/error')

app.use(bodyParser.json())
app.use(cors())
app.use(cookieParser())
// app.use(express.json())
// app.use(express.urlencoded({ extended: true })); /* bodyParser.urlencoded() is deprecated */
app.use((req, res, next) => {
    res.setHeader('Access-control-Allow', '*');
    res.setHeader('Access-control-Allow',
        'GET,POST,PUT,DELETE');
    res.setHeader(
        'Access-control-Allow-Headers',
        'Content-Type,Authorization'
    )
    next();
})
app.use('/api', packageroute)
app.use('/api', userroute)
app.use('/api', product_route)
app.use('/api', team_route)
app.use('/api',payment_route)

app.use('/public/uploads', express.static('public/uploads'))

app.use(error.get500);
// app.use((err,req,res,next)=>{
//     const statusCode = err.statusCode||500;
//     res.status(statusCode).json({
//         success:0,
//         message:err.message,
//         stack:err.stack
//     })
// })

app.get("/", (req, res) => {
    res.send("Welcome");
});

app.listen(port, () => {
    console.log(`App get started at ${port}`)
})
