'use client';

import { useEffect, useRef, useState } from 'react';

const VENTURES = [
  { name: 'Roborns',     color: '#5DCAA5', available: true  },
  { name: 'Franchiseen', color: '#7F77DD', available: false },
  { name: 'HubCV',       color: '#FAC775', available: false },
  { name: 'Cuestay',     color: '#85B7EB', available: false },
  { name: 'Dextrip',     color: '#F0997B', available: false },
];

const MODEL_HTML = `
<div class="fm">
  <div class="metric-grid">
    <div class="metric-card">
      <div class="metric-label">Year 5 revenue</div>
      <div class="metric-val green">₹142 Cr</div>
      <div class="metric-sub">3 streams at full scale</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Gross margin (Y5)</div>
      <div class="metric-val blue">71%</div>
      <div class="metric-sub">Near-zero cooling cost</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Capex payback</div>
      <div class="metric-val amber">4.4 yrs</div>
      <div class="metric-sub">From first compute revenue</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Seed ask</div>
      <div class="metric-val">₹18 Cr</div>
      <div class="metric-sub">~$2.1M USD</div>
    </div>
  </div>

  <div class="tab-row">
    <button class="tab active" data-tab="pnl">P&amp;L (5 year)</button>
    <button class="tab" data-tab="capex">Capex breakdown</button>
    <button class="tab" data-tab="unit">Unit economics</button>
    <button class="tab" data-tab="power">Power model</button>
    <button class="tab" data-tab="assumptions">Assumptions</button>
  </div>

  <div class="tab-panel active" id="tab-pnl">
    <div class="chart-wrap">
      <canvas id="pnlChart"></canvas>
    </div>
    <div style="display:flex;gap:16px;margin-bottom:16px;font-size:11px;flex-wrap:wrap;">
      <span style="display:flex;align-items:center;gap:4px;"><span style="width:10px;height:10px;border-radius:2px;background:#185FA5;display:inline-block;"></span>Compute colocation</span>
      <span style="display:flex;align-items:center;gap:4px;"><span style="width:10px;height:10px;border-radius:2px;background:#1D9E75;display:inline-block;"></span>Water offtake</span>
      <span style="display:flex;align-items:center;gap:4px;"><span style="width:10px;height:10px;border-radius:2px;background:#BA7517;display:inline-block;"></span>Mineral sales</span>
      <span style="display:flex;align-items:center;gap:4px;"><span style="width:10px;height:10px;border-radius:2px;background:#A32D2D;display:inline-block;"></span>Total opex</span>
    </div>
    <table>
      <thead><tr>
        <th style="width:34%">Line item</th>
        <th class="td-right">Y1</th><th class="td-right">Y2</th><th class="td-right">Y3</th><th class="td-right">Y4</th><th class="td-right">Y5</th>
      </tr></thead>
      <tbody>
        <tr><td class="td-label">Compute colocation<span class="td-note">2MW→4MW→8MW→10MW</span></td><td class="td-right">₹3.2 Cr</td><td class="td-right">₹9.6 Cr</td><td class="td-right">₹22 Cr</td><td class="td-right">₹38 Cr</td><td class="td-right">₹82 Cr</td></tr>
        <tr><td class="td-label">Water offtake<span class="td-note">50K→100K→150K L/day</span></td><td class="td-right">₹1.5 Cr</td><td class="td-right">₹3.6 Cr</td><td class="td-right">₹8.8 Cr</td><td class="td-right">₹16 Cr</td><td class="td-right">₹32 Cr</td></tr>
        <tr><td class="td-label">Mineral sales<span class="td-note">Salt, Mg, KCl, Bromine</span></td><td class="td-right">₹0.4 Cr</td><td class="td-right">₹1.2 Cr</td><td class="td-right">₹6 Cr</td><td class="td-right">₹14 Cr</td><td class="td-right">₹28 Cr</td></tr>
        <tr class="row-highlight"><td>Total revenue</td><td class="td-right td-pos">₹5.1 Cr</td><td class="td-right td-pos">₹14.4 Cr</td><td class="td-right td-pos">₹36.8 Cr</td><td class="td-right td-pos">₹68 Cr</td><td class="td-right td-pos">₹142 Cr</td></tr>
        <tr><td class="td-label">Power (grid + PPA)<span class="td-note">₹3.8/kWh blended rate</span></td><td class="td-right td-neg">₹2.7 Cr</td><td class="td-right td-neg">₹5.4 Cr</td><td class="td-right td-neg">₹9.8 Cr</td><td class="td-right td-neg">₹12 Cr</td><td class="td-right td-neg">₹15 Cr</td></tr>
        <tr><td class="td-label">Labour &amp; operations<span class="td-note">8→15→22→28 headcount</span></td><td class="td-right td-neg">₹1.2 Cr</td><td class="td-right td-neg">₹2.2 Cr</td><td class="td-right td-neg">₹3.8 Cr</td><td class="td-right td-neg">₹5.2 Cr</td><td class="td-right td-neg">₹7 Cr</td></tr>
        <tr><td class="td-label">Maintenance &amp; consumables<span class="td-note">Filters, membranes, chemicals</span></td><td class="td-right td-neg">₹0.4 Cr</td><td class="td-right td-neg">₹0.8 Cr</td><td class="td-right td-neg">₹1.6 Cr</td><td class="td-right td-neg">₹2.4 Cr</td><td class="td-right td-neg">₹3.8 Cr</td></tr>
        <tr><td class="td-label">Seawater intake &amp; pumping<span class="td-note">Low — hydrostatic assist</span></td><td class="td-right td-neg">₹0.1 Cr</td><td class="td-right td-neg">₹0.2 Cr</td><td class="td-right td-neg">₹0.3 Cr</td><td class="td-right td-neg">₹0.4 Cr</td><td class="td-right td-neg">₹0.5 Cr</td></tr>
        <tr><td class="td-label">G&amp;A, legal, insurance<span class="td-note">Patents, compliance, CRZ</span></td><td class="td-right td-neg">₹0.6 Cr</td><td class="td-right td-neg">₹0.9 Cr</td><td class="td-right td-neg">₹1.2 Cr</td><td class="td-right td-neg">₹1.5 Cr</td><td class="td-right td-neg">₹2 Cr</td></tr>
        <tr class="row-highlight"><td>Total opex</td><td class="td-right td-neg">₹5.0 Cr</td><td class="td-right td-neg">₹9.5 Cr</td><td class="td-right td-neg">₹16.7 Cr</td><td class="td-right td-neg">₹21.5 Cr</td><td class="td-right td-neg">₹28.3 Cr</td></tr>
        <tr class="row-highlight"><td>EBITDA</td><td class="td-right" style="color:#A32D2D;">₹0.1 Cr</td><td class="td-right td-pos">₹4.9 Cr</td><td class="td-right td-pos">₹20.1 Cr</td><td class="td-right td-pos">₹46.5 Cr</td><td class="td-right td-pos">₹113.7 Cr</td></tr>
        <tr><td class="td-label">EBITDA margin</td><td class="td-right">2%</td><td class="td-right">34%</td><td class="td-right" style="color:#1D9E75;font-weight:500;">55%</td><td class="td-right" style="color:#1D9E75;font-weight:500;">68%</td><td class="td-right" style="color:#1D9E75;font-weight:500;">80%</td></tr>
      </tbody>
    </table>
  </div>

  <div class="tab-panel" id="tab-capex">
    <table>
      <thead><tr><th style="width:38%">Item</th><th>Phase</th><th class="td-right">Cost (₹ Cr)</th><th>Notes</th></tr></thead>
      <tbody>
        <tr><td colspan="4" class="section-row">Building A — Compute core</td></tr>
        <tr><td class="td-label">Single-phase immersion tanks (2MW)<span class="td-note">Engineered Fluids / Submer chassis</span></td><td><span class="badge badge-blue">Seed</span></td><td class="td-right">₹3.8 Cr</td><td class="td-label" style="font-size:11px;">4 tanks × ₹95L each</td></tr>
        <tr><td class="td-label">H100/H200 server blades (leased)<span class="td-note">Co-location model — tenant owned</span></td><td><span class="badge badge-blue">Seed</span></td><td class="td-right">₹0 Cr</td><td class="td-label" style="font-size:11px;">Revenue model — not capex</td></tr>
        <tr><td class="td-label">Network, power distribution, UPS</td><td><span class="badge badge-blue">Seed</span></td><td class="td-right">₹1.2 Cr</td><td class="td-label" style="font-size:11px;">Redundant PDUs, ATS</td></tr>
        <tr><td class="td-label">Subterranean vault civil works<span class="td-note">Below sea level concrete vault</span></td><td><span class="badge badge-blue">Seed</span></td><td class="td-right">₹2.1 Cr</td><td class="td-label" style="font-size:11px;">Marine-grade construction</td></tr>
        <tr><td colspan="4" class="section-row">Thermal loop</td></tr>
        <tr><td class="td-label">Titanium plate heat exchangers<span class="td-note">Alfa Laval / API Heat Transfer</span></td><td><span class="badge badge-blue">Seed</span></td><td class="td-right">₹1.8 Cr</td><td class="td-label" style="font-size:11px;">Primary isolation boundary</td></tr>
        <tr><td class="td-label">Marine intake pipeline (HDPE 500m)<span class="td-note">Subseabed horizontal boring</span></td><td><span class="badge badge-blue">Seed</span></td><td class="td-right">₹1.4 Cr</td><td class="td-label" style="font-size:11px;">Incl. filtration vault</td></tr>
        <tr><td class="td-label">VFD pumps + automated controls</td><td><span class="badge badge-blue">Seed</span></td><td class="td-right">₹0.6 Cr</td><td class="td-label" style="font-size:11px;">Dynamic flow regulation</td></tr>
        <tr><td colspan="4" class="section-row">Building B — Desalination</td></tr>
        <tr><td class="td-label">MED vacuum distillation skid (pilot)<span class="td-note">ENCON / GEA Group unit</span></td><td><span class="badge badge-blue">Seed</span></td><td class="td-right">₹2.8 Cr</td><td class="td-label" style="font-size:11px;">50,000 L/day capacity</td></tr>
        <tr><td class="td-label">Pre-filtration + post-mineralisation<span class="td-note">UV, RO polish, Mg/Ca dosing</span></td><td><span class="badge badge-blue">Seed</span></td><td class="td-right">₹0.9 Cr</td><td class="td-label" style="font-size:11px;">Drinking water standards</td></tr>
        <tr><td class="td-label">Storage tanks + distribution pump</td><td><span class="badge badge-blue">Seed</span></td><td class="td-right">₹0.4 Cr</td><td class="td-label" style="font-size:11px;">1M litre buffer</td></tr>
        <tr><td colspan="4" class="section-row">Building C — Minerals (Series A)</td></tr>
        <tr><td class="td-label">Ion-exchange membrane system<span class="td-note">Selective Mg, K, Br extraction</span></td><td><span class="badge badge-amber">Series A</span></td><td class="td-right">₹4.2 Cr</td><td class="td-label" style="font-size:11px;">Evoqua / Lanxess IX</td></tr>
        <tr><td class="td-label">Thermal crystallization chambers</td><td><span class="badge badge-amber">Series A</span></td><td class="td-right">₹2.6 Cr</td><td class="td-label" style="font-size:11px;">NaCl + MgSO4 separation</td></tr>
        <tr><td class="td-label">ZLD secondary evaporator</td><td><span class="badge badge-amber">Series A</span></td><td class="td-right">₹1.8 Cr</td><td class="td-label" style="font-size:11px;">Zero liquid to ocean</td></tr>
        <tr><td colspan="4" class="section-row">Site &amp; support</td></tr>
        <tr><td class="td-label">Grid connection (10MW HT line)<span class="td-note">MESCOM industrial HT tariff</span></td><td><span class="badge badge-blue">Seed</span></td><td class="td-right">₹1.6 Cr</td><td class="td-label" style="font-size:11px;">Incl. transformer station</td></tr>
        <tr><td class="td-label">Rooftop solar (500 kW)<span class="td-note">Offset ~₹80L/yr power cost</span></td><td><span class="badge badge-blue">Seed</span></td><td class="td-right">₹2.5 Cr</td><td class="td-label" style="font-size:11px;">25-yr PPA available</td></tr>
        <tr><td class="td-label">Security perimeter + access control</td><td><span class="badge badge-blue">Seed</span></td><td class="td-right">₹0.5 Cr</td><td class="td-label" style="font-size:11px;"></td></tr>
        <tr><td class="td-label">Working capital + 12m opex reserve</td><td><span class="badge badge-blue">Seed</span></td><td class="td-right">₹2.5 Cr</td><td class="td-label" style="font-size:11px;">Salaries, legal, permits</td></tr>
        <tr class="row-highlight"><td>Seed round total (Buildings A+B)</td><td></td><td class="td-right td-pos">₹18.1 Cr</td><td class="td-label" style="font-size:11px;">~$2.1M USD</td></tr>
        <tr class="row-highlight"><td>Series A (Building C + scale)</td><td></td><td class="td-right" style="color:#BA7517;font-weight:500;">₹65–80 Cr</td><td class="td-label" style="font-size:11px;">Post pilot validation</td></tr>
      </tbody>
    </table>
  </div>

  <div class="tab-panel" id="tab-unit">
    <table>
      <thead><tr><th style="width:34%">Metric</th><th class="td-right">Value</th><th>Basis</th></tr></thead>
      <tbody>
        <tr><td colspan="3" class="section-row">Compute stream</td></tr>
        <tr><td class="td-label">Colocation rate</td><td class="td-right">₹18,000/kW/mo</td><td class="td-label" style="font-size:11px;">ESG premium vs market ₹12–14K. Justified by PUE &lt;1.03</td></tr>
        <tr><td class="td-label">Deployed power (Y1)</td><td class="td-right">2 MW</td><td class="td-label" style="font-size:11px;">Pilot rack row, 80% occupancy</td></tr>
        <tr><td class="td-label">Revenue per MW/year</td><td class="td-right td-pos">₹17.3 Cr</td><td class="td-label" style="font-size:11px;">₹18K × 1000 kW × 12 mo × 80%</td></tr>
        <tr><td class="td-label">Power cost per MW/year</td><td class="td-right td-neg">₹3.3 Cr</td><td class="td-label" style="font-size:11px;">₹3.8/kWh × 8760 hrs blended</td></tr>
        <tr><td class="td-label">Gross margin per MW</td><td class="td-right" style="color:#1D9E75;font-weight:500;">81%</td><td class="td-label" style="font-size:11px;">Power is only direct COGS at this PUE</td></tr>
        <tr><td colspan="3" class="section-row">Water stream</td></tr>
        <tr><td class="td-label">Water output (Y1 pilot)</td><td class="td-right">50,000 L/day</td><td class="td-label" style="font-size:11px;">Based on 2MW × 55°C heat, MED efficiency 8–10 L/kWh thermal</td></tr>
        <tr><td class="td-label">Selling price — municipal</td><td class="td-right">₹6/litre</td><td class="td-label" style="font-size:11px;">KUWSDB bulk rate benchmark</td></tr>
        <tr><td class="td-label">Selling price — commercial/bottled</td><td class="td-right">₹12/litre</td><td class="td-label" style="font-size:11px;">Packaged water market rate</td></tr>
        <tr><td class="td-label">Blended realisation</td><td class="td-right">₹8/litre</td><td class="td-label" style="font-size:11px;">70% municipal, 30% commercial mix</td></tr>
        <tr><td class="td-label">Annual revenue (Y1)</td><td class="td-right td-pos">₹1.46 Cr</td><td class="td-label" style="font-size:11px;">50K L × 365 × ₹8</td></tr>
        <tr><td class="td-label">Cost of production per litre</td><td class="td-right td-neg">₹0.8</td><td class="td-label" style="font-size:11px;">Heat is free. Only pumping + filtration consumables</td></tr>
        <tr><td class="td-label">Gross margin on water</td><td class="td-right" style="color:#1D9E75;font-weight:500;">90%</td><td class="td-label" style="font-size:11px;">Near-zero production cost is the thesis</td></tr>
        <tr><td colspan="3" class="section-row">Mineral stream (Y3 onwards)</td></tr>
        <tr><td class="td-label">Industrial salt yield</td><td class="td-right">8 tonnes/day</td><td class="td-label" style="font-size:11px;">From 150K L/day brine at 35% concentration factor</td></tr>
        <tr><td class="td-label">Salt price (industrial)</td><td class="td-right">₹4,500/tonne</td><td class="td-label" style="font-size:11px;">Indian commodity price</td></tr>
        <tr><td class="td-label">Salt revenue/year</td><td class="td-right td-pos">₹1.3 Cr</td><td class="td-label" style="font-size:11px;"></td></tr>
        <tr><td class="td-label">Mg(OH)₂ yield</td><td class="td-right">1.2 tonnes/day</td><td class="td-label" style="font-size:11px;">1,350 ppm × 150K L × concentration</td></tr>
        <tr><td class="td-label">Mg(OH)₂ price</td><td class="td-right">₹42,000/tonne</td><td class="td-label" style="font-size:11px;">Technical grade import parity</td></tr>
        <tr><td class="td-label">Mg revenue/year</td><td class="td-right td-pos">₹1.8 Cr</td><td class="td-label" style="font-size:11px;"></td></tr>
        <tr><td class="td-label">Bromine yield</td><td class="td-right">~120 kg/day</td><td class="td-label" style="font-size:11px;">65 ppm × 150K L × 80% recovery</td></tr>
        <tr><td class="td-label">Bromine price</td><td class="td-right">₹220/kg</td><td class="td-label" style="font-size:11px;">Indian import parity rate</td></tr>
        <tr><td class="td-label">Bromine revenue/year</td><td class="td-right td-pos">₹0.96 Cr</td><td class="td-label" style="font-size:11px;"></td></tr>
        <tr class="row-highlight"><td>Total mineral revenue (Y3)</td><td class="td-right td-pos">~₹6 Cr/yr</td><td class="td-label" style="font-size:11px;">Salt + Mg + Bromine + KCl combined</td></tr>
      </tbody>
    </table>
  </div>

  <div class="tab-panel" id="tab-power">
    <div class="power-grid">
      <div class="power-card">
        <h4>Power draw breakdown (10MW full scale)</h4>
        <div class="power-row"><span class="pl">AI compute servers</span><span class="pv">8.5 MW</span></div>
        <div class="power-row"><span class="pl">Vacuum distillation auxiliaries</span><span class="pv">0.5 MW</span></div>
        <div class="power-row"><span class="pl">Mineral processing (Building C)</span><span class="pv">0.3 MW</span></div>
        <div class="power-row"><span class="pl">Seawater pumping (VFD)</span><span class="pv">0.2 MW</span></div>
        <div class="power-row"><span class="pl">Lighting, HVAC offices, security</span><span class="pv">0.2 MW</span></div>
        <div class="power-row"><span class="pl" style="font-weight:500;">Total draw</span><span class="pv" style="color:#185FA5;">9.7 MW</span></div>
        <div class="power-row"><span class="pl">vs. conventional DC (same compute)</span><span class="pv" style="color:#A32D2D;">14–16 MW</span></div>
        <div class="power-row"><span class="pl">Cooling overhead</span><span class="pv" style="color:#1D9E75;">&lt;3% (not ~40%)</span></div>
      </div>
      <div class="power-card">
        <h4>Power sourcing strategy</h4>
        <div class="power-row"><span class="pl">MESCOM HT grid (base)</span><span class="pv">7.2 MW</span></div>
        <div class="power-row"><span class="pl">Rooftop solar (on-site)</span><span class="pv">0.5 MW</span></div>
        <div class="power-row"><span class="pl">Karnataka wind PPA</span><span class="pv">2.0 MW</span></div>
        <div class="power-row"><span class="pl">Total supply</span><span class="pv" style="color:#1D9E75;">9.7 MW</span></div>
        <div class="power-row"><span class="pl">Blended tariff (grid + PPA)</span><span class="pv">₹3.8/kWh</span></div>
        <div class="power-row"><span class="pl">Annual power cost (10MW)</span><span class="pv" style="color:#A32D2D;">₹15 Cr</span></div>
        <div class="power-row"><span class="pl">Annual power cost (2MW pilot)</span><span class="pv" style="color:#A32D2D;">₹2.7 Cr</span></div>
        <div class="power-row"><span class="pl">Renewable fraction</span><span class="pv" style="color:#1D9E75;">26% (Y1) → 45% (Y3)</span></div>
      </div>
    </div>
    <div style="margin-top:16px;padding:14px 16px;background:var(--card-bg);border:1px solid var(--card-border);font-size:12px;color:var(--muted);line-height:1.7;">
      <strong style="color:var(--off-white);font-size:12px;">Why 10MW is not a problem.</strong> MESCOM already serves MRPL refinery and New Mangaluru Port at 100MW+ scale. A 7.2MW HT industrial connection is a standard application — not a heroic ask. The wind PPA can be structured with a developer like Greenko or ReNew Power with zero upfront cost (₹2.8–3.2/kWh contracted rate). Solar capex of ₹2.5 Cr is included in seed round and generates ₹80L/yr in avoided power cost, paying back in ~3 years.
    </div>
  </div>

  <div class="tab-panel" id="tab-assumptions">
    <div class="assumption-grid">
      <div class="assumption-card">
        <h5>Compute assumptions</h5>
        <div class="arow"><span class="ak">Colocation rate</span><span class="av">₹18K/kW/mo</span></div>
        <div class="arow"><span class="ak">Occupancy Y1</span><span class="av">80%</span></div>
        <div class="arow"><span class="ak">Occupancy Y3+</span><span class="av">92%</span></div>
        <div class="arow"><span class="ak">PUE</span><span class="av">&lt;1.03</span></div>
        <div class="arow"><span class="ak">Rack density</span><span class="av">40–80 kW/rack</span></div>
        <div class="arow"><span class="ak">Scale Y1→Y5</span><span class="av">2→4→8→10→10 MW</span></div>
      </div>
      <div class="assumption-card">
        <h5>Water assumptions</h5>
        <div class="arow"><span class="ak">MED efficiency</span><span class="av">8–10 L/kWh thermal</span></div>
        <div class="arow"><span class="ak">Heat available (2MW)</span><span class="av">~1.6 MW thermal</span></div>
        <div class="arow"><span class="ak">Y1 output</span><span class="av">50,000 L/day</span></div>
        <div class="arow"><span class="ak">Y3 output</span><span class="av">150,000 L/day</span></div>
        <div class="arow"><span class="ak">Municipal price</span><span class="av">₹6/L</span></div>
        <div class="arow"><span class="ak">Commercial price</span><span class="av">₹12/L</span></div>
      </div>
      <div class="assumption-card">
        <h5>Mineral assumptions</h5>
        <div class="arow"><span class="ak">Concentration factor</span><span class="av">35× (ZLD)</span></div>
        <div class="arow"><span class="ak">NaCl recovery</span><span class="av">92%</span></div>
        <div class="arow"><span class="ak">Mg(OH)₂ recovery</span><span class="av">78%</span></div>
        <div class="arow"><span class="ak">Bromine recovery</span><span class="av">80%</span></div>
        <div class="arow"><span class="ak">Building C start</span><span class="av">Y3 (Series A)</span></div>
        <div class="arow"><span class="ak">Lithium</span><span class="av">Y5+ (DLE tech)</span></div>
      </div>
      <div class="assumption-card">
        <h5>Power assumptions</h5>
        <div class="arow"><span class="ak">MESCOM HT tariff</span><span class="av">₹5.8/kWh</span></div>
        <div class="arow"><span class="ak">Wind PPA rate</span><span class="av">₹3.0/kWh</span></div>
        <div class="arow"><span class="ak">Solar (on-site)</span><span class="av">₹1.8/kWh</span></div>
        <div class="arow"><span class="ak">Blended rate</span><span class="av">₹3.8/kWh</span></div>
        <div class="arow"><span class="ak">Cooling overhead</span><span class="av">&lt;3% of draw</span></div>
        <div class="arow"><span class="ak">Server uptime</span><span class="av">99.5% SLA</span></div>
      </div>
      <div class="assumption-card">
        <h5>Macroeconomic</h5>
        <div class="arow"><span class="ak">INR/USD</span><span class="av">84.5</span></div>
        <div class="arow"><span class="ak">Revenue CAGR</span><span class="av">128% (Y1–Y3)</span></div>
        <div class="arow"><span class="ak">Inflation (opex)</span><span class="av">6% p.a.</span></div>
        <div class="arow"><span class="ak">Tax regime</span><span class="av">25% corp. tax</span></div>
        <div class="arow"><span class="ak">Depreciation</span><span class="av">15% WDV</span></div>
        <div class="arow"><span class="ak">Discount rate (WACC)</span><span class="av">14%</span></div>
      </div>
      <div class="assumption-card">
        <h5>Return scenario</h5>
        <div class="arow"><span class="ak">Seed valuation</span><span class="av">₹60 Cr pre</span></div>
        <div class="arow"><span class="ak">Series A valuation</span><span class="av">₹300–400 Cr</span></div>
        <div class="arow"><span class="ak">Exit scenario</span><span class="av">Infra REIT / M&A</span></div>
        <div class="arow"><span class="ak">Exit multiple (Y5)</span><span class="av">10–12× EBITDA</span></div>
        <div class="arow"><span class="ak">Implied exit value</span><span class="av">₹1,100–1,400 Cr</span></div>
        <div class="arow"><span class="ak">Seed investor return</span><span class="av">18–23× on entry</span></div>
      </div>
    </div>
  </div>
</div>
`;

