// 苏峰山 WebGL Demo - 四种着色器循环切换
// 作者: 零天 | 日期: 2026-02-12

// ============ 配置 ============
const CONFIG = {
  shaderDuration: 5000, // 每个着色器持续时间（毫秒）
  transitionDuration: 1000, // 切换过渡时间（毫秒）
  rotationSpeed: 0.0005, // 旋转速度
  terrainSize: 100, // 地形大小
  terrainSegments: 128, // 地形细分度
  mountainHeight: 25, // 山体高度
};

// 着色器配置
const SHADERS = [
  { name: 'Poly风格', bgColor: 0xc8d0d8 },
  { name: '科技风扫描', bgColor: 0x0a0e1a },
  { name: '星露谷像素风', bgColor: 0xffd89b },
  { name: '原生真实', bgColor: 0x87ceeb }
];

// ============ 场景初始化 ============
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

camera.position.set(0, 40, 80);
camera.lookAt(0, 0, 0);

// ============ 地形生成 ============
function generateTerrain() {
  const geometry = new THREE.PlaneGeometry(
    CONFIG.terrainSize,
    CONFIG.terrainSize,
    CONFIG.terrainSegments,
    CONFIG.terrainSegments
  );
  
  // 生成山体高度图（双峰：一高一矮）
  const positions = geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    
    // 归一化坐标
    const nx = x / CONFIG.terrainSize;
    const ny = y / CONFIG.terrainSize;
    
    // 多层噪声叠加（基础地形）
    let height = 0;
    height += noise2D(nx * 2, ny * 2) * 0.3;
    height += noise2D(nx * 4, ny * 4) * 0.15;
    height += noise2D(nx * 8, ny * 8) * 0.08;
    
    // 双峰设计：高峰（左侧）+ 低峰（右侧）
    const highPeakCenter = { x: -0.25, y: 0 }; // 高峰中心偏左
    const lowPeakCenter = { x: 0.3, y: 0.1 };  // 低峰中心偏右
    
    // 高峰（更高更陡）
    const distToHighPeak = Math.sqrt(
      Math.pow(nx - highPeakCenter.x, 2) + 
      Math.pow(ny - highPeakCenter.y, 2)
    );
    const highPeak = Math.max(0, 1 - distToHighPeak * 2.2) * 1.2; // 更高更集中
    
    // 低峰（偏矮）
    const distToLowPeak = Math.sqrt(
      Math.pow(nx - lowPeakCenter.x, 2) + 
      Math.pow(ny - lowPeakCenter.y, 2)
    );
    const lowPeak = Math.max(0, 1 - distToLowPeak * 2.5) * 0.65; // 明显更矮
    
    // 合并双峰
    height += Math.max(highPeak, lowPeak);
    
    positions[i + 2] = height * CONFIG.mountainHeight;
  }
  
  geometry.computeVertexNormals();
  geometry.rotateX(-Math.PI / 2);
  
  return geometry;
}

// 简单的2D噪声函数（Perlin-like）
function noise2D(x, y) {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  x -= Math.floor(x);
  y -= Math.floor(y);
  const u = fade(x);
  const v = fade(y);
  const a = p[X] + Y;
  const b = p[X + 1] + Y;
  return lerp(v,
    lerp(u, grad2D(p[a], x, y), grad2D(p[b], x - 1, y)),
    lerp(u, grad2D(p[a + 1], x, y - 1), grad2D(p[b + 1], x - 1, y - 1))
  );
}

function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(t, a, b) { return a + t * (b - a); }
function grad2D(hash, x, y) {
  const h = hash & 3;
  const u = h < 2 ? x : y;
  const v = h < 2 ? y : x;
  return ((h & 1) ? -u : u) + ((h & 2) ? -2 * v : 2 * v);
}

// Perlin噪声排列表
const p = [];
for (let i = 0; i < 256; i++) p[i] = i;
for (let i = 255; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [p[i], p[j]] = [p[j], p[i]];
}
for (let i = 0; i < 256; i++) p[256 + i] = p[i];

// ============ 着色器定义 ============

