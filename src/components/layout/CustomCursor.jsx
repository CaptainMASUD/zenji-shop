import React, { useEffect, useRef, useState } from 'react';

// ============================================================================
// ZENJI ELECTRIFIED CURSED ENERGY CURSOR
// - Base: Uses public/cursor/Flame_Cursor.png from cursor folder
// - Exact Pointer Tip: Locked to arrow apex at (387, 305) in 1254x1254 space
//   with 0ms input lag and 100% clicking precision
// - Visible animated electricity: thin, unstable crimson/red lightning arcs,
//   branching bolts, sparks, and white-hot flashes
// - Zero soft CSS glow, zero neon halo, zero blurry auras
// - Idle: Calm resting state with only occasional subtle micro-flickers
// - Kinetic: Arc count, length, speed, and branching scale aggressively with velocity
// - Directional: Electricity drags slightly opposite to movement direction
// - Cooling: Calms back down to minimal idle flicker within ~0.5s of stopping
// ============================================================================

const CURSOR_SIZE = 52;
const HOTSPOT_X = CURSOR_SIZE * (387 / 1254); // ~16.05px (Arrow white apex)
const HOTSPOT_Y = CURSOR_SIZE * (305 / 1254); // ~12.65px

const CANVAS_SIZE = 160;
const CANVAS_OFFSET_X = 40;
const CANVAS_OFFSET_Y = 35;

// Perimeter anchor points on Flame_Cursor.png (relative to pointer tip at (0, 0))
const ANCHORS_1254 = [
  { x: 387, y: 305 },  // Tip (apex) -> (0, 0)
  { x: 340, y: 340 },  // Left upper edge
  { x: 303, y: 374 },  // Left wing outer corner
  { x: 410, y: 520 },  // Left inner slope
  { x: 480, y: 680 },  // Left notch
  { x: 600, y: 820 },  // Left tail shaft
  { x: 848, y: 1019 }, // Tail tip
  { x: 730, y: 640 },  // Right tail shaft
  { x: 680, y: 560 },  // Right notch
  { x: 909, y: 777 },  // Right wing tip
  { x: 650, y: 480 },  // Right upper ridge
];

const ANCHORS = ANCHORS_1254.map((p) => ({
  x: CURSOR_SIZE * (p.x / 1254) - HOTSPOT_X,
  y: CURSOR_SIZE * (p.y / 1254) - HOTSPOT_Y,
}));

