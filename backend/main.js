const express = require('express')
const cors = require('cors')
const {trxProvider, databaseTableSetup, mysql} = require('./mysql')

const app = express()

app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', async (req, res) => {
  try {
    const trx = await trxProvider()
    const data = await trx('toko').select('*')
    res.status(200).json({ message: data })
  } catch (error) {
    res.status(500).json({message: error})
  }
})

app.get('/toko/informasi/:idToko', async (req, res) => {
  try {
    const trx = await trxProvider()
    const data = await trx('toko').select('*').where({id: req.params.idToko})
    res.status(200).json({ message: data })
  } catch (error) {
    res.status(500).json({message: error})
  }
})
app.get('/toko/produk/:idToko', async (req, res) => {
  try {
    const trx = await trxProvider()
    const data = await trx('produk').select('*').where({ toko_id: req.params.idToko })
    res.status(200).json({ message: data })
  } catch (error) {
    res.status(500).json({message: error})
  }
})

async function main() {
  try {
    await databaseTableSetup()
    app.listen(5000, () => {
      console.log('Server started at http://localhost:5000')
    })
  } catch (error) {
    await mysql.destroy()
    throw error
  }
}

main()