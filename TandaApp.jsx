import { useState, useEffect } from "react";
import {
  Gamepad2,
  BookOpen,
  TrendingUp,
  User,
  Settings as SettingsIcon,
  LifeBuoy,
  Trophy,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Home,
  Sun,
  Lock,
  Phone,
  Eye,
  EyeOff,
  MessageCircle,
  Send,
} from "lucide-react";

/* ==========================================================
   TANDA — complete app: home, navigation, and real games
   ----------------------------------------------------------
   Design tokens
   Background (warm ivory):     #FBF3E6
   Surface (tile face):         #FFFFFF
   Ink (primary text):          #2B2320
   Ink soft (secondary text):   #6B5D52
   Marigold (primary accent):   #E8A33D
   Deep teal (secondary):       #1D4B45
   Terracotta-red (tertiary):   #D9614F
   Leaf green (success):        #4C7A5C
   Display face: "Baloo 2". Body/UI face: "Atkinson Hyperlegible"
   (built specifically for low-vision readability).
   Signature: tiles shaped/shadowed like physical game tiles.
   ========================================================== */

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Atkinson+Hyperlegible:wght@400;700&display=swap');`;

const styles = `
${FONT_IMPORT}

.tanda-root {
  --bg: #FBF3E6;
  --surface: #FFFFFF;
  --ink: #2B2320;
  --ink-soft: #6B5D52;
  --marigold: #E8A33D;
  --marigold-dark: #C6822A;
  --teal: #1D4B45;
  --terracotta: #D9614F;
  --leaf: #4C7A5C;
  --tile-shadow: rgba(43,35,32,0.16);

  background: var(--bg);
  color: var(--ink);
  font-family: 'Atkinson Hyperlegible', sans-serif;
  min-height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
}

.tanda-root * { box-sizing: border-box; }

.tanda-shell {
  width: 100%;
  max-width: 460px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  background:
    radial-gradient(circle at 90% -5%, rgba(232,163,61,0.20), transparent 45%),
    var(--bg);
}

.tanda-header { padding: 28px 24px 8px 24px; display: flex; align-items: center; justify-content: space-between; }
.tanda-greeting-label { font-size: 16px; color: var(--ink-soft); margin: 0 0 2px 0; display: flex; align-items: center; gap: 6px; }
.tanda-greeting-name { font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 30px; margin: 0; color: var(--ink); letter-spacing: -0.01em; }
.tanda-greeting-date { font-size: 13px; color: var(--ink-soft); margin: 2px 0 0 0; }

.tanda-avatar { width: 52px; height: 52px; border-radius: 999px; background: var(--teal); color: #fff; display: flex; align-items: center; justify-content: center; font-family: 'Baloo 2', sans-serif; font-weight: 700; font-size: 20px; border: 3px solid var(--surface); box-shadow: 0 4px 10px var(--tile-shadow); flex-shrink: 0; cursor: pointer; }

.tanda-streak-card { margin: 18px 24px 6px 24px; background: var(--teal); border-radius: 22px; padding: 18px 20px; display: flex; align-items: center; gap: 14px; box-shadow: 0 8px 20px var(--tile-shadow); }
.tanda-streak-icon { width: 46px; height: 46px; border-radius: 14px; background: var(--marigold); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.tanda-streak-text-title { font-family: 'Baloo 2', sans-serif; font-weight: 700; font-size: 18px; color: #fff; margin: 0 0 2px 0; }
.tanda-streak-text-sub { font-size: 14.5px; color: rgba(255,255,255,0.82); margin: 0; }

.tanda-section-label { font-family: 'Baloo 2', sans-serif; font-weight: 700; font-size: 20px; color: var(--ink); margin: 26px 24px 12px 24px; }

.tanda-tile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; padding: 0 24px; }
.tanda-tile { background: var(--surface); border-radius: 20px; border: none; padding: 20px 16px; display: flex; flex-direction: column; align-items: flex-start; gap: 12px; cursor: pointer; box-shadow: 0 6px 0 0 var(--tile-shadow), 0 8px 16px rgba(43,35,32,0.08); transition: transform 0.12s ease, box-shadow 0.12s ease; text-align: left; font-family: inherit; min-height: 108px; }
.tanda-tile:hover { transform: translateY(-2px); }
.tanda-tile:active { transform: translateY(2px); box-shadow: 0 2px 0 0 var(--tile-shadow), 0 4px 10px rgba(43,35,32,0.08); }
.tanda-tile:focus-visible { outline: 3px solid var(--teal); outline-offset: 3px; }
.tanda-tile-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.tanda-tile-title { font-family: 'Baloo 2', sans-serif; font-weight: 700; font-size: 17px; color: var(--ink); margin: 0; line-height: 1.15; }
.tanda-tile-sub { font-size: 13px; color: var(--ink-soft); margin: -6px 0 0 0; }
.tanda-tile-wide { grid-column: span 2; flex-direction: row; align-items: center; }

.tanda-bottomnav { margin-top: auto; position: sticky; bottom: 0; display: flex; justify-content: space-around; align-items: center; padding: 10px 12px calc(14px + env(safe-area-inset-bottom, 0px)) 12px; background: var(--surface); border-top: 1px solid rgba(43,35,32,0.08); }
.tanda-navbtn { display: flex; flex-direction: column; align-items: center; gap: 4px; background: none; border: none; cursor: pointer; padding: 8px 14px; border-radius: 14px; font-size: 12.5px; color: var(--ink-soft); min-width: 64px; }
.tanda-navbtn[data-active="true"] { color: var(--teal); background: rgba(29,75,69,0.08); }
.tanda-navbtn:focus-visible { outline: 3px solid var(--teal); outline-offset: 2px; }

.tanda-subheader { padding: 22px 24px 4px 24px; display: flex; align-items: center; gap: 12px; }
.tanda-backbtn { width: 42px; height: 42px; border-radius: 12px; border: none; background: var(--surface); box-shadow: 0 4px 10px var(--tile-shadow); display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; }
.tanda-backbtn:focus-visible { outline: 3px solid var(--teal); outline-offset: 2px; }
.tanda-subtitle { font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 24px; margin: 0; color: var(--ink); }

.tanda-list { padding: 18px 24px 32px 24px; display: flex; flex-direction: column; gap: 12px; }
.tanda-listitem { background: var(--surface); border-radius: 18px; padding: 16px 18px; display: flex; align-items: center; gap: 14px; border: none; cursor: pointer; box-shadow: 0 4px 0 0 var(--tile-shadow), 0 6px 12px rgba(43,35,32,0.06); text-align: left; font-family: inherit; transition: transform 0.12s ease; }
.tanda-listitem:active { transform: translateY(2px); }
.tanda-listitem:focus-visible { outline: 3px solid var(--teal); outline-offset: 2px; }
.tanda-listitem-you { border: 2px solid var(--marigold); }
.tanda-listitem-dot { width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-family: 'Baloo 2', sans-serif; font-weight: 700; color: #fff; font-size: 15px; }
.tanda-listitem-title { font-family: 'Baloo 2', sans-serif; font-weight: 700; font-size: 16.5px; color: var(--ink); margin: 0; }
.tanda-badge { background: rgba(43,35,32,0.08); color: var(--ink-soft); font-size: 11.5px; font-weight: 700; padding: 4px 10px; border-radius: 999px; }

.tanda-placeholder { margin: 24px; background: var(--surface); border-radius: 22px; padding: 36px 24px; text-align: center; box-shadow: 0 8px 20px var(--tile-shadow); }
.tanda-placeholder-icon { width: 64px; height: 64px; border-radius: 999px; background: var(--bg); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; }
.tanda-placeholder-title { font-family: 'Baloo 2', sans-serif; font-weight: 700; font-size: 19px; margin: 0 0 8px 0; color: var(--ink); }
.tanda-placeholder-sub { font-size: 14.5px; color: var(--ink-soft); margin: 0; line-height: 1.5; }

.tanda-primary-btn { width: 100%; padding: 14px; border-radius: 14px; border: none; background: var(--teal); color: #fff; font-family: 'Baloo 2', sans-serif; font-weight: 700; font-size: 16px; cursor: pointer; margin-top: 16px; }
.tanda-primary-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.tanda-primary-btn:focus-visible { outline: 3px solid var(--marigold); outline-offset: 2px; }

.tanda-field-label { display: block; font-weight: 700; font-size: 14px; color: var(--ink-soft); margin: 0 0 8px 4px; }
.tanda-text-input { width: 100%; padding: 14px 16px; border-radius: 14px; border: 2px solid rgba(43,35,32,0.14); background: var(--surface); font-family: 'Atkinson Hyperlegible', sans-serif; font-size: 16px; color: var(--ink); }
.tanda-text-input:focus { outline: none; border-color: var(--teal); }

.tanda-toggle-row { width: 100%; display: flex; align-items: center; justify-content: space-between; background: var(--surface); border: none; border-radius: 16px; padding: 16px 18px; margin-bottom: 12px; cursor: pointer; box-shadow: 0 4px 0 0 var(--tile-shadow); font-family: inherit; }
.tanda-toggle-label { font-size: 15.5px; color: var(--ink); font-weight: 700; }
.tanda-toggle-track { width: 50px; height: 28px; border-radius: 999px; background: #DCD3C4; position: relative; transition: background .15s; flex-shrink: 0; }
.tanda-toggle-track.on { background: var(--leaf); }
.tanda-toggle-thumb { position: absolute; top: 3px; left: 3px; width: 22px; height: 22px; border-radius: 999px; background: #fff; transition: transform .15s; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
.tanda-toggle-track.on .tanda-toggle-thumb { transform: translateX(22px); }

.tanda-accordion-item { background: var(--surface); border-radius: 16px; margin-bottom: 12px; overflow: hidden; box-shadow: 0 4px 0 0 var(--tile-shadow); }
.tanda-accordion-header { width: 100%; display: flex; align-items: center; justify-content: space-between; background: none; border: none; padding: 16px 18px; font-family: 'Baloo 2', sans-serif; font-weight: 700; font-size: 15.5px; color: var(--ink); cursor: pointer; text-align: left; }
.tanda-accordion-body { padding: 0 18px 16px 18px; font-size: 14.5px; color: var(--ink-soft); line-height: 1.6; }

.tanda-game-meta { display: flex; justify-content: space-between; padding: 4px 4px 16px 4px; font-weight: 700; color: var(--ink-soft); font-size: 14px; }

.tanda-tilematch-grid { display: grid; gap: 8px; padding: 0 4px; }
.tanda-flipcard { aspect-ratio: 1; border-radius: 12px; border: none; background: var(--teal); font-size: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 3px 0 0 rgba(0,0,0,0.15); }
.tanda-flipcard.is-up { background: var(--surface); box-shadow: inset 0 0 0 2px var(--tile-shadow); }
.tanda-flipcard:focus-visible { outline: 3px solid var(--marigold); outline-offset: 2px; }

.tanda-puzzle-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; max-width: 280px; margin: 0 auto; }
.tanda-puzzle-tile { aspect-ratio: 1; border-radius: 12px; border: none; background: var(--marigold); color: #fff; font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 28px; cursor: pointer; box-shadow: 0 3px 0 0 var(--marigold-dark); }
.tanda-puzzle-tile.is-blank { background: transparent; box-shadow: none; cursor: default; }
.tanda-puzzle-tile:focus-visible { outline: 3px solid var(--teal); outline-offset: 2px; }

.tanda-color-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0 4px; }
.tanda-color-swatch { padding: 20px 10px; border-radius: 16px; border: none; color: #fff; font-family: 'Baloo 2', sans-serif; font-weight: 700; font-size: 15px; cursor: pointer; box-shadow: 0 4px 0 0 rgba(0,0,0,0.15); }
.tanda-color-swatch:focus-visible { outline: 3px solid var(--ink); outline-offset: 2px; }

.tanda-scramble-answer { min-height: 52px; display: flex; gap: 8px; justify-content: center; align-items: center; margin: 16px 0; flex-wrap: wrap; }
.tanda-scramble-pool { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-bottom: 20px; }
.tanda-letter-tile { width: 44px; height: 44px; border-radius: 10px; border: none; background: var(--surface); box-shadow: 0 3px 0 0 var(--tile-shadow); font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 18px; cursor: pointer; color: var(--ink); }
.tanda-letter-tile.filled { background: var(--teal); color: #fff; }
.tanda-letter-tile:focus-visible { outline: 3px solid var(--marigold); outline-offset: 2px; }

.tanda-mathopt-btn { background: var(--surface); border: none; border-radius: 16px; padding: 20px; font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 22px; color: var(--ink); cursor: pointer; box-shadow: 0 5px 0 0 var(--tile-shadow); }
.tanda-mathopt-btn:focus-visible { outline: 3px solid var(--teal); outline-offset: 2px; }

.tanda-triviaopt.is-correct { border: 2px solid var(--leaf); }
.tanda-triviaopt.is-wrong { border: 2px solid var(--terracotta); }

.tanda-auth-wrap { width: 100%; max-width: 460px; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 40px 28px; background: radial-gradient(circle at 90% -5%, rgba(232,163,61,0.20), transparent 45%), var(--bg); }
.tanda-auth-logo { width: 64px; height: 64px; border-radius: 18px; background: var(--teal); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 26px; color: var(--marigold); box-shadow: 0 8px 20px var(--tile-shadow); }
.tanda-auth-title { font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 28px; text-align: center; margin: 0 0 6px 0; color: var(--ink); }
.tanda-auth-sub { text-align: center; font-size: 15px; color: var(--ink-soft); margin: 0 0 28px 0; }
.tanda-input-group { position: relative; margin-bottom: 14px; }
.tanda-input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--ink-soft); pointer-events: none; }
.tanda-input-with-icon { padding-left: 44px; }
.tanda-input-eye { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 6px; color: var(--ink-soft); display: flex; }
.tanda-input-eye:focus-visible { outline: 3px solid var(--teal); outline-offset: 2px; }
.tanda-auth-error { color: var(--terracotta); font-size: 14px; font-weight: 700; text-align: center; margin: -4px 0 14px 0; }
.tanda-auth-switch { text-align: center; margin-top: 20px; font-size: 14.5px; color: var(--ink-soft); }
.tanda-auth-switch-link { background: none; border: none; color: var(--teal); font-weight: 700; cursor: pointer; padding: 0; text-decoration: underline; font-size: 14.5px; font-family: inherit; }
.tanda-auth-switch-link:focus-visible { outline: 3px solid var(--teal); outline-offset: 2px; }
.tanda-guest-link { text-align: center; margin-top: 14px; }
.tanda-guest-link button { background: none; border: none; color: var(--ink-soft); font-size: 14px; cursor: pointer; text-decoration: underline; font-family: inherit; }

.tanda-shell.dark { --bg: #1E2724; --surface: #29332F; --ink: #F3EFE6; --ink-soft: #B9B0A2; --teal: #4C8C7F; --tile-shadow: rgba(0,0,0,0.35); }
.tanda-shell.dark .tanda-avatar { border-color: var(--surface); }

.tanda-winmodal-backdrop { position: fixed; inset: 0; background: rgba(43,35,32,0.55); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 24px; }
.tanda-winmodal { background: var(--surface); border-radius: 24px; padding: 36px 28px; text-align: center; max-width: 320px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); animation: tanda-pop 0.25s ease; }
@keyframes tanda-pop { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.tanda-winmodal-icon { width: 72px; height: 72px; border-radius: 999px; background: var(--marigold); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; }
.tanda-winmodal-title { font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 24px; margin: 0 0 8px 0; color: var(--ink); }
.tanda-winmodal-sub { font-size: 14.5px; color: var(--ink-soft); margin: 0; }

.tanda-category-tabs { display: flex; gap: 8px; padding: 8px 24px 4px 24px; overflow-x: auto; }
.tanda-category-tab { flex-shrink: 0; padding: 9px 16px; border-radius: 999px; border: none; background: var(--surface); color: var(--ink-soft); font-weight: 700; font-size: 13.5px; cursor: pointer; box-shadow: 0 3px 0 0 var(--tile-shadow); }
.tanda-category-tab[data-active="true"] { background: var(--teal); color: #fff; }
.tanda-tut-complete-badge { display: inline-flex; align-items: center; gap: 4px; background: rgba(76,122,92,0.15); color: var(--leaf); font-size: 12px; font-weight: 700; padding: 3px 9px; border-radius: 999px; margin-left: 8px; }
.tanda-mark-complete-btn { margin-top: 12px; padding: 10px 16px; border-radius: 12px; border: none; background: var(--leaf); color: #fff; font-weight: 700; cursor: pointer; font-family: inherit; font-size: 14px; }
.tanda-mark-complete-btn[data-done="true"] { background: rgba(76,122,92,0.2); color: var(--leaf); }

.tanda-photo-upload { display: block; margin: 0 auto; cursor: pointer; }
.tanda-photo-img { width: 88px; height: 88px; border-radius: 999px; object-fit: cover; border: 3px solid var(--surface); box-shadow: 0 4px 10px var(--tile-shadow); }
.tanda-photo-edit-badge { width: 30px; height: 30px; border-radius: 999px; background: var(--teal); display: flex; align-items: center; justify-content: center; position: absolute; bottom: 0; right: -2px; border: 2px solid var(--bg); }

.tanda-slider-row { background: var(--surface); border-radius: 16px; padding: 16px 18px; margin-bottom: 12px; box-shadow: 0 4px 0 0 var(--tile-shadow); }
.tanda-slider-row input[type="range"] { width: 100%; margin-top: 10px; accent-color: var(--teal); }
.tanda-select { width: 100%; padding: 14px 16px; border-radius: 14px; border: 2px solid rgba(43,35,32,0.14); background: var(--surface); color: var(--ink); font-family: 'Atkinson Hyperlegible', sans-serif; font-size: 15px; }

.tanda-textarea { width: 100%; min-height: 90px; padding: 14px 16px; border-radius: 14px; border: 2px solid rgba(43,35,32,0.14); background: var(--surface); font-family: 'Atkinson Hyperlegible', sans-serif; font-size: 15px; color: var(--ink); resize: vertical; }
.tanda-textarea:focus { outline: none; border-color: var(--teal); }
.tanda-star-row { display: flex; gap: 6px; justify-content: center; margin-bottom: 14px; }
.tanda-star-btn { background: none; border: none; cursor: pointer; padding: 2px; }

.tanda-playing-card { width: 46px; height: 64px; border-radius: 8px; border: 2px solid rgba(43,35,32,0.15); background: #fff; font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 15px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 0 0 var(--tile-shadow); flex-shrink: 0; transition: transform 0.12s ease; }
.tanda-playing-card.is-selected { transform: translateY(-10px); border-color: var(--teal); box-shadow: 0 8px 12px rgba(43,35,32,0.25); }
.tanda-playing-card.is-facedown { background: var(--teal); }
.tanda-playing-card:disabled { cursor: default; opacity: 0.6; }
.tanda-card-row { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; padding: 10px 4px; }
.tanda-card-suit { font-size: 17px; line-height: 1; }
.tanda-pile-area { min-height: 78px; display: flex; align-items: center; justify-content: center; background: var(--bg); border-radius: 16px; margin: 10px 4px; padding: 8px; }
.tanda-card-actions { display: flex; gap: 10px; margin-top: 14px; }
.tanda-card-actions .tanda-primary-btn { margin-top: 0; }
.tanda-secondary-btn { flex: 1; padding: 14px; border-radius: 14px; border: 2px solid var(--teal); background: none; color: var(--teal); font-family: 'Baloo 2', sans-serif; font-weight: 700; font-size: 15px; cursor: pointer; }
.tanda-secondary-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.tanda-lang-switch { display: flex; background: var(--surface); border-radius: 999px; padding: 3px; box-shadow: 0 3px 0 0 var(--tile-shadow); }
.tanda-lang-option { border: none; background: none; padding: 7px 12px; border-radius: 999px; font-family: 'Baloo 2', sans-serif; font-weight: 700; font-size: 13px; color: var(--ink-soft); cursor: pointer; }
.tanda-lang-option[data-active="true"] { background: var(--teal); color: #fff; }
.tanda-lang-option:focus-visible { outline: 3px solid var(--marigold); outline-offset: 2px; }

.tanda-chat-window { display: flex; flex-direction: column; gap: 10px; padding: 8px 24px 12px 24px; }
.tanda-chat-bubble { max-width: 82%; padding: 12px 14px; border-radius: 16px; font-size: 14.5px; line-height: 1.5; }
.tanda-chat-bubble.bot { align-self: flex-start; background: var(--surface); color: var(--ink); box-shadow: 0 3px 0 0 var(--tile-shadow); border-bottom-left-radius: 4px; }
.tanda-chat-bubble.user { align-self: flex-end; background: var(--teal); color: #fff; border-bottom-right-radius: 4px; }
.tanda-chat-suggestions { display: flex; flex-wrap: wrap; gap: 8px; padding: 4px 24px 12px 24px; }
.tanda-chat-chip { background: var(--surface); border: 1px solid rgba(43,35,32,0.14); border-radius: 999px; padding: 8px 14px; font-size: 13px; font-weight: 700; color: var(--teal); cursor: pointer; }
.tanda-chat-chip:focus-visible { outline: 3px solid var(--teal); outline-offset: 2px; }
.tanda-chat-inputrow { display: flex; gap: 10px; padding: 12px 24px calc(16px + env(safe-area-inset-bottom, 0px)) 24px; }
.tanda-chat-input { flex: 1; padding: 12px 16px; border-radius: 999px; border: 2px solid rgba(43,35,32,0.14); font-family: 'Atkinson Hyperlegible', sans-serif; font-size: 15px; color: var(--ink); background: var(--surface); }
.tanda-chat-input:focus { outline: none; border-color: var(--teal); }
.tanda-chat-send { width: 46px; height: 46px; border-radius: 999px; border: none; background: var(--teal); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; }
.tanda-chat-send:disabled { opacity: 0.4; cursor: not-allowed; }
.tanda-chat-send:focus-visible { outline: 3px solid var(--marigold); outline-offset: 2px; }
`;

