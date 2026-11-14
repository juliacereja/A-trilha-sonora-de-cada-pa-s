/* ==========================================================
   Capítulo 4: a resposta, num painel na parede
   ========================================================== */
(() => {
  "use strict";
  const T = window.TS;
  const { D, el, reduz, botao } = T;
  const C = D.capitulos.resposta;
  let discos = [], observador = null;

  function montar(sec) {
    const miolo = el("div", { class: "miolo" });
    sec.append(miolo);
    const cores = ["#E8502E", "#2E6F73"];
    discos = C.grafico.map((g, i) => {
      const num = el("span", { class: "dprop-num", text: `${g.valor}%` });
      const item = el("figure", { class: "dprop", style: "margin:0", role: "img", "aria-label": `${g.nome}: ${g.valor}%` },
        el("div", { class: "dprop-area", "aria-hidden": "true" }, el("span", { class: "dprop-disco vinil", style: `--k:${Math.sqrt(g.valor / 100).toFixed(4)};--rotulo:${cores[i % 2]}` })),
        el("figcaption", { "aria-hidden": "true" }, num, el("span", { class: "dprop-nome", style: "display:block", text: g.nome })));
      return { g, item, num };
    });
    const frase = el("blockquote", { class: "frase-final" });
    const partes = C.fraseFinal.split(", e ");
    if (partes.length === 2) frase.append(partes[0] + ", e ", el("mark", { text: partes[1] })); else frase.textContent = C.fraseFinal;

    miolo.append(
      el("p", { class: "chapeu", text: "Lado B · Faixa 4" }),
      el("h1", { id: "titulo-resposta", tabindex: "-1", style: "max-width:20ch", text: C.titulo }),
      el("p", { class: "lide", text: C.texto }),
      el("section", { class: "painel-final", "aria-labelledby": "titulo-painel" },
        el("div", { class: "folha fita" },
          el("h2", { id: "titulo-painel", text: C.tituloGrafico }),
          el("div", { class: "discos-prop" }, discos.map((d) => d.item)),
          el("p", { class: "dprop-legenda", text: "O círculo tracejado representa 100%. A área de cada disco é proporcional ao quanto ele explica." }))),
      el("h2", { class: "etiquetas-titulo", text: C.tituloFatores }),
      el("ul", { class: "etiquetas" }, C.fatores.map((f) => el("li", { text: f.nome }))),
      frase,
      el("div", { class: "fim-capitulo" }, botao({ texto: C.botaoVoltar, href: "#mapa", volta: true })),
      el("footer", { class: "encarte-final" },
        el("div", { class: "folha" }, el("h2", { text: "Notas do encarte: metodologia" }), el("p", { text: D.metodologia }))));
  }

  function entrar() {
    discos.forEach((d) => { d.item.classList.remove("on"); d.num.textContent = reduz ? `${d.g.valor}%` : "0%"; });
    if (observador) observador.disconnect();
    observador = new IntersectionObserver((ents) => {
      if (!ents.some((e) => e.isIntersecting)) return;
      observador.disconnect();
      discos.forEach((d, i) => setTimeout(() => {
        d.item.classList.add("on");
        if (reduz) return;
        const t0 = performance.now();
        const passo = (t) => {
          const p = Math.min(1, (t - t0) / 1400);
          d.num.textContent = `${Math.round(d.g.valor * (1 - Math.pow(1 - p, 3)))}%`;
          if (p < 1) requestAnimationFrame(passo);
        };
        requestAnimationFrame(passo);
      }, 150 + i * 450));
    }, { threshold: .35 });
    observador.observe(discos[0].item.closest(".discos-prop"));
  }

  T.capitulos.resposta = { montar, entrar };
})();
