<script setup>
import { onMounted, reactive, ref } from 'vue';
import { getRepos } from '@/api/index';
import ScrollList from '@/components/InfScroll/ScrollList.vue';

const loading = ref(true);

const defQuery = reactive({
  page: 1,
  per_page: 6,
});
let repoList = reactive([]);
const total = ref(0);

async function getData(query = defQuery) {
  loading.value = true;

  const res = await getRepos(query);

  if (res) {
    console.log(res);

    repoList = repoList.concat(res.data.items);
    total.value = res.data.total_count;
  }

  loading.value = false;
}

onMounted(async () => {
  await getData();
});
</script>

<template>
  <header>Infinity Scroll  Total: {{ total }}</header>
  <main>
    <ScrollList :data="repoList" :getData="getData" :loading="loading" :defQuery="defQuery" />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  background-color: #6A6AFF;
  width: 100%;
  color: #FCFCFC;
  padding: 1rem;
  height: 4%;
  position: fixed;
  top: 0;
}
main {
  height: 90%;
  padding: 10% 1rem 1.5rem 1rem;
  overflow-y: hidden;
}
</style>
