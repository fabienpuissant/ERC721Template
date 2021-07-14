const express = require('express')
const bodyParser = require('body-parser');
const { mine, getNftByAddress } = require('./blockChain/blockChainService');
const app = express()
const port = 8000
var cors = require('cors');
app.use(cors({origin: '*'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())



app.post('/mine', (req, res) => {
  mine(req.body.address, req.body.txHash).then(result => {
    res.send(result)
  }).catch(error => {
    res.send(error)
  })
})


app.post('/getNftByAddress', (req, res) => {
  getNftByAddress(req.body.address).then(result => {
    res.send(result)
  }).catch(error => {
    res.send(error)
  })
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})