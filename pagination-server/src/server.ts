import express, { Request, Response } from 'express';
require('dotenv').config();
const bodyParser = require('body-parser')
import connectDB from './database/db';
import Data from './database/Model/dataSchema';

const app = express();

// middleware
app.use(bodyParser.json());

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