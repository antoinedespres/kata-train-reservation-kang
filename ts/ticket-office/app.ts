import express from 'express'
import morgan from 'morgan'

import { book } from './services/booking-service';
import { responseIsError } from './dto/response';

const port = 8083

const app = express()
app.use(express.json())
app.use(morgan('tiny'))

app.post("/reserve", async (req, res) => {
  const { body } = req
  const seatCount = body.count
  const trainId = body.train_id

  const response = await book(trainId, seatCount);

  res.contentType('application/json')
    .status(responseIsError(response) ? response.code : 200)
    .send(response);
})



app.listen(port, () => {
  console.log(`Ticket Office listening on port ${port}`)
})