import { useEffect, useRef } from "react";
import { SPHERE } from "../data/ui.js";
import { isLand } from "../data/earth.js";
import { mulberry32 } from "../data/scenarios.js";

// Point-cloud Earth: orange dots on black. Land is dense and bright, ocean
// sparse and dim; same accent color throughout, only density/size/alpha vary.
// Auto-rotates; on fine pointers the cursor steers it with eased inertia.
// Coarse pointers get a smaller globe, no cursor tracking. Reduced motion
// renders a single static frame. pointer-events: none, never blocks the page.
export default function Sphere() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const size = fine ? SPHERE.size : SPHERE.mobileSize;
    const candidates = fine ? SPHERE.candidates : SPHERE.mobileCandidates;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    // CSS caps the display size so the globe scales down instead of
    // overflowing narrow columns; the backing store stays at full resolution.
    canvas.style.width = `min(100%, ${size}px)`;
    canvas.style.height = "auto";
    canvas.style.aspectRatio = "1 / 1";
    ctx.scale(dpr, dpr);

    // Fibonacci-sphere candidates, kept densely on land and sparsely on ocean.
    // Seeded PRNG keeps the ocean scatter identical every load.
    const rand = mulberry32(7);
    const golden = Math.PI * (3 - Math.sqrt(5));
    const pts = [];
    for (let i = 0; i < candidates; i++) {
      const y = 1 - (i / (candidates - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      const x = Math.cos(th) * r;
      const z = Math.sin(th) * r;
      const latDeg = (Math.asin(y) * 180) / Math.PI;
      // Negated longitude keeps continents un-mirrored on screen.
      const lonDeg = (-Math.atan2(z, x) * 180) / Math.PI;
      const land = isLand(latDeg, lonDeg);
      if (land) pts.push(x, y, z, 1);
      else if (rand() < SPHERE.oceanKeep) pts.push(x, y, z, 0);
    }
    const count = pts.length / 4;

    const R = size * SPHERE.radiusRatio;
    const c = size / 2;
    const baseTilt = 0.35;
    let spin = 0;
    let ry = 0;
    let rx = baseTilt;
    let targetRy = 0;
    let targetRx = baseTilt;
    let raf;

    const onMove = (e) => {
      targetRy = (e.clientX / window.innerWidth - 0.5) * 1.2;
      targetRx = baseTilt + (e.clientY / window.innerHeight - 0.5) * 0.8;
    };

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      ctx.fillStyle = "#FF5A12";
      const cosY = Math.cos(ry + spin);
      const sinY = Math.sin(ry + spin);
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      for (let i = 0; i < count; i++) {
        const x0 = pts[i * 4];
        const y0 = pts[i * 4 + 1];
        const z0 = pts[i * 4 + 2];
        const land = pts[i * 4 + 3] === 1;
        const x1 = x0 * cosY + z0 * sinY;
        const z1 = -x0 * sinY + z0 * cosY;
        const y2 = y0 * cosX - z1 * sinX;
        const z2 = y0 * sinX + z1 * cosX;
        const depth = (z2 + 1) / 2;
        const persp = 1 / (1.9 - z2 * 0.55);
        const px = c + x1 * R * persp;
        const py = c - y2 * R * persp;
        if (land) {
          ctx.globalAlpha = 0.14 + depth * 0.86;
          const d = 1.1 + depth * 1.8;
          ctx.fillRect(px, py, d, d);
        } else {
          ctx.globalAlpha = 0.05 + depth * 0.22;
          const d = 0.7 + depth * 0.9;
          ctx.fillRect(px, py, d, d);
        }
      }
      ctx.globalAlpha = 1;
    };

    const tick = () => {
      spin += SPHERE.spinPerFrame;
      ry += (targetRy - ry) * SPHERE.easing;
      rx += (targetRx - rx) * SPHERE.easing;
      draw();
      raf = requestAnimationFrame(tick);
    };

    if (reduced) {
      draw();
    } else {
      if (fine) window.addEventListener("mousemove", onMove);
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none select-none" />;
}
