---
title: Three.js 详细文档
icon: terminal
# order: 2
date: 2025-12-30
category:
  - 使用指南
tag:
  - threejs
  - 3d
  - webgl
  - javascript
---

<div style="font-weight:700; ">Three.js 是一个轻量级的跨浏览器 JavaScript 库，用于在网页上创建和显示 3D 图形。它基于 WebGL 技术，提供了一套简单易用的 API，使开发者能够快速创建复杂的 3D 场景。</div>

<!-- more -->

## 1. 什么是 Three.js

Three.js 是一个开源的 JavaScript 3D 库，由 Ricardo Cabello（mrdoob）于 2010 年创建。它封装了复杂的 WebGL API，提供了更简洁、更易用的接口，使开发者能够在不深入了解 WebGL 底层细节的情况下创建 3D 图形和动画。

主要特点：
- 跨浏览器兼容性
- 丰富的几何图形和材质
- 支持动画和交互
- 支持加载各种 3D 模型格式
- 内置灯光、阴影和相机系统
- 可扩展的插件系统

## 2. 核心概念

### 2.1 场景 (Scene)

场景是 Three.js 中所有 3D 对象的容器，相当于一个虚拟的 3D 空间。所有的相机、灯光、几何体等都需要添加到场景中才能被渲染。

```javascript
const scene = new THREE.Scene();
```

#### 雾效 (Fog)

Three.js 提供了雾效功能，可以模拟真实世界中的雾、霾等大气效果，增强场景的深度感和氛围。

##### 线性雾 (Fog)

线性雾的密度在近裁剪面和远裁剪面之间线性变化。

```javascript
// 参数：雾的颜色，雾开始的距离，雾结束的距离
scene.fog = new THREE.Fog(0xffffff, 10, 50);
```

##### 指数雾 (FogExp2)

指数雾的密度随距离指数增长，提供更自然的雾效。

```javascript
// 参数：雾的颜色，雾的密度
scene.fog = new THREE.FogExp2(0xffffff, 0.02);
```

雾效会影响场景中所有物体的颜色，使远处的物体逐渐与雾的颜色融为一体。

### 2.2 相机 (Camera)

相机决定了哪些部分的场景会被渲染到屏幕上。Three.js 提供了多种相机类型，最常用的是透视相机（PerspectiveCamera）和正交相机（OrthographicCamera）。

#### 透视相机

透视相机模拟人眼的视觉效果，近大远小。

```javascript
// 参数：视野角度，宽高比，近裁剪面，远裁剪面
let aspectRatio = window.innerWidth / window.innerHeight
const camera = new THREE.PerspectiveCamera(75, aspectRatio , 0.1, 1000);
camera.position.z = 5; // 设置相机位置
```

#### 正交相机

正交相机不考虑透视效果，物体大小不随距离变化，常用于 2D 游戏或工程制图。

```javascript
// 参数：左，右，上，下，近裁剪面，远裁剪面
const left = -width / 2
const right = width / 2
const top =  height / 2
const bottom = -height / 2

const camera = new THREE.OrthographicCamera(left, right, top, bottom, 0.1, 1000);
```

### 2.3 渲染器 (Renderer)

渲染器负责将场景和相机的内容渲染到 HTML 元素中（通常是 canvas）。

```javascript
// antialias 开启抗锯齿
const renderer = new THREE.WebGLRenderer({ antialias: true }); 

renderer.setSize(window.innerWidth, window.innerHeight); // 设置渲染尺寸
renderer.setClearColor(0x000000, 1); // 设置背景颜色
renderer.shadowMap.enabled = true; // 开启阴影映射

document.body.appendChild(renderer.domElement); // 将渲染器的 canvas 添加到页面
```

### 2.4 几何体 (Geometry)

几何体定义了 3D 对象的形状，Three.js 提供了各种内置几何体，如立方体、球体、圆柱体等。

```javascript
// 立方体几何体：宽，高，深
const geometry = new THREE.BoxGeometry(1, 1, 1);

// 球体几何体：半径，水平分段数，垂直分段数
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);

// 圆柱体几何体：顶部半径，底部半径，高度，径向分段数
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
```

### 2.4.1 高级几何体操作

#### BufferGeometry

BufferGeometry 是 Three.js 中更高效的几何体表示方式，直接使用 WebGL 缓冲来存储顶点数据，比传统的 Geometry 类性能更高，尤其适合处理大量顶点数据的场景。

```javascript
// 创建空的 BufferGeometry
const geometry = new THREE.BufferGeometry();

// 创建顶点数据
const vertices = new Float32Array([
    -1.0, -1.0,  1.0, // 顶点 0
     1.0, -1.0,  1.0, // 顶点 1
     1.0,  1.0,  1.0, // 顶点 2
     1.0,  1.0,  1.0, // 顶点 3
    -1.0,  1.0,  1.0, // 顶点 4
    -1.0, -1.0,  1.0  // 顶点 5
]);

// 创建颜色数据
const colors = new Float32Array([
    1.0, 0.0, 0.0, // 红色
    0.0, 1.0, 0.0, // 绿色
    0.0, 0.0, 1.0, // 蓝色
    0.0, 0.0, 1.0, // 蓝色
    1.0, 1.0, 0.0, // 黄色
    1.0, 0.0, 0.0  // 红色
]);

// 设置几何体属性
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// 创建材质，启用顶点颜色
const material = new THREE.MeshBasicMaterial({ vertexColors: true });
```

#### 几何体变形和动画

```javascript
// 获取几何体的位置属性
const positionAttribute = geometry.attributes.position;

// 动画函数
function animate() {
    requestAnimationFrame(animate);
    
    for (let i = 0; i < positionAttribute.count; i++) {
        // 在 Y 轴上添加正弦波动画
        const y = positionAttribute.getY(i);
        positionAttribute.setY(i, y + Math.sin(Date.now() * 0.001 + i) * 0.01);
    }
    
    positionAttribute.needsUpdate = true; // 标记属性需要更新
    
    renderer.render(scene, camera);
}
```

### 2.5 材质 (Material)

材质定义了 3D 对象的表面外观，包括颜色、纹理、光泽度等。

