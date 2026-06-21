import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec2 uVelocity;
  uniform float uStrength;

  varying vec2 vUv;

  vec3 blackColor = vec3(0.004, 0.004, 0.008);
  vec3 deepBlack  = vec3(0.000, 0.000, 0.002);

  // AYUTA palette
  vec3 pinkColor  = vec3(0.945, 0.373, 0.647);
  vec3 magenta    = vec3(0.773, 0.333, 0.584);
  vec3 plum       = vec3(0.643, 0.306, 0.541);
  vec3 primary    = vec3(0.467, 0.357, 0.643);
  vec3 royal      = vec3(0.282, 0.302, 0.635);
  vec3 steel      = vec3(0.153, 0.341, 0.549);
  vec3 slate      = vec3(0.267, 0.282, 0.400);
  vec3 offWhite   = vec3(0.961, 0.961, 0.961);

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);

    return mix(a, b, u.x)
      + (c - a) * u.y * (1.0 - u.x)
      + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amp = 0.5;

    for (int i = 0; i < 6; i++) {
      value += amp * noise(p);
      p *= 2.03;
      amp *= 0.5;
    }

    return value;
  }

  mat2 rotate2d(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
  }

  float band(vec2 p, float width, float blur) {
    float wave =
      p.y
      + p.x * 0.45
      + sin(p.x * 1.35) * 0.24
      + sin(p.x * 2.65) * 0.10;

    return smoothstep(width + blur, width, abs(wave));
  }

  float ring(vec2 p, vec2 c, float r, float w, float blur) {
    float d = abs(length(p - c) - r);
    return smoothstep(w + blur, w, d);
  }

  float circle(vec2 p, vec2 c, float r, float blur) {
    float d = length(p - c);
    return smoothstep(r + blur, r, d);
  }

  vec2 liquidCursor(vec2 uv) {
    vec2 dir = uv - uMouse;
    float d = length(dir);

    float area = smoothstep(0.75, 0.0, d) * uStrength;
    vec2 normal = normalize(dir + 0.0001);

    uv += normal * area * 0.07;
    uv -= uVelocity * area * 0.55;

    uv.x += sin((uv.y + uMouse.y) * 14.0) * area * 0.012;
    uv.y += cos((uv.x + uMouse.x) * 12.0) * area * 0.010;

    return uv;
  }

  void main() {
    vec2 uv = vUv;

    uv = liquidCursor(uv);

    vec2 p = uv - 0.5;
    p.x *= uResolution.x / uResolution.y;

    vec2 mouse = uMouse - 0.5;
    mouse.x *= uResolution.x / uResolution.y;

    vec2 globalPull = mouse * uStrength;

    vec2 flow = p;

    flow.x -= globalPull.x * 0.60;
    flow.y -= globalPull.y * 0.44;

    float n1 = fbm(flow * 1.25 + globalPull * 0.95);
    float n2 = fbm(flow * 2.35 - globalPull * 0.75);

    flow.x += (n1 - 0.5) * 0.24 * uStrength;
    flow.y += (n2 - 0.5) * 0.20 * uStrength;

    flow.x += sin(flow.y * 2.6 + globalPull.x * 2.8) * 0.08 * uStrength;
    flow.y += cos(flow.x * 2.25 - globalPull.y * 2.8) * 0.07 * uStrength;

    vec2 rp = rotate2d(-0.52) * flow;

    float mainBand   = band(rp + vec2(-0.18, -0.08), 0.12, 0.78);
    float pinkBand   = band(rp + vec2(-0.42, -0.34), 0.10, 0.46);
    float purpleBand = band(rp + vec2(0.04, 0.06), 0.045, 0.28);
    float blueBand   = band(rp + vec2(0.34, 0.22), 0.18, 0.70);

    vec2 ringCenter = vec2(0.70, 0.18);
    ringCenter -= globalPull * 0.35;

    float outerRing  = ring(flow, ringCenter, 0.60, 0.26, 0.38);
    float purpleRing = ring(flow, ringCenter, 0.51, 0.13, 0.24);
    float pinkRing   = ring(flow, ringCenter, 0.43, 0.09, 0.18);
    float hole       = circle(flow, ringCenter, 0.36, 0.22);

    vec2 leftCenter = vec2(-0.98, -0.54);
    leftCenter -= globalPull * 0.18;

    float leftArc  = ring(flow, leftCenter, 0.36, 0.15, 0.28);
    float leftHole = circle(flow, leftCenter, 0.24, 0.16);

    vec3 color = blackColor;

    color += royal * mainBand * 1.05;
    color += steel * blueBand * 0.95;
    color += primary * purpleBand * 0.56;
    color += pinkColor * pinkBand * 0.86;
    color += magenta * pinkBand * 0.48;
    color += plum * pinkBand * 0.24;

    color += royal * outerRing * 0.98;
    color += primary * purpleRing * 0.46;
    color += pinkColor * pinkRing * 0.82;
    color += offWhite * purpleRing * 0.055;
    color = mix(color, deepBlack, hole * 0.965);

    color += royal * leftArc * 0.70;
    color += primary * leftArc * 0.18;
    color += slate * leftArc * 0.10;
    color = mix(color, deepBlack, leftHole * 0.74);

    float bottomBlue = smoothstep(0.12, -0.62, p.y + globalPull.y * 0.16);
    color += steel * bottomBlue * 0.34;
    color += royal * bottomBlue * 0.20;

    float topDark = smoothstep(0.10, 0.55, p.y);
    color = mix(color, deepBlack, topDark * 0.74);

    float centerDark = circle(p, vec2(0.02, 0.20), 0.34, 0.38);
    color = mix(color, deepBlack, centerDark * 0.52);

    vec2 pMouse = vUv - 0.5;
    pMouse.x *= uResolution.x / uResolution.y;

    float cursorDist = length(pMouse - mouse);
    float cursorAura = smoothstep(0.38, 0.0, cursorDist) * uStrength;
    float cursorEdge = smoothstep(0.19, 0.17, cursorDist) * smoothstep(0.10, 0.18, cursorDist) * uStrength;

    color = mix(color, deepBlack, cursorAura * 0.14);
    color += primary * cursorEdge * 0.18;
    color += pinkColor * cursorEdge * 0.14;
    color += offWhite * cursorEdge * 0.065;

    float vignette = smoothstep(1.32, 0.22, length(p));
    color *= vignette;

    float grain = hash(vUv * uResolution.xy + fract(uTime * 0.04));
    color += (grain - 0.5) * 0.085;

    color = pow(max(color, 0.0), vec3(0.92));

    gl_FragColor = vec4(color, 1.0);
  }