const BOLT_COLORS = ['#FF3347', '#D72638', '#FF1A35', '#7A0C18'];
const WHITE_HOT_COLOR = '#FFF4EC';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // DOM node references for zero-rerender direct RAF updates
  const rootRef = useRef(null);
  const wrapperRef = useRef(null);
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

    // Cursed energy intensity: 0.0 (idle) -> 1.0 (max velocity cap)
    intensity: 0.0,
    isHovering: false,
    isMoving: false,
    lastMoveTime: 0,

    // Click discharge burst
    isClicking: false,
    clickBurst: 0,
    clickScale: 1.0,

    isVisible: false,

    // Micro sparks pool
    sparks: [],
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
    s.sparks = [];

    // Pre-allocated pool of 16 sparks (zero GC)
    for (let i = 0; i < 16; i++) {
      s.sparks.push({
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        life: 0,
        maxLife: 6,
        color: '#FF3347',
      });
    }

    const spawnSpark = (x, y, vx, vy, color = '#FF3347') => {
      if (reducedMotion) return;
      const sp = s.sparks.find((item) => !item.active);
      if (!sp) return;
      sp.active = true;
      sp.x = x;
      sp.y = y;
      sp.vx = vx;
      sp.vy = vy;
      sp.life = 0;
      sp.maxLife = 4 + Math.floor(Math.random() * 5);
      sp.color = color;
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
      s.clickScale = 0.92;
      s.clickBurst = 1.0;

      // Spawn radial spark burst on click
      for (let i = 0; i < 8; i++) {
        const ang = (Math.PI * 2 * i) / 8 + (Math.random() - 0.5) * 0.4;
        const spd = 2.2 + Math.random() * 2.0;
        const col = i % 2 === 0 ? WHITE_HOT_COLOR : '#FF3347';
        spawnSpark(
          CANVAS_OFFSET_X,
          CANVAS_OFFSET_Y,
          Math.cos(ang) * spd,
          Math.sin(ang) * spd,
          col
        );
      }
    };

    const onMouseUp = () => {
      s.isClicking = false;
      s.clickScale = 1.0;
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

    // High-performance recursive midpoint displacement jagged lightning renderer
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

          // Branching bolt
          if (branchChance > 0 && Math.random() < branchChance && it === 1) {
            const segLen = Math.hypot(pB.x - pA.x, pB.y - pA.y) * 0.6;
            const baseAngle = Math.atan2(pB.y - pA.y, pB.x - pA.x);
            const branchAngle = baseAngle + (Math.random() > 0.5 ? 0.75 : -0.75);
            const bx = mx + Math.cos(branchAngle) * segLen;
            const by = my + Math.sin(branchAngle) * segLen;
            drawJaggedLightning(ctx, mx, my, bx, by, color, null, disp * 0.7, 0);
          }
        }
        pts = nextPts;
      }

      // 1. Draw outer colored lightning stroke
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

      // 2. Draw sharp white-hot inner core stroke if specified
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

      // 1. Track instant mouse position (Zero lag: cursor position locks immediately)
      const dx = s.targetX - s.currentX;
      const dy = s.targetY - s.currentY;
      s.currentX = s.targetX;
      s.currentY = s.targetY;

      // 2. Compute velocity
      s.vx = dx / (dt || 0.016);
      s.vy = dy / (dt || 0.016);
      s.speed = Math.hypot(s.vx, s.vy);

      const timeSinceMove = now - s.lastMoveTime;
      if (timeSinceMove > 50) {
        s.isMoving = false;
      }

      // 3. Cursed energy velocity engine
      // Idle: 0.0 (or 0.22 if hovering interactive element) | Max velocity cap: 1.0
      const baseIntensity = s.isHovering ? 0.22 : 0.0;
      const normalizedSpeed = Math.min(1.0, s.speed / 1100);
      const targetIntensity = baseIntensity + normalizedSpeed * (1.0 - baseIntensity);

      if (targetIntensity > s.intensity) {
        // Snappy rise as movement accelerates
        s.intensity += (targetIntensity - s.intensity) * Math.min(1.0, dt * 14);
      } else {
        // Smooth ~0.5s cooling decay back to idle when mouse slows/stops
        s.intensity += (targetIntensity - s.intensity) * Math.min(1.0, (dt / 0.50) * 2.2);
      }
      s.intensity = Math.max(0.0, Math.min(1.0, s.intensity));

      // Click burst decay (~160ms)
      if (s.clickBurst > 0) {
        s.clickBurst = Math.max(0, s.clickBurst - dt / 0.16);
      }

      // 4. Update Root Cursor Position (Locked to mouse coordinates with 0 lag)
      if (rootRef.current) {
        rootRef.current.style.transform = `translate3d(${s.currentX}px, ${s.currentY}px, 0)`;
      }

      // 5. Subtle micro-aerodynamic tilt on wrapper (pivot strictly at pointer tip)
      if (wrapperRef.current) {
        const tilt = reducedMotion ? 0 : Math.max(-1.5, Math.min(1.5, s.vx * 0.0014));
        wrapperRef.current.style.transform = `translate3d(-${HOTSPOT_X}px, -${HOTSPOT_Y}px, 0) rotate(${tilt}deg) scale(${s.clickScale})`;
      }

      // 6. Canvas Electrified Cursed Energy Generator
      if (canvasRef.current && !reducedMotion) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

          const totalIntensity = Math.min(1.0, s.intensity + s.clickBurst * 0.85);

          // Drag vector: stretches electric arcs slightly opposite movement direction
          const dragFactor = Math.min(15, s.speed * 0.018);
          const moveAngle = Math.atan2(s.vy, s.vx);
          const dragAngle = moveAngle + Math.PI; // opposite direction
          const dragX = Math.cos(dragAngle) * dragFactor;
          const dragY = Math.sin(dragAngle) * dragFactor;

          // Determine number of electric arcs
          let numArcs = 0;
          if (totalIntensity < 0.08) {
            // Idle: calm resting state, only occasional subtle single micro-flicker
            numArcs = Math.random() < 0.22 ? 1 : 0;
          } else {
            // Moving: scales progressively from 1 up to 6-7 arcs at max speed
            numArcs = Math.floor(1 + totalIntensity * 5.5);
            if (s.clickBurst > 0.2) numArcs += 3;
          }

          for (let i = 0; i < numArcs; i++) {
            // Colors: crimson, deep red, hot red, with occasional ivory white-hot core
            const col = BOLT_COLORS[Math.floor(Math.random() * BOLT_COLORS.length)];
            const isWhiteHot =
              (totalIntensity > 0.55 && Math.random() < 0.40) ||
              (s.clickBurst > 0.1 && Math.random() < 0.60);
            const coreCol = isWhiteHot ? WHITE_HOT_COLOR : null;

            // 40% Contour arc (snapping along edge) vs 60% Discharge arc (trailing backward)
            const isContour = Math.random() < 0.40 && totalIntensity > 0.05;

            if (isContour) {
              const idx = 1 + Math.floor(Math.random() * (ANCHORS.length - 1));
              const a1 = ANCHORS[idx];
              const a2 = ANCHORS[1 + ((idx - 1 + (Math.random() > 0.5 ? 1 : -1) + (ANCHORS.length - 1)) % (ANCHORS.length - 1))];
              const sx = CANVAS_OFFSET_X + a1.x;
              const sy = CANVAS_OFFSET_Y + a1.y;
              const ex = CANVAS_OFFSET_X + a2.x;
              const ey = CANVAS_OFFSET_Y + a2.y;
              drawJaggedLightning(ctx, sx, sy, ex, ey, col, coreCol, 2.4, 0);
            } else {
              // Discharge arc originating from cursor silhouette
              const start = ANCHORS[1 + Math.floor(Math.random() * (ANCHORS.length - 1))];
              const sx = CANVAS_OFFSET_X + start.x;
              const sy = CANVAS_OFFSET_Y + start.y;

              // Arc length scales with speed (short 6px at idle up to ~22px at max speed)
              const arcLen = 6 + totalIntensity * 16;
              const branchChance = totalIntensity > 0.6 ? 0.35 : 0.0;

              let targetAng;
              if (dragFactor > 2) {
                // Bias heavily opposite to movement direction
                targetAng = dragAngle + (Math.random() - 0.5) * 1.3;
              } else {
                // Organic outward arc
                targetAng = Math.random() * Math.PI * 2;
              }

              const ex = sx + Math.cos(targetAng) * arcLen + dragX * 0.4;
              const ey = sy + Math.sin(targetAng) * arcLen + dragY * 0.4;

              const pts = drawJaggedLightning(ctx, sx, sy, ex, ey, col, coreCol, 3.0, branchChance);

              // Spawn tiny sparks from lightning tip during high speed
              if (totalIntensity > 0.35 && Math.random() < 0.35 && pts && pts.length > 0) {
                const tipPt = pts[pts.length - 1];
                const spkVx = dragX * 0.12 + (Math.random() - 0.5) * 1.2;
                const spkVy = dragY * 0.12 + (Math.random() - 0.5) * 1.2;
                spawnSpark(tipPt.x, tipPt.y, spkVx, spkVy, isWhiteHot ? WHITE_HOT_COLOR : col);
              }
            }
          }

          // 7. Render Active Sparks (Tiny, fast-moving, short-lived particles)
          for (let i = 0; i < s.sparks.length; i++) {
            const sp = s.sparks[i];
            if (!sp.active) continue;

            sp.x += sp.vx;
            sp.y += sp.vy;
            sp.life++;

            if (sp.life >= sp.maxLife) {
              sp.active = false;
              continue;
            }

            const alpha = 1.0 - sp.life / sp.maxLife;
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = sp.color;
            ctx.beginPath();
            ctx.arc(sp.x, sp.y, 0.9, 0, Math.PI * 2);
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
      {/* Root tracking container (Locks directly to pointer coordinate with 0 lag) */}
      <div
        ref={rootRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] opacity-0 transition-opacity duration-150 will-change-transform"
        style={{ width: '0px', height: '0px' }}
      >
        {/* ==================================================================
            1. ELECTRIFIED CURSED ENERGY CANVAS
            Renders thin, unstable, branching crimson lightning arcs & sparks.
            Tip is aligned cleanly at (CANVAS_OFFSET_X, CANVAS_OFFSET_Y).
            Zero blurred CSS glow, zero neon halo.
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
            2. MASTER CURSOR ARTWORK WRAPPER
            Locked at (-HOTSPOT_X, -HOTSPOT_Y) for 100% pointer precision.
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
          <img
            src="/cursor/Flame_Cursor.png"
            alt="ZENJI Cursor"
            width={CURSOR_SIZE}
            height={CURSOR_SIZE}
            draggable={false}
            className="relative z-10 block select-none pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]"
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
