<script setup>
import {
  defineProps,
  toRefs,
  computed,
  ref,
  reactive,
} from 'vue';
import ListItem from './ListItem.vue';

const props = defineProps({
  data: Array, // 總data
  getData: Function,
  loading: Boolean,
  defQuery: Object,
  total: Number,
});

const query = reactive({ ...props.defQuery });
const listViewRef = ref(null);

const {
  data,
  loading,
  defQuery,
} = toRefs(props);

const sPointer = ref(0); // 第一個index
const ePointer = ref(defQuery.value.per_page - 1); // 最後一個index

const itemH = 130;
const itemStyle = { height: 130 };

function handleScroll() {
  const { scrollTop } = listViewRef.value;

  sPointer.value = parseInt(scrollTop / (itemH + 20), 10);
  ePointer.value = sPointer.value + (defQuery.value.per_page - 1);

  // 判斷不加載重複(已取得的總筆數 < 目前顯示筆數的最後一筆 - 1)
  if (data.value.length - 2 < ePointer.value) {
    if (!loading.value) {
      // console.log('家載略', defQuery.value.page);
      query.page += 1;
      props.getData(query);
    }
  }

  // console.log((scrollTop / itemH));
  // 如果 ePointer 全顯示 => re render === sPointer 變了 要 re render
  // if (distance) {
  //   console.log('re render')
  // }
}

// view-main 總高 = total * view-main-item H
// view-main-item 高度
// 偵測scroll的距離
// 到某個點要呼叫main內的 moveTop || moveBottom
// main 會自己判斷要移動誰
// 拉到0過半 => 加載api
// 拉到0不見 => 移動0到最下方 loading前 => 更改showList內的順序
/**
 * startIndex = scrollTop / itemH => 代表我滑過幾個
 * endIndex = startIndex + per_page 的數量
 *
 * type List = {
 *  index: number, // 取資料用的index
 *
 * }
 *
 * sPointer = parseInt(scrollTop / itemH, 10)
 * ePointer = sPointer + (per_page * (itemH + margin))
 *
 */

// itemH * 5 + (itemH / 2)
// index * itemH
// :style="({...itemStyle, top:`${itemTop(index)}px`})"

// observer 監聽 sPointer => 向上滑的時候
// observer 監聽 ePointer => 向下滑的時候

function getItemTop(index) {
  // 第幾個 * 本高 + 第幾個 * 間距
  return (index * itemStyle.height + (index * 20));
}

function getItemStyle(index) {
  return {
    height: `${itemStyle.height}px`,
    top: `${getItemTop(index)}px`,
  };
}

const showList = computed(() => {
  const res = [];

  for (let i = sPointer.value; i <= ePointer.value; i += 1) {
    const marginTop = i === 0 ? 0 : 20;
    // const marginTop = `${i === 0 ? 0 : 20}px`;
    // const height = '14vh';

    res.push({
      // width: '100%',
      height: '130px',
      // height,
      index: i,
      // 用css calc算 => index * (itemH + marginTop)
      y: `${i * (itemH + marginTop)}px`,
      // y: `calc(${i} * (${height} + ${marginTop}))`,
    });
  }

  return res;
});

</script>
<template>
    <div class="list-view" ref="listViewRef" @scroll="handleScroll($event)">
        <div class="list-view-main">
          <ListItem
            v-for="item in showList"
            :data="data[item.index]"
            :item="item"
            :style="{ height: item.height, top: item.y }"
            :key="item.index"
          />
          <ListItem
            :data="{ id: -1, name: 'loading.....' }"
            :style="getItemStyle(ePointer + 1)"
            key="loading"
          />
        </div>
    </div>
</template>
<style scoped>
.list-view {
  background-color: #ffcccc;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
}
.list-view-main {
  background-color: #cccccc;
  position: relative;
}
.loading {}
</style>