const MODEL_CSS = `
  .fin-model {
    --fm-text: #f5f3ee;
    --fm-muted: #7a7870;
    --fm-faint: #4a4846;
    --fm-bg: #0a0a08;
    --fm-card: #111110;
    --fm-border: #252522;
    --fm-border-light: #1e1e1b;
    --fm-blue: #185FA5;
    --fm-green: #1D9E75;
    --fm-amber: #BA7517;
    --fm-red: #A32D2D;
    --fm-info-bg: rgba(24,95,165,0.12);
    --fm-info-text: #4a9ee8;
    --fm-info-border: rgba(24,95,165,0.35);
    font-family: 'DM Mono', monospace;
    color: var(--fm-text);
  }
  .fin-model .fm { width:100%; padding:0; }
  .fin-model .metric-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:var(--fm-border); border:1px solid var(--fm-border); margin-bottom:24px; }
  .fin-model .metric-card { background:var(--fm-card); padding:16px; }
  .fin-model .metric-label { font-size:11px; color:var(--fm-muted); margin-bottom:6px; letter-spacing:0.06em; }
  .fin-model .metric-val { font-size:22px; font-weight:700; color:var(--fm-text); line-height:1; letter-spacing:-0.02em; }
  .fin-model .metric-val.green { color:var(--fm-green); }
  .fin-model .metric-val.blue  { color:var(--fm-info-text); }
  .fin-model .metric-val.amber { color:#FAC775; }
  .fin-model .metric-sub { font-size:11px; color:var(--fm-faint); margin-top:4px; }
  .fin-model .tab-row { display:flex; gap:4px; margin-bottom:20px; flex-wrap:wrap; }
  .fin-model .tab { padding:6px 14px; border:1px solid var(--fm-border); font-size:12px; cursor:pointer; background:transparent; color:var(--fm-muted); transition:all 0.15s; font-family:'DM Mono',monospace; letter-spacing:0.06em; }
  .fin-model .tab:hover { color:var(--fm-text); border-color:var(--fm-muted); }
  .fin-model .tab.active { background:var(--fm-info-bg); color:var(--fm-info-text); border-color:var(--fm-info-border); }
  .fin-model .tab-panel { display:none; }
  .fin-model .tab-panel.active { display:block; }
  .fin-model table { width:100%; border-collapse:collapse; font-size:12px; table-layout:fixed; }
  .fin-model th { text-align:left; padding:8px 10px; font-size:10px; font-weight:500; letter-spacing:1.5px; text-transform:uppercase; color:var(--fm-muted); border-bottom:1px solid var(--fm-border); }
  .fin-model td { padding:9px 10px; border-bottom:1px solid var(--fm-border-light); color:var(--fm-text); vertical-align:middle; font-size:12px; }
  .fin-model tr:last-child td { border-bottom:none; }
  .fin-model .td-label { color:var(--fm-muted); }
  .fin-model .td-note { font-size:10px; color:var(--fm-faint); display:block; margin-top:2px; }
  .fin-model .td-pos  { color:var(--fm-green); font-weight:500; }
  .fin-model .td-neg  { color:var(--fm-red); }
  .fin-model .td-right { text-align:right; }
  .fin-model .td-total { font-weight:500; background:var(--fm-card); }
  .fin-model .row-highlight td { background:rgba(255,255,255,0.03); font-weight:500; }
  .fin-model .section-row { font-size:10px; letter-spacing:1.5px; text-transform:uppercase; color:var(--fm-muted); padding:12px 10px 6px; font-weight:500; }
  .fin-model .badge { display:inline-block; font-size:10px; padding:2px 8px; font-family:'DM Mono',monospace; letter-spacing:0.06em; }
  .fin-model .badge-blue  { background:rgba(24,95,165,0.15); color:var(--fm-info-text); border:1px solid var(--fm-info-border); }
  .fin-model .badge-amber { background:rgba(186,117,23,0.15); color:#FAC775; border:1px solid rgba(186,117,23,0.3); }
  .fin-model .chart-wrap { position:relative; width:100%; height:260px; margin:0 0 16px; }
  .fin-model .power-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; }
  .fin-model .power-card { background:var(--fm-card); border:1px solid var(--fm-border); padding:16px 20px; }
  .fin-model .power-card h4 { font-size:11px; font-weight:500; color:var(--fm-muted); letter-spacing:1px; text-transform:uppercase; margin-bottom:12px; }
  .fin-model .power-row { display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px solid var(--fm-border-light); font-size:12px; }
  .fin-model .power-row:last-child { border-bottom:none; }
  .fin-model .pl { color:var(--fm-muted); }
  .fin-model .pv { font-weight:500; color:var(--fm-text); }
  .fin-model .assumption-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
  .fin-model .assumption-card { background:var(--fm-card); border:1px solid var(--fm-border); padding:14px; }
  .fin-model .assumption-card h5 { font-size:10px; font-weight:500; letter-spacing:1.5px; text-transform:uppercase; color:var(--fm-muted); margin-bottom:10px; }
  .fin-model .arow { display:flex; justify-content:space-between; font-size:11px; padding:3px 0; border-bottom:1px solid var(--fm-border-light); }
  .fin-model .arow:last-child { border-bottom:none; }
  .fin-model .ak { color:var(--fm-muted); }
  .fin-model .av { color:var(--fm-text); font-weight:500; }
`;

