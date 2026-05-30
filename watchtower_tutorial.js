// ── WatchTower Tutorial & Help Mode ─────────────────────────────────────────
// External file: watchtower_tutorial.js
// Loaded by index_new.html — shares global scope with main app.
// Two modes:
//   startTutorial() — spotlight guided tour, 12 steps, sequential
//   startHelp()     — hotspot bubbles, non-linear, always-on until dismissed
// ─────────────────────────────────────────────────────────────────────────────

// ── STEP DEFINITIONS ─────────────────────────────────────────────────────────
// Each step:
//   id         unique string
//   title      heading shown in tooltip/help card
//   body       explanation HTML (keep concise)
//   target     CSS selector for spotlight / hotspot anchor (null = centred modal)
//   position   tooltip placement: top | bottom | left | right | center
//   panel      'settings' | 'right' | null — auto-open this panel before showing
//   action     object describing an interaction step (optional):
//                { type: 'click', selector, label }   — wait for user to click element
//                { type: 'next' }                     — standard Next button only
//   mapReset   true = zoom to full Australia before this step

var TOUR_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to WatchTower',
    body: 'WatchTower gives BAI Network Operations a live picture of broadcast site risk across Australia \u2014 combining 341 site locations with real-time fire danger ratings, BOM weather warnings, and active emergency incidents.<br><br>This guided tour will walk you through everything. Use <strong>Next</strong> to advance or <strong>Skip step</strong> to skip any action step.',
    target: null,
    position: 'center',
    panel: null,
    action: { type: 'next' },
    mapReset: true
  },
  {
    id: 'header-stats',
    title: 'Header Stats',
    body: 'The four counters at the top give you an instant operational picture:<br><br><strong>Sites</strong> \u2014 total BAI broadcast sites loaded<br><strong>Warnings</strong> \u2014 active BOM weather warnings nationally<br><strong>Incidents</strong> \u2014 active fire/flood/storm incidents (filtered by your alert level setting)<br><strong>At Risk</strong> \u2014 sites currently flagged by the risk engine',
    target: '.header-right',
    position: 'bottom',
    panel: null,
    action: { type: 'next' },
    mapReset: false
  },
  {
    id: 'sites-layer',
    title: 'Your Broadcast Sites',
    body: 'Each dot on the map is a BAI broadcast site. Colours indicate modulation type:<br><br><span style="color:#f0a500">\u25cf</span> AM &nbsp; <span style="color:#00d4aa">\u25cf</span> FM &nbsp; <span style="color:#9775fa">\u25cf</span> DAB+ &nbsp; <span style="color:#4dabf7">\u25cf</span> DTV<br><br>Click any site dot to see full service details.<br><br><strong>Try it:</strong> click the <strong>\u2630</strong> hamburger icon (spotlighted above) to open the Site Filters panel.',
    target: 'header > div:first-child',
    position: 'bottom',
    panel: null,
    action: { type: 'click', selector: '#btn-hamburger', label: 'Click the \u2630 hamburger to open Site Filters' },
    mapReset: true
  },
  {
    id: 'filter-search',
    title: 'Site Filters \u2014 Search',
    body: 'The Site Filters panel lets you narrow down which sites appear on the map.<br><br><strong>Site count</strong> at the top shows how many sites match your current filters.<br><br><strong>Search</strong> by site name or town to quickly locate a specific transmitter.<br><br><strong>Service Name</strong> dropdown lets you filter to a specific service like ABC Local Radio or Triple J.',
    target: '#filter-sidebar',
    position: 'right',
    panel: null,
    action: { type: 'next' },
    mapReset: false,
    keepFilterSidebar: true
  },
  {
    id: 'filter-chips',
    title: 'Site Filters \u2014 Filter Chips',
    body: 'Click any chip to filter the map to that group. Chips combine with AND logic \u2014 selecting <strong>ABC</strong> and <strong>NSW</strong> shows only ABC sites in NSW.<br><br><strong>Broadcaster</strong> \u2014 filter by network (ABC, SBS, commercial, community)<br><strong>State</strong> \u2014 limit to one or more states<br><strong>Modulation</strong> \u2014 AM, FM, DAB+ or DTV only<br><strong>Service Purpose</strong> \u2014 national, commercial, community, retransmission<br><br>Click <strong>Clear</strong> to reset all filters.',
    target: '#filter-sidebar',
    position: 'right',
    panel: null,
    action: { type: 'next' },
    mapReset: false,
    keepFilterSidebar: true
  },
  {
    id: 'fdr-layer',
    title: 'Fire Danger Ratings',
    body: 'The Fire Danger layer overlays BOM district FDR polygons across the map. Colours match BOM\'s own scale:<br><br><span style="color:#4caf50">\u25a0</span> Moderate &nbsp; <span style="color:#ff6b00">\u25a0</span> High &nbsp; <span style="color:#e53935">\u25a0</span> Extreme &nbsp; <span style="color:#7b1fa2">\u25a0</span> Catastrophic<br><br><strong>Try it:</strong> click the <strong>Fire Danger</strong> button (spotlighted above) to toggle the layer on.',
    target: '#map-controls',
    position: 'bottom',
    panel: null,
    action: { type: 'click', selector: '#btn-fdr', label: 'Click \u201cFire Danger\u201d in the toolbar' },
    mapReset: false
  },
  {
    id: 'fdr-result',
    title: 'Fire Danger Ratings',
    body: 'The FDR polygons are now visible on the map. Each coloured region represents a BOM fire danger district with its current rating for today\'s forecast period.<br><br>Sites inside high-risk districts are automatically flagged by the risk engine. You can adjust the minimum FDR level that triggers risk scoring in the Settings panel.',
    target: '#map-wrap',
    position: 'center',
    panel: null,
    action: { type: 'next' },
    mapReset: false
  },
  {
    id: 'bom-warnings',
    title: 'BOM Warnings',
    body: 'The <strong>Live Weather &amp; Hazards</strong> panel on the right shows active BOM warnings fetched directly from BOM\'s FTP feed \u2014 severe weather, fire weather, cyclones, floods and more.<br><br>Warnings are also drawn as district overlays on the map when the <strong>BOM Warnings</strong> layer is active. Click any warning in the panel to fly to its location.',
    target: '#sec-warnings',
    position: 'left',
    panel: 'right',
    action: { type: 'next' },
    mapReset: false
  },
  {
    id: 'incidents',
    title: 'Active Incidents',
    body: 'The <strong>Incidents</strong> section lists active fire, flood, and storm incidents sourced from all state emergency agencies \u2014 RFS, EMV, QFD, CFS, DFES, TasALERT, PFES and ESA.<br><br>Use the state tabs to filter by jurisdiction. Click any incident to fly the map to its location.',
    target: '#sec-incidents',
    position: 'left',
    panel: 'right',
    action: { type: 'next' },
    mapReset: false
  },
  {
    id: 'risk-engine',
    title: 'The Risk Engine',
    body: 'WatchTower automatically scores every site against active hazards and assigns one of four risk tiers:<br><br><span style="color:#f0a500">\u25cf</span> <strong>Advisory</strong> \u2014 hazard in the region, monitor<br><span style="color:#ff8800">\u25cf</span> <strong>Warning</strong> \u2014 hazard within proximity threshold<br><span style="color:#ff4444">\u25cf</span> <strong>Direct Threat</strong> \u2014 hazard directly affecting site area<br><span style="color:#ff0000">\u25cf</span> <strong>Site Impacted</strong> \u2014 site inside active incident zone<br><br><strong>Try it:</strong> click the <strong>Risk</strong> button in the header to open the risk breakdown panel.',
    target: '#btn-risk-panel',
    position: 'bottom',
    panel: null,
    action: { type: 'click', selector: '#btn-risk-panel', label: 'Click \u201cRisk\u201d to open the risk panel' },
    mapReset: false
  },
  {
    id: 'risk-panel',
    title: 'Risk Breakdown Panel',
    body: 'The Risk panel shows every site currently flagged, grouped by risk tier.<br><br>Each entry shows the site name, state, modulation type, and the reason it was flagged \u2014 which incident or FDR district triggered the score.<br><br>Click any site in the list to fly the map to its location. The <strong>At Risk</strong> counter in the header reflects the total number of flagged sites.',
    target: '#risk-panel',
    position: 'left',
    panel: null,
    action: { type: 'next' },
    mapReset: false,
    closeRiskPanel: false
  },
  {
    id: 'map-layers',
    title: 'Map Layers &amp; Controls',
    body: 'The toolbar along the top of the map controls every overlay layer:<br><br><strong>Borders / Labels</strong> \u2014 state outlines and names<br><strong>Sites</strong> \u2014 broadcast site dots<br><strong>Fire Danger</strong> \u2014 BOM FDR polygons<br><strong>BOM Warnings</strong> \u2014 warning district overlays<br><strong>Marine Warnings</strong> \u2014 coastal and marine alerts<br><strong>NSW Alerts</strong> \u2014 RFS alert zones<br><strong>Incidents</strong> \u2014 incident markers<br><strong>Radar / BOM Radar</strong> \u2014 live rainfall radar<br><strong>Lightning / Wind / Ducting</strong> \u2014 specialist overlays',
    target: '#map-controls',
    position: 'bottom',
    panel: null,
    action: { type: 'next' },
    mapReset: false
  },
  {
    id: 'settings-open',
    title: 'Settings Panel',
    body: 'The Settings panel lets you tune WatchTower for your current shift and operating conditions.<br><br><strong>Try it:</strong> click the <strong>\u2699</strong> cog button to open the Settings panel.',
    target: '#settings-toggle',
    position: 'right',
    panel: null,
    action: { type: 'click', selector: '#settings-toggle', label: 'Click the \u2699 cog to open Settings' },
    mapReset: false
  },
  {
    id: 'settings-presets',
    title: 'Operational Presets',
    body: '<strong>Winter</strong> and <strong>Summer</strong> presets reconfigure WatchTower for the season in one click:<br><br>\u2744 <strong>Winter</strong> \u2014 broader proximity distances, Extreme FDR threshold, 48h incident window<br>\u2600 <strong>Summer</strong> \u2014 tighter distances, Very High FDR threshold, 24h window, higher alert floor<br><br>If you adjust any individual setting the preset label changes to <em>Custom</em>. <strong>Restore defaults</strong> resets to Winter.',
    target: '.sp-preset-bar',
    position: 'right',
    panel: 'settings',
    action: { type: 'next' },
    mapReset: false
  },
  {
    id: 'settings-display',
    title: 'Display &amp; Theme',
    body: 'The <strong>Display</strong> section controls how WatchTower looks:<br><br><strong>Theme</strong> \u2014 choose Dark for the NOC wall, Natural for a neutral daytime look, or Light for bright environments<br><strong>Site labels</strong> \u2014 toggle site name tags on the map<br><strong>Active states</strong> \u2014 limit which states are shown in the incidents panel and risk scoring',
    target: '#sp-body-display',
    position: 'right',
    panel: 'settings',
    action: { type: 'next' },
    mapReset: false
  },
  {
    id: 'settings-incidents',
    title: 'Incident Filters',
    body: 'The <strong>Incidents</strong> section controls what appears in the incidents panel:<br><br><strong>Minimum alert level</strong> \u2014 All, Advice, Watch &amp; Act, or Emergency Warning only<br><strong>Max incident age</strong> \u2014 filter out older incidents (24h / 48h)<br><br>These filters also affect the <strong>Incidents</strong> counter in the header and the per-state counts in the feed status list.',
    target: '#sp-body-incidents',
    position: 'right',
    panel: 'settings',
    action: { type: 'next' },
    mapReset: false
  },
  {
    id: 'settings-risk',
    title: 'Risk Thresholds',
    body: 'The <strong>Risk Thresholds</strong> section lets you tune how sensitive the risk engine is:<br><br><strong>FDR layer</strong> \u2014 toggle FDR as a risk factor on/off<br><strong>Minimum FDR level</strong> \u2014 set the lowest rating that triggers risk scoring<br><strong>Watch &amp; Act / EW distance</strong> \u2014 how close an incident must be to flag a site<br><strong>Advice distance</strong> \u2014 proximity cap for lower-level incidents<br><strong>Risk popup trigger</strong> \u2014 which tier triggers the alert popup',
    target: '#sp-body-risk',
    position: 'right',
    panel: 'settings',
    action: { type: 'next' },
    mapReset: false
  },
  {
    id: 'refresh',
    title: 'Refresh Cycle',
    body: 'WatchTower automatically refreshes all live data every <strong>5 minutes</strong> \u2014 FDR ratings, BOM warnings, incidents, and radar frames all update in sync.<br><br>The <strong>Refresh</strong> button in the header triggers an immediate refresh at any time. It\'s safe to leave WatchTower running on the NOC wall \u2014 it will stay current without any interaction.',
    target: '#refresh-btn',
    position: 'bottom',
    panel: null,
    action: { type: 'next' },
    mapReset: false
  },
  {
    id: 'help-mode',
    title: 'Help Mode',
    body: 'You don\'t need to run the full tour again just to look something up.<br><br>The <strong>?</strong> button (next to the hamburger icon) activates <strong>Help Mode</strong> \u2014 numbered hotspot bubbles appear on every key element. Click any bubble to read about that feature without leaving the map.<br><br>Click <strong>?</strong> again to dismiss all bubbles.',
    target: '#btn-help',
    position: 'right',
    panel: null,
    action: { type: 'next' },
    mapReset: false
  },
  {
    id: 'easter-egg',
    title: 'One Last Thing\u2026',
    body: '<div style="text-align:center;padding:8px 0"><div style="font-size:32px;margin-bottom:12px">\ud83d\udd73\ufe0f</div><strong>A challenge for you.</strong><br><br>John G has hidden something somewhere on this page.<br><br>Keep your eyes open \u2014 it\'s subtle.<br><br><span style="font-size:10px;color:var(--text3)">No hints. Good luck.</span></div>',
    target: null,
    position: 'center',
    panel: null,
    action: { type: 'next' },
    mapReset: false
  }
];

