import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Copy01Icon,
  Tick01Icon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons';

/**
 * Procedural cyber-audio chirp for the interactive cipher keycard
 */
function playHudBeep() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(960, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1920, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch {
    // Silent fail if AudioContext is blocked by browser autoplay policies
  }
}

export default function AnnouncementBar() {
  // Live Tokyo Shibuya Time (JST)
  const [tokyoTime, setTokyoTime] = useState(() => {
    try {
      return new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Tokyo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(new Date());
    } catch {
      return '15:24:00';
    }
  });

  // Interactive coupon code state
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      try {
        setTokyoTime(
          new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Tokyo',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          }).format(new Date())
        );
      } catch {
        // Fallback
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopyCipher = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const code = 'ZENJI10';

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(code).catch(() => {
        fallbackCopy(code);
      });
    } else {
      fallbackCopy(code);
    }

    playHudBeep();
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const fallbackCopy = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch {
      // ignore
    }
    document.body.removeChild(textArea);
  };

  // Reusable Telemetry Segment Cluster (Akira / Persona 5 Anime Streetwear Aesthetic)
  const renderTelemetryCluster = (isDuplicate = false) => (
    <div
      className="flex items-center gap-7 sm:gap-9 px-6"
      aria-hidden={isDuplicate ? 'true' : undefined}
    >
      {/* 1. LIVE SYSTEM BEACON & TOKYO JST CLOCK */}
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-80" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
        </span>
        <span className="bg-black px-2 py-0.5 font-mono text-[9px] font-extrabold tracking-widest text-white border border-black/40">
          東京 JST {tokyoTime}
        </span>
        <span className="font-extrabold tracking-wider text-white">
          SHIBUYA SYNDICATE ARCHIVE
        </span>
      </div>

      <span className="text-black/40 text-xs select-none">•</span>

      {/* 2. DROP 02: AWAKENING // VAULT INVENTORY TRACKER */}
      <Link
        to="/drops"
        tabIndex={isDuplicate ? -1 : 0}
        className="group/drop flex items-center gap-2.5 transition-transform hover:scale-[1.02]"
      >
        <span className="bg-black px-2 py-0.5 font-mono text-[9px] font-extrabold tracking-widest text-white border border-black/40">
          覚醒 • DROP 02
        </span>
        <span className="font-extrabold text-white">AWAKENING RUN:</span>
        <span className="font-semibold text-white/95">ONLY 14/100 PIECES IN VAULT</span>
        <span className="inline-flex items-center gap-1 font-extrabold text-white underline decoration-white/70 underline-offset-2 transition-all group-hover/drop:decoration-white">
          <span>ENTER</span>
          <HugeiconsIcon icon={ArrowRight01Icon} size={11} strokeWidth={2.8} />
        </span>
      </Link>

      <span className="text-black/40 text-xs select-none">•</span>

      {/* 3. INTERACTIVE CLEARANCE CIPHER (CLICK TO COPY) */}
      <div className="flex items-center gap-2.5">
        <span className="bg-black px-2 py-0.5 font-mono text-[9px] font-extrabold tracking-widest text-white border border-black/40">
          秘文 • CIPHER
        </span>
        <span className="text-white/90">
          KEY: <strong className="font-mono tracking-widest font-black text-white">ZENJI10</strong>
        </span>
        <button
          type="button"
          tabIndex={isDuplicate ? -1 : 0}
          onClick={handleCopyCipher}
          className={`flex items-center gap-1.5 px-2.5 py-0.5 font-mono text-[9px] font-extrabold uppercase tracking-wider transition-all duration-150 active:scale-95 ${
            copied
              ? 'bg-white text-crimson shadow-[0_0_12px_rgba(255,255,255,0.8)]'
              : 'bg-black text-white hover:bg-ink hover:text-white border border-black/50 shadow-sm'
          }`}
          title="Click to copy clearance code for -A$10 discount"
        >
          {copied ? (
            <>
              <HugeiconsIcon icon={Tick01Icon} size={11} strokeWidth={3} />
              <span>COPIED! -A$10 ACTIVE</span>
            </>
          ) : (
            <>
              <HugeiconsIcon icon={Copy01Icon} size={11} strokeWidth={2.4} />
              <span>TAP TO COPY • -A$10</span>
            </>
          )}
        </button>
      </div>

      <span className="text-black/40 text-xs select-none">•</span>

      {/* 4. HYPER-TRANSIT // WORLDWIDE EXPEDITED DISPATCH */}
      <div className="flex items-center gap-2.5">
        <span className="bg-black px-2 py-0.5 font-mono text-[9px] font-extrabold tracking-widest text-white border border-black/40">
          転送 • DISPATCH
        </span>
        <span className="font-extrabold text-white">
          FREE WORLDWIDE PRIORITY TRANSIT OVER A$80
        </span>
        <span className="text-white/80 font-medium">SHIBUYA ⇄ GLOBAL</span>
      </div>

      <span className="text-black/40 text-xs select-none">•</span>

      {/* 5. TEXTILE SPEC CODEX */}
      <div className="flex items-center gap-2.5">
        <span className="bg-black px-2 py-0.5 font-mono text-[9px] font-extrabold tracking-widest text-white border border-black/40">
          仕様 • 480GSM
        </span>
        <span className="text-white font-extrabold">CUSTOM COMBED COTTON TERRY</span>
        <span className="text-white/60 font-bold">•</span>
        <span className="text-white/90 font-medium">ANTI-CURSED PRE-SHRUNK FORM</span>
      </div>

      <span className="text-black/40 text-xs select-none">•</span>

      {/* 6. SYNDICATE COLLECTOR GIFT */}
      <div className="flex items-center gap-2.5">
        <span className="bg-black px-2 py-0.5 font-mono text-[9px] font-extrabold tracking-widest text-white border border-black/40">
          特級 • ARTIFACT
        </span>
        <span className="text-white font-extrabold">
          HAND-CAST METALLIC SHADOW CHARM COMPLIMENTARY WITH DROP 02
        </span>
      </div>

      <span className="text-black/40 text-xs select-none">•</span>
    </div>
  );

  return (
    <aside
      aria-label="Syndicate Telemetry and Announcements"
      className="group relative z-30 overflow-hidden border-b border-[#A01625] bg-crimson py-2 text-white shadow-sm select-none"
    >
      {/* Marquee Track with Smooth Pause on Hover */}
      <div className="marquee-track flex w-max whitespace-nowrap font-mono text-[10.5px] uppercase tracking-[0.16em]">
        {renderTelemetryCluster(false)}
        {renderTelemetryCluster(true)}
      </div>
    </aside>
  );
}
