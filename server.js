const express = require('express')
const request = require('request')
const cors = require('cors')
const app = express()
let bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

const PORT = process.env.PORT || 5000
const url = 'https://www.rost.bet/api/v1/games'
let result;

app.get('/api', async (req, res) => {
  const getData = new Promise(function (resolve, reject) {
    request(url, async function (error, response, body) {
      /*console.error('error:', error);
      console.log('statusCode:', response && response.statusCode);
      console.log('body:', body);*/
      if(error) {
        reject(() => result === 'Failed loading data')
      } else {
        resolve(result = await JSON.parse(body))
      }
    })
  })
  await getData.catch(e => console.log(e))
  await res.json(result)
})
app.listen(PORT, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on http://localhost:${PORT}/api`)
})

