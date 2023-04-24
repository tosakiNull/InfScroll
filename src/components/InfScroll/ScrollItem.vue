<script setup>
import { defineProps, toRefs } from 'vue';

const props = defineProps({
  data: Object,
});

const { data } = toRefs(props);

</script>
<template>
  <div class="item">
    {{ data.id }} - {{ data.name }}
  </div>
</template>

<style scoped>
.item {
  margin-top: 1rem;
  display: flex;
  height: 16.6%;
  border: 1px solid #ccc;
}

.details {
  flex: 1;
  margin-left: 1rem;
}
</style>
