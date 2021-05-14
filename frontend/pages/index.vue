<template>
  <div>
    <h1>Maaf ya ini basic banget, males mikir</h1>

    <div>
      <h2>Daftar toko yang bisa diakses</h2>
      <ul v-for="item in toko" :key="item.id">
        <li><NuxtLink :to="`/${item.id}`">{{ item.nama }}</NuxtLink></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({$axios}) {
    const toko = (await $axios.$get('http://localhost:5000')).message
    return { toko }
  }
}
</script>