/* ---------------- data ---------------- */

const GAMES = [
  { key: "trivia", name: "Trivia", color: "#E8A33D", available: true },
  { key: "mahjong", name: "Mahjong", color: "#1D4B45", available: true },
  { key: "memory", name: "Memory Game", color: "#4C7A5C", available: true },
  { key: "colorMatch", name: "Color Match", color: "#8A6FB3", available: true },
  { key: "numberPuzzle", name: "Number Puzzle", color: "#3D7EA6", available: true },
  { key: "wordScramble", name: "Word Scramble", color: "#B85C8A", available: true },
  { key: "mathQuiz", name: "Math Quiz", color: "#5C8A4C", available: true },
];

const TILES = [
  { key: "games", title: "Educational Games", sub: "Play & stay sharp", icon: Gamepad2, bg: "#E8A33D" },
  { key: "tutorials", title: "Learning Modules", sub: "Learn step by step", icon: BookOpen, bg: "#1D4B45" },
  { key: "assistant", title: "AI Assistant", sub: "Ask me anything", icon: MessageCircle, bg: "#3D7EA6" },
  { key: "progress", title: "Progress", sub: "See how far you've come", icon: TrendingUp, bg: "#D9614F" },
  { key: "leaderboard", title: "Leaderboard", sub: "Compare with friends", icon: Trophy, bg: "#4C7A5C" },
  { key: "profile", title: "Profile", sub: null, icon: User, bg: "#8A6FB3" },
  { key: "settings", title: "Settings", sub: null, icon: SettingsIcon, bg: "#6B5D52" },
  { key: "help", title: "Help & Support", sub: "We're here for you", icon: LifeBuoy, bg: "#C6822A", wide: true },
];

