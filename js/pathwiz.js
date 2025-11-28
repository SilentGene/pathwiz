// SVG init
const svg = d3.select("#svg");

// Title element (initially empty)
const titleNode = svg.append("text")
  .attr("id", "svg-title")
  .attr("x", 10) // Left aligned
  .attr("y", 30)
  .attr("text-anchor", "start")
  .attr("font-family", "Segoe UI, Roboto, Oxygen-Sans, Ubuntu, Cantarell, Helvetica Neue, sans-serif")
  .attr("font-size", "22px")
  .attr("font-weight", "700")
  .attr("fill", "#1E293A")
  .text("");

const g = svg.append("g");

// Arrows & Fill map (inline colors for compatibility)
const markerColors = ["#f8991d", "#ef3d39", "#2ab34b", "#6f8ac6", "#555"];
const CLASS_FILL = { st35: "#ffe8c0", st34: "#cecece", st39: "#fbcccd", st40: "#dad7ec", st38: "#c9e5c7" };
const defs = svg.append("defs");
markerColors.forEach(color => {
  const id = `arrow-${color.substring(1)}`;
  const m = defs.append("marker")
    .attr("id", id)
    .attr("viewBox", "0 0 10 10")
    .attr("refX", 8)
    .attr("refY", 5)
    .attr("markerWidth", 5)
    .attr("markerHeight", 5)
    .attr("orient", "auto")
    .attr("markerUnits", "strokeWidth");
  m.append("path").attr("d", "M 0 0 L 10 5 L 0 10 z").attr("fill", color);
});

// Drawing Helpers
function drawBox(props) {
  let {id, x, y, w, h, label, cls, kw=[], enzyme=true} = props;
  // Check for global pathwayData
  if (typeof pathwayData !== 'undefined' && pathwayData[id]) {
    const data = pathwayData[id];
    if (data.label) label = data.label;
    if (data.kw) kw = data.kw;
  }
  const classes = [cls||'']; if (enzyme) classes.push('enzyme');
  const ng = g.append("g").attr("class", classes.join(' ').trim()).attr("id", id).attr("data-kw", kw.join(","));
  const rect = ng.append("rect")
    .attr("x", x).attr("y", y).attr("width", w).attr("height", h)
    .attr("rx", enzyme?6:null).attr("ry", enzyme?6:null)
    .attr("stroke", enzyme?"#444":null).attr("stroke-width", enzyme?1:null);
  if (cls && CLASS_FILL[cls]) rect.attr("fill", CLASS_FILL[cls]);
  const lines = String(label||id).split(/\n/); const lh=14;
  const txt = ng.append("text").attr("x", x+w/2).attr("y", y+h/2)
    .attr("text-anchor", "middle").attr("dominant-baseline", "middle")
    .attr("font-family", "Arial, sans-serif").attr("font-size", 14).attr("fill", "#222");
  lines.forEach((ln,i)=>{ const t=txt.append("tspan").attr("x", x+w/2).text(ln); t.attr("dy", i===0?`${-((lines.length-1)/2)*lh}`:lh); });
  ng.append('title').text([label||id, kw.length?` [${kw.join(', ')}]`:''].join(''));
}

function drawText({x,y,text,cls="label"}) {
  const lines = String(text).split(/\n/);
  let size=14, fill="#222", weight="400", anchor="start";
  if (/big-label/.test(cls)) { size=18; fill="#000"; weight="700"; anchor="middle"; }
  if (/small-label/.test(cls)) { size=11; fill="#555"; }
  const el = g.append("text")
    .attr("x", x).attr("y", y)
    .attr("font-family", "Arial, sans-serif")
    .attr("font-size", size).attr("font-weight", weight)
    .attr("fill", fill).attr("text-anchor", anchor)
    .attr("dominant-baseline", "middle");
  const lh = size;
  lines.forEach((ln,i)=>{
    const lineSpan = el.append("tspan").attr("x", x).attr("dy", i===0?`${-((lines.length-1)/2)*lh}`:lh);
    const parts = ln.split(/(<sub>.*?<\/sub>)/g).filter(Boolean);
    let pendingRestore = false;
    const subDy = Math.round(size*0.25);
    parts.forEach(part => {
      if (/^<sub>.*<\/sub>$/.test(part)) {
        const subTxt = part.replace(/<\/?sub>/g, "");
        lineSpan.append("tspan")
          .attr("font-size", Math.round(size*0.65))
          .attr("dy", subDy)
          .text(subTxt);
        pendingRestore = true; // next normal segment should lift baseline
      } else {
        const t = lineSpan.append("tspan").text(part);
        if (pendingRestore) {
          t.attr("dy", -subDy).attr("font-size", size);
          pendingRestore = false;
        }
      }
    });
  });
  return el;
}

