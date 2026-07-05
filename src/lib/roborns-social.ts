// ─── ROBORNS — SOCIAL MEDIA CONTENT PLAYBOOK ─────────────────────────────
// Accounts: @roborns on X, LinkedIn, Instagram
// Created: 2026-06-16
// Strategy: B2B infrastructure fundraising → tech credibility + investor visibility

export interface SocialPost {
  platform: 'twitter' | 'linkedin' | 'instagram';
  id: string;         // e.g. TW-001, LI-001, IG-001
  draft: boolean;     // true = needs review before posting
  posted: boolean;
  scheduledDate?: string;
  content: string;
  media?: string[];   // image/video file references
  hashtags: string[];
  targetAudience: string;
  purpose: string;    // e.g. 'tech-cred', 'investor-outreach', 'partnership', 'brand'
}

// ─── CONTENT PILLARS ──────────────────────────────────────────────────
// 1. TECH CRED — Desalination, ZLD, MED, brine concentration
// 2. INFRA MODEL — Infrastructure Developer Model, fundraising
// 3. GEOGRAPHY — India (Kapu/Udupi), KSA (Jubail/Ras Al Khair)
// 4. INDUSTRY — Water scarcity, green hydrogen, industrial decarbonization
// 5. BEHIND THE SCENES — Site scouting, pilot progress, partnerships

// ─── BRAND VOICE ──────────────────────────────────────────────────────
// Tone: Technical but accessible. Confident, not boastful.
// Show, don't tell — use data, diagrams, real sites.
// No exaggerated claims (our cost advantage is ~1.8×, not 10× or 15×).
// India & KSA are separate workstreams — don't conflate.

// ─── TARGET AUDIENCES ─────────────────────────────────────────────────
// 1. Investors: Infrastructure funds, climate tech VCs, family offices
// 2. Partners: Desal/ZLD technology companies (Wabag, IDE, Aquatech, etc.)
// 3. Government: KSA Ministry of Investment, ACWA Power, PIF
// 4. Industry: Water/energy professionals, engineers, researchers
// 5. Talent: Engineers interested in cleantech/desalination

// ═══════════════════════════════════════════════════════════════════════
// LAUNCH BATCH — Week 1 Posts
// ═══════════════════════════════════════════════════════════════════════