const NAV_ITEMS = [
  { key: "home", label: "Home", icon: Home },
  { key: "games", label: "Games", icon: Gamepad2 },
  { key: "tutorials", label: "Learn", icon: BookOpen },
  { key: "assistant", label: "AI", icon: MessageCircle },
  { key: "profile", label: "Profile", icon: User },
];

const TRIVIA_QUESTIONS = [
  { q: "What is the capital of the Philippines?", options: ["Cebu City", "Davao City", "Manila", "Quezon City"], answer: "Manila" },
  { q: "How many days are in a leap year?", options: ["364", "365", "366", "367"], answer: "366" },
  { q: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: "Pacific" },
  { q: "Which fruit is called the 'king of fruits' in Southeast Asia?", options: ["Mango", "Durian", "Banana", "Papaya"], answer: "Durian" },
  { q: "What is the national bird of the Philippines?", options: ["Maya Bird", "Philippine Eagle", "Kalaw", "Tarictic Hornbill"], answer: "Philippine Eagle" },
  { q: "How many players are on a basketball team on the court at once?", options: ["4", "5", "6", "7"], answer: "5" },
  { q: "How many continents are there?", options: ["5", "6", "7", "8"], answer: "7" },
  { q: "What is the currency of the Philippines?", options: ["Ringgit", "Peso", "Baht", "Rupiah"], answer: "Peso" },
  { q: "What is the largest island in the Philippines?", options: ["Mindanao", "Luzon", "Palawan", "Cebu"], answer: "Luzon" },
  { q: "What is the smallest planet in our solar system?", options: ["Mars", "Venus", "Mercury", "Earth"], answer: "Mercury" },
  { q: "How many days are in February in a normal year?", options: ["28", "29", "30", "31"], answer: "28" },
  { q: "What is the national language of the Philippines?", options: ["Spanish", "English", "Filipino", "Malay"], answer: "Filipino" },
  { q: "Which sea lies to the west of the Philippines?", options: ["Sulu Sea", "West Philippine Sea", "Celebes Sea", "Bohol Sea"], answer: "West Philippine Sea" },
  { q: "What is the tallest mountain in the Philippines?", options: ["Mount Pulag", "Mount Apo", "Mount Mayon", "Mount Banahaw"], answer: "Mount Apo" },
  { q: "How many colors are there in a rainbow?", options: ["5", "6", "7", "8"], answer: "7" },
  { q: "What gas do plants absorb from the air?", options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], answer: "Carbon dioxide" },
  { q: "What is the freezing point of water in Celsius?", options: ["-10", "0", "10", "32"], answer: "0" },
  { q: "What is the boiling point of water in Celsius?", options: ["90", "100", "110", "120"], answer: "100" },
  { q: "Who is known as the national hero of the Philippines?", options: ["Andres Bonifacio", "Jose Rizal", "Emilio Aguinaldo", "Antonio Luna"], answer: "Jose Rizal" },
  { q: "In what year did the Philippines declare independence from Spain?", options: ["1896", "1898", "1901", "1946"], answer: "1898" },
  { q: "What is the national flower of the Philippines?", options: ["Rose", "Sampaguita", "Orchid", "Gumamela"], answer: "Sampaguita" },
  { q: "How many days are in a week?", options: ["5", "6", "7", "8"], answer: "7" },
  { q: "What is the largest planet in our solar system?", options: ["Saturn", "Jupiter", "Neptune", "Uranus"], answer: "Jupiter" },
  { q: "What is the closest star to Earth?", options: ["The Moon", "The Sun", "Polaris", "Sirius"], answer: "The Sun" },
  { q: "How many months in a year have 31 days?", options: ["5", "6", "7", "8"], answer: "7" },
  { q: "What Filipino dish uses vinegar, soy sauce, and garlic to cook meat?", options: ["Sinigang", "Adobo", "Kare-Kare", "Menudo"], answer: "Adobo" },
  { q: "How many keys does a standard piano have?", options: ["76", "88", "92", "100"], answer: "88" },
  { q: "What is the capital of Japan?", options: ["Osaka", "Kyoto", "Tokyo", "Nagoya"], answer: "Tokyo" },
  { q: "What is the capital of the United States?", options: ["New York", "Washington, D.C.", "Los Angeles", "Chicago"], answer: "Washington, D.C." },
  { q: "How many legs does a spider have?", options: ["6", "8", "10", "12"], answer: "8" },
  { q: "What is the largest mammal in the world?", options: ["Elephant", "Blue whale", "Giraffe", "Hippopotamus"], answer: "Blue whale" },
  { q: "What is H2O more commonly known as?", options: ["Salt", "Water", "Oxygen", "Sugar"], answer: "Water" },
  { q: "Which small citrus fruit is common in Filipino cooking?", options: ["Calamansi", "Lemon", "Orange", "Lime"], answer: "Calamansi" },
  { q: "What do bees produce?", options: ["Milk", "Honey", "Silk", "Wax only"], answer: "Honey" },
  { q: "What is the capital of France?", options: ["Lyon", "Marseille", "Paris", "Nice"], answer: "Paris" },
  { q: "Which ocean lies between the Americas and Europe?", options: ["Pacific", "Atlantic", "Indian", "Arctic"], answer: "Atlantic" },
  { q: "How many players are on a volleyball team on the court?", options: ["5", "6", "7", "9"], answer: "6" },
  { q: "What day comes right after Wednesday?", options: ["Tuesday", "Thursday", "Friday", "Monday"], answer: "Thursday" },
  { q: "How many hours are in a day?", options: ["12", "18", "24", "30"], answer: "24" },
  { q: "How many minutes are in an hour?", options: ["30", "45", "60", "90"], answer: "60" },
  { q: "What do you call a doctor who treats teeth?", options: ["Surgeon", "Dentist", "Optometrist", "Pediatrician"], answer: "Dentist" },
  { q: "What is the name of the long-necked animal from Africa?", options: ["Zebra", "Giraffe", "Camel", "Antelope"], answer: "Giraffe" },
  { q: "What is the largest desert in the world?", options: ["Gobi", "Sahara", "Kalahari", "Mojave"], answer: "Sahara" },
  { q: "Which country gave the Statue of Liberty to the USA?", options: ["England", "Spain", "France", "Italy"], answer: "France" },
  { q: "What is the fastest land animal?", options: ["Lion", "Horse", "Cheetah", "Gazelle"], answer: "Cheetah" },
  { q: "How many sides does a hexagon have?", options: ["5", "6", "7", "8"], answer: "6" },
  { q: "What do you call baby dogs?", options: ["Kittens", "Puppies", "Cubs", "Foals"], answer: "Puppies" },
  { q: "Which Filipino dish is made of grilled or fried pork ears, snout, and belly?", options: ["Lechon", "Sisig", "Bulalo", "Dinuguan"], answer: "Sisig" },
  { q: "What is the main island group in Central Philippines called?", options: ["Luzon", "Visayas", "Mindanao", "Palawan"], answer: "Visayas" },
  { q: "What is the traditional Filipino bamboo dance called?", options: ["Cariñosa", "Tinikling", "Pandanggo", "Sayaw sa Bangko"], answer: "Tinikling" },
];

