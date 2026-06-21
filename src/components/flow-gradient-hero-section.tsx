"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
interface FlowGradientHeroSectionProps {
  title?: string;
  showPauseButton?: boolean;
  ctaText?: string;
  onCtaClick?: () => void;
}

class TouchTexture {
  size = 64;
  width = 64;
  height = 64;
  maxAge = 64;
  radius = 0.1;
  speed = 1 / 64;
  trail: any[] = [];
  last: any = null;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  texture: THREE.Texture;

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.ctx = this.canvas.getContext("2d")!;
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.texture = new THREE.Texture(this.canvas);
  }

  update() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.trail.length - 1; i >= 0; i--) {
      const p = this.trail[i];
      const f = p.force * this.speed * (1 - p.age / this.maxAge);

      p.x += p.vx * f;
      p.y += p.vy * f;
      p.age++;

      if (p.age > this.maxAge) this.trail.splice(i, 1);
      else this.drawPoint(p);
    }

    this.texture.needsUpdate = true;
  }

  addTouch(point: any) {
    let force = 0;
    let vx = 0;
    let vy = 0;

    if (this.last) {
      const dx = point.x - this.last.x;
      const dy = point.y - this.last.y;

      if (dx === 0 && dy === 0) return;

      const d = Math.sqrt(dx * dx + dy * dy);
      if (!d || !Number.isFinite(d)) return;

      vx = dx / d;
      vy = dy / d;
      force = Math.min((dx * dx + dy * dy) * 20000, 2.0);
    }

    this.last = { x: point.x, y: point.y };
    this.trail.push({ x: point.x, y: point.y, age: 0, force, vx, vy });
  }

  drawPoint(p: any) {
    const pos = {
      x: p.x * this.width,
      y: (1 - p.y) * this.height,
    };

    let intensity =
      p.age < this.maxAge * 0.3
        ? Math.sin((p.age / (this.maxAge * 0.3)) * (Math.PI / 2))
        : -(
            (1 - (p.age - this.maxAge * 0.3) / (this.maxAge * 0.7)) *
            ((1 - (p.age - this.maxAge * 0.3) / (this.maxAge * 0.7)) - 2)
          );

    intensity *= p.force;

    const color = `${((p.vx + 1) / 2) * 255}, ${
      ((p.vy + 1) / 2) * 255
    }, ${intensity * 255}`;

    const radius = this.radius * this.width;

    this.ctx.shadowOffsetX = this.size * 5;
    this.ctx.shadowOffsetY = this.size * 5;
    this.ctx.shadowBlur = radius;
    this.ctx.shadowColor = `rgba(${color},${0.2 * intensity})`;

    this.ctx.beginPath();
    this.ctx.fillStyle = "rgba(255,0,0,1)";
    this.ctx.arc(
      pos.x - this.size * 5,
      pos.y - this.size * 5,
      radius,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
  }
}

class GradientBackground {
  mesh: THREE.Mesh | null = null;
  uniforms: any;
  sceneManager: App;
  isPaused = false;