```javascript
// 基础材质：只显示颜色，不受光照影响
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

// 标准材质：受光照影响，更真实的效果
const standardMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x00ff00,
  metalness: 0.5,
  roughness: 0.5
});

//  phong 材质：经典的光照模型
const phongMaterial = new THREE.MeshPhongMaterial({ 
  color: 0x00ff00,
  shininess: 100
});
```

### 2.5.1 高级材质特性

#### 自定义着色器 (ShaderMaterial)

ShaderMaterial 允许开发者直接编写 GLSL（OpenGL Shading Language）代码来控制材质的渲染效果，提供了最大的灵活性和自定义能力。

```javascript
// 创建自定义着色器材质
const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 0.0 },
        color: { value: new THREE.Color(0x00ff00) }
    },
    vertexShader: `
        uniform float time;
        varying vec2 vUv;
        
        void main() {
            vUv = uv;
            
            // 在顶点着色器中添加动画效果
            vec3 newPosition = position;
            newPosition.x += sin(time + position.y) * 0.1;
            newPosition.z += cos(time + position.y) * 0.1;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec2 vUv;
        
        void main() {
            // 在片元着色器中创建复杂的颜色效果
            vec3 finalColor = color;
            finalColor.r += sin(vUv.x * 10.0 + time) * 0.5;
            finalColor.g += cos(vUv.y * 10.0 + time) * 0.5;
            
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `
});

// 在动画循环中更新着色器 uniform
function animate() {
    requestAnimationFrame(animate);
    
    shaderMaterial.uniforms.time.value += 0.01;
    
    renderer.render(scene, camera);
}
```

使用 ShaderMaterial 时，需要提供两个着色器：
- **顶点着色器 (vertexShader)**：负责处理顶点的位置、变换等
- **片元着色器 (fragmentShader)**：负责处理像素的颜色、光照等

Uniforms 是可以从 JavaScript 传递到着色器的变量，用于控制着色器的行为。

#### 纹理映射 (Texture Mapping)

```javascript
import { TextureLoader } from 'three';

const textureLoader = new TextureLoader();
const colorTexture = textureLoader.load('textures/color.jpg');
const normalTexture = textureLoader.load('textures/normal.jpg');
const displacementTexture = textureLoader.load('textures/displacement.jpg');
const roughnessTexture = textureLoader.load('textures/roughness.jpg');
const metalnessTexture = textureLoader.load('textures/metalness.jpg');

const material = new THREE.MeshStandardMaterial({
    map: colorTexture,              // 颜色贴图
    normalMap: normalTexture,       // 法线贴图
    displacementMap: displacementTexture, // 置换贴图
    displacementScale: 0.1,         // 置换缩放
    roughnessMap: roughnessTexture, // 粗糙度贴图
    metalnessMap: metalnessTexture  // 金属度贴图
});
```

#### 环境贴图 (Environment Mapping)

环境贴图用于模拟物体反射周围环境的效果。

```javascript
import { CubeTextureLoader } from 'three';

const cubeTextureLoader = new CubeTextureLoader();
const environmentMap = cubeTextureLoader.load([
    'textures/px.jpg', // 正 X
    'textures/nx.jpg', // 负 X
    'textures/py.jpg', // 正 Y
    'textures/ny.jpg', // 负 Y
    'textures/pz.jpg', // 正 Z
    'textures/nz.jpg'  // 负 Z
]);

const material = new THREE.MeshStandardMaterial({
    envMap: environmentMap,
    metalness: 1,
    roughness: 0
});
```

#### 环境光遮蔽 (Ambient Occlusion)

环境光遮蔽是一种模拟环境光照中遮挡效果的技术，可以增强场景的真实感，特别是在物体的角落和缝隙处，这些地方通常会有更暗的阴影效果。

##### 使用 AO 贴图

最常用的方法是使用预先生成的 AO 贴图：

```javascript
// 加载 AO 贴图
const aoTexture = textureLoader.load('textures/ao.jpg');

const material = new THREE.MeshStandardMaterial({
    map: colorTexture,
    normalMap: normalTexture,
    aoMap: aoTexture,      // AO 贴图
    aoMapIntensity: 1.0   // AO 强度
});

// 确保几何体有第二组 UV 坐标用于 AO 贴图
geometry.setAttribute('uv2', new THREE.BufferAttribute(geometry.attributes.uv.array, 2));
```

##### 屏幕空间环境光遮蔽 (SSAO)

SSAO 是一种实时环境光遮蔽技术，通过后期处理实现：

```javascript
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';

// 创建 SSAO 后期处理通道
const ssaoPass = new SSAOPass(scene, camera, window.innerWidth, window.innerHeight);
ssaoPass.kernelRadius = 8;      // 内核半径
ssaoPass.minDistance = 0.001;   // 最小距离
ssaoPass.maxDistance = 0.05;    // 最大距离
ssaoPass.output = SSAOPass.OUTPUT.Default;

// 添加到效果合成器
composer.addPass(ssaoPass);
```

环境光遮蔽可以显著提升场景的视觉质量，使物体之间的关系更加真实，增强深度感。

#### 2.5.2 特殊材质类型

Three.js 提供了多种特殊用途的材质，用于实现特定的视觉效果或满足特殊需求：

##### MeshLambertMaterial

基于 Lambert 光照模型的材质，对光照有反应，但不支持高光效果，计算效率较高。

```javascript
const material = new THREE.MeshLambertMaterial({
    color: 0x00ff00,
    transparent: true,
    opacity: 0.5,
    wireframe: false
});
```

##### MeshToonMaterial

卡通风格的材质，使用预定义的色彩渐变创建类似卡通的效果。

```javascript
// 基础卡通材质
const material = new THREE.MeshToonMaterial({
    color: 0x00ff00,
    gradientMap: gradientTexture // 可选：自定义渐变纹理
});

// 使用纹理的卡通材质
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('textures/character.jpg');
const toonMaterial = new THREE.MeshToonMaterial({
    map: texture
});
```

##### MeshNormalMaterial

显示物体法线方向的材质，法线方向映射到 RGB 颜色，常用于调试和特殊视觉效果。

```javascript
const material = new THREE.MeshNormalMaterial({
    flatShading: true, // 平面着色
    side: THREE.DoubleSide // 双面显示
});
```

##### MeshDepthMaterial

基于深度信息的材质，用于创建深度渲染效果或阴影贴图。

```javascript
const material = new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking,
    displacementMap: displacementTexture, // 可选：置换贴图
    displacementScale: 0.1
});
```

##### MeshDistanceMaterial

基于距离相机远近的材质，用于创建基于距离的效果。

```javascript
const material = new THREE.MeshDistanceMaterial({
    depthPacking: THREE.RGBADepthPacking,
    displacementMap: displacementTexture,
    displacementScale: 0.1,
    fog: true
});
```

##### PointsMaterial

专门用于粒子系统的材质，控制粒子的大小、颜色等属性。

```javascript
const material = new THREE.PointsMaterial({
    size: 0.1,
    color: 0xffffff,
    map: particleTexture, // 可选：粒子纹理
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true // 粒子大小是否随距离衰减
});
```

##### LineBasicMaterial 和 LineDashedMaterial

用于线条的材质，LineBasicMaterial 创建实线，LineDashedMaterial 创建虚线。

```javascript
// 实线材质
const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    linewidth: 2
});

// 虚线材质
const dashedLineMaterial = new THREE.LineDashedMaterial({
    color: 0xffffff,
    dashSize: 0.5,
    gapSize: 0.2,
    linewidth: 2
});

// 虚线需要计算线段长度
line.computeLineDistances();
```

##### SpriteMaterial

用于精灵（2D 平面总是面向相机）的材质。

```javascript
const material = new THREE.SpriteMaterial({
    color: 0xffffff,
    map: spriteTexture,
    transparent: true,
    opacity: 0.8,
    rotation: Math.PI / 4 // 旋转精灵
});
```

##### ShadowMaterial

用于创建平面阴影效果的材质，通常与平面几何体一起使用。

```javascript
const material = new THREE.ShadowMaterial({
    opacity: 0.5 // 阴影透明度
});
```

这些特殊材质类型为 Three.js 应用提供了丰富的视觉效果选择，开发者可以根据具体需求选择合适的材质。

### 2.6 网格 (Mesh)

网格是几何体和材质的组合，是 Three.js 中可渲染的 3D 对象。

```javascript
const cube = new THREE.Mesh(geometry, material);
scene.add(cube); // 将网格添加到场景
```

## 2.7 辅助工具 (Helpers)

Three.js 提供了多种辅助工具，用于调试和可视化场景中的各种元素，特别是坐标系相关的工具。

### 2.7.1 坐标系工具 (Coordinate System Tools)

#### 坐标轴辅助 (AxesHelper)

坐标轴辅助工具用于显示场景中的三维坐标轴：
- 红色代表 X 轴
- 绿色代表 Y 轴
- 蓝色代表 Z 轴

```javascript
// 参数：轴的长度
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
```

#### 网格辅助 (GridHelper)

网格辅助工具用于显示一个二维网格，帮助定位 3D 对象。

```javascript
// 参数：网格大小，网格分段数，网格颜色，网格线颜色
const gridHelper = new THREE.GridHelper(10, 10, 0x888888, 0x444444);
scene.add(gridHelper);
```

#### 极坐标网格辅助 (PolarGridHelper)

极坐标网格辅助工具用于显示极坐标网格。

```javascript
// 参数：半径，半径分段数，角度分段数，半径颜色，角度颜色
const polarGridHelper = new THREE.PolarGridHelper(10, 16, 8, 64, 0x888888, 0x444444);
scene.add(polarGridHelper);
```

### 2.7.2 相机和灯光辅助

#### 相机辅助 (CameraHelper)

相机辅助工具用于可视化相机的视锥体。

```javascript
const cameraHelper = new THREE.CameraHelper(camera);
scene.add(cameraHelper);
```

#### 灯光辅助 (LightHelper)

灯光辅助工具用于可视化灯光的位置和方向。

```javascript
// 平行光辅助
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
scene.add(directionalLightHelper);

// 点光源辅助
const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
scene.add(pointLightHelper);

// 聚光灯辅助
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);
```

## 2.8 坐标系统和变换

Three.js 使用右手坐标系：
- 正 X 轴向右
- 正 Y 轴向上
- 正 Z 轴向前（从屏幕指向用户）

### 2.8.1 位置变换

```javascript
// 设置位置
mesh.position.set(1, 2, 3);

// 分别设置各轴位置
mesh.position.x = 1;
mesh.position.y = 2;
mesh.position.z = 3;

// 获取位置
console.log(mesh.position.x);
console.log(mesh.position.length()); // 到原点的距离
```

### 2.8.2 旋转变换

```javascript
// 使用欧拉角旋转
mesh.rotation.set(Math.PI/2, 0, 0); // X轴旋转90度

// 分别设置各轴旋转
mesh.rotation.x = Math.PI/2;
mesh.rotation.y = 0;
mesh.rotation.z = 0;

// 使用四元数旋转
mesh.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI/2);
```

### 2.8.3 缩放变换

```javascript
// 设置缩放
mesh.scale.set(2, 2, 2); // 放大2倍

// 分别设置各轴缩放
mesh.scale.x = 2;
mesh.scale.y = 2;
mesh.scale.z = 2;
```

## 2.9 多场景管理 (Multiple Scene Management)

Three.js 允许创建和管理多个独立的场景，这在需要不同视图或场景切换时非常有用。

### 2.9.1 创建多个场景

```javascript
// 创建主场景
const mainScene = new THREE.Scene();
mainScene.background = new THREE.Color(0x000000);

// 创建辅助场景
const auxScene = new THREE.Scene();
auxScene.background = new THREE.Color(0x222222);
```

### 2.9.2 渲染多个场景到同一个画布

可以将多个场景渲染到同一个画布的不同区域：

```javascript
// 创建两个相机，分别用于不同场景
const mainCamera = new THREE.PerspectiveCamera(75, 0.5, 0.1, 1000);
mainCamera.position.z = 5;

const auxCamera = new THREE.PerspectiveCamera(75, 0.5, 0.1, 1000);
auxCamera.position.z = 5;

// 在动画循环中渲染两个场景
function animate() {
    requestAnimationFrame(animate);
    
    // 渲染主场景到左半部分
    renderer.setViewport(0, 0, window.innerWidth / 2, window.innerHeight);
    renderer.render(mainScene, mainCamera);
    
    // 渲染辅助场景到右半部分
    renderer.setViewport(window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
    renderer.render(auxScene, auxCamera);
    
    // 恢复完整视口
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
}
```

### 2.9.3 场景切换

在应用中切换不同的场景：

```javascript
// 定义当前活动场景
let currentScene = mainScene;
let currentCamera = mainCamera;

// 切换场景的函数
function switchScene(scene, camera) {
    currentScene = scene;
    currentCamera = camera;
}

// 使用示例
// switchScene(auxScene, auxCamera);

// 在动画循环中渲染当前场景
function animate() {
    requestAnimationFrame(animate);
    renderer.render(currentScene, currentCamera);
}
```

### 2.9.4 多场景应用场景

- **分屏显示**：同时显示不同视角或不同场景的内容
- **场景预览**：在主场景旁显示缩略图预览
- **场景切换**：游戏中的关卡切换或应用中的不同视图
- **多相机渲染**：使用不同相机渲染同一场景的不同部分

多场景管理为 Three.js 应用提供了更大的灵活性，允许开发者创建复杂的 3D 应用和交互体验。

## 3. 第一个 Three.js 示例

下面是一个完整的 Three.js 示例，创建一个旋转的绿色立方体：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Three.js 入门示例</title>
    <style>
        body { margin: 0; }
        canvas { display: block; }
    </style>
</head>
<body>
    <!-- 引入 Three.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script>
        // 创建场景
        const scene = new THREE.Scene();
        
        // 创建相机
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        
        // 创建渲染器
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        
        // 创建几何体和材质
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        
        // 创建网格
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        
        // 响应窗口大小变化
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // 动画循环
        function animate() {
            requestAnimationFrame(animate);
            
            // 旋转立方体
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            
            // 渲染场景
            renderer.render(scene, camera);
        }
        
        // 启动动画
        animate();
    </script>
</body>
</html>
```

## 4. 动画和交互

### 4.1 动画循环

Three.js 使用 `requestAnimationFrame` API 来创建平滑的动画。通常的做法是创建一个 `animate` 函数，在函数内部更新对象的状态，然后递归调用自身。

```javascript
function animate() {
    requestAnimationFrame(animate);
    
    // 更新对象状态
    mesh.rotation.y += 0.01;
    
    // 渲染场景
    renderer.render(scene, camera);
}

animate();
```

### 4.2 交互

Three.js 提供了 `Raycaster` 类来实现鼠标交互，如点击、悬停等。

```javascript
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// 鼠标移动事件
window.addEventListener('mousemove', (event) => {
    // 将鼠标坐标转换为标准化设备坐标
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// 在动画循环中检测交互
function animate() {
    requestAnimationFrame(animate);
    
    // 更新射线
    raycaster.setFromCamera(mouse, camera);
    
    // 检测与物体的交集
    const intersects = raycaster.intersectObjects(scene.children);
    
    // 处理交集
    for (let i = 0; i < intersects.length; i++) {
        // 例如：悬停时改变颜色
        intersects[i].object.material.color.set(0xff0000);
    }
    
    renderer.render(scene, camera);
}
```

### 4.3 控制器 (Controls)

Three.js 提供了多种控制器，用于轻松实现相机的交互控制。

#### OrbitControls

轨道控制器允许用户通过鼠标或触摸来旋转、缩放和平移相机，围绕场景中的某个点进行观察。

```javascript
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);

// 控制器配置
controls.enableDamping = true; // 启用阻尼效果，使相机移动更平滑
controls.dampingFactor = 0.05; // 阻尼系数
controls.enableZoom = true; // 启用缩放
controls.enablePan = true; // 启用平移
controls.minDistance = 2; // 最小缩放距离
controls.maxDistance = 100; // 最大缩放距离
controls.minPolarAngle = 0; // 最小极角
controls.maxPolarAngle = Math.PI / 2; // 最大极角

// 在动画循环中更新控制器
function animate() {
    requestAnimationFrame(animate);
    
    controls.update(); // 更新控制器状态
    
    renderer.render(scene, camera);
}
```

#### FlyControls

飞行控制器允许用户像在飞船中一样控制相机，通过键盘和鼠标实现移动、旋转和加速。

```javascript
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';

const controls = new FlyControls(camera, renderer.domElement);

controls.movementSpeed = 1.0;
controls.domElement = renderer.domElement;
controls.rollSpeed = Math.PI / 24;
controls.autoForward = false;
controls.dragToLook = true;
```

#### FirstPersonControls

第一人称控制器模拟第一人称视角，允许用户像在游戏中一样控制视角。

```javascript
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';

const controls = new FirstPersonControls(camera, renderer.domElement);

controls.movementSpeed = 5;
controls.lookSpeed = 0.1;
controls.lookVertical = true;
```

## 5. 灯光和阴影

### 5.1 灯光类型

Three.js 提供了多种灯光类型，用于模拟不同的光照效果：

#### 环境光 (AmbientLight)

环境光均匀地照亮场景中的所有物体，没有方向和阴影。

```javascript
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
```

#### 平行光 (DirectionalLight)

平行光模拟来自远处的光源，如太阳光，有方向和阴影。

```javascript
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);
```

#### 点光源 (PointLight)

点光源从一个点向各个方向发射光线，如灯泡。

```javascript
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(0, 10, 0);
scene.add(pointLight);
```

#### 聚光灯 (SpotLight)

聚光灯从一个点向特定方向发射锥形光线，如手电筒。

```javascript
const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(0, 10, 0);
spotLight.angle = Math.PI / 4;
spotLight.penumbra = 0.1;
scene.add(spotLight);
```

### 5.2 阴影

要启用阴影，需要：
1. 开启渲染器的阴影映射
2. 启用光源的阴影投射
3. 启用物体的阴影投射和接收

```javascript
// 开启渲染器阴影映射
renderer.shadowMap.enabled = true;

// 启用光源阴影投射
directionalLight.castShadow = true;

// 启用物体阴影投射和接收
mesh.castShadow = true;
mesh.receiveShadow = true;

// 可选：设置阴影贴图分辨率
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
```

#### 5.2.1 阴影优化技术

阴影渲染是Three.js中性能开销较大的部分，合理的优化可以显著提升渲染性能。以下是一些常用的阴影优化技术：

##### 1. 调整阴影贴图分辨率

阴影贴图分辨率直接影响阴影质量和性能，应根据实际需求平衡设置：

```javascript
// 较高质量阴影（适合静止场景）
directionalLight.shadow.mapSize.width = 4096;
directionalLight.shadow.mapSize.height = 4096;

// 平衡质量和性能
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;

// 较低质量阴影（适合动态场景或性能受限设备）
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
```

##### 2. 优化阴影相机参数

合理设置阴影相机的视锥体，可以减少阴影计算范围，提升性能：

```javascript
// 对于平行光，设置阴影相机的正交投影参数
directionalLight.shadow.camera.left = -5;
directionalLight.shadow.camera.right = 5;
directionalLight.shadow.camera.top = 5;
directionalLight.shadow.camera.bottom = -5;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;

// 对于点光源，设置阴影相机的远裁剪面
pointLight.shadow.camera.near = 0.5;
pointLight.shadow.camera.far = 50;

// 对于聚光灯，设置阴影相机的视锥体参数
spotLight.shadow.camera.near = 0.5;
spotLight.shadow.camera.far = 50;
spotLight.shadow.camera.fov = 30;
```

##### 3. 选择合适的阴影类型

Three.js提供了多种阴影映射类型，可以根据场景需求选择：

```javascript
// PCFSoftShadowMap：柔和阴影，性能较好（推荐）
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// BasicShadowMap：基础阴影，性能最好，但质量较低
renderer.shadowMap.type = THREE.BasicShadowMap;

// PCFShadowMap：PCF阴影，质量中等
renderer.shadowMap.type = THREE.PCFShadowMap;

// VSMShadowMap：方差阴影图，支持柔和阴影和透明物体阴影
renderer.shadowMap.type = THREE.VSMShadowMap;
```

##### 4. 限制投射阴影的物体数量

只让必要的物体投射阴影，可以显著减少阴影计算开销：

```javascript
// 对于复杂场景，只让关键物体投射阴影
importantObject.castShadow = true;
importantObject.receiveShadow = true;

// 简单物体或远处物体可以禁用阴影
simpleObject.castShadow = false;
distantObject.castShadow = false;
```

##### 5. 使用阴影相机辅助工具

使用CameraHelper可视化阴影相机的视锥体，帮助优化阴影范围：

```javascript
// 创建阴影相机辅助工具
const shadowCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(shadowCameraHelper);

// 调整阴影相机参数后，更新辅助工具
shadowCameraHelper.update();
```

##### 6. 使用平面阴影代替实时阴影

对于简单场景，可以使用平面阴影（如使用ShadowMaterial）代替实时阴影，降低性能开销：

```javascript
// 创建平面阴影
const shadowMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
const shadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    shadowMaterial
);
shadowPlane.rotation.x = -Math.PI / 2;
shadowPlane.position.y = 0;
shadowPlane.receiveShadow = true;
scene.add(shadowPlane);
```

##### 7. 动态调整阴影质量

根据场景复杂度和设备性能，动态调整阴影质量：

```javascript
function adjustShadowQuality(quality) {
    if (quality === 'high') {
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        directionalLight.shadow.mapSize.width = 4096;
        directionalLight.shadow.mapSize.height = 4096;
    } else if (quality === 'medium') {
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
    } else {
        renderer.shadowMap.type = THREE.BasicShadowMap;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
    }
}

// 根据设备性能调整阴影质量
if (navigator.hardwareConcurrency > 4) {
    adjustShadowQuality('high');
} else {
    adjustShadowQuality('medium');
}
```

合理应用这些阴影优化技术，可以在保持视觉效果的同时，显著提升Three.js应用的渲染性能。

## 6. 加载外部模型

Three.js 支持加载多种 3D 模型格式，如 OBJ、FBX、GLTF 等。其中 GLTF 是推荐的格式，因为它支持材质、动画等多种特性。

### 6.1 加载 GLTF 模型

```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

loader.load(
    // 模型路径
    'models/model.gltf',
    // 加载成功回调
    (gltf) => {
        scene.add(gltf.scene);
    },
    // 加载进度回调
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // 加载错误回调
    (error) => {
        console.error('Error loading model:', error);
    }
);
```

### 6.2 加载纹理

```javascript
import { TextureLoader } from 'three';

const textureLoader = new TextureLoader();

textureLoader.load(
    'textures/color.jpg',
    (texture) => {
        const material = new THREE.MeshStandardMaterial({ map: texture });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
    }
);
```

### 6.3 加载管理器 (LoadingManager)

LoadingManager 用于统一管理多个资源的加载过程，可以跟踪整体加载进度、处理加载完成和错误事件，是实现加载界面的理想工具。

```javascript
import { LoadingManager, TextureLoader, GLTFLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// 创建加载管理器
const loadingManager = new LoadingManager();

// 加载开始回调
loadingManager.onStart = () => {
    console.log('Loading started');
    // 这里可以显示加载界面
};

// 加载进度回调
loadingManager.onProgress = (url, loaded, total) => {
    const progress = Math.round((loaded / total) * 100);
    console.log(`Loading ${url}: ${progress}% loaded (${loaded}/${total})`);
    // 更新加载进度条
};

// 加载完成回调
loadingManager.onLoad = () => {
    console.log('All resources loaded');
    // 隐藏加载界面，开始渲染
};

// 加载错误回调
loadingManager.onError = (url) => {
    console.error(`Error loading: ${url}`);
    // 处理加载错误
};

// 将加载管理器传递给各种加载器
const textureLoader = new TextureLoader(loadingManager);
const gltfLoader = new GLTFLoader(loadingManager);

// 加载多个资源
textureLoader.load('textures/color.jpg', (texture) => {
    console.log('Color texture loaded');
});

textureLoader.load('textures/normal.jpg', (texture) => {
    console.log('Normal texture loaded');
});

gltfLoader.load('models/model.gltf', (gltf) => {
    console.log('GLTF model loaded');
    scene.add(gltf.scene);
});
```

使用 LoadingManager 的优势：

1. **统一管理**：所有资源加载都通过同一个管理器处理，便于集中控制
2. **整体进度**：可以获取所有资源的整体加载进度，而非单个资源的进度
3. **加载界面**：轻松实现加载界面和进度条
4. **错误处理**：集中处理加载错误，提高代码可维护性
5. **资源依赖**：可以确保所有资源加载完成后再进行渲染或初始化操作

## 7. 高级主题

### 7.1 粒子系统

粒子系统用于创建大量的小物体，如火焰、烟雾、星空等。

```javascript
// 创建粒子几何体
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 5000;

const posArray = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// 创建粒子材质
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0xffffff
});

