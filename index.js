const express = require('express')
const userRouter = require('./routes/routes')

const bodyParser = require('body-parser');
const app = express()
const port = 3000
app.use(bodyParser.json());

app.use(bodyParser.json())
app.use('/v1', userRouter)

app.listen(3000, function() {
    console.log(`SingleStone API is running on port ${port}`);
})