// ── HELP MODE HOTSPOT POSITIONS ───────────────────────────────────────────────
// Maps step id to a CSS selector — these are the anchor elements for bubbles.
// Steps with target:null get skipped in help mode (welcome/easter-egg are tour-only).
var HELP_ANCHORS = {
  'header-stats':      '.header-right',
  'sites-layer':       '#btn-sites',
  'filter-search':     '#fs-search',
  'filter-chips':      '#chip-state',
  'fdr-layer':         '#btn-fdr',
  'fdr-result':        '#btn-fdr',
  'bom-warnings':      '#sec-warnings',
  'incidents':         '#sec-incidents',
  'risk-engine':       '#btn-risk-panel',
  'risk-panel':        '#btn-risk-panel',
  'map-layers':        '#map-controls',
  'settings-open':     '#settings-toggle',
  'settings-presets':  '.sp-preset-bar',
  'settings-display':  '#sp-body-display',
  'settings-incidents':'#sp-body-incidents',
  'settings-risk':     '#sp-body-risk',
  'refresh':           '#refresh-btn',
  'help-mode':         '#btn-help'
};

// ── STATE ─────────────────────────────────────────────────────────────────────
var tourActive    = false;
var tourStep      = 0;
var helpActive    = false;
var tourCardEl    = null;
var helpBubbles   = [];

