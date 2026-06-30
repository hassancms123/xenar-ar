import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";


/* =========================================================
   1. SCREEN REFERENCES
========================================================= */

const screens = {
  s0: document.querySelector("#screen-s0"),
  s1: document.querySelector("#screen-s1"),
  s2: document.querySelector("#screen-s2"),
  s3: document.querySelector("#screen-s3"),
  s4: document.querySelector("#screen-s4"),
  s5: document.querySelector("#screen-s5"),
  s6: document.querySelector("#screen-s6"),
  s7: document.querySelector("#screen-s7"),
  s8: document.querySelector("#screen-s8"),
  s9: document.querySelector("#screen-s9"),
  s10: document.querySelector("#screen-s10"),
  s11: document.querySelector("#screen-s11"),
  s12: document.querySelector("#screen-s12")
};


/* =========================================================
   2. BUTTON REFERENCES
========================================================= */

const startButton = document.querySelector("#startButton");
const allowCameraBtn = document.querySelector("#allowCameraBtn");
const skipCameraBtn = document.querySelector("#skipCameraBtn");

const assemblyLineBtn = document.querySelector("#assemblyLineBtn");
const automotiveBtn = document.querySelector("#automotiveBtn");
const electronicBtn = document.querySelector("#electronicBtn");
const energyBtn = document.querySelector("#energyBtn");
const medicalBtn = document.querySelector("#medicalBtn");

const bottomNav = document.querySelector("#bottomNav");
const backNavBtn = document.querySelector("#backNavBtn");
const homeNavBtn = document.querySelector("#homeNavBtn");
const rescanNavBtn = document.querySelector("#rescanNavBtn");

const explodedViewBtn = document.querySelector("#explodedViewBtn");
const productionProcessBtn = document.querySelector("#productionProcessBtn");
const applicationViewBtn = document.querySelector("#applicationViewBtn");

const explodedViewBtnS6 = document.querySelector("#explodedViewBtnS6");
const productionProcessBtnS6 = document.querySelector("#productionProcessBtnS6");
const applicationViewBtnS6 = document.querySelector("#applicationViewBtnS6");

const productionGif = document.querySelector("#productionGif");
const processName = document.querySelector("#processName");
const productionProcessText = document.querySelector("#productionProcessText");
const processDots = document.querySelector("#processDots");

const explodedViewBtnS5 = document.querySelector("#explodedViewBtnS5");
const productionProcessBtnS5 = document.querySelector("#productionProcessBtnS5");
const applicationViewBtnS5 = document.querySelector("#applicationViewBtnS5");

const explodedViewBtnS7 = document.querySelector("#explodedViewBtnS7");
const productionProcessBtnS7 = document.querySelector("#productionProcessBtnS7");
const applicationViewBtnS7 = document.querySelector("#applicationViewBtnS7");


/* =========================================================
   3. MINDAR REFERENCES
========================================================= */

const arScene = document.querySelector("#arScene");
const imageTargets = document.querySelectorAll(".image-target");
const scanInstruction = document.querySelector("#scanInstruction");

let arStarted = false;
let targetAlreadyHandled = false;

let savedProductViewState = null;
let savedExplodedViewState = null;
let latestViewerState = null;


/* =========================================================
   4. THREE.JS PRODUCT VIEWER
========================================================= */

const ELECTRONICS_PRODUCTION_STEPS = [
  {
    name: "Cleaning",
    text: "Connector components are supplied and positioned for the automated assembly process.",
    gif: "assets/gifs/electronics-p1-cleaning.gif"
  },
  {
    name: "Feeding",
    text: "Contact elements are inserted and aligned with precision inside the connector housing.",
    gif: "assets/gifs/electronics-p1-feeding.gif"
  },
  {
    name: "Handling",
    text: "The connector is tested to verify contact quality, position accuracy, and functional reliability.",
    gif: "assets/gifs/electronics-p1-handling.gif"
  },
  {
    name: "Testing",
    text: "The finished connector is transferred, sorted, or prepared for the next production step.",
    gif: "assets/gifs/electronics-p1-testing.gif"
  }
];

const AUTOMOTIVE_PRODUCTION_STEPS = [
  {
    name: "Dispensing",
    text: "Sensor parts are supplied to the assembly system and prepared for precise processing.",
    gif: "assets/gifs/automotive-p1-dispensing.gif"
  },
  {
    name: "Feeding",
    text: "The sensor components are assembled and positioned according to the required product geometry.",
    gif: "assets/gifs/automotive-p1-feeding.gif"
  },
  {
    name: "Heating",
    text: "The sensor is checked for correct function, quality, and process reliability.",
    gif: "assets/gifs/automotive-p1-heating.gif"
  }
];

const ENERGY_PRODUCTION_STEPS = [
  {
    name: "Bending",
    text: "Fuel cell components are supplied and prepared for the automated assembly sequence.",
    gif: "assets/gifs/energy-p3-bending.gif"
  },
  {
    name: "Joining",
    text: "Individual fuel cell components are aligned and assembled into the required structure.",
    gif: "assets/gifs/energy-p3-joining.gif"
  },
  {
    name: "Marking",
    text: "The fuel cell assembly is checked for quality, tightness, and functional reliability.",
    gif: "assets/gifs/energy-p3-marking.gif"
  }
];

const MEDICAL_PRODUCTION_STEPS = [
  {
    name: "Identify",
    text: "Small medical technology components are supplied carefully for precise automated handling.",
    gif: "assets/gifs/medical-p4-identify.gif"
  },
  {
    name: "Cooling",
    text: "The stent device components are assembled with high precision and controlled positioning.",
    gif: "assets/gifs/medical-p4-cooling.gif"
  },
  {
    name: "Seperating",
    text: "The assembled device is inspected to ensure reliable function and consistent production quality.",
    gif: "assets/gifs/medical-p4-seperating.gif"
  },
  {
    name: "Packaging",
    text: "The completed device is handled and transferred for the next production or packaging stage.",
    gif: "assets/gifs/medical-p4-packaging.gif"
  }
];