// 创建粒子系统
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);
```

### 7.2 后期处理

后期处理用于对渲染结果应用各种效果，如模糊、色彩调整、景深等，是提升画面质量的重要技术。

```javascript
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// 创建效果合成器
const composer = new EffectComposer(renderer);

// 添加渲染通道
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// 添加 bloom 效果通道
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5, // 强度
    0.4, // 半径
    0.85 // 阈值
);
composer.addPass(bloomPass);

// 在动画循环中使用 composer.render 代替 renderer.render
function animate() {
    requestAnimationFrame(animate);
    composer.render();
}
```

#### 常用后期处理效果

##### 景深效果 (BokehPass)

景深效果模拟真实相机的景深，使焦点区域清晰，前景和背景模糊。

```javascript
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';

const bokehPass = new BokehPass(scene, camera, {
    focus: 1.0,      // 焦点距离
    aperture: 0.0001, // 光圈大小
    maxblur: 0.01    // 最大模糊程度
});
composer.addPass(bokehPass);
```

##### 屏幕空间反射 (SSRPass)

屏幕空间反射模拟物体表面的反射效果，增强场景的真实感。

```javascript
import { SSRPass } from 'three/examples/jsm/postprocessing/SSRPass.js';

const ssrPass = new SSRPass({
    renderer: renderer,
    scene: scene,
    camera: camera,
    width: window.innerWidth,
    height: window.innerHeight
});
composer.addPass(ssrPass);
```

##### 色调映射 (FilmPass)

FilmPass 添加电影风格的色调映射效果，包括颗粒感、扫描线等。

```javascript
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';

