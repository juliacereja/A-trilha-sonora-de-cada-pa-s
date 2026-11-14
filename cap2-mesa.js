/* ==========================================================
   Capítulo 2: a mesa de som (fader e medidores VU)
   e a dispersão "cada disco é um país"
   ========================================================== */
(() => {
  "use strict";
  const T = window.TS;
  const { D, el, fmt, reduz, botao, som, anunciar } = T;
  const C = D.capitulos.grupos;
  let agulhas = [], grupoAtual = 0;

  const ang = (v) => -50 + v * 100;
  function vuSVG() {
    let ticks = "";
    for (let i = 0; i <= 10; i++) {
      const a = (ang(i / 10) * Math.PI) / 180, maior = i % 5 === 0, r0 = 60, r1 = maior ? 74 : 69;
      ticks += `<line x1="${(80 + r0 * Math.sin(a)).toFixed(1)}" y1="${(92 - r0 * Math.cos(a)).toFixed(1)}" x2="${(80 + r1 * Math.sin(a)).toFixed(1)}" y2="${(92 - r1 * Math.cos(a)).toFixed(1)}" stroke="#1D1D1F" stroke-width="${maior ? 2 : 1.2}"/>`;
      if (maior) ticks += `<text x="${(80 + 82 * Math.sin(a)).toFixed(1)}" y="${(96 - 82 * Math.cos(a)).toFixed(1)}" text-anchor="middle" font-family="Courier Prime, monospace" font-size="9" font-weight="700" fill="#1D1D1F">${["0", "0,5", "1"][i / 5]}</text>`;
    }
    const arco = (a0, a1, r) => { const p = (a) => [80 + r * Math.sin((a * Math.PI) / 180), 92 - r * Math.cos((a * Math.PI) / 180)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`; };
    return `<svg viewBox="0 0 160 104" aria-hidden="true">
      <rect x="2" y="2" width="156" height="100" rx="3" fill="#F3E9D2"/>
      <path d="${arco(-50, 50, 66)}" stroke="#1D1D1F" stroke-width="1.5" fill="none"/>
      <path d="${arco(25, 50, 66)}" stroke="#B8360F" stroke-width="4" fill="none"/>
      ${ticks}
      <text x="80" y="60" text-anchor="middle" font-family="Courier Prime, monospace" font-size="10" font-weight="700" fill="#6A6259">VU</text>
      <g class="vu-agulha"><line x1="80" y1="92" x2="80" y2="22" stroke="#B8360F" stroke-width="2.2" stroke-linecap="round"/></g>
      <rect x="2" y="84" width="156" height="18" fill="#2A2622"/>
      <circle cx="80" cy="92" r="7" fill="#1D1D1F"/>
    </svg>`;
  }

  function montar(sec) {
    const miolo = el("div", { class: "miolo" });
    sec.append(miolo);

    // --- medidores
    const vus = el("div", { class: "vus" });
    const valores = [];
    agulhas = [];
    D.barras.forEach((b) => {
      const vu = el("div", { class: "vu" });
      vu.innerHTML = vuSVG();
      const valor = el("div", { class: "vu-valor" });
      vu.append(el("div", { class: "vu-nome", text: b.nome }), valor);
      vus.append(vu);
      agulhas.push(vu.querySelector(".vu-agulha"));
      valores.push(valor);
    });
    const lcdFaixa = el("span"), lcdPaises = el("span");
    const lcd = el("div", { class: "lcd", "aria-live": "polite" }, lcdFaixa, lcdPaises);

    // --- fader
    const fader = el("div", { class: "fader", role: "slider", tabindex: "0", "aria-label": "Fader da mesa: grupo de países", "aria-valuemin": "0", "aria-valuemax": "2" });
    [0, 50, 100].forEach((x) => fader.append(el("span", { class: "fader-marca", style: `left:${x}%`, "aria-hidden": "true" })));
    fader.append(el("span", { class: "fader-cap", "aria-hidden": "true" }));
    const rotulos = el("div", { class: "fader-rotulos" });
    const botoesRot = C.grupos.map((g, i) => {
      const b = el("button", { type: "button", text: g.nome });
      b.addEventListener("click", () => definirP(i, true));
      rotulos.append(b);
      return b;
    });
    const knobs = el("div", { class: "knobs", "aria-hidden": "true" });
    [-40, 20, 70, -10, 35, -65].forEach((g) => knobs.append(el("span", { style: `--g:${g}deg` })));
    const mesa = el("div", { class: "mesa" },
      el("div", { class: "mesa-marca", "aria-hidden": "true" }, el("span", { text: "TS-70 · mesa de som" }), el("span", { text: "70 países" })),
      vus, lcd, el("div", { class: "fader-area" }, rotulos, fader), knobs);

    // --- texto depois da primeira mexida
    const depois = el("div", { class: "depois-troca", hidden: true, "aria-live": "polite" },
      el("div", { class: "folha fita" },
        el("p", { text: C.textoDepoisDaTroca }),
        el("div", { class: "correlacao", "aria-hidden": "true" },
          el("strong", { text: "-0,02" }),
          el("div", { style: "flex:1 1 200px" },
            el("div", { class: "correlacao-escala" }, el("span", { class: "zero" }), el("span", { class: "marcador", style: "--c:-0.02" })),
            el("div", { class: "correlacao-rotulos" }, el("span", { text: "-1" }), el("span", { text: "0 = nenhuma relação" }), el("span", { text: "1" }))))));

    miolo.append(
      el("div", { class: "mesa-layout" },
        el("div", {},
          el("p", { class: "chapeu", text: "Lado A · Faixa 2" }),
          el("h1", { id: "titulo-grupos", tabindex: "-1", text: C.titulo }),
          el("p", { class: "lide", text: C.texto }),
          el("p", { class: "mesa-dica", text: C.dicaMesa })),
        el("div", { class: "mesa-wrap" }, mesa, el("div", { class: "mesa-suporte", "aria-hidden": "true" })),
        depois),
      dispersao(),
      el("div", { class: "fim-capitulo" }, botao({ texto: C.botaoProximo, href: "#mapa" })));

    // --- lógica
    let p = 0, mexeu = false;
    grupoAtual = -1;
    function aplicarGrupo(g, inicial = false) {
      if (g === grupoAtual) return;
      grupoAtual = g;
      const G = C.grupos[g];
      D.barras.forEach((b, i) => {
        agulhas[i].style.transform = `rotate(${ang(G[b.chave])}deg)`;
        T.animarNumero(valores[i], G[b.chave]);
      });
      lcdFaixa.textContent = `Felicidade ${G.faixa}`;
      lcdPaises.textContent = `${G.paises} países`;
      fader.setAttribute("aria-valuenow", g);
      fader.setAttribute("aria-valuetext", `${G.nome}: alegria ${fmt(G.alegria)}, energia ${fmt(G.energia)}, dança ${fmt(G.danca)}`);
      botoesRot.forEach((b, i) => b.setAttribute("aria-current", i === g ? "true" : "false"));
      if (!inicial) {
        som.clique();
        if (!mexeu) { mexeu = true; depois.hidden = false; }
      }
    }
    function definirP(np, soltar = false) {
      p = Math.max(0, Math.min(2, np));
      if (soltar) p = Math.round(p);
      fader.style.setProperty("--p", p);
      aplicarGrupo(Math.round(p));
    }
    const mover = (e) => { const r = fader.getBoundingClientRect(); definirP(((e.clientX - r.left) / r.width) * 2); };
    fader.addEventListener("pointerdown", (e) => {
      e.preventDefault(); fader.setPointerCapture(e.pointerId); fader.classList.add("arrastando"); fader.focus({ preventScroll: true }); mover(e);
      const mv = (ev) => mover(ev);
      const up = () => { fader.classList.remove("arrastando"); definirP(p, true); fader.removeEventListener("pointermove", mv); fader.removeEventListener("pointerup", up); fader.removeEventListener("pointercancel", up); };
      fader.addEventListener("pointermove", mv); fader.addEventListener("pointerup", up); fader.addEventListener("pointercancel", up);
    });
    fader.addEventListener("keydown", (e) => {
      const d = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 }[e.key];
      if (d) { e.preventDefault(); definirP(Math.round(p) + d, true); }
      else if (e.key === "Home") { e.preventDefault(); definirP(0, true); }
      else if (e.key === "End") { e.preventDefault(); definirP(2, true); }
    });
    fader.style.setProperty("--p", 0);
    aplicarGrupo(0, true);
  }

  // ---------- Dispersão: cada disco é um país ----------
  function dispersao() {
    const regiaoDe = {};
    D.regioes.forEach((r) => r.paises.forEach((p) => (regiaoDe[p] = r)));
    const lista = Object.keys(D.paises).map((nome) => ({ nome, ...D.paises[nome], cor: regiaoDe[nome]?.corMapa || "#888" })).sort((a, b) => a.felicidade - b.felicidade);
    const W = 640, H = 340, m = { l: 54, r: 18, t: 14, b: 46 };
    const x = (v) => m.l + ((v - 3.5) / (8 - 3.5)) * (W - m.l - m.r);
    const y = (v) => H - m.b - ((v - .35) / (.72 - .35)) * (H - m.t - m.b);
    let eixos = "";
    for (let v = 4; v <= 8; v++) eixos += `<line x1="${x(v)}" y1="${m.t}" x2="${x(v)}" y2="${H - m.b}"/><text x="${x(v)}" y="${H - m.b + 18}" text-anchor="middle">${v}</text>`;
    [.4, .5, .6, .7].forEach((v) => (eixos += `<line x1="${m.l}" y1="${y(v)}" x2="${W - m.r}" y2="${y(v)}"/><text x="${m.l - 8}" y="${y(v) + 4}" text-anchor="end">${fmt(v, 1)}</text>`));
    eixos += `<text x="${(W + m.l) / 2}" y="${H - 6}" text-anchor="middle">Felicidade (0 a 10)</text><text x="14" y="${(H - m.b) / 2}" text-anchor="middle" transform="rotate(-90 14 ${(H - m.b) / 2})">Alegria do top 50</text>`;
    const media = `<line x1="${x(D.media.felicidade)}" y1="${m.t}" x2="${x(D.media.felicidade)}" y2="${H - m.b}" stroke="var(--texto)" stroke-dasharray="4 4" opacity=".6"/><line x1="${m.l}" y1="${y(D.media.alegria)}" x2="${W - m.r}" y2="${y(D.media.alegria)}" stroke="var(--texto)" stroke-dasharray="4 4" opacity=".6"/><text x="${x(D.media.felicidade) + 5}" y="${m.t + 12}" font-family="Courier Prime, monospace" font-size="11" fill="var(--suave)">média</text>`;
    const pontos = lista.map((p, i) => `<g transform="translate(${x(p.felicidade).toFixed(1)} ${y(p.alegria).toFixed(1)})"><g class="ponto-disco" data-i="${i}"><circle r="10" fill="#151515"/><circle r="7" fill="none" stroke="#333" stroke-width="1"/><circle r="4" fill="${p.cor}"/><circle r="1.2" fill="#EFE6D2"/></g></g>`).join("");
    const fig = el("figure", { class: "dispersao-fig" });
    fig.innerHTML = `<svg viewBox="0 0 ${W} ${H}" tabindex="0" role="group" aria-label="Gráfico de dispersão com 24 países. Use as setas para percorrer."><g class="eixo">${eixos}</g>${media}${pontos}</svg>`;
    const dica = el("div", { class: "dica-flutuante", "aria-hidden": "true" });
    const vivo = el("p", { class: "sr-only", "aria-live": "polite" });
    fig.append(dica, vivo);
    const svg = fig.querySelector("svg");
    let ativo = -1;
    function mostrar(i) {
      const p = lista[i];
      fig.querySelectorAll(".ponto-disco").forEach((g) => g.classList.toggle("ativo", +g.dataset.i === i));
      dica.innerHTML = "";
      dica.append(el("strong", { text: p.nome }), `felicidade ${fmt(p.felicidade, 2)} · alegria ${fmt(p.alegria)}`);
      dica.style.left = `${(x(p.felicidade) / W) * 100}%`;
      dica.style.top = `${(y(p.alegria) / H) * 100}%`;
      dica.classList.add("visivel");
      vivo.textContent = `${p.nome}: felicidade ${fmt(p.felicidade, 2)}, alegria ${fmt(p.alegria)}`;
      ativo = i;
    }
    function esconder() { dica.classList.remove("visivel"); fig.querySelectorAll(".ponto-disco.ativo").forEach((g) => g.classList.remove("ativo")); }
    fig.querySelectorAll(".ponto-disco").forEach((g) => {
      g.addEventListener("pointerenter", () => mostrar(+g.dataset.i));
      g.addEventListener("pointerleave", esconder);
      g.addEventListener("click", () => mostrar(+g.dataset.i));
    });
    svg.addEventListener("keydown", (e) => {
      const d = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
      if (!d) return;
      e.preventDefault();
      mostrar(((ativo < 0 ? (d > 0 ? -1 : 0) : ativo) + d + lista.length) % lista.length);
    });
    svg.addEventListener("blur", esconder);
    return el("section", { class: "dispersao", "aria-labelledby": "titulo-dispersao" },
      el("div", { class: "folha fita" },
        el("h2", { id: "titulo-dispersao", text: C.tituloDispersao }),
        el("p", { class: "nota", style: "margin-top:.4rem;max-width:70ch", text: C.legendaDispersao }),
        fig));
  }

  function entrar() {
    if (reduz || grupoAtual < 0) return;
    const G = C.grupos[grupoAtual];
    agulhas.forEach((a) => { a.style.transition = "none"; a.style.transform = `rotate(${ang(0)}deg)`; });
    void agulhas[0]?.getBoundingClientRect();
    requestAnimationFrame(() => agulhas.forEach((a, i) => { a.style.transition = ""; a.style.transitionDelay = `${200 + i * 120}ms`; a.style.transform = `rotate(${ang(G[D.barras[i].chave])}deg)`; }));
    setTimeout(() => agulhas.forEach((a) => (a.style.transitionDelay = "")), 1600);
  }

  T.capitulos.grupos = { montar, entrar };
})();
