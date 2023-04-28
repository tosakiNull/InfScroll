<script setup>
import {
  defineProps,
  toRefs,
  computed,
  ref,
  reactive,
  defineEmits,
  watch,
} from 'vue';
import { vh } from '@/utils';
import ListItem from './ListItem.vue';

const emit = defineEmits(['updateData']);
const props = defineProps({
  data: {
    type: Array,
    default() {
      return [];
    },
  }, // 總data
  loading: Boolean,
  defQuery: Object,
});

const { data, loading, defQuery } = toRefs(props);
const query = reactive(defQuery.value); // api搜尋條件
const accumulateIndex = defQuery.value.per_page - 1; // 每次sPointer移動後,累加顯示的筆數(因為index從0開始,故總數去一)

const listViewRef = ref(null);
const sPointer = ref(0); // 第一個index
const ePointer = ref(accumulateIndex + 1); // 最後可滑到的index, 包含loading

// item 屬性設置 單位(vh)
const nItemH = 100 / (defQuery.value.per_page); // 目前顯示5筆, TODO: 第六筆會穿幫要在改一下(+1可顯示六)
const nMarginTop = 0.8; // 上方外距

const totalIndex = computed(() => data.value.length - 1);
const isLockScroll = computed(() => ePointer.value >= totalIndex.value - 1); // 滑到loading 要鎖住
const preLoadLimit = computed(() => parseInt(defQuery.value.per_page / 2, 10)); // 預載線

function getOverTop(scrollTop) {
  return parseInt(scrollTop / (vh(nItemH) + vh(nMarginTop)), 10);
}

// 要在監聽data更新回來時自動更新指標
watch(data, (newData, oldData) => {
  if (newData.length > oldData.length && listViewRef.value) {
    const { scrollTop } = listViewRef.value;

    sPointer.value = getOverTop(scrollTop);
    ePointer.value = sPointer.value + defQuery.value.per_page; // 包含loading item
  }
});

/**
 * scroll滾動觸發callback
 */
function handleScroll() {
  const { scrollTop } = listViewRef.value;

  // console.log("update pointer", totalIndex.value, sPointer.value, ePointer.value);

  // data 更新回來後 => 放行

  // ePointer 在快到 loading(快達到locked條件) => 先預載資料 這裏設看到一半顯示時 parseInt()
  // 避免loading中又再呼叫api, loading 做二鎖條件
  if ((ePointer.value >= totalIndex.value - preLoadLimit.value) && !loading.value) {
    // console.log("loading");
    query.page += 1;
    emit('updateData', query);
  }

  // 滑到loading要鎖住
  if (!isLockScroll.value) {
    // console.log("locked")
    // 更新sPointer ePointer
    // sPointer => 向下滑一格時, sPointer ++, ePointer++, 代表將過上邊界的第一格向下替換
    // ePointer => 向上滑一格時, sPointer --, ePointer--, 代表將過下邊界的最後一格向上替換
    sPointer.value = getOverTop(scrollTop);
    ePointer.value = sPointer.value + defQuery.value.per_page; // 包含loading item
  }
}

const getItemH = () => `calc(${nItemH}vh - ${nMarginTop}vh)`;
const getItemY = (index) => `calc(${index} * (${nItemH}vh + ${nMarginTop}vh))`;

const listLoaderStyle = computed(() => ({
  height: getItemH(),
  top: getItemY(sPointer.value + accumulateIndex + 1),
}));

const showList = computed(() => {
  const res = [];

  for (let i = sPointer.value; i < ePointer.value; i += 1) {
    res.push({
      height: getItemH(),
      index: i,
      y: getItemY(i),
      id: i,
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
