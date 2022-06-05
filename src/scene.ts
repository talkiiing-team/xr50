import { createPlaneMarker } from "./objects/PlaneMarker";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { handleXRHitTest } from "./utils/hitTest";

import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  Group,
  Matrix4,
  Mesh,
  Object3D,
  PerspectiveCamera,
  PointLight,
  Scene,
  Vector3,
  WebGLRenderer,
  XRFrame,
} from "three";
import { Mode, model, PlacedModel, placedModels } from "./store/model";
import { watch } from "vue";

const adjustPosition = (_model: Object3D) => {
  const beforeRotation = _model.children[0].rotation.y;
  _model.children[0].rotation.y = 0;
  _model.children[0].position.set(
    ...{
      "": [0, 0, 0] as const,
      chair: [-0.1, 0, 0.1] as const,
      table: [-0.4, 0, 0.2] as const,
      bedSingle: [-0.6, 0, 0.5] as const,
    }[model.currentModel?.type ?? ""]
  );
  _model.children[0].rotation.y = beforeRotation;

  // _model.updateWorldMatrix(true, true);
};

export async function createScene(renderer: WebGLRenderer) {
  const currentModelGroup = new Group();

  const scene = new Scene();

  const camera = new PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.02,
    20
  );
  scene.add(camera);

  const directionalLight = new PointLight(0xffffff, 0.9, 100, 2);
  directionalLight.position.y = 2;
  scene.add(directionalLight);

  const axesHelper = new AxesHelper(5);
  scene.add(axesHelper);

  scene.add(currentModelGroup);

  /**
   * Load the gLTF model and assign result to variable.
   */
  const gltfLoader = new GLTFLoader();

  let tableModel: Object3D;

  await new Promise<void>((res) =>
    gltfLoader.load("/models/table.glb", (gltf: GLTF) => {
      tableModel = gltf.scene.children[0];
      res();
    })
  );

  let chairModel: Object3D;

  await new Promise<void>((res) =>
    gltfLoader.load("/models/chair.glb", (gltf: GLTF) => {
      chairModel = gltf.scene.children[0];
      res();
    })
  );

  let bedSingleModel: Object3D;

  await new Promise<void>((res) =>
    gltfLoader.load("/models/bedSingle.glb", (gltf: GLTF) => {
      bedSingleModel = gltf.scene.children[0];
      res();
    })
  );

  /**
   * Create the plane marker to show on tracked surfaces.
   */
  const planeMarker: Mesh = createPlaneMarker();
  scene.add(planeMarker);

  /**
   * Setup the controller to get input from the XR space.
   */
  const controller = renderer.xr.getController(0);
  scene.add(controller);

  /**
   * The onSelect function is called whenever we tap the screen
   * in XR mode.
   */
  function onSelect() {
    if (model.currentMode === Mode.Insert) {
      if (planeMarker.visible && model.currentModel) {
        const _group = new Group();
        const _model = {
          chair: chairModel,
          table: tableModel,
          bedSingle: bedSingleModel,
        }[model.currentModel.type].clone();

        // Place the model on the spot where the marker is showing.
        const coords = _group.position.setFromMatrixPosition(
          planeMarker.matrix
        );

        // Rotate the model randomly to give a bit of variation.
        _group.rotation.y = model.currentRotation;
        _model.visible = true;

        _group.add(_model);
        _group.visible = true;
        adjustPosition(_group);
        scene.add(_group);

        placedModels.value.push({
          type: model.currentModel.type,
          coords,
          object: _group,
        });

        model.currentModel = null;
        model.currentMode = Mode.SelectMode;
      }
    } else if (model.currentMode === Mode.Edit) {
      const position = new Vector3().setFromMatrixPosition(planeMarker.matrix);
      console.log("CURRENT POSITION", position);

      let minDistance = Infinity;
      let minModel: PlacedModel | null = null;
      placedModels.value.forEach((md) => {
        console.log("COMPARING WITH", md.coords);
        const distance = position.distanceTo(md.coords);

        if (distance < 2 && distance < minDistance) {
          minDistance = distance;
          minModel = md;
        }
      });

      if (!minModel) return;

      const { object } = minModel as PlacedModel;

      if (object) {
        model.currentMode = Mode.Insert;
        object.visible = false;
        scene.remove(object);
        model.currentModel = {
          type: (minModel as PlacedModel).type,
        };
        model.currentRotation = object.rotation.y;
        placedModels.value.splice(placedModels.value.indexOf(minModel), 1);
      }
    }
  }

  model.select = onSelect;

  /**
   * Called whenever a new hit test result is ready.
   */
  function onHitTestResultReady(hitPoseTransformed: Float32Array) {
    if (hitPoseTransformed) {
      planeMarker.visible = true;

      if (model.currentModel) {
        currentModelGroup.visible = true;
        currentModelGroup.position.setFromMatrixPosition(
          currentModelGroup.matrix.fromArray(hitPoseTransformed)
        );
      }
      planeMarker.matrix.fromArray(hitPoseTransformed);
    }
  }

  watch(
    () => model.currentModel,
    (val) => {
      if (!val) {
        currentModelGroup.visible = false;
      } else {
        currentModelGroup.remove(...currentModelGroup.children);
        const _group = new Group();
        const _model = {
          chair: chairModel!,
          table: tableModel!,
          bedSingle: bedSingleModel!,
        }[val.type].clone();
        _group.add(_model);
        adjustPosition(_group);
        currentModelGroup.add(_group);
        currentModelGroup.visible = true;
      }
    },
    {
      deep: true,
    }
  );

  watch(
    () => model.currentRotation,
    (rotation) => {
      if (currentModelGroup.children[0])
        currentModelGroup.children[0].rotation.y = rotation;
    }
  );

  watch(
    () => model.currentMode,
    (mode) => {
      if (mode === Mode.SelectMode) {
        currentModelGroup.remove(...currentModelGroup.children);
      }
    }
  );

  /**
   * Called whenever the hit test is empty/unsuccesful.
   */
  function onHitTestResultEmpty() {
    planeMarker.visible = false;
    currentModelGroup.visible = false;
  }

  /**
   * The main render loop.
   *
   * This is where we perform hit-tests and update the scene
   * whenever anything changes.
   */
  const renderLoop = (timestamp: any, frame?: XRFrame) => {
    if (renderer.xr.isPresenting) {
      if (frame) {
        model.isAppStarted = true;
        handleXRHitTest(
          renderer,
          frame,
          onHitTestResultReady,
          onHitTestResultEmpty
        );
      }

      renderer.render(scene, camera);
    }
  };

  renderer.setAnimationLoop(renderLoop);
}
