<script setup>
/** V1.0 */
import {
  defineProps,
  toRefs,
  // onMounted,
  ref,
  reactive,
  // onUnmounted,
} from 'vue';
import ScrollItem from './ScrollItem.vue';

const props = defineProps({
  data: Array,
  getData: Function,
  loading: Boolean,
  defQuery: Object,
});

const { data, loading } = toRefs(props);
const scrollListRef = ref(null);
const query = reactive({ ...props.defQuery });

// function handleScroll() {
//   const scrollHeight = document.body.scrollHeight;
//   const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
//   const clientHeight = document.documentElement.clientHeight;

//   // 滾了多少(離到底還有多少)
//   const distance = scrollHeight - scrollTop - clientHeight;

//   console.log(distance)

//   if (distance <= 100) {
//     if (!loading.value) {
//       console.log('家載略');
//       query.page += 1;
//       props.getData(query);
//     }
//   }
// }

function orderScroll() {
  const { scrollHeight, clientHeight, scrollTop } = scrollListRef.value;

  // 滾了多少(離到底還有多少)
  const distance = scrollHeight - scrollTop - clientHeight;

  // console.log(distance)

  if (distance <= 100) {
    if (!loading.value) {
      // console.log('家載略');
      query.page += 1;
      props.getData(query);
    }
  }

  // if(scrollHeight - (scrollTop+clientHeight) <= 1 ){
  //     this.isRead = true; //  这是一个disabled的显示，自己定义的
  //     this.confirmText = '同意' // 更改一个内容文字
  // }
}

// onMounted(() => {
//   window.addEventListener('scroll', handleScroll);
// });

// onUnmounted(() => {
//   window.removeEventListener('scroll', handleScroll);
// });

</script>
<template>
  <div id="scroll-list" ref="scrollListRef" @scroll="orderScroll($event)">
    <ScrollItem v-for="item in data" :key="item.id" :data="item" />
    <div class="loadingText" :v-show="true">
      loading....
    </div>
  </div>
</template>

<style scoped>
div#scroll-list {
  height: 100%;
  width: 100%;
  overflow-y: scroll;
}
.loadingText {
  height: 16.6%;
  width: 100%;
}
</style>