const PRODUCTS = [
  {
    id: "electronics",
    category: "Electronics",
    name: "Connector",
    targetIndex: 0,
    modelPath: "assets/model/model-electronic.glb",
    applicationModelPath: "assets/model/application-electronic.glb",
    productionSteps: ELECTRONICS_PRODUCTION_STEPS
  },
  {
    id: "automotive",
    category: "Automotive",
    name: "Sensor",
    targetIndex: 1,
    modelPath: "assets/model/model-automotive.glb",
    applicationModelPath: "assets/model/application-automotive.glb",
    productionSteps: AUTOMOTIVE_PRODUCTION_STEPS
  },
  {
    id: "energy",
    category: "Energy",
    name: "Fuel Cell",
    targetIndex: 2,
    modelPath: "assets/model/model-energy.glb",
    applicationModelPath: "assets/model/application-energy.glb",
    productionSteps: ENERGY_PRODUCTION_STEPS
  },
  {
    id: "medical",
    category: "Medical",
    name: "Heart Stent",
    targetIndex: 3,
    modelPath: "assets/model/model-medical.glb",
    applicationModelPath: "assets/model/application-medical.glb",
    productionSteps: MEDICAL_PRODUCTION_STEPS
  }
];

let currentProduct = PRODUCTS[0];

let threeScene = null;
let threeCamera = null;
let threeRenderer = null;
let threeControls = null;
let threeModel = null;
let threeAnimationId = null;

let explodedScene = null;
let explodedCamera = null;
let explodedRenderer = null;
let explodedControls = null;
let explodedModel = null;
let explodedAnimationId = null;
let explodedParts = [];
let explodedStartTime = null;

let returningFromExploded = false;
let assembleAnimationStartTime = null;
let assembleAnimationParts = [];

let applicationScene = null;
let applicationCamera = null;
let applicationRenderer = null;
let applicationControls = null;
let applicationModel = null;
let applicationMixer = null;
let applicationClock = null;
let applicationAnimationId = null;

const ASSEMBLE_DURATION = 1200;

const MODEL_VIEW_SCALE = 1.2;
const EXPLODE_DISTANCE = 0.3;
const EXPLODE_DURATION = 1800;

let currentProcessIndex = 0;



/* =========================================================
   5. SAFE EVENT HELPER
========================================================= */

function addClick(element, action) {
  if (element) {
    element.addEventListener("click", action);
  }
}


/* =========================================================
   6. SCREEN MANAGEMENT
========================================================= */

function hideAllScreens() {
  Object.values(screens).forEach((screen) => {
    if (screen) {
      screen.classList.add("hidden");
    }
  });
}

