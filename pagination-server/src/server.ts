import express, { Request, Response } from 'express';
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;

app.get('/', (req: Request, res: Response) => {
  res.send("Express server with typescript");
})

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
})