/* ==========================================================
   Capítulo 3: a parede de discos (carrossel), o toca-discos
   e a página de cada região (cenário, encartes, Lado B).
   ========================================================== */
(() => {
  "use strict";
  const T = window.TS;
  const { D, IL, $, $$, el, fmt, reduz, esperar, ICONE, botao, criarEq, textoPaises, preposicao, som, sala, anunciar } = T;

  let idx = 0, animando = false, tocadoPorAnimacao = null;
  let itens = [], trilho = null, legenda = {}, posterSel = null, prevK = [];
  const rots = [-2.2, 1.6, -1, 2.4, -1.8, 1.2];

  // ====================================================
  // A PAREDE DE DISCOS
  // ====================================================
  function montarMapa(sec) {
    const C = D.capitulos.mapa;
    const miolo = el("div", { class: "miolo" });
    sec.append(miolo);

    const fig = el("figure", { class: "poster-mapa", "aria-hidden": "true" });
    const folhaPoster = el("div", { class: "folha fita" });
    fig.append(folhaPoster, el("figcaption", { text: "Onde fica o disco do centro" }));

    miolo.append(
      el("div", { class: "mapa-cab" },
        el("div", {},
          el("p", { class: "chapeu", text: "Lado B · Faixa 3" }),
          el("h1", { id: "titulo-mapa", tabindex: "-1", text: C.titulo }),
          el("p", { class: "lide", text: C.texto })),
        el("p", { class: "adesivo-81" }, el("strong", { text: `${C.numeroDestaque}%` }), el("span", { text: C.legendaDestaque })),
        fig)
    );

    // Carrossel
    const secao = el("section", { class: "parede-discos", "aria-roledescription": "carrossel", "aria-label": "Parede de discos das regiões" });
    trilho = el("div", { class: "trilho-discos" });
    itens = D.regioes.map((r, i) => {
      const b = el("button", { class: "disco-parede", type: "button", "data-i": i });
      b.append(el("span", { class: "dp-vinil vinil", style: `--rotulo:${r.corMapa}`, "aria-hidden": "true" }));
      const capa = el("span", { class: "dp-capa", "aria-hidden": "true" });
      capa.innerHTML = IL.capa(r.id, `parede`);
      b.append(capa);
      b.addEventListener("click", (e) => {
        if (ignorarClique) { e.preventDefault(); return; }
        if (i === idx) tocar(i); else { som.clique(); irPara(i); }
      });
      trilho.append(b);
      return b;
    });
    prevK = itens.map(() => 0);

    legenda.faixa = el("p", { class: "dp-faixa" });
    legenda.titulo = el("h2", { class: "dp-titulo" });
    legenda.sub = el("p", { class: "dp-sub" });
    const vivo = el("p", { class: "sr-only", "aria-live": "polite" });
    legenda.vivo = vivo;

    const anterior = el("button", { class: "dp-seta", type: "button", "aria-label": "Disco anterior", html: ICONE.esq, onclick: () => { som.clique(); irPara(idx - 1); } });
    const proximo = el("button", { class: "dp-seta", type: "button", "aria-label": "Próximo disco", html: ICONE.dir, onclick: () => { som.clique(); irPara(idx + 1); } });
    const botaoTocar = botao({ texto: "Tocar este disco", onclick: () => tocar(idx) });
    botaoTocar.querySelector(".ic").outerHTML = ICONE.play;

    secao.append(trilho,
      el("div", { class: "dp-legenda" }, legenda.faixa, legenda.titulo, legenda.sub),
      el("div", { class: "dp-controles" }, anterior, botaoTocar, proximo),
      el("p", { class: "dp-dica", text: C.dicaCarrossel }), vivo);

    secao.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); irPara(idx - 1); focarCentro(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); irPara(idx + 1); focarCentro(); }
    });

    miolo.append(secao, el("div", { class: "fim-capitulo" }, botao({ texto: C.botaoProximo, href: "#resposta", tipo: "secundario" })));

    configurarArrasto();
    posicionar();
    window.addEventListener("resize", () => posicionar());
    desenharPoster(folhaPoster).catch(() => folhaPoster.append(el("p", { class: "nota", text: "Mapa indisponível agora." })));
  }

  function focarCentro() { if (itens[idx] && document.activeElement?.classList.contains("disco-parede")) itens[idx].focus({ preventScroll: true }); }

  function irPara(novo, anunciarMudanca = true) {
    const n = itens.length;
    idx = ((novo % n) + n) % n;
    posicionar();
    if (anunciarMudanca) legenda.vivo.textContent = `Disco ${idx + 1} de ${n}: ${D.regioes[idx].nome}`;
  }

  function posicionar(arrasto = 0) {
    if (!itens.length) return;
    const s = itens[0].offsetWidth || 280, n = itens.length;
    itens.forEach((it, i) => {
      let k = ((i - idx) % n + n) % n; if (k > n / 2) k -= n;
      const a = Math.abs(k);
      const x = k === 0 ? 0 : Math.sign(k) * (a === 1 ? .86 * s : a === 2 ? 1.42 * s : 1.9 * s);
      const sc = a === 0 ? 1 : a === 1 ? .64 : .46;
      const rot = rots[i] * (a === 0 ? .5 : 1);
      const op = a > 2 ? 0 : a === 2 ? .45 : a === 1 ? .8 : 1;
      const p = prevK[i];
      // disco que dá a volta por trás: reposiciona sem animar
      if (arrasto === 0 && Math.sign(p) !== Math.sign(k) && (Math.abs(p) >= 2 || a >= 2)) {
        it.style.transition = "none";
        it.style.transform = `translateX(${Math.sign(k || 1) * 1.9 * s}px) scale(.4)`;
        it.style.opacity = 0;
        void it.offsetWidth;
        it.style.transition = "";
      }
      it.style.transform = `translateX(${x + arrasto}px) scale(${sc}) rotate(${rot}deg)`;
      it.style.opacity = op;
      it.style.filter = a === 0 ? "none" : `grayscale(${a === 1 ? .35 : .6}) brightness(.94)`;
      it.style.zIndex = 10 - a;
      it.style.visibility = a > 2 ? "hidden" : "visible";
      it.classList.toggle("centro", a === 0);
      it.tabIndex = a === 0 ? 0 : -1;
      const r = D.regioes[i];
      it.setAttribute("aria-label", a === 0 ? `Tocar o disco ${r.nome}` : `Mostrar o disco ${r.nome}`);
      if (arrasto === 0) prevK[i] = k;
    });
    const r = D.regioes[idx];
    legenda.faixa.textContent = `Faixa ${idx + 1} de ${n}`;
    legenda.titulo.textContent = r.nome;
    legenda.sub.textContent = textoPaises(r.paises);
    if (posterSel) posterSel.selectAll(".reg").classed("ativa", function () { return this.dataset.regiao === r.id; });
  }

  let ignorarClique = false;
  function configurarArrasto() {
    let x0 = 0, dx = 0, ativo = false, arrastando = false, idPonteiro = null;
    trilho.addEventListener("pointerdown", (e) => {
      if (animando || (e.pointerType === "mouse" && e.button !== 0)) return;
      ativo = true; arrastando = false; x0 = e.clientX; dx = 0; idPonteiro = e.pointerId;
    });
    trilho.addEventListener("pointermove", (e) => {
      if (!ativo || e.pointerId !== idPonteiro) return;
      dx = e.clientX - x0;
      if (!arrastando && Math.abs(dx) > 8) {
        arrastando = true; trilho.classList.add("arrastando");
        try { trilho.setPointerCapture(e.pointerId); } catch (err) { /* ok */ }
      }
      if (arrastando) posicionar(dx);
    });
    const soltar = () => {
      if (!ativo) return;
      ativo = false;
      if (arrastando) {
        trilho.classList.remove("arrastando");
        const s = itens[0].offsetWidth * .86;
        let passos = Math.round(-dx / s);
        if (passos === 0 && Math.abs(dx) > 40) passos = dx < 0 ? 1 : -1;
        ignorarClique = true; setTimeout(() => (ignorarClique = false), 60);
        if (passos) som.clique();
        irPara(idx + passos);
      }
      arrastando = false;
    };
    trilho.addEventListener("pointerup", soltar);
    trilho.addEventListener("pointercancel", soltar);
  }

  async function desenharPoster(alvoEl) {
    if (!window.d3 || !window.topojson) throw new Error("sem d3");
    const mundo = await d3.json(D.capitulos.mapa.mapaUrl);
    const paises = topojson.feature(mundo, mundo.objects.countries).features.filter((f) => f.id !== "010");
    const Wm = 960, Hm = 470;
    const proj = d3.geoNaturalEarth1().fitExtent([[4, 4], [Wm - 4, Hm - 4]], { type: "FeatureCollection", features: paises });
    const caminho = d3.geoPath(proj);
    const isoReg = {};
    D.regioes.forEach((r) => r.paises.forEach((p) => (isoReg[D.paises[p].iso] = r.id)));
    const svg = d3.select(alvoEl).append("svg").attr("viewBox", `0 0 ${Wm} ${Hm}`);
    svg.append("g").attr("class", "fundo").selectAll("path").data(paises.filter((f) => !isoReg[f.id])).join("path").attr("d", caminho);
    D.regioes.forEach((r, i) => {
      const g = svg.append("g").attr("class", "reg").attr("data-regiao", r.id).style("--cor", r.corMapa).on("click", () => { som.clique(); irPara(i); });
      g.selectAll("path").data(paises.filter((f) => isoReg[f.id] === r.id)).join("path").attr("d", caminho);
      (r.marcadores || []).forEach((m) => { const [x, y] = proj(m.coord); g.append("circle").attr("cx", x).attr("cy", y).attr("r", 8); });
    });
    posterSel = svg;
    posicionar();
  }

  // ---------- Tocar: o disco vai até a vitrola ----------
  async function tocar(i) {
    if (animando) return;
    const r = D.regioes[i];
    animando = true;
    som.clique();
    if (reduz) {
      sala.colocarDisco(r); sala.tocar(); tocadoPorAnimacao = r.id;
      T.irPara(`#mapa/${r.id}`); animando = false; return;
    }
    const it = itens[i];
    const cr = it.querySelector(".dp-capa").getBoundingClientRect();
    const vr = it.querySelector(".dp-vinil").getBoundingClientRect();
    const vooVinil = el("div", { class: "voo vinil", style: `--rotulo:${r.corMapa};left:${vr.left}px;top:${vr.top}px;width:${vr.width}px;height:${vr.height}px` });
    const vooCapa = el("div", { class: "voo", style: `left:${cr.left}px;top:${cr.top}px;width:${cr.width}px;height:${cr.height}px` });
    vooCapa.innerHTML = IL.capa(r.id, "voo");
    document.body.append(vooVinil, vooCapa);
    it.classList.add("saiu");
    som.deslizar();

    const sx = cr.width * .5;
    await vooVinil.animate([{ transform: "translateX(0)" }, { transform: `translateX(${sx}px)` }], { duration: 560, easing: "cubic-bezier(.3,.7,.3,1)", fill: "forwards" }).finished;
    vooCapa.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(50px) rotate(-12deg) scale(.9)" }], { duration: 450, easing: "ease-in", fill: "forwards" });

    const alvo = sala.discoRect();
    const dx = alvo.left + alvo.width / 2 - (vr.left + vr.width / 2);
    const dy = alvo.top + alvo.height / 2 - (vr.top + vr.height / 2);
    const kx = alvo.width / vr.width, ky = alvo.height / vr.height;
    await vooVinil.animate([
      { transform: `translate(${sx}px, 0px) scale(1, 1) rotate(0deg)` },
      { transform: `translate(${(sx + dx) / 2}px, ${dy / 2 - 140}px) scale(${(1 + kx) / 2}, ${(1 + kx) / 2}) rotate(200deg)`, offset: .5 },
      { transform: `translate(${dx}px, ${dy}px) scale(${kx}, ${ky}) rotate(360deg)` }
    ], { duration: 950, easing: "cubic-bezier(.45,.05,.3,1)", fill: "forwards" }).finished;

    sala.colocarDisco(r);
    vooVinil.remove(); vooCapa.remove();
    sala.tocar();
    await esperar(760);
    som.agulha();
    await esperar(700);
    tocadoPorAnimacao = r.id;
    await sala.apagar(() => T.irPara(`#mapa/${r.id}`));
    it.classList.remove("saiu");
    animando = false;
  }

  // ---------- Voltar: o disco retorna à parede ----------
  async function voltarDisco(id) {
    const i = D.regioes.findIndex((r) => r.id === id);
    if (i < 0) return;
    itens.forEach((it) => (it.style.transition = "none"));
    idx = i; posicionar();
    void trilho.offsetWidth;
    itens.forEach((it) => (it.style.transition = ""));
    if (reduz) { sala.parar(); sala.colocarDisco(null); return; }
    const r = D.regioes[i], it = itens[i];
    it.classList.add("saiu");
    const inicio = sala.discoRect();
    sala.parar();
    await esperar(350);
    const fim = it.querySelector(".dp-capa").getBoundingClientRect();
    const w = fim.width * .94;
    const voo = el("div", { class: "voo vinil", style: `--rotulo:${r.corMapa};left:${fim.left + fim.width * .03}px;top:${fim.top + fim.height * .03}px;width:${w}px;height:${w}px` });
    document.body.append(voo);
    sala.colocarDisco(null);
    const dx = inicio.left + inicio.width / 2 - (fim.left + fim.width / 2), dy = inicio.top + inicio.height / 2 - (fim.top + fim.height / 2);
    await voo.animate([
      { transform: `translate(${dx}px, ${dy}px) scale(${inicio.width / w}, ${inicio.height / w})` },
      { transform: `translate(${dx / 2}px, ${dy / 2 - 120}px) scale(.7) rotate(-160deg)`, offset: .55 },
      { transform: "none" }
    ], { duration: 900, easing: "cubic-bezier(.45,.05,.3,1)" }).finished;
    voo.remove();
    it.classList.remove("saiu");
    it.querySelector(".dp-capa").animate([{ transform: "translateY(-14px) rotate(-3deg)" }, { transform: "none" }], { duration: 420, easing: "cubic-bezier(.3,1.6,.5,1)" });
  }

  function entrarMapa({ anterior }) {
    if (anterior?.regiao) voltarDisco(anterior.regiao);
    else { sala.parar(); sala.colocarDisco(null); }
  }

  // ====================================================
  // PÁGINA DE CADA REGIÃO
  // ====================================================
  let eqRegiao = null, regiaoAtual = null, aoEntrar = [];

  function montarRegiao(id) {
    const r = D.regioes.find((x) => x.id === id);
    regiaoAtual = r; aoEntrar = [];
    pararMusica();
    const sec = $("#cap-regiao");
    sec.innerHTML = "";
    const miolo = el("div", { class: "miolo" });
    sec.append(miolo);
    const prox = D.regioes[(D.regioes.indexOf(r) + 1) % D.regioes.length];

    miolo.append(
      el("div", { class: "reg-cab" },
        el("p", { class: "chapeu", text: `Faixa 3 · ${r.nome}` }),
        el("span", { class: "tocando-agora" }, el("i", { "aria-hidden": "true" }, el("b"), el("b"), el("b")), "Tocando agora"),
        criarBotaoMusica(r)),
      el("h1", { id: "titulo-regiao", tabindex: "-1", text: r.titulo })
    );

    // Cenário
    const cena = IL.cena(r.id);
    const fig = el("figure", { class: "cena" });
    const quadro = el("div", { class: "cena-quadro" });
    quadro.innerHTML = cena.svg;
    const svg = quadro.querySelector("svg");
    svg.setAttribute("role", "group");
    svg.setAttribute("aria-label", `Cenário ilustrado: ${r.nome}. Objetos clicáveis: ${r.cena.map((o) => o.rotulo).join(", ")}.`);
    fig.append(quadro);
    const listaObjetos = el("div", { class: "cena-objetos" }, el("p", { text: D.capitulos.mapa.dicaCena }));
    const botoesLista = {};
    r.cena.forEach((obj) => {
      const g = svg.querySelector(`.objeto[data-obj="${obj.id}"]`);
      if (g) prepararObjeto(g, obj, cena.pinos[obj.id], fig, botoesLista);
      const b = el("button", { type: "button", "aria-expanded": "false", text: obj.rotulo });
      b.addEventListener("click", () => abrirEncarte(obj, cena.pinos[obj.id], fig, b, botoesLista));
      botoesLista[obj.id] = b;
      listaObjetos.append(b);
    });
    miolo.append(fig, listaObjetos);

    // Corpo: texto, curiosidade, players | barras, tabela
    const colTexto = el("div", { class: "reg-texto" }, el("p", { class: "lide", text: r.texto }));
    if (!r.curiosidadeNaCena && !r.curiosidadeNaInteracao) {
      colTexto.append(el("aside", { class: "folha curiosidade", "aria-label": "Curiosidade" },
        el("p", { class: "curiosidade-rotulo", text: "Curiosidade" }), el("p", { text: r.curiosidade })));
    }
    const players = el("div", { class: "players" }, el("p", { class: "player-rotulo", text: "Na vitrola" }));
    montarPlayers(r, players);
    colTexto.append(players);

    let sel = r.personagem;
    eqRegiao = criarEq({ valores: D.paises[sel], ref: D.media, rotulo: sel });
    const tituloBarras = el("h2", { text: `O som ${preposicao(sel)} ${sel}` });
    const folhaBarras = el("div", { class: "folha fita" },
      el("div", { class: "folha-titulo" }, tituloBarras, el("span", { class: "legenda-ref" }, el("i", { "aria-hidden": "true" }), "média dos 70 países")),
      eqRegiao.el);

    const tbody = el("tbody");
    const linhas = r.paises.map((nome) => {
      const p = D.paises[nome];
      const tags = [];
      if (nome === r.personagem) tags.push("personagem");
      if ((r.destaques || []).includes(nome)) tags.push("destaque");
      const b = el("button", { class: "btn-pais", type: "button", "aria-pressed": nome === sel ? "true" : "false" }, nome, ...tags.map((t) => el("span", { class: "tag", text: t })));
      b.addEventListener("click", () => selecionar(nome));
      const tr = el("tr", { class: nome === sel ? "selecionado" : "" },
        el("th", { scope: "row" }, b), el("td", { text: fmt(p.alegria) }), el("td", { text: fmt(p.energia) }), el("td", { text: fmt(p.danca) }),
        el("td", { text: `${fmt(p.explicitas, 1)}%` }), el("td", { text: fmt(p.felicidade, 2) }));
      tbody.append(tr);
      return { nome, tr, b };
    });
    tbody.append(el("tr", {}, el("th", { scope: "row", text: "Média dos 70" }),
      el("td", { text: fmt(D.media.alegria) }), el("td", { text: fmt(D.media.energia) }), el("td", { text: fmt(D.media.danca) }),
      el("td", { text: `${fmt(D.media.explicitas, 1)}%` }), el("td", { text: fmt(D.media.felicidade, 2) })));
    const folhaTabela = el("div", { class: "folha" },
      el("div", { class: "tabela-rolagem", tabindex: "0", role: "region", "aria-label": "Tabela dos países da região" },
        el("table", {}, el("caption", { text: "Os países da região" }),
          el("thead", {}, el("tr", {}, ...["País", "Alegria", "Energia", "Dança"].map((t) => el("th", { scope: "col", text: t })),
            el("th", { scope: "col", html: '<abbr title="Porcentagem de músicas explícitas">% expl.</abbr>' }),
            el("th", { scope: "col", html: '<abbr title="Felicidade, de 0 a 10">Felic.</abbr>' }))), tbody)),
      el("p", { class: "tabela-dica", text: "Clique no nome de um país para ver as barras dele." }));
    function selecionar(nome) {
      sel = nome; som.clique();
      linhas.forEach((l) => { l.tr.classList.toggle("selecionado", l.nome === nome); l.b.setAttribute("aria-pressed", l.nome === nome ? "true" : "false"); });
      tituloBarras.textContent = `O som ${preposicao(nome)} ${nome}`;
      eqRegiao.definir(D.paises[nome], D.media, nome);
    }

    miolo.append(el("div", { class: "reg-corpo" }, colTexto, el("div", { class: "reg-col" }, folhaBarras, folhaTabela)));

    // Lado B
    const mini = MINIS[r.mini.tipo]?.(r, r.mini, fig);
    if (mini) {
      miolo.append(el("section", { class: "lado-b", "aria-labelledby": "lado-b-tit" },
        el("div", { class: "folha" },
          el("div", { class: "lado-b-cab" }, el("span", { class: "carimbo", text: "Lado B" }), el("h2", { id: "lado-b-tit", text: r.mini.titulo })),
          el("p", { class: "lado-b-texto", text: r.mini.texto }), mini)));
    }

    miolo.append(el("div", { class: "fim-capitulo" },
      botao({ texto: "Voltar ao mapa", href: "#mapa", tipo: "secundario", volta: true }),
      botao({ texto: `Próxima região: ${prox.nome}`, href: `#mapa/${prox.id}`, tipo: "secundario" }),
      botao({ texto: "Ir para a resposta", href: "#resposta" })));
    return r;
  }

  function prepararObjeto(g, obj, pino, fig, botoesLista) {
    const ns = "http://www.w3.org/2000/svg";
    const arte = document.createElementNS(ns, "g");
    arte.setAttribute("class", "arte");
    const alvoR = g.querySelector(".alvo");
    Array.from(g.childNodes).forEach((n) => { if (n !== alvoR) arte.append(n); });
    g.insertBefore(arte, alvoR);
    if (alvoR) {
      const [x, y, w, h] = ["x", "y", "width", "height"].map((a) => +alvoR.getAttribute(a));
      g.insertAdjacentHTML("beforeend", `<rect class="contorno" x="${x - 6}" y="${y - 6}" width="${w + 12}" height="${h + 12}"/>`);
    }
    if (pino) g.insertAdjacentHTML("beforeend", `<g class="pino" transform="translate(${pino[0]} ${pino[1]})"><circle class="pino-anel" r="16"/><circle class="pino-ponto" r="16"/><path class="pino-mais" d="M-7 0h14M0 -7v14"/></g>`);
    g.setAttribute("role", "button");
    g.setAttribute("tabindex", "0");
    g.setAttribute("aria-label", `${obj.rotulo}: abrir encarte`);
    g.setAttribute("aria-expanded", "false");
    const abrir = () => abrirEncarte(obj, pino, fig, g, botoesLista);
    g.addEventListener("click", abrir);
    g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrir(); } });
  }

  let encarteAberto = null;
  function fecharEncarte(devolverFoco = true) {
    if (!encarteAberto) return;
    const { box, origem, obj, botoesLista, fig } = encarteAberto;
    box.remove();
    fig.querySelectorAll(".objeto.aberto").forEach((g) => { g.classList.remove("aberto"); g.setAttribute("aria-expanded", "false"); });
    Object.values(botoesLista).forEach((b) => b.setAttribute("aria-expanded", "false"));
    encarteAberto = null;
    if (devolverFoco && origem) origem.focus({ preventScroll: true });
  }
  function abrirEncarte(obj, pino, fig, origem, botoesLista) {
    const jaAberto = encarteAberto?.obj.id === obj.id;
    fecharEncarte(false);
    if (jaAberto) { origem.focus({ preventScroll: true }); return; }
    som.clique();
    const [x, y] = pino || [600, 280];
    const direita = x > 640, embaixo = y > 260;
    const fechar = el("button", { class: "encarte-fechar", type: "button", "aria-label": "Fechar encarte", text: "×" });
    const box = el("div", { class: `encarte${direita ? " direita" : ""}`, role: "dialog", "aria-label": obj.rotulo, tabindex: "-1" },
      el("p", { class: "encarte-rotulo", text: obj.rotulo }), el("h3", { text: obj.titulo }), el("p", { text: obj.texto }), fechar);
    if (direita) box.style.right = `calc(${((1200 - x) / 1200) * 100}% + 14px)`; else box.style.left = `calc(${(x / 1200) * 100}% + 14px)`;
    if (embaixo) box.style.bottom = `calc(${((560 - y) / 560) * 100}% + 14px)`; else box.style.top = `calc(${(y / 560) * 100}% + 14px)`;
    fechar.addEventListener("click", () => fecharEncarte(true));
    box.addEventListener("keydown", (e) => { if (e.key === "Escape") { e.preventDefault(); fecharEncarte(true); } });
    fig.append(box);
    const g = fig.querySelector(`.objeto[data-obj="${obj.id}"]`);
    if (g) { g.classList.add("aberto"); g.setAttribute("aria-expanded", "true"); }
    botoesLista[obj.id]?.setAttribute("aria-expanded", "true");
    encarteAberto = { box, origem, obj, botoesLista, fig };
    box.focus({ preventScroll: true });
    if (window.innerWidth <= 720) box.scrollIntoView({ behavior: reduz ? "auto" : "smooth", block: "nearest" });
  }
  document.addEventListener("click", (e) => {
    if (!encarteAberto) return;
    if (encarteAberto.box.contains(e.target) || e.target.closest(".objeto") || e.target.closest(".cena-objetos")) return;
    fecharEncarte(false);
  });

  // ====================================================
  // MÚSICA: player do Spotify controlado pela API de embed
  // (https://developer.spotify.com/documentation/embeds/references/iframe-api)
  // ====================================================
  let apiSpotify = null;
  const filaSpotify = [];
  window.onSpotifyIframeApiReady = (api) => { apiSpotify = api; filaSpotify.splice(0).forEach((f) => f(api)); };
  const musica = { controles: [], principal: null, ativo: null, pronto: false, querTocar: false, comecou: false, tocando: false, token: 0, botao: null };

  function pararMusica() {
    musica.token++;
    musica.controles.forEach((c) => { try { c.pause(); c.destroy(); } catch (e) { /* ok */ } });
    Object.assign(musica, { controles: [], principal: null, ativo: null, pronto: false, querTocar: false, comecou: false, tocando: false, botao: null });
  }

  function atualizarBotaoMusica() {
    const b = musica.botao; if (!b) return;
    b.innerHTML = `${musica.tocando ? ICONE.pausa : ICONE.play}<span>${musica.tocando ? "Pausar a música" : "Tocar a música"}</span>`;
    b.setAttribute("aria-pressed", musica.tocando ? "true" : "false");
    if (musica.tocando) b.classList.remove("chamar");
  }

  function criarBotaoMusica(r) {
    if (!r.musicas.some((m) => m.spotifyId && m.spotifyId.trim())) return null;
    const b = el("button", { class: "btn btn-principal btn-musica", type: "button", "aria-pressed": "false" });
    b.addEventListener("click", () => {
      const c = musica.ativo || musica.principal;
      if (!c) return;
      if (musica.tocando) c.pause();
      else { musica.querTocar = true; if (musica.comecou) c.resume(); else c.play(); }
    });
    musica.botao = b;
    atualizarBotaoMusica();
    return b;
  }

  function montarPlayers(r, container) {
    const token = musica.token;
    const alvos = [];
    r.musicas.forEach((m) => {
      if (!(m.spotifyId && m.spotifyId.trim())) { container.append(el("p", {}, el("strong", { text: m.titulo }), ` · ${m.artista}`)); return; }
      const alvo = el("div");
      container.append(el("div", { class: "player" }, alvo));
      alvos.push({ alvo, m });
    });
    // A API do Spotify cria o iframe com loading="lazy": como os players ficam
    // mais abaixo na página, ele só carregaria depois da rolagem. Forçamos o
    // carregamento imediato para a música poder tocar assim que se entra.
    const ansioso = (n) => { if (n.tagName === "IFRAME" && n.getAttribute("loading") !== "eager") n.setAttribute("loading", "eager"); };
    const vigia = new MutationObserver((ms) => ms.forEach((mu) => mu.type === "attributes" ? ansioso(mu.target) : mu.addedNodes.forEach((n) => { if (n.nodeType === 1) { ansioso(n); n.querySelectorAll?.("iframe").forEach(ansioso); } })));
    vigia.observe(container, { childList: true, subtree: true, attributes: true, attributeFilter: ["loading"] });
    setTimeout(() => vigia.disconnect(), 15000);
    alvos.forEach(({ alvo, m }, i) => {
      const criar = (api) => {
        if (token !== musica.token) return;
        api.createController(alvo, { uri: `spotify:track:${m.spotifyId.trim()}`, width: "100%", height: 152 }, (ctrl) => {
          if (token !== musica.token) { try { ctrl.destroy(); } catch (e) { /* ok */ } return; }
          musica.controles.push(ctrl);
          if (ctrl.iframeElement) ansioso(ctrl.iframeElement);
          if (i === 0) {
            musica.principal = ctrl; musica.ativo = ctrl;
            ctrl.addListener("ready", () => { musica.pronto = true; if (musica.querTocar) ctrl.play(); });
          }
          ctrl.addListener("playback_update", (e) => {
            if (token !== musica.token) return;
            const tocando = !e.data.isPaused;
            if (tocando) {
              musica.comecou = true;
              musica.controles.forEach((c) => { if (c !== ctrl) c.pause(); });
              musica.ativo = ctrl;
            }
            if (ctrl !== musica.ativo) return;
            if (tocando !== musica.tocando) {
              musica.tocando = tocando;
              atualizarBotaoMusica();
              if (musica.comecou) { if (tocando) sala.tocar(); else sala.parar(); }
            }
          });
        });
      };
      if (apiSpotify) criar(apiSpotify); else filaSpotify.push(criar);
    });
    // Se a API do Spotify não carregar, usa o player simples
    setTimeout(() => {
      if (token !== musica.token || apiSpotify) return;
      alvos.forEach(({ alvo, m }) => alvo.replaceWith(el("iframe", {
        src: `https://open.spotify.com/embed/track/${encodeURIComponent(m.spotifyId.trim())}`,
        title: `Player do Spotify: ${m.titulo}, ${m.artista}`, loading: "eager",
        allow: "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      })));
      musica.botao?.remove();
    }, 7000);
  }

  function tocarMusicaAoEntrar() {
    if (!musica.botao) return;
    const token = musica.token;
    musica.querTocar = true;
    if (musica.pronto && musica.principal) musica.principal.play();
    // Se o navegador bloquear o início automático, a agulha sobe e o botão chama atenção
    setTimeout(() => {
      if (token !== musica.token || musica.comecou) return;
      sala.parar();
      musica.botao?.classList.add("chamar");
    }, 5000);
  }

  function entrarRegiao({ anterior }) {
    const r = regiaoAtual;
    eqRegiao?.tocar();
    tocarMusicaAoEntrar();
    if (tocadoPorAnimacao === r.id) tocadoPorAnimacao = null;
    else if (anterior?.regiao && anterior.regiao !== r.id) {
      sala.parar();
      setTimeout(() => { sala.colocarDisco(r); sala.tocar(); setTimeout(() => som.agulha(), 700); }, 450);
    } else { sala.colocarDisco(r); sala.tocar(); }
    aoEntrar.forEach((f) => f());
  }

  // ====================================================
  // LADO B: uma mini-interação por região
  // ====================================================
  const MINIS = {
    virada(r, m) {
      const wrap = el("div");
      const rotA = el("span", { class: "ativo", text: m.ladoA.fonte });
      const rotB = el("span", { text: m.ladoB.fonte });
      const chave = el("button", { class: "interruptor", type: "button", role: "switch", "aria-checked": "false", "aria-label": `Pesquisa: ${m.ladoA.fonte} ou ${m.ladoB.fonte}` });
      const faceA = el("div", { class: "placa-face a" }, el("p", { class: "placa-fonte", text: m.ladoA.fonte }), el("p", { class: "placa-num", text: m.ladoA.numero }), el("p", { text: m.ladoA.legenda }));
      const faceB = el("div", { class: "placa-face b", "aria-hidden": "true" }, el("p", { class: "placa-fonte", text: m.ladoB.fonte }), el("p", { class: "placa-num", text: m.ladoB.numero }), el("p", { text: m.ladoB.legenda }));
      const placa = el("div", { class: "placa", "aria-live": "polite" }, el("div", { class: "placa-giro" }, faceA, faceB));
      chave.addEventListener("click", () => {
        const on = chave.getAttribute("aria-checked") !== "true";
        som.clique();
        chave.setAttribute("aria-checked", on ? "true" : "false");
        placa.classList.toggle("virada", on);
        rotA.classList.toggle("ativo", !on); rotB.classList.toggle("ativo", on);
        faceA.setAttribute("aria-hidden", on ? "true" : "false"); faceB.setAttribute("aria-hidden", on ? "false" : "true");
      });
      wrap.append(el("div", { class: "virada-ctrl" }, rotA, chave, rotB), placa, el("p", { class: "nota", style: "margin-top:1.4rem;max-width:60ch", text: m.nota }));
      return wrap;
    },

    pista(r, m) {
      const wrap = el("div");
      const pista = el("div", { class: "pista", "aria-hidden": "true" });
      const chao = el("div", { class: "pista-chao" });
      for (let i = 0; i < 10; i++) chao.append(el("span"));
      const dancarinos = el("div", { class: "dancarinos" });
      const cores = ["#F2B705", "#D6247F", "#FFF4FB", "#F2B705", "#D6247F"];
      cores.forEach((c, i) => {
        dancarinos.insertAdjacentHTML("beforeend", `<svg class="dancarino" viewBox="0 0 54 120" style="animation-delay:-${i * .13}s"><circle cx="27" cy="15" r="11" fill="${c}"/><path d="M27 28 V72" stroke="${c}" stroke-width="9" stroke-linecap="round"/><path class="braco-e" d="M27 44 L7 30" stroke="${c}" stroke-width="7" stroke-linecap="round"/><path class="braco-d" d="M27 44 L47 30" stroke="${c}" stroke-width="7" stroke-linecap="round"/><path d="M27 72 L13 112 M27 72 L41 112" stroke="${c}" stroke-width="8" stroke-linecap="round" fill="none"/></svg>`);
      });
      pista.append(chao, dancarinos);
      const leitura = el("div", { class: "pista-leitura" });
      const linhas = {};
      r.paises.forEach((nome) => {
        const v = D.paises[nome].danca;
        const d = el("div", {}, el("span", { text: nome }), el("i", { style: `--v:${v}` }), el("span", { text: fmt(v) }));
        linhas[nome] = d; leitura.append(d);
      });
      const vivo = el("p", { class: "sr-only", "aria-live": "polite" });
      const botoes = el("div", { class: "pista-botoes", role: "group", "aria-label": "Escolha o país" });
      const escolher = (nome) => {
        const v = D.paises[nome].danca;
        pista.style.setProperty("--dur", `${(0.42 / v).toFixed(3)}s`);
        Array.from(botoes.children).forEach((b) => b.setAttribute("aria-pressed", b.textContent === nome ? "true" : "false"));
        Object.entries(linhas).forEach(([n, d]) => d.classList.toggle("sel", n === nome));
        vivo.textContent = `${nome}: dançabilidade ${fmt(v)}`;
      };
      r.paises.forEach((nome) => botoes.append(el("button", { type: "button", "aria-pressed": "false", text: nome, onclick: () => { som.clique(); escolher(nome); } })));
      escolher(r.personagem);
      wrap.append(botoes, pista, el("p", { class: "nota", style: "margin-top:1rem", text: "Dançabilidade do top 50 (0 a 1):" }), leitura, vivo);
      return wrap;
    },

    duelo(r, m) {
      const wrap = el("div");
      const [a, b] = m.paises;
      const res = el("div", { class: "duelo-res", "aria-live": "polite" });
      const botoes = el("div", { class: "duelo-botoes" });
      const vencedor = D.paises[a].danca > D.paises[b].danca ? a : b;
      const apostar = (nome) => {
        Array.from(botoes.querySelectorAll("button")).forEach((x) => x.setAttribute("aria-disabled", "true"));
        const certo = nome === vencedor;
        const barra = (n, chave) => el("div", { class: "duelo-barra" }, el("span", { text: n, style: "text-align:left;font-family:var(--f-texto)" }), el("i", {}, el("b", { style: "--v:0" })), el("span", { text: fmt(D.paises[n][chave]) }));
        const grupo = (titulo, chave) => el("div", {}, el("h3", { text: titulo }), barra(vencedor === a ? a : b, chave), barra(vencedor === a ? b : a, chave));
        res.innerHTML = "";
        res.append(
          el("p", { class: `revelacao-veredito ${certo ? "certo" : ""}`, text: certo ? `Você apostou no ${nome === "México" ? "México" : nome}: acertou!` : `Você apostou no ${nome}. Quem dança mais é o ${vencedor}.` }),
          el("div", { class: "duelo-grade" }, grupo("Alegria", "alegria"), grupo("Dança", "danca")),
          el("p", { text: m.resposta }),
          el("div", { class: "acoes" }, botao({ texto: "Apostar de novo", tipo: "secundario", onclick: () => { res.innerHTML = ""; Array.from(botoes.querySelectorAll("button")).forEach((x) => x.removeAttribute("aria-disabled")); botoes.querySelector("button").focus(); } })));
        requestAnimationFrame(() => requestAnimationFrame(() => res.querySelectorAll(".duelo-barra").forEach((d) => {
          const nome2 = d.firstChild.textContent, chave = d.parentElement.querySelector("h3").textContent === "Alegria" ? "alegria" : "danca";
          d.querySelector("b").style.setProperty("--v", D.paises[nome2][chave]);
        })));
      };
      [a, b].forEach((nome) => {
        const bt = botao({ texto: nome, tipo: nome === a ? "principal" : "secundario", onclick: () => { if (bt.getAttribute("aria-disabled") === "true") return; apostar(nome); } });
        bt.querySelector(".ic")?.remove();
        botoes.append(bt);
      });
      wrap.append(botoes, res);
      return wrap;
    },

    previsto(r, m) {
      const wrap = el("div");
      const real = D.paises[m.pais].felicidade, prev = m.previsto, media = D.media.felicidade;
      const fill = el("div", { class: "prev-fill", style: "--p:0" });
      const gap = el("div", { class: "prev-gap", style: `--a:${prev};--b:${real}` });
      const marcaP = el("span", { class: "prev-marca", style: `left:${prev * 10}%`, text: `Previsto pela playlist: ${fmt(prev, 2)}` });
      const marcaR = el("span", { class: "prev-marca embaixo", style: `left:${real * 10}%`, text: `Real: ${fmt(real, 2)}` });
      const barra = el("div", { class: "prev-barra", role: "img", "aria-label": `Felicidade da ${m.pais}: prevista pela playlist ${fmt(prev, 2)}, real ${fmt(real, 2)}. Média dos 70 países ${fmt(media, 2)}.` },
        fill, gap, el("span", { class: "prev-media", style: `--m:${media}` }), marcaP, marcaR);
      const leg = el("p", { class: "prev-legenda", text: `+${fmt(real - prev, 2)}: ${m.legenda}` });
      let rodando = false;
      async function tocarComparacao() {
        if (rodando) return; rodando = true;
        fill.style.setProperty("--p", 0); barra.classList.remove("real"); [marcaP, marcaR, leg].forEach((x) => x.classList.remove("on"));
        await esperar(150);
        fill.style.setProperty("--p", prev); marcaP.classList.add("on");
        await esperar(1500);
        barra.classList.add("real"); som.clique();
        await esperar(1100);
        marcaR.classList.add("on"); leg.classList.add("on");
        rodando = false;
      }
      const bt = botao({ texto: "Tocar a comparação", onclick: tocarComparacao });
      bt.querySelector(".ic").outerHTML = ICONE.play;
      wrap.append(bt, barra, leg, el("p", { class: "nota", text: `A linha tracejada é a média dos 70 países (${fmt(media, 2)}). Escala de 0 a 10.` }));
      aoEntrar.push(() => {
        const io = new IntersectionObserver((ents) => { if (ents.some((e) => e.isIntersecting)) { tocarComparacao(); io.disconnect(); } }, { threshold: .6 });
        io.observe(barra);
      });
      return wrap;
    },

    tambor(r, m, fig) {
      const wrap = el("div");
      const cores = ["#E8B10E", "#F25C54", "#F5F1E8", "#3FB98A"];
      const nomes = ["Grave", "Médio", "Agudo", "Mais agudo"];
      let batidas = 0;
      const cont = el("p", { class: "tambor-cont", "aria-live": "off", text: "Batidas: 0" });
      const pads = el("div", { class: "pads" });
      const bater = (n, pad) => {
        som.tambor(n);
        batidas++; cont.textContent = `Batidas: ${batidas}`;
        pad.classList.remove("batendo"); void pad.offsetWidth; pad.classList.add("batendo");
        setTimeout(() => pad.classList.remove("batendo"), 130);
        fig.classList.remove("batida"); void fig.offsetWidth; fig.classList.add("batida");
      };
      nomes.forEach((nome, n) => {
        const pad = el("button", { class: "pad", type: "button", style: `--pad-cor:${cores[n]}`, "aria-label": `Pad ${n + 1}: ${nome}` }, el("strong", { text: String(n + 1) }), nome);
        pad.addEventListener("pointerdown", (e) => { e.preventDefault(); bater(n, pad); });
        pad.addEventListener("click", (e) => { if (e.detail === 0) bater(n, pad); });
        pads.append(pad);
      });
      wrap.addEventListener("keydown", (e) => { const n = "1234".indexOf(e.key); if (n >= 0) { e.preventDefault(); bater(n, pads.children[n]); } });
      wrap.append(pads, cont);
      return wrap;
    },

    abertura(r, m) {
      const J = D.paises[r.personagem];
      const cartelas = [
        { peq: "Abertura", grande: r.nome.toUpperCase() },
        { peq: "Alegria", grande: fmt(J.alegria), flash: true },
        { peq: "Energia", grande: fmt(J.energia) },
        { peq: "Explícitas", grande: `${fmt(J.explicitas, 1)}%`, flash: true },
        { peq: r.musicas[0].artista, grande: `“${r.musicas[0].titulo}”` }
      ];
      const wrap = el("div");
      if (reduz) {
        wrap.append(el("div", { class: "folha" }, ...cartelas.map((c) => el("p", {}, el("strong", { text: `${c.peq}: ` }), c.grande))));
        return wrap;
      }
      const tela = el("div", { class: "tela-anime" }, el("div", { class: "linhas", "aria-hidden": "true" }));
      const vivo = el("p", { class: "sr-only", "aria-live": "polite" });
      const els = cartelas.map((c) => { const d = el("div", { class: `cartela${c.flash ? " flash" : ""}`, "aria-hidden": "true" }, el("p", { class: "peq", text: c.peq }), el("p", { class: "grande", text: c.grande })); tela.append(d); return d; });
      const play = el("button", { class: "play-anime", type: "button", "aria-label": "Tocar a abertura", html: ICONE.play });
      let rodando = false;
      play.addEventListener("click", async () => {
        if (rodando) return; rodando = true; som.clique();
        play.hidden = true;
        for (let i = 0; i < els.length; i++) {
          els.forEach((e) => e.classList.remove("on"));
          void els[i].offsetWidth;
          els[i].classList.add("on");
          vivo.textContent = `${cartelas[i].peq}: ${cartelas[i].grande}`;
          som.clique();
          await esperar(1250);
        }
        await esperar(600);
        els.forEach((e) => e.classList.remove("on"));
        play.hidden = false; play.setAttribute("aria-label", "Tocar a abertura de novo"); play.focus({ preventScroll: true });
        rodando = false;
      });
      tela.append(play);
      wrap.append(tela, vivo);
      return wrap;
    }
  };

  T.capitulos.regioes = { montarMapa, entrarMapa, montarRegiao, entrarRegiao, pararMusica };
})();