function updateBodyBackground(screenName) {
  document.body.classList.remove("s3-active");

  if (["s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "s12"].includes(screenName)) {
    document.body.classList.add("s3-active");
  }
}

function updateBottomNav(screenName) {
  if (!bottomNav || !backNavBtn || !homeNavBtn || !rescanNavBtn) return;

  bottomNav.classList.add("hidden");

  backNavBtn.classList.add("hidden");
  homeNavBtn.classList.remove("hidden");
  rescanNavBtn.classList.remove("hidden");

  backNavBtn.classList.remove("active");
  homeNavBtn.classList.remove("active");
  rescanNavBtn.classList.remove("active");

  if (["s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "s12"].includes(screenName)) {
    bottomNav.classList.remove("hidden");
  }

  if (screenName === "s3") {
    homeNavBtn.classList.add("active");
  }

  if (screenName === "s2") {
    rescanNavBtn.classList.add("active");
  }

  /*
    Sub-states S5, S6, S7 only show Back.
    Home and Rescan are hidden so user returns to S4 first.
  */
  if (["s5", "s6", "s7"].includes(screenName)) {
    backNavBtn.classList.remove("hidden");
    backNavBtn.classList.remove("active");

    homeNavBtn.classList.add("hidden");
    rescanNavBtn.classList.add("hidden");
  }
}

function showScreen(screenName, addToHistory = true) {
  hideAllScreens();
  closeAllHotspots();

  updateBodyBackground(screenName);
  updateBottomNav(screenName);


  document.body.classList.remove("scanner-active");
  document.body.classList.remove("model-view");

  if (screenName === "s2") {
    document.body.classList.add("scanner-active");
  }

  if (screenName === "s4") {
    document.body.classList.add("model-view");
  }

  if (screens[screenName]) {
    screens[screenName].classList.remove("hidden");
  }

  // Clean AR / Three.js only when leaving scan/product flow
  if (!["s2", "s4", "s5", "s6", "s7"].includes(screenName)) {
    stopARScanner();
    destroyThreeViewer();
    destroyExplodedViewer();
    destroyApplicationViewer();
    targetAlreadyHandled = false;
  }

  if (addToHistory) {
    history.pushState({ screen: screenName }, "", "#" + screenName);
  }
}


/* =========================================================
   7. THREE.JS VIEWER FUNCTIONS
========================================================= */

function getFileNameWithoutExtension(filePath) {
  const fileName = filePath.split("/").pop();
  return fileName.replace(/\.[^/.]+$/, "");
}

function getProductById(productId) {
  return PRODUCTS.find((product) => product.id === productId) || PRODUCTS[0];
}

function getProductByTargetIndex(targetIndex) {
  return PRODUCTS.find((product) => product.targetIndex === targetIndex) || PRODUCTS[0];
}

function getCurrentProductModelPath() {
  return currentProduct?.modelPath || PRODUCTS[0].modelPath;
}

function getCurrentApplicationModelPath() {
  return (
    currentProduct?.applicationModelPath ||
    currentProduct?.modelPath ||
    PRODUCTS[0].modelPath
  );
}

function updateProductHeading(product = currentProduct) {
  const productName = product?.name || "Product View";

  const productHeading = document.querySelector("#productHeading");
  const explodedHeading = document.querySelector("#explodedHeading");
  const productionHeading = document.querySelector("#productionHeading");
  const applicationHeading = document.querySelector("#applicationHeading");

  if (productHeading) {
    productHeading.textContent = productName;
  }

  if (explodedHeading) {
    explodedHeading.textContent = productName;
  }

  if (productionHeading) {
    productionHeading.textContent = productName;
  }

  if (applicationHeading) {
    applicationHeading.textContent = productName;
  }
}

function openProductView(productId) {
  currentProduct = getProductById(productId);

  savedProductViewState = null;
  savedExplodedViewState = null;
  latestViewerState = null;

  updateProductHeading(currentProduct);
  showScreen("s4");

  const threeViewer = document.querySelector("#threeViewer");
  if (threeViewer) {
    threeViewer.classList.add("viewer-fade-hidden");
  }

  setTimeout(() => {
    initThreeViewer(currentProduct.modelPath);

    setTimeout(() => {
      fadeInViewer("#threeViewer");
    }, 100);
  }, 100);
}


function initThreeViewer(modelPath, viewState = null, playAssembleAnimation = false) {
  const container = document.querySelector("#threeViewer");

  if (!container) {
    console.log("threeViewer container not found");
    return;
  }

  destroyThreeViewer();

  container.innerHTML = "";

  threeScene = new THREE.Scene();

  threeCamera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  threeCamera.position.set(0, 0, 4);

  threeRenderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  threeRenderer.setSize(window.innerWidth, window.innerHeight);
  threeRenderer.setPixelRatio(window.devicePixelRatio || 1);

  container.appendChild(threeRenderer.domElement);

  threeRenderer.domElement.style.touchAction = "none";
  threeRenderer.domElement.style.pointerEvents = "auto";

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
  threeScene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.3);
  directionalLight.position.set(2, 3, 4);
  threeScene.add(directionalLight);

  threeControls = new OrbitControls(threeCamera, threeRenderer.domElement);

  threeControls.enableDamping = true;
  threeControls.dampingFactor = 0.08;

  threeControls.enableRotate = true;
  threeControls.enableZoom = true;
  threeControls.enablePan = false;

  threeControls.rotateSpeed = 0.8;
  threeControls.zoomSpeed = 0.8;

  threeControls.minDistance = 1.5;
  threeControls.maxDistance = 8;

  if (viewState) {
    threeCamera.position.copy(viewState.cameraPosition);
    threeControls.target.copy(viewState.controlsTarget);
  } else {
    threeControls.target.set(0, 0, 0);
  }

  threeControls.update();

  const loader = new GLTFLoader();

  loader.load(
    modelPath,
    (gltf) => {
      const loadedModel = gltf.scene;

      threeModel = centerAndScaleModel(loadedModel);

      if (viewState) {
        threeModel.rotation.copy(viewState.modelRotation);
        threeModel.quaternion.copy(viewState.modelQuaternion);
        threeModel.scale.copy(viewState.modelScale);
      }

      threeScene.add(threeModel);

      if (viewState) {
        threeControls.target.copy(viewState.controlsTarget);
      } else {
        threeControls.target.set(0, 0, 0);
      }

      threeControls.update();

      if (playAssembleAnimation) {
        prepareAssembleAnimation(threeModel);
        assembleAnimationStartTime = performance.now();
      }

      console.log("Three.js model loaded and centered:", modelPath);
    },
    undefined,
    (error) => {
      console.error("Three.js model failed to load:", error);
      alert("Three.js model failed to load. Check model path or GLB export.");
    }
  );

  window.addEventListener("resize", resizeThreeViewer);

  animateThreeViewer();
}

function centerAndScaleModel(model) {
  const box = new THREE.Box3().setFromObject(model);

  const center = new THREE.Vector3();
  const size = new THREE.Vector3();

  box.getCenter(center);
  box.getSize(size);

  const maxDimension = Math.max(size.x, size.y, size.z);

  const pivot = new THREE.Group();

  // Move model geometry to pivot center
  model.position.set(-center.x, -center.y, -center.z);

  pivot.add(model);

  if (maxDimension > 0) {
    const scale = MODEL_VIEW_SCALE / maxDimension;
    pivot.scale.setScalar(scale);
  }

  // Keep pivot at true center
  pivot.position.set(0, 0, 0);

  return pivot;
}

function animateThreeViewer() {
  threeAnimationId = requestAnimationFrame(animateThreeViewer);

  if (threeControls) {
    threeControls.update();
  }

  if (assembleAnimationParts.length > 0 && assembleAnimationStartTime !== null) {
    const elapsed = performance.now() - assembleAnimationStartTime;
    const rawProgress = Math.min(elapsed / ASSEMBLE_DURATION, 1);
    const easedProgress = easeInOutCubic(rawProgress);

    assembleAnimationParts.forEach((part) => {
      part.mesh.position.lerpVectors(
        part.startPosition,
        part.finalPosition,
        easedProgress
      );
    });

    if (rawProgress >= 1) {
      assembleAnimationParts = [];
      assembleAnimationStartTime = null;
      returningFromExploded = false;
    }
  }

  if (threeRenderer && threeScene && threeCamera) {
    threeRenderer.render(threeScene, threeCamera);
  }
}

function resizeThreeViewer() {
  if (!threeCamera || !threeRenderer) return;

  threeCamera.aspect = window.innerWidth / window.innerHeight;
  threeCamera.updateProjectionMatrix();

  threeRenderer.setSize(window.innerWidth, window.innerHeight);
}

function destroyThreeViewer() {
  const container = document.querySelector("#threeViewer");

  assembleAnimationParts = [];
  assembleAnimationStartTime = null;

  if (threeAnimationId) {
    cancelAnimationFrame(threeAnimationId);
    threeAnimationId = null;
  }

  if (threeControls) {
    threeControls.dispose();
  }

  if (threeRenderer) {
    threeRenderer.dispose();
  }

  if (container) {
    container.innerHTML = "";
  }

  threeScene = null;
  threeCamera = null;
  threeRenderer = null;
  threeControls = null;
  threeModel = null;

  window.removeEventListener("resize", resizeThreeViewer);
}
function initExplodedViewer(modelPath, viewState = null) {
  const container = document.querySelector("#explodedViewer");

  if (!container) {
    console.log("explodedViewer container not found");
    return;
  }

  destroyExplodedViewer();

  container.innerHTML = "";

  explodedScene = new THREE.Scene();

  explodedCamera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  explodedCamera.position.set(0, 0, 4);

  explodedRenderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  explodedRenderer.setSize(window.innerWidth, window.innerHeight);
  explodedRenderer.setPixelRatio(window.devicePixelRatio || 1);

  container.appendChild(explodedRenderer.domElement);

  explodedRenderer.domElement.style.touchAction = "none";
  explodedRenderer.domElement.style.pointerEvents = "auto";

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
  explodedScene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.3);
  directionalLight.position.set(2, 3, 4);
  explodedScene.add(directionalLight);

  explodedControls = new OrbitControls(explodedCamera, explodedRenderer.domElement);
  explodedControls.enableDamping = true;
  explodedControls.dampingFactor = 0.08;
  explodedControls.enableRotate = true;
  explodedControls.enableZoom = true;
  explodedControls.enablePan = false;
  explodedControls.minDistance = 1.5;
  explodedControls.maxDistance = 8;
  if (viewState) {
    explodedCamera.position.copy(viewState.cameraPosition);
    explodedControls.target.copy(viewState.controlsTarget);
  } else {
    explodedControls.target.set(0, 0, 0);
  }

  explodedControls.update();

  const loader = new GLTFLoader();

  loader.load(
    modelPath,
    (gltf) => {
      const loadedModel = gltf.scene;

      explodedModel = centerAndScaleModel(loadedModel);

      if (viewState) {
        explodedModel.rotation.copy(viewState.modelRotation);
        explodedModel.quaternion.copy(viewState.modelQuaternion);
        explodedModel.scale.copy(viewState.modelScale);
      }

      explodedScene.add(explodedModel);

      prepareExplodedParts(explodedModel);

      explodedStartTime = performance.now();

      console.log("Exploded model loaded:", modelPath);
    },
    undefined,
    (error) => {
      console.error("Exploded model failed to load:", error);
      alert("Exploded model failed to load. Check model path or GLB export.");
    }
  );

  window.addEventListener("resize", resizeExplodedViewer);

  animateExplodedViewer();
}