// ── CSS INJECTION ─────────────────────────────────────────────────────────────
(function injectTourCSS(){
  var style = document.createElement('style');
  style.textContent = [
    // ── Overlay — four panels surround the spotlight, leaving target clickable ──
    '.tour-shade{',
      'position:fixed;z-index:9000;background:rgba(0,0,0,0.72);',
      'transition:all .35s cubic-bezier(.4,0,.2,1);pointer-events:all;',
    '}',
    '#tour-shade-top   {top:0;left:0;right:0;}',
    '#tour-shade-bottom{left:0;right:0;bottom:0;}',
    '#tour-shade-left  {left:0;}',
    '#tour-shade-right {right:0;}',

    // ── Tour card ─────────────────────────────────────────────────────────────
    '#tour-card{',
      'position:fixed;z-index:9100;',
      'background:var(--panel);border:1px solid var(--border);',
      'border-radius:8px;padding:18px 20px 14px;',
      'max-width:320px;min-width:240px;',
      'box-shadow:0 8px 32px rgba(0,0,0,0.5);',
      'font-family:monospace;',
      'animation:tour-card-in .25s ease;',
    '}',
    '@keyframes tour-card-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}',

    '#tour-card .tc-step{',
      'font-size:8px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;',
      'color:var(--accent2);margin-bottom:6px;',
    '}',
    '#tour-card .tc-title{',
      'font-size:13px;font-weight:700;color:var(--text);margin-bottom:10px;line-height:1.3;',
    '}',
    '#tour-card .tc-body{',
      'font-size:11px;color:var(--text2);line-height:1.6;margin-bottom:14px;',
    '}',
    '#tour-card .tc-action{',
      'font-size:10px;color:var(--accent);background:rgba(240,165,0,0.1);',
      'border:1px dashed var(--accent);border-radius:4px;',
      'padding:6px 10px;margin-bottom:12px;',
    '}',
    '#tour-card .tc-footer{',
      'display:flex;align-items:center;justify-content:space-between;',
      'border-top:1px solid var(--border);padding-top:10px;gap:8px;',
    '}',
    '#tour-card .tc-dots{display:flex;gap:4px;align-items:center;}',
    '#tour-card .tc-dot{',
      'width:6px;height:6px;border-radius:50%;background:var(--border);transition:background .2s;',
    '}',
    '#tour-card .tc-dot.active{background:var(--accent2);}',
    '#tour-card .tc-dot.done{background:var(--accent2);opacity:0.4;}',
    '#tour-card .tc-btn{',
      'font-family:monospace;font-size:10px;padding:5px 12px;border-radius:4px;',
      'cursor:pointer;border:1px solid var(--border);background:var(--panel2);',
      'color:var(--text2);transition:all .15s;white-space:nowrap;',
    '}',
    '#tour-card .tc-btn:hover{border-color:var(--text2);color:var(--text);}',
    '#tour-card .tc-btn.primary{',
      'background:var(--accent2);border-color:var(--accent2);color:#000;font-weight:700;',
    '}',
    '#tour-card .tc-btn.primary:hover{opacity:0.88;}',
    '#tour-card .tc-btn.skip{color:var(--text3);border-color:transparent;background:transparent;}',
    '#tour-card .tc-btn.skip:hover{color:var(--text2);border-color:var(--border);}',

    // ── Waiting-for-action pulse on target ───────────────────────────────────
    '.tour-action-target{',
      'animation:tour-pulse 1.4s ease-in-out infinite;',
    '}',
    '@keyframes tour-pulse{',
      '0%,100%{box-shadow:0 0 0 0 rgba(0,212,170,0.6);}',
      '50%{box-shadow:0 0 0 8px rgba(0,212,170,0);}',
    '}',

    // ── Help mode bubbles ─────────────────────────────────────────────────────
    '.help-bubble{',
      'position:fixed;z-index:9500;',
      'width:20px;height:20px;border-radius:50%;',
      'background:var(--accent2);color:#000;',
      'font-family:monospace;font-size:10px;font-weight:700;',
      'display:flex;align-items:center;justify-content:center;',
      'cursor:pointer;border:2px solid rgba(0,0,0,0.3);',
      'box-shadow:0 2px 8px rgba(0,0,0,0.4);',
      'animation:help-pulse 2s ease-in-out infinite;',
      'transition:transform .15s;',
    '}',
    '.help-bubble:hover{transform:scale(1.2);}',
    '@keyframes help-pulse{',
      '0%,100%{box-shadow:0 0 0 0 rgba(0,212,170,0.5),0 2px 8px rgba(0,0,0,0.4);}',
      '60%{box-shadow:0 0 0 7px rgba(0,212,170,0),0 2px 8px rgba(0,0,0,0.4);}',
    '}',

    '.help-card{',
      'position:fixed;z-index:9600;',
      'background:var(--panel);border:1px solid var(--accent2);',
      'border-radius:7px;padding:12px 14px;max-width:260px;',
      'box-shadow:0 6px 24px rgba(0,0,0,0.45);',
      'font-family:monospace;',
      'animation:tour-card-in .2s ease;',
    '}',
    '.help-card .hc-title{',
      'font-size:11px;font-weight:700;color:var(--text);margin-bottom:6px;',
    '}',
    '.help-card .hc-body{',
      'font-size:10px;color:var(--text2);line-height:1.6;',
    '}',
    '.help-card .hc-close{',
      'position:absolute;top:7px;right:9px;',
      'font-size:14px;color:var(--text3);cursor:pointer;line-height:1;',
      'background:none;border:none;padding:0;',
    '}',
    '.help-card .hc-close:hover{color:var(--text);}',

    // ── Help button active state ───────────────────────────────────────────────
    '#btn-help.help-on{',
      'background:var(--accent2);border-color:var(--accent2);color:#000;font-weight:700;',
    '}'
  ].join('');
  document.head.appendChild(style);
})();

