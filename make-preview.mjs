// Generates preview.png — the Open Graph image shown when the portfolio link is
// shared on LinkedIn, WhatsApp, Slack etc.
//
// Run: node make-preview.mjs
// Uses @napi-rs/canvas from the sibling project's node_modules to avoid an
// install here (this repo is deliberately dependency-free).

import { createCanvas } from '../scirio-ai-portfolio/node_modules/@napi-rs/canvas/index.js'
import { writeFileSync } from 'node:fs'

const W = 1200, H = 630
const canvas = createCanvas(W, H)
const c = canvas.getContext('2d')

const BG = '#0a0f1e', ACCENT = '#6366f1', ACCENT2 = '#8b5cf6'
const TEXT = '#f1f5f9', MUTED = '#94a3b8'
const FONT = 'Segoe UI, Arial, sans-serif'

// ── Background ────────────────────────────────────────────────────────────────
c.fillStyle = BG
c.fillRect(0, 0, W, H)

// Soft accent glow, top-left — mirrors the site's hero treatment
const glow = c.createRadialGradient(180, 90, 0, 180, 90, 620)
glow.addColorStop(0, 'rgba(99,102,241,0.22)')
glow.addColorStop(1, 'rgba(99,102,241,0)')
c.fillStyle = glow
c.fillRect(0, 0, W, H)

const glow2 = c.createRadialGradient(1060, 560, 0, 1060, 560, 520)
glow2.addColorStop(0, 'rgba(139,92,246,0.16)')
glow2.addColorStop(1, 'rgba(139,92,246,0)')
c.fillStyle = glow2
c.fillRect(0, 0, W, H)

// Top accent rule
const rule = c.createLinearGradient(0, 0, W, 0)
rule.addColorStop(0, ACCENT)
rule.addColorStop(1, ACCENT2)
c.fillStyle = rule
c.fillRect(0, 0, W, 6)

const L = 84 // left margin

// ── Availability badge ────────────────────────────────────────────────────────
c.font = `600 20px ${FONT}`
const badge = 'PRODUCT ANALYST & DEVELOPER'
const bw = c.measureText(badge).width + 40
c.fillStyle = 'rgba(99,102,241,0.14)'
c.beginPath()
c.roundRect(L, 96, bw, 44, 22)
c.fill()
c.strokeStyle = 'rgba(99,102,241,0.35)'
c.lineWidth = 1.5
c.stroke()
c.fillStyle = '#a5b4fc'
c.fillText(badge, L + 20, 125)

// ── Name ──────────────────────────────────────────────────────────────────────
const nameGrad = c.createLinearGradient(L, 0, L + 620, 0)
nameGrad.addColorStop(0, TEXT)
nameGrad.addColorStop(1, '#a5b4fc')
c.fillStyle = nameGrad
c.font = `700 88px ${FONT}`
c.fillText('Kartheek Goli', L, 236)

// ── Positioning line ──────────────────────────────────────────────────────────
c.fillStyle = MUTED
c.font = `400 30px ${FONT}`
c.fillText('I find the bottleneck — then I build the thing that fixes it.', L, 290)

// ── Divider ───────────────────────────────────────────────────────────────────
c.fillStyle = 'rgba(255,255,255,0.08)'
c.fillRect(L, 336, W - L * 2, 1)

// ── Project cards ─────────────────────────────────────────────────────────────
// Emoji are not in the available fonts (they render as tofu boxes), so each
// card gets a drawn accent bar instead.
const cards = [
  { tint: ACCENT,  title: 'Sales Analytics & CRM', sub: '8-stage pipeline · live KPIs · channel ROI' },
  { tint: ACCENT2, title: 'AI Content Intelligence', sub: 'Client Brain · learns from every approval' },
]

let x = L
for (const card of cards) {
  const cw = 480, ch = 128, y = 376
  c.fillStyle = 'rgba(255,255,255,0.035)'
  c.beginPath()
  c.roundRect(x, y, cw, ch, 18)
  c.fill()
  c.strokeStyle = 'rgba(255,255,255,0.08)'
  c.lineWidth = 1
  c.stroke()

  // Accent bar down the left edge of the card
  c.fillStyle = card.tint
  c.beginPath()
  c.roundRect(x + 26, y + 30, 5, ch - 60, 3)
  c.fill()

  c.fillStyle = TEXT
  c.font = `600 27px ${FONT}`
  c.fillText(card.title, x + 52, y + 54)

  c.fillStyle = MUTED
  c.font = `400 19px ${FONT}`
  c.fillText(card.sub, x + 52, y + 88)

  x += cw + 32
}

// ── Footer ────────────────────────────────────────────────────────────────────
c.fillStyle = '#818cf8'
c.font = `600 24px ${FONT}`
c.fillText('kartheek-goli-portfolio.vercel.app', L, 576)

c.fillStyle = MUTED
c.font = `400 21px ${FONT}`
const live = 'Both platforms live — no signup'
c.fillText(live, W - L - c.measureText(live).width, 576)

writeFileSync(new URL('./preview.png', import.meta.url), canvas.toBuffer('image/png'))
console.log(`preview.png written — ${W}x${H}`)