const filmPass = new FilmPass(
    0.325, // 颗粒强度
    0.025, // 扫描线强度
    648,   // 扫描线计数
    false  // 是否使用灰度效果
);
composer.addPass(filmPass);
```

##### 模糊效果 (BloomPass)

除了 UnrealBloomPass，还有传统的 BloomPass 用于创建发光效果。

```javascript
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass.js';

const bloomPass = new BloomPass(
    1.0,   // 强度
    25,    // 内核大小
    4,     // sigma 值
    256    // 分辨率
);
composer.addPass(bloomPass);
```

##### 颜色校正 (ColorCorrectionPass)

ColorCorrectionPass 用于调整画面的颜色、对比度、饱和度等。

```javascript
import { ColorCorrectionPass } from 'three/examples/jsm/postprocessing/ColorCorrectionPass.js';

const colorCorrectionPass = new ColorCorrectionPass();
// 可以通过调整 texture 属性来应用颜色查找表 (LUT)
composer.addPass(colorCorrectionPass);
```

##### 边缘检测 (EdgeDetectionPass)

EdgeDetectionPass 用于检测和突出显示场景中的边缘，创建轮廓效果。

```javascript
import { EdgeDetectionPass } from 'three/examples/jsm/postprocessing/EdgeDetectionPass.js';