// 1. Poly风格着色器
const polyVertexShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  void main() {
    vPosition = position;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const polyFragmentShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  void main() {
    float height = vPosition.y / 25.0;
    vec3 color;
    
    if (height < 0.2) {
      color = vec3(0.4, 0.5, 0.3); // 深绿
    } else if (height < 0.5) {
      color = vec3(0.5, 0.6, 0.4); // 浅绿
    } else if (height < 0.7) {
      color = vec3(0.6, 0.5, 0.4); // 棕色
    } else {
      color = vec3(0.7, 0.7, 0.7); // 灰色
    }
    
    // Flat shading效果
    vec3 fdx = dFdx(vPosition);
    vec3 fdy = dFdy(vPosition);
    vec3 flatNormal = normalize(cross(fdx, fdy));
    float lighting = max(0.3, dot(flatNormal, normalize(vec3(1.0, 1.0, 0.5))));
    
    gl_FragColor = vec4(color * lighting, 1.0);
  }
`;

// 2. 科技风扫描着色器
const techVertexShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  void main() {
    vPosition = position;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const techFragmentShader = `
  uniform float uTime;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  void main() {
    // 扫描线效果
    float scanLine = mod(uTime * 0.5, 30.0) - 15.0;
    float scanDist = abs(vPosition.y - scanLine);
    float scanGlow = smoothstep(3.0, 0.0, scanDist);
    
    // 网格线
    float gridX = abs(fract(vPosition.x * 0.2) - 0.5);
    float gridZ = abs(fract(vPosition.z * 0.2) - 0.5);
    float grid = step(0.48, max(gridX, gridZ));
    
    // 基础颜色
    vec3 baseColor = vec3(0.05, 0.1, 0.2);
    vec3 gridColor = vec3(0.0, 0.4, 0.8);
    vec3 scanColor = vec3(0.0, 0.8, 1.0);
    
    vec3 color = mix(baseColor, gridColor, grid * 0.5);
    color += scanColor * scanGlow;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

// 3. 星露谷像素风着色器
const pixelVertexShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  
  void main() {
    vPosition = position;
    vNormal = normal;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const pixelFragmentShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  
  void main() {
    // 像素化效果
    float pixelSize = 0.02;
    vec2 pixelUv = floor(vUv / pixelSize) * pixelSize;
    
    float height = vPosition.y / 25.0;
    vec3 color;
    
    if (height < 0.2) {
      color = vec3(0.4, 0.7, 0.3); // 亮绿
    } else if (height < 0.5) {
      color = vec3(0.6, 0.8, 0.4); // 黄绿
    } else if (height < 0.7) {
      color = vec3(0.8, 0.6, 0.4); // 橙棕
    } else {
      color = vec3(0.9, 0.9, 0.8); // 浅灰
    }
    
    // 添加像素化噪点
    float noise = fract(sin(dot(pixelUv, vec2(12.9898, 78.233))) * 43758.5453);
    color += (noise - 0.5) * 0.1;
    
    // 简单光照
    float lighting = max(0.5, dot(vNormal, normalize(vec3(1.0, 1.0, 0.5))));
    
    gl_FragColor = vec4(color * lighting, 1.0);
  }
`;

// 4. 原生真实着色器
const realisticVertexShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  void main() {
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const realisticFragmentShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  void main() {
    float height = vPosition.y / 25.0;
    vec3 color;
    
    // 高度分层着色
    if (height < -0.1) {
      color = vec3(0.1, 0.3, 0.6); // 水面蓝
    } else if (height < 0.1) {
      color = vec3(0.8, 0.7, 0.5); // 沙滩黄
    } else if (height < 0.5) {
      color = vec3(0.3, 0.6, 0.3); // 草地绿
    } else if (height < 0.8) {
      color = vec3(0.5, 0.5, 0.5); // 岩石灰
    } else {
      color = vec3(0.95, 0.95, 1.0); // 雪白
    }
    
    // 光照计算
    vec3 lightDir = normalize(vec3(1.0, 1.5, 1.0));
    float diffuse = max(0.0, dot(vNormal, lightDir));
    float ambient = 0.4;
    float lighting = ambient + diffuse * 0.6;
    
    // 边缘高光
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - max(0.0, dot(vNormal, viewDir)), 2.0);
    color += vec3(0.1) * fresnel;
    
    gl_FragColor = vec4(color * lighting, 1.0);
  }
`;

// ============ 创建材质 ============
const terrain = generateTerrain();
let currentMesh;
let currentShaderIndex = 0;
let transitionProgress = 0;
let lastShaderChangeTime = Date.now();

const materials = [
  new THREE.ShaderMaterial({
    vertexShader: polyVertexShader,
    fragmentShader: polyFragmentShader,
    side: THREE.DoubleSide
  }),
  new THREE.ShaderMaterial({
    vertexShader: techVertexShader,
    fragmentShader: techFragmentShader,
    uniforms: { uTime: { value: 0 } },
    side: THREE.DoubleSide
  }),
  new THREE.ShaderMaterial({
    vertexShader: pixelVertexShader,
    fragmentShader: pixelFragmentShader,
    side: THREE.DoubleSide
  }),
  new THREE.ShaderMaterial({
    vertexShader: realisticVertexShader,
    fragmentShader: realisticFragmentShader,
    side: THREE.DoubleSide
  })
];

currentMesh = new THREE.Mesh(terrain, materials[0]);
scene.add(currentMesh);

// ============ UI更新 ============
const label = document.getElementById('shader-label');

function updateShaderLabel(index) {
  label.textContent = SHADERS[index].name;
  label.classList.remove('visible');
  setTimeout(() => label.classList.add('visible'), 50);
}

function updateBackgroundColor(index) {
  const targetColor = new THREE.Color(SHADERS[index].bgColor);
  const currentColor = scene.background || new THREE.Color(0x000000);
  
  // 平滑过渡背景色
  const duration = CONFIG.transitionDuration;
  const startTime = Date.now();
  
  function animateBg() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    scene.background = new THREE.Color().lerpColors(currentColor, targetColor, progress);
    
    if (progress < 1) {
      requestAnimationFrame(animateBg);
    }
  }
  animateBg();
}

// 初始化
updateShaderLabel(0);
updateBackgroundColor(0);

// ============ 动画循环 ============
function animate() {
  requestAnimationFrame(animate);
  
  const now = Date.now();
  const elapsed = now - lastShaderChangeTime;
  
  // 着色器切换逻辑
  if (elapsed > CONFIG.shaderDuration) {
    currentShaderIndex = (currentShaderIndex + 1) % SHADERS.length;
    currentMesh.material = materials[currentShaderIndex];
    updateShaderLabel(currentShaderIndex);
    updateBackgroundColor(currentShaderIndex);
    lastShaderChangeTime = now;
  }
  
  // 更新科技风着色器的时间uniform
  if (currentShaderIndex === 1) {
    materials[1].uniforms.uTime.value = now * 0.001;
  }
  
  // 旋转动画
  currentMesh.rotation.y += CONFIG.rotationSpeed;
  
  renderer.render(scene, camera);
}

animate();

// ============ 响应式 ============
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