// ── UTILITY ───────────────────────────────────────────────────────────────────
function tourGetRect(selector){
  if(!selector) return null;
  var el = document.querySelector(selector);
  if(!el) return null;
  return el.getBoundingClientRect();
}

function tourEnsurePanel(step, callback){
  var panelKey = step.panel;
  var settingsPanel = document.getElementById('settings-panel');
  var settingsOpen  = settingsPanel && settingsPanel.classList.contains('open');
  var filterSidebar = document.getElementById('filter-sidebar');
  var filterOpen    = filterSidebar && !filterSidebar.classList.contains('collapsed');
  var weatherPanel  = document.getElementById('weather-panel');
  var weatherOpen   = weatherPanel  && !weatherPanel.classList.contains('collapsed');
  var riskPanel     = document.getElementById('risk-panel');
  var riskOpen      = riskPanel && riskPanel.style.display !== 'none' && riskPanel.style.display !== '';
  var delay = 0;

  // Close risk panel unless we're on the risk-panel step
  if(riskOpen && step.id !== 'risk-panel'){
    toggleRiskPanel();
    delay = Math.max(delay, 280);
  }

  // Filter sidebar — close unless this step keeps it open
  if(filterOpen && !step.keepFilterSidebar && !step.openFilterSidebar){
    toggleFilterSidebar();
    delay = Math.max(delay, 280);
  }
  if(step.openFilterSidebar && !filterOpen){
    toggleFilterSidebar();
    delay = Math.max(delay, 320);
  }

  // Weather panel — open if this step needs right panel content
  if(panelKey === 'right' && !weatherOpen){
    toggleWeatherPanel();
    delay = Math.max(delay, 320);
  }

  // Settings panel
  if(panelKey === 'settings'){
    if(!settingsOpen){
      toggleSettingsPanel();
      delay = Math.max(delay, 320);
    }
  } else {
    if(settingsOpen){
      toggleSettingsPanel();
      delay = Math.max(delay, 320);
    }
  }

  setTimeout(callback, delay);
}

