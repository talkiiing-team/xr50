<template>
  <div class="model-card" :class="selected && 'selected'">
    <img v-if="image" :src="image" class="model-image" />
    <div>{{ name }}</div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  name: string;
  image?: string;
  selected: boolean;
}>();
</script>

<style scoped>
.model-card {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ddd;
  width: 100px;
  height: 100px;
  color: #444;
}

.selected {
  color: #090;
  border: 1px solid #090;
}

.model-card > * + * {
  margin-top: 10px;
}

.model-image {
  width: 64px;
  height: 64px;
  object-fit: contain;
}
</style>