const WORD_LIST = [
  "MANGO", "HOUSE", "SUNDAY", "FAMILY", "GARDEN", "KITCHEN", "MARKET", "FLOWER", "BASKET", "CHURCH",
  "TEACHER", "DOCTOR", "BREAKFAST", "UMBRELLA", "CANDLE", "WINDOW", "PILLOW", "BLANKET", "SANDALS", "BICYCLE",
  "CALENDAR", "MOUNTAIN", "RIVER", "ISLAND", "SUNSHINE", "RAINBOW", "BIRTHDAY", "HOLIDAY", "GRANDSON", "DAUGHTER",
  "NEIGHBOR", "HOSPITAL", "SLIPPERS", "NOODLES", "CHICKEN", "BANANA", "PAPAYA", "COCONUT", "JEEPNEY", "TRICYCLE",
  "SANDWICH", "BUTTERFLY", "ELEPHANT", "LIBRARY", "HAMMER", "PENCIL", "JACKET", "GUITAR", "CAMERA", "STATION",
];

const COLOR_OPTIONS = [
  { name: "Red", hex: "#D9614F" },
  { name: "Blue", hex: "#3D7EA6" },
  { name: "Green", hex: "#4C7A5C" },
  { name: "Yellow", hex: "#E8A33D" },
  { name: "Purple", hex: "#8A6FB3" },
  { name: "Pink", hex: "#B85C8A" },
  { name: "Orange", hex: "#C6822A" },
  { name: "Brown", hex: "#7A5230" },
  { name: "Teal", hex: "#1D4B45" },
  { name: "Gray", hex: "#6B5D52" },
];

function buildColorRoundBank(count) {
  const bank = [];
  for (let i = 0; i < count; i++) {
    const word = COLOR_OPTIONS[Math.floor(Math.random() * COLOR_OPTIONS.length)];
    let ink = COLOR_OPTIONS[Math.floor(Math.random() * COLOR_OPTIONS.length)];
    if (ink.name === word.name && Math.random() < 0.8) {
      ink = COLOR_OPTIONS[(COLOR_OPTIONS.indexOf(ink) + 1) % COLOR_OPTIONS.length];
    }
    bank.push({ word, ink });
  }
  return bank;
}

const COLOR_ROUND_BANK = buildColorRoundBank(50);

const MEMORY_SYMBOLS = ["\uD83E\uDD6D", "\uD83C\uDF3A", "\uD83E\uDD65", "\uD83D\uDC1A", "\u2600\uFE0F", "\uD83C\uDF34"];
const MAHJONG_SYMBOLS = ["\uD83C\uDC07", "\uD83C\uDC08", "\uD83C\uDC09", "\uD83C\uDC0A", "\uD83C\uDC0B", "\uD83C\uDC0C", "\uD83C\uDC0D", "\uD83C\uDC0E"];

const TUTORIAL_CATEGORIES = ["All", "Tech", "Health", "Skills", "Finances"];

const TUTORIALS = [
  { id: 1, category: "Tech", title: "How to Send a Text Message", steps: ["Open the Messages app (green speech bubble icon).", "Tap the pencil icon to start a new message.", "Type the person's name or number.", "Type your message, then tap the blue arrow to send."] },
  { id: 2, category: "Tech", title: "How to Make a Video Call", steps: ["Open the Messages or Video Call app.", "Tap on a person's name.", "Tap the video camera icon.", "Wait for them to answer."] },
  { id: 3, category: "Tech", title: "How to Take a Photo", steps: ["Open the Camera app.", "Point your phone at what you want to photograph.", "Tap the round button at the bottom.", "Your photo is saved automatically."] },
  { id: 4, category: "Tech", title: "How to Set Up a New Cellphone", steps: ["Turn on the phone and follow the welcome screen.", "Connect to your home Wi-Fi.", "Sign in with your Google or Apple account, or ask family to help create one.", "Adjust brightness and text size in Settings so it's comfortable to read."] },
  { id: 5, category: "Health", title: "How to Set a Medicine Reminder", steps: ["Open the Reminders app.", "Tap the plus (+) button.", "Type the name of the medicine.", "Choose the time you take it, then tap Save."] },
  { id: 6, category: "Health", title: "Simple Daily Stretches", steps: ["Sit up straight in a sturdy chair.", "Slowly roll your shoulders backward 5 times.", "Gently turn your head left, then right.", "Stretch your arms up and take 3 deep breaths."] },
  { id: 7, category: "Health", title: "How to Check Your Blood Pressure at Home", steps: ["Sit quietly for 5 minutes before measuring.", "Wrap the cuff snugly around your upper arm.", "Rest your arm on a table at heart level.", "Press start and stay still until it finishes."] },
  { id: 8, category: "Skills", title: "How to Cook Simple Sinigang", steps: ["Boil pork or fish with water in a pot.", "Add tomatoes, onions, and sinigang mix.", "Add vegetables like kangkong and radish.", "Simmer for 10 minutes and serve hot with rice."] },
  { id: 9, category: "Skills", title: "How to Water Your Plants Properly", steps: ["Check if the soil is dry before watering.", "Water slowly at the base of the plant.", "Avoid wetting the leaves in strong sun.", "Water early morning or late afternoon."] },
  { id: 10, category: "Finances", title: "How to Budget Your Monthly Pension", steps: ["Write down all your income for the month.", "List fixed expenses first: rent, bills, medicine.", "Set aside a small amount for savings.", "Keep the rest for food and daily needs."] },
  { id: 11, category: "Finances", title: "How to Avoid Phone Scams", steps: ["Never share your OTP (one-time PIN) with anyone.", "Banks will never ask for your password by text.", "Hang up on callers who rush or threaten you.", "Ask a family member before sending any money."] },
];

const FAQS = [
  { id: 1, q: "How do I make the text bigger?", a: "Go to Settings and turn on Larger Text." },
  { id: 2, q: "I forgot my password, what do I do?", a: "Ask a family member to help you reset it from the sign-in screen." },
  { id: 3, q: "How do I get help from a real person?", a: "Ask a family member or caregiver to sit with you and go through the app together." },
];

const LANG_TEXT = {
  en: {
    goodMorning: "Good morning",
    goodAfternoon: "Good afternoon",
    goodEvening: "Good evening",
    whatToDo: "What would you like to do?",
    home: "Home",
    games: "Games",
    tutorials: "Tutorials",
    profile: "Profile",
    assistant: "AI",
  },
  tl: {
    goodMorning: "Magandang umaga",
    goodAfternoon: "Magandang hapon",
    goodEvening: "Magandang gabi",
    whatToDo: "Ano ang gusto mong gawin?",
    home: "Tahanan",
    games: "Laro",
    tutorials: "Aralin",
    profile: "Talaan",
    assistant: "AI",
  },
};

/* ---------------- helpers ---------------- */