  constructor(sceneManager: App) {
    this.sceneManager = sceneManager;

    this.uniforms = {
      uTime: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },

      // AYUTA COLOR PALETTE
      uColor1: { value: new THREE.Vector3(0.466, 0.357, 0.643) }, // #775BA4
      uColor2: { value: new THREE.Vector3(0.945, 0.373, 0.647) }, // #F15FA5
      uColor3: { value: new THREE.Vector3(0.772, 0.333, 0.584) }, // #C55595
      uColor4: { value: new THREE.Vector3(0.643, 0.306, 0.541) }, // #A44E8A
      uColor5: { value: new THREE.Vector3(0.282, 0.302, 0.635) }, // #484DA2
      uColor6: { value: new THREE.Vector3(0.153, 0.341, 0.549) }, // #27578C

      uDarkNavy: { value: new THREE.Vector3(0.266, 0.282, 0.4) }, // #444866

      uSpeed: { value: 1.05 },
      uIntensity: { value: 1.35 },
      uTouchTexture: { value: null },
      uGrainIntensity: { value: 0.03 },
      uGradientSize: { value: 0.6 },
      uColor1Weight: { value: 1.1 },
      uColor2Weight: { value: 1.25 },
    };
  }

  init() {
    const viewSize = this.sceneManager.getViewSize();

    const width = Number.isFinite(viewSize.width) ? viewSize.width : 100;
    const height = Number.isFinite(viewSize.height) ? viewSize.height : 100;

    const geometry = new THREE.PlaneGeometry(width, height, 1, 1);

    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: `
        varying vec2 vUv;

        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          vUv = uv;
        }
      `,
      fragmentShader: `
        uniform float uTime, uSpeed, uIntensity, uGrainIntensity, uGradientSize, uColor1Weight, uColor2Weight;
        uniform vec2 uResolution;
        uniform vec3 uColor1, uColor2, uColor3, uColor4, uColor5, uColor6, uDarkNavy;
        uniform sampler2D uTouchTexture;
        varying vec2 vUv;

        float grain(vec2 uv, float t) {
          return fract(sin(dot(uv * uResolution * 0.5 + t, vec2(12.9898, 78.233))) * 43758.5453) * 2.0 - 1.0;
        }

        vec3 getGradientColor(vec2 uv, float time) {
          vec2 c1 = vec2(0.5 + sin(time * uSpeed * 0.4) * 0.4, 0.5 + cos(time * uSpeed * 0.5) * 0.4);
          vec2 c2 = vec2(0.5 + cos(time * uSpeed * 0.6) * 0.5, 0.5 + sin(time * uSpeed * 0.45) * 0.5);
          vec2 c3 = vec2(0.5 + sin(time * uSpeed * 0.35) * 0.45, 0.5 + cos(time * uSpeed * 0.55) * 0.45);
          vec2 c4 = vec2(0.5 + cos(time * uSpeed * 0.5) * 0.4, 0.5 + sin(time * uSpeed * 0.4) * 0.4);
          vec2 c5 = vec2(0.5 + sin(time * uSpeed * 0.7) * 0.35, 0.5 + cos(time * uSpeed * 0.6) * 0.35);
          vec2 c6 = vec2(0.5 + cos(time * uSpeed * 0.45) * 0.5, 0.5 + sin(time * uSpeed * 0.65) * 0.5);

          float i1 = 1.0 - smoothstep(0.0, uGradientSize, length(uv - c1));
          float i2 = 1.0 - smoothstep(0.0, uGradientSize, length(uv - c2));
          float i3 = 1.0 - smoothstep(0.0, uGradientSize, length(uv - c3));
          float i4 = 1.0 - smoothstep(0.0, uGradientSize, length(uv - c4));
          float i5 = 1.0 - smoothstep(0.0, uGradientSize, length(uv - c5));
          float i6 = 1.0 - smoothstep(0.0, uGradientSize, length(uv - c6));

          vec3 color = vec3(0.0);

          color += uColor1 * i1 * (0.55 + 0.45 * sin(time * uSpeed)) * uColor1Weight;
          color += uColor2 * i2 * (0.55 + 0.45 * cos(time * uSpeed * 1.2)) * uColor2Weight;
          color += uColor3 * i3 * (0.55 + 0.45 * sin(time * uSpeed * 0.8)) * uColor1Weight;
          color += uColor4 * i4 * (0.55 + 0.45 * cos(time * uSpeed * 1.3)) * uColor2Weight;
          color += uColor5 * i5 * (0.55 + 0.45 * sin(time * uSpeed * 1.1)) * uColor1Weight;
          color += uColor6 * i6 * (0.55 + 0.45 * cos(time * uSpeed * 0.9)) * uColor2Weight;

          color = clamp(color, vec3(0.0), vec3(1.0)) * uIntensity;

          float lum = dot(color, vec3(0.299, 0.587, 0.114));
          color = mix(vec3(lum), color, 1.35);
          color = pow(color, vec3(0.92));

          float brightness = length(color);
          color = mix(uDarkNavy, color, max(brightness * 1.15, 0.12));

          return color;
        }

        void main() {
          vec2 uv = vUv;

          vec4 touchTex = texture2D(uTouchTexture, uv);

          uv.x -= (touchTex.r * 2.0 - 1.0) * 0.8 * touchTex.b;
          uv.y -= (touchTex.g * 2.0 - 1.0) * 0.8 * touchTex.b;

          vec2 center = vec2(0.5);
          float dist = length(uv - center);
          float ripple = sin(dist * 20.0 - uTime * 3.0) * 0.04 * touchTex.b;

          uv += vec2(ripple);

          vec3 color = getGradientColor(uv, uTime);
          color += grain(uv, uTime) * uGrainIntensity;
          color = clamp(color, vec3(0.0), vec3(1.0));

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.sceneManager.scene.add(this.mesh);
  }

  update(delta: number) {
    if (!this.isPaused) {
      this.uniforms.uTime.value += delta;
    }
  }

  setTheme(isDark: boolean) {
    if (isDark) {
      this.uniforms.uColor1.value.set(0.466, 0.357, 0.643); // #775BA4
      this.uniforms.uColor2.value.set(0.945, 0.373, 0.647); // #F15FA5
      this.uniforms.uColor3.value.set(0.772, 0.333, 0.584); // #C55595
      this.uniforms.uColor4.value.set(0.643, 0.306, 0.541); // #A44E8A
      this.uniforms.uColor5.value.set(0.282, 0.302, 0.635); // #484DA2
      this.uniforms.uColor6.value.set(0.153, 0.341, 0.549); // #27578C
      this.uniforms.uDarkNavy.value.set(0.266, 0.282, 0.4); // #444866
      this.sceneManager.scene.background = new THREE.Color("#050505");
    } else {
      this.uniforms.uColor1.value.set(0.466, 0.357, 0.643);
      this.uniforms.uColor2.value.set(0.945, 0.373, 0.647);
      this.uniforms.uColor3.value.set(0.772, 0.333, 0.584);
      this.uniforms.uColor4.value.set(0.643, 0.306, 0.541);
      this.uniforms.uColor5.value.set(0.282, 0.302, 0.635);
      this.uniforms.uColor6.value.set(0.153, 0.341, 0.549);
      this.uniforms.uDarkNavy.value.set(0.97, 0.96, 1.0);
      this.sceneManager.scene.background = new THREE.Color("#f7f4ff");
    }
  }

  onResize(w: number, h: number) {
    const width = w || window.innerWidth || 1;
    const height = h || window.innerHeight || 1;

    const viewSize = this.sceneManager.getViewSize();

    const geoWidth = Number.isFinite(viewSize.width) ? viewSize.width : 100;
    const geoHeight = Number.isFinite(viewSize.height) ? viewSize.height : 100;

    if (this.mesh) {
      this.mesh.geometry.dispose();
      this.mesh.geometry = new THREE.PlaneGeometry(geoWidth, geoHeight, 1, 1);
    }

    this.uniforms.uResolution.value.set(width, height);
  }

  cleanup() {
    if (this.mesh) {
      this.mesh.geometry.dispose();

      const material = this.mesh.material;

      if (Array.isArray(material)) {
        material.forEach((m) => m.dispose());
      } else {
        material.dispose();
      }

      this.sceneManager.scene.remove(this.mesh);
      this.mesh = null;
    }
  }
}

class App {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  clock: THREE.Clock;
  touchTexture: TouchTexture;
  gradientBackground: GradientBackground;
  animationId: number | null = null;
  container: HTMLElement;

  private handleResizeBound: () => void;
  private handleMouseMoveBound: (e: MouseEvent) => void;
  private handleTouchMoveBound: (e: TouchEvent) => void;

  constructor(container: HTMLElement) {
    this.container = container;

    const width = container.clientWidth || window.innerWidth || 1;
    const height = container.clientHeight || window.innerHeight || 1;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
    });

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";
    this.renderer.domElement.style.display = "block";

    container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
    this.camera.position.z = 50;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#050505");

    this.clock = new THREE.Clock();
    this.touchTexture = new TouchTexture();

    this.gradientBackground = new GradientBackground(this);
    this.gradientBackground.uniforms.uTouchTexture.value =
      this.touchTexture.texture;

    this.handleResizeBound = this.handleResize.bind(this);
    this.handleMouseMoveBound = this.handleMouseMove.bind(this);
    this.handleTouchMoveBound = this.handleTouchMove.bind(this);

    this.init();
  }

  setTheme(isDark: boolean) {
    this.gradientBackground.setTheme(isDark);
  }

  setPaused(paused: boolean) {
    this.gradientBackground.isPaused = paused;
  }

  getViewSize() {
    const aspect =
      Number.isFinite(this.camera.aspect) && this.camera.aspect > 0
        ? this.camera.aspect
        : window.innerWidth / window.innerHeight || 1;

    const fov = (this.camera.fov * Math.PI) / 180;
    const height = Math.abs(this.camera.position.z * Math.tan(fov / 2) * 2);

    return {
      width: height * aspect,
      height,
    };
  }

  init() {
    this.gradientBackground.init();

    this.container.addEventListener("mousemove", this.handleMouseMoveBound);
    this.container.addEventListener("touchmove", this.handleTouchMoveBound, {
      passive: true,
    });

    window.addEventListener("resize", this.handleResizeBound);
    this.tick();
  }

  handleMouseMove(e: MouseEvent) {
    const rect = this.container.getBoundingClientRect();

    const width = rect.width || window.innerWidth || 1;
    const height = rect.height || window.innerHeight || 1;

    this.touchTexture.addTouch({
      x: (e.clientX - rect.left) / width,
      y: 1 - (e.clientY - rect.top) / height,
    });
  }

  handleTouchMove(e: TouchEvent) {
    const touch = e.touches[0];
    if (!touch) return;

    const rect = this.container.getBoundingClientRect();

    const width = rect.width || window.innerWidth || 1;
    const height = rect.height || window.innerHeight || 1;

    this.touchTexture.addTouch({
      x: (touch.clientX - rect.left) / width,
      y: 1 - (touch.clientY - rect.top) / height,
    });
  }

  handleResize() {
    const width = this.container.clientWidth || window.innerWidth || 1;
    const height = this.container.clientHeight || window.innerHeight || 1;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.gradientBackground.onResize(width, height);
  }

  tick() {
    const delta = Math.min(this.clock.getDelta(), 0.1);

    this.touchTexture.update();
    this.gradientBackground.update(delta);
    this.renderer.render(this.scene, this.camera);

    this.animationId = requestAnimationFrame(() => this.tick());
  }

  cleanup() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    this.container.removeEventListener("mousemove", this.handleMouseMoveBound);
    this.container.removeEventListener("touchmove", this.handleTouchMoveBound);
    window.removeEventListener("resize", this.handleResizeBound);

    this.gradientBackground.cleanup();
    this.touchTexture.texture.dispose();
    this.renderer.dispose();

    if (
      this.container &&
      this.renderer.domElement &&
      this.container.contains(this.renderer.domElement)
    ) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}

export default function FlowGradientHeroSection({
  title = "",
  showPauseButton = false,
  ctaText = "",
  onCtaClick,
}: FlowGradientHeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showCursor, setShowCursor] = useState(false);

  const appRef = useRef<App | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const checkTheme = () => {
      const html = document.documentElement;
      const body = document.body;

      const isDark =
        html.classList.contains("dark") ||
        body.classList.contains("dark") ||
        html.getAttribute("data-theme") === "dark" ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;

      setIsDarkMode(isDark);
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", checkTheme);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", checkTheme);
    };
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;

    if (!cursor || !dot) return;

    let cursorX = 0;
    let cursorY = 0;
    let dotX = 0;
    let dotY = 0;
    let animId: number;

    const animate = () => {
      cursorX += (mousePos.current.x - cursorX) * 0.12;
      cursorY += (mousePos.current.y - cursorY) * 0.12;

      dotX += (mousePos.current.x - dotX) * 0.3;
      dotY += (mousePos.current.y - dotY) * 0.3;

      cursor.style.transform = `translate(${cursorX - 20}px, ${
        cursorY - 20
      }px)`;

      dot.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const frame = requestAnimationFrame(() => {
      if (appRef.current) {
        appRef.current.cleanup();
      }

      appRef.current = new App(container);
    });

    return () => {
      cancelAnimationFrame(frame);

      if (appRef.current) {
        appRef.current.cleanup();
        appRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (appRef.current) {
      appRef.current.setTheme(isDarkMode);
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (appRef.current) {
      appRef.current.setPaused(!isPlaying);
    }
  }, [isPlaying]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  return (
    <div
      className="liquid-container absolute inset-0 h-full w-full overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowCursor(true)}
      onMouseLeave={() => setShowCursor(false)}
    >
      <div ref={containerRef} className="liquid-canvas-wrapper h-full w-full" />

      <div
        ref={cursorRef}
        className={`cursor-ring pointer-events-none ${isDarkMode ? "dark" : ""}`}
        style={{ opacity: showCursor ? 1 : 0 }}
      />

      <div
        ref={cursorDotRef}
        className={`cursor-dot-element pointer-events-none ${
          isDarkMode ? "dark" : ""
        }`}
        style={{ opacity: showCursor ? 1 : 0 }}
      />

      {title && (
        <h1 className={`title-main ${isDarkMode ? "dark" : ""}`}>{title}</h1>
      )}

      {ctaText && (
        <button
          className={`cta-btn ${isDarkMode ? "dark" : ""}`}
          onClick={onCtaClick}
        >
          {ctaText}
        </button>
      )}

      {showPauseButton && (
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`pause-btn ${isDarkMode ? "dark" : ""}`}
          aria-label={isPlaying ? "Pause animation" : "Play animation"}
        >
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5.14v14l11-7-11-7z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}

export { FlowGradientHeroSection as Component };