const edgeDetectionPass = new EdgeDetectionPass();
edgeDetectionPass.enabled = true;
composer.addPass(edgeDetectionPass);
```

##### 噪点效果 (NoisePass)

NoisePass 为画面添加噪点，用于模拟胶片颗粒或电视信号干扰。

```javascript
import { NoisePass } from 'three/examples/jsm/postprocessing/NoisePass.js';

const noisePass = new NoisePass();
noisePass.enabled = true;
composer.addPass(noisePass);
```

##### 输出通道 (OutputPass)

OutputPass 用于最终的颜色空间转换和色调映射，确保画面在不同设备上正确显示。

```javascript
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

const outputPass = new OutputPass();
composer.addPass(outputPass);
```

后期处理效果可以组合使用，创造出丰富多样的视觉效果。需要注意的是，过多的后期处理效果会增加渲染负担，应根据实际需求合理使用。

### 7.3 物理引擎

Three.js 可以与物理引擎集成，如 Ammo.js、Cannon.js 等，实现真实的物理模拟。

```javascript
import * as CANNON from 'cannon-es';

// 创建物理世界
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // 设置重力

// 创建物理体
const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
const body = new CANNON.Body({ mass: 1, shape });
body.position.set(0, 10, 0);
world.addBody(body);

// 在动画循环中更新物理世界
function animate() {
    requestAnimationFrame(animate);
    
    // 更新物理世界
    world.step(1/60);
    
    // 同步 Three.js 物体位置
    mesh.position.copy(body.position);
    mesh.quaternion.copy(body.quaternion);
    
    renderer.render(scene, camera);
}
```

### 7.4 动画系统

Three.js 提供了强大的动画系统，支持多种动画类型。

#### 关键帧动画 (Keyframe Animation)

```javascript
import { AnimationMixer } from 'three';

