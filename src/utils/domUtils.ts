/*
 * Returns true if navigator has xr with 'immersive-ar' capabilities
 * Returns false otherwise.
 */
export async function browserHasImmersiveArCompatibility(): Promise<boolean> {
  if (window.navigator.xr) {
    const isSupported: boolean = await navigator.xr.isSessionSupported(
      "immersive-ar"
    );
    console.info(
      `[DEBUG] ${
        isSupported
          ? "Browser supports immersive-ar"
          : "Browser does not support immersive-ar"
      }`
    );
    return isSupported;
  }
  return false;
}

/*
 * Create and display message when no XR capabilities are found.
 */
export function displayUnsupportedBrowserMessage(): void {
  const appRoot: HTMLElement | null = document.getElementById("app-root");
  const bigMessage: HTMLParagraphElement = document.createElement("p");

  bigMessage.innerText = "😢 О нет!!!";
  if (appRoot) {
    appRoot.appendChild(bigMessage);
  }

  const middleMessage: HTMLParagraphElement = document.createElement("p");
  middleMessage.innerText = "Ваш браузер не поддерживает WebXR.";

  if (appRoot) {
    appRoot.appendChild(middleMessage);
  }

  const helpMessage: HTMLParagraphElement = document.createElement("p");

  helpMessage.innerText =
    "Попробуйте установить WebXR Viewer для iOS или Chrome для Android. (Тестировалось именно на WebXR Viewer)";

  if (appRoot) {
    appRoot.appendChild(helpMessage);
  }
}

/**
 * Create and show a simple introduction message if the device supports
 * WebXR with immersive-ar mode.
 */
export function displayIntroductionMessage() {
  const appRoot: HTMLElement | null = document.getElementById("app-root");

  const bigMessage: HTMLParagraphElement = document.createElement("h1");
  bigMessage.innerText = "Добро пожаловать! 👋";

  const middleMessage: HTMLParagraphElement = document.createElement("p");
  middleMessage.innerText =
    "Нажмите кнопку ниже чтобы войти в режим дополненной реальности.";

  const helpMessage: HTMLParagraphElement = document.createElement("p");
  helpMessage.innerText =
    "Лучше запускать приложение там, где есть много места, чтобы ставить объекты.";

  helpMessage.style.fontSize = "16px";
  helpMessage.style.fontWeight = "bold";
  helpMessage.style.padding = "64px 64px 0px 64px";
  helpMessage.style.opacity = "0.8";

  if (appRoot) {
    appRoot.appendChild(bigMessage);
    appRoot.appendChild(middleMessage);
    appRoot.appendChild(helpMessage);
  }

  return () => {
    if (appRoot) {
      if (appRoot.contains(middleMessage)) {
        appRoot.removeChild(middleMessage);
      }
      if (appRoot.contains(bigMessage)) {
        appRoot.removeChild(bigMessage);
      }
      if (appRoot.contains(helpMessage)) {
        appRoot.removeChild(helpMessage);
      }
    }
  };
}

export default {
  browserHasImmersiveArCompatibility,
  displayIntroductionMessage,
  displayUnsupportedBrowserMessage,
};