function prepareExplodedParts(modelRoot) {
  explodedParts = [];

  modelRoot.updateMatrixWorld(true);

  let partsRoot = modelRoot;

  while (
    partsRoot.children.length === 1 &&
    !partsRoot.children[0].isMesh
  ) {
    partsRoot = partsRoot.children[0];
  }

  console.log("Explosion parts root:", partsRoot.name || partsRoot.type);
  console.log("Direct children:", partsRoot.children.map((child) => child.name || child.type));

  const candidateParts = partsRoot.children.filter((child) => {
    const box = new THREE.Box3().setFromObject(child);
    const size = new THREE.Vector3();
    box.getSize(size);

    return child.visible && size.length() > 0.001;
  });

  candidateParts.forEach((part) => {
    const parent = part.parent;
    const originalPosition = part.position.clone();
    const name = part.name.toLowerCase();

    let direction = 0;

    if (name.includes("far-left") || name.includes("far_left")) {
      direction = -2;
    } else if (name.includes("left")) {
      direction = -1;
    } else if (name.includes("center") || name.includes("middle")) {
      direction = 0;
    } else if (name.includes("far-right") || name.includes("far_right")) {
      direction = 2;
    } else if (name.includes("right")) {
      direction = 1;
    }

    const box = new THREE.Box3().setFromObject(part);
    const center = box.getCenter(new THREE.Vector3());

    const worldStart = center.clone();

    const worldEnd = center.clone().add(
      new THREE.Vector3(
        0,
        0,
        direction * EXPLODE_DISTANCE
      )
    );

    const localStart = parent.worldToLocal(worldStart.clone());
    const localEnd = parent.worldToLocal(worldEnd.clone());

    const localOffset = localEnd.sub(localStart);
    const explodedPosition = originalPosition.clone().add(localOffset);

    explodedParts.push({
      mesh: part,
      originalPosition,
      explodedPosition
    });
  });

  console.log("Exploded animated parts:", explodedParts.length);
}