// 加载带有动画的模型
loader.load(
    'models/animated-model.gltf',
    (gltf) => {
        scene.add(gltf.scene);
        
        // 创建动画混合器
        const mixer = new AnimationMixer(gltf.scene);
        
        // 获取动画剪辑
        const animationClip = gltf.animations[0];
        
        // 创建动画动作
        const animationAction = mixer.clipAction(animationClip);
        animationAction.play();
        
        // 在动画循环中更新混合器
        function animate() {
            requestAnimationFrame(animate);
            
            const deltaTime = clock.getDelta();
            mixer.update(deltaTime);
            
            renderer.render(scene, camera);
        }
        
        animate();
    }
);
```

#### 变形目标动画 (Morph Target Animation)

```javascript
// 创建带有变形目标的几何体
const geometry = new THREE.BoxGeometry(1, 1, 1);

// 创建变形目标数据
const targets = {
    target1: new Float32Array(geometry.attributes.position.array.length),
    target2: new Float32Array(geometry.attributes.position.array.length)
};

// 填充变形目标数据（示例）
for (let i = 0; i < geometry.attributes.position.count; i++) {
    const x = geometry.attributes.position.getX(i);
    const y = geometry.attributes.position.getY(i);
    const z = geometry.attributes.position.getZ(i);
    
    targets.target1[i * 3] = x + 0.5;
    targets.target1[i * 3 + 1] = y;
    targets.target1[i * 3 + 2] = z;
    
    targets.target2[i * 3] = x;
    targets.target2[i * 3 + 1] = y + 0.5;
    targets.target2[i * 3 + 2] = z;
}