function drawLine({x1,y1,x2,y2,color,width=2,arrow=true}) {
  const ln = g.append("line")
    .attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2)
    .attr("stroke", color).attr("stroke-width", width);
  if (arrow) ln.attr("marker-end", `url(#arrow-${color.substring(1)})`);
}

function drawRing({cx, cy, r=4.58, color="#f8991d", width=2}) {
  g.append("circle")
    .attr("cx", cx).attr("cy", cy).attr("r", r)
    .attr("fill", "#ffffff").attr("stroke", color).attr("stroke-width", width);
}

function drawPath({d, color, width=2, arrow=true}) {
  const p = g.append("path")
    .attr("d", d)
    .attr("fill", "none")
    .attr("stroke", color)
    .attr("stroke-width", width);
  if (arrow) p.attr("marker-end", `url(#arrow-${color.substring(1)})`);
}

function drawPill({x, y, w, h, label, cls}) {
  const ng = g.append("g").attr("class", "pill-group");
  const rect = ng.append("rect")
    .attr("x", x).attr("y", y).attr("width", w).attr("height", h)
    .attr("rx", 15).attr("ry", 15).attr("stroke", "none").attr("opacity", 0.9);
  rect.attr("fill", (cls && CLASS_FILL[cls])?CLASS_FILL[cls]:"#ffffff");
  ng.append("text")
    .attr("x", x+w/2).attr("y", y+h/2).attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle").attr("font-family", "Arial, sans-serif")
    .attr("font-size", 14).attr("fill", "#222").text(label);
  return ng;
}

// Logic
window.updateTitle = function() {
  const val = document.getElementById("titleInput").value;
  d3.select("#svg-title").text(val);
}

window.highlight = function() {
  const raw = document.getElementById("kwInput").value.toUpperCase();
  const tokens = raw.split(/[\s,;]+/).map(t => t.trim()).filter(Boolean);
  g.selectAll(".highlight").classed("highlight", false);
  if (!tokens.length) return;
  g.selectAll("g.enzyme").each(function() {
    const k = (this.getAttribute("data-kw")||"").toUpperCase().split(",").map(s=>s.trim()).filter(Boolean);
    const match = k.some(v => tokens.includes(v));
    if (match) d3.select(this).classed("highlight", true);
  });
}

window.clearHighlight = function() {
  g.selectAll(".highlight").classed("highlight", false);
  document.getElementById("kwInput").value = "";
}

window.fillExample = function() {
  // Example Keywords for testing
  const examples = window.exampleKeywords || [];
  document.getElementById("kwInput").value = examples.join(", ");
}

window.toggleGrayscale = function() {
  const cb = document.getElementById("grayscaleToggle");
  d3.select("#svg").classed("grayscale-active", cb.checked);
}

function bindKwInputHotkey() {
  const inp = document.getElementById('kwInput');
  if (inp && !inp.dataset.bound) {
    inp.addEventListener('keydown', function(e){
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        window.highlight();
      }
    });
    inp.dataset.bound = '1';
  }
}
bindKwInputHotkey();