export default function FinancialModelPage() {
  const [activeVenture, setActiveVenture] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = MODEL_HTML;

    // Wire up tab switching
    const tabs   = ref.current.querySelectorAll<HTMLElement>('.tab');
    const panels = ref.current.querySelectorAll<HTMLElement>('.tab-panel');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const id = tab.getAttribute('data-tab');
        panels.forEach(p => p.classList.remove('active'));
        tabs.forEach(t => t.classList.remove('active'));
        ref.current?.querySelector(`#tab-${id}`)?.classList.add('active');
        tab.classList.add('active');
      });
    });

    // Initialize chart
    import('chart.js/auto').then(mod => {
      const Chart = mod.default;
      const canvas = ref.current?.querySelector('#pnlChart') as HTMLCanvasElement;
      if (!canvas) return;
      if (chartRef.current) { chartRef.current.destroy(); }
      chartRef.current = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
          datasets: [
            { label: 'Compute', data: [3.2, 9.6, 22, 38, 82],   backgroundColor: '#185FA5', stack: 'rev' },
            { label: 'Water',   data: [1.5, 3.6, 8.8, 16, 32],  backgroundColor: '#1D9E75', stack: 'rev' },
            { label: 'Minerals',data: [0.4, 1.2, 6,   14, 28],  backgroundColor: '#BA7517', stack: 'rev' },
            { label: 'Opex', data: [5.0, 9.5, 16.7, 21.5, 28.3],
              backgroundColor: 'rgba(163,45,45,0.2)', borderColor: '#A32D2D',
              borderWidth: 1.5, type: 'line' as any, stack: undefined, fill: false,
              pointRadius: 4, pointBackgroundColor: '#A32D2D' },
          ],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { stacked: true, grid: { display: false }, ticks: { color: '#7a7870', font: { size: 11 } } },
            y: { stacked: true, grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: { color: '#7a7870', font: { size: 11 },
                callback: (v: any) => '₹' + v + 'Cr' } },
          },
        },
      });
    });

    return () => { chartRef.current?.destroy(); };
  }, [activeVenture]);

  return (
    <div>
      <style>{MODEL_CSS}</style>

      <h1 className="page-title">Financial Model</h1>
      <p className="page-sub">5-year financial model, capex breakdown, unit economics, power model, and assumptions per venture.</p>

      {/* Venture selector */}
      <div style={{ display: 'flex', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '2rem' }}>
        {VENTURES.map((v, i) => (
          <button key={v.name} onClick={() => v.available && setActiveVenture(i)}
            style={{
              flex: 1, padding: '0.8rem 0.5rem',
              background: activeVenture === i ? v.color : 'var(--card-bg)',
              border: 'none', cursor: v.available ? 'pointer' : 'default',
              fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.06em',
              color: activeVenture === i ? 'var(--black)' : v.available ? 'var(--muted)' : 'var(--card-border)',
              fontWeight: activeVenture === i ? 700 : 400, transition: 'all 0.15s',
            }}>
            {v.name}{!v.available ? ' —' : ''}
          </button>
        ))}
      </div>

      {/* Model content */}
      <div ref={ref} className="fin-model" />
    </div>
  );
}
