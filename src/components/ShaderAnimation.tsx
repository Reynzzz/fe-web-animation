import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ShaderAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.15));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    container.appendChild(renderer.domElement);

    const uniforms = {
      u_time: { value: 0 },
      u_resolution: {
        value: new THREE.Vector2(container.clientWidth, container.clientHeight),
      },
    };

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;

      uniform float u_time;
      uniform vec2 u_resolution;

      vec3 blackBg = vec3(0.001, 0.001, 0.002);

      // warna dibuat mirip reference, tapi tidak terang
      vec3 orangeDark = vec3(0.58, 0.18, 0.035);
      vec3 orangeSoft = vec3(0.38, 0.10, 0.020);
      vec3 blueDark   = vec3(0.025, 0.055, 0.16);
      vec3 blueMid    = vec3(0.060, 0.110, 0.28);
      vec3 cyanSoft   = vec3(0.36, 0.48, 0.50);

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

        vec2 u = f * f * (3.0 - 2.0 * f);

        return mix(a, b, u.x)
          + (c - a) * u.y * (1.0 - u.x)
          + (d - b) * u.x * u.y;
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;

        for (int i = 0; i < 5; i++) {
          v += a * noise(p);
          p *= 2.0;
          a *= 0.5;
        }

        return v;
      }

      float sdSegment(vec2 p, vec2 a, vec2 b) {
        vec2 pa = p - a;
        vec2 ba = b - a;
        float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
        return length(pa - ba * h);
      }

      float ring(vec2 p, vec2 c, float radius, float width, float blur) {
        float d = abs(length(p - c) - radius);
        return smoothstep(width + blur, width, d);
      }

      float circle(vec2 p, vec2 c, float radius, float blur) {
        float d = length(p - c);
        return smoothstep(radius + blur, radius, d);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;

        vec2 p = uv - 0.5;
        p.x *= u_resolution.x / u_resolution.y;

        float t = u_time * 0.035;

        // distorsi kecil saja supaya tidak berubah shape
        float n = fbm(p * 2.0 + vec2(t * 0.2, -t * 0.12));

        vec2 q = p;
        q.x += (n - 0.5) * 0.012;
        q.y += (n - 0.5) * 0.018;

        vec3 color = blackBg;

        // ======================================================
        // 1. DIAGONAL BAND UTAMA
        // posisi dibuat lebih mirip reference
        // ======================================================

        vec2 bandA = vec2(-1.42, 0.72);
        vec2 bandB = vec2(0.04, -0.75);

        float dBand = sdSegment(q, bandA, bandB);

        float bandOuter = smoothstep(0.72, 0.18, dBand);
        float bandBlue  = smoothstep(0.58, 0.16, dBand);
        float bandCyan  = smoothstep(0.38, 0.24, dBand) * smoothstep(0.08, 0.25, dBand);
        float bandCore  = smoothstep(0.25, 0.00, dBand);

        color += blueDark * bandOuter * 1.10;
        color += blueMid * bandBlue * 0.90;
        color += cyanSoft * bandCyan * 0.60;
        color += orangeSoft * bandCore * 0.45;
        color += orangeDark * bandCore * 0.58;

        // bagian atas harus tetap hitam
        float upperBlack = smoothstep(0.34, 0.78, q.y);
        color = mix(color, blackBg, upperBlack * 0.55);

        // ======================================================
        // 2. RING KANAN ATAS
        // lebih besar, lebih keluar frame, seperti screenshot
        // ======================================================

        vec2 rc = vec2(1.10, 0.53);

        float ringBlueOuter = ring(q, rc, 0.88, 0.35, 0.42);
        float ringCyan      = ring(q, rc, 0.77, 0.21, 0.25);
        float ringOrange    = ring(q, rc, 0.67, 0.14, 0.17);

        color += blueDark * ringBlueOuter * 1.20;
        color += blueMid * ringBlueOuter * 0.78;
        color += cyanSoft * ringCyan * 0.58;
        color += orangeSoft * ringOrange * 0.55;
        color += orangeDark * ringOrange * 0.68;

        // lubang hitam besar
        float hole = circle(q, rc, 0.54, 0.28);
        color = mix(color, blackBg, hole * 0.995);

        // ======================================================
        // 3. ARC KIRI BAWAH
        // ======================================================

        vec2 lc = vec2(-1.09, -0.74);

        float leftArcOuter = ring(q, lc, 0.34, 0.17, 0.22);
        float leftArcCyan  = ring(q, lc, 0.27, 0.09, 0.14);
        float leftArcHole  = circle(q, lc, 0.18, 0.11);

        color += blueMid * leftArcOuter * 0.55;
        color += cyanSoft * leftArcCyan * 0.28;
        color = mix(color, blackBg, leftArcHole * 0.72);

        // ======================================================
        // 4. AREA HITAM TENGAH ATAS
        // di reference tengah atas kosong gelap
        // ======================================================

        float centerTopDark = circle(q, vec2(0.02, 0.25), 0.48, 0.42);
        color = mix(color, blackBg, centerTopDark * 0.75);

        // ======================================================
        // 5. BOTTOM BLUE FIELD
        // biru tipis di area bawah
        // ======================================================

        float bottomBlue = smoothstep(0.12, -0.58, q.y);
        color += blueDark * bottomBlue * 0.34;
        color += blueMid * bottomBlue * 0.12;

        // ======================================================
        // 6. VIGNETTE DAN DARK MASK
        // ======================================================

        float vignette = smoothstep(1.32, 0.24, length(p));
        color *= vignette;

        float rightDark = smoothstep(0.26, 1.18, q.x + q.y * 0.18);
        color = mix(color, blackBg, rightDark * 0.22);

        float topDark = smoothstep(0.20, 0.72, q.y);
        color = mix(color, blackBg, topDark * 0.22);

        // exposure rendah agar tidak terang
        color *= 0.66;

        // grain kasar seperti reference
        float grain = hash(uv * u_resolution.xy + fract(u_time * 0.06));
        color += (grain - 0.5) * 0.085;

        color = max(color, 0.0);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const geometry = new THREE.PlaneGeometry(2, 2);

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      depthWrite: false,
      depthTest: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const clock = new THREE.Clock();
    let animationId = 0;
    let isIntersecting = true;

    const animate = () => {
      if (!isIntersecting) return;
      uniforms.u_time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasIntersecting = isIntersecting;
        isIntersecting = entry.isIntersecting;
        if (isIntersecting && !wasIntersecting) {
          animate();
        }
      },
      { rootMargin: '100px', threshold: 0 }
    );
    observer.observe(container);

    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      renderer.setSize(width, height);
      uniforms.u_resolution.value.set(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);

      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}