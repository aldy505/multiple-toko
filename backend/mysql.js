const { knex } = require('knex')
const connection = require('./ubah_ini')

const mysql = knex({
  client: 'mysql2',
  connection: connection || 'mysql://root:@localhost:3306/multiple_toko',
  pool: {
    min: 2,
    max: 18,
  }
})

const trxProvider = mysql.transactionProvider();

async function createTableToko() {
  return new Promise((resolve, reject) => {
    return mysql.transaction(trx => {
      trx.schema.createTable('toko', table => {
        table.string('id', 21).comment('nanoid').primary()
        table.string('nama')
        table.string('slug')
        table.string('deskripsi').nullable()
        table.string('owner_nama')
        table.string('owner_email')
      })
      .transacting(trx)
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .then(o => resolve(o))
    .catch(e => reject(e))
  })
}

async function insertTableToko() {
  return new Promise((resolve, reject) => {
    return mysql.transaction(trx => {
      trx('toko')
        .insert([
          {
            id: '8pd8vzWVsvtI293QbWHSq',
            nama: 'Google Inc',
            slug: 'google',
            deskripsi: 'Layanan terbaik untuk membeli data customer anda',
            owner_nama: 'Gatau lupa',
            owner_email: 'gataulupa@example.com'
          }, {
            id: 'C9F1j39mTv1-LmsdYn5nN',
            nama: 'Amazon Inc',
            slug: 'amazon',
            deskripsi: null,
            owner_nama: 'Jeff Bezos',
            owner_email: 'jeff@amazon.com'
          }
        ])
        .transacting(trx)
        .then(trx.commit)
        .catch(trx.rollback)
    })
      .then(o => resolve(o))
      .catch(e => reject(e))
  })
}

async function createTableProduk() {
  return new Promise((resolve, reject) => {
    return mysql.transaction(trx => {
      trx.schema.createTable('produk', table => {
        table.string('id', 21).primary().comment('nanoid')
        table.string('toko_id')
        table.foreign('toko_id').references('toko.id')
        table.string('nama').notNullable()
        table.string('deskripsi').nullable()
        table.integer('harga').notNullable()
        table.integer('stok').defaultTo(0)
      })
      .transacting(trx)
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .then(o => resolve(o))
    .catch(e => reject(e))
  })
}

async function insertTableProduk() {
  return new Promise((resolve, reject) => {
    return mysql.transaction(trx => {
      trx('produk')
        .insert([
          { 
            id: 'azow_Zx3FUIjf8gjVUV4J',
            toko_id: 'C9F1j39mTv1-LmsdYn5nN',
            nama: 'Saham kepemilikan AWS',
            deskripsi: 'Tapi bukan berarti lu bisa dapet AWS gratis ye',
            harga: 1200000,
            stok: 2
          }, 
          {
            id: 'OH6tN-BPDTJ99-kEVOAXq',
            toko_id: '8pd8vzWVsvtI293QbWHSq',
            nama: 'Merchandise Tote Bag Google',
            harga: 100000,
            stok: 100
          },
          {
            id: 'zNL0pHf1NBDxUgVf5LTEn',
            toko_id: '8pd8vzWVsvtI293QbWHSq',
            nama: 'Emoji fire nya Firebase',
            harga: 20000,
            stok: 94
          }
        ])
        .transacting(trx)
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .then(o => resolve(o))
    .catch(e => reject(e))
  })
}

async function databaseTableSetup() {
    console.log('- Lagi ngecek table nya exists apa engga')
    return new Promise((resolve, reject) => {
      mysql.schema.hasTable('toko')
        .then(exists => {
          if (!exists) {
            createTableToko()
              .then(() => {
                insertTableToko()
                  .then(resolve())
                  .catch(e => { throw e })
              })
              .catch(e => { throw e })
          }
          resolve(exists)
        })
        .catch(e => reject(e))
      mysql.schema.hasTable('produk')
        .then(exists => {
          if (!exists) {
            createTableProduk()
              .then(() => {
                insertTableProduk()
                  .then(resolve())
                  .catch(e => {throw e})
              })
              .catch(e => {throw e})
          }
          resolve(exists)
        })
        .catch(e => reject(e))
    })    
}

module.exports = { mysql, trxProvider, databaseTableSetup }