// --- Export Functions ---
function getSafeFilename(ext) {
  const base = "pathway_viz";
  const val = document.getElementById("titleInput").value.trim();
  if (!val) return base + "." + ext;
  const safe = val.replace(/[\\/:*?"<>|]/g, "_");
  return base + "-" + safe + "." + ext;
}

function getSvgData() {
  const svgEl = document.getElementById("svg");
  const clone = svgEl.cloneNode(true);
  
  // Remove debug layer from clone
  const debugLayer = clone.querySelector("#debug-layer");
  if (debugLayer) {
    debugLayer.remove();
  }

  // Fix for Illustrator: Bake Grayscale colors (later) and convert marker arrows to explicit triangles
  if (svgEl.classList.contains("grayscale-active")) {
    
    // 1. Add a gray marker
    const defs = clone.querySelector("defs");
    if (defs) {
      const grayMarker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
      grayMarker.setAttribute("id", "arrow-gray");
      grayMarker.setAttribute("viewBox", "0 0 10 10");
      grayMarker.setAttribute("refX", "8");
      grayMarker.setAttribute("refY", "5");
      grayMarker.setAttribute("markerWidth", "5");
      grayMarker.setAttribute("markerHeight", "5");
      grayMarker.setAttribute("orient", "auto");
      grayMarker.setAttribute("markerUnits", "strokeWidth");
      
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M 0 0 L 10 5 L 0 10 z");
      path.setAttribute("fill", "#888888"); // Gray color
      grayMarker.appendChild(path);
      defs.appendChild(grayMarker);
    }

    // 2. Helper for color conversion
    const toGray = (color) => {
      if (!color || color === "none" || color === "transparent") return color;
      // Handle hex
      if (color.startsWith("#")) {
        let r, g, b;
        const hex = color.substring(1);
        if (hex.length === 3) {
          r = parseInt(hex[0]+hex[0], 16);
          g = parseInt(hex[1]+hex[1], 16);
          b = parseInt(hex[2]+hex[2], 16);
        } else {
          r = parseInt(hex.substring(0,2), 16);
          g = parseInt(hex.substring(2,4), 16);
          b = parseInt(hex.substring(4,6), 16);
        }
        const gray = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
        return `rgb(${gray},${gray},${gray})`;
      }
      // Handle rgb
      if (color.startsWith("rgb")) {
        const parts = color.match(/\d+/g);
        if (parts) {
          const r = parseInt(parts[0]);
          const g = parseInt(parts[1]);
          const b = parseInt(parts[2]);
          const gray = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
          return `rgb(${gray},${gray},${gray})`;
        }
      }
      return color;
    };

    // 3. Traverse and update
    const mainG = clone.querySelector("g");
    if (mainG) {
      const allElements = mainG.querySelectorAll("*");
      allElements.forEach(el => {
        // Check if this element or any ancestor has .highlight
        if (el.closest(".highlight")) return;
        if (el.closest(".pill-group")) return;

        // Convert Fill
        const fill = el.getAttribute("fill") || el.style.fill;
        if (fill) el.setAttribute("fill", toGray(fill));
        
        // Convert Stroke
        const stroke = el.getAttribute("stroke") || el.style.stroke;
        if (stroke) el.setAttribute("stroke", toGray(stroke));
        
        // Convert Marker
        const markerEnd = el.getAttribute("marker-end");
        if (markerEnd && markerEnd !== "none") {
          el.setAttribute("marker-end", "url(#arrow-gray)");
        }
      });
    }
    
    clone.classList.remove("grayscale-active");
  }

  // --- Convert marker-based arrows to explicit paths ---
  (function replaceMarkers() {
    // Remove marker definitions entirely
    const defs = clone.querySelector('defs');
    if (defs) {
      Array.from(defs.querySelectorAll('marker')).forEach(m => m.remove());
    }
    // Helper to build triangle path from tip and direction
    function makeArrowPath(tipX, tipY, fromX, fromY, strokeColor) {
      const dx = tipX - fromX;
      const dy = tipY - fromY;
      const len = Math.max(Math.hypot(dx, dy), 0.0001);
      const ux = dx / len;
      const uy = dy / len;
      const size = 9; // arrow length (base to apex)
      const width = 5; // arrow half-width
      const advance = 2; // push apex forward beyond original line end to cover stroke
      const apexX = tipX + ux * advance;
      const apexY = tipY + uy * advance;
      const baseX = apexX - ux * size;
      const baseY = apexY - uy * size;
      const px = -uy;
      const py = ux;
      const leftX = baseX + px * width;
      const leftY = baseY + py * width;
      const rightX = baseX - px * width;
      const rightY = baseY - py * width;
      const d = `M ${apexX} ${apexY} L ${leftX} ${leftY} L ${rightX} ${rightY} Z`;
      const path = document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d', d);
      path.setAttribute('fill', strokeColor || '#333');
      path.setAttribute('stroke', 'none');
      return path;
    }
    // Lines
    Array.from(clone.querySelectorAll('line[marker-end]')).forEach(line => {
      const x1 = parseFloat(line.getAttribute('x1'));
      const y1 = parseFloat(line.getAttribute('y1'));
      const x2 = parseFloat(line.getAttribute('x2'));
      const y2 = parseFloat(line.getAttribute('y2'));
      const stroke = line.getAttribute('stroke') || '#333';
      line.removeAttribute('marker-end');
      const arrow = makeArrowPath(x2, y2, x1, y1, stroke);
      line.parentNode.appendChild(arrow);
    });
    // Paths
    Array.from(clone.querySelectorAll('path[marker-end]')).forEach(p => {
      try {
        const stroke = p.getAttribute('stroke') || '#333';
        const total = p.getTotalLength();
        const tip = p.getPointAtLength(total);
        const prev = p.getPointAtLength(Math.max(total - 0.1, 0));
        p.removeAttribute('marker-end');
        const arrow = makeArrowPath(tip.x, tip.y, prev.x, prev.y, stroke);
        p.parentNode.appendChild(arrow);
      } catch (e) {
        p.removeAttribute('marker-end');
      }
    });
  })();

  const serializer = new XMLSerializer();
  // Flatten any baseline-shift subscripts for Illustrator
  Array.from(clone.querySelectorAll('tspan[baseline-shift]')).forEach(ts => {
    const parentSize = parseInt(ts.parentNode.getAttribute('font-size')) || 14;
    const subText = ts.textContent;
    ts.removeAttribute('baseline-shift');
    ts.removeAttribute('font-size');
    ts.setAttribute('font-size', Math.round(parentSize * 0.65));
    ts.setAttribute('dy', Math.round(parentSize * 0.25));
    // Add a spacer tspan to restore baseline for following siblings
    const restore = document.createElementNS('http://www.w3.org/2000/svg','tspan');
    restore.setAttribute('font-size', parentSize);
    restore.setAttribute('dy', Math.round(-parentSize * 0.25));
    ts.after(restore);
  });

  // Remove style classes for fills already inlined; keep minimal highlight styling (no filters)
  const styleEl = clone.querySelector('#svg-styles');
  if (styleEl) {
    styleEl.textContent = '.highlight rect,.highlight circle,.highlight path,.highlight line{stroke:#e74c3c;stroke-width:4;}';
  }

  // --- Recalculate vertical centering for box and pill text (Illustrator baseline differences) ---
  (function fixBoxPillTextVerticalAlignment() {
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const groups = Array.from(clone.querySelectorAll('g.enzyme, g.pill-group'));
    groups.forEach(gr => {
      const rect = gr.querySelector('rect');
      const text = gr.querySelector('text');
      if (!rect || !text) return;
      // Gather top-level line tspans (ignore nested tspans for subscripts which boxes/pills don't use)
      let lineSpans = Array.from(text.childNodes).filter(n => n.nodeName === 'tspan');
      const fontSize = parseInt(text.getAttribute('font-size')) || 14;
      const rectY = parseFloat(rect.getAttribute('y'));
      const rectH = parseFloat(rect.getAttribute('height'));
      // If pill text has no tspans (drawPill uses .text()), treat the whole textContent as one line
      if (gr.classList.contains('pill-group') && lineSpans.length === 0 && text.textContent) {
        const centerX = parseFloat(rect.getAttribute('x')) + parseFloat(rect.getAttribute('width')) / 2;
        // Allow per-pill override via data-pill-shift (in font-size units). If present, use that; else default factor.
        const override = gr.getAttribute('data-pill-shift');
        const PILL_SINGLELINE_BASELINE_FACTOR = override ? parseFloat(override) : 0.30; // was 0.40; 0.30 raises text further
        const baseline1 = rectY + rectH / 2 + fontSize * PILL_SINGLELINE_BASELINE_FACTOR;
        text.removeAttribute('dominant-baseline');
        text.setAttribute('x', centerX);
        text.setAttribute('y', baseline1);
        return; // done for this pill
      }
      if (!lineSpans.length) return; // no adjustment needed otherwise
      const lineCount = lineSpans.length;
      const blockHeight = lineCount * fontSize;
      // Different treatment for pill single-line labels (Illustrator renders baseline higher)
      let baseline1;
      if (gr.classList.contains('pill-group') && lineCount === 1) {
        // Parameterized downward adjustment for pill single-line text; lowered to 0.30 to raise text.
        const override = gr.getAttribute('data-pill-shift');
        const PILL_SINGLELINE_BASELINE_FACTOR = override ? parseFloat(override) : 0.30; // previous 0.40
        baseline1 = rectY + rectH / 2 + fontSize * PILL_SINGLELINE_BASELINE_FACTOR;
      } else {
        // Approximate baseline offset factor (empirical for Arial): 0.80 * fontSize from top of first line box
        const baselineOffset = fontSize * 0.80;
        baseline1 = rectY + (rectH - blockHeight) / 2 + baselineOffset;
      }
      const centerX = parseFloat(rect.getAttribute('x')) + parseFloat(rect.getAttribute('width')) / 2;
      // Rebuild tspans with explicit stacking (remove previous dy strategy & dominant-baseline)
      text.removeAttribute('dominant-baseline');
      const originalLines = lineSpans.map(ts => ts.textContent);
      while (text.firstChild) text.removeChild(text.firstChild);
      text.setAttribute('x', centerX);
      text.setAttribute('y', baseline1);
      originalLines.forEach((ln, i) => {
        const tspan = document.createElementNS(SVG_NS, 'tspan');
        tspan.setAttribute('x', centerX);
        tspan.setAttribute('dy', i === 0 ? '0' : String(fontSize));
        tspan.textContent = ln;
        text.appendChild(tspan);
      });
    });
  })();

  let source = serializer.serializeToString(clone);
  if(!source.match(/<style/)) {
    source = source.replace('>', '><style>.highlight rect,.highlight circle,.highlight path,.highlight line{stroke:#e74c3c;stroke-width:4;}</style>');
  }
  return source;
}

window.saveSvg = function() {
  const source = getSvgData();
  const blob = new Blob([source], {type: "image/svg+xml;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = getSafeFilename("svg");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function saveJpg() {
  const source = getSvgData();
  const w = 640.67; 
  const h = 589.39; 
  
  // Use base64 encoding for better compatibility
  const base64 = btoa(unescape(encodeURIComponent(source)));
  const dataUrl = 'data:image/svg+xml;base64,' + base64;
  
  const img = new Image();
  let timeoutId;
  
  img.onload = function() {
    clearTimeout(timeoutId);
    try {
      const canvas = document.createElement("canvas");
      const scale = 2; 
      canvas.width = w * scale;
      canvas.height = h * scale;
      const ctx = canvas.getContext("2d");
      
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, w, h);
      
      const link = document.createElement("a");
      link.download = getSafeFilename("jpg");
      link.href = canvas.toDataURL("image/jpeg", 0.9);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error creating JPG:", error);
      alert("Failed to create JPG image. Check console for details.");
    }
  };
  
  img.onerror = function() {
    clearTimeout(timeoutId);
    console.error("Failed to load SVG image");
    alert("Failed to load SVG for conversion. The visualization may contain unsupported elements.");
  };
  
  // Add timeout to prevent hanging
  timeoutId = setTimeout(() => {
    console.error("Image loading timeout");
    alert("Image loading timed out.");
  }, 5000);
  
  img.src = dataUrl;
}
window.saveJpg = saveJpg;


// Debug
(function setupDebug() {
  const vbVals = (svg.attr('viewBox') || '0 0 640.67 589.39').trim().split(/[\s,]+/).map(parseFloat);
  const vb = { x: vbVals[0] || 0, y: vbVals[1] || 0, w: vbVals[2] || 640.67, h: vbVals[3] || 589.39 };

  const debugLayer = svg.append('g').attr('id', 'debug-layer').attr('pointer-events', 'none').style('display', 'none');
  const grid = debugLayer.append('g').attr('id', 'debug-grid');
  const minor = 20, major = 100;
  const majorEvery = Math.max(1, Math.round(major / minor));
  for (let i = 0; i <= Math.ceil(vb.w / minor); i++) {
    const x = vb.x + i * minor;
    const isMajor = (i % majorEvery) === 0;
    grid.append('line').attr('x1', x).attr('y1', vb.y).attr('x2', x).attr('y2', vb.y + vb.h).attr('stroke', isMajor ? '#666' : '#999').attr('stroke-width', isMajor ? 0.5 : 0.25).attr('opacity', isMajor ? 0.35 : 0.18);
  }
  for (let j = 0; j <= Math.ceil(vb.h / minor); j++) {
    const y = vb.y + j * minor;
    const isMajor = (j % majorEvery) === 0;
    grid.append('line').attr('x1', vb.x).attr('y1', y).attr('x2', vb.x + vb.w).attr('y2', y).attr('stroke', isMajor ? '#666' : '#999').attr('stroke-width', isMajor ? 0.5 : 0.25).attr('opacity', isMajor ? 0.35 : 0.18);
  }

  const cross = debugLayer.append('g').attr('id', 'debug-crosshair');
  const chV = cross.append('line').attr('stroke', '#0077ff').attr('stroke-width', 0.7).attr('opacity', 0.6);
  const chH = cross.append('line').attr('stroke', '#0077ff').attr('stroke-width', 0.7).attr('opacity', 0.6);
  const coordText = debugLayer.append('text').attr('id', 'debug-coords').attr('x', vb.x + 8).attr('y', vb.y + 18).attr('fill', '#004a99').attr('font-size', 12).text('x: -, y: -');
  const bboxRect = debugLayer.append('rect').attr('id', 'debug-bbox').attr('fill', 'none').attr('stroke', '#00aaff').attr('stroke-width', 1.5).attr('stroke-dasharray', '4,3').style('display', 'none');

  function clientToSvg(evt) {
    const pt = svg.node().createSVGPoint();
    pt.x = evt.clientX; pt.y = evt.clientY;
    const ctm = svg.node().getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    
    // Use inverse if available, otherwise calculate it manually
    let inv;
    if (typeof ctm.inverse === 'function') {
      inv = ctm.inverse();
    } else {
      // Fallback: create inverse transformation manually
      const a = ctm.a, b = ctm.b, c = ctm.c, d = ctm.d, e = ctm.e, f = ctm.f;
      const det = a * d - b * c;
      if (Math.abs(det) < 1e-10) return { x: 0, y: 0 }; // Singular matrix
      const svg_m = svg.node().createSVGMatrix();
      inv = svg_m.multiply(ctm).translate(-ctm.e, -ctm.f);
      inv.a = d / det;
      inv.b = -b / det;
      inv.c = -c / det;
      inv.d = a / det;
      inv.e = (b * f - d * e) / det;
      inv.f = (c * e - a * f) / det;
    }
    
    const sp = pt.matrixTransform(inv);
    return { x: sp.x, y: sp.y };
  }

  svg.on('mousemove.debug', function(event) {
    const p = clientToSvg(event);
    chV.attr('x1', p.x).attr('y1', vb.y).attr('x2', p.x).attr('y2', vb.y + vb.h);
    chH.attr('x1', vb.x).attr('y1', p.y).attr('x2', vb.x + vb.w).attr('y2', p.y);
    coordText.text(`x: ${p.x.toFixed(2)}, y: ${p.y.toFixed(2)}`);
  });

  g.selectAll('g.enzyme').on('click.debug', function() {
    const bb = this.getBBox();
    bboxRect.attr('x', bb.x - 2).attr('y', bb.y - 2).attr('width', bb.width + 4).attr('height', bb.height + 4).style('display', null);
  });

  window._debugVisible = false;
  window.toggleDebug = function() {
    window._debugVisible = !window._debugVisible;
    debugLayer.style('display', window._debugVisible ? null : 'none');
  }
})();
