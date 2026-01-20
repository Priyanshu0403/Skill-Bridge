import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
//here mainRouter combines all the routes which is present in the index.js file of the routes folder
import mainRouter from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// app.use(express.json());
//no need to use * for all the routes
app.use(cors());

//this lets u use the json format data
app.use(express.json());//{limit: "10mb"}
app.use(express.urlencoded({ extended: true}));


//all routes inside gigRoutes.js will be prefixed with /api/gigs
//here we are mounting the gigRoutes (adding it)
app.use("/api", mainRouter);

//no need to use * for all the routes
app.use((req,res)=>{
    res.status(404).json({
        status: "404 Not Found",
        message: "The requested resource was not found on this server."
    });
});




app.listen(PORT,()=>{
    console.log(`Backend API Server is running on ${PORT}`);
});
