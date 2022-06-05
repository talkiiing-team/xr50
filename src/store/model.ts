import { Object3D, Vector3 } from "three";
import { reactive, Ref, shallowRef } from "vue";

export const enum Mode {
  SelectMode,
  Insert,
  Edit,
}

export type ModelType = "chair" | "table" | "bedSingle";

export type ModelSettings = {
  path: string;
  image: string;
  name: string;
};

export const MODELS_SETTINGS: Record<ModelType, ModelSettings> = {
  chair: {
    name: "Кресло",
    path: "/models/chair.glb",
    image: "/images/chair_NE.png",
  },
  table: {
    name: "Стол",
    path: "/models/table.glb",
    image: "/images/table_NE.png",
  },
  bedSingle: {
    name: "Кровать",
    path: "/models/bedSingle.glb",
    image: "/images/bedSingle_SE.png",
  },
};

export type PlacedModel = UnplacedModel & {
  coords: Vector3;
  object: Object3D;
};

export type UnplacedModel = {
  type: ModelType;
};

export const model = reactive<{
  isAppStarted: boolean;
  currentRotation: number;
  select?: CallableFunction;
  currentModel: UnplacedModel | null;
  placedModels: PlacedModel[];
  currentMode: Mode;
}>({
  isAppStarted: true,
  currentModel: null,
  placedModels: [],
  currentRotation: 0,
  currentMode: Mode.SelectMode,
});

export const placedModels: Ref<PlacedModel[]> = shallowRef([]);