function tourMapReset(){
  if(typeof map !== 'undefined' && map){
    map.setView([-27.5, 133.5], 5, { animate: true, duration: 0.8 });
  }
}

// ── SHADE POSITIONING ─────────────────────────────────────────────────────────
function tourPositionSpotlight(selector){
  var top    = document.getElementById('tour-shade-top');
  var bottom = document.getElementById('tour-shade-bottom');
  var left   = document.getElementById('tour-shade-left');
  var right  = document.getElementById('tour-shade-right');
  if(!top) return;

  if(!selector){
    // centred modal — full dark overlay, no cutout
    top.style.height    = '100vh';
    bottom.style.height = '0px';
    left.style.width    = '0px';  left.style.top = '0px'; left.style.height = '0px';
    right.style.width   = '0px'; right.style.top = '0px'; right.style.height = '0px';
    return;
  }

  var rect = tourGetRect(selector);
  if(!rect){
    top.style.height = '100vh';
    bottom.style.height = '0px';
    left.style.width = '0px'; right.style.width = '0px';
    return;
  }

  var pad = 8;
  var sTop    = Math.max(0, rect.top    - pad);
  var sLeft   = Math.max(0, rect.left   - pad);
  var sRight  = Math.max(0, window.innerWidth  - rect.right  - pad);
  var sBottom = Math.max(0, window.innerHeight - rect.bottom - pad);
  var sHeight = rect.height + pad * 2;

  top.style.height    = sTop + 'px';
  bottom.style.height = sBottom + 'px';
  left.style.top      = sTop + 'px';
  left.style.height   = sHeight + 'px';
  left.style.width    = sLeft + 'px';
  right.style.top     = sTop + 'px';
  right.style.height  = sHeight + 'px';
  right.style.width   = sRight + 'px';
}

