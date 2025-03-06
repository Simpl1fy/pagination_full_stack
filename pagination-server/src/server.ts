import express, { Request, Response } from 'express';
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
import connectDB from './database/db';
import Data from './database/Model/dataSchema';

const app = express();

// middleware
app.use(bodyParser.json());
app.use(cors());



const PORT = process.env.PORT || 5000;


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
  })
})

app.get('/', (_req: Request, res: Response) => {
  res.send("Express server with typescript");
})

app.post('/add', async (req: Request, res: Response) => {
  const data = req.body;
  console.log(data);

  try {
    const insertedData = await Data.insertMany(data);
    console.log(insertedData);
    res.status(201).json({
      message: "Data inserted successfully",
      data: insertedData
    })
  } catch(err) {
    console.log("An error occured while inserting data =", (err as Error).message);
    res.status(500).json({message: "Internal Server Error"});
  }
})

app.get('/data', async(req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 5;

    const skipData = (pageNumber - 1) * limitNumber;

    const resData = await Data.find().skip(skipData).limit(limitNumber);
    // console.log(resData);

    const cRes = await Data.find();
    const totalDocs = cRes.length;
    res.status(200).json({
      data: resData,
      nbHits: totalDocs
    });
  } catch(err) {
    console.log("An error occured while fetching paginated data =", (err as Error).message);
    res.status(500).json({message: "Internal Server Error"});
  }
})