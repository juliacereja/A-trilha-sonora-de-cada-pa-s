/* ==========================================================
   Navegação entre capítulos (por endereço: #jogo, #grupos,
   #mapa, #mapa/regiao, #resposta) e inicialização.
   ========================================================== */
(() => {
  "use strict";
  const T = window.TS;
  const { D, $, $$, el, som, sala, aplicarPaleta, ICONE } = T;

  const CAPS = [
    { id: "jogo", secao: "cap-jogo", lado: "A", n: 1 },
    { id: "grupos", secao: "cap-grupos", lado: "A", n: 2 },
    { id: "mapa", secao: "cap-mapa", lado: "B", n: 3 },
    { id: "resposta", secao: "cap-resposta", lado: "B", n: 4 }
  ];

  function montarMenu() {
    const ol = $("#menu-lista");
    let ladoAtual = null;
    CAPS.forEach((c) => {
      if (c.lado !== ladoAtual) { ladoAtual = c.lado; ol.append(el("li", { class: "lado-rot", "aria-hidden": "true", text: `LADO ${c.lado}` })); }
      const a = el("a", { href: `#${c.id}`, "data-cap": c.id, "aria-label": `Faixa ${c.n}: ${D.capitulos[c.id].menu}` },
        el("span", { class: "num", "aria-hidden": "true", text: `${c.lado}${c.n}` }),
        el("span", { class: "rotulo", "aria-hidden": "true", text: D.capitulos[c.id].menu }));
      ol.append(el("li", {}, a));
    });
  }

  function montarSom() {
    const b = $("#botao-som");
    $(".botao-som-ic", b).innerHTML = ICONE.som;
    const atualizar = () => {
      b.setAttribute("aria-pressed", som.ligado ? "true" : "false");
      b.setAttribute("aria-label", som.ligado ? "Som ligado. Clique para desligar." : "Som desligado. Clique para ligar.");
      $(".botao-som-txt", b).textContent = som.ligado ? "Som ligado" : "Som";
    };
    b.addEventListener("click", () => { som.alternar(); atualizar(); });
    atualizar();
  }

  function lerEndereco() {
    const h = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
    if (h.startsWith("mapa/")) {
      const id = h.slice(5);
      if (D.regioes.some((r) => r.id === id)) return { cap: "mapa", regiao: id };
    }
    return { cap: CAPS.some((c) => c.id === h) ? h : "jogo" };
  }

  const ganchos = {
    "cap-jogo": () => T.capitulos.jogo?.entrar?.(),
    "cap-grupos": () => T.capitulos.grupos?.entrar?.(),
    "cap-mapa": (ctx) => T.capitulos.regioes?.entrarMapa?.(ctx),
    "cap-regiao": (ctx) => T.capitulos.regioes?.entrarRegiao?.(ctx),
    "cap-resposta": () => T.capitulos.resposta?.entrar?.()
  };

  let rotaAtual = null, primeira = true;
  function navegar() {
    const rota = lerEndereco();
    const anterior = rotaAtual;
    rotaAtual = rota;
    let alvo = CAPS.find((c) => c.id === rota.cap).secao;
    let regiao = null;
    if (rota.regiao && T.capitulos.regioes) { regiao = T.capitulos.regioes.montarRegiao(rota.regiao); alvo = "cap-regiao"; }

    $$(".capitulo").forEach((s) => { s.hidden = s.id !== alvo; });
    aplicarPaleta(regiao ? regiao.paleta : D.paletaGeral, regiao ? "regiao" : "geral");
    $$("#menu-lista a").forEach((a) => { if (a.dataset.cap === rota.cap) a.setAttribute("aria-current", "step"); else a.removeAttribute("aria-current"); });
    document.title = regiao ? `${regiao.nome} · ${D.titulo}` : `${D.capitulos[rota.cap].menu} · ${D.titulo}`;

    // Fora do mapa e das regiões, a vitrola fica parada
    if (alvo !== "cap-regiao") T.capitulos.regioes?.pararMusica?.();
    if (alvo !== "cap-regiao" && alvo !== "cap-mapa") { sala.parar(); sala.colocarDisco(null); }

    window.scrollTo({ top: 0, behavior: "auto" });
    if (!primeira) { const h1 = $(`#${alvo} h1`); if (h1) h1.focus({ preventScroll: true }); }
    primeira = false;
    ganchos[alvo]?.({ anterior, rota });
  }
  T.navegar = navegar;
  T.irPara = (hash) => { history.pushState(null, "", hash); navegar(); };

  // ---------- Início ----------
  sala.montar();
  montarMenu();
  montarSom();
  aplicarPaleta(D.paletaGeral, "geral");
  T.capitulos.jogo?.montar($("#cap-jogo"));
  T.capitulos.grupos?.montar($("#cap-grupos"));
  T.capitulos.regioes?.montarMapa($("#cap-mapa"));
  T.capitulos.resposta?.montar($("#cap-resposta"));
  window.addEventListener("hashchange", navegar);
  navegar();
})();
