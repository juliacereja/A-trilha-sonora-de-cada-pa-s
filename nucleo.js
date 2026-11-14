/* ==========================================================
   Núcleo: utilidades, barras, som, paletas e a sala.
   Os capítulos (cap1-jogo.js etc.) usam o que está aqui.
   ========================================================== */
(() => {
  "use strict";

  const D = window.SITE_DATA;
  const IL = window.ILUSTRACOES;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esperar = (ms) => new Promise((r) => setTimeout(r, reduz ? 0 : ms));

  const cacheFmt = {};
  const fmt = (v, c = 3) => (cacheFmt[c] ||= new Intl.NumberFormat("pt-BR", { minimumFractionDigits: c, maximumFractionDigits: c })).format(v);

  function el(tag, attrs = {}, ...filhos) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
      else if (k === "html") n.innerHTML = v;
      else if (k.startsWith("on") && typeof v === "function") n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? "" : v);
    }
    for (const f of filhos.flat()) if (f != null && f !== false) n.append(f.nodeType ? f : document.createTextNode(f));
    return n;
  }

  const ICONE = {
    seta: '<svg class="ic seta" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="square" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>',
    volta: '<svg class="ic seta-volta" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="square" aria-hidden="true"><path d="M20 12H5M11 6l-6 6 6 6"/></svg>',
    esq: '<svg class="ic" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="square" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    dir: '<svg class="ic" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="square" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
    pausa: '<svg class="ic" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>',
    play: '<svg class="ic" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4l13 8-13 8z"/></svg>',
    som: '<svg class="ic" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path class="ondas" d="M16 9c1.5 1.6 1.5 4.4 0 6M18.5 6.5c3 3 3 8 0 11"/><path class="mudo" d="M16 9l6 6M22 9l-6 6"/></svg>'
  };

  function botao({ texto, href = null, tipo = "principal", volta = false, onclick = null, extraClasse = "" }) {
    const n = href ? el("a", { class: `btn btn-${tipo} ${extraClasse}`, href }) : el("button", { class: `btn btn-${tipo} ${extraClasse}`, type: "button" });
    n.innerHTML = volta ? `${ICONE.volta}<span></span>` : `<span></span>${ICONE.seta}`;
    $("span", n).textContent = texto;
    n.addEventListener("click", (e) => { som.clique(); if (onclick) onclick(e); });
    return n;
  }

  function animarNumero(no, para, casas = 3, sufixo = "", duracao = 800) {
    const de = parseFloat(no.dataset.valor ?? para);
    no.dataset.valor = para;
    if (reduz || de === para) { no.textContent = fmt(para, casas) + sufixo; return; }
    const t0 = performance.now();
    const passo = (t) => {
      const p = Math.min(1, (t - t0) / duracao), e = 1 - Math.pow(1 - p, 3);
      no.textContent = fmt(de + (para - de) * e, casas) + sufixo;
      if (p < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  }

  function descreverBarras(vals, ref) {
    let t = D.barras.map((b) => `${b.nome} ${fmt(vals[b.chave])}`).join(", ");
    if (ref) t += ". Média dos 70 países: " + D.barras.map((b) => `${b.nome.toLowerCase()} ${fmt(ref[b.chave])}`).join(", ");
    return t;
  }

  // As três barras (equalizador)
  function criarEq({ valores, ref = null, rotulo = null, classe = "" }) {
    const raiz = el("span", { class: `eq ${classe}`, role: "img" });
    const cols = D.barras.map((b, i) => {
      const preench = el("span", { class: "eq-preench" });
      const trilho = el("span", { class: "eq-trilho" }, preench);
      const refEl = ref ? el("span", { class: "eq-ref" }) : null;
      if (refEl) trilho.append(refEl);
      const valor = el("span", { class: "eq-valor", "aria-hidden": "true" });
      raiz.append(el("span", { class: "eq-col", style: `--c: var(--b${i + 1})` }, trilho, el("span", { class: "eq-nome", "aria-hidden": "true", text: b.nome }), valor));
      return { b, preench, refEl, valor };
    });
    let atual = { valores, ref, rotulo };
    const api = {
      el: raiz,
      definir(vals, novaRef = atual.ref, novoRotulo = atual.rotulo) {
        atual = { valores: vals, ref: novaRef, rotulo: novoRotulo };
        cols.forEach((c) => {
          c.preench.style.setProperty("--v", vals[c.b.chave]);
          animarNumero(c.valor, vals[c.b.chave]);
          if (c.refEl && novaRef) c.refEl.style.setProperty("--r", novaRef[c.b.chave]);
        });
        raiz.setAttribute("aria-label", (novoRotulo ? novoRotulo + ": " : "") + descreverBarras(vals, novaRef));
      },
      tocar() {
        if (reduz) return api.definir(atual.valores, atual.ref, atual.rotulo);
        cols.forEach((c) => { c.preench.style.transition = "none"; c.preench.style.setProperty("--v", 0); c.valor.dataset.valor = 0; });
        void raiz.offsetHeight;
        requestAnimationFrame(() => {
          cols.forEach((c, i) => { c.preench.style.transition = ""; c.preench.style.transitionDelay = `${i * 90}ms`; });
          api.definir(atual.valores, atual.ref, atual.rotulo);
          setTimeout(() => cols.forEach((c) => (c.preench.style.transitionDelay = "")), 1200);
        });
      }
    };
    api.definir(valores, ref, rotulo);
    return api;
  }

  const textoPaises = (lista) => lista.join(", ").replace(/, ([^,]*)$/, " e $1");
  function preposicao(nome) {
    const fem = ["Indonésia", "Malásia", "Romênia", "Bulgária", "Hungria", "Eslováquia", "Guatemala", "Costa Rica", "Finlândia", "Islândia", "Dinamarca", "Suécia", "Noruega", "Nigéria", "África do Sul", "Coreia do Sul"];
    if (["Taiwan", "Hong Kong"].includes(nome)) return "de";
    return fem.includes(nome) ? "da" : "do";
  }
  function embaralhar(a) {
    const b = a.slice();
    for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
    return b;
  }
  function anunciar(t) {
    const a = $("#anuncio"); if (!a) return;
    a.textContent = ""; setTimeout(() => (a.textContent = t), 30);
  }

  // ---------------- Som (Web Audio, sem arquivos) ----------------
  const som = (() => {
    let ctx = null, ligado = false;
    try { ligado = localStorage.getItem("ts-som") === "1"; } catch (e) { /* sem armazenamento */ }
    const garantir = () => {
      if (!ctx) { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; ctx = new AC(); }
      if (ctx.state === "suspended") ctx.resume();
      return ctx;
    };
    function tom({ freq = 440, fim = null, dur = .1, tipo = "sine", vol = .2, atraso = 0 }) {
      const c = garantir(); if (!c) return;
      const t = c.currentTime + atraso, o = c.createOscillator(), g = c.createGain();
      o.type = tipo; o.frequency.setValueAtTime(freq, t);
      if (fim) o.frequency.exponentialRampToValueAtTime(fim, t + dur);
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur + .02);
    }
    function ruido({ dur = .05, vol = .15, filtro = 2000, atraso = 0 }) {
      const c = garantir(); if (!c) return;
      const t = c.currentTime + atraso, n = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
      const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
      s.buffer = buf; f.type = "lowpass"; f.frequency.value = filtro; g.gain.value = vol;
      s.connect(f).connect(g).connect(c.destination); s.start(t);
    }
    return {
      get ligado() { return ligado; },
      alternar(v) {
        ligado = v ?? !ligado;
        try { localStorage.setItem("ts-som", ligado ? "1" : "0"); } catch (e) { /* ok */ }
        if (ligado) { garantir(); tom({ freq: 880, dur: .08, vol: .08, tipo: "triangle" }); }
        return ligado;
      },
      clique() { if (ligado) { ruido({ dur: .025, vol: .18, filtro: 3500 }); tom({ freq: 1600, dur: .025, vol: .03, tipo: "square" }); } },
      deslizar() { if (ligado) ruido({ dur: .45, vol: .07, filtro: 900 }); },
      agulha() {
        if (!ligado) return;
        tom({ freq: 95, fim: 38, dur: .3, vol: .45 });
        ruido({ dur: .06, vol: .25, filtro: 1800 });
        for (let i = 0; i < 9; i++) ruido({ dur: .01, vol: .08 + Math.random() * .08, filtro: 4000, atraso: .25 + Math.random() * 1.4 });
      },
      // O tambor da África toca sempre: é a própria interação
      tambor(n = 0) {
        const base = [55, 65.4, 73.4, 82.4][n % 4];
        tom({ freq: base * 2.2, fim: base, dur: .55, vol: .7 });
        tom({ freq: base * 4, fim: base * 2, dur: .12, vol: .18, tipo: "triangle" });
        ruido({ dur: .02, vol: .15, filtro: 1500 });
      }
    };
  })();

  // ---------------- Paletas ----------------
  const VARS = { bg: "--bg", texto: "--texto", suave: "--suave", destaque: "--destaque", sobreDestaque: "--sobre-destaque", destaqueTexto: "--destaque-texto", barra: "--barra", detalhe: "--detalhe" };
  function aplicarPaleta(p, modo = "geral") {
    const raiz = document.documentElement;
    for (const [k, v] of Object.entries(VARS)) if (p[k]) raiz.style.setProperty(v, p[k]);
    const barras = p.barras || [p.barra, p.barra, p.barra];
    barras.forEach((c, i) => raiz.style.setProperty(`--b${i + 1}`, c));
    raiz.dataset.modo = modo;
    const meta = $('meta[name="theme-color"]'); if (meta) meta.setAttribute("content", p.bg);
  }

  // ---------------- A sala ----------------
  const sala = {
    montar() {
      const raiz = $("#sala");
      const R = IL.rnd(42);
      const cores = ["#C44536", "#E3A72F", "#2E6F73", "#EFE6D2", "#1D1D1F", "#7A8B6F", "#D98C6C", "#3B5A7A", "#B9A27A", "#8E3B46", "#F2B705", "#5B4A3F"];
      let lombadas = "";
      for (let i = 0; i < 160; i++) {
        const w = Math.round(5 + R() * 9), h = Math.round(80 + R() * 20), c = cores[Math.floor(R() * cores.length)];
        const inclinada = R() > .965 ? ` style="--w:${w}px;--h:${h}%;--c:${c};transform:rotate(${(R() * 10 - 5).toFixed(1)}deg)"` : ` style="--w:${w}px;--h:${h}%;--c:${c}"`;
        lombadas += `<span${inclinada}></span>`;
        if (R() > .93) lombadas += '<i class="vao-livro"></i>';
      }
      raiz.innerHTML = '<div class="sala-luz"></div>';
      const moveis = document.createElement("div");
      moveis.className = "moveis";
      moveis.setAttribute("aria-hidden", "true");
      document.body.append(moveis);
      moveis.innerHTML = `
        <div class="chao">
          <div class="rodape-parede"></div>
          <div class="piso"></div>
          <div class="estante"><div class="estante-vao"><div class="lombadas">${lombadas}</div></div><div class="estante-pes"></div></div>
          <div class="movel"><div class="movel-portas"><span></span><span></span></div></div>
        </div>
        <div class="toca-discos">${IL.tocaDiscos()}</div>`;
    },
    colocarDisco(regiao) {
      const rot = $(".tt-rotulo"), rot2 = $(".tt-rotulo2");
      if (!rot) return;
      if (regiao) { rot.setAttribute("fill", regiao.corMapa); rot2.setAttribute("stroke", regiao.paleta.detalhe === regiao.corMapa ? regiao.paleta.texto : regiao.paleta.detalhe); }
      else { rot.setAttribute("fill", "#FF5A36"); rot2.setAttribute("stroke", "#F7F5F0"); }
    },
    tocar() { $(".toca-discos").classList.add("tocando"); },
    parar() { $(".toca-discos").classList.remove("tocando"); },
    tocando() { return $(".toca-discos").classList.contains("tocando"); },
    discoRect() { return $(".tt-vinil").getBoundingClientRect(); },
    async apagar(fn) {
      const a = $("#apagao");
      if (reduz) { fn(); return; }
      a.classList.add("ativo");
      await esperar(380);
      fn();
      await esperar(120);
      a.classList.remove("ativo");
    }
  };

  window.TS = { D, IL, $, $$, el, fmt, reduz, esperar, ICONE, botao, animarNumero, criarEq, descreverBarras, textoPaises, preposicao, embaralhar, anunciar, som, aplicarPaleta, sala, capitulos: {} };
})();
