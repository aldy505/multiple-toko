<template>
  <div>
    <h1>Selamat datang di {{ toko.nama }}</h1>
    <p>{{ toko.deskripsi }}</p>

    <div>
      <h2>Ini produknya</h2>
      <div v-for="item in produk" :key="item.id">
        <h3>{{ item.nama }}</h3>
        <p>{{ item.dekripsi }}</p>
        <p><strong>Rp{{ item.harga }}</strong> - Sisa {{ item.stock }} barang lagi!</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ $axios, params }) {
    const toko = (await $axios.$get(`http://localhost:5000/toko/informasi/${params.id}`)).message[0]
    const produk = (await $axios.$get(`http://localhost:5000/toko/produk/${params.id}`)).message
    return {toko, produk}
  }
}
</script>