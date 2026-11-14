/* ==========================================================
   Ilustrações originais em SVG: capas, toca-discos e cenários.
   Tudo desenhado em código, sem imagens externas.
   ========================================================== */
(() => {
  "use strict";

  // Gerador de números "aleatórios" com semente: o desenho sai igual sempre.
  function rnd(seed) {
    let s = seed >>> 0 || 1;
    return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }
  const r2 = (n) => Math.round(n * 10) / 10;

  // Desgaste de capa: grão, marca do disco (ring wear) e cantos gastos
  function desgaste(u) {
    return `
      <filter id="grao-${u}" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4" stitchTiles="stitch"/>
        <feColorMatrix values="0 0 0 0 1  0 0 0 0 .97  0 0 0 0 .9  0 0 0 .55 -.18"/>
      </filter>
      <rect width="300" height="300" filter="url(#grao-${u})" opacity=".5"/>
      <circle cx="150" cy="150" r="126" fill="none" stroke="#fff" stroke-opacity=".09" stroke-width="9"/>
      <circle cx="150" cy="150" r="22" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="5"/>
      <path d="M0 0h18M0 0v14M300 300h-24M300 300v-10M282 0h18v9M0 288v12h10" stroke="#fff" stroke-opacity=".35" stroke-width="3" fill="none"/>`;
  }

  const fonteTitulo = "Fraunces, Georgia, serif";
  const fonteMaquina = "'Courier Prime', 'Courier New', monospace";

  // ------------------------------------------------------------------
  // CAPAS (300 x 300)
  // ------------------------------------------------------------------
  const capas = {
    "sudeste-asiatico"(u) {
      const R = rnd(11);
      let gotas = "";
      for (let i = 0; i < 16; i++) {
        const x = r2(12 + R() * 276), y0 = r2(R() * 90), y1 = r2(y0 + 50 + R() * 110), w = r2(1.4 + R() * 2.2);
        gotas += `<path d="M${x} ${y0} C ${x + 3} ${r2((y0 + y1) / 2)}, ${x - 3} ${r2((y0 + y1) / 2 + 10)}, ${x} ${y1}" stroke-width="${w}"/><circle cx="${x}" cy="${y1 + 2}" r="${r2(w + 1.4)}" stroke="none"/>`;
      }
      return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <defs><pattern id="kw-${u}" width="50" height="50" patternUnits="userSpaceOnUse">
          <g fill="#8B5A2B"><ellipse cx="25" cy="11" rx="7" ry="10"/><ellipse cx="25" cy="39" rx="7" ry="10"/><ellipse cx="11" cy="25" rx="10" ry="7"/><ellipse cx="39" cy="25" rx="10" ry="7"/></g>
          <g fill="#2B3A67"><ellipse cx="25" cy="11" rx="2.5" ry="5"/><ellipse cx="25" cy="39" rx="2.5" ry="5"/><ellipse cx="11" cy="25" rx="5" ry="2.5"/><ellipse cx="39" cy="25" rx="5" ry="2.5"/></g>
          <circle cx="25" cy="25" r="3" fill="#F2E8D5"/><g fill="#F2E8D5" opacity=".55"><circle r="2"/><circle cx="50" r="2"/><circle cy="50" r="2"/><circle cx="50" cy="50" r="2"/></g>
        </pattern></defs>
        <rect width="300" height="300" fill="#2B3A67"/>
        <rect width="300" height="300" fill="url(#kw-${u})" transform="rotate(-6 150 150)" opacity=".9"/>
        <rect width="300" height="300" fill="#2B3A67" opacity=".38"/>
        <g stroke="#F2E8D5" fill="#F2E8D5" stroke-linecap="round" opacity=".75">${gotas}</g>
        <rect y="206" width="300" height="94" fill="#1E2A4D"/>
        <rect y="206" width="300" height="4" fill="#8B5A2B"/>
        <text x="18" y="246" font-family="${fonteTitulo}" font-size="34" font-weight="800" fill="#F2E8D5" letter-spacing="-1">Sudeste</text>
        <text x="20" y="280" font-family="${fonteTitulo}" font-size="27" font-style="italic" font-weight="400" fill="#E6BC8A">Asiático</text>
        <text x="282" y="282" text-anchor="end" font-family="${fonteMaquina}" font-size="10" fill="#E6BC8A">TS·01</text>
        ${desgaste(u)}
      </svg>`;
    },

    "leste-europeu"(u) {
      const R = rnd(23);
      const cores = ["#C9C2D6", "#8E86A3", "#F4EEFF", "#5E5675", "#D6247F", "#F2B705"];
      let facetas = "";
      for (let y = 60; y < 190; y += 13) for (let x = 80; x < 220; x += 13) {
        const p = R(); const c = p > .93 ? cores[4] : p > .87 ? cores[5] : cores[Math.floor(R() * 4)];
        facetas += `<rect x="${x}" y="${y}" width="12" height="12" fill="${c}"/>`;
      }
      let brilhos = "";
      const estrela = (x, y, s, c) => `<path d="M${x} ${y - s} L${x + s * .22} ${y - s * .22} L${x + s} ${y} L${x + s * .22} ${y + s * .22} L${x} ${y + s} L${x - s * .22} ${y + s * .22} L${x - s} ${y} L${x - s * .22} ${y - s * .22}Z" fill="${c}"/>`;
      [[52, 70, 14, "#F2B705"], [250, 58, 10, "#D6247F"], [238, 182, 16, "#F2B705"], [64, 190, 9, "#D6247F"], [196, 40, 6, "#F4EEFF"], [110, 214, 7, "#F4EEFF"]].forEach((e) => (brilhos += estrela(...e)));
      return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="bola-${u}"><circle cx="150" cy="125" r="64"/></clipPath></defs>
        <rect width="300" height="300" fill="#2A0A3D"/>
        <g opacity=".3"><path d="M150 125 L0 300 H70Z" fill="#D6247F"/><path d="M150 125 L300 260 V300 H240Z" fill="#F2B705"/><path d="M150 125 L120 300 H180Z" fill="#D6247F" opacity=".6"/></g>
        <line x1="150" y1="0" x2="150" y2="62" stroke="#C9C2D6" stroke-width="2"/>
        <g clip-path="url(#bola-${u})">${facetas}<circle cx="128" cy="100" r="30" fill="#fff" opacity=".18"/></g>
        <circle cx="150" cy="125" r="64" fill="none" stroke="#1A0626" stroke-width="3"/>
        ${brilhos}
        <text x="152" y="262" text-anchor="middle" font-family="${fonteTitulo}" font-size="35" font-weight="900" fill="#D6247F" letter-spacing="2">LESTE</text>
        <text x="150" y="260" text-anchor="middle" font-family="${fonteTitulo}" font-size="35" font-weight="900" fill="#F2B705" letter-spacing="2">LESTE</text>
        <text x="150" y="286" text-anchor="middle" font-family="${fonteMaquina}" font-size="15" font-weight="700" fill="#F4EEFF" letter-spacing="7">EUROPEU</text>
        ${desgaste(u)}
      </svg>`;
    },

    "america-latina"(u) {
      return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="esq-${u}"><path d="M0 0H160L140 300H0Z"/></clipPath><clipPath id="dir-${u}"><path d="M160 0H300V300H140Z"/></clipPath></defs>
        <g clip-path="url(#esq-${u})">
          <rect width="300" height="300" fill="#3B1F14"/>
          <g stroke="#2A140C" stroke-width="6">${[14, 38, 62, 86, 110, 134].map((x) => `<line x1="${x}" y1="40" x2="${x}" y2="215"/>`).join("")}</g>
          <path d="M72 0 L18 230 H132Z" fill="#FFF1E6" opacity=".22"/>
          <ellipse cx="75" cy="230" rx="62" ry="10" fill="#FFF1E6" opacity=".3"/>
          <rect y="226" width="160" height="74" fill="#1E0F09"/>
          <line x1="75" y1="150" x2="75" y2="226" stroke="#FFF1E6" stroke-width="3"/>
          <rect x="68" y="134" width="14" height="22" rx="7" fill="#FFF1E6"/>
          <g fill="#120805">${[10, 34, 58, 82, 106, 130].map((x, i) => `<circle cx="${x}" cy="${262 + (i % 2) * 6}" r="11"/><rect x="${x - 14}" y="${270 + (i % 2) * 6}" width="28" height="30" rx="10"/>`).join("")}</g>
        </g>
        <g clip-path="url(#dir-${u})">
          <rect width="300" height="300" fill="#F28C28"/>
          <rect y="128" width="300" height="20" fill="#F6A55A"/>
          <circle cx="232" cy="120" r="34" fill="#C8102E"/>
          <path d="M140 150 L170 118 H196 L206 132 L240 126 L262 104 H290 L300 116 V150Z" fill="#8A2A12"/>
          <rect y="150" width="300" height="150" fill="#C8102E"/>
          <path d="M228 150 L170 300 H290Z" fill="#3B1F14"/>
          <path d="M228 152 L230 300" stroke="#FFF1E6" stroke-width="3" stroke-dasharray="10 12"/>
        </g>
        <path d="M160 0 L140 300" stroke="#FFF1E6" stroke-width="5"/>
        <text x="14" y="32" font-family="${fonteTitulo}" font-size="26" font-weight="800" fill="#FFF1E6">América</text>
        <text x="288" y="32" text-anchor="end" font-family="${fonteTitulo}" font-size="26" font-weight="800" font-style="italic" fill="#3B1F14">Latina</text>
        ${desgaste(u)}
      </svg>`;
    },

    "nordicos"(u) {
      const R = rnd(7);
      let estrelas = "";
      for (let i = 0; i < 40; i++) estrelas += `<circle cx="${r2(R() * 300)}" cy="${r2(R() * 160)}" r="${r2(.5 + R() * 1.3)}"/>`;
      const casa = (x, y, w, c) => `<rect x="${x}" y="${y}" width="${w}" height="${w * .75}" fill="${c}"/><path d="M${x - 4} ${y} L${x + w / 2} ${y - w * .55} L${x + w + 4} ${y}Z" fill="#1B2533"/><path d="M${x - 4} ${y} L${x + w / 2} ${y - w * .55} L${x + w / 2 + 8} ${y - w * .42} L${x + 6} ${y}Z" fill="#E6F4F1"/><rect x="${x + w * .3}" y="${y + w * .22}" width="${w * .22}" height="${w * .22}" fill="#F2D27A"/>`;
      return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="au-${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3DDC97" stop-opacity="0"/><stop offset=".55" stop-color="#3DDC97" stop-opacity=".85"/><stop offset="1" stop-color="#3DDC97" stop-opacity="0"/></linearGradient></defs>
        <rect width="300" height="300" fill="#0B1D3A"/>
        <g fill="#E6F4F1" opacity=".8">${estrelas}</g>
        <path d="M-10 120 C 60 40, 110 150, 170 70 S 270 60, 320 30 V110 C 260 140, 220 110, 170 150 S 60 120, -10 190Z" fill="url(#au-${u})"/>
        <path d="M-10 70 C 80 20, 140 90, 210 40 S 300 50, 320 20 V60 C 260 80, 210 70, 160 100 S 40 90, -10 120Z" fill="url(#au-${u})" opacity=".55"/>
        <path d="M0 220 C 70 190, 140 200, 190 214 S 270 200, 300 206 V300 H0Z" fill="#E6F4F1"/>
        ${casa(40, 200, 36, "#B5413A")}${casa(96, 214, 30, "#D9A441")}${casa(214, 196, 40, "#2E6F73")}
        <path d="M0 262 C 90 246, 200 270, 300 252 V300 H0Z" fill="#CFE3E0"/>
        <text x="20" y="52" font-family="${fonteTitulo}" font-size="44" font-style="italic" font-weight="300" fill="#E6F4F1" letter-spacing="-1">Nórdicos</text>
        <text x="22" y="72" font-family="${fonteMaquina}" font-size="10" fill="#3DDC97" letter-spacing="3">TS·04</text>
        ${desgaste(u)}
      </svg>`;
    },

    "africa"(u) {
      const R = rnd(31);
      let predios = "", janelas = "";
      [[0, 120, 60], [58, 90, 48], [104, 140, 56], [158, 70, 52], [208, 110, 50], [256, 86, 50]].forEach(([x, y, w], i) => {
        predios += `<rect x="${x}" y="${y}" width="${w}" height="${230 - y}" fill="${["#222", "#2A2A2A", "#1D1D1D"][i % 3]}"/>`;
        for (let yy = y + 12; yy < 210; yy += 18) for (let xx = x + 8; xx < x + w - 8; xx += 14) if (R() > .55) janelas += `<rect x="${xx}" y="${yy}" width="6" height="9" fill="${R() > .5 ? "#E8B10E" : "#F25C54"}" opacity="${r2(.35 + R() * .5)}"/>`;
      });
      const cordao = (y0, curva, n, seed) => {
        const Q = rnd(seed); let s = `<path d="M-5 ${y0} Q150 ${y0 + curva} 305 ${y0}" stroke="#555" stroke-width="1.5" fill="none"/>`;
        for (let i = 1; i < n; i++) {
          const t = i / n; const x = (1 - t) * (1 - t) * -5 + 2 * (1 - t) * t * 150 + t * t * 305; const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * (y0 + curva) + t * t * y0;
          const c = ["#E8B10E", "#F25C54", "#F5F1E8"][Math.floor(Q() * 3)];
          s += `<circle cx="${r2(x)}" cy="${r2(y + 5)}" r="9" fill="${c}" opacity=".18"/><circle cx="${r2(x)}" cy="${r2(y + 5)}" r="3.6" fill="${c}"/>`;
        }
        return s;
      };
      return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="300" fill="#161616"/>
        ${predios}${janelas}
        <rect y="230" width="300" height="70" fill="#0B6E4F"/>
        <path d="M0 236 H300" stroke="#0A5A41" stroke-width="5"/>
        ${cordao(30, 60, 12, 2)}${cordao(70, 50, 10, 5)}
        <text x="16" y="285" font-family="${fonteTitulo}" font-size="54" font-weight="900" fill="#E8B10E" letter-spacing="-2">ÁFRICA</text>
        <text x="284" y="285" text-anchor="end" font-family="${fonteMaquina}" font-size="10" fill="#F25C54">TS·05</text>
        ${desgaste(u)}
      </svg>`;
    },

    "leste-asiatico"(u) {
      const R = rnd(5);
      let raios = "";
      for (let i = 0; i < 64; i++) {
        const a = (i / 64) * Math.PI * 2 + R() * .05, a2 = a + .018 + R() * .03;
        const r0 = 92 + R() * 30, r1 = 260;
        raios += `<path d="M${r2(150 + Math.cos(a) * r0)} ${r2(150 + Math.sin(a) * r0)} L${r2(150 + Math.cos(a) * r1)} ${r2(150 + Math.sin(a) * r1)} L${r2(150 + Math.cos(a2) * r1)} ${r2(150 + Math.sin(a2) * r1)}Z"/>`;
      }
      return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="300" fill="#FAF7FF"/>
        <rect y="190" width="300" height="110" fill="#8EC9F0" opacity=".45"/>
        <g fill="#8E6CCF" opacity=".75">${raios}</g>
        <g stroke="#8EC9F0" stroke-width="5" stroke-linecap="round"><line x1="20" y1="140" x2="90" y2="140"/><line x1="36" y1="162" x2="96" y2="162"/><line x1="10" y1="118" x2="80" y2="118"/></g>
        <circle cx="160" cy="150" r="52" fill="#fff" stroke="#2A2140" stroke-width="4"/>
        <path d="M128 112 C 146 136, 146 164, 128 188" stroke="#6B4BB0" stroke-width="3" fill="none" stroke-dasharray="5 4"/>
        <path d="M192 112 C 174 136, 174 164, 192 188" stroke="#6B4BB0" stroke-width="3" fill="none" stroke-dasharray="5 4"/>
        <text x="16" y="44" font-family="${fonteTitulo}" font-size="33" font-weight="900" font-style="italic" fill="#8EC9F0" letter-spacing="-1">LESTE</text>
        <text x="13" y="41" font-family="${fonteTitulo}" font-size="33" font-weight="900" font-style="italic" fill="#6B4BB0" letter-spacing="-1">LESTE</text>
        <text x="16" y="282" font-family="${fonteTitulo}" font-size="33" font-weight="900" font-style="italic" fill="#2A2140" letter-spacing="-1">ASIÁTICO</text>
        <text x="284" y="40" text-anchor="end" font-family="${fonteMaquina}" font-size="10" fill="#2A2140">TS·06</text>
        ${desgaste(u)}
      </svg>`;
    }
  };

  let contadorUid = 0;
  function capa(id, sufixo = "") {
    const f = capas[id];
    return f ? f(`${id}-${sufixo || ++contadorUid}`) : "";
  }

  // ------------------------------------------------------------------
  // TOCA-DISCOS (vista de três quartos)
  // ------------------------------------------------------------------
  function tocaDiscos() {
    const sulcos = [70, 63, 56, 49, 42, 35].map((r) => `<circle r="${r}"/>`).join("");
    return `<svg class="tt" viewBox="0 0 240 124" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="120" cy="118" rx="118" ry="5" fill="#000" opacity=".18"/>
      <path d="M22 30 H218 L236 78 H4 Z" fill="#2B2724"/>
      <path d="M22 30 H218 L236 78 H4 Z" fill="none" stroke="#4A433D" stroke-width="1.5"/>
      <rect x="4" y="78" width="232" height="22" fill="#1C1917"/>
      <rect x="4" y="78" width="232" height="3" fill="#4A433D"/>
      <rect x="14" y="100" width="16" height="7" fill="#111"/><rect x="210" y="100" width="16" height="7" fill="#111"/>
      <circle class="tt-led" cx="22" cy="90" r="2.8"/>
      <text x="30" y="93" font-family="${fonteMaquina}" font-size="7" fill="#8A817A">33⅓</text>
      <rect x="186" y="86" width="38" height="6" rx="1" fill="#3A3430"/><rect class="tt-pitch" x="200" y="84" width="6" height="10" fill="#C9C2B8"/>
      <ellipse cx="104" cy="57" rx="84" ry="20" fill="#0E0D0C"/>
      <ellipse cx="104" cy="55" rx="84" ry="20" fill="#191715" stroke="#3A3632" stroke-width="1"/>
      <g transform="translate(104 53) scale(1 0.235)">
        <g class="tt-disco">
          <circle class="tt-vinil" r="78" fill="#0B0B0B"/>
          <g fill="none" stroke="#262626" stroke-width="1.6">${sulcos}</g>
          <circle class="tt-rotulo" r="26" fill="#FF5A36"/>
          <circle class="tt-rotulo2" r="17" fill="none" stroke="#F7F5F0" stroke-width="2.4" stroke-dasharray="7 5"/>
          <rect x="6" y="-4" width="16" height="8" fill="#F7F5F0" opacity=".9"/>
          <circle r="2.6" fill="#E9E2D4"/>
        </g>
      </g>
      <path d="M44 48 Q 104 33 164 48" stroke="#fff" stroke-opacity=".13" stroke-width="5" fill="none" stroke-linecap="round"/>
      <ellipse cx="206" cy="44" rx="12" ry="5.5" fill="#3A3430"/>
      <g class="tt-braco">
        <path d="M206 41 L198 50 L161 61" stroke="#C9C2B8" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="150" y="57" width="15" height="7" rx="1.5" fill="#E9E2D4" transform="rotate(-14 157 60)"/>
        <rect x="212" y="37" width="10" height="7" rx="2" fill="#8A817A"/>
      </g>
      <circle cx="206" cy="41" r="4.8" fill="#C9C2B8"/>
    </svg>`;
  }

  // ------------------------------------------------------------------
  // CENÁRIOS (1200 x 560). Objetos clicáveis: <g class="objeto" data-obj="...">
  // pinos = posição do marcador pulsante de cada objeto
  // ------------------------------------------------------------------
  const W = 1200, H = 560;
  const alvo = (x, y, w, h) => `<rect class="alvo" x="${x}" y="${y}" width="${w}" height="${h}" fill="transparent"/>`;

  const cenarios = {
    "sudeste-asiatico": {
      pinos: { microfone: [228, 236], radio: [960, 300] },
      svg(u) {
        const R = rnd(3);
        let chuva = "";
        for (let i = 0; i < 46; i++) {
          const x = r2(440 + R() * 320), y = r2(60 + R() * 260), l = r2(18 + R() * 30);
          chuva += `<line class="chuva" x1="${x}" y1="${y}" x2="${x - 3}" y2="${y + l}" style="animation-delay:-${r2(R() * 1.4)}s;animation-duration:${r2(.8 + R() * .7)}s"/>`;
        }
        let escorre = "";
        for (let i = 0; i < 9; i++) {
          const x = r2(460 + R() * 290), y = r2(90 + R() * 120);
          escorre += `<g class="escorre" style="animation-delay:-${r2(R() * 6)}s;animation-duration:${r2(5 + R() * 4)}s"><path d="M${x} ${y} v${r2(30 + R() * 50)}" stroke-width="2.4"/><circle cx="${x}" cy="${y}" r="4"/></g>`;
        }
        let cidade = "";
        for (let i = 0; i < 26; i++) cidade += `<rect x="${r2(450 + R() * 300)}" y="${r2(230 + R() * 80)}" width="4" height="6" fill="#F2D27A" opacity="${r2(.3 + R() * .6)}"/>`;
        return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="batik-${u}" width="90" height="90" patternUnits="userSpaceOnUse">
              <g fill="#8B5A2B" opacity=".55"><ellipse cx="45" cy="18" rx="12" ry="18"/><ellipse cx="45" cy="72" rx="12" ry="18"/><ellipse cx="18" cy="45" rx="18" ry="12"/><ellipse cx="72" cy="45" rx="18" ry="12"/></g>
              <circle cx="45" cy="45" r="5" fill="#F2E8D5" opacity=".35"/>
              <g fill="#F2E8D5" opacity=".18"><circle r="4"/><circle cx="90" r="4"/><circle cy="90" r="4"/><circle cx="90" cy="90" r="4"/></g>
            </pattern>
            <clipPath id="vidro-${u}"><rect x="440" y="60" width="320" height="260"/></clipPath>
          </defs>
          <rect width="${W}" height="${H}" fill="#2B3A67"/>
          <rect width="${W}" height="470" fill="url(#batik-${u})"/>
          <rect width="${W}" height="470" fill="#2B3A67" opacity=".45"/>
          <rect y="470" width="${W}" height="90" fill="#1C2648"/>
          <rect y="466" width="${W}" height="8" fill="#8B5A2B"/>
          <ellipse cx="600" cy="520" rx="330" ry="26" fill="#8B5A2B" opacity=".5"/>
          <g>
            <rect x="440" y="60" width="320" height="260" fill="#141C38"/>
            <g clip-path="url(#vidro-${u})">
              <path d="M440 300 L470 250 H520 V220 H560 V260 H600 V200 H640 V240 H700 V230 H760 V320 H440Z" fill="#0D1328"/>
              ${cidade}
              <g stroke="#B9C3E6" stroke-width="1.6" stroke-linecap="round" opacity=".55">${chuva}</g>
              <g stroke="#DCE3F7" fill="#DCE3F7" opacity=".45">${escorre}</g>
            </g>
            <rect x="433" y="53" width="334" height="274" fill="none" stroke="#F2E8D5" stroke-width="14"/>
            <path d="M600 60 V320 M440 190 H760" stroke="#F2E8D5" stroke-width="9"/>
            <rect x="420" y="327" width="360" height="14" fill="#E6D6B8"/>
          </g>
          <g transform="translate(840 210)">
            <rect x="-10" y="-14" width="34" height="50" rx="4" fill="#F2E8D5" opacity=".9"/>
            <rect x="0" y="-4" width="14" height="10" rx="2" fill="#8B5A2B"/>
          </g>
          <g class="objeto" data-obj="microfone">
            <ellipse cx="230" cy="462" rx="62" ry="11" fill="#151D3A"/>
            <path d="M230 460 V 300" stroke="#C9BFA9" stroke-width="7"/>
            <path d="M230 300 L262 262" stroke="#C9BFA9" stroke-width="6" stroke-linecap="round"/>
            <g transform="rotate(38 270 250)">
              <rect x="252" y="214" width="36" height="62" rx="18" fill="#F2E8D5"/>
              <g fill="#8B5A2B">${[226, 238, 250].map((y) => [262, 270, 278].map((x) => `<circle cx="${x}" cy="${y}" r="2.6"/>`).join("")).join("")}</g>
              <rect x="256" y="262" width="28" height="7" fill="#8B5A2B"/>
            </g>
            <path d="M230 455 C 180 470, 140 440, 120 465" stroke="#0E1530" stroke-width="5" fill="none"/>
            ${alvo(150, 200, 170, 270)}
          </g>
          <g class="objeto" data-obj="radio">
            <rect x="860" y="400" width="230" height="16" fill="#8B5A2B"/>
            <rect x="874" y="416" width="12" height="54" fill="#6E4520"/><rect x="1064" y="416" width="12" height="54" fill="#6E4520"/>
            <path d="M920 328 L895 270" stroke="#C9BFA9" stroke-width="4" stroke-linecap="round"/>
            <rect x="890" y="326" width="170" height="74" rx="12" fill="#F2E8D5"/>
            <circle cx="935" cy="363" r="25" fill="#8B5A2B"/>
            <g fill="#F2E8D5">${[-10, 0, 10].map((dy) => [-10, 0, 10].map((dx) => `<circle cx="${935 + dx}" cy="${363 + dy}" r="2.4"/>`).join("")).join("")}</g>
            <rect x="976" y="342" width="68" height="18" rx="3" fill="#2B3A67"/>
            <path d="M984 351 H1036" stroke="#E6BC8A" stroke-width="2"/><rect x="1004" y="344" width="3" height="14" fill="#F25C54"/>
            <circle cx="992" cy="380" r="7" fill="#8B5A2B"/><circle cx="1026" cy="380" r="7" fill="#8B5A2B"/>
            <g class="ondas" fill="none" stroke="#E6BC8A" stroke-width="3" stroke-linecap="round">
              <path d="M1072 344 q12 18 0 36"/><path d="M1086 334 q20 28 0 56"/>
            </g>
            ${alvo(860, 260, 240, 160)}
          </g>
        </svg>`;
      }
    },

    "leste-europeu": {
      pinos: { mesa: [262, 330], cartaz: [985, 160], chalga: [800, 392] },
      svg(u) {
        const R = rnd(9);
        let piso = "";
        const linhas = 6, cols = 12, yTopo = 380, yBase = H, xTopoE = 260, xTopoD = 940;
        for (let l = 0; l < linhas; l++) {
          const t0 = l / linhas, t1 = (l + 1) / linhas;
          const y0 = yTopo + (yBase - yTopo) * t0 * t0 * .4 + (yBase - yTopo) * t0 * .6, y1 = yTopo + (yBase - yTopo) * t1 * t1 * .4 + (yBase - yTopo) * t1 * .6;
          const e0 = xTopoE - (xTopoE + 60) * t0, d0 = xTopoD + (W - xTopoD + 60) * t0, e1 = xTopoE - (xTopoE + 60) * t1, d1 = xTopoD + (W - xTopoD + 60) * t1;
          for (let c = 0; c < cols; c++) {
            const a = c / cols, b = (c + 1) / cols;
            const p = [[e0 + (d0 - e0) * a, y0], [e0 + (d0 - e0) * b, y0], [e1 + (d1 - e1) * b, y1], [e1 + (d1 - e1) * a, y1]].map((q) => q.map(r2).join(" ")).join(" L");
            const par = (l + c) % 2 === 0;
            piso += `<path d="M${p}Z" class="${par ? "ladrilho" : ""}" fill="${par ? "#D6247F" : "#3D1356"}" opacity="${par ? .55 : 1}" style="animation-delay:-${r2(R() * 3)}s"/>`;
          }
        }
        let facetas = "";
        const cores = ["#C9C2D6", "#8E86A3", "#F4EEFF", "#5E5675"];
        for (let y = 40; y < 200; y += 15) for (let x = 500; x < 724; x += 15) facetas += `<rect x="${x}" y="${y}" width="14" height="14" fill="${R() > .92 ? "#F2B705" : R() > .88 ? "#D6247F" : cores[Math.floor(R() * 4)]}"/>`;
        let guirlanda = "";
        for (let x = 0; x < W; x += 80) guirlanda += `<path d="M${x} 0 Q${x + 40} 70 ${x + 80} 0" fill="none" stroke="#F2B705" stroke-width="5"/><circle cx="${x + 40}" cy="36" r="9" fill="#D6247F"/><circle cx="${x + 40}" cy="36" r="4" fill="#F2B705"/>`;
        const estrela = (x, y, s, c, d) => `<path class="brilho" style="animation-delay:-${d}s" d="M${x} ${y - s} L${x + s * .22} ${y - s * .22} L${x + s} ${y} L${x + s * .22} ${y + s * .22} L${x} ${y + s} L${x - s * .22} ${y + s * .22} L${x - s} ${y} L${x - s * .22} ${y - s * .22}Z" fill="${c}"/>`;
        let brilhos = "";
        for (let i = 0; i < 14; i++) brilhos += estrela(r2(120 + R() * 960), r2(60 + R() * 280), r2(6 + R() * 12), R() > .5 ? "#F2B705" : "#D6247F", r2(R() * 2));
        return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
          <defs><clipPath id="bola-${u}"><circle cx="612" cy="120" r="78"/></clipPath></defs>
          <rect width="${W}" height="${H}" fill="#2A0A3D"/>
          <g fill="#3A1253">${[60, 200, 340, 860, 1000, 1140].map((x) => `<rect x="${x - 40}" y="60" width="80" height="320"/>`).join("")}</g>
          <g stroke="#2A0A3D" stroke-width="3" opacity=".7">${[30, 50, 70, 90, 170, 190, 210, 230, 310, 330, 350, 370, 830, 850, 870, 890, 970, 990, 1010, 1030, 1110, 1130, 1150, 1170].map((x) => `<line x1="${x}" y1="60" x2="${x}" y2="380"/>`).join("")}</g>
          <g class="guirlanda">${guirlanda}</g>
          <g class="feixes">
            <path class="feixe" d="M612 120 L380 560 H520Z" fill="#D6247F" opacity=".22"/>
            <path class="feixe f2" d="M612 120 L840 560 H980Z" fill="#F2B705" opacity=".18"/>
            <path class="feixe f3" d="M612 120 L560 560 H700Z" fill="#F4EEFF" opacity=".12"/>
          </g>
          ${piso}
          <line x1="612" y1="0" x2="612" y2="42" stroke="#C9C2D6" stroke-width="3"/>
          <g clip-path="url(#bola-${u})"><g class="facetas">${facetas}</g><circle cx="584" cy="92" r="34" fill="#fff" opacity=".2"/></g>
          <circle cx="612" cy="120" r="78" fill="none" stroke="#1A0626" stroke-width="4"/>
          ${brilhos}
          <g class="objeto" data-obj="mesa">
            <path d="M150 380 H380 L392 470 H138Z" fill="#FFF4FB"/>
            <path d="M138 470 q14 -14 28 0 q14 -14 28 0 q14 -14 28 0 q14 -14 28 0 q14 -14 28 0 q14 -14 28 0 q14 -14 28 0 q14 -14 28 0 q14 -14 28 0" fill="#FFF4FB" stroke="#DCC8E6" stroke-width="2"/>
            <rect x="214" y="330" width="92" height="50" fill="#FFF4FB" stroke="#DCC8E6" stroke-width="2"/>
            <rect x="230" y="296" width="60" height="34" fill="#FFF4FB" stroke="#DCC8E6" stroke-width="2"/>
            <rect x="214" y="350" width="92" height="7" fill="#D6247F"/><rect x="230" y="310" width="60" height="6" fill="#D6247F"/>
            <path d="M260 296 v-16" stroke="#F2B705" stroke-width="3"/><circle cx="260" cy="276" r="5" fill="#F2B705"/>
            <path d="M170 380 l-6 -40 h20 l-6 40Z M352 380 l-6 -40 h20 l-6 40Z" fill="#F4EEFF" opacity=".75" stroke="#DCC8E6"/>
            ${alvo(130, 260, 270, 220)}
          </g>
          <g class="objeto" data-obj="cartaz">
            <g transform="rotate(3 990 260)">
              <rect x="910" y="150" width="160" height="220" fill="#F2B705"/>
              <rect x="922" y="162" width="136" height="196" fill="none" stroke="#2A0A3D" stroke-width="3"/>
              <text x="990" y="218" text-anchor="middle" font-family="${fonteTitulo}" font-size="22" font-weight="900" fill="#2A0A3D">MINISTERUL</text>
              <text x="990" y="250" text-anchor="middle" font-family="${fonteTitulo}" font-size="22" font-weight="900" font-style="italic" fill="#D6247F">MANELELOR</text>
              <path d="M940 276 H1040" stroke="#2A0A3D" stroke-width="2"/>
              <text x="990" y="306" text-anchor="middle" font-family="${fonteMaquina}" font-size="13" font-weight="700" fill="#2A0A3D">AO VIVO · HOJE</text>
              <circle cx="990" cy="336" r="10" fill="#D6247F"/>
              <rect x="950" y="140" width="40" height="18" fill="#F4EEFF" opacity=".55" transform="rotate(-8 970 150)"/>
            </g>
            ${alvo(900, 130, 180, 250)}
          </g>
          <g class="objeto" data-obj="chalga">
            <rect x="860" y="350" width="120" height="150" fill="#14051E"/>
            <circle cx="920" cy="400" r="30" fill="#2A0A3D" stroke="#5E5675" stroke-width="4"/><circle cx="920" cy="400" r="10" fill="#5E5675"/>
            <circle cx="920" cy="462" r="20" fill="#2A0A3D" stroke="#5E5675" stroke-width="3"/>
            <g transform="rotate(-12 790 440)">
              <circle cx="790" cy="440" r="62" fill="#0B0B0B"/>
              <g fill="none" stroke="#262626" stroke-width="2">${[54, 46, 38, 30].map((r) => `<circle cx="790" cy="440" r="${r}"/>`).join("")}</g>
              <circle cx="790" cy="440" r="22" fill="#F2B705"/>
              <text x="790" y="444" text-anchor="middle" font-family="${fonteMaquina}" font-size="10" font-weight="700" fill="#2A0A3D">CHALGA</text>
            </g>
            ${alvo(720, 360, 270, 150)}
          </g>
        </svg>`;
      }
    },

    "america-latina": {
      pinos: { ingresso: [175, 112], chapeu: [1060, 380], postal: [640, 66] },
      svg(u) {
        const plateia = [40, 100, 160, 220, 280, 340, 400, 460].map((x, i) => `<g class="cabeca" style="animation-delay:-${(i * .27).toFixed(2)}s"><circle cx="${x}" cy="${470 + (i % 2) * 14}" r="26"/><rect x="${x - 34}" y="${490 + (i % 2) * 14}" width="68" height="80" rx="24"/>${i % 3 === 0 ? `<path d="M${x + 20} ${480 + (i % 2) * 14} l26 -70" stroke="#120805" stroke-width="12" stroke-linecap="round"/>` : ""}</g>`).join("");
        return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
          <defs><clipPath id="palco-${u}"><path d="M0 0 H640 L560 560 H0Z"/></clipPath><clipPath id="deserto-${u}"><path d="M640 0 H1200 V560 H560Z"/></clipPath></defs>
          <g clip-path="url(#palco-${u})">
            <rect width="${W}" height="${H}" fill="#3B1F14"/>
            <rect width="660" height="400" fill="#5A1A12"/>
            <g stroke="#3B1010" stroke-width="10">${Array.from({ length: 16 }, (_, i) => `<line x1="${20 + i * 42}" y1="0" x2="${20 + i * 42}" y2="400"/>`).join("")}</g>
            <path class="holofote" d="M180 0 L60 420 H320Z" fill="#FFF1E6" opacity=".16"/>
            <path class="holofote h2" d="M460 0 L320 420 H580Z" fill="#FFF1E6" opacity=".13"/>
            <rect y="390" width="660" height="40" fill="#2A140C"/><rect y="390" width="660" height="5" fill="#F28C28"/>
            <line x1="300" y1="270" x2="300" y2="392" stroke="#FFF1E6" stroke-width="5"/>
            <rect x="290" y="240" width="20" height="36" rx="10" fill="#FFF1E6"/>
            <g fill="#120805">${plateia}</g>
            <text x="40" y="60" font-family="${fonteMaquina}" font-size="18" font-weight="700" fill="#F28C28" letter-spacing="4">BRASIL</text>
          </g>
          <g clip-path="url(#deserto-${u})">
            <rect width="${W}" height="${H}" fill="#F28C28"/>
            <rect y="210" width="${W}" height="50" fill="#F6A55A"/>
            <circle class="sol" cx="940" cy="220" r="80" fill="#C8102E"/>
            <path d="M560 270 L620 230 H700 L720 250 L800 244 L840 210 H900 L930 240 H1010 L1050 200 H1120 L1160 236 L1200 230 V270Z" fill="#8A2A12"/>
            <rect y="268" width="${W}" height="300" fill="#C8102E"/>
            <path d="M900 270 L640 560 H1200 V520Z" fill="#3B1F14"/>
            <path class="faixa-estrada" d="M902 272 L960 560" stroke="#FFF1E6" stroke-width="7" stroke-dasharray="26 30"/>
            <g transform="translate(1110 300)"><rect x="-4" y="0" width="8" height="70" fill="#3B1F14"/><rect x="-36" y="-30" width="72" height="34" fill="#FFF1E6"/><text x="0" y="-8" text-anchor="middle" font-family="${fonteMaquina}" font-size="13" font-weight="700" fill="#3B1F14">MÉXICO</text></g>
          </g>
          <path d="M640 0 L560 560" stroke="#FFF1E6" stroke-width="12"/>
          <g class="objeto" data-obj="ingresso">
            <g transform="rotate(-7 170 130)">
              <path d="M90 90 H250 V112 a10 10 0 0 0 0 20 V170 H90 V132 a10 10 0 0 0 0 -20Z" fill="#FFF1E6"/>
              <path d="M200 92 V168" stroke="#C8102E" stroke-width="2" stroke-dasharray="5 4"/>
              <text x="104" y="122" font-family="${fonteMaquina}" font-size="12" font-weight="700" fill="#3B1F14">INGRESSO</text>
              <text x="104" y="152" font-family="${fonteTitulo}" font-size="24" font-weight="900" fill="#C8102E">AO VIVO</text>
              <text x="225" y="138" text-anchor="middle" font-family="${fonteMaquina}" font-size="11" fill="#3B1F14" transform="rotate(-90 225 134)">Nº 05</text>
            </g>
            ${alvo(80, 70, 190, 120)}
          </g>
          <g class="objeto" data-obj="chapeu">
            <g transform="rotate(-18 1070 450)">
              <ellipse cx="1080" cy="470" rx="62" ry="68" fill="#8B4A1F"/>
              <ellipse cx="1080" cy="390" rx="46" ry="48" fill="#8B4A1F"/>
              <circle cx="1080" cy="420" r="18" fill="#2A140C"/>
              <rect x="1072" y="230" width="16" height="150" fill="#5C2E12"/>
              <rect x="1066" y="210" width="28" height="34" rx="4" fill="#3B1F14"/>
              <rect x="1062" y="490" width="36" height="7" fill="#2A140C"/>
            </g>
            <ellipse cx="985" cy="520" rx="88" ry="22" fill="#E8CDBA"/>
            <path d="M945 518 C 950 470, 1020 470, 1025 518Z" fill="#E8CDBA" stroke="#C8A58E" stroke-width="3"/>
            <path d="M948 506 H1022" stroke="#C8102E" stroke-width="7"/>
            ${alvo(890, 200, 280, 350)}
          </g>
          <g class="objeto" data-obj="postal">
            <g transform="rotate(6 640 90)">
              <rect x="560" y="40" width="160" height="104" fill="#FFF1E6" stroke="#E8CDBA" stroke-width="2"/>
              <path d="M570 130 C 600 90, 630 110, 650 96 S 690 100, 710 120 V134 H570Z" fill="#2E8B57"/>
              <path d="M570 134 C 610 110, 660 128, 710 116 V134Z" fill="#1F6B43"/>
              <circle cx="690" cy="70" r="12" fill="#F28C28"/>
              <rect x="574" y="50" width="26" height="30" fill="none" stroke="#C8102E" stroke-width="2" stroke-dasharray="3 2"/>
              <text x="612" y="72" font-family="${fonteTitulo}" font-size="15" font-style="italic" font-weight="700" fill="#3B1F14">Costa Rica</text>
            </g>
            ${alvo(550, 30, 180, 130)}
          </g>
        </svg>`;
      }
    },

    "nordicos": {
      pinos: { partitura: [190, 300], microfone: [1040, 270], mapa: [830, 330] },
      svg(u) {
        const R = rnd(13);
        let estrelas = "";
        for (let i = 0; i < 90; i++) estrelas += `<circle class="${R() > .7 ? "cintila" : ""}" style="animation-delay:-${r2(R() * 3)}s" cx="${r2(R() * W)}" cy="${r2(R() * 300)}" r="${r2(.8 + R() * 1.8)}"/>`;
        let neve = "";
        for (let i = 0; i < 60; i++) neve += `<circle class="floco" style="animation-delay:-${r2(R() * 9)}s;animation-duration:${r2(7 + R() * 6)}s" cx="${r2(R() * W)}" cy="-10" r="${r2(1.5 + R() * 3)}"/>`;
        const casa = (x, y, w, c) => `<g><rect x="${x}" y="${y}" width="${w}" height="${w * .72}" fill="${c}"/><path d="M${x - 10} ${y} L${x + w / 2} ${y - w * .52} L${x + w + 10} ${y}Z" fill="#1B2533"/><path d="M${x - 10} ${y} L${x + w / 2} ${y - w * .52} L${x + w / 2 + 16} ${y - w * .4} L${x + 8} ${y}Z" fill="#E6F4F1"/><rect class="janela" x="${x + w * .2}" y="${y + w * .2}" width="${w * .22}" height="${w * .22}" fill="#F2D27A"/><rect class="janela" x="${x + w * .58}" y="${y + w * .2}" width="${w * .22}" height="${w * .22}" fill="#F2D27A"/><circle cx="${x + w * .31}" cy="${y + w * .31}" r="${w * .3}" fill="#F2D27A" opacity=".12"/></g>`;
        return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
          <defs><linearGradient id="au-${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3DDC97" stop-opacity="0"/><stop offset=".5" stop-color="#3DDC97" stop-opacity=".8"/><stop offset="1" stop-color="#3DDC97" stop-opacity="0"/></linearGradient></defs>
          <rect width="${W}" height="${H}" fill="#0B1D3A"/>
          <g fill="#E6F4F1">${estrelas}</g>
          <path class="aurora a1" d="M-40 220 C 160 80, 320 260, 520 130 S 860 90, 1240 40 V180 C 980 230, 820 190, 560 250 S 160 220, -40 330Z" fill="url(#au-${u})"/>
          <path class="aurora a2" d="M-40 130 C 220 40, 400 170, 640 80 S 1000 110, 1240 60 V120 C 1000 160, 760 150, 560 190 S 180 170, -40 220Z" fill="url(#au-${u})" opacity=".55"/>
          <path class="aurora a3" d="M200 60 C 380 20, 520 120, 760 50 S 1060 30, 1240 10 V60 C 1000 90, 800 100, 640 120 S 360 100, 200 130Z" fill="url(#au-${u})" opacity=".35"/>
          <path d="M0 330 L120 280 L210 310 L330 250 L440 300 L560 260 L700 310 L820 240 L940 300 L1060 260 L1200 300 V400 H0Z" fill="#13294D"/>
          <path d="M0 380 C 200 340, 380 350, 600 372 S 960 340, 1200 360 V560 H0Z" fill="#E6F4F1"/>
          ${casa(330, 352, 90, "#B5413A")}${casa(470, 372, 70, "#D9A441")}${casa(600, 346, 100, "#2E6F73")}${casa(1100, 368, 70, "#B5413A")}
          <path d="M0 470 C 260 440, 560 480, 820 456 S 1100 470, 1200 460 V560 H0Z" fill="#CFE3E0"/>
          <g fill="#E6F4F1" opacity=".9">${neve}</g>
          <g class="objeto" data-obj="partitura">
            <path d="M190 500 V350 M160 520 L190 500 L220 520" stroke="#1B2533" stroke-width="6" fill="none" stroke-linecap="round"/>
            <path d="M120 350 H260 L250 362 H130Z" fill="#1B2533"/>
            <g transform="rotate(-4 190 290)">
              <rect x="128" y="236" width="124" height="116" fill="#FAFDFC"/>
              <g stroke="#1B2533" stroke-width="1.5">${[256, 264, 272, 280, 288, 306, 314, 322, 330, 338].map((y) => `<line x1="138" y1="${y}" x2="242" y2="${y}"/>`).join("")}</g>
              <g fill="#1B2533">${[[152, 284], [172, 276], [192, 268], [212, 280], [232, 272], [158, 330], [182, 322], [208, 334], [228, 318]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="3.6"/><line x1="${x + 4.5}" y1="${y}" x2="${x + 4.5}" y2="${y - 20}" stroke="#1B2533" stroke-width="1.6"/>`).join("")}</g>
              <text x="190" y="250" text-anchor="middle" font-family="${fonteMaquina}" font-size="9" fill="#1B2533">MÚSICA · 230 h</text>
            </g>
            ${alvo(110, 220, 160, 310)}
          </g>
          <g class="objeto" data-obj="mapa">
            <rect x="826" y="380" width="10" height="110" fill="#3A2F28"/>
            <g transform="rotate(-3 830 340)">
              <rect x="760" y="290" width="140" height="96" fill="#F3EAD6" stroke="#3A2F28" stroke-width="4"/>
              <path d="M790 370 C 784 340, 800 318, 812 306 C 824 330, 816 352, 822 372Z M834 372 C 830 344, 850 320, 860 312 C 868 334, 858 356, 862 374Z" fill="#9CC9B4"/>
              <path d="M774 320 C 770 312, 782 304, 790 312 C 788 322, 780 326, 774 320Z" fill="#9CC9B4"/>
              <g fill="#B5413A">${[[781, 314], [806, 330], [818, 356], [846, 346], [856, 326]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5"/>`).join("")}</g>
            </g>
            ${alvo(750, 280, 160, 220)}
          </g>
          <g class="objeto" data-obj="microfone">
            <path d="M1040 500 V300" stroke="#1B2533" stroke-width="7"/>
            <ellipse cx="1040" cy="504" rx="44" ry="9" fill="#1B2533"/>
            <rect x="1022" y="236" width="36" height="70" rx="18" fill="#C9D6D8" stroke="#1B2533" stroke-width="4"/>
            <path d="M1026 270 H1054" stroke="#1B2533" stroke-width="3"/>
            <g class="brilho-eurovisao" fill="#3DDC97">${[[990, 236, 10], [1094, 226, 13], [1100, 300, 8], [984, 296, 7], [1040, 196, 9]].map(([x, y, s]) => `<path d="M${x} ${y - s} L${x + s * .25} ${y - s * .25} L${x + s} ${y} L${x + s * .25} ${y + s * .25} L${x} ${y + s} L${x - s * .25} ${y + s * .25} L${x - s} ${y} L${x - s * .25} ${y - s * .25}Z"/>`).join("")}</g>
            ${alvo(970, 180, 140, 340)}
          </g>
        </svg>`;
      }
    },

    "africa": {
      pinos: { afrobeats: [520, 312], amapiano: [640, 306], mahraganat: [760, 316], microfone: [1020, 250] },
      svg(u) {
        const R = rnd(17);
        let predios = "", janelas = "";
        [[0, 130, 170], [160, 80, 150], [300, 150, 130], [420, 60, 180], [590, 120, 140], [720, 40, 160], [870, 100, 150], [1010, 70, 190]].forEach(([x, y, w], i) => {
          predios += `<rect x="${x}" y="${y}" width="${w}" height="${460 - y}" fill="${["#222", "#262626", "#1C1C1C"][i % 3]}"/>`;
          for (let yy = y + 20; yy < 420; yy += 30) for (let xx = x + 14; xx < x + w - 16; xx += 24) if (R() > .58) janelas += `<rect x="${xx}" y="${yy}" width="10" height="15" fill="${R() > .5 ? "#E8B10E" : "#F25C54"}" opacity="${r2(.25 + R() * .5)}"/>`;
        });
        const cordao = (y0, curva, n, seed) => {
          const Q = rnd(seed); let s = `<path d="M-10 ${y0} Q600 ${y0 + curva} 1210 ${y0}" stroke="#4A4A4A" stroke-width="2" fill="none"/>`;
          for (let i = 1; i < n; i++) {
            const t = i / n; const x = (1 - t) * (1 - t) * -10 + 2 * (1 - t) * t * 600 + t * t * 1210; const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * (y0 + curva) + t * t * y0;
            const c = ["#E8B10E", "#F25C54", "#F5F1E8"][Math.floor(Q() * 3)];
            s += `<g class="lampada" style="animation-delay:-${r2(Q() * 2)}s"><circle cx="${r2(x)}" cy="${r2(y + 9)}" r="18" fill="${c}" opacity=".18"/><circle cx="${r2(x)}" cy="${r2(y + 9)}" r="6" fill="${c}"/></g>`;
          }
          return s;
        };
        const caixa = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#0E0E0E" stroke="#2C2C2C" stroke-width="3"/><circle class="cone" cx="${x + w / 2}" cy="${y + h * .62}" r="${w * .32}" fill="#262626" stroke="#E8B10E" stroke-width="3"/><circle cx="${x + w / 2}" cy="${y + h * .62}" r="${w * .1}" fill="#3A3A3A"/><circle cx="${x + w / 2}" cy="${y + h * .2}" r="${w * .1}" fill="#262626" stroke="#555" stroke-width="2"/>`;
        const capaGenero = (x, fundo, desenho, nome) => `<g transform="rotate(${x < 600 ? -4 : x > 700 ? 5 : 1} ${x + 50} 360)"><rect x="${x}" y="300" width="100" height="100" fill="${fundo}"/>${desenho}<rect x="${x}" y="384" width="100" height="16" fill="#161616" opacity=".75"/><text x="${x + 50}" y="396" text-anchor="middle" font-family="${fonteMaquina}" font-size="${nome.length > 9 ? 9 : 11}" font-weight="700" fill="#F5F1E8">${nome}</text></g>`;
        return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${W}" height="${H}" fill="#161616"/>
          ${predios}${janelas}
          <rect y="456" width="${W}" height="104" fill="#1E1E1E"/>
          <rect y="452" width="${W}" height="8" fill="#2E2E2E"/>
          <g fill="#2A2A2A">${[80, 300, 520, 740, 960, 1180].map((x) => `<rect x="${x}" y="500" width="70" height="6"/>`).join("")}</g>
          <g class="luzes">${cordao(40, 120, 18, 3)}${cordao(110, 90, 15, 8)}</g>
          <g class="caixas">${caixa(50, 250, 130, 110)}${caixa(50, 360, 130, 100)}${caixa(190, 320, 90, 140)}</g>
          <path d="M440 300 H860 L880 280 H420Z" fill="#0B6E4F"/>
          <path d="M420 280 h46 v12 h-46Z M512 280 h46 v12 h-46Z M604 280 h46 v12 h-46Z M696 280 h46 v12 h-46Z M788 280 h46 v12 h-46Z" fill="#E8B10E"/>
          <rect x="440" y="400" width="420" height="20" fill="#0B6E4F"/><rect x="460" y="420" width="12" height="40" fill="#0A5A41"/><rect x="828" y="420" width="12" height="40" fill="#0A5A41"/>
          <rect x="452" y="386" width="396" height="16" fill="#5B3A22"/>
          <g class="objeto" data-obj="afrobeats">${capaGenero(470, "#E8B10E", `<circle cx="520" cy="342" r="30" fill="#F25C54"/><circle cx="520" cy="342" r="14" fill="#161616"/><circle cx="548" cy="316" r="8" fill="#161616"/>`, "AFROBEATS")}${alvo(462, 292, 116, 116)}</g>
          <g class="objeto" data-obj="amapiano">${capaGenero(590, "#F25C54", `<g fill="#161616">${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${598 + i * 15}" y="${312 + (i % 2) * 8}" width="8" height="${60 - (i % 3) * 14}"/>`).join("")}</g>`, "AMAPIANO")}${alvo(582, 292, 116, 116)}</g>
          <g class="objeto" data-obj="mahraganat">${capaGenero(710, "#F5F1E8", `<path d="M716 330 l14 -16 l14 16 l14 -16 l14 16 l14 -16 l14 16 M716 360 l14 -16 l14 16 l14 -16 l14 16 l14 -16 l14 16" stroke="#0B6E4F" stroke-width="6" fill="none"/>`, "MAHRAGANAT")}${alvo(702, 292, 116, 116)}</g>
          <g class="objeto" data-obj="microfone">
            <path d="M1020 456 V290" stroke="#555" stroke-width="7"/>
            <path d="M985 460 L1020 440 L1055 460" stroke="#555" stroke-width="6" fill="none"/>
            <rect x="1004" y="226" width="32" height="64" rx="16" fill="#3A3A3A" stroke="#E8B10E" stroke-width="3"/>
            <g fill="#6A6A6A">${[238, 248, 258].map((y) => `<rect x="1010" y="${y}" width="20" height="3"/>`).join("")}</g>
            <path d="M1020 456 C 1060 500, 1110 470, 1150 520" stroke="#2A2A2A" stroke-width="5" fill="none"/>
            ${alvo(970, 210, 110, 270)}
          </g>
        </svg>`;
      }
    },

    "leste-asiatico": {
      pinos: { abertura: [225, 150], parada: [1010, 150] },
      svg(u) {
        const R = rnd(21);
        let raios = "";
        for (let i = 0; i < 90; i++) {
          const a = (i / 90) * Math.PI * 2 + R() * .03, a2 = a + .012 + R() * .025;
          const r0 = 150 + R() * 60, r1 = 900;
          raios += `<path d="M${r2(600 + Math.cos(a) * r0)} ${r2(260 + Math.sin(a) * r0)} L${r2(600 + Math.cos(a) * r1)} ${r2(260 + Math.sin(a) * r1)} L${r2(600 + Math.cos(a2) * r1)} ${r2(260 + Math.sin(a2) * r1)}Z"/>`;
        }
        const nuvem = (x, y, s) => `<path d="M${x} ${y} c ${-30 * s} 0 ${-34 * s} ${-36 * s} ${-4 * s} ${-40 * s} c ${4 * s} ${-28 * s} ${48 * s} ${-30 * s} ${56 * s} ${-6 * s} c ${18 * s} ${-18 * s} ${52 * s} ${-6 * s} ${46 * s} ${18 * s} c ${30 * s} ${2 * s} ${28 * s} ${30 * s} ${0} ${28 * s}Z" fill="#fff" stroke="#8E6CCF" stroke-width="3"/>`;
        return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="grama-${u}" width="120" height="560" patternUnits="userSpaceOnUse"><rect width="60" height="560" fill="#BFE0F5"/><rect x="60" width="60" height="560" fill="#ADD7F2"/></pattern></defs>
          <rect width="${W}" height="${H}" fill="#E4F2FC"/>
          <g class="raios" fill="#8E6CCF" opacity=".16">${raios}</g>
          ${nuvem(180, 100, 1.2)}${nuvem(920, 80, 1)}${nuvem(1120, 150, .7)}
          <path d="M0 300 C 300 270, 900 270, 1200 300 V560 H0Z" fill="url(#grama-${u})"/>
          <path d="M0 300 C 300 270, 900 270, 1200 300" stroke="#fff" stroke-width="5" fill="none"/>
          <path d="M600 330 L860 440 L600 560 L340 440Z" fill="#E3D9F7"/>
          <path d="M600 360 L800 440 L600 530 L400 440Z" fill="url(#grama-${u})"/>
          <path d="M600 330 L860 440 L600 560 L340 440Z" fill="none" stroke="#fff" stroke-width="5"/>
          <ellipse cx="600" cy="445" rx="38" ry="14" fill="#E3D9F7"/><rect x="592" y="438" width="16" height="5" fill="#fff"/>
          <g fill="#fff" stroke="#8E6CCF" stroke-width="2"><rect x="850" y="432" width="18" height="18" transform="rotate(45 859 441)"/><rect x="332" y="432" width="18" height="18" transform="rotate(45 341 441)"/><rect x="591" y="321" width="18" height="18" transform="rotate(45 600 330)"/></g>
          <g class="bola-voando">
            <g stroke="#8EC9F0" stroke-width="7" stroke-linecap="round"><line class="vel" x1="340" y1="220" x2="520" y2="220"/><line class="vel" x1="380" y1="246" x2="530" y2="246"/><line class="vel" x1="300" y1="196" x2="500" y2="196"/></g>
            <circle cx="580" cy="222" r="38" fill="#fff" stroke="#2A2140" stroke-width="4"/>
            <path d="M556 194 C 570 212, 570 232, 556 250 M604 194 C 590 212, 590 232, 604 250" stroke="#6B4BB0" stroke-width="3" fill="none" stroke-dasharray="5 4"/>
          </g>
          <g class="objeto" data-obj="abertura">
            <rect x="214" y="250" width="12" height="70" fill="#2A2140"/>
            <g transform="rotate(-6 225 180)">
              <rect x="110" y="120" width="230" height="130" fill="#2A2140"/>
              <rect x="120" y="130" width="210" height="110" fill="none" stroke="#8EC9F0" stroke-width="3"/>
              <text x="225" y="178" text-anchor="middle" font-family="${fonteTitulo}" font-size="34" font-weight="900" font-style="italic" fill="#FAF7FF">ABERTURA</text>
              <text x="225" y="214" text-anchor="middle" font-family="${fonteMaquina}" font-size="14" font-weight="700" fill="#8EC9F0">OP · 01</text>
              <path d="M330 116 l6 14 l14 6 l-14 6 l-6 14 l-6 -14 l-14 -6 l14 -6Z" fill="#8E6CCF"/>
            </g>
            ${alvo(100, 100, 260, 230)}
          </g>
          <g class="objeto" data-obj="parada">
            <rect x="1004" y="250" width="12" height="80" fill="#2A2140"/>
            <rect x="900" y="110" width="220" height="150" fill="#2A2140"/>
            <text x="1010" y="142" text-anchor="middle" font-family="${fonteMaquina}" font-size="15" font-weight="700" fill="#8EC9F0" letter-spacing="3">PARADA</text>
            ${[0, 1, 2].map((i) => `<text x="924" y="${176 + i * 28}" font-family="${fonteMaquina}" font-size="16" font-weight="700" fill="#FAF7FF">${i + 1}</text><rect class="barra-parada" style="animation-delay:${i * .2}s" x="946" y="${163 + i * 28}" width="${150 - i * 18}" height="16" fill="${["#8E6CCF", "#A98BE0", "#C4AEEE"][i]}"/>`).join("")}
            ${alvo(890, 100, 240, 240)}
          </g>
        </svg>`;
      }
    }
  };

  function cena(id) {
    const c = cenarios[id];
    return c ? { svg: c.svg(`${id}-c${++contadorUid}`), pinos: c.pinos } : null;
  }

  window.ILUSTRACOES = { capa, cena, tocaDiscos, rnd };
})();
