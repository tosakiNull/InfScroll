<script setup>
import { onMounted, reactive, ref } from 'vue';
import { getRepos } from '@/api/index';
import ListView from '@/components/ListView/ListView.vue';

const loading = ref(true);

const defQuery = reactive({
  q: 'jquery in:name',
  page: 1,
  per_page: 6,
});
let repoList = reactive([]);
const total = ref(0);

/**
 * 取得 github repos 資料
 *
 */
async function getData(query = defQuery) {
  loading.value = true;

  const res = await getRepos(query);

  if (res) {
    repoList = repoList.concat(res.data.items);
    total.value = res.data.total_count;
    // console.log('data get!')
  }

  loading.value = false;
}

onMounted(async () => {
  await getData();
});
</script>

<template>
  <header>
    <div class="header-nav">
      <h2>Infinity Scroll</h2>
      <small>Total: {{ total }}</small>
    </div>
  </header>
  <main>
    <div class="main-view">
      <ListView
        :data="repoList"
        :loading="loading"
        :defQuery="defQuery"
        @update-data="getData"
      />
    </div>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  background-color: #6A6AFF;
  width: 100%;
  color: #FCFCFC;
  height: 5rem;
  position: fixed;
  top: 0;
}
.header-nav {
  padding: 1rem;
}
.header-nav h2,
.header-nav small {
  display: inline-block;
  padding: 0 1rem;
}
main {
  height: 100%;
  background-color: #D0D0D0;
}
.main-view {
  padding: 1rem;
  padding-top: 6rem;
  height: 85vh;
}
</style>