// 添加变形目标到几何体
geometry.morphAttributes.position = [];
geometry.morphAttributes.position[0] = new THREE.BufferAttribute(targets.target1, 3);
geometry.morphAttributes.position[1] = new THREE.BufferAttribute(targets.target2, 3);

// 创建材质
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, morphTargets: true });

// 创建网格
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// 动画函数
function animate() {
    requestAnimationFrame(animate);
    
    // 更新变形目标权重
    mesh.morphTargetInfluences[0] = 0.5 * (1 + Math.sin(Date.now() * 0.001));
    mesh.morphTargetInfluences[1] = 0.5 * (1 + Math.cos(Date.now() * 0.001));
    
    renderer.render(scene, camera);
}
```

#### 骨骼动画 (Skeleton Animation)

骨骼动画是 Three.js 中用于创建角色动画的高级技术，通过骨骼系统控制网格的变形，实现更自然、更复杂的动画效果。

##### 加载带骨骼动画的模型

```javascript
// 加载带有骨骼动画的 GLTF 模型
loader.load(
    'models/character.gltf',
    (gltf) => {
        const character = gltf.scene;
        scene.add(character);
        
        // 创建动画混合器
        const mixer = new THREE.AnimationMixer(character);
        
        // 获取动画剪辑
        const animations = gltf.animations;
        if (animations && animations.length) {
            // 存储所有动画动作
            const animationActions = [];
            
            // 创建并播放第一个动画
            const idleAction = mixer.clipAction(animations[0]);
            animationActions.push(idleAction);
            idleAction.play();
            
            // 存储其他动画动作（如行走、跑步等）
            for (let i = 1; i < animations.length; i++) {
                const action = mixer.clipAction(animations[i]);
                animationActions.push(action);
            }
        }
        
        // 在动画循环中更新混合器
        function animate() {
            requestAnimationFrame(animate);
            
            const deltaTime = clock.getDelta();
            mixer.update(deltaTime);
            
            renderer.render(scene, camera);
        }
        
        animate();
    }
);
```

##### 控制骨骼动画

可以通过 AnimationMixer 和 AnimationAction 来控制骨骼动画的播放、暂停、切换等。

```javascript
// 切换动画
function switchAnimation(fromAction, toAction) {
    fromAction.fadeOut(0.5);
    toAction.reset().fadeIn(0.5).play();
}

// 例如：从 idle 动画切换到 walk 动画
switchAnimation(animationActions[0], animationActions[1]);

// 设置动画速度
idleAction.setDuration(2.0); // 设置动画周期为 2 秒
walkAction.setPlaybackRate(2.0); // 播放速度加倍

// 循环控制
idleAction.setLoop(THREE.LoopOnce, 2); // 播放两次后停止
idleAction.clampWhenFinished = true; // 动画结束后保持最后一帧
```

##### 骨骼辅助工具

Three.js 提供了 SkeletonHelper 用于可视化骨骼系统，便于调试。

```javascript
// 创建骨骼辅助工具
const skeletonHelper = new THREE.SkeletonHelper(character);
skeletonHelper.material.linewidth = 2;
scene.add(skeletonHelper);
```

骨骼动画是创建复杂角色动画的核心技术，常用于游戏、虚拟现实和交互式 3D 应用中。

### 7.5 音频系统

Three.js 提供了完整的音频系统，可以在 3D 场景中播放音频并模拟 3D 空间音效。

#### 基本音频设置

```javascript
// 创建音频监听器
const listener = new THREE.AudioListener();
camera.add(listener);

// 创建音频源
const audio = new THREE.Audio(listener);

// 创建音频加载器
const audioLoader = new THREE.AudioLoader();

// 加载音频文件
audioLoader.load(
    'sounds/music.mp3',
    function(buffer) {
        audio.setBuffer(buffer);
        audio.setLoop(true); // 设置循环播放
        audio.setVolume(0.5); // 设置音量
        audio.play(); // 播放音频
    }
);
```

#### 3D 空间音效

使用 PositionalAudio 创建具有空间位置的音频源，实现 3D 空间音效效果。

```javascript
// 创建位置音频源
const positionalAudio = new THREE.PositionalAudio(listener);

// 加载音频文件
audioLoader.load(
    'sounds/ambient.mp3',
    function(buffer) {
        positionalAudio.setBuffer(buffer);
        positionalAudio.setLoop(true);
        positionalAudio.setVolume(1.0);
        positionalAudio.setRefDistance(20); // 设置参考距离
        positionalAudio.play();
    }
);

// 将音频源附加到 3D 对象
mesh.add(positionalAudio);
```

当相机移动时，3D 空间音频的音量和立体声效果会根据相机与音频源的距离和角度自动调整，提供沉浸式的音频体验。

#### 音频分析器

Three.js 还提供了 AudioAnalyser 类，可以分析音频数据，用于创建音频可视化效果。

```javascript
// 创建音频分析器
const analyser = new THREE.AudioAnalyser(audio, 32);