function initApplicationViewer(modelPath, viewState = null) {
  const container = document.querySelector("#applicationViewer");

  if (!container) {
    console.log("applicationViewer container not found");
    return;
  }

  destroyApplicationViewer();

  container.innerHTML = "";

  applicationScene = new THREE.Scene();

  applicationCamera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  applicationCamera.position.set(0, 0, 4);

  applicationRenderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  applicationRenderer.setSize(window.innerWidth, window.innerHeight);
  applicationRenderer.setPixelRatio(window.devicePixelRatio || 1);

  container.appendChild(applicationRenderer.domElement);

  applicationRenderer.domElement.style.touchAction = "none";
  applicationRenderer.domElement.style.pointerEvents = "auto";

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
  applicationScene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.3);
  directionalLight.position.set(2, 3, 4);
  applicationScene.add(directionalLight);

  applicationControls = new OrbitControls(applicationCamera, applicationRenderer.domElement);

  applicationControls.enableDamping = true;
  applicationControls.dampingFactor = 0.08;

  applicationControls.enableRotate = true;
  applicationControls.enableZoom = true;
  applicationControls.enablePan = false;

  applicationControls.minDistance = 1.5;
  applicationControls.maxDistance = 8;

  if (viewState) {
    applicationCamera.position.copy(viewState.cameraPosition);
    applicationControls.target.copy(viewState.controlsTarget);
  } else {
    applicationControls.target.set(0, 0, 0);
  }

  applicationControls.update();

  applicationClock = new THREE.Clock();

  const loader = new GLTFLoader();

  loader.load(
    modelPath,
    (gltf) => {
      const loadedModel = gltf.scene;

      applicationModel = centerAndScaleModel(loadedModel);

      if (viewState) {
        applicationModel.rotation.copy(viewState.modelRotation);
        applicationModel.quaternion.copy(viewState.modelQuaternion);
        applicationModel.scale.copy(viewState.modelScale);
      }

      applicationScene.add(applicationModel);

      /*
        Play embedded Blender animation if the GLB contains animation clips.
      */
      if (gltf.animations && gltf.animations.length > 0) {
        applicationMixer = new THREE.AnimationMixer(applicationModel);

        gltf.animations.forEach((clip) => {
          const action = applicationMixer.clipAction(clip);
          action.reset();
          action.play();
        });

        console.log("Application animation clips:", gltf.animations.length);
      } else {
        console.log("No embedded animation found in application GLB.");
      }

      console.log("Application model loaded:", modelPath);
    },
    undefined,
    (error) => {
      console.error("Application model failed to load:", error);
      alert("Application model failed to load. Check model path or GLB export.");
    }
  );

  window.addEventListener("resize", resizeApplicationViewer);

  animateApplicationViewer();
}

function animateApplicationViewer() {
  applicationAnimationId = requestAnimationFrame(animateApplicationViewer);

  const delta = applicationClock ? applicationClock.getDelta() : 0;

  if (applicationMixer) {
    applicationMixer.update(delta);
  }

  if (applicationControls) {
    applicationControls.update();
  }

  if (applicationRenderer && applicationScene && applicationCamera) {
    applicationRenderer.render(applicationScene, applicationCamera);
  }
}

function resizeApplicationViewer() {
  if (!applicationCamera || !applicationRenderer) return;

  applicationCamera.aspect = window.innerWidth / window.innerHeight;
  applicationCamera.updateProjectionMatrix();

  applicationRenderer.setSize(window.innerWidth, window.innerHeight);
}

function destroyApplicationViewer() {
  const container = document.querySelector("#applicationViewer");

  if (applicationAnimationId) {
    cancelAnimationFrame(applicationAnimationId);
    applicationAnimationId = null;
  }

  if (applicationControls) {
    applicationControls.dispose();
  }

  if (applicationRenderer) {
    applicationRenderer.dispose();
  }

  if (container) {
    container.innerHTML = "";
  }

  applicationScene = null;
  applicationCamera = null;
  applicationRenderer = null;
  applicationControls = null;
  applicationModel = null;
  applicationMixer = null;
  applicationClock = null;

  window.removeEventListener("resize", resizeApplicationViewer);
}

function prepareAssembleAnimation(modelRoot) {
  assembleAnimationParts = [];

  modelRoot.updateMatrixWorld(true);

  let partsRoot = modelRoot;

  while (
    partsRoot.children.length === 1 &&
    !partsRoot.children[0].isMesh
  ) {
    partsRoot = partsRoot.children[0];
  }

  const candidateParts = partsRoot.children.filter((child) => {
    const box = new THREE.Box3().setFromObject(child);
    const size = new THREE.Vector3();
    box.getSize(size);

    return child.visible && size.length() > 0.001;
  });

  candidateParts.forEach((part) => {
    const parent = part.parent;
    const finalPosition = part.position.clone();
    const name = part.name.toLowerCase();

    let direction = 0;

    if (name.includes("far-left") || name.includes("far_left")) {
      direction = -2;
    } else if (name.includes("left")) {
      direction = -1;
    } else if (name.includes("center") || name.includes("middle")) {
      direction = 0;
    } else if (name.includes("far-right") || name.includes("far_right")) {
      direction = 2;
    } else if (name.includes("right")) {
      direction = 1;
    }

    const box = new THREE.Box3().setFromObject(part);
    const center = box.getCenter(new THREE.Vector3());

    const worldEnd = center.clone();

    const worldStart = center.clone().add(
      new THREE.Vector3(
        0,
        0,
        direction * EXPLODE_DISTANCE
      )
    );

    const localEnd = parent.worldToLocal(worldEnd.clone());
    const localStart = parent.worldToLocal(worldStart.clone());

    const localOffset = localStart.sub(localEnd);
    const startPosition = finalPosition.clone().add(localOffset);

    part.position.copy(startPosition);

    assembleAnimationParts.push({
      mesh: part,
      startPosition,
      finalPosition
    });
  });

  console.log("Assemble animation parts:", assembleAnimationParts.length);
}

function animateExplodedViewer() {
  explodedAnimationId = requestAnimationFrame(animateExplodedViewer);

  if (explodedControls) {
    explodedControls.update();
  }

  if (explodedParts.length > 0 && explodedStartTime !== null) {
    const elapsed = performance.now() - explodedStartTime;

    const rawProgress = Math.min(elapsed / EXPLODE_DURATION, 1);

    const easedProgress = easeInOutCubic(rawProgress);

    explodedParts.forEach((part) => {
      part.mesh.position.lerpVectors(
        part.originalPosition,
        part.explodedPosition,
        easedProgress
      );
    });
  }

  if (explodedRenderer && explodedScene && explodedCamera) {
    explodedRenderer.render(explodedScene, explodedCamera);
  }
}

