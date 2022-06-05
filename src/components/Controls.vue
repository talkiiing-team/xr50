<template>
  <div class="controls">
    <NButton class="w-full" size="large" @click="model.select?.()">{{
      selectButtontext
    }}</NButton>
    <NButton class="w-full" size="large" @click="cancel">{{
      cancelButtonText
    }}</NButton>
    <p v-if="model.currentMode === Mode.Insert">Поворот</p>
    <div v-if="model.currentMode === Mode.Insert" class="controls-angle w-full">
      <NButton
        class="w-half"
        size="large"
        @click="model.currentRotation -= Math.PI / 6"
        >-</NButton
      >
      <NButton
        class="w-half"
        size="large"
        @click="model.currentRotation += Math.PI / 6"
        >+</NButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton } from "naive-ui";
import { model, Mode } from "../store/model";
import { computed } from "vue";

const cancel = () => {
  model.currentMode = Mode.SelectMode;
  model.currentModel = null;
};

const selectButtontext = computed(() => {
  if (model.currentMode === Mode.Edit) return "Взять";
  return "Поставить";
});

const cancelButtonText = computed(() => {
  if (model.currentModel) return "Удалить";
  return "Назад";
});
</script>

<style scoped>
.controls {
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.controls > * + * {
  margin-top: 5px;
}

.controls-angle {
  display: flex;
  flex-direction: row;
}

.controls-angle > * + * {
  margin-left: 5px;
}

.w-half {
  width: 48%;
}
</style>