export const WEEK1_POSTS: SocialPost[] = [

  // ── X / TWITTER ─────────────────────────────────────────────────────

  {
    platform: 'twitter',
    id: 'TW-001',
    draft: true,
    posted: false,
    content: `We're building small modular desalination + ZLD plants that turn brine from waste into resources.

Kapu, India: 2MW pilot
Jubail, KSA: next

Infrastructure Developer Model — built like infrastructure, not like a startup.

@roborns`,
    hashtags: ['#Desalination', '#ZeroLiquidDischarge', '#CleanTech', '#Infrastructure'],
    targetAudience: 'Investors, Partners',
    purpose: 'launch-announce'
  },

  {
    platform: 'twitter',
    id: 'TW-002',
    draft: true,
    posted: false,
    content: `Concentrated brine is one of the hardest problems in desalination.

Most plants just dump it back into the ocean.

We're building MED crystallizers that turn it into salt, minerals, and clean water — zero liquid discharge, zero waste.

Thread on how it works 🧵`,
    hashtags: ['#Desalination', '#ZeroLiquidDischarge', '#WaterTech', '#Brine'],
    targetAudience: 'Industry, Partners',
    purpose: 'tech-cred'
  },

  {
    platform: 'twitter',
    id: 'TW-003',
    draft: true,
    posted: false,
    content: `India: 19 acres, 65MW planned across 3 sites near Udupi.
KSA: Strategic expansion via Ras Al Khair / Jubail industrial belt.

Same tech stack. Different markets. Both water-stressed.

Our model: 6% dev fee, 25% sponsor equity, 1.5% mgmt fee.

Infrastructure economics, not VC.`,
    hashtags: ['#Desalination', '#GreenHydrogen', '#KSA', '#India', '#Infrastructure'],
    targetAudience: 'Investors, Government',
    purpose: 'investor-outreach'
  },

  // ── LINKEDIN ────────────────────────────────────────────────────────

  {
    platform: 'linkedin',
    id: 'LI-001',
    draft: true,
    posted: false,
    content: `Introducing Roborns — building the next generation of small modular desalination and zero liquid discharge plants.

The problem: 60% of India's districts face severe water stress, and industrial desalination produces concentrated brine that's difficult to manage. Most plants discharge it back into the ocean, creating environmental problems.

Our solution: MED-based crystallizer technology that concentrates brine into recoverable minerals and clean water. Starting with a 2MW demonstration pilot at Kapu, Karnataka.

Why this matters: We're not building a startup — we're building infrastructure. Our model is the Infrastructure Developer Model: 6% development fee, 25% sponsor equity, 1.5% management fee on revenue. The same economics that built large-scale power plants and toll roads, applied to water infrastructure.

3 sites secured near Udupi (19 acres, 65MW planned). KSA expansion targeting Jubail and Ras Al Khair industrial zones.

Looking for strategic partners in desalination technology, MED, and brine crystallization.

More at roborns.com`,
    hashtags: ['#Desalination', '#ZeroLiquidDischarge', '#CleanTech', '#Infrastructure', '#WaterScarcity'],
    targetAudience: 'Investors, Partners, Industry',
    purpose: 'launch-announce'
  },

  {
    platform: 'linkedin',
    id: 'LI-002',
    draft: true,
    posted: false,
    content: `Why we chose the Infrastructure Developer Model over traditional venture capital for water infrastructure.

Most climate tech startups raise VC, burn cash on growth, and chase an exit. That model works for software. It doesn't work for physical infrastructure that takes years to build and decades to operate.

The Infrastructure Developer Model:
• 6% development fee on capital raised — aligned with closing deals, not burning cash
• 25% sponsor equity — we keep a meaningful stake in what we build
• 1.5% annual management fee — recurring revenue tied to operational performance

This is the same structure used by independent power producers (IPPs), toll road developers, and large-scale desal projects globally.

For Roborns, this means:
• Phase 1 (₹42 Cr / ~$5M) triggers the 2MW Kapu pilot
• Full buildout at ₹420 Cr across 3 sites
• Real cash flows from day one of operations, not promises

Water infrastructure needs patient capital and developer discipline. That's what we bring.`,
    hashtags: ['#InfrastructureInvestment', '#ClimateTech', '#Desalination', '#ProjectFinance'],
    targetAudience: 'Investors, Fund Managers',
    purpose: 'investor-outreach'
  },

  {
    platform: 'linkedin',
    id: 'LI-003',
    draft: true,
    posted: false,
    content: `The KSA opportunity in desalination and green hydrogen.

Saudi Arabia produces 27% of the world's desalinated water. Every drop comes with a brine discharge problem — and an opportunity.

With NEOM, the PIF green hydrogen fund, and Vision 2030 industrial expansion, KSA is investing billions into water infrastructure. But brine management remains an unsolved bottleneck.

Roborns is targeting the Jubail-Ras Al Khair industrial corridor for our KSA pilot. Why there:
• Already home to the world's largest desalination plants
• Industrial demand for process water + ZLD compliance
• Proximity to green hydrogen projects needing ultrapure water
• Royal Commission industrial land incentives

Partnering with the right local partners to navigate the ecosystem. If you're working in KSA water or energy infrastructure, let's connect.`,
    hashtags: ['#KSA', '#SaudiVision2030', '#GreenHydrogen', '#Desalination', '#WaterSecurity'],
    targetAudience: 'KSA Government, Partners, Investors',
    purpose: 'ksa-strategy'
  },

  // ── INSTAGRAM ──────────────────────────────────────────────────────

  {
    platform: 'instagram',
    id: 'IG-001',
    draft: true,
    posted: false,
    content: `Introducing Roborns 🌊

Building small modular desalination + ZLD plants that turn brine into resources.

📍 Kapu, Karnataka — 2MW pilot planned
📍 Jubail, KSA — next expansion

Infrastructure Developer Model. Real assets. Real impact.

#Desalination #ZeroLiquidDischarge #CleanTech #WaterSecurity #Roborns`,
    media: [],
    hashtags: ['#Desalination', '#ZeroLiquidDischarge', '#CleanTech', '#WaterSecurity', '#Roborns'],
    targetAudience: 'Brand awareness',
    purpose: 'launch-announce'
  },

  {
    platform: 'instagram',
    id: 'IG-002',
    draft: true,
    posted: false,
    content: `The Brine Problem 🧂

Every desalination plant produces concentrated brine — saltier than seawater. Most just pump it back into the ocean.

Our MED crystallization tech turns that brine into clean water + recoverable minerals.

No discharge. Zero waste. Just smarter desalination. ♻️

#WaterTech #Desalination #Sustainability #BrineToValue`,
    media: [],
    hashtags: ['#WaterTech', '#Desalination', '#Sustainability', '#BrineToValue'],
    targetAudience: 'Industry, Brand',
    purpose: 'tech-cred'
  },

  {
    platform: 'instagram',
    id: 'IG-003',
    draft: true,
    posted: false,
    content: `3 sites. 19 acres. 65MW planned.

Our Udupi cluster in Karnataka — Kapu, Hejamadi — from 2MW to 40MW as we scale.

Building water infrastructure, one plant at a time. 🏗️

#Infrastructure #CleanWater #Desalination #India #GreenTech`,
    media: [],
    hashtags: ['#Infrastructure', '#CleanWater', '#Desalination', '#India'],
    targetAudience: 'Brand, Investors',
    purpose: 'brand'
  }

];

// ═══════════════════════════════════════════════════════════════════════
// X AUTH SETUP INSTRUCTIONS (run these commands yourself on your machine)
// ═══════════════════════════════════════════════════════════════════════
//
// 1. Create an app at https://developer.x.com/en/portal/dashboard
//    - App type: "Web app, automated app or bot"
//    - Redirect URI: http://localhost:8080/callback
//
// 2. Register the app: (replace CLIENT_ID and CLIENT_SECRET first)
//    xurl auth apps add roborns --client-id YOUR_CLIENT_ID --client-secret YOUR_CLIENT_SECRET
//
// 3. Authenticate: (opens browser for OAuth)
//    xurl auth oauth2 --app roborns
//
// 4. Set as default:
//    xurl auth default roborns
//
// 5. Verify:
//    xurl auth status
//    xurl whoami
//
// After that, I can post automatically from here.

