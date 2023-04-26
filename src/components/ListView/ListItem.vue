<script setup>
import { defineProps, toRefs, computed } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    default() {
      return ({
        id: 0,
        name: '',
        description: '',
        html_url: '',
      });
    },
  },
  isLoader: Boolean,
});

const { data } = toRefs(props);
const hasValue = computed(() => data.value.id === 0);

</script>
<template>
  <div class="list-view-main-item">
    <template v-if="!isLoader">
      <div class="main" v-show="!hasValue">
        <div class="main-title"><h3>{{ data.name }}</h3></div>
        <p>{{ data.description }}</p>
        <p>
          <a :href="data.html_url">{{ data.html_url }}</a>
        </p>
      </div>
      <div class="main" v-show="hasValue">
        Loading....
      </div>
    </template>
    <template v-else>
      <div class="main-loader">Loading List...</div>
    </template>
  </div>
</template>

<style scoped>
.list-view-main-item {
  position: absolute;
  width: 100%;
}
.main {
  background-color: #FCFCFC;
  border: solid 2px #7D7DFF;
  border-radius: 10px;
  padding: 1rem;
  height: 75%;
}
.main-title {
  padding-bottom: .5rem;
}
.main-loader {
  padding: 2rem;
  height: 75%;
  text-align: center;
}
</style>