// 获取音频数据
const data = analyser.getFrequencyData();

// 在动画循环中使用音频数据创建可视化效果
function animate() {
    requestAnimationFrame(animate);
    
    analyser.getFrequencyData();
    
    // 使用音频数据更新可视化对象
    for (let i = 0; i < data.length; i++) {
        const scale = data[i] / 256.0;
        visualizationObjects[i].scale.y = 1 + scale * 2;
    }
    
    renderer.render(scene, camera);
}
```

音频系统是 Three.js 创建沉浸式 3D 体验的重要组成部分，特别是在游戏、虚拟现实和交互式展览中。

## 8. 性能优化","}}}

### 8.1 减少绘制调用

使用 `Group` 或 `InstancedMesh` 减少绘制调用次数。

```javascript
// 使用 Group
const group = new THREE.Group();
for (let i = 0; i < 100; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);
}
scene.add(group);

// 使用 InstancedMesh（更高效）
const instancedMesh = new THREE.InstancedMesh(geometry, material, 100);
for (let i = 0; i < 100; i++) {
    const matrix = new THREE.Matrix4();
    matrix.setPosition(i, 0, 0);
    instancedMesh.setMatrixAt(i, matrix);
}
instancedMesh.instanceMatrix.needsUpdate = true;
scene.add(instancedMesh);
```

### 8.2 层次细节 (LOD)

根据物体与相机的距离显示不同精度的模型。

```javascript
const lod = new THREE.LOD();

// 添加不同精度的模型
lod.addLevel(highDetailMesh, 0); // 0-50 距离显示高细节
lod.addLevel(midDetailMesh, 50); // 50-100 距离显示中细节
lod.addLevel(lowDetailMesh, 100); // >100 距离显示低细节

scene.add(lod);
```

### 8.3 材质优化

- 减少使用复杂材质
- 合理使用纹理大小
- 避免过度使用透明材质

### 8.4 相机剔除

启用相机的视锥体剔除，只渲染可见的物体。

```javascript
mesh.frustumCulled = true; // 默认开启
```

### 8.5 性能监控

在开发 Three.js 应用时，性能监控是优化过程中的重要环节。以下是一些常用的性能监控工具和技术：

#### Stats.js

Stats.js 是一个轻量级的性能监控库，可以实时显示 FPS、渲染时间等信息。

```javascript
// 引入 Stats.js
import Stats from 'three/examples/jsm/libs/stats.module.js';

// 创建性能监控器
const stats = new Stats();
document.body.appendChild(stats.dom);

// 在动画循环中更新
function animate() {
    requestAnimationFrame(animate);
    
    // 开始监控
    stats.begin();
    
    // 渲染场景
    renderer.render(scene, camera);
    
    // 结束监控
    stats.end();
}
```

#### Three.js 内置性能信息

Three.js 提供了 `renderer.info` 对象，可以获取渲染相关的统计信息。

```javascript
// 获取渲染统计信息
console.log('绘制调用次数:', renderer.info.render.calls);
console.log('渲染的三角形数量:', renderer.info.render.triangles);
console.log('渲染的点数:', renderer.info.render.points);
console.log('渲染的线数:', renderer.info.render.lines);
console.log('几何体数量:', renderer.info.memory.geometries);
console.log('纹理数量:', renderer.info.memory.textures);
```

#### 自定义性能监控

可以使用 `performance.now()` API 创建自定义的性能监控，用于测量特定操作的执行时间。

```javascript
// 测量动画循环中的特定操作
function animate() {
    requestAnimationFrame(animate);
    
    const start = performance.now();
    
    // 执行需要监控的操作
    updatePhysics();
    
    const end = performance.now();
    console.log('物理更新时间:', (end - start).toFixed(2), 'ms');
    
    renderer.render(scene, camera);
}
```

定期检查这些性能指标，可以帮助开发者识别性能瓶颈，针对性地进行优化。

## 9. 学习资源

### 9.1 官方资源
- [Three.js 官方文档](https://threejs.org/docs/)
- [Three.js 示例](https://threejs.org/examples/)
- [Three.js GitHub 仓库](https://github.com/mrdoob/three.js/)

### 9.2 教程和书籍
- [Three.js Journey](https://threejs-journey.com/) - 付费课程
- [Discover Three.js](https://discoverthreejs.com/) - 书籍
- [MDN Three.js 教程](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_Three.js)

### 9.3 社区和工具
- [Three.js Discourse](https://discourse.threejs.org/) - 论坛
- [Sketchfab](https://sketchfab.com/) - 3D 模型库
- [Blender](https://www.blender.org/) - 3D 建模软件
- [Babylon.js Sandbox](https://sandbox.babylonjs.com/) - 3D 模型查看器
- [Three.js Editor](https://threejs.org/editor/) - 在线 3D 编辑器
- [GLTF Viewer](https://gltf-viewer.donmccurdy.com/) - GLTF 模型查看器

## 10. 总结

Three.js 是一个强大而灵活的 JavaScript 3D 库，为 Web 开发者提供了创建交互式 3D 内容的能力。从简单的立方体到复杂的 3D 场景，Three.js 都能满足各种需求。

本文详细介绍了 Three.js 的核心概念和功能，包括：
- 基础组件：场景、相机、渲染器、几何体、材质和网格
- 坐标系工具：坐标轴辅助、网格辅助等调试工具
- 高级几何体和材质操作：BufferGeometry、纹理映射、环境贴图
- 动画和交互：动画循环、射线检测、各种控制器
- 灯光和阴影系统：环境光、平行光、点光源等
- 外部资源加载：3D 模型和纹理
- 高级主题：粒子系统、后期处理、物理引擎、动画系统
- 性能优化策略

通过学习 Three.js 的核心概念和 API，开发者可以在网页上创建令人惊叹的 3D 体验。随着 WebGL 技术的不断发展和浏览器性能的提升，Three.js 有着广阔的应用前景，包括数据可视化、游戏开发、虚拟现实、增强现实等领域。
