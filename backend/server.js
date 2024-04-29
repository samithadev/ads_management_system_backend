const express = require('express')

const app = express()

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//routers
const router = require('./routes/sellerRouter.js')
app.use('/api/seller', router)

//test api
app.get('/', (req,res) => {
    res.json({message: 'hello from api'})
})

//port
const PORT = process.env.PORT || 8080

//server
app.listen(PORT, ()=> {
    console.log(`server is running on port ${PORT}`)
})