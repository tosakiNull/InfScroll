<script setup>
import { defineProps, toRefs } from 'vue';

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
  item: Object,
});

const { data } = toRefs(props);

</script>
<template>
  <div class="list-view-main-item">
    {{ data.id }} - {{ data.name }}
    <br/>
    {{ data.description }}
    <br/>
    {{ data.html_url }}
    <br/>
    {{item}}
  </div>
</template>

<style scoped>
.list-view-main-item {
  position: absolute;
  background-color: #ccffcc;
  padding: 0.2rem;
  width: 100%;
}
</style>