function easeInOutCubic(t) {
  if (t < 0.5) {
    return 4 * t * t * t;
  }

  return 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function resizeExplodedViewer() {
  if (!explodedCamera || !explodedRenderer) return;

  explodedCamera.aspect = window.innerWidth / window.innerHeight;
  explodedCamera.updateProjectionMatrix();

  explodedRenderer.setSize(window.innerWidth, window.innerHeight);
}

function destroyExplodedViewer() {
  const container = document.querySelector("#explodedViewer");

  if (explodedAnimationId) {
    cancelAnimationFrame(explodedAnimationId);
    explodedAnimationId = null;
  }

  if (explodedControls) {
    explodedControls.dispose();
  }

  if (explodedRenderer) {
    explodedRenderer.dispose();
  }

  if (container) {
    container.innerHTML = "";
  }

  explodedScene = null;
  explodedCamera = null;
  explodedRenderer = null;
  explodedControls = null;
  explodedModel = null;
  explodedParts = [];
  explodedStartTime = null;

  window.removeEventListener("resize", resizeExplodedViewer);
}

function captureViewerState(camera, controls, model) {
  if (!camera || !controls || !model) {
    return null;
  }

  // Force OrbitControls to finish its latest update before saving
  controls.update();

  return {
    cameraPosition: camera.position.clone(),
    controlsTarget: controls.target.clone(),
    modelRotation: model.rotation.clone(),
    modelQuaternion: model.quaternion.clone(),
    modelScale: model.scale.clone()
  };
}

function saveProductViewState() {
  const state = captureViewerState(threeCamera, threeControls, threeModel);

  if (!state) {
    console.log("Could not save S4 product view state");
    return;
  }

  savedProductViewState = state;
  latestViewerState = state;

  console.log("Saved latest viewer state from S4");
}

function saveExplodedViewState() {
  const state = captureViewerState(explodedCamera, explodedControls, explodedModel);

  if (!state) {
    console.log("Could not save S5 exploded view state");
    return;
  }

  savedExplodedViewState = state;
  latestViewerState = state;

  console.log("Saved latest viewer state from S5");
}

function getLatestViewerState() {
  return latestViewerState || savedExplodedViewState || savedProductViewState;
}



/* =========================================================
   8. INITIAL STATE + BROWSER BACK
========================================================= */

history.replaceState({ screen: "s0" }, "", "#s0");

window.addEventListener("popstate", (event) => {
  const screen = event.state?.screen || "s0";
  showScreen(screen, false);
});


/* =========================================================
   9. MINDAR CAMERA / SCANNER
========================================================= */

function waitForARSceneReady() {
  return new Promise((resolve) => {
    if (!arScene) {
      resolve();
      return;
    }

    if (arScene.hasLoaded) {
      resolve();
    } else {
      arScene.addEventListener("loaded", () => {
        resolve();
      });
    }
  });
}

function forceIOSVideoAttrs() {
  const video = document.querySelector("video");

  if (!video) return false;

  video.setAttribute("playsinline", "true");
  video.setAttribute("webkit-playsinline", "true");
  video.setAttribute("autoplay", "true");

  video.muted = true;
  video.playsInline = true;

  video.style.display = "block";
  video.style.opacity = "1";
  video.style.zIndex = "0";

  const playPromise = video.play();

  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {});
  }

  return true;
}

async function startARScanner() {
  console.log("startARScanner called");

  targetAlreadyHandled = false;
  destroyThreeViewer();

  showScreen("s2");

  if (scanInstruction) {
    scanInstruction.textContent = "Starting camera...";
  }

  await waitForARSceneReady();

  try {
    if (!arScene) {
      throw new Error("AR scene not found");
    }

    const arSystem = arScene.systems["mindar-image-system"];

    if (!arSystem) {
      throw new Error("MindAR system not found");
    }

    if (arStarted) {
      try {
        arSystem.stop();
        arStarted = false;
        console.log("Previous MindAR session stopped before restart");
      } catch (stopError) {
        console.warn("Could not stop previous MindAR session:", stopError);
      }
    }

    await arSystem.start();
    arStarted = true;

    console.log("MindAR started successfully");

    let tries = 0;
    const videoFixInterval = setInterval(() => {
      tries++;

      const fixed = forceIOSVideoAttrs();

      if (fixed || tries > 120) {
        clearInterval(videoFixInterval);
      }
    }, 100);

    if (scanInstruction) {
      scanInstruction.textContent =
        "Point your camera at the product image on the flyer.";
    }

  } catch (error) {
    console.error("AR start error:", error);

    if (scanInstruction) {
      scanInstruction.textContent =
        "AR camera could not start. Please check HTTPS and camera permission.";
    }

    alert("AR camera could not start. Check HTTPS, camera permission, and console.");
  }
}

function stopARScanner() {
  if (!arScene || !arStarted) return;

  try {
    const arSystem = arScene.systems["mindar-image-system"];

    if (arSystem) {
      arSystem.stop();
    }

    arStarted = false;
    console.log("MindAR stopped");

  } catch (error) {
    console.warn("Could not stop MindAR:", error);
  }

  document.querySelectorAll("video").forEach((video) => {
    if (video.srcObject) {
      video.srcObject.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }
  });
}


/* =========================================================
   10. AR EVENTS
========================================================= */

if (arScene) {
  arScene.addEventListener("arReady", () => {
    console.log("MindAR ready");

    if (scanInstruction) {
      scanInstruction.textContent =
        "AR ready. Point your camera at the flyer image.";
    }
  });

  arScene.addEventListener("arError", () => {
    console.log("MindAR error");

    if (scanInstruction) {
      scanInstruction.textContent =
        "AR could not start. Please check camera permission.";
    }
  });
}

imageTargets.forEach((target) => {
  target.addEventListener("targetFound", () => {
    if (targetAlreadyHandled) return;

    const productId = target.dataset.productId;

    if (!productId) {
      console.warn("No product ID assigned to detected image target.");
      return;
    }

    const detectedProduct = getProductById(productId);

    if (!detectedProduct) {
      console.warn(`No product found for target: ${productId}`);
      return;
    }

    targetAlreadyHandled = true;

    console.log("Image target found:", productId);

    if (scanInstruction) {
      scanInstruction.textContent = `${detectedProduct.name} detected.`;
    }

    // Stop MindAR after detection because S4 uses the Three.js viewer.
    stopARScanner();
    openProductView(productId);
  });

  target.addEventListener("targetLost", () => {
    console.log("Image target lost:", target.dataset.productId);
  });
});

