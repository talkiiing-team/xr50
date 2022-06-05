import { WebGLRenderer } from "three/src/renderers/WebGLRenderer";
import { ARButton } from "./components/ARButton.js";
import { createScene } from "./scene";
import {
  browserHasImmersiveArCompatibility,
  displayIntroductionMessage,
  displayUnsupportedBrowserMessage,
} from "./utils/domUtils";
import App from "./App.vue";

import "./styles.css";
import { createApp } from "vue";

function initializeXRApp() {
  const { devicePixelRatio, innerHeight, innerWidth } = window;

  const renderer = new WebGLRenderer({
    antialias: true,
    alpha: true,
  });

  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);

  renderer.xr.enabled = true;

  document.body.appendChild(
    ARButton.createButton(
      renderer,
      {
        requiredFeatures: ["hit-test", "local-floor", "dom-overlay"],
      },
      () => {
        const element = document.getElementById("vue-root");
        element!.style.height = "200px !important";

        createApp(App).mount(element!);
      }
    )
  );

  // const newElement = document.createElement("div");

  // document.body.appendChild(newElement);

  displayIntroductionMessage();

  createScene(renderer);
}

async function start() {
  const isImmersiveArSupported = await browserHasImmersiveArCompatibility();

  isImmersiveArSupported
    ? initializeXRApp()
    : displayUnsupportedBrowserMessage();
}

start();