// ── CARD POSITIONING ──────────────────────────────────────────────────────────
function tourPositionCard(selector, position){
  var card = document.getElementById('tour-card');
  if(!card) return;
  var vw = window.innerWidth, vh = window.innerHeight;

  if(!selector || position === 'center'){
    card.style.top  = '50%';
    card.style.left = '50%';
    card.style.transform = 'translate(-50%,-50%)';
    card.style.maxWidth = '380px';
    return;
  }
  card.style.transform = '';
  card.style.maxWidth = '320px';

  var rect = tourGetRect(selector);
  if(!rect){
    card.style.top = '50%'; card.style.left = '50%';
    card.style.transform = 'translate(-50%,-50%)';
    return;
  }

  var pad = 16, cw = 330, ch = card.offsetHeight || 200;
  var t, l;

  if(position === 'bottom'){
    t = rect.bottom + pad;
    l = rect.left + rect.width/2 - cw/2;
  } else if(position === 'top'){
    t = rect.top - ch - pad;
    l = rect.left + rect.width/2 - cw/2;
  } else if(position === 'right'){
    t = rect.top + rect.height/2 - ch/2;
    l = rect.right + pad;
  } else if(position === 'left'){
    t = rect.top + rect.height/2 - ch/2;
    l = rect.left - cw - pad;
  }

  // Clamp to viewport
  l = Math.max(12, Math.min(l, vw - cw - 12));
  t = Math.max(12, Math.min(t, vh - ch - 12));

  card.style.top  = t + 'px';
  card.style.left = l + 'px';
}

// ── BUILD CARD HTML ───────────────────────────────────────────────────────────
function tourBuildCard(step, idx, total){
  var isAction = step.action && step.action.type === 'click';
  var isLast   = idx === total - 1;
  var isFirst  = idx === 0;

  // Progress dots (max 12 shown)
  var dots = '';
  for(var i=0; i<total; i++){
    var cls = i === idx ? 'active' : (i < idx ? 'done' : '');
    dots += '<div class="tc-dot ' + cls + '"></div>';
  }

  var actionHtml = isAction
    ? '<div class="tc-action">\u27a4 ' + step.action.label + '</div>'
    : '';

  var nextLabel = isLast ? 'Finish \u2713' : 'Next \u2192';
  var nextBtn   = isAction
    ? '<button class="tc-btn primary" id="tour-skip-step-btn">Skip step \u21e5</button>'
    : '<button class="tc-btn primary" id="tour-next-btn">' + nextLabel + '</button>';

  var backBtn = !isFirst
    ? '<button class="tc-btn" id="tour-back-btn">\u2190 Back</button>'
    : '';

  return [
    '<div class="tc-step">Step ' + (idx+1) + ' of ' + total + ' &nbsp;<span id="tour-exit-lnk" style="color:var(--text3);cursor:pointer;text-transform:none;letter-spacing:0;font-weight:400">\u2715 exit</span></div>',
    '<div class="tc-title">' + step.title + '</div>',
    '<div class="tc-body">' + step.body + '</div>',
    actionHtml,
    '<div class="tc-footer">',
      '<div class="tc-dots">' + dots + '</div>',
      '<div style="display:flex;gap:6px;align-items:center;">',
        backBtn,
        nextBtn,
      '</div>',
    '</div>'
  ].join('');
}

// ── ACTION LISTENER ───────────────────────────────────────────────────────────
var _tourActionHandler = null;

function tourWatchAction(step){
  if(!step.action || step.action.type !== 'click') return;
  var targetSel = step.action.selector;
  var el = document.querySelector(targetSel);
  if(!el) return;

  el.classList.add('tour-action-target');

  function handler(){
    el.classList.remove('tour-action-target');
    el.removeEventListener('click', handler);
    _tourActionHandler = null;
    // Small delay so the click's visual effect plays first
    setTimeout(function(){ tourAdvance(1); }, 350);
  }
  el.addEventListener('click', handler);
  _tourActionHandler = { el: el, fn: handler };
}