function renderProductionProcess() {
  const steps = currentProduct?.productionSteps || [];
  const step = steps[currentProcessIndex];

  if (!step) return;

  if (productionGif) {
    productionGif.src = step.gif;
  }

  if (processName) {
    processName.textContent = step.name;
  }

  if (productionProcessText) {
    productionProcessText.textContent = step.text;
  }

  renderProcessDots();
}

function renderProcessDots() {
  if (!processDots) return;

  processDots.innerHTML = "";

  const steps = currentProduct?.productionSteps || [];

  steps.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "process-dot";

    if (index === currentProcessIndex) {
      dot.classList.add("active");
    }

    dot.addEventListener("click", () => {
      currentProcessIndex = index;
      renderProductionProcess();
    });

    processDots.appendChild(dot);
  });
}

function showNextProcess() {
  currentProcessIndex++;

  const steps = currentProduct?.productionSteps || [];

  if (currentProcessIndex >= steps.length) {
    currentProcessIndex = 0;
  }

  renderProductionProcess();
}

function showPreviousProcess() {
  currentProcessIndex--;

  const steps = currentProduct?.productionSteps || [];

  if (currentProcessIndex < 0) {
    currentProcessIndex = steps.length - 1;
  }

  renderProductionProcess();
}

let processTouchStartX = 0;

const productionCarousel = document.querySelector(".production-carousel");

if (productionCarousel) {
  productionCarousel.addEventListener("touchstart", (event) => {
    processTouchStartX = event.touches[0].clientX;
  });

  productionCarousel.addEventListener("touchend", (event) => {
    const touchEndX = event.changedTouches[0].clientX;
    const difference = touchEndX - processTouchStartX;

    if (Math.abs(difference) > 40) {
      if (difference < 0) {
        showNextProcess();
      } else {
        showPreviousProcess();
      }
    }
  });
}

function fadeOutViewer(viewerId) {
  const viewer = document.querySelector(viewerId);

  if (!viewer) return;

  viewer.classList.remove("viewer-fade-visible");
  viewer.classList.add("viewer-fade-hidden");
}

function fadeInViewer(viewerId) {
  const viewer = document.querySelector(viewerId);

  if (!viewer) return;

  viewer.classList.remove("viewer-fade-hidden");
  viewer.classList.add("viewer-fade-visible");
}


/* =========================================================
   11. MAIN SCREEN BUTTONS
========================================================= */

addClick(startButton, () => {
  showScreen("s1");
});

addClick(allowCameraBtn, () => {
  startARScanner();
});

addClick(skipCameraBtn, () => {
  showScreen("s3");
});


/* =========================================================
   12. S3 INDUSTRY NAVIGATION
========================================================= */

addClick(assemblyLineBtn, () => {
  showScreen("s8");
});

addClick(automotiveBtn, () => {
  showScreen("s9");
});

addClick(electronicBtn, () => {
  showScreen("s10");
});

addClick(energyBtn, () => {
  showScreen("s11");
});

addClick(medicalBtn, () => {
  showScreen("s12");
});

/* =========================================================
   12. S4 INDUSTRY NAVIGATION
========================================================= */

addClick(explodedViewBtn, () => {
  saveProductViewState();

  fadeOutViewer("#threeViewer");

  setTimeout(() => {
    updateProductHeading(currentProduct);
    showScreen("s5");

    const explodedViewer = document.querySelector("#explodedViewer");
    if (explodedViewer) {
      explodedViewer.classList.add("viewer-fade-hidden");
    }

    initExplodedViewer(getCurrentProductModelPath(), getLatestViewerState());

    setTimeout(() => {
      fadeInViewer("#explodedViewer");
    }, 100);
  }, 350);
});

addClick(explodedViewBtnS5, () => {
  // Already on S5
});

addClick(productionProcessBtnS5, () => {
  // Save the latest S5 zoom/orientation before leaving S5
  saveExplodedViewState();

  currentProcessIndex = 0;
  renderProductionProcess();
  showScreen("s6");
});

addClick(applicationViewBtnS5, () => {
  saveExplodedViewState();

  fadeOutViewer("#explodedViewer");

  setTimeout(() => {
    updateProductHeading(currentProduct);
    showScreen("s7");

    const applicationViewer = document.querySelector("#applicationViewer");
    if (applicationViewer) {
      applicationViewer.classList.add("viewer-fade-hidden");
    }

    initApplicationViewer(getCurrentApplicationModelPath(), savedExplodedViewState || savedProductViewState);

    setTimeout(() => {
      fadeInViewer("#applicationViewer");
    }, 100);
  }, 350);
});

addClick(productionProcessBtn, () => {
  currentProcessIndex = 0;
  renderProductionProcess();
  showScreen("s6");
});

addClick(applicationViewBtn, () => {
  saveProductViewState();

  fadeOutViewer("#threeViewer");

  setTimeout(() => {
    updateProductHeading(currentProduct);
    showScreen("s7");

    const applicationViewer = document.querySelector("#applicationViewer");
    if (applicationViewer) {
      applicationViewer.classList.add("viewer-fade-hidden");
    }

    initApplicationViewer(getCurrentApplicationModelPath(), savedProductViewState);

    setTimeout(() => {
      fadeInViewer("#applicationViewer");
    }, 100);
  }, 350);
});

addClick(productionProcessBtnS6, () => {
  // Already on S6
});

