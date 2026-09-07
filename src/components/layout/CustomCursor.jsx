import React, { useEffect, useRef, useState } from 'react';

// ============================================================================
// ZENJI ULTRA ELECTRIFIED CURSED FLAME CURSOR ENGINE
// - Base: public/cursor/Flame_Cursor.png directly from cursor folder
// - Exact Pointer Tip: Locked to arrow apex at (387, 305) in 1254x1254 space
//   with 0ms input lag and 100% clicking precision
// - Enhanced Features:
//   1. Trailing Cursed Flame Puffs: Living fire puffs dragging backward opposite to velocity
//   2. Floating Volcanic Embers & Ash Sparks: Oscillating embers rising with gentle buoyancy
//   3. Branching Cursed Lightning Arcs: Jagged, unstable electric bolts with white-hot flashes
//   4. Thermal Velocity Flare: Flame size, intensity, and speed dynamically scale with mouse speed
//   5. Smooth ~0.5s Cooling Decay: Graceful cooling fire transition when motion stops
//   6. Interactive Overcharge: Living thermal breathing pulse when hovering clickable elements
//   7. Visceral Cursed Nova Click Burst: Expanding radial fire shockwave and needle sparks
// ============================================================================

const CURSOR_SIZE = 52;
const HOTSPOT_X = CURSOR_SIZE * (387 / 1254); // ~16.05px (Arrow apex tip)
const HOTSPOT_Y = CURSOR_SIZE * (305 / 1254); // ~12.65px

const CANVAS_SIZE = 170;
const CANVAS_OFFSET_X = 45;
const CANVAS_OFFSET_Y = 40;

// Perimeter anchor points on Flame_Cursor.png (relative to pointer tip at (0, 0))
const ANCHORS_1254 = [
  { x: 387, y: 305 },  // Tip apex -> (0, 0)
  { x: 340, y: 340 },  // Left upper edge
  { x: 303, y: 374 },  // Left wing outer tip
  { x: 410, y: 520 },  // Left inner slope
  { x: 480, y: 680 },  // Left inner notch
  { x: 600, y: 820 },  // Left tail shaft
  { x: 848, y: 1019 }, // Tail tip
  { x: 730, y: 640 },  // Right tail shaft
  { x: 680, y: 560 },  // Right inner notch
  { x: 909, y: 777 },  // Right wing tip
  { x: 650, y: 480 },  // Right upper ridge
  { x: 520, y: 540 },  // Central molten core
];

const ANCHORS = ANCHORS_1254.map((p) => ({
  x: CURSOR_SIZE * (p.x / 1254) - HOTSPOT_X,
  y: CURSOR_SIZE * (p.y / 1254) - HOTSPOT_Y,
}));

