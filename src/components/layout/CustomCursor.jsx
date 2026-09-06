import React, { useEffect, useRef, useState } from 'react';

// ============================================================================
// ZENJI x SOLO LEVELING: REFINED ANIME FX ENGINE
// - Removed blinking/flashing outer aura layers behind the cursor
// - Removed blinking outline streaks in front of the cursor
// - Redesigned bottom dagger animation with smooth molten flame flow & rising embers
// - 100% stable, locked hotspot at (6.60px, 2.42px)
// ============================================================================

const CURSOR_SIZE = 46; // Compact agile size
const CANVAS_SIZE = 140;
const CANVAS_OFFSET = (CANVAS_SIZE - CURSOR_SIZE) / 2;

// Exact pointer tip hotspot (Source: 1254x1254 -> tip at x: 109, y: 40)
const HOTSPOT_X = CURSOR_SIZE * (109 / 1254); // ~4.00px
const HOTSPOT_Y = CURSOR_SIZE * (40 / 1254);  // ~1.47px

// Anatomical coordinates (rel to 46px box)
const EYE_X = CURSOR_SIZE * (425.3 / 1254); // ~15.60px (Sung Jin-woo's eyes)
const EYE_Y = CURSOR_SIZE * (549.0 / 1254); // ~20.14px
const ORANGE_X = CURSOR_SIZE * (849 / 1254); // ~31.14px (Fire dagger)
const ORANGE_Y = CURSOR_SIZE * (850 / 1254);
const BLUE_X = CURSOR_SIZE * (280 / 1254);   // ~10.27px (Electric sword)
const BLUE_Y = CURSOR_SIZE * (320 / 1254);

