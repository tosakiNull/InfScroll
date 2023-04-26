<script setup>
import {
  defineProps,
  toRefs,
  computed,
  ref,
  reactive,
} from 'vue';
import { vh } from '@/utils';
import ListItem from './ListItem.vue';

const props = defineProps({
  data: {
    type: Array,
    default() {
      return [];
    },
  }, // 總data
  getData: Function,
  loading: Boolean,
  defQuery: Object,
});

const { data, loading, defQuery } = toRefs(props);
const query = reactive({ ...defQuery.value }); // api搜尋條件

const listViewRef = ref(null);
const sPointer = ref(0); // 第一個index
const ePointer = ref((defQuery.value.per_page - 1)); // 最後一個index

// item 屬性設置 單位(vh)
const nItemH = 100 / (defQuery.value.per_page + 1); // 要讓第六個完全顯示需加上預載筆數
const nMarginTop = 0.8;

/**
 * scroll滾動觸發callback
 */
function handleScroll() {
  const { scrollTop } = listViewRef.value;

  // 最後index <= 總data 最後的index
  // 阻擋資料還沒回來就一直往下滾
  if (ePointer.value <= data.value.length - 1) {
    sPointer.value = parseInt(scrollTop / (vh(nItemH) + vh(nMarginTop)), 10);
    ePointer.value = sPointer.value + defQuery.value.per_page; // 倒數第幾個
  }

  // 判斷不加載重複(已取得的總筆數 < 目前顯示筆數的最後一筆 - 1) 且提早取
  if (data.value.length - 1 <= ePointer.value - 1) {
    if (!loading.value) {
      query.page += 1;
      props.getData(query);
    }
  }
}

const getItemH = () => `calc(${nItemH}vh - ${nMarginTop}vh)`;
const getItemY = (index) => `calc(${index} * (${nItemH}vh + ${nMarginTop}vh))`;

const listLoaderStyle = computed(() => ({
  height: getItemH(),
  top: getItemY(ePointer.value + 1),
}));

const showList = computed(() => {
  const res = [];

  for (let i = sPointer.value; i <= ePointer.value; i += 1) {
    res.push({
      height: getItemH(),
      index: i,
      y: getItemY(i),
      id: data.value[i].id, // 當data更新時畫面也一併更新(否則ListLoader不會往下)
    });
  }

  return res;
});

</script>
<template>
    <div class="list-view" ref="listViewRef" @scroll="handleScroll($event)">
        <div class="list-view-main">
          <template v-if="data.length > 0">
            <ListItem
              v-for="item in showList"
              :data="data[item.index]"
              :item="item"
              :style="{ height: item.height, top: item.y }"
              :key="item.id"
            />
            <ListItem
              :data="{ id: -1, name: 'loading.....' }"
              :style="listLoaderStyle"
              key="loading"
              isLoader
            />
          </template>
          <template v-else>
            <div class="msg" >
              <h3>Sorry, No Data.</h3>
            </div>
          </template>
        </div>
    </div>
</template>
<style scoped>
.list-view {
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
}
.list-view-main {
  position: relative;
}
.msg {
  color: #FCFCFC;
  text-align: center;
  padding: 1.5rem;
}
</style>