`;

function damp(current: number, target: number, lambda: number, dt: number) {
  return THREE.MathUtils.damp(current, target, lambda, dt);
}

export default function BackgroundAnimation() {
  const mountRef = useRef<HTMLDivElement>(null);
  // State untuk melacak apakah WebGL aman digunakan
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;

    // 1. PENGAMANAN: Bungkus pembuatan WebGLRenderer dalam try...catch
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: false,
        powerPreference: 'high-performance',
      });
    } catch (error) {
      console.error("Gagal membuat WebGL Context. Browser/Device tidak mendukung hardware acceleration.", error);
      setIsWebGLSupported(false);
      return; // Berhenti di sini, tidak mengeksekusi sisa Three.js setup
    }

    // 2. SETUP THREE.JS (Hanya jalan jika renderer berhasil dibuat)
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    camera.position.z = 1;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    renderer.setSize(mount.clientWidth, mount.clientHeight);

    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    mount.appendChild(renderer.domElement);

    const resolution = new THREE.Vector2(mount.clientWidth, mount.clientHeight);
    const mouse = new THREE.Vector2(0.5, 0.5);
    const velocity = new THREE.Vector2(0, 0);

    let targetMouseX = 0.5;
    let targetMouseY = 0.5;
    let previousPointerX = 0.5;
    let previousPointerY = 0.5;
    let targetVelocityX = 0;
    let targetVelocityY = 0;
    let strength = 0;
    let targetStrength = 0;
    let lastMoveTime = 0;

    let smoothPointerX = 0.5;
    let smoothPointerY = 0.5;
    const POINTER_EMA = 0.55;

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: resolution },
      uMouse: { value: mouse },
      uVelocity: { value: velocity },
      uStrength: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      depthWrite: false,
      depthTest: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const clock = new THREE.Clock();
    let frameId = 0;
    let elapsed = 0;

    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.033);
      elapsed += dt;
      const now = performance.now();

      const isRecentlyMoving = now - lastMoveTime < 800;
      targetStrength = isRecentlyMoving ? 1.0 : 0.0;

      mouse.x = damp(mouse.x, targetMouseX, 6.5, dt);
      mouse.y = damp(mouse.y, targetMouseY, 6.5, dt);

      velocity.x = damp(velocity.x, targetVelocityX, 5.5, dt);
      velocity.y = damp(velocity.y, targetVelocityY, 5.5, dt);

      strength = damp(
        strength,
        targetStrength,
        targetStrength > strength ? 5.0 : 2.0,
        dt,
      );

      targetVelocityX = damp(targetVelocityX, 0, 1.8, dt);
      targetVelocityY = damp(targetVelocityY, 0, 1.8, dt);

      uniforms.uTime.value = elapsed;
      uniforms.uMouse.value = mouse;
      uniforms.uVelocity.value = velocity;
      uniforms.uStrength.value = strength;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    const handlePointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();

      const rawX = THREE.MathUtils.clamp((event.clientX - rect.left) / rect.width, 0, 1);
      const rawY = THREE.MathUtils.clamp(1.0 - (event.clientY - rect.top) / rect.height, 0, 1);

      smoothPointerX = smoothPointerX + POINTER_EMA * (rawX - smoothPointerX);
      smoothPointerY = smoothPointerY + POINTER_EMA * (rawY - smoothPointerY);

      const dx = smoothPointerX - previousPointerX;
      const dy = smoothPointerY - previousPointerY;

      targetMouseX = smoothPointerX;
      targetMouseY = smoothPointerY;

      targetVelocityX += dx * 6.0;
      targetVelocityY += dy * 6.0;

      targetVelocityX = THREE.MathUtils.clamp(targetVelocityX, -0.8, 0.8);
      targetVelocityY = THREE.MathUtils.clamp(targetVelocityY, -0.8, 0.8);

      previousPointerX = smoothPointerX;
      previousPointerY = smoothPointerY;

      lastMoveTime = performance.now();
    };

    const handleResize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;

      resolution.set(width, height);
      renderer.setSize(width, height);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('resize', handleResize);

    // CLEANUP FUNCTION
    return () => {
      cancelAnimationFrame(frameId);

      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      geometry.dispose();
      material.dispose();
      
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 h-screen w-full overflow-hidden bg-[#020204] pointer-events-none"
    >
      {/* Fallback info kecil (opsional), jika WebGL mati user tidak bingung kenapa animasinya hilang */}
      {!isWebGLSupported && (
        <div className="absolute bottom-4 right-4 text-xs text-white/20 select-none">
          Akselerasi Perangkat Keras Dinonaktifkan
        </div>
      )}
    </div>
  );
}