// Solid palette (STRICTLY NO GRADIENTS)
const BLUE_PALETTE = ['#0055D4', '#009DFF', '#00D8FF', '#38E5FF', '#7DF3FF', '#FFFFFF'];
const ORANGE_PALETTE = ['#FF2200', '#FF4D00', '#FF7A00', '#FFAE00', '#FFD85E', '#FFFFFF'];

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // DOM node references for zero-rerender direct RAF updates
  const rootRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const eyeStreakRef = useRef(null);
  const shockwaveRef = useRef(null);
  const slashCrossRef = useRef(null);
  const canvasRef = useRef(null);
  const trailRef1 = useRef(null);
  const trailRef2 = useRef(null);

  // High-frequency mutable state
  const stateRef = useRef({
    targetX: -500,
    targetY: -500,
    currentX: -500,
    currentY: -500,
    vx: 0,
    vy: 0,
    speed: 0,
    powerLevel: 0.25,
    targetPower: 0.25,
    isIdle: false,
    lastMoveTime: Date.now(),
    isClicking: false,
    clickScale: 1,
    history: [
      { x: -500, y: -500 },
      { x: -500, y: -500 },
      { x: -500, y: -500 },
      { x: -500, y: -500 },
    ],
    particles: [],
    shockwaveActive: false,
    shockwaveProgress: 0,
    isVisible: false,
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

    // Fixed particle pool for zero garbage collection
    s.particles = [];
    const maxParticles = 14;
    for (let i = 0; i < maxParticles; i++) {
      s.particles.push({
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 2,
        color: '#00D8FF',
        alpha: 1,
        life: 0,
        maxLife: 28,
        type: 'blue',
        rotation: 0,
        spin: 0,
      });
    }

    const spawnParticle = (type, originX, originY, spreadX = 6, spreadY = 6, extraVx = 0, extraVy = 0) => {
      if (reducedMotion) return;
      const p = s.particles.find((item) => !item.active);
      if (!p) return;

      p.active = true;
      p.x = CANVAS_OFFSET + originX + (Math.random() - 0.5) * spreadX;
      p.y = CANVAS_OFFSET + originY + (Math.random() - 0.5) * spreadY;
      p.life = 0;
      p.maxLife = 22 + Math.random() * 24;
      p.type = type;
      p.rotation = Math.random() * Math.PI * 2;
      p.spin = (Math.random() - 0.5) * 0.12;

      // Natural rising buoyancy + subtle inertia opposite mouse velocity
      const angle = (Math.random() - 0.5) * 1.4;
      const baseSpeed = 0.4 + Math.random() * 0.9;
      p.vx = Math.sin(angle) * baseSpeed - s.vx * 0.05 + extraVx;
      p.vy = -Math.cos(angle) * baseSpeed - 0.4 - s.vy * 0.05 + extraVy;

      if (type === 'orange') {
        p.color = ORANGE_PALETTE[Math.floor(Math.random() * ORANGE_PALETTE.length)];
        p.size = 1.3 + Math.random() * 1.6;
      } else if (type === 'spark') {
        p.color = Math.random() > 0.3 ? '#FFD85E' : '#FFFFFF';
        p.size = 1.0 + Math.random() * 1.4;
        p.maxLife = 14 + Math.random() * 12;
      } else {
        p.color = BLUE_PALETTE[Math.floor(Math.random() * BLUE_PALETTE.length)];
        p.size = 1.4 + Math.random() * 1.8;
      }
    };

    const onMouseMove = (e) => {
      s.targetX = e.clientX;
      s.targetY = e.clientY;
      s.lastMoveTime = Date.now();
      s.isIdle = false;

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
      s.targetPower = 0.85;
      s.clickScale = 0.90;
      s.shockwaveActive = true;
      s.shockwaveProgress = 0;

      for (let i = 0; i < 7; i++) {
        const ang = (Math.PI * 2 * i) / 7 + (Math.random() - 0.5) * 0.4;
        const spd = 2.0 + Math.random() * 2.4;
        spawnParticle(
          i % 2 === 0 ? 'spark' : 'orange',
          HOTSPOT_X,
          HOTSPOT_Y,
          4,
          4,
          Math.cos(ang) * spd,
          Math.sin(ang) * spd
        );
      }
    };

    const onMouseUp = () => {
      s.isClicking = false;
      s.clickScale = 1.04;
      setTimeout(() => {
        if (!s.isClicking) s.clickScale = 1;
      }, 120);
    };

    const onMouseOver = (e) => {
      const target = e.target;
      if (!target) return;
      const interactive = target.closest(
        'button, a, input, select, textarea, [role="button"], .cursor-pointer, .image-zoom'
      );
      if (interactive) {
        const isCta = interactive.matches('.display-tight, [type="submit"], .bg-crimson, .bg-ivory') || interactive.closest('.group');
        s.targetPower = isCta ? 0.60 : 0.45;
      } else {
        s.targetPower = 0.25;
      }
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

    let animationFrameId;
    let lastTime = performance.now();
    let frame = 0;

    const tick = (now) => {
      animationFrameId = requestAnimationFrame(tick);
      frame++;

      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (!s.isVisible) return;

      const dx = s.targetX - s.currentX;
      const dy = s.targetY - s.currentY;
      s.currentX = s.targetX;
      s.currentY = s.targetY;

      s.vx = dx / (dt || 0.016);
      s.vy = dy / (dt || 0.016);
      s.speed = Math.hypot(s.vx, s.vy);

      if (now - s.lastMoveTime > 600) {
        s.isIdle = true;
      }

      s.powerLevel += (s.targetPower - s.powerLevel) * 0.14;

      if (frame % 2 === 0) {
        s.history.pop();
        s.history.unshift({ x: s.currentX, y: s.currentY });
      }

      // 1. Fixed positioning at mouse coordinate
      if (rootRef.current) {
        rootRef.current.style.transform = `translate3d(${s.currentX}px, ${s.currentY}px, 0)`;
      }

      // 2. Micro-aerodynamic tilt & click compression (pivot at hotspot tip)
      if (imageWrapperRef.current) {
        const tilt = reducedMotion ? 0 : Math.max(-1.2, Math.min(1.2, s.vx * 0.0014));
        imageWrapperRef.current.style.transform = `translate3d(-${HOTSPOT_X}px, -${HOTSPOT_Y}px, 0) rotate(${tilt}deg) scale(${s.clickScale})`;
      }

      // 3. Sung Jin-woo Electric Eye Trail Streak
      if (eyeStreakRef.current && !reducedMotion) {
        const streakLen = Math.min(12, s.speed * 0.012);
        const streakX = -Math.max(-8, Math.min(8, s.vx * 0.01));
        const streakY = -Math.max(-6, Math.min(6, s.vy * 0.01));
        const streakOpacity = Math.min(0.75, (s.speed / 450) * 0.7);

        eyeStreakRef.current.style.transform = `translate3d(${streakX}px, ${streakY}px, 0) scaleX(${1 + streakLen * 0.15})`;
        eyeStreakRef.current.style.opacity = streakOpacity.toFixed(2);
      }

      // 4. Procedural Canvas Particles (Smooth floating blue & orange embers)
      if (canvasRef.current && !reducedMotion) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
          ctx.globalCompositeOperation = 'lighter';

          const spawnRate = s.isIdle ? 0.06 : 0.20 + (s.speed / 1500) * 0.4 + s.powerLevel * 0.3;
          if (Math.random() < spawnRate) {
            spawnParticle('blue', BLUE_X, BLUE_Y, 10, 12);
          }
          if (Math.random() < spawnRate * 0.9) {
            // Embers floating off the redesigned bottom dagger
            spawnParticle('orange', ORANGE_X, ORANGE_Y, 8, 10);
          }
          if (s.powerLevel > 0.4 && Math.random() < 0.2) {
            spawnParticle('spark', ORANGE_X + 4, ORANGE_Y + 4, 4, 4);
          }

          for (let i = 0; i < s.particles.length; i++) {
            const p = s.particles[i];
            if (!p.active) continue;

            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.spin;
            p.life++;

            const progress = p.life / p.maxLife;
            if (progress >= 1) {
              p.active = false;
              continue;
            }

            const alpha = (1 - progress) * (p.type === 'spark' ? 0.9 : 0.75);
            const curSize = Math.max(0.6, p.size * (1 - progress * 0.35));

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = p.type === 'spark' ? 4 : 2;

            ctx.beginPath();
            if (p.type === 'blue') {
              ctx.moveTo(0, -curSize * 1.5);
              ctx.lineTo(curSize * 0.6, 0);
              ctx.lineTo(0, curSize * 1.5);
              ctx.lineTo(-curSize * 0.6, 0);
            } else {
              ctx.arc(0, 0, curSize, 0, Math.PI * 2);
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          }

          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        }
      }

      // 5. Smooth Shadow Afterimages (Zero jitter, only on fast dash)
      if (!reducedMotion) {
        const trailNodes = [trailRef1.current, trailRef2.current];
        const trailIndices = [1, 3];
        const baseOpacities = [0.22, 0.10];
        const trailFactor = Math.min(1, Math.max(0, (s.speed - 220) / 450));

        trailNodes.forEach((node, idx) => {
          if (!node) return;
          const posIdx = trailIndices[idx];
          const hist = s.history[posIdx] || s.history[s.history.length - 1];

          if (trailFactor > 0.08 && hist) {
            const relX = hist.x - s.currentX;
            const relY = hist.y - s.currentY;
            const op = baseOpacities[idx] * trailFactor;
            node.style.opacity = op.toFixed(3);
            node.style.transform = `translate3d(${relX - HOTSPOT_X}px, ${relY - HOTSPOT_Y}px, 0) scale(${0.96 - idx * 0.04})`;
          } else {
            node.style.opacity = '0';
          }
        });
      }

      // 6. Click Shockwave
      if (s.shockwaveActive) {
        s.shockwaveProgress += dt / 0.32;
        if (s.shockwaveProgress >= 1) {
          s.shockwaveActive = false;
          if (shockwaveRef.current) shockwaveRef.current.style.opacity = '0';
          if (slashCrossRef.current) slashCrossRef.current.style.opacity = '0';
        } else {
          const swScale = 0.2 + s.shockwaveProgress * 2.0;
          const swOpacity = (1 - s.shockwaveProgress) * 0.85;
          if (shockwaveRef.current) {
            shockwaveRef.current.style.transform = `translate(-50%, -50%) scale(${swScale})`;
            shockwaveRef.current.style.opacity = swOpacity.toFixed(3);
          }
          if (slashCrossRef.current) {
            slashCrossRef.current.style.transform = `translate(-50%, -50%) scale(${1 + s.shockwaveProgress * 1.4}) rotate(45deg)`;
            slashCrossRef.current.style.opacity = ((1 - s.shockwaveProgress) * 0.75).toFixed(3);
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
      <style>{`
        /* Smooth, Continuous Blue Flames (Zero Blinking) */
        @keyframes smoothBlueSpireTop {
          0% { transform: translate(0px, 0px) scale(0.96); opacity: 0.75; }
          50% { transform: translate(1px, -2px) scale(1.12); opacity: 0.92; }
          100% { transform: translate(0px, 0px) scale(0.96); opacity: 0.75; }
        }

        @keyframes smoothBlueSpireWing {
          0% { transform: translate(0px, 0px) scaleY(1.10); opacity: 0.80; }
          50% { transform: translate(-1px, -3px) scaleY(0.92); opacity: 0.65; }
          100% { transform: translate(0px, 0px) scaleY(1.10); opacity: 0.80; }
        }

        /* Redesigned Bottom Dagger Molten Heat Flow (Fluid, Warm, Continuous) */
        @keyframes moltenDaggerBreath {
          0% { transform: scale(0.96) translate(0px, 0px); opacity: 0.60; }
          50% { transform: scale(1.08) translate(1px, -1px); opacity: 0.85; }
          100% { transform: scale(0.96) translate(0px, 0px); opacity: 0.60; }
        }

        @keyframes moltenBladeTongueA {
          0% { transform: translate(0px, 0px) scaleY(0.95); opacity: 0.70; }
          50% { transform: translate(1.5px, -2.5px) scaleY(1.14); opacity: 0.95; }
          100% { transform: translate(0px, 0px) scaleY(0.95); opacity: 0.70; }
        }

        @keyframes moltenBladeTongueB {
          0% { transform: translate(0px, 0px) scale(1.06); opacity: 0.85; }
          50% { transform: translate(-1px, -2px) scale(0.92); opacity: 0.60; }
          100% { transform: translate(0px, 0px) scale(1.06); opacity: 0.85; }
        }

        /* Sung Jin-woo Piercing Eye Glow (Smooth, Non-blinking) */
        @keyframes smoothEyeGlow {
          0% { transform: scale(0.90); opacity: 0.60; }
          50% { transform: scale(1.20); opacity: 0.95; }
          100% { transform: scale(0.90); opacity: 0.60; }
        }
      `}</style>

      {/* Root tracking container */}
      <div
        ref={rootRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] opacity-0 transition-opacity duration-150 will-change-transform"
        style={{ width: '0px', height: '0px' }}
      >
        {/* ==================================================================
            AFTERIMAGE TRAILS (Only 2 ghost copies during high-speed movement)
            ================================================================== */}
        {!reducedMotion && (
          <>
            <div
              ref={trailRef2}
              className="absolute left-0 top-0 opacity-0 pointer-events-none will-change-transform"
              style={{
                width: `${CURSOR_SIZE}px`,
                height: `${CURSOR_SIZE}px`,
                filter: 'blur(2px) brightness(0.35) contrast(1.3)',
              }}
            >
              <img
                src="/cursor/sololeveling.png"
                alt=""
                width={CURSOR_SIZE}
                height={CURSOR_SIZE}
                className="select-none pointer-events-none"
              />
            </div>
            <div
              ref={trailRef1}
              className="absolute left-0 top-0 opacity-0 pointer-events-none will-change-transform"
              style={{
                width: `${CURSOR_SIZE}px`,
                height: `${CURSOR_SIZE}px`,
                filter: 'blur(1px) drop-shadow(0 0 4px #0055D4) brightness(0.45)',
              }}
            >
              <img
                src="/cursor/sololeveling.png"
                alt=""
                width={CURSOR_SIZE}
                height={CURSOR_SIZE}
                className="select-none pointer-events-none"
              />
            </div>
          </>
        )}

        {/* ==================================================================
            CLICK MANA BURST & ANIME SLASH CROSS
            ================================================================== */}
        {!reducedMotion && (
          <>
            <div
              ref={shockwaveRef}
              className="absolute left-0 top-0 rounded-full border border-[#00D8FF] pointer-events-none opacity-0"
              style={{
                width: '34px',
                height: '34px',
                boxShadow: '0 0 6px #00D8FF, inset 0 0 5px #FF7A00',
                transform: 'translate(-50%, -50%) scale(0.2)',
                transformOrigin: 'center center',
              }}
            />
            <div
              ref={slashCrossRef}
              className="absolute left-0 top-0 pointer-events-none opacity-0"
              style={{
                width: '28px',
                height: '28px',
                transform: 'translate(-50%, -50%) rotate(45deg)',
                transformOrigin: 'center center',
              }}
            >
              <div className="absolute top-1/2 left-0 w-full h-[1.2px] -translate-y-1/2 bg-[#FFFFFF] shadow-[0_0_5px_#00D8FF]" />
              <div className="absolute left-1/2 top-0 h-full w-[1.2px] -translate-x-1/2 bg-[#FFD85E] shadow-[0_0_5px_#FF4D00]" />
            </div>
          </>
        )}

        {/* ==================================================================
            PROCEDURAL CANVAS PARTICLES (Floating shards & warm embers)
            ================================================================== */}
        {!reducedMotion && (
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="absolute pointer-events-none"
            style={{
              left: `-${CANVAS_OFFSET + HOTSPOT_X}px`,
              top: `-${CANVAS_OFFSET + HOTSPOT_Y}px`,
              width: `${CANVAS_SIZE}px`,
              height: `${CANVAS_SIZE}px`,
            }}
          />
        )}

        {/* ==================================================================
            MAIN ARTWORK & KINETIC FX WRAPPER
            Locked at (HOTSPOT_X, HOTSPOT_Y)
            ================================================================== */}
        <div
          ref={imageWrapperRef}
          className="relative pointer-events-none select-none will-change-transform"
          style={{
            width: `${CURSOR_SIZE}px`,
            height: `${CURSOR_SIZE}px`,
            transform: `translate3d(-${HOTSPOT_X}px, -${HOTSPOT_Y}px, 0)`,
            transformOrigin: `${HOTSPOT_X}px ${HOTSPOT_Y}px`,
          }}
        >
          {/* --------------------------------------------------------------
              1. BLUE FLAME AURA (Upper Ridge & Left Wing — Smooth, Non-Blinking)
              -------------------------------------------------------------- */}
          {!reducedMotion && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Upper Ridge Flame Crest */}
              <svg
                className="absolute pointer-events-none"
                style={{
                  left: '1.8px',
                  top: '-0.6px',
                  width: '27px',
                  height: '22px',
                  animation: 'smoothBlueSpireTop 1.4s ease-in-out infinite',
                }}
                viewBox="0 0 44 36"
                fill="none"
              >
                <path
                  d="M 4 4 Q 14 12 22 8 Q 28 16 38 14 Q 42 22 40 28 Q 30 24 20 18 Q 14 12 4 4 Z"
                  fill="#0055D4"
                  opacity="0.60"
                  style={{ filter: 'blur(2px) drop-shadow(0 0 4px #009DFF)' }}
                />
                <path
                  d="M 6 5 Q 16 11 22 9 Q 28 15 34 14 Q 36 20 32 24 Q 22 18 6 5 Z"
                  fill="#00D8FF"
                  opacity="0.85"
                  style={{ filter: 'blur(1px)' }}
                />
                <path
                  d="M 5 4 L 14 10 L 22 8 L 30 14"
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  opacity="0.95"
                  style={{ filter: 'blur(0.4px)' }}
                />
              </svg>

              {/* Left Wing Flame Blade */}
              <svg
                className="absolute pointer-events-none"
                style={{
                  left: '4.8px',
                  top: '9.7px',
                  width: '18px',
                  height: '24px',
                  animation: 'smoothBlueSpireWing 1.6s ease-in-out infinite 0.2s',
                }}
                viewBox="0 0 30 40"
                fill="none"
              >
                <path
                  d="M 8 2 Q 4 14 8 24 Q 12 34 10 38 Q 18 28 20 18 Q 18 10 8 2 Z"
                  fill="#009DFF"
                  opacity="0.70"
                  style={{ filter: 'blur(1.6px) drop-shadow(0 0 4px #00D8FF)' }}
                />
                <path
                  d="M 9 4 Q 7 14 10 22 Q 13 28 12 34 Q 16 24 17 18 Q 15 10 9 4 Z"
                  fill="#38E5FF"
                  opacity="0.85"
                  style={{ filter: 'blur(0.8px)' }}
                />
              </svg>
            </div>
          )}

          {/* --------------------------------------------------------------
              2. REDESIGNED BOTTOM ANIMATIONS (Orange Fire Dagger)
              - Form-fitting molten blade aura
              - Smooth, continuous thermal flow
              - Glowing forged gold spine
              - ZERO jitter, ZERO abrupt blinking
              -------------------------------------------------------------- */}
          {!reducedMotion && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Layer A: Ambient Molten Heat Sheath around dagger */}
              <div
                className="absolute pointer-events-none"
                style={{
                  left: '20.6px',
                  top: '19.4px',
                  width: '25px',
                  height: '27px',
                  animation: 'moltenDaggerBreath 1.8s ease-in-out infinite',
                }}
              >
                {/* Deep crimson radiant underglow */}
                <div
                  className="absolute inset-0 rounded-[35%_65%_70%_30%/50%_30%_70%_50%] bg-[#FF2200] opacity-55"
                  style={{ filter: 'blur(2.5px) drop-shadow(0 0 5px #FF4D00)' }}
                />
                {/* Mid thermal amber warmth */}
                <div
                  className="absolute inset-[2px] rounded-[40%_60%_60%_40%/60%_40%_60%_40%] bg-[#FF7A00] opacity-75"
                  style={{ filter: 'blur(1.4px)' }}
                />
              </div>

              {/* Layer B: Fluid Molten Flame Stream A (Blade Upper Edge) */}
              <svg
                className="absolute pointer-events-none"
                style={{
                  left: '22.4px',
                  top: '21.8px',
                  width: '22px',
                  height: '23px',
                  animation: 'moltenBladeTongueA 1.35s ease-in-out infinite',
                }}
                viewBox="0 0 36 38"
                fill="none"
              >
                {/* Molten flame body hugging blade */}
                <path
                  d="M 4 4 Q 12 14 20 14 Q 26 24 30 34 Q 24 28 18 20 Q 12 14 4 4 Z"
                  fill="#FF4D00"
                  opacity="0.80"
                  style={{ filter: 'blur(1.4px)' }}
                />
                {/* Incandescent gold core */}
                <path
                  d="M 5 6 Q 12 14 18 15 Q 23 23 27 30 Q 21 24 16 18 Q 11 12 5 6 Z"
                  fill="#FFAE00"
                  opacity="0.90"
                  style={{ filter: 'blur(0.8px)' }}
                />
                {/* White-hot razor spine */}
                <path
                  d="M 6 8 L 13 16 L 19 18 L 26 28"
                  stroke="#FFD85E"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  opacity="0.95"
                  style={{ filter: 'blur(0.4px)' }}
                />
              </svg>

              {/* Layer C: Fluid Molten Flame Stream B (Dagger Tip & Lower Spine) */}
              <svg
                className="absolute pointer-events-none"
                style={{
                  left: '27.8px',
                  top: '27.8px',
                  width: '16px',
                  height: '17px',
                  animation: 'moltenBladeTongueB 1.55s ease-in-out infinite 0.25s',
                }}
                viewBox="0 0 26 28"
                fill="none"
              >
                <path
                  d="M 4 4 Q 10 12 16 14 Q 20 22 22 26 Q 16 20 12 14 Q 8 10 4 4 Z"
                  fill="#FFAE00"
                  opacity="0.85"
                  style={{ filter: 'blur(1.0px)' }}
                />
                <path
                  d="M 5 6 L 12 14 L 18 22"
                  stroke="#FFFFFF"
                  strokeWidth="1.0"
                  strokeLinecap="round"
                  opacity="0.90"
                  style={{ filter: 'blur(0.4px)' }}
                />
              </svg>
            </div>
          )}

          {/* --------------------------------------------------------------
              3. BASE CURSOR IMAGE (CRISP, UNTOUCHED, ROCK-SOLID)
              Clean drop shadow for perfect contrast, ZERO blinking artifacts
              -------------------------------------------------------------- */}
          <img
            src="/cursor/sololeveling.png"
            alt="ZENJI Solo Leveling Cursor"
            width={CURSOR_SIZE}
            height={CURSOR_SIZE}
            draggable={false}
            className="relative z-10 block select-none pointer-events-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
            style={{
              width: `${CURSOR_SIZE}px`,
              height: `${CURSOR_SIZE}px`,
            }}
          />

          {/* --------------------------------------------------------------
              4. SUNG JIN-WOO'S PIERCING EYE GLOW (Smooth, Focused, Non-blinking)
              -------------------------------------------------------------- */}
          <div
            className="absolute z-20 pointer-events-none"
            style={{
              left: `${EYE_X - 2}px`,
              top: `${EYE_Y - 1.5}px`,
              width: '5px',
              height: '3.2px',
            }}
          >
            {!reducedMotion && (
              <div
                ref={eyeStreakRef}
                className="absolute -top-[0.5px] -left-[3px] h-[2px] w-[9px] rounded-full bg-[#00D8FF] opacity-0 pointer-events-none"
                style={{
                  filter: 'blur(0.8px) drop-shadow(0 0 3px #00F0FF)',
                  transformOrigin: 'right center',
                }}
              />
            )}

            <div
              className="relative h-full w-full"
              style={{
                animation: reducedMotion ? 'none' : 'smoothEyeGlow 2.2s ease-in-out infinite',
              }}
            >
              <div
                className="absolute inset-[-1px] rounded-full bg-[#009DFF] opacity-80"
                style={{ filter: 'blur(1.4px) drop-shadow(0 0 4px #00D8FF)' }}
              />
              <div
                className="absolute inset-[0.5px] rounded-full bg-[#38E5FF] opacity-95"
                style={{ filter: 'blur(0.5px)' }}
              />
              <div className="absolute left-[2px] top-[1px] h-[2px] w-[2px] rounded-full bg-[#FFFFFF]" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