addClick(explodedViewBtnS6, () => {
  updateProductHeading(currentProduct);

  showScreen("s5");

  const explodedViewer = document.querySelector("#explodedViewer");
  if (explodedViewer) {
    explodedViewer.classList.add("viewer-fade-hidden");
  }

  setTimeout(() => {
    initExplodedViewer(getCurrentProductModelPath(), getLatestViewerState());

    setTimeout(() => {
      fadeInViewer("#explodedViewer");
    }, 100);
  }, 100);
});

addClick(applicationViewBtnS6, () => {
  updateProductHeading(currentProduct);

  showScreen("s7");

  const applicationViewer = document.querySelector("#applicationViewer");
  if (applicationViewer) {
    applicationViewer.classList.add("viewer-fade-hidden");
  }

  setTimeout(() => {
    initApplicationViewer(getCurrentApplicationModelPath(), savedExplodedViewState || savedProductViewState);

    setTimeout(() => {
      fadeInViewer("#applicationViewer");
    }, 100);
  }, 100);
});

addClick(applicationViewBtnS7, () => {
  // Already on S7
});

addClick(productionProcessBtnS7, () => {
  currentProcessIndex = 0;
  renderProductionProcess();
  showScreen("s6");
});

addClick(explodedViewBtnS7, () => {
  updateProductHeading(currentProduct);

  showScreen("s5");

  const explodedViewer = document.querySelector("#explodedViewer");
  if (explodedViewer) {
    explodedViewer.classList.add("viewer-fade-hidden");
  }

  setTimeout(() => {
    initExplodedViewer(getCurrentProductModelPath(), savedExplodedViewState || savedProductViewState);

    setTimeout(() => {
      fadeInViewer("#explodedViewer");
    }, 100);
  }, 100);
});

/* =========================================================
   13. COMMON BOTTOM NAVIGATION
========================================================= */

addClick(homeNavBtn, () => {
  showScreen("s3");
});

addClick(rescanNavBtn, () => {
  startARScanner();
});

addClick(backNavBtn, () => {
  if (screens.s5 && !screens.s5.classList.contains("hidden")) {
    saveExplodedViewState();

    returningFromExploded = true;

    fadeOutViewer("#explodedViewer");

    setTimeout(() => {
      showScreen("s4");

      const threeViewer = document.querySelector("#threeViewer");
      if (threeViewer) {
        threeViewer.classList.add("viewer-fade-hidden");
      }

      initThreeViewer(getCurrentProductModelPath(), getLatestViewerState(), true);

      setTimeout(() => {
        fadeInViewer("#threeViewer");
      }, 100);
    }, 350);

    return;
  }

  if (screens.s7 && !screens.s7.classList.contains("hidden")) {
    fadeOutViewer("#applicationViewer");

    setTimeout(() => {
      showScreen("s4");

      const threeViewer = document.querySelector("#threeViewer");
      if (threeViewer) {
        threeViewer.classList.add("viewer-fade-hidden");
      }

      initThreeViewer(getCurrentProductModelPath(), savedProductViewState);

      setTimeout(() => {
        fadeInViewer("#threeViewer");
      }, 100);
    }, 350);

    return;
  }

  showScreen("s4");
});

/* =========================================================
   14. HOTSPOT MANAGEMENT
========================================================= */

function closeAllHotspots() {
  // Reset normal product hotspots in S9-S12.
  document
    .querySelectorAll(".hotspot-button:not(.process-hotspot-button)")
    .forEach((button) => {
      const icon = button.querySelector(".hotspot-icon");
      const label = button.querySelector(".hotspot-label");

      if (icon) icon.textContent = "+";
      if (label) label.classList.add("hidden");

      button.classList.remove("open");
    });

  // Reset all S8 process cards and icons.
  closeProcessCards();
}


/* =========================================================
   15. NORMAL HOTSPOTS S9-S12
========================================================= */

document.querySelectorAll(".hotspot-button:not(.process-hotspot-button)").forEach((button) => {
  button.addEventListener("click", () => {
    const icon = button.querySelector(".hotspot-icon");
    const label = button.querySelector(".hotspot-label");

    if (!icon || !label) return;

    const isOpen = button.classList.contains("open");

    if (isOpen) {
      icon.textContent = "+";
      label.classList.add("hidden");
      button.classList.remove("open");
    } else {
      closeAllHotspots();

      icon.textContent = "×";
      label.classList.remove("hidden");
      button.classList.add("open");
    }
  });
});

document.querySelectorAll(".hotspot-label").forEach((label) => {
  label.addEventListener("click", (event) => {
    event.stopPropagation();

    const productId = label.dataset.productId;

    if (!productId) {
      console.warn("No product ID found on hotspot label");
      return;
    }

    openProductView(productId);
  });
});


/* =========================================================
   16. S8 PROCESS HOTSPOTS
========================================================= */



const processHotspotButtons = document.querySelectorAll(
  ".process-hotspot-button"
);

const processCards = document.querySelectorAll(
  ".process-info-card"
);

function closeProcessCards() {
  processCards.forEach((card) => {
    card.classList.add("hidden");
  });

  processHotspotButtons.forEach((button) => {
    const icon = button.querySelector(".hotspot-icon");

    if (icon) {
      icon.textContent = "+";
    }

    button.classList.remove("open");
  });
}

processHotspotButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const cardId = button.dataset.card;

    if (!cardId) {
      console.warn("Missing data-card on S8 process hotspot.");
      return;
    }

    const card = document.getElementById(cardId);

    if (!card) {
      console.warn(`Process card not found: ${cardId}`);
      return;
    }

    closeProcessCards();

    card.classList.remove("hidden");

    const icon = button.querySelector(".hotspot-icon");

    if (icon) {
      icon.textContent = "×";
    }

    button.classList.add("open");
  });
});

document.querySelectorAll(".process-card-close").forEach((closeButton) => {
  closeButton.addEventListener("click", (event) => {
    event.stopPropagation();
    closeProcessCards();
  });
});