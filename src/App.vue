<template>
  <div v-if="model.currentMode === Mode.Insert">
    <Controls />
    <div class="cards-list">
      <ModelCard
        name="Ничего"
        @click="clickedOn(null)"
        :selected="model.currentModel === null"
      />
      <ModelCard
        v-for="[key, _model] in Object.entries(MODELS_SETTINGS)"
        :key="key"
        :name="_model.name"
        :image="_model.image"
        :selected="model.currentModel?.type === key"
        @click="clickedOn(key as ModelType)"
      />
    </div>
  </div>

  <div v-else-if="model.currentMode === Mode.SelectMode" class="flex-col">
    Что делаем сегодня?
    <NButton @click="model.currentMode = Mode.Insert">Поставить</NButton>
    <NButton @click="model.currentMode = Mode.Edit">Редактировать</NButton>
  </div>

  <div v-else>
    <Controls />
  </div>
</template>

<script lang="ts" setup>
import { NButton } from "naive-ui";
import ModelCard from "./components/ModelCard.vue";
import Controls from "./components/Controls.vue";
import { MODELS_SETTINGS, model, ModelType, Mode } from "./store/model";

const clickedOn = (type: ModelType | null) => {
  if (type) {
    model.currentModel = {
      type,
    };
  } else {
    model.currentModel = null;
  }
};
</script>

<style>
.flex-col {
  display: flex;
  flex-direction: column;
  padding: 10px;
  padding-bottom: 20px;
}

.flex-col > * + * {
  margin-top: 10px;
}

.cards-list {
  display: flex;
  padding: 10px;
}

.cards-list > * + * {
  margin-left: 10px;
}
</style>
