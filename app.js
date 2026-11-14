/* ==========================================================
   A trilha sonora de um país — lógica do site
   Os dados e textos ficam em data.js.
   ========================================================== */
(() => {
  "use strict";

  const D = window.SITE_DATA;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Formatação em pt-BR ----------
  const formatadores = {};
  const fmt = (v, casas = 3) => {
    formatadores[casas] ||= new Intl.NumberFormat("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
    return formatadores[casas].format(v);
  };

  // ---------- Criação de elementos ----------
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

  const SETA = '<svg class="seta" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const SETA_VOLTA = '<svg class="seta-volta" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';

  function botaoLink(href, texto, tipo = "principal", volta = false) {
    const a = el("a", { class: `btn btn-${tipo}`, href });
    a.innerHTML = volta ? `${SETA_VOLTA}<span></span>` : `<span></span>${SETA}`;
    $("span", a).textContent = texto;
    return a;
  }

  // ---------- Contador animado ----------
  function animarNumero(no, para, casas = 3, sufixo = "", duracao = 800) {
    const de = parseFloat(no.dataset.valor ?? para);
    no.dataset.valor = para;
    if (reduzMovimento || de === para) { no.textContent = fmt(para, casas) + sufixo; return; }
    const t0 = performance.now();
    const passo = (t) => {
      const p = Math.min(1, (t - t0) / duracao);
      const e = 1 - Math.pow(1 - p, 3);
      no.textContent = fmt(de + (para - de) * e, casas) + sufixo;
      if (p < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  }

  // ---------- Equalizador: as três barras ----------
  function descreverBarras(vals, ref) {
    let t = D.barras.map((b) => `${b.nome} ${fmt(vals[b.chave])}`).join(", ");
    if (ref) t += `. Média dos 70 países: ` + D.barras.map((b) => `${b.nome.toLowerCase()} ${fmt(ref[b.chave])}`).join(", ");
    return t;
  }

  function criarEq({ valores, ref = null, rotulo = null }) {
    const raiz = el("span", { class: "eq", role: "img" });
    const colunas = D.barras.map((b) => {
      const preench = el("span", { class: "eq-preench" });
      const trilho = el("span", { class: "eq-trilho" }, preench);
      const refEl = ref ? el("span", { class: "eq-ref" }) : null;
      if (refEl) trilho.append(refEl);
      const valor = el("span", { class: "eq-valor", "aria-hidden": "true" });
      raiz.append(el("span", { class: "eq-col" }, trilho, el("span", { class: "eq-nome", "aria-hidden": "true", text: b.nome }), valor));
      return { b, preench, refEl, valor };
    });
    let atuais = valores, refAtual = ref, rotuloAtual = rotulo;
    const api = {
      el: raiz,
      definir(vals, novaRef = refAtual, novoRotulo = null) {
        atuais = vals; refAtual = novaRef; rotuloAtual = novoRotulo;
        colunas.forEach((c) => {
          c.preench.style.setProperty("--v", vals[c.b.chave]);
          animarNumero(c.valor, vals[c.b.chave]);
          if (c.refEl && novaRef) c.refEl.style.setProperty("--r", novaRef[c.b.chave]);
        });
        raiz.setAttribute("aria-label", (novoRotulo ? novoRotulo + ": " : "") + descreverBarras(vals, novaRef));
      },
      // Faz as barras "subirem" do zero (usado ao entrar no capítulo)
      tocar() {
        if (reduzMovimento) return api.definir(atuais, refAtual, rotuloAtual);
        colunas.forEach((c) => {
          c.preench.style.transition = "none";
          c.preench.style.setProperty("--v", 0);
          c.valor.dataset.valor = 0;
        });
        void raiz.offsetHeight;
        requestAnimationFrame(() => {
          colunas.forEach((c, i) => {
            c.preench.style.transition = "";
            c.preench.style.transitionDelay = `${i * 90}ms`;
          });
          api.definir(atuais, refAtual, rotuloAtual);
          setTimeout(() => colunas.forEach((c) => (c.preench.style.transitionDelay = "")), 1200);
        });
      }
    };
    api.definir(valores, ref, rotulo);
    return api;
  }

  // ---------- Paletas ----------
  const VARS = {
    bg: "--bg", texto: "--texto", suave: "--suave", destaque: "--destaque",
    sobreDestaque: "--sobre-destaque", destaqueTexto: "--destaque-texto", barra: "--barra", detalhe: "--detalhe"
  };
  function aplicarPaleta(p) {
    const raiz = document.documentElement;
    for (const [k, v] of Object.entries(VARS)) if (p[k]) raiz.style.setProperty(v, p[k]);
    $('meta[name="theme-color"]').setAttribute("content", p.bg);
  }

  // ---------- Menu ----------
  const CAPS = [
    { id: "jogo", secao: "cap-jogo" },
    { id: "grupos", secao: "cap-grupos" },
    { id: "mapa", secao: "cap-mapa" },
    { id: "resposta", secao: "cap-resposta" }
  ];
  function montarMenu() {
    const ol = $("#menu-lista");
    CAPS.forEach((c, i) => {
      const a = el("a", { href: `#${c.id}`, "data-cap": c.id },
        el("span", { class: "num", "aria-hidden": "true", text: String(i + 1) }),
        el("span", { class: "rotulo", text: D.capitulos[c.id].menu }));
      a.setAttribute("aria-label", `Capítulo ${i + 1}: ${D.capitulos[c.id].menu}`);
      ol.append(el("li", {}, a));
    });
  }

  // ====================================================
  // CAPÍTULO 1 — O JOGO
  // ====================================================
  const ganchos = {}; // funções chamadas ao entrar em cada capítulo

  function montarJogo() {
    const C = D.capitulos.jogo;
    const sec = $("#cap-jogo");
    const miolo = el("div", { class: "miolo" });
    sec.append(miolo);

    miolo.append(
      el("p", { class: "chapeu", text: "Capítulo 1 · O jogo" }),
      el("h1", { id: "titulo-jogo", tabindex: "-1", text: C.titulo }),
      el("p", { class: "lide", text: C.intro })
    );

    const pontos = el("div", { class: "rodada-pontos" });
    const placar = el("p", { class: "placar", "aria-live": "polite" });
    const status = el("div", { class: "jogo-status" }, pontos, placar);
    const dica = el("p", { class: "nota", id: "jogo-dica" });
    const cartoes = el("div", { class: "cartoes" });
    const revelacao = el("div", { class: "revelacao", "aria-live": "polite" });
    const acoes = el("div", { class: "acoes" });
    const corpo = el("div", {}, status, dica, cartoes, revelacao, acoes);
    miolo.append(corpo);

    let rodada = 0, acertos = 0, resultados = [];
    let eqs = [];

    function atualizarStatus() {
      pontos.innerHTML = "";
      pontos.append(el("span", { class: "sr-only", text: `Rodada ${rodada + 1} de ${C.rodadas.length}` }));
      pontos.append(el("span", { "aria-hidden": "true", text: `Rodada ${rodada + 1} de ${C.rodadas.length}` }));
      C.rodadas.forEach((_, i) => {
        const cls = ["ponto"];
        if (resultados[i] === true) cls.push("certo");
        else if (resultados[i] === false) cls.push("errado");
        if (i === rodada && resultados[i] === undefined) cls.push("atual");
        pontos.append(el("span", { class: cls.join(" "), "aria-hidden": "true" }));
      });
      placar.innerHTML = `Acertos: <strong>${acertos}</strong> de ${C.rodadas.length}`;
    }

    function medidorFelicidade(nota) {
      const m = el("span", { class: "felic" },
        el("span", { class: "felic-topo" }, el("span", { text: "Felicidade" }), el("strong", { text: fmt(nota, 2) })),
        el("span", { class: "felic-trilho" },
          el("span", { class: "felic-preench" }),
          el("span", { class: "felic-media", style: `--m:${D.media.felicidade / 10}`, title: `Média dos 70 países: ${fmt(D.media.felicidade, 2)}` })),
        el("span", { class: "felic-legenda", "aria-hidden": "true" }, el("span", { text: "0" }), el("span", { text: `média ${fmt(D.media.felicidade, 2)}` }), el("span", { text: "10" }))
      );
      requestAnimationFrame(() => requestAnimationFrame(() => $(".felic-preench", m).style.setProperty("--h", nota / 10)));
      return m;
    }

    function montarRodada() {
      const r = C.rodadas[rodada];
      cartoes.innerHTML = ""; revelacao.innerHTML = ""; acoes.innerHTML = "";
      dica.textContent = C.dica;
      dica.hidden = false;
      eqs = [];
      ["a", "b"].forEach((lado, i) => {
        const nome = r[lado];
        const pais = D.paises[nome];
        const letra = lado.toUpperCase();
        const eq = criarEq({ valores: pais });
        eqs.push(eq);
        const etiqueta = el("span", { class: "etiqueta vazia", "aria-hidden": "true", text: "Mais feliz" });
        const rotulo = el("span", { class: "cartao-rotulo", text: `País ${letra}` });
        const pergunta = el("span", { class: "cartao-pergunta", text: "É este?" });
        const extra = el("span", { class: "cartao-extra" });
        const cartao = el("button", {
          class: "cartao", type: "button", "data-lado": lado,
          "aria-label": `País ${letra}: ${descreverBarras(pais)}. Escolher como o mais feliz.`
        }, etiqueta, rotulo, eq.el, pergunta, extra);
        cartao.addEventListener("click", () => escolher(lado));
        cartoes.append(cartao);
      });
      atualizarStatus();
      eqs.forEach((e) => e.tocar());
    }

    function escolher(lado) {
      const r = C.rodadas[rodada];
      if (resultados[rodada] !== undefined) return;
      const escolhido = r[lado];
      const certo = escolhido === r.maisFeliz;
      resultados[rodada] = certo;
      if (certo) acertos++;
      dica.hidden = true;

      $$(".cartao", cartoes).forEach((c) => {
        const ld = c.dataset.lado;
        const nome = r[ld];
        const pais = D.paises[nome];
        const vencedor = nome === r.maisFeliz;
        c.setAttribute("aria-disabled", "true");
        c.classList.add("revelado", vencedor ? "vencedor" : "perdedor");
        if (ld === lado) c.classList.add("escolhido");
        $(".cartao-rotulo", c).textContent = nome;
        const et = $(".etiqueta", c);
        if (vencedor) { et.classList.remove("vazia"); et.removeAttribute("aria-hidden"); }
        const perg = $(".cartao-pergunta", c);
        perg.textContent = ld === lado ? "Sua aposta" : " ";
        $(".cartao-extra", c).replaceWith(medidorFelicidade(pais.felicidade));
        c.setAttribute("aria-label", `${nome}${vencedor ? ", o mais feliz" : ""}. Felicidade ${fmt(pais.felicidade, 2)}. ${descreverBarras(pais)}.${ld === lado ? " Sua aposta." : ""}`);
      });

      atualizarStatus();
      if (certo && !reduzMovimento) { placar.classList.remove("pulo"); void placar.offsetWidth; placar.classList.add("pulo"); }

      revelacao.append(el("div", { class: "revelacao-caixa" },
        el("p", { class: `revelacao-veredito ${certo ? "certo" : ""}`, text: certo ? C.acertou : C.errou }),
        el("div", {}, el("p", { text: r.texto }), el("p", { class: "nota", style: "margin-top:.5rem", text: C.notaFelicidade }))
      ));

      let foco;
      if (rodada < C.rodadas.length - 1) {
        foco = el("button", { class: "btn btn-principal", type: "button" });
        foco.innerHTML = `<span>${C.botaoProximaRodada}</span>${SETA}`;
        foco.addEventListener("click", () => { rodada++; montarRodada(); cartoes.scrollIntoView({ behavior: reduzMovimento ? "auto" : "smooth", block: "center" }); $(".cartao", cartoes).focus({ preventScroll: true }); });
        acoes.append(foco);
      } else {
        acoes.append(el("p", { class: "resultado-final", text: `Você acertou ${acertos} de ${C.rodadas.length}.` }));
        foco = botaoLink("#grupos", C.botaoProximo);
        const denovo = el("button", { class: "btn btn-secundario", type: "button", text: C.botaoJogarDeNovo });
        denovo.addEventListener("click", reiniciar);
        const linha = el("div", { class: "fim-capitulo", style: "margin-top:.5rem" }, foco, denovo);
        acoes.append(linha);
      }
      setTimeout(() => {
        revelacao.scrollIntoView({ behavior: reduzMovimento ? "auto" : "smooth", block: "nearest" });
        foco.focus({ preventScroll: true });
      }, 350);
    }

    function reiniciar() {
      rodada = 0; acertos = 0; resultados = [];
      montarRodada();
      $("#titulo-jogo").scrollIntoView({ behavior: reduzMovimento ? "auto" : "smooth", block: "center" });
      $(".cartao", cartoes).focus({ preventScroll: true });
    }

    montarRodada();
    ganchos["cap-jogo"] = () => eqs.forEach((e) => e.tocar());
  }

  // ====================================================
  // CAPÍTULO 2 — OS GRUPOS
  // ====================================================
  function montarGrupos() {
    const C = D.capitulos.grupos;
    const sec = $("#cap-grupos");
    const miolo = el("div", { class: "miolo" });
    sec.append(miolo);

    miolo.append(
      el("p", { class: "chapeu", text: "Capítulo 2 · Os grupos" }),
      el("h1", { id: "titulo-grupos", tabindex: "-1", text: C.titulo }),
      el("p", { class: "lide", text: C.texto })
    );

    let atual = 0, trocou = false;
    const alternador = el("div", { class: "alternador", role: "group", "aria-label": "Escolha o grupo de países" });
    const botoes = C.grupos.map((g, i) => {
      const b = el("button", { type: "button", "aria-pressed": i === 0 ? "true" : "false", text: g.nome });
      b.addEventListener("click", () => selecionar(i));
      alternador.append(b);
      return b;
    });

    const infoFaixa = el("strong");
    const infoPaises = el("strong");
    const info = el("div", { class: "grupo-info", "aria-live": "polite" },
      el("div", {}, el("span", { text: "Felicidade de" }), infoFaixa),
      el("div", {}, el("span", { text: "Países no grupo" }), infoPaises));

    const g0 = C.grupos[0];
    const eq = criarEq({ valores: g0, rotulo: `Grupo ${g0.nome}` });
    const tituloEq = el("p", { class: "grupos-eq-titulo" });
    const painelEq = el("div", { class: "grupos-eq" }, tituloEq, eq.el);

    const depois = el("div", { class: "depois-troca", hidden: true, "aria-live": "polite" },
      el("p", { text: C.textoDepoisDaTroca }),
      el("div", { class: "correlacao", "aria-hidden": "true" },
        el("strong", { style: "font-family:var(--fonte-titulo);font-size:1.6rem", text: "-0,02" }),
        el("div", { style: "flex:1 1 220px" },
          el("div", { class: "correlacao-escala" }, el("span", { class: "zero" }), el("span", { class: "marcador", style: "--c:-0.02" })),
          el("div", { class: "correlacao-rotulos" }, el("span", { text: "-1" }), el("span", { text: "0 = nenhuma relação" }), el("span", { text: "1" }))))
    );

    miolo.append(
      el("div", { class: "grupos-layout" },
        el("div", {}, alternador, info, depois),
        painelEq),
      el("div", { class: "fim-capitulo" }, botaoLink("#mapa", C.botaoProximo))
    );

    function selecionar(i) {
      const g = C.grupos[i];
      botoes.forEach((b, j) => b.setAttribute("aria-pressed", j === i ? "true" : "false"));
      infoFaixa.textContent = g.faixa;
      infoPaises.textContent = g.paises;
      tituloEq.textContent = `O som médio dos ${g.nome.toLowerCase()}`;
      eq.definir(g, null, `Grupo ${g.nome}`);
      if (i !== atual && !trocou) { trocou = true; depois.hidden = false; }
      atual = i;
    }
    selecionar(0);
    ganchos["cap-grupos"] = () => eq.tocar();
  }

  // ====================================================
  // CAPÍTULO 3 — O MAPA
  // ====================================================
  function textoPaises(r) { return r.paises.join(", ").replace(/, ([^,]*)$/, " e $1"); }

  function montarMapa() {
    const C = D.capitulos.mapa;
    const sec = $("#cap-mapa");
    const miolo = el("div", { class: "miolo" });
    sec.append(miolo);

    const numero = el("strong", { text: `${C.numeroDestaque}%` });
    miolo.append(
      el("p", { class: "chapeu", text: "Capítulo 3 · O mapa" }),
      el("div", { class: "mapa-topo" },
        el("div", {},
          el("h1", { id: "titulo-mapa", tabindex: "-1", text: C.titulo }),
          el("p", { class: "lide", text: C.texto })),
        el("p", { class: "destaque-numero" }, numero, el("span", { text: C.legendaDestaque })))
    );

    const fig = el("figure", { class: "mapa-fig" });
    const dica = el("div", { class: "mapa-dica", "aria-hidden": "true" });
    fig.append(dica);

    const lista = el("ul", { class: "lista-regioes", "aria-label": "Regiões" });
    D.regioes.forEach((r) => {
      const b = el("button", { type: "button", "data-regiao": r.id, style: `--cor:${r.corMapa}` },
        el("span", { class: "amostra", "aria-hidden": "true" }),
        el("span", { class: "nome" }, r.nome, el("small", { text: textoPaises(r) })));
      b.innerHTML += SETA;
      b.addEventListener("click", () => abrirRegiao(r.id));
      b.addEventListener("mouseenter", () => destacar(r.id));
      b.addEventListener("mouseleave", () => destacar(null));
      b.addEventListener("focus", () => destacar(r.id));
      b.addEventListener("blur", () => destacar(null));
      lista.append(el("li", {}, b));
    });

    miolo.append(
      el("div", { class: "mapa-layout" }, fig, el("nav", { "aria-label": "Lista de regiões" }, lista)),
      el("div", { class: "fim-capitulo" }, botaoLink("#resposta", C.botaoProximo, "secundario"))
    );

    let svgSel = null;
    function destacar(id) {
      $$(".lista-regioes button").forEach((b) => b.classList.toggle("ativa", b.dataset.regiao === id));
      if (!svgSel) return;
      svgSel.classed("tem-ativa", !!id);
      svgSel.selectAll(".regiao-mapa").classed("ativa", function () { return this.dataset.regiao === id; });
    }

    function mostrarDica(r, x, y) {
      dica.innerHTML = "";
      dica.append(r.nome, el("small", { text: textoPaises(r) }));
      dica.style.left = `${x}px`;
      dica.style.top = `${y}px`;
      dica.classList.add("visivel");
    }
    function esconderDica() { dica.classList.remove("visivel"); }

    async function desenhar() {
      if (!window.d3 || !window.topojson) throw new Error("bibliotecas indisponíveis");
      const mundo = await d3.json(C.mapaUrl);
      const paises = topojson.feature(mundo, mundo.objects.countries).features.filter((f) => f.id !== "010");
      const W = 960, H = 470;
      const proj = d3.geoNaturalEarth1().fitExtent([[6, 6], [W - 6, H - 6]], { type: "FeatureCollection", features: paises });
      const caminho = d3.geoPath(proj);

      const isoRegiao = {};
      D.regioes.forEach((r) => r.paises.forEach((p) => { isoRegiao[D.paises[p].iso] = r.id; }));

      const svg = d3.select(fig).insert("svg", ":first-child")
        .attr("class", "mapa-svg").attr("viewBox", `0 0 ${W} ${H}`)
        .attr("role", "group").attr("aria-label", "Mapa-múndi com as seis regiões destacadas. Use Tab para navegar entre as regiões e Enter para abrir.");
      svgSel = svg;

      svg.append("g").attr("class", "fundo").attr("aria-hidden", "true")
        .selectAll("path").data(paises.filter((f) => !isoRegiao[f.id])).join("path").attr("d", caminho);

      D.regioes.forEach((r) => {
        const g = svg.append("g")
          .attr("class", "regiao-mapa").attr("data-regiao", r.id)
          .attr("tabindex", 0).attr("role", "button")
          .attr("aria-label", `${r.nome}: ${textoPaises(r)}. Abrir a página da região.`)
          .style("--cor", r.corMapa);
        g.selectAll("path").data(paises.filter((f) => isoRegiao[f.id] === r.id)).join("path").attr("d", caminho);
        (r.marcadores || []).forEach((m) => {
          const [x, y] = proj(m.coord);
          g.append("circle").attr("cx", x).attr("cy", y).attr("r", 6);
          // área de toque maior e invisível
          g.append("circle").attr("cx", x).attr("cy", y).attr("r", 16).style("fill", "transparent").style("stroke", "none");
        });

        const no = g.node();
        const posDica = () => {
          const caixa = no.getBBox();
          const escala = fig.getBoundingClientRect().width / W;
          return [(caixa.x + caixa.width / 2) * escala, caixa.y * escala];
        };
        g.on("mouseenter", () => destacar(r.id))
          .on("mousemove", (ev) => { const [x, y] = d3.pointer(ev, fig); mostrarDica(r, x, y); })
          .on("mouseleave", () => { destacar(null); esconderDica(); })
          .on("focus", () => { destacar(r.id); const [x, y] = posDica(); mostrarDica(r, x, y); })
          .on("blur", () => { destacar(null); esconderDica(); })
          .on("click", () => abrirRegiao(r.id))
          .on("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); abrirRegiao(r.id); } });
      });
    }

    desenhar().catch(() => {
      fig.prepend(el("p", { class: "mapa-aviso", text: "Não foi possível carregar o mapa agora. Use a lista de regiões para explorar." }));
    });

    ganchos["cap-mapa"] = () => {
      if (reduzMovimento) return;
      const t0 = performance.now();
      const anim = (t) => {
        const p = Math.min(1, (t - t0) / 1100);
        numero.textContent = `${Math.round(C.numeroDestaque * (1 - Math.pow(1 - p, 3)))}%`;
        if (p < 1) requestAnimationFrame(anim);
      };
      requestAnimationFrame(anim);
    };
  }

  function abrirRegiao(id) { location.hash = `#mapa/${id}`; }

  // ---------- Página de região ----------
  function montarRegiao(id) {
    const r = D.regioes.find((x) => x.id === id);
    const sec = $("#cap-regiao");
    sec.innerHTML = "";
    const miolo = el("div", { class: "miolo" });
    sec.append(miolo);

    const indice = D.regioes.indexOf(r);
    const proxima = D.regioes[(indice + 1) % D.regioes.length];

    miolo.append(
      el("div", { class: "migalha" },
        el("p", { class: "chapeu", text: `Capítulo 3 · ${r.nome}` }),
        el("span", { class: "paleta-nome", text: `Paleta: ${r.paletaNome}` })),
      el("h1", { id: "titulo-regiao", tabindex: "-1", text: r.titulo })
    );

    // Coluna do texto
    const colTexto = el("div", { class: "regiao-texto" },
      el("p", { class: "lide", style: "margin-top:0", text: r.texto }),
      el("aside", { class: "curiosidade", "aria-label": "Curiosidade" },
        el("p", { class: "curiosidade-rotulo", html: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.6 6.9L22 9.5l-5.6 4.8L18.2 22 12 18l-6.2 4 1.8-7.7L2 9.5l7.4-.6z"/></svg>Curiosidade' }),
        el("p", { text: r.curiosidade }))
    );

    // Painel das barras
    let selecionado = r.personagem;
    const eq = criarEq({ valores: D.paises[selecionado], ref: D.media, rotulo: selecionado });
    const tituloBarras = el("h2", { text: `O som ${preposicao(selecionado)} ${selecionado}` });
    const painelBarras = el("div", { class: "painel" },
      el("div", { class: "painel-titulo" }, tituloBarras,
        el("span", { class: "legenda-ref" }, el("i", { "aria-hidden": "true" }), "média dos 70 países")),
      eq.el);

    // Tabela
    const tbody = el("tbody");
    const linhas = r.paises.map((nome) => {
      const p = D.paises[nome];
      const tags = [];
      if (nome === r.personagem) tags.push("personagem");
      if ((r.destaques || []).includes(nome)) tags.push("destaque");
      const b = el("button", { class: "btn-pais", type: "button", "aria-pressed": nome === selecionado ? "true" : "false" }, nome,
        ...tags.map((t) => el("span", { class: "tag", text: t })));
      b.addEventListener("click", () => selecionar(nome));
      const tr = el("tr", { class: nome === selecionado ? "selecionado" : "" },
        el("th", { scope: "row" }, b),
        el("td", { text: fmt(p.alegria) }),
        el("td", { text: fmt(p.energia) }),
        el("td", { text: fmt(p.danca) }),
        el("td", { text: `${fmt(p.explicitas, 1)}%` }),
        el("td", { text: fmt(p.felicidade, 2) }));
      tbody.append(tr);
      return { nome, tr, b };
    });
    tbody.append(el("tr", { class: "linha-media" },
      el("th", { scope: "row", class: "suave", text: "Média dos 70" }),
      el("td", { class: "suave", text: fmt(D.media.alegria) }),
      el("td", { class: "suave", text: fmt(D.media.energia) }),
      el("td", { class: "suave", text: fmt(D.media.danca) }),
      el("td", { class: "suave", text: `${fmt(D.media.explicitas, 1)}%` }),
      el("td", { class: "suave", text: fmt(D.media.felicidade, 2) })));

    const tabela = el("table", {},
      el("caption", { text: `Os países da região` }),
      el("thead", {}, el("tr", {},
        el("th", { scope: "col", text: "País" }),
        el("th", { scope: "col", text: "Alegria" }),
        el("th", { scope: "col", text: "Energia" }),
        el("th", { scope: "col", text: "Dança" }),
        el("th", { scope: "col", html: '<abbr title="Porcentagem de músicas explícitas">% expl.</abbr>' }),
        el("th", { scope: "col", html: '<abbr title="Felicidade (0 a 10)">Felic.</abbr>' }))),
      tbody);
    const painelTabela = el("div", { class: "painel" },
      el("div", { class: "tabela-rolagem", tabindex: "0", role: "region", "aria-label": "Tabela dos países da região" }, tabela),
      el("p", { class: "tabela-dica", text: "Clique no nome de um país para ver as barras dele." }));

    function selecionar(nome) {
      selecionado = nome;
      linhas.forEach((l) => {
        l.tr.classList.toggle("selecionado", l.nome === nome);
        l.b.setAttribute("aria-pressed", l.nome === nome ? "true" : "false");
      });
      tituloBarras.textContent = `O som ${preposicao(nome)} ${nome}`;
      eq.definir(D.paises[nome], D.media, nome);
    }

    // Players
    const players = el("div", { class: "players" });
    r.musicas.forEach((m) => {
      if (m.spotifyId && m.spotifyId.trim()) {
        players.append(el("div", { class: "player" }, el("iframe", {
          src: `https://open.spotify.com/embed/track/${encodeURIComponent(m.spotifyId.trim())}?utm_source=generator`,
          title: `Player do Spotify: ${m.titulo}, ${m.artista}`,
          loading: "lazy",
          allow: "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        })));
      } else {
        players.append(el("div", { class: "player-vazio" },
          el("span", { class: "disco", "aria-hidden": "true" }),
          el("div", {}, el("strong", { text: m.titulo }), el("span", { text: m.artista }))));
      }
    });
    const painelPlayers = el("div", { class: "painel" },
      el("div", { class: "painel-titulo" }, el("h2", { text: r.musicas.length > 1 ? "Para ouvir" : "Para ouvir" })),
      players);

    miolo.append(
      el("div", { class: "regiao-layout" },
        el("div", {}, colTexto, el("div", { style: "margin-top:1rem" }, painelPlayers)),
        el("div", {}, painelBarras, painelTabela)),
      el("div", { class: "fim-capitulo" },
        botaoLink("#mapa", "Voltar ao mapa", "secundario", true),
        botaoLink(`#mapa/${proxima.id}`, `Próxima região: ${proxima.nome}`, "secundario"),
        botaoLink("#resposta", "Ir para a resposta"))
    );

    ganchos["cap-regiao"] = () => eq.tocar();
    return r;
  }

  // "da Indonésia", "do México", "de Hong Kong"...
  function preposicao(nome) {
    const fem = ["Indonésia", "Malásia", "Romênia", "Bulgária", "Hungria", "Eslováquia", "Guatemala", "Costa Rica", "Finlândia", "Islândia", "Dinamarca", "Suécia", "Noruega", "Nigéria", "África do Sul", "Coreia do Sul"];
    const sem = ["Taiwan", "Hong Kong", "Cuba"];
    if (sem.includes(nome)) return "de";
    return fem.includes(nome) ? "da" : "do";
  }

  // ====================================================
  // CAPÍTULO 4 — A RESPOSTA
  // ====================================================
  const ICONES = {
    pessoas: '<path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1M16 3.5a4 4 0 0 1 0 7.5M22 21v-1a6 6 0 0 0-4-5.6"/>',
    moeda: '<circle cx="12" cy="12" r="9"/><path d="M15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .9-3 2s1 1.7 3 2 3 .9 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5M12 6v2M12 16v2"/>',
    coracao: '<path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z"/><path d="M7 12h2.5l1.5-2.5 2 4 1.5-1.5H17"/>',
    caminhos: '<path d="M12 21v-7M12 14 6 8M12 14l6-6M6 8V4M6 4H2M6 4h4M18 8V4m0 0h-4m4 0h4"/>',
    presente: '<rect x="3" y="8" width="18" height="5" rx="1"/><path d="M5 13v8h14v-8M12 8v13M12 8c-2-3-6-4-6-1.5S10 8 12 8zm0 0c2-3 6-4 6-1.5S14 8 12 8z"/>',
    instituicao: '<path d="M3 21h18M4 10h16M12 3l9 5H3zM6 10v8M10 10v8M14 10v8M18 10v8M4 18h16"/>'
  };

  function montarResposta() {
    const C = D.capitulos.resposta;
    const sec = $("#cap-resposta");
    const miolo = el("div", { class: "miolo" });
    sec.append(miolo);

    miolo.append(
      el("p", { class: "chapeu", text: "Capítulo 4 · A resposta" }),
      el("h1", { id: "titulo-resposta", tabindex: "-1", style: "max-width:22ch", text: C.titulo }),
      el("p", { class: "lide", text: C.texto })
    );

    const barras = C.grafico.map((g) => {
      const valor = el("span", { class: "barra-h-valor", text: "0%" });
      const preench = el("span", { class: "barra-h-preench" });
      const trilho = el("span", { class: "barra-h-trilho", "aria-hidden": "true" }, preench, valor);
      const linha = el("div", { class: "barra-h", role: "listitem", "aria-label": `${g.nome}: ${g.valor}%` },
        el("span", { class: "barra-h-nome", text: g.nome }), trilho);
      return { g, linha, preench, valor, trilho };
    });
    const grafico = el("figure", { class: "resposta-grafico", style: "margin-left:0;margin-right:0" },
      el("h2", { id: "titulo-grafico", text: C.tituloGrafico }),
      el("div", { role: "list", "aria-labelledby": "titulo-grafico" }, barras.map((b) => b.linha)),
      el("div", { class: "barra-h", "aria-hidden": "true" }, el("span"),
        el("span", { class: "barra-h-escala", style: "grid-column:auto" }, el("span", { text: "0%" }), el("span", { text: "50%" }), el("span", { text: "100%" }))));

    const fatores = el("ul", { class: "fatores" },
      C.fatores.map((f) => el("li", {},
        el("span", { html: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONES[f.icone] || ""}</svg>` }),
        f.nome)));

    const frase = el("blockquote", { class: "frase-final" });
    // destaca a parte "quase nada sobre a sua felicidade"
    const partes = C.fraseFinal.split(", e ");
    if (partes.length === 2) frase.append(partes[0] + ", e ", el("mark", { text: partes[1] }));
    else frase.textContent = C.fraseFinal;

    miolo.append(
      grafico,
      el("h2", { class: "fatores-titulo", text: C.tituloFatores }),
      fatores,
      frase,
      el("div", { class: "fim-capitulo" }, botaoLink("#mapa", C.botaoVoltar, "principal", true)),
      el("footer", { class: "rodape" }, el("h2", { text: "Metodologia" }), el("p", { text: D.metodologia }))
    );

    let observador = null;
    function animar() {
      barras.forEach((b, i) => {
        b.preench.style.transition = "none"; b.valor.style.transition = "none";
        b.preench.style.setProperty("--p", 0); b.trilho.style.setProperty("--p", 0);
        b.valor.style.setProperty("--p", 0); b.valor.textContent = "0%";
        void b.preench.offsetWidth;
        setTimeout(() => {
          b.preench.style.transition = ""; b.valor.style.transition = "";
          b.preench.style.setProperty("--p", b.g.valor);
          b.valor.style.setProperty("--p", b.g.valor);
          if (reduzMovimento) { b.valor.textContent = `${b.g.valor}%`; return; }
          const t0 = performance.now();
          const passo = (t) => {
            const p = Math.min(1, (t - t0) / 1600);
            b.valor.textContent = `${Math.round(b.g.valor * (1 - Math.pow(1 - p, 3)))}%`;
            if (p < 1) requestAnimationFrame(passo);
          };
          requestAnimationFrame(passo);
        }, 120 + i * 350);
      });
    }
    ganchos["cap-resposta"] = () => {
      barras.forEach((b) => { b.preench.style.setProperty("--p", 0); b.valor.style.setProperty("--p", 0); b.valor.textContent = "0%"; });
      if (observador) observador.disconnect();
      observador = new IntersectionObserver((ents) => {
        if (ents.some((e) => e.isIntersecting)) { animar(); observador.disconnect(); }
      }, { threshold: 0.4 });
      observador.observe(grafico);
    };
  }

  // ====================================================
  // NAVEGAÇÃO (por endereço: #jogo, #grupos, #mapa, #mapa/regiao, #resposta)
  // ====================================================
  function lerEndereco() {
    const h = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
    if (h.startsWith("mapa/")) {
      const id = h.slice(5);
      if (D.regioes.some((r) => r.id === id)) return { cap: "mapa", regiao: id };
    }
    return { cap: CAPS.some((c) => c.id === h) ? h : "jogo" };
  }

  let primeiraVez = true;
  function navegar() {
    const rota = lerEndereco();
    let alvo = CAPS.find((c) => c.id === rota.cap).secao;
    let regiao = null;
    if (rota.regiao) { regiao = montarRegiao(rota.regiao); alvo = "cap-regiao"; }

    $$(".capitulo").forEach((s) => { s.hidden = s.id !== alvo; });
    aplicarPaleta(regiao ? regiao.paleta : D.paletaGeral);

    $$("#menu-lista a").forEach((a) => {
      if (a.dataset.cap === rota.cap) a.setAttribute("aria-current", "step");
      else a.removeAttribute("aria-current");
    });

    const nomeCap = D.capitulos[rota.cap].menu;
    document.title = regiao ? `${regiao.nome} · ${D.titulo}` : `${nomeCap} · ${D.titulo}`;

    window.scrollTo({ top: 0, behavior: "auto" });
    if (!primeiraVez) {
      const h1 = $(`#${alvo} h1`);
      if (h1) h1.focus({ preventScroll: true });
    }
    primeiraVez = false;
    if (ganchos[alvo]) ganchos[alvo]();
  }

  // ---------- Início ----------
  montarMenu();
  montarJogo();
  montarGrupos();
  montarMapa();
  montarResposta();
  window.addEventListener("hashchange", navegar);
  navegar();
})();