function initials(name) {
  return (name || "")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------------- small shared UI ---------------- */

function Toggle({ checked, onChange, label }) {
  return (
    <button className="tanda-toggle-row" onClick={() => onChange(!checked)} role="switch" aria-checked={checked}>
      <span className="tanda-toggle-label">{label}</span>
      <span className={`tanda-toggle-track${checked ? " on" : ""}`}>
        <span className="tanda-toggle-thumb" />
      </span>
    </button>
  );
}

function AccordionItem({ title, children, isOpen, onToggle }) {
  return (
    <div className="tanda-accordion-item">
      <button className="tanda-accordion-header" onClick={onToggle} aria-expanded={isOpen}>
        <span>{title}</span>
        {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </button>
      {isOpen && <div className="tanda-accordion-body">{children}</div>}
    </div>
  );
}

/* ---------------- games ---------------- */

function TileMatchGame({ symbols, columns, onComplete }) {
  const buildDeck = () => shuffleArray([...symbols, ...symbols]).map((s, i) => ({ id: i, symbol: s }));
  const [cards, setCards] = useState(buildDeck);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (flipped.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = flipped;
      if (cards[a].symbol === cards[b].symbol) {
        setMatched((m) => [...m, a, b]);
        setFlipped([]);
      } else {
        const t = setTimeout(() => setFlipped([]), 700);
        return () => clearTimeout(t);
      }
    }
  }, [flipped, cards]);

  useEffect(() => {
    if (matched.length > 0 && matched.length === cards.length && !won) {
      setWon(true);
      onComplete(moves);
    }
  }, [matched, cards.length, won, moves, onComplete]);

  function handleTap(i) {
    if (flipped.length === 2 || flipped.includes(i) || matched.includes(i)) return;
    setFlipped((f) => [...f, i]);
  }

  function reset() {
    setCards(buildDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setWon(false);
  }

  return (
    <div>
      <div className="tanda-game-meta">
        <span>Moves: {moves}</span>
        <span>Pairs found: {matched.length / 2}/{symbols.length}</span>
      </div>
      {won ? (
        <div className="tanda-placeholder">
          <div className="tanda-placeholder-icon"><Trophy size={28} color="#1D4B45" /></div>
          <p className="tanda-placeholder-title">You matched them all!</p>
          <p className="tanda-placeholder-sub">Finished in {moves} moves.</p>
          <button className="tanda-primary-btn" onClick={reset}>Play again</button>
        </div>
      ) : (
        <div className="tanda-tilematch-grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {cards.map((c, i) => {
            const isUp = flipped.includes(i) || matched.includes(i);
            return (
              <button key={c.id} className={`tanda-flipcard${isUp ? " is-up" : ""}`} onClick={() => handleTap(i)} aria-label={isUp ? c.symbol : "Hidden tile"}>
                {isUp ? c.symbol : ""}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ColorMatchGame({ onComplete }) {
  const ROUNDS = 8;
  const [sessionRounds, setSessionRounds] = useState(() => shuffleArray(COLOR_ROUND_BANK).slice(0, ROUNDS));
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(() => sessionRounds[0]);
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(false);

  function handleAnswer(name) {
    if (feedback) return;
    const correct = name === current.word.name;
    setFeedback(correct ? "correct" : "wrong");
    const newScore = score + (correct ? 1 : 0);
    setTimeout(() => {
      if (round + 1 >= ROUNDS) {
        setScore(newScore);
        setDone(true);
        onComplete(newScore);
      } else {
        setScore(newScore);
        const nextRound = round + 1;
        setRound(nextRound);
        setCurrent(sessionRounds[nextRound]);
        setFeedback(null);
      }
    }, 500);
  }

  function reset() {
    const rounds = shuffleArray(COLOR_ROUND_BANK).slice(0, ROUNDS);
    setSessionRounds(rounds);
    setRound(0);
    setScore(0);
    setDone(false);
    setCurrent(rounds[0]);
    setFeedback(null);
  }

  if (done) {
    return (
      <div className="tanda-placeholder">
        <div className="tanda-placeholder-icon"><Trophy size={28} color="#1D4B45" /></div>
        <p className="tanda-placeholder-title">Round complete!</p>
        <p className="tanda-placeholder-sub">You scored {score}/{ROUNDS}.</p>
        <button className="tanda-primary-btn" onClick={reset}>Play again</button>
      </div>
    );
  }

  return (
    <div>
      <div className="tanda-game-meta">
        <span>Round {round + 1}/{ROUNDS}</span>
        <span>Score: {score}</span>
      </div>
      <p className="tanda-placeholder-sub" style={{ textAlign: "center" }}>Tap the color that matches this word:</p>
      <p style={{ textAlign: "center", fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: 42, color: current.ink.hex, margin: "18px 0" }}>
        {current.word.name.toUpperCase()}
      </p>
      <div className="tanda-color-grid">
        {COLOR_OPTIONS.map((c) => (
          <button key={c.name} className="tanda-color-swatch" style={{ background: c.hex }} onClick={() => handleAnswer(c.name)}>
            {c.name}
          </button>
        ))}
      </div>
      {feedback && (
        <p style={{ textAlign: "center", marginTop: 14, fontWeight: 700, color: feedback === "correct" ? "var(--leaf)" : "var(--terracotta)" }}>
          {feedback === "correct" ? "Correct!" : `Oops, it was ${current.word.name}`}
        </p>
      )}
    </div>
  );
}

function neighbors(i) {
  const row = Math.floor(i / 3), col = i % 3;
  const arr = [];
  if (row > 0) arr.push(i - 3);
  if (row < 2) arr.push(i + 3);
  if (col > 0) arr.push(i - 1);
  if (col < 2) arr.push(i + 1);
  return arr;
}

function shuffleBoard() {
  let b = [1, 2, 3, 4, 5, 6, 7, 8, null];
  let blank = 8;
  for (let i = 0; i < 150; i++) {
    const n = neighbors(blank);
    const swap = n[Math.floor(Math.random() * n.length)];
    [b[blank], b[swap]] = [b[swap], b[blank]];
    blank = swap;
  }
  return b;
}

function NumberPuzzleGame({ onComplete }) {
  const [board, setBoard] = useState(shuffleBoard);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  function handleTap(i) {
    if (won) return;
    const blank = board.indexOf(null);
    if (neighbors(blank).includes(i)) {
      const next = [...board];
      [next[blank], next[i]] = [next[i], next[blank]];
      setBoard(next);
      const newMoves = moves + 1;
      setMoves(newMoves);
      if (next.every((v, idx) => v === (idx === 8 ? null : idx + 1))) {
        setWon(true);
        onComplete(newMoves);
      }
    }
  }

  function reset() {
    setBoard(shuffleBoard());
    setMoves(0);
    setWon(false);
  }

  return (
    <div>
      <div className="tanda-game-meta"><span>Moves: {moves}</span></div>
      {won ? (
        <div className="tanda-placeholder">
          <div className="tanda-placeholder-icon"><Trophy size={28} color="#1D4B45" /></div>
          <p className="tanda-placeholder-title">Solved!</p>
          <p className="tanda-placeholder-sub">You did it in {moves} moves.</p>
          <button className="tanda-primary-btn" onClick={reset}>Play again</button>
        </div>
      ) : (
        <>
          <div className="tanda-puzzle-grid">
            {board.map((v, i) => (
              <button key={i} className={`tanda-puzzle-tile${v === null ? " is-blank" : ""}`} onClick={() => handleTap(i)} disabled={v === null}>
                {v}
              </button>
            ))}
          </div>
          <p className="tanda-placeholder-sub" style={{ textAlign: "center", marginTop: 16 }}>
            Tap a tile next to the empty space to slide it. Arrange 1 to 8 in order.
          </p>
        </>
      )}
    </div>
  );
}

function scrambleWord(word) {
  let letters = word.split("");
  let tries = 0;
  do {
    letters = shuffleArray(word.split(""));
    tries++;
  } while (letters.join("") === word && tries < 10);
  return letters;
}

function WordScrambleGame({ onComplete }) {
  const ROUND_SIZE = 8;
  const [sessionWords, setSessionWords] = useState(() => shuffleArray(WORD_LIST).slice(0, ROUND_SIZE));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [pool, setPool] = useState(() => scrambleWord(sessionWords[0]).map((l, i) => ({ id: i, letter: l, used: false })));
  const [answer, setAnswer] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(false);

  function loadWord(i, words) {
    setPool(scrambleWord((words || sessionWords)[i]).map((l, idx) => ({ id: idx, letter: l, used: false })));
    setAnswer([]);
    setFeedback(null);
  }

  function tapLetter(item) {
    if (feedback) return;
    setPool((p) => p.map((x) => (x.id === item.id ? { ...x, used: true } : x)));
    setAnswer((a) => [...a, item]);
  }

  function tapAnswer(item) {
    if (feedback) return;
    setPool((p) => p.map((x) => (x.id === item.id ? { ...x, used: false } : x)));
    setAnswer((a) => a.filter((x) => x.id !== item.id));
  }

  function checkAnswer() {
    const guess = answer.map((a) => a.letter).join("");
    const correct = guess === sessionWords[index];
    setFeedback(correct ? "correct" : "wrong");
    const newScore = score + (correct ? 1 : 0);
    setTimeout(() => {
      if (index + 1 >= sessionWords.length) {
        setScore(newScore);
        setDone(true);
        onComplete(newScore);
      } else {
        setScore(newScore);
        const nextIndex = index + 1;
        setIndex(nextIndex);
        loadWord(nextIndex);
      }
    }, 900);
  }

  function reset() {
    const words = shuffleArray(WORD_LIST).slice(0, ROUND_SIZE);
    setSessionWords(words);
    setIndex(0);
    setScore(0);
    setDone(false);
    loadWord(0, words);
  }

  if (done) {
    return (
      <div className="tanda-placeholder">
        <div className="tanda-placeholder-icon"><Trophy size={28} color="#1D4B45" /></div>
        <p className="tanda-placeholder-title">Nice work!</p>
        <p className="tanda-placeholder-sub">You scored {score}/{sessionWords.length}.</p>
        <button className="tanda-primary-btn" onClick={reset}>Play again</button>
      </div>
    );
  }

  return (
    <div>
      <div className="tanda-game-meta">
        <span>Word {index + 1}/{sessionWords.length}</span>
        <span>Score: {score}</span>
      </div>
      <p className="tanda-placeholder-sub" style={{ textAlign: "center" }}>Tap the letters in order to spell the word.</p>
      <div className="tanda-scramble-answer">
        {answer.length === 0 && <span style={{ color: "var(--ink-soft)" }}>Tap letters below</span>}
        {answer.map((a) => (
          <button key={a.id} className="tanda-letter-tile filled" onClick={() => tapAnswer(a)}>{a.letter}</button>
        ))}
      </div>
      <div className="tanda-scramble-pool">
        {pool.map((p) => !p.used && (
          <button key={p.id} className="tanda-letter-tile" onClick={() => tapLetter(p)}>{p.letter}</button>
        ))}
      </div>
      <button className="tanda-primary-btn" onClick={checkAnswer} disabled={answer.length === 0 || !!feedback}>Check</button>
      {feedback && (
        <p style={{ textAlign: "center", marginTop: 12, fontWeight: 700, color: feedback === "correct" ? "var(--leaf)" : "var(--terracotta)" }}>
          {feedback === "correct" ? "Correct!" : `The word was ${sessionWords[index]}`}
        </p>
      )}
    </div>
  );
}

function generateQuestion() {
  const ops = ["+", "-", "\u00D7"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a = Math.floor(Math.random() * 20) + 1;
  let b = Math.floor(Math.random() * 20) + 1;
  if (op === "-" && b > a) [a, b] = [b, a];
  if (op === "\u00D7") {
    a = Math.floor(Math.random() * 10) + 1;
    b = Math.floor(Math.random() * 10) + 1;
  }
  const answer = op === "+" ? a + b : op === "-" ? a - b : a * b;
  const options = new Set([answer]);
  let guard = 0;
  while (options.size < 4 && guard < 30) {
    const delta = Math.floor(Math.random() * 11) - 5;
    const opt = answer + delta;
    if (opt !== answer && opt >= 0) options.add(opt);
    guard++;
  }
  return { text: `${a} ${op} ${b} = ?`, answer, options: shuffleArray(Array.from(options)) };
}

function buildMathQuestionBank(count) {
  const bank = [];
  const seen = new Set();
  let guard = 0;
  while (bank.length < count && guard < count * 20) {
    const q = generateQuestion();
    if (!seen.has(q.text)) {
      seen.add(q.text);
      bank.push(q);
    }
    guard++;
  }
  return bank;
}

const MATH_QUESTION_BANK = buildMathQuestionBank(50);

function MathQuizGame({ onComplete }) {
  const TOTAL = 8;
  const [sessionQuestions, setSessionQuestions] = useState(() => shuffleArray(MATH_QUESTION_BANK).slice(0, TOTAL));
  const [qIndex, setQIndex] = useState(0);
  const [question, setQuestion] = useState(() => sessionQuestions[0]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(false);

  function handleAnswer(opt) {
    if (feedback) return;
    const correct = opt === question.answer;
    setFeedback(correct ? "correct" : "wrong");
    const newScore = score + (correct ? 1 : 0);
    setTimeout(() => {
      if (qIndex + 1 >= TOTAL) {
        setScore(newScore);
        setDone(true);
        onComplete(newScore);
      } else {
        setScore(newScore);
        const nextIndex = qIndex + 1;
        setQIndex(nextIndex);
        setQuestion(sessionQuestions[nextIndex]);
        setFeedback(null);
      }
    }, 600);
  }

  function reset() {
    const words = shuffleArray(MATH_QUESTION_BANK).slice(0, TOTAL);
    setSessionQuestions(words);
    setQIndex(0);
    setScore(0);
    setDone(false);
    setQuestion(words[0]);
    setFeedback(null);
  }

  if (done) {
    return (
      <div className="tanda-placeholder">
        <div className="tanda-placeholder-icon"><Trophy size={28} color="#1D4B45" /></div>
        <p className="tanda-placeholder-title">All done!</p>
        <p className="tanda-placeholder-sub">You scored {score}/{TOTAL}.</p>
        <button className="tanda-primary-btn" onClick={reset}>Play again</button>
      </div>
    );
  }

  return (
    <div>
      <div className="tanda-game-meta">
        <span>Question {qIndex + 1}/{TOTAL}</span>
        <span>Score: {score}</span>
      </div>
      <p style={{ textAlign: "center", fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: 36, margin: "24px 0" }}>{question.text}</p>
      <div className="tanda-tile-grid" style={{ padding: 0 }}>
        {question.options.map((opt, i) => (
          <button key={i} className="tanda-mathopt-btn" onClick={() => handleAnswer(opt)}>{opt}</button>
        ))}
      </div>
      {feedback && (
        <p style={{ textAlign: "center", marginTop: 14, fontWeight: 700, color: feedback === "correct" ? "var(--leaf)" : "var(--terracotta)" }}>
          {feedback === "correct" ? "Correct!" : `Answer: ${question.answer}`}
        </p>
      )}
    </div>
  );
}

function TriviaGame({ onComplete }) {
  const ROUND_SIZE = 8;
  const [sessionQuestions, setSessionQuestions] = useState(() => shuffleArray(TRIVIA_QUESTIONS).slice(0, ROUND_SIZE));
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(false);
  const q = sessionQuestions[qIndex];

  function handleAnswer(opt) {
    if (feedback) return;
    const correct = opt === q.answer;
    setFeedback(correct ? "correct:" + opt : "wrong:" + opt);
    const newScore = score + (correct ? 1 : 0);
    setTimeout(() => {
      if (qIndex + 1 >= sessionQuestions.length) {
        setScore(newScore);
        setDone(true);
        onComplete(newScore);
      } else {
        setScore(newScore);
        setQIndex((i) => i + 1);
        setFeedback(null);
      }
    }, 700);
  }

  function reset() {
    setSessionQuestions(shuffleArray(TRIVIA_QUESTIONS).slice(0, ROUND_SIZE));
    setQIndex(0);
    setScore(0);
    setDone(false);
    setFeedback(null);
  }

  if (done) {
    return (
      <div className="tanda-placeholder">
        <div className="tanda-placeholder-icon"><Trophy size={28} color="#1D4B45" /></div>
        <p className="tanda-placeholder-title">Trivia complete!</p>
        <p className="tanda-placeholder-sub">You scored {score}/{sessionQuestions.length}.</p>
        <button className="tanda-primary-btn" onClick={reset}>Play again</button>
      </div>
    );
  }

  return (
    <div>
      <div className="tanda-game-meta">
        <span>Question {qIndex + 1}/{sessionQuestions.length}</span>
        <span>Score: {score}</span>
      </div>
      <p style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 19, margin: "18px 0", textAlign: "center" }}>{q.q}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {q.options.map((opt) => {
          let stateClass = "";
          if (feedback) {
            if (opt === q.answer) stateClass = " is-correct";
            else if (feedback === "wrong:" + opt) stateClass = " is-wrong";
          }
          return (
            <button key={opt} className={`tanda-listitem tanda-triviaopt${stateClass}`} onClick={() => handleAnswer(opt)} style={{ cursor: feedback ? "default" : "pointer" }}>
              <p className="tanda-listitem-title">{opt}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- screens ---------------- */

const CHAT_SUGGESTIONS = [
  "How do I make the text bigger?",
  "How do I play a game?",
  "How do I change my password?",
  "How do I turn on Dark Mode?",
];

function getAssistantReply(message) {
  const m = message.toLowerCase();
  if (m.includes("text") || m.includes("font") || m.includes("bigger") || m.includes("small")) {
    return "You can make the text bigger anytime! Go to Settings and turn on \u201CLarger text.\u201D";
  }
  if (m.includes("dark") || m.includes("brightness") || m.includes("bright")) {
    return "Head to Settings \u2014 you'll find Dark Mode and a Brightness slider there to make the screen easier on your eyes.";
  }
  if (m.includes("password") || m.includes("login") || m.includes("log in") || m.includes("account")) {
    return "If you're having trouble logging in, ask a family member to help you reset your password from the login screen, or use the Continue as Guest option.";
  }
  if (m.includes("game") || m.includes("play") || m.includes("mahjong") || m.includes("trivia") || m.includes("puzzle")) {
    return "Tap \u201CEducational Games\u201D on the Home screen to see all the games \u2014 Trivia, Memory, Mahjong, Color Match, Number Puzzle, Word Scramble, and Math Quiz. Pick one and tap it to start playing!";
  }
  if (m.includes("tutorial") || m.includes("lesson") || m.includes("learn") || m.includes("module")) {
    return "Learning Modules has step-by-step guides for Tech, Health, Skills, and Finances. Tap any lesson to open it, and mark it complete when you're done.";
  }
  if (m.includes("language") || m.includes("tagalog") || m.includes("filipino")) {
    return "You can switch between English and Filipino using the small switch on the Home screen, or from Settings.";
  }
  if (m.includes("photo") || m.includes("picture") || m.includes("avatar")) {
    return "To change your profile picture, go to Profile and tap your photo \u2014 you can upload a new one from your device.";
  }
  if (m.includes("progress") || m.includes("score") || m.includes("streak")) {
    return "Your Progress screen shows your best scores in every game and how many lessons you've completed. Keep playing to build your streak!";
  }
  if (m.includes("thank")) {
    return "You're very welcome! I'm always here if you need anything else. \uD83D\uDE0A";
  }
  if (m.includes("hello") || m.includes("hi") || m.includes("kumusta")) {
    return "Hello! How can I help you today? You can ask me about games, lessons, settings, or your account.";
  }
  return "I'm still learning, but I'll do my best! Try asking about games, lessons, settings, or your profile \u2014 or visit Help & Support for more detailed answers.";
}

function formatResult(key, value) {
  if (value === undefined) return "Not played yet";
  if (["memory", "mahjong", "numberPuzzle"].includes(key)) return `Best: ${value} moves`;
  if (key === "trivia") return `Best score: ${value}/8`;
  if (key === "mathQuiz") return `Best score: ${value}/8`;
  if (key === "wordScramble") return `Best score: ${value}/8`;
  if (key === "colorMatch") return `Best score: ${value}/8`;
  return `${value}`;
}

function AuthScreen({ view, onSwitch, onLogin, onRegister, accounts }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  function handleRegister() {
    if (!name.trim() || !phone.trim() || !password) {
      setError("Please fill in every field.");
      return;
    }
    if (password.length < 4) {
      setError("Password should be at least 4 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (accounts[phone.trim()]) {
      setError("An account with this cellphone number already exists.");
      return;
    }
    setError("");
    onRegister({ name: name.trim(), phone: phone.trim(), password });
  }

  function handleLogin() {
    if (!phone.trim() || !password) {
      setError("Please enter your cellphone number and password.");
      return;
    }
    const account = accounts[phone.trim()];
    if (!account || account.password !== password) {
      setError("We couldn't find that account, or the password is wrong.");
      return;
    }
    setError("");
    onLogin(account);
  }

  const isRegister = view === "register";

  return (
    <div className="tanda-root">
      <style>{styles}</style>
      <div className="tanda-auth-wrap">
        <div className="tanda-auth-logo">T</div>
        <h1 className="tanda-auth-title">{isRegister ? "Create your account" : "Welcome back"}</h1>
        <p className="tanda-auth-sub">{isRegister ? "Just a few details to get started." : "Log in to keep your streak going."}</p>

        {isRegister && (
          <div className="tanda-input-group">
            <span className="tanda-input-icon"><User size={18} /></span>
            <input className="tanda-text-input tanda-input-with-icon" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        )}

        <div className="tanda-input-group">
          <span className="tanda-input-icon"><Phone size={18} /></span>
          <input className="tanda-text-input tanda-input-with-icon" placeholder="Cellphone number" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
        </div>

        <div className="tanda-input-group">
          <span className="tanda-input-icon"><Lock size={18} /></span>
          <input
            className="tanda-text-input tanda-input-with-icon"
            style={{ paddingRight: 44 }}
            placeholder="Password"
            type={showPass ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="tanda-input-eye" onClick={() => setShowPass((s) => !s)} aria-label={showPass ? "Hide password" : "Show password"} type="button">
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {isRegister && (
          <div className="tanda-input-group">
            <span className="tanda-input-icon"><Lock size={18} /></span>
            <input
              className="tanda-text-input tanda-input-with-icon"
              type={showPass ? "text" : "password"}
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
        )}

        {error && <p className="tanda-auth-error">{error}</p>}

        <button className="tanda-primary-btn" style={{ marginTop: 4 }} onClick={isRegister ? handleRegister : handleLogin}>
          {isRegister ? "Create account" : "Log in"}
        </button>

        <p className="tanda-auth-switch">
          {isRegister ? "Already have an account? " : "Don't have an account yet? "}
          <button className="tanda-auth-switch-link" onClick={() => { setError(""); onSwitch(isRegister ? "login" : "register"); }}>
            {isRegister ? "Log in" : "Register"}
          </button>
        </p>

        <div className="tanda-guest-link">
          <button onClick={() => onLogin({ name: "Lola Rosa" })}>Continue as guest</button>
        </div>
      </div>
    </div>
  );
}

export default function TandaApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authView, setAuthView] = useState("login");
  const [accounts, setAccounts] = useState({});
  const [screen, setScreen] = useState("home");
  const [userName, setUserName] = useState("Lola Rosa");
  const [userPhone, setUserPhone] = useState("");
  const [nameDraft, setNameDraft] = useState("Lola Rosa");
  const [phoneDraft, setPhoneDraft] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const [gameScores, setGameScores] = useState({});
  const [settings, setSettings] = useState({ largeText: false, sound: true, notifications: true, brightness: 100, language: "en", darkMode: false });
  const [openAccordion, setOpenAccordion] = useState(null);
  const [tutorialCategory, setTutorialCategory] = useState("All");
  const [completedTutorials, setCompletedTutorials] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [winPopup, setWinPopup] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "Hi! I'm your TANDA assistant. Ask me about games, lessons, settings, or your account." },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatTyping, setChatTyping] = useState(false);
  const t = (key) => LANG_TEXT[settings.language][key];

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hour = now.getHours();
  const greetingKey = hour < 12 ? "goodMorning" : hour < 18 ? "goodAfternoon" : "goodEvening";
  const liveTime = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const liveDate = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });

  const goHome = () => setScreen("home");
  const goGamesHub = () => setScreen("games");
  const gamesPlayed = Object.keys(gameScores).length;

  function updateScore(key, value) {
    setGameScores((prev) => {
      const isMoves = ["memory", "mahjong", "numberPuzzle"].includes(key);
      const prevVal = prev[key];
      const best = prevVal === undefined ? value : isMoves ? Math.min(prevVal, value) : Math.max(prevVal, value);
      return { ...prev, [key]: best };
    });
  }

  function handleRegister({ name, phone, password }) {
    setAccounts((prev) => ({ ...prev, [phone]: { name, phone, password, score: 0 } }));
    setUserName(name);
    setNameDraft(name);
    setUserPhone(phone);
    setPhoneDraft(phone);
    setLoggedIn(true);
    setScreen("home");
  }

  function handleLogin(account) {
    setUserName(account.name);
    setNameDraft(account.name);
    setUserPhone(account.phone || "");
    setPhoneDraft(account.phone || "");
    setLoggedIn(true);
    setScreen("home");
  }

  function triggerWinPopup() {
    setWinPopup(true);
    setTimeout(() => setWinPopup(false), 1800);
  }

  function toggleTutorialComplete(id) {
    setCompletedTutorials((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function handleAvatarUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarUrl(reader.result);
    reader.readAsDataURL(file);
  }

  function sendMessage() {
    if (!messageText.trim()) return;
    setMessageSent(true);
    setMessageText("");
    setTimeout(() => setMessageSent(false), 2500);
  }

  function sendChatMessage(text) {
    const content = (text !== undefined ? text : chatInput).trim();
    if (!content) return;
    setChatMessages((prev) => [...prev, { sender: "user", text: content }]);
    setChatInput("");
    setChatTyping(true);

    // Free, on-device assistant — no API calls, no cost. A short delay just makes
    // the reply feel considered rather than instant/robotic.
    setTimeout(() => {
      setChatMessages((prev) => [...prev, { sender: "bot", text: getAssistantReply(content) }]);
      setChatTyping(false);
    }, 500);
  }

  function handleLogout() {
    setLoggedIn(false);
    setAuthView("login");
    setScreen("home");
  }

  function saveProfile() {
    const newName = nameDraft.trim() || userName;
    setUserName(newName);
    setUserPhone(phoneDraft.trim());
    if (userPhone && accounts[userPhone]) {
      setAccounts((prev) => {
        const next = { ...prev };
        delete next[userPhone];
        next[phoneDraft.trim() || userPhone] = { ...prev[userPhone], name: newName, phone: phoneDraft.trim() || userPhone };
        return next;
      });
    }
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  }

  const userTotal =
    (gameScores.trivia || 0) * 15 +
    (gameScores.mathQuiz || 0) * 10 +
    (gameScores.colorMatch || 0) * 10 +
    (gameScores.wordScramble || 0) * 20;

  const otherAccounts = Object.values(accounts).filter((acc) => acc.phone !== userPhone);
  const leaderboardEntries = [
    { name: userName, phone: userPhone, score: userTotal, isUser: true },
    ...otherAccounts.map((acc) => ({ name: acc.name, phone: acc.phone, score: acc.score || 0, isUser: false })),
  ];
  const leaderboard = [...leaderboardEntries].sort((a, b) => b.score - a.score);

  const isGameScreen = screen.startsWith("game:");

  if (!loggedIn) {
    return <AuthScreen view={authView} onSwitch={setAuthView} onLogin={handleLogin} onRegister={handleRegister} accounts={accounts} />;
  }

  return (
    <div className="tanda-root">
      <style>{styles}</style>
      <div className={`tanda-shell${settings.darkMode ? " dark" : ""}`} style={{ zoom: settings.largeText ? 1.15 : 1, filter: `brightness(${settings.brightness}%)` }}>
        {screen === "home" && (
          <>
            <header className="tanda-header">
              <div>
                <p className="tanda-greeting-label"><Sun size={16} color="#E8A33D" />{t(greetingKey)} · {liveTime}</p>
                <h1 className="tanda-greeting-name">{userName}</h1>
                <p className="tanda-greeting-date">{liveDate}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="tanda-lang-switch" role="group" aria-label="Language">
                  <button
                    className="tanda-lang-option"
                    data-active={settings.language === "en"}
                    onClick={() => setSettings((s) => ({ ...s, language: "en" }))}
                  >
                    EN
                  </button>
                  <button
                    className="tanda-lang-option"
                    data-active={settings.language === "tl"}
                    onClick={() => setSettings((s) => ({ ...s, language: "tl" }))}
                  >
                    PH
                  </button>
                </div>
                <button className="tanda-avatar" onClick={() => setScreen("profile")} aria-label="Open profile">
                  {avatarUrl ? <img src={avatarUrl} alt="" className="tanda-photo-img" style={{ width: 52, height: 52 }} /> : initials(userName)}
                </button>
              </div>
            </header>

            <div className="tanda-streak-card">
              <div className="tanda-streak-icon"><Trophy size={22} color="#2B2320" /></div>
              <div>
                <p className="tanda-streak-text-title">7-day streak!</p>
                <p className="tanda-streak-text-sub">Tandaan: a little practice each day keeps the mind sharp.</p>
              </div>
            </div>

            <p className="tanda-section-label">{t("whatToDo")}</p>
            <div className="tanda-tile-grid">
              {TILES.map((tile) => {
                const Icon = tile.icon;
                return (
                  <button key={tile.key} className={`tanda-tile${tile.wide ? " tanda-tile-wide" : ""}`} onClick={() => setScreen(tile.key)}>
                    <div className="tanda-tile-icon" style={{ background: tile.bg }}><Icon size={22} color="#FFFFFF" /></div>
                    <div>
                      <p className="tanda-tile-title">{tile.title}</p>
                      {tile.sub && <p className="tanda-tile-sub">{tile.sub}</p>}
                    </div>
                  </button>
                );
              })}
            </div>
            <div style={{ height: 24 }} />
          </>
        )}

        {screen === "games" && (
          <>
            <div className="tanda-subheader">
              <button className="tanda-backbtn" onClick={goHome} aria-label="Back to home"><ChevronLeft size={22} color="#2B2320" /></button>
              <h2 className="tanda-subtitle">Games</h2>
            </div>
            <div className="tanda-list">
              {GAMES.map((g) => (
                <button key={g.key} className="tanda-listitem" onClick={() => setScreen(`game:${g.key}`)}>
                  <div className="tanda-listitem-dot" style={{ background: g.color }}>{initials(g.name)}</div>
                  <p className="tanda-listitem-title" style={{ flex: 1 }}>{g.name}</p>
                  {!g.available && <span className="tanda-badge">Coming soon</span>}
                </button>
              ))}
            </div>
          </>
        )}

        {isGameScreen && (() => {
          const key = screen.split(":")[1];
          const def = GAMES.find((g) => g.key === key);
          return (
            <>
              <div className="tanda-subheader">
                <button className="tanda-backbtn" onClick={goGamesHub} aria-label="Back to games"><ChevronLeft size={22} color="#2B2320" /></button>
                <h2 className="tanda-subtitle">{def.name}</h2>
              </div>
              <div style={{ padding: "8px 24px 32px 24px" }}>
                {!def.available ? (
                  <div className="tanda-placeholder">
                    <div className="tanda-placeholder-icon"><Gamepad2 size={26} color="#1D4B45" /></div>
                    <p className="tanda-placeholder-title">Coming soon</p>
                    <p className="tanda-placeholder-sub">{def.name} needs its own full set of rules and is being built next.</p>
                  </div>
                ) : key === "trivia" ? (
                  <TriviaGame onComplete={(s) => { updateScore("trivia", s); triggerWinPopup(); }} />
                ) : key === "memory" ? (
                  <TileMatchGame symbols={MEMORY_SYMBOLS} columns={4} onComplete={(m) => { updateScore("memory", m); triggerWinPopup(); }} />
                ) : key === "mahjong" ? (
                  <TileMatchGame symbols={MAHJONG_SYMBOLS} columns={4} onComplete={(m) => { updateScore("mahjong", m); triggerWinPopup(); }} />
                ) : key === "colorMatch" ? (
                  <ColorMatchGame onComplete={(s) => { updateScore("colorMatch", s); triggerWinPopup(); }} />
                ) : key === "numberPuzzle" ? (
                  <NumberPuzzleGame onComplete={(m) => { updateScore("numberPuzzle", m); triggerWinPopup(); }} />
                ) : key === "wordScramble" ? (
                  <WordScrambleGame onComplete={(s) => { updateScore("wordScramble", s); triggerWinPopup(); }} />
                ) : key === "mathQuiz" ? (
                  <MathQuizGame onComplete={(s) => { updateScore("mathQuiz", s); triggerWinPopup(); }} />
                ) : null}
              </div>
            </>
          );
        })()}

        {screen === "tutorials" && (
          <>
            <div className="tanda-subheader">
              <button className="tanda-backbtn" onClick={goHome} aria-label="Back to home"><ChevronLeft size={22} color="#2B2320" /></button>
              <h2 className="tanda-subtitle">Learning Modules</h2>
            </div>
            <div className="tanda-category-tabs">
              {TUTORIAL_CATEGORIES.map((cat) => (
                <button key={cat} className="tanda-category-tab" data-active={tutorialCategory === cat} onClick={() => setTutorialCategory(cat)}>{cat}</button>
              ))}
            </div>
            <div className="tanda-list" style={{ padding: "12px 24px 32px 24px" }}>
              {TUTORIALS.filter((tut) => tutorialCategory === "All" || tut.category === tutorialCategory).map((tut) => {
                const isDone = completedTutorials.includes(tut.id);
                return (
                  <button key={tut.id} className="tanda-listitem" onClick={() => setScreen(`lesson:${tut.id}`)}>
                    <div className="tanda-listitem-dot" style={{ background: "var(--teal)" }}><BookOpen size={18} color="#fff" /></div>
                    <div style={{ flex: 1 }}>
                      <p className="tanda-listitem-title">{tut.title}</p>
                      <p style={{ margin: 0, fontSize: 12.5, color: "var(--ink-soft)" }}>{tut.category}</p>
                    </div>
                    {isDone && <span className="tanda-tut-complete-badge">Completed</span>}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {screen.startsWith("lesson:") && (() => {
          const lessonId = Number(screen.split(":")[1]);
          const tut = TUTORIALS.find((t) => t.id === lessonId);
          const isDone = completedTutorials.includes(lessonId);
          if (!tut) return null;
          return (
            <>
              <div className="tanda-subheader">
                <button className="tanda-backbtn" onClick={() => setScreen("tutorials")} aria-label="Back to Learning Modules"><ChevronLeft size={22} color="#2B2320" /></button>
                <h2 className="tanda-subtitle">{tut.title}</h2>
              </div>
              <div style={{ padding: "8px 24px 32px 24px" }}>
                <span className="tanda-badge">{tut.category}</span>
                <ol style={{ margin: "18px 0", paddingLeft: 20, lineHeight: 1.7 }}>
                  {tut.steps.map((s, i) => <li key={i} style={{ marginBottom: 10 }}>{s}</li>)}
                </ol>
                <button className="tanda-mark-complete-btn" data-done={isDone} onClick={() => toggleTutorialComplete(lessonId)}>
                  {isDone ? "Marked as complete" : "Mark as complete"}
                </button>
              </div>
            </>
          );
        })()}

        {screen === "assistant" && (
          <>
            <div className="tanda-subheader">
              <button className="tanda-backbtn" onClick={goHome} aria-label="Back to home"><ChevronLeft size={22} color="#2B2320" /></button>
              <h2 className="tanda-subtitle">AI Assistant</h2>
            </div>
            <div className="tanda-chat-window">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`tanda-chat-bubble ${msg.sender}`}>{msg.text}</div>
              ))}
              {chatTyping && <div className="tanda-chat-bubble bot">Typing...</div>}
            </div>
            <div className="tanda-chat-suggestions">
              {CHAT_SUGGESTIONS.map((s) => (
                <button key={s} className="tanda-chat-chip" onClick={() => sendChatMessage(s)} disabled={chatTyping}>{s}</button>
              ))}
            </div>
            <div className="tanda-chat-inputrow">
              <input
                className="tanda-chat-input"
                placeholder="Type your question..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") sendChatMessage(); }}
                disabled={chatTyping}
              />
              <button className="tanda-chat-send" onClick={() => sendChatMessage()} disabled={!chatInput.trim() || chatTyping} aria-label="Send">
                <Send size={18} />
              </button>
            </div>
          </>
        )}

        {screen === "progress" && (
          <>
            <div className="tanda-subheader">
              <button className="tanda-backbtn" onClick={goHome} aria-label="Back to home"><ChevronLeft size={22} color="#2B2320" /></button>
              <h2 className="tanda-subtitle">Progress</h2>
            </div>
            <div style={{ padding: "8px 24px 32px 24px" }}>
              <p className="tanda-section-label" style={{ margin: "0 0 12px 0" }}>Tutorials</p>
              <div className="tanda-listitem" style={{ cursor: "default", marginBottom: 20 }}>
                <div className="tanda-listitem-dot" style={{ background: "var(--teal)" }}><BookOpen size={18} color="#fff" /></div>
                <div style={{ flex: 1 }}>
                  <p className="tanda-listitem-title">{completedTutorials.length} of {TUTORIALS.length} completed</p>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--ink-soft)" }}>Across Tech, Health, Skills & Finances</p>
                </div>
              </div>

              <p className="tanda-section-label" style={{ margin: "0 0 12px 0" }}>Game results</p>
              <div className="tanda-list" style={{ padding: 0 }}>
                {GAMES.filter((g) => g.available).map((g) => (
                  <div key={g.key} className="tanda-listitem" style={{ cursor: "default" }}>
                    <div className="tanda-listitem-dot" style={{ background: g.color }}>{initials(g.name)}</div>
                    <div style={{ flex: 1 }}>
                      <p className="tanda-listitem-title">{g.name}</p>
                      <p style={{ margin: 0, fontSize: 13, color: "var(--ink-soft)" }}>{formatResult(g.key, gameScores[g.key])}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {screen === "leaderboard" && (
          <>
            <div className="tanda-subheader">
              <button className="tanda-backbtn" onClick={goHome} aria-label="Back to home"><ChevronLeft size={22} color="#2B2320" /></button>
              <h2 className="tanda-subtitle">Leaderboard</h2>
            </div>
            <div className="tanda-list">
              {leaderboard.map((row, i) => (
                <div key={row.name + i} className={`tanda-listitem${row.isUser ? " tanda-listitem-you" : ""}`} style={{ cursor: "default" }}>
                  <div className="tanda-listitem-dot" style={{ background: i === 0 ? "#E8A33D" : i === 1 ? "#8A6FB3" : i === 2 ? "#D9614F" : "#6B5D52" }}>{i + 1}</div>
                  <p className="tanda-listitem-title" style={{ flex: 1 }}>{row.name}{row.isUser ? " (You)" : ""}</p>
                  <p style={{ margin: 0, fontFamily: "'Baloo 2', sans-serif", fontWeight: 700 }}>{row.score}</p>
                </div>
              ))}
              <p className="tanda-placeholder-sub" style={{ textAlign: "center", marginTop: 8 }}>Play more games to climb the leaderboard!</p>
            </div>
          </>
        )}

        {screen === "profile" && (
          <>
            <div className="tanda-subheader">
              <button className="tanda-backbtn" onClick={goHome} aria-label="Back to home"><ChevronLeft size={22} color="#2B2320" /></button>
              <h2 className="tanda-subtitle">Profile</h2>
            </div>
            <div style={{ padding: "8px 24px 32px 24px" }}>
              <div style={{ textAlign: "center", margin: "4px 0 24px 0", position: "relative", width: 88, marginLeft: "auto", marginRight: "auto" }}>
                <label className="tanda-photo-upload" style={{ position: "relative", display: "inline-block" }}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Your profile" className="tanda-photo-img" />
                  ) : (
                    <div className="tanda-avatar" style={{ width: 88, height: 88, fontSize: 32 }}>{initials(nameDraft || userName)}</div>
                  )}
                  <span className="tanda-photo-edit-badge"><User size={14} color="#fff" /></span>
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: "none" }} />
                </label>
              </div>
              <p style={{ textAlign: "center", fontSize: 12.5, color: "var(--ink-soft)", marginTop: -14, marginBottom: 20 }}>Tap your picture to change it</p>

              <label className="tanda-field-label">Your name</label>
              <input className="tanda-text-input" value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} style={{ marginBottom: 14 }} />
              <label className="tanda-field-label">Cellphone number</label>
              <input className="tanda-text-input" value={phoneDraft} onChange={(e) => setPhoneDraft(e.target.value)} inputMode="tel" />
              <button className="tanda-primary-btn" onClick={saveProfile}>Save changes</button>
              {savedFlash && <p style={{ textAlign: "center", color: "var(--leaf)", marginTop: 10, fontWeight: 700 }}>Saved!</p>}

              <p className="tanda-section-label" style={{ margin: "28px 0 12px 0" }}>Activity</p>
              <div className="tanda-listitem" style={{ cursor: "default" }}>
                <div className="tanda-listitem-dot" style={{ background: "var(--teal)" }}><Gamepad2 size={18} color="#fff" /></div>
                <p className="tanda-listitem-title">{gamesPlayed} game{gamesPlayed === 1 ? "" : "s"} played</p>
              </div>
            </div>
          </>
        )}

        {screen === "settings" && (
          <>
            <div className="tanda-subheader">
              <button className="tanda-backbtn" onClick={goHome} aria-label="Back to home"><ChevronLeft size={22} color="#2B2320" /></button>
              <h2 className="tanda-subtitle">Settings</h2>
            </div>
            <div style={{ padding: "8px 24px 32px 24px" }}>
              <Toggle checked={settings.largeText} onChange={(v) => setSettings((s) => ({ ...s, largeText: v }))} label="Larger text" />
              <Toggle checked={settings.darkMode} onChange={(v) => setSettings((s) => ({ ...s, darkMode: v }))} label="Dark mode" />
              <Toggle checked={settings.sound} onChange={(v) => setSettings((s) => ({ ...s, sound: v }))} label="Sound effects" />
              <Toggle checked={settings.notifications} onChange={(v) => setSettings((s) => ({ ...s, notifications: v }))} label="Daily reminders" />

              <div className="tanda-slider-row">
                <span className="tanda-toggle-label">Brightness: {settings.brightness}%</span>
                <input type="range" min="60" max="140" value={settings.brightness} onChange={(e) => setSettings((s) => ({ ...s, brightness: Number(e.target.value) }))} />
              </div>

              <label className="tanda-field-label">Language</label>
              <select className="tanda-select" value={settings.language} onChange={(e) => setSettings((s) => ({ ...s, language: e.target.value }))} style={{ marginBottom: 16 }}>
                <option value="en">English</option>
                <option value="tl">Filipino (Tagalog)</option>
              </select>

              <button className="tanda-primary-btn" style={{ background: "var(--terracotta)" }} onClick={handleLogout}>Log out</button>
            </div>
          </>
        )}

        {screen === "help" && (
          <>
            <div className="tanda-subheader">
              <button className="tanda-backbtn" onClick={goHome} aria-label="Back to home"><ChevronLeft size={22} color="#2B2320" /></button>
              <h2 className="tanda-subtitle">Help & Support</h2>
            </div>
            <div style={{ padding: "8px 24px 32px 24px" }}>
              {FAQS.map((f) => (
                <AccordionItem key={f.id} title={f.q} isOpen={openAccordion === `faq${f.id}`} onToggle={() => setOpenAccordion(openAccordion === `faq${f.id}` ? null : `faq${f.id}`)}>
                  {f.a}
                </AccordionItem>
              ))}

              <p className="tanda-section-label" style={{ margin: "24px 0 12px 0" }}>Send us a message</p>
              <textarea className="tanda-textarea" placeholder="Ask us a question or describe a problem..." value={messageText} onChange={(e) => setMessageText(e.target.value)} />
              <button className="tanda-primary-btn" onClick={sendMessage} disabled={!messageText.trim()}>Send message</button>
              {messageSent && <p style={{ textAlign: "center", color: "var(--leaf)", marginTop: 10, fontWeight: 700 }}>Message sent — we'll get back to you.</p>}
            </div>
          </>
        )}

        {!isGameScreen && (
          <nav className="tanda-bottomnav">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = screen === item.key || (item.key === "tutorials" && screen.startsWith("lesson:"));
              return (
                <button key={item.key} className="tanda-navbtn" data-active={active} onClick={() => setScreen(item.key)}>
                  <Icon size={22} />
                  {t(item.key)}
                </button>
              );
            })}
          </nav>
        )}

        {winPopup && (
          <div className="tanda-winmodal-backdrop" onClick={() => setWinPopup(false)}>
            <div className="tanda-winmodal">
              <div className="tanda-winmodal-icon"><Trophy size={32} color="#2B2320" /></div>
              <p className="tanda-winmodal-title">You did great!</p>
              <p className="tanda-winmodal-sub">Tandaan: keep practicing and your mind stays sharp.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
