import express from 'express'
import fetch from 'node-fetch'
import morgan from 'morgan'

import { book } from './services/booking-service';


const port = 8083

const app = express()
app.use(express.json())
app.use(morgan('tiny'))

app.post("/reserve", async (req, res) => {
  const { body } = req
  const seatCount = body.count
  const trainId = body.train_id

  const response = await book(trainId, seatCount);

  console.log('Response ', response);


  res.send(JSON.stringify(response));
})



app.listen(port, () => {
  console.log(`Ticket Office listening on port ${port}`)
})