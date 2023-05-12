import * as THREE from "https://esm.run/three";
import { RectAreaLightHelper } from "https://esm.run/three/addons/helpers/RectAreaLightHelper.js";

let currentObject = null;
const LIGHTHEIGHT = 3;

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();
renderer.setSize((window.innerWidth * 90) / 100, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 10);

// Afficher le type de projection (frustum) de la caméra
const cameraHelper = new THREE.CameraHelper(camera);
scene.add(cameraHelper);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, LIGHTHEIGHT, 0);
scene.add(directionalLight);

// Afficher la direction de la lumière directionnelle
let dirLightHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(dirLightHelper);

const materialLambert = new THREE.MeshLambertMaterial({ color: 0xffffff });

const geometryTorus = new THREE.TorusGeometry(2, 0.5, 16, 100);
const torus = new THREE.Mesh(geometryTorus, materialLambert);
torus.position.set(-4, -1, 0);
scene.add(torus);

const geometryCone = new THREE.ConeGeometry(1, 2, 32);
const cone = new THREE.Mesh(geometryCone, materialLambert);
cone.position.set(4, -1, 0);
scene.add(cone);

const renderer2 = new THREE.WebGLRenderer();
renderer2.setSize((window.innerWidth * 90) / 100, window.innerHeight);
document.body.appendChild(renderer2.domElement);

const camera2 = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera2.position.set(15, 5, 15);
camera2.lookAt(scene.position);

// Afficher le repère du monde
const worldAxes = new THREE.AxesHelper(5);
worldAxes.position.set(0, 0, 11);
scene.add(worldAxes);

function changeLightType(type) {
  // Supprimer l'éclairage actuel
  scene.remove(directionalLight);
  scene.remove(dirLightHelper);

  // Ajouter un nouvel éclairage en fonction de la sélection
  switch (type) {
    case "point":
      directionalLight = new THREE.PointLight(0xffffff, 1);
      dirLightHelper = new THREE.PointLightHelper(directionalLight);
      break;
    case "spot":
      directionalLight = new THREE.SpotLight(0xffffff, 1);
      dirLightHelper = new THREE.SpotLightHelper(directionalLight);
      break;
    case "hemisphere":
      directionalLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
      dirLightHelper = new THREE.HemisphereLightHelper(directionalLight);
      break;
    case "rectArea":
      // Les RectAreaLights n'ont pas de helper dédié, donc nous n'en créerons pas un
      directionalLight = new THREE.RectAreaLight(0xffffff, 5, 5, 5);
      dirLightHelper = new RectAreaLightHelper(directionalLight);
      break;
    default:
      directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      dirLightHelper = new THREE.DirectionalLightHelper(directionalLight);
      break;
  }

  directionalLight.position.set(0, LIGHTHEIGHT, 0);
  scene.add(directionalLight);

  // Mettre à jour l'aide de l'éclairage dans la scène
  if (dirLightHelper !== null) {
    scene.add(dirLightHelper);
  }
}

function changeMaterialType(type) {
  let newMaterial;

  switch (type) {
    case "phong":
      newMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
      break;
    default:
      newMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
      break;
  }

  scene.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
      child.material = newMaterial;
    }
  });
}

function changeBaseObject(type) {
  // Supprimer l'objet de base actuel
  if (currentObject) {
    scene.remove(currentObject);
  }

  // Ajouter un nouvel objet de base en fonction de la sélection
  let newGeometry;
  const material = new THREE.MeshLambertMaterial({ color: 0xffffff });

  switch (type) {
    case "cone":
      newGeometry = new THREE.ConeGeometry(1, 2, 32);
      break;
    case "sphere":
      newGeometry = new THREE.SphereGeometry(1, 32, 32);
      break;
    case "cube":
      newGeometry = new THREE.BoxGeometry(1, 1, 1);
      break;
    default:
      newGeometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
      break;
  }

  const mesh = new THREE.Mesh(newGeometry, material);
  scene.add(mesh);
  currentObject = mesh; // Stocker le nouvel objet dans la variable globale
}

// Lumière directionnelle
document
  .getElementById("dirLightColor")
  .addEventListener("input", function (event) {
    const newColor = new THREE.Color(event.target.value);
    directionalLight.color = newColor;
    dirLightHelper.color = newColor;
  });

document
  .getElementById("dirLightIntensity")
  .addEventListener("input", function (event) {
    directionalLight.intensity = parseFloat(event.target.value);
  });

// Lumière ambiante
document
  .getElementById("ambientLightColor")
  .addEventListener("input", function (event) {
    ambientLight.color = new THREE.Color(event.target.value);
  });

document
  .getElementById("ambientLightIntensity")
  .addEventListener("input", function (event) {
    ambientLight.intensity = parseFloat(event.target.value);
  });

document
  .getElementById("lightType")
  .addEventListener("change", function (event) {
    changeLightType(event.target.value);
  });

document
  .getElementById("materialType")
  .addEventListener("change", function (event) {
    changeMaterialType(event.target.value);
  });

document
  .getElementById("baseObject")
  .addEventListener("change", function (event) {
    changeBaseObject(event.target.value);
  });

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;

  cone.rotation.x += 0.01;
  cone.rotation.y += 0.01;

  if (currentObject) {
    // Ajouter cette condition pour vérifier si currentObject existe
    currentObject.rotation.x += 0.01;
    currentObject.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
  renderer2.render(scene, camera2);
}

animate();