function tourClearActionListener(){
  if(_tourActionHandler){
    _tourActionHandler.el.classList.remove('tour-action-target');
    _tourActionHandler.el.removeEventListener('click', _tourActionHandler.fn);
    _tourActionHandler = null;
  }
}

// ── RENDER STEP ───────────────────────────────────────────────────────────────
function tourRenderStep(idx){
  var step  = TOUR_STEPS[idx];
  var total = TOUR_STEPS.length;
  var card  = document.getElementById('tour-card');
  if(!card) return;

  if(step.mapReset) tourMapReset();

  tourEnsurePanel(step, function(){
    // Re-query after panel animation
    setTimeout(function(){
      tourPositionSpotlight(step.target);
      card.innerHTML = tourBuildCard(step, idx, total);
      tourPositionCard(step.target, step.position);

      // Wire buttons
      var nextBtn     = document.getElementById('tour-next-btn');
      var skipStepBtn = document.getElementById('tour-skip-step-btn');
      var backBtn     = document.getElementById('tour-back-btn');
      var exitLnk     = document.getElementById('tour-exit-lnk');
      if(nextBtn)     nextBtn.addEventListener('click', function(){ tourAdvance(1); });
      if(skipStepBtn) skipStepBtn.addEventListener('click', function(){ tourClearActionListener(); tourAdvance(1); });
      if(backBtn)     backBtn.addEventListener('click', function(){ tourAdvance(-1); });
      if(exitLnk)     exitLnk.addEventListener('click', endTutorial);

      // Wire action listener
      tourWatchAction(step);
    }, step.panel ? 320 : 0);
  });
}

function tourAdvance(dir){
  tourClearActionListener();
  var next = tourStep + dir;
  if(next >= TOUR_STEPS.length){
    endTutorial(true);
    return;
  }
  if(next < 0) next = 0;
  tourStep = next;
  // Re-animate card
  var card = document.getElementById('tour-card');
  if(card){ card.style.animation = 'none'; void card.offsetWidth; card.style.animation = ''; }
  tourRenderStep(tourStep);
}

// ── START / END TUTORIAL ──────────────────────────────────────────────────────
function startTutorial(){
  if(tourActive) return;
  tourActive = true;
  tourStep   = 0;

  // Close settings panel if open so we control it
  var panel = document.getElementById('settings-panel');
  if(panel && panel.classList.contains('open')) toggleSettingsPanel();

  // Build four shade panels
  ['top','bottom','left','right'].forEach(function(side){
    var el = document.createElement('div');
    el.id = 'tour-shade-' + side;
    el.className = 'tour-shade';
    document.body.appendChild(el);
  });

  // Build card
  var card = document.createElement('div');
  card.id = 'tour-card';
  document.body.appendChild(card);
  tourCardEl = card;

  // Update tutorial button state
  var tBtn = document.getElementById('btn-tutorial');
  if(tBtn){ tBtn.textContent = '\u2715 Exit Tour'; tBtn.onclick = endTutorial; }

  tourRenderStep(0);
}

function endTutorial(completed){
  if(!tourActive) return;
  tourActive = false;
  tourClearActionListener();

  ['top','bottom','left','right'].forEach(function(side){
    var el = document.getElementById('tour-shade-' + side);
    if(el) el.remove();
  });
  if(tourCardEl){ tourCardEl.remove(); tourCardEl = null; }

  // Restore tutorial button
  var tBtn = document.getElementById('btn-tutorial');
  if(tBtn){ tBtn.innerHTML = '\u{1F393} Tutorial'; tBtn.onclick = startTutorial; }

  // Close any panels we may have left open
  var panel = document.getElementById('settings-panel');
  if(panel && panel.classList.contains('open')) toggleSettingsPanel();
  var filterSidebar = document.getElementById('filter-sidebar');
  if(filterSidebar && !filterSidebar.classList.contains('collapsed')) toggleFilterSidebar();
  var weatherPanel = document.getElementById('weather-panel');
  if(weatherPanel && !weatherPanel.classList.contains('collapsed')) toggleWeatherPanel();
  var riskPanel = document.getElementById('risk-panel');
  if(riskPanel && riskPanel.style.display !== 'none' && riskPanel.style.display !== '') toggleRiskPanel();

  if(completed === true){
    showToast('\u2713 Tour complete \u2014 click \u2753 any time for help', false);
  }
}

// ── HELP MODE ─────────────────────────────────────────────────────────────────
var _helpOpenedSettings = false;
var _helpOpenedWeather  = false;
var _helpOpenedFilter   = false;