const BOLT_COLORS = ['#FF3347', '#D72638', '#FF1A35', '#7A0C18'];
const WHITE_HOT_COLOR = '#FFF4EC';
const EMBER_COLORS = ['#FFF4EC', '#FFD166', '#FF3347', '#D72638', '#FF6B7A'];

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // DOM node references for zero-rerender direct RAF updates
  const rootRef = useRef(null);
  const wrapperRef = useRef(null);
  const auraRef = useRef(null);
  const shockwaveRef = useRef(null);
  const canvasRef = useRef(null);

  // High-frequency animation state stored in ref
  const stateRef = useRef({
    targetX: -500,
    targetY: -500,
    currentX: -500,
    currentY: -500,

    vx: 0,
    vy: 0,
    speed: 0,

    // Cursed energy intensity: 0.15 (idle) -> 1.0 (max velocity cap)
    intensity: 0.15,
    isHovering: false,
    isMoving: false,
    lastMoveTime: 0,

    // Click discharge burst
    isClicking: false,
    clickBurst: 0,
    clickScale: 1.0,
    shockwaveProgress: 0,

    isVisible: false,

    // Pre-allocated particle pools (zero GC overhead)
    flamePuffs: [],
    embers: [],
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const finePointerQuery = window.matchMedia('(pointer: fine)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!finePointerQuery.matches) {
      setEnabled(false);
      return;
    }

    setEnabled(true);
    setReducedMotion(reducedMotionQuery.matches);

    const handlePointerChange = (e) => setEnabled(e.matches);
    const handleMotionChange = (e) => setReducedMotion(e.matches);

    finePointerQuery.addEventListener('change', handlePointerChange);
    reducedMotionQuery.addEventListener('change', handleMotionChange);

    document.body.classList.add('has-custom-cursor');

    return () => {
      finePointerQuery.removeEventListener('change', handlePointerChange);
      reducedMotionQuery.removeEventListener('change', handleMotionChange);
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const s = stateRef.current;
    s.lastMoveTime = performance.now();

    // 1. Pre-allocate Flame Puffs pool (14 particles)
    s.flamePuffs = [];
    for (let i = 0; i < 14; i++) {
      s.flamePuffs.push({
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 3,
        maxSize: 8,
        life: 0,
        maxLife: 18,
        color: '#D72638',
        coreColor: '#FF3347',
      });
    }

    // 2. Pre-allocate Embers / Ash Sparks pool (20 particles)
    s.embers = [];
    for (let i = 0; i < 20; i++) {
      s.embers.push({
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 1.2,
        life: 0,
        maxLife: 24,
        color: '#FFD166',
        wobble: 0,
        isSpark: false,
      });
    }

    const spawnFlamePuff = (originX, originY, vx, vy, isOvercharged = false) => {
      if (reducedMotion) return;
      const fp = s.flamePuffs.find((item) => !item.active);
      if (!fp) return;
      fp.active = true;
      fp.x = CANVAS_OFFSET_X + originX;
      fp.y = CANVAS_OFFSET_Y + originY;
      fp.vx = vx;
      fp.vy = vy;
      fp.life = 0;
      fp.maxLife = 14 + Math.floor(Math.random() * 12);
      fp.size = 2.5 + Math.random() * 2.0;
      fp.maxSize = 6.0 + Math.random() * 4.5;
      fp.color = isOvercharged ? '#FF1A35' : '#D72638';
      fp.coreColor = Math.random() > 0.4 ? '#FF7A00' : '#FFF4EC';
    };

    const spawnEmber = (originX, originY, vx, vy, isSpark = false) => {
      if (reducedMotion) return;
      const em = s.embers.find((item) => !item.active);
      if (!em) return;
      em.active = true;
      em.x = CANVAS_OFFSET_X + originX;
      em.y = CANVAS_OFFSET_Y + originY;
      em.vx = vx;
      em.vy = vy;
      em.life = 0;
      em.isSpark = isSpark;
      em.wobble = Math.random() * Math.PI * 2;

      if (isSpark) {
        em.maxLife = 8 + Math.floor(Math.random() * 8);
        em.size = 1.0 + Math.random() * 1.2;
        em.color = Math.random() > 0.3 ? WHITE_HOT_COLOR : '#FF3347';
      } else {
        em.maxLife = 18 + Math.floor(Math.random() * 16);
        em.size = 0.9 + Math.random() * 1.4;
        em.color = EMBER_COLORS[Math.floor(Math.random() * EMBER_COLORS.length)];
      }
    };

    const onMouseMove = (e) => {
      s.targetX = e.clientX;
      s.targetY = e.clientY;
      s.lastMoveTime = performance.now();
      s.isMoving = true;

      if (!s.isVisible) {
        s.isVisible = true;
        s.currentX = e.clientX;
        s.currentY = e.clientY;
        if (rootRef.current) rootRef.current.style.opacity = '1';
        document.body.classList.add('has-custom-cursor');
      }
    };

    const onMouseDown = () => {
      s.isClicking = true;
      s.clickScale = 0.88;
      s.clickBurst = 1.0;
      s.shockwaveProgress = 0;

      // Spawn radial flame nova burst of 10 needle sparks & fire puffs
      for (let i = 0; i < 10; i++) {
        const ang = (Math.PI * 2 * i) / 10 + (Math.random() - 0.5) * 0.4;
        const spd = 2.4 + Math.random() * 2.2;
        spawnEmber(
          HOTSPOT_X,
          HOTSPOT_Y,
          Math.cos(ang) * spd,
          Math.sin(ang) * spd,
          true
        );
        if (i % 2 === 0) {
          spawnFlamePuff(
            HOTSPOT_X,
            HOTSPOT_Y,
            Math.cos(ang) * spd * 0.5,
            Math.sin(ang) * spd * 0.5,
            true
          );
        }
      }
    };

    const onMouseUp = () => {
      s.isClicking = false;
      s.clickScale = 1.04;
      setTimeout(() => {
        if (!s.isClicking) s.clickScale = 1.0;
      }, 90);
    };

    const onMouseOver = (e) => {
      const target = e.target;
      if (!target) return;
      const interactive = target.closest(
        'button, a, input, select, textarea, [role="button"], .cursor-pointer, .clickable, label, [data-interactive="true"]'
      );
      s.isHovering = !!interactive;
    };

    const onMouseLeave = () => {
      s.isVisible = false;
      if (rootRef.current) rootRef.current.style.opacity = '0';
      document.body.classList.remove('has-custom-cursor');
    };

    const onMouseEnter = () => {
      s.isVisible = true;
      if (rootRef.current) rootRef.current.style.opacity = '1';
      document.body.classList.add('has-custom-cursor');
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // High-performance recursive midpoint displacement jagged lightning generator
    const drawJaggedLightning = (ctx, x1, y1, x2, y2, color, coreColor, maxDisplacement, branchChance = 0) => {
      let pts = [{ x: x1, y: y1 }, { x: x2, y: y2 }];
      const iterations = 3;

      for (let it = 0; it < iterations; it++) {
        const nextPts = [pts[0]];
        const disp = maxDisplacement / Math.pow(1.5, it);
        for (let i = 0; i < pts.length - 1; i++) {
          const pA = pts[i];
          const pB = pts[i + 1];
          const mx = (pA.x + pB.x) / 2 + (Math.random() - 0.5) * disp * 2;
          const my = (pA.y + pB.y) / 2 + (Math.random() - 0.5) * disp * 2;
          const mid = { x: mx, y: my };
          nextPts.push(mid);
          nextPts.push(pB);

          // Secondary branch fork
          if (branchChance > 0 && Math.random() < branchChance && it === 1) {
            const segLen = Math.hypot(pB.x - pA.x, pB.y - pA.y) * 0.65;
            const baseAngle = Math.atan2(pB.y - pA.y, pB.x - pA.x);
            const branchAngle = baseAngle + (Math.random() > 0.5 ? 0.75 : -0.75);
            const bx = mx + Math.cos(branchAngle) * segLen;
            const by = my + Math.sin(branchAngle) * segLen;
            drawJaggedLightning(ctx, mx, my, bx, by, color, null, disp * 0.7, 0);
          }
        }
        pts = nextPts;
      }

      // Outer colored stroke
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = coreColor ? 1.6 : 1.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'bevel';
      ctx.stroke();

      // Sharp white-hot inner core
      if (coreColor) {
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo(pts[i].x, pts[i].y);
        }
        ctx.strokeStyle = coreColor;
        ctx.lineWidth = 0.75;
        ctx.stroke();
      }

      return pts;
    };

    let animationFrameId;
    let lastTime = performance.now();

    const tick = (now) => {
      animationFrameId = requestAnimationFrame(tick);

      const dt = Math.min((now - lastTime) / 1000, 0.08);
      lastTime = now;

      if (!s.isVisible) return;

      // 1. Track instant mouse position (Zero lag: cursor locks directly)
      const dx = s.targetX - s.currentX;
      const dy = s.targetY - s.currentY;
      s.currentX = s.targetX;
      s.currentY = s.targetY;

      // 2. Velocity Calculation
      s.vx = dx / (dt || 0.016);
      s.vy = dy / (dt || 0.016);
      s.speed = Math.hypot(s.vx, s.vy);

      const timeSinceMove = now - s.lastMoveTime;
      if (timeSinceMove > 50) {
        s.isMoving = false;
      }

      // 3. Flame & Cursed Energy Velocity Engine
      // Idle: 0.15 | Hover Overcharge: 0.50 | Max velocity cap: 1.00
      const baseIntensity = s.isHovering ? 0.50 : 0.15;
      const normalizedSpeed = Math.min(1.0, s.speed / 1100);
      const targetIntensity = baseIntensity + normalizedSpeed * (1.0 - baseIntensity);

      if (targetIntensity > s.intensity) {
        // Snappy, energetic rise on acceleration
        s.intensity += (targetIntensity - s.intensity) * Math.min(1.0, dt * 14);
      } else {
        // Smooth ~0.5s cooling decay back to idle when mouse slows/stops
        s.intensity += (targetIntensity - s.intensity) * Math.min(1.0, (dt / 0.50) * 2.2);
      }
      s.intensity = Math.max(0.15, Math.min(1.0, s.intensity));

      // Click burst decay (~220ms)
      if (s.clickBurst > 0) {
        s.clickBurst = Math.max(0, s.clickBurst - dt / 0.22);
      }

      // 4. Update Root Cursor Position (Locked to mouse coordinate with 0 lag)
      if (rootRef.current) {
        rootRef.current.style.transform = `translate3d(${s.currentX}px, ${s.currentY}px, 0)`;
      }

      // 5. Dynamic Aerodynamic Banking Tilt (Pivot strictly at arrow apex)
      if (wrapperRef.current) {
        const tilt = reducedMotion ? 0 : Math.max(-2.2, Math.min(2.2, s.vx * 0.0020));
        wrapperRef.current.style.transform = `translate3d(-${HOTSPOT_X}px, -${HOTSPOT_Y}px, 0) rotate(${tilt}deg) scale(${s.clickScale})`;
      }

      // 6. Form-Fitting Thermal Fire Mantle Behind Flame_Cursor.png
      if (auraRef.current && !reducedMotion) {
        const hoverBreathe = s.isHovering ? Math.sin(now * 0.008) * 0.05 : 0;
        const totalInt = Math.min(1.0, s.intensity + s.clickBurst * 0.6 + hoverBreathe);
        const auraScale = 1.0 + totalInt * 0.12;
        const auraOpacity = 0.25 + totalInt * 0.65;
        const blurInner = (2 + totalInt * 6).toFixed(1);
        const blurOuter = (5 + totalInt * 12).toFixed(1);

        auraRef.current.style.transform = `scale(${auraScale.toFixed(3)})`;
        auraRef.current.style.opacity = auraOpacity.toFixed(3);
        auraRef.current.style.filter = `drop-shadow(0 0 ${blurInner}px #FF3347) drop-shadow(0 0 ${blurOuter}px #D72638)`;
      }

      // 7. Click Nova Shockwave
      if (s.clickBurst > 0 && shockwaveRef.current) {
        s.shockwaveProgress += dt / 0.22;
        if (s.shockwaveProgress >= 1) {
          shockwaveRef.current.style.opacity = '0';
        } else {
          const swScale = 0.15 + s.shockwaveProgress * 1.6;
          const swOpacity = (1.0 - s.shockwaveProgress) * 0.95;
          shockwaveRef.current.style.transform = `translate(-50%, -50%) scale(${swScale.toFixed(3)})`;
          shockwaveRef.current.style.opacity = swOpacity.toFixed(3);
        }
      }

      // 8. Canvas Living Flame FX: Puffs, Embers & Cursed Lightning
      if (canvasRef.current && !reducedMotion) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

          const totalIntensity = Math.min(1.0, s.intensity + s.clickBurst * 0.85);

          // Drag vector: stretches fire and electricity opposite to movement direction
          const dragFactor = Math.min(16, s.speed * 0.018);
          const moveAngle = Math.atan2(s.vy, s.vx);
          const dragAngle = moveAngle + Math.PI;
          const dragX = Math.cos(dragAngle) * dragFactor;
          const dragY = Math.sin(dragAngle) * dragFactor;

          // ================================================================
          // A. SPAWN LIVING FLAME PUFFS & FLOATING EMBERS
          // ================================================================
          // Flame puff spawn rate tied to velocity & hover overcharge
          const puffChance = s.isMoving
            ? 0.18 + (s.speed / 1000) * 0.45
            : s.isHovering
            ? 0.12
            : 0.04;

          if (Math.random() < puffChance) {
            // Spawn from trailing wings and tail notches
            const a = ANCHORS[1 + Math.floor(Math.random() * (ANCHORS.length - 1))];
            const pvx = dragX * 0.05 + (Math.random() - 0.5) * 0.6;
            const pvy = dragY * 0.05 - 0.5 + (Math.random() - 0.5) * 0.6;
            spawnFlamePuff(a.x, a.y, pvx, pvy, s.isHovering || totalIntensity > 0.6);
          }

          // Ember spawn rate
          const emberChance = s.isMoving
            ? 0.20 + (s.speed / 1000) * 0.40
            : s.isHovering
            ? 0.15
            : 0.06;

          if (Math.random() < emberChance) {
            const a = ANCHORS[Math.floor(Math.random() * ANCHORS.length)];
            const evx = dragX * 0.06 + (Math.random() - 0.5) * 0.8;
            const evy = dragY * 0.06 - 0.8 - Math.random() * 0.8;
            spawnEmber(a.x, a.y, evx, evy, false);
          }

          // ================================================================
          // B. RENDER FLAME PUFFS (Layered additive thermal fire)
          // ================================================================
          ctx.globalCompositeOperation = 'lighter';
          for (let i = 0; i < s.flamePuffs.length; i++) {
            const fp = s.flamePuffs[i];
            if (!fp.active) continue;

            fp.x += fp.vx;
            fp.y += fp.vy;
            fp.life++;

            const progress = fp.life / fp.maxLife;
            if (progress >= 1) {
              fp.active = false;
              continue;
            }

            const curSize = fp.size + (fp.maxSize - fp.size) * progress;
            const alpha = (1.0 - progress) * 0.65;

            // Outer thermal crimson
            ctx.beginPath();
            ctx.arc(fp.x, fp.y, curSize, 0, Math.PI * 2);
            ctx.fillStyle = fp.color;
            ctx.globalAlpha = alpha * 0.55;
            ctx.fill();

            // Inner hot core
            ctx.beginPath();
            ctx.arc(fp.x, fp.y, curSize * 0.42, 0, Math.PI * 2);
            ctx.fillStyle = fp.coreColor;
            ctx.globalAlpha = alpha;
            ctx.fill();
          }

          // ================================================================
          // C. RENDER BRANCHING JAGGED CURSED LIGHTNING ARCS
          // ================================================================
          let numArcs = 0;
          if (totalIntensity < 0.20) {
            // Idle: calm resting state, occasional subtle micro-flicker
            numArcs = Math.random() < 0.28 ? 1 : 0;
          } else {
            // Motion: scales from 1 up to 6-7 active arcs at top speed
            numArcs = Math.floor(1 + totalIntensity * 5.5);
            if (s.clickBurst > 0.2) numArcs += 3;
          }

          for (let i = 0; i < numArcs; i++) {
            const col = BOLT_COLORS[Math.floor(Math.random() * BOLT_COLORS.length)];
            const isWhiteHot =
              (totalIntensity > 0.55 && Math.random() < 0.45) ||
              (s.clickBurst > 0.1 && Math.random() < 0.65);
            const coreCol = isWhiteHot ? WHITE_HOT_COLOR : null;

            // 40% Contour arc (snapping along edge) vs 60% Discharge arc
            const isContour = Math.random() < 0.40 && totalIntensity > 0.10;

            if (isContour) {
              const idx = 1 + Math.floor(Math.random() * (ANCHORS.length - 2));
              const a1 = ANCHORS[idx];
              const a2 = ANCHORS[1 + ((idx - 1 + (Math.random() > 0.5 ? 1 : -1) + (ANCHORS.length - 2)) % (ANCHORS.length - 2))];
              const sx = CANVAS_OFFSET_X + a1.x;
              const sy = CANVAS_OFFSET_Y + a1.y;
              const ex = CANVAS_OFFSET_X + a2.x;
              const ey = CANVAS_OFFSET_Y + a2.y;
              drawJaggedLightning(ctx, sx, sy, ex, ey, col, coreCol, 2.4, 0);
            } else {
              const start = ANCHORS[1 + Math.floor(Math.random() * (ANCHORS.length - 1))];
              const sx = CANVAS_OFFSET_X + start.x;
              const sy = CANVAS_OFFSET_Y + start.y;

              const arcLen = 6 + totalIntensity * 18;
              const branchChance = totalIntensity > 0.6 ? 0.38 : 0.0;

              let targetAng;
              if (dragFactor > 2) {
                targetAng = dragAngle + (Math.random() - 0.5) * 1.3;
              } else {
                targetAng = Math.random() * Math.PI * 2;
              }

              const ex = sx + Math.cos(targetAng) * arcLen + dragX * 0.4;
              const ey = sy + Math.sin(targetAng) * arcLen + dragY * 0.4;

              const pts = drawJaggedLightning(ctx, sx, sy, ex, ey, col, coreCol, 3.0, branchChance);

              // Spawn tiny sparks from lightning tip during high speeds
              if (totalIntensity > 0.35 && Math.random() < 0.35 && pts && pts.length > 0) {
                const tipPt = pts[pts.length - 1];
                const spkVx = dragX * 0.12 + (Math.random() - 0.5) * 1.2;
                const spkVy = dragY * 0.12 + (Math.random() - 0.5) * 1.2;
                spawnEmber(tipPt.x - CANVAS_OFFSET_X, tipPt.y - CANVAS_OFFSET_Y, spkVx, spkVy, true);
              }
            }
          }

          // ================================================================
          // D. RENDER FLOATING VOLCANIC EMBERS & ASH SPARKS
          // ================================================================
          for (let i = 0; i < s.embers.length; i++) {
            const em = s.embers[i];
            if (!em.active) continue;

            // Gentle sinusoidal thermal wobble
            em.x += em.vx + Math.sin(em.wobble + em.life * 0.22) * 0.45;
            em.y += em.vy;
            em.life++;

            if (em.life >= em.maxLife) {
              em.active = false;
              continue;
            }

            const progress = em.life / em.maxLife;
            const alpha = 1.0 - progress;

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = em.color;
            ctx.beginPath();
            if (em.isSpark) {
              // Sharp needle spark
              ctx.arc(em.x, em.y, em.size * 0.85, 0, Math.PI * 2);
            } else {
              // Floating organic ash spark
              ctx.arc(em.x, em.y, em.size * (1 - progress * 0.3), 0, Math.PI * 2);
            }
            ctx.fill();
            ctx.restore();
          }
        }
      }
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [enabled, reducedMotion]);

  if (!enabled) return null;

  return (
    <>
      {/* Root tracking container (Locks strictly to mouse coordinates with 0ms lag) */}
      <div
        ref={rootRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] opacity-0 transition-opacity duration-150 will-change-transform"
        style={{ width: '0px', height: '0px' }}
      >
        {/* ==================================================================
            1. CLICK CURSED NOVA FIRE SHOCKWAVE RING
            ================================================================== */}
        {!reducedMotion && (
          <div
            ref={shockwaveRef}
            className="absolute left-0 top-0 rounded-full border-2 border-[#FF3347] pointer-events-none opacity-0 will-change-transform"
            style={{
              width: '34px',
              height: '34px',
              boxShadow: '0 0 12px #FF3347, inset 0 0 8px #FF7A00, 0 0 4px #FFF4EC',
              transform: 'translate(-50%, -50%) scale(0.15)',
              transformOrigin: 'center center',
            }}
          />
        )}

        {/* ==================================================================
            2. ULTRA LIVING FLAME & LIGHTNING CANVAS
            Renders trailing fire puffs, volcanic embers, and crackling bolts.
            ================================================================== */}
        {!reducedMotion && (
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="absolute pointer-events-none"
            style={{
              left: `-${CANVAS_OFFSET_X}px`,
              top: `-${CANVAS_OFFSET_Y}px`,
              width: `${CANVAS_SIZE}px`,
              height: `${CANVAS_SIZE}px`,
            }}
          />
        )}

        {/* ==================================================================
            3. MASTER CURSOR WRAPPER
            Locked at (-HOTSPOT_X, -HOTSPOT_Y) for 100% clicking precision.
            Tip is razor-sharp, unobstructed, and 100% visible at all times.
            ================================================================== */}
        <div
          ref={wrapperRef}
          className="relative pointer-events-none select-none will-change-transform"
          style={{
            width: `${CURSOR_SIZE}px`,
            height: `${CURSOR_SIZE}px`,
            transform: `translate3d(-${HOTSPOT_X}px, -${HOTSPOT_Y}px, 0)`,
            transformOrigin: `${HOTSPOT_X}px ${HOTSPOT_Y}px`,
          }}
        >
          {/* --------------------------------------------------------------
              A. THERMAL FIRE MANTLE (Behind Cursor Artwork)
              Dynamic breathing heat layer matching Flame_Cursor.png
              -------------------------------------------------------------- */}
          {!reducedMotion && (
            <div
              ref={auraRef}
              className="absolute inset-0 pointer-events-none will-change-transform"
              style={{
                transformOrigin: `${HOTSPOT_X}px ${HOTSPOT_Y}px`,
              }}
            >
              <img
                src="/cursor/Flame_Cursor.png"
                alt=""
                width={CURSOR_SIZE}
                height={CURSOR_SIZE}
                draggable={false}
                className="absolute inset-0 block select-none pointer-events-none"
                style={{
                  width: `${CURSOR_SIZE}px`,
                  height: `${CURSOR_SIZE}px`,
                }}
              />
            </div>
          )}

          {/* --------------------------------------------------------------
              B. MASTER CURSOR ARTWORK (public/cursor/Flame_Cursor.png)
              Razor-sharp black core, ivory inner border, crimson outer fire.
              -------------------------------------------------------------- */}
          <img
            src="/cursor/Flame_Cursor.png"
            alt="ZENJI Flame Cursor"
            width={CURSOR_SIZE}
            height={CURSOR_SIZE}
            draggable={false}
            className="relative z-10 block select-none pointer-events-none drop-shadow-[0_2px_5px_rgba(0,0,0,0.85)]"
            style={{
              width: `${CURSOR_SIZE}px`,
              height: `${CURSOR_SIZE}px`,
            }}
          />
        </div>
      </div>
    </>
  );
}
