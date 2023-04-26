<script setup>
import { onMounted, reactive, ref } from 'vue';
import { getRepos } from '@/api/index';
import ScrollList from '@/components/InfScroll/ScrollList.vue';
import ListView from '@/components/ListView/ListView.vue';

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
  <header>
    <div>
      Infinity Scroll  Total: {{ total }}
    </div>
  </header>
  <main>
    <div class="main-view">
      <!-- <ScrollList :data="repoList" :getData="getData" :loading="loading" :defQuery="defQuery" /> -->
      <ListView
        :data="repoList"
        :getData="getData"
        :loading="loading"
        :defQuery="defQuery"
        :total="total"
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
header.div {
  padding: 1rem;
}
main {
  height: 100%;
}
.main-view {
  padding: 1rem;
  padding-top: 6rem;
  height: 88.5%;
}
</style>