function startHelp(){
  if(helpActive){ endHelp(); return; }
  helpActive = true;

  var btn = document.getElementById('btn-help');
  if(btn) btn.classList.add('help-on');

  // Open panels that contain anchors so bubbles position correctly
  var settingsPanel = document.getElementById('settings-panel');
  var weatherPanel  = document.getElementById('weather-panel');
  var filterSidebar = document.getElementById('filter-sidebar');
  _helpOpenedSettings = settingsPanel && !settingsPanel.classList.contains('open');
  _helpOpenedWeather  = weatherPanel  && weatherPanel.classList.contains('collapsed');
  _helpOpenedFilter   = filterSidebar && filterSidebar.classList.contains('collapsed');

  if(_helpOpenedSettings) toggleSettingsPanel();
  if(_helpOpenedWeather)  toggleWeatherPanel();
  if(_helpOpenedFilter)   toggleFilterSidebar();

  // Wait for panels to animate open before placing bubbles
  var delay = (_helpOpenedSettings || _helpOpenedWeather || _helpOpenedFilter) ? 380 : 0;
  setTimeout(function(){
    helpPlaceBubbles();
    document.addEventListener('click', helpOutsideClick);
  }, delay);
}

function helpPlaceBubbles(){
  helpBubbles = [];
  var num = 1;
  TOUR_STEPS.forEach(function(step){
    var anchor = HELP_ANCHORS[step.id];
    if(!anchor) return;
    var rect = tourGetRect(anchor);
    if(!rect) return;

    var bubble = document.createElement('div');
    bubble.className = 'help-bubble';
    bubble.textContent = num;
    bubble.setAttribute('data-tour-id', step.id);
    bubble.setAttribute('data-num', num);
    bubble.style.top  = (rect.top  - 8) + 'px';
    bubble.style.left = (rect.right - 12) + 'px';
    bubble.style.animationDelay = (num * 0.08) + 's';

    bubble.addEventListener('click', function(e){
      e.stopPropagation();
      helpShowCard(step, bubble);
    });

    document.body.appendChild(bubble);
    helpBubbles.push(bubble);
    num++;
  });
}

function endHelp(){
  helpActive = false;
  helpBubbles.forEach(function(b){ b.remove(); });
  helpBubbles = [];
  var cards = document.querySelectorAll('.help-card');
  cards.forEach(function(c){ c.remove(); });
  var btn = document.getElementById('btn-help');
  if(btn) btn.classList.remove('help-on');
  document.removeEventListener('click', helpOutsideClick);

  // Close panels we opened
  if(_helpOpenedSettings){
    var sp = document.getElementById('settings-panel');
    if(sp && sp.classList.contains('open')) toggleSettingsPanel();
  }
  if(_helpOpenedWeather){
    var wp = document.getElementById('weather-panel');
    if(wp && !wp.classList.contains('collapsed')) toggleWeatherPanel();
  }
  if(_helpOpenedFilter){
    var fs = document.getElementById('filter-sidebar');
    if(fs && !fs.classList.contains('collapsed')) toggleFilterSidebar();
  }
  _helpOpenedSettings = false;
  _helpOpenedWeather  = false;
  _helpOpenedFilter   = false;
}

function helpOutsideClick(e){
  if(!e.target.closest('.help-card') && !e.target.closest('.help-bubble')){
    document.querySelectorAll('.help-card').forEach(function(c){ c.remove(); });
  }
}

function helpShowCard(step, bubbleEl){
  // Close any existing help card
  document.querySelectorAll('.help-card').forEach(function(c){ c.remove(); });

  var card = document.createElement('div');
  card.className = 'help-card';
  card.style.position = 'fixed';

  card.innerHTML = [
    '<button class="hc-close" title="Close">\u2715</button>',
    '<div class="hc-title">' + bubbleEl.getAttribute('data-num') + '. ' + step.title + '</div>',
    '<div class="hc-body">' + step.body + '</div>'
  ].join('');

  document.body.appendChild(card);

  // Position relative to bubble
  var bRect = bubbleEl.getBoundingClientRect();
  var vw = window.innerWidth, vh = window.innerHeight;
  var cw = 270, ch = card.offsetHeight || 160;
  var t = bRect.bottom + 8;
  var l = bRect.left - cw + 20;
  l = Math.max(12, Math.min(l, vw - cw - 12));
  t = Math.max(12, Math.min(t, vh - ch - 12));
  card.style.top  = t + 'px';
  card.style.left = l + 'px';

  card.querySelector('.hc-close').addEventListener('click', function(e){
    e.stopPropagation();
    card.remove();
  });
}

// ── REPOSITION ON RESIZE ──────────────────────────────────────────────────────
window.addEventListener('resize', function(){
  if(tourActive){
    var step = TOUR_STEPS[tourStep];
    tourPositionSpotlight(step.target);
    tourPositionCard(step.target, step.position);
  }
  if(helpActive){
    // Remove and replace all bubbles at updated positions
    helpBubbles.forEach(function(b){ b.remove(); });
    helpPlaceBubbles();
  }
});
