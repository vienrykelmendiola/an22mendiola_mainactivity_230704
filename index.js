const express = require("express")
const cors = require('cors')
const mongoose = require("mongoose")
const app = express()
const userRoutes = require("./routes/userRoutes")

mongoose.connect("mongodb+srv://admin:12345@sandbox.tzulcnk.mongodb.net/an22_sample_database?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useUnifiedTopology:true  
          });

mongoose.connection.once('open',()=>console.log("Now Connected to MongoDb Atlas"))
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:true}))

app.use('/users', userRoutes)
app.get("/",(req,res)=>{
	res.send("HELLO")
})

app.listen(process.env.PORT || 4000, ()=> {
    console.log(`Server Running on Localhost: ${process.env.PORT || 4000}`)
})