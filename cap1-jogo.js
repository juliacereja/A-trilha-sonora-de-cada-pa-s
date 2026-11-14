/* ==========================================================
   Capítulo 1: o jogo, com três mecânicas
   (termômetro, coloque em ordem, o impostor)
   ========================================================== */
(() => {
  "use strict";
  const T = window.TS;
  const { D, $, el, fmt, reduz, ICONE, botao, criarEq, descreverBarras, embaralhar, som, anunciar } = T;
  const C = D.capitulos.jogo;
  let area, contador, estado;

  // Capa de disco sem nome, com as três barras
  function capaMisterio(pais, rotulo, rot) {
    const p = D.paises[pais];
    const eq = criarEq({ valores: p, rotulo });
    const adesivo = el("span", { class: "cm-adesivo", hidden: true });
    const q = el("span", { class: "cm-q", "aria-hidden": "true", text: "?" });
    const capa = el("span", { class: "cm", style: `--rot:${rot}deg` },
      el("span", { class: "cm-vinil", "aria-hidden": "true" }),
      el("span", { class: "cm-capa" }, el("span", { class: "cm-topo" }, el("span", { text: rotulo }), q), eq.el, adesivo));
    return {
      el: capa, eq, pais,
      revelar() {
        adesivo.hidden = false; adesivo.innerHTML = "";
        adesivo.append(el("strong", { text: pais }), el("span", { text: `Felicidade ${fmt(p.felicidade, 2)}` }));
        q.textContent = "";
      }
    };
  }

  function montar(sec) {
    const miolo = el("div", { class: "miolo" });
    sec.append(miolo);
    contador = el("div", { class: "contador", role: "status", "aria-live": "polite" });
    miolo.append(
      el("div", { class: "jogo-cab" },
        el("div", {},
          el("p", { class: "chapeu", text: "Lado A · Faixa 1" }),
          el("h1", { id: "titulo-jogo", tabindex: "-1", text: C.titulo }),
          el("p", { class: "lide", text: C.intro })),
        contador)
    );
    area = el("div", { class: "jogo-area" });
    miolo.append(area);
    iniciar();
  }

  function iniciar() {
    estado = { rodada: 0, acertos: 0, resultados: [] };
    atualizarContador();
    renderRodada();
  }

  function atualizarContador() {
    contador.innerHTML = "";
    const slots = el("span", { class: "contador-slots", "aria-hidden": "true" });
    C.rodadas.forEach((_, i) => slots.append(el("span", { class: `contador-slot${estado.resultados[i] ? " ganho" : ""}` })));
    contador.append(slots, el("span", { class: "contador-num" },
      `${String(estado.acertos).padStart(2, "0")}/${String(C.rodadas.length).padStart(2, "0")}`,
      el("small", { text: "discos acertados" })));
    contador.setAttribute("aria-label", `Acertos: ${estado.acertos} de ${C.rodadas.length}`);
  }

  function renderRodada() {
    area.innerHTML = "";
    const r = C.rodadas[estado.rodada];
    const h2 = el("h2", { tabindex: "-1", text: r.nome });
    area.append(
      el("div", { class: "rodada-cab" }, el("span", { class: "carimbo", text: `Rodada ${estado.rodada + 1} de ${C.rodadas.length}` }), h2),
      el("p", { class: "rodada-instr", text: r.instrucao }));
    const corpo = el("div");
    const fim = el("div", { class: "revelacao", "aria-live": "polite" });
    area.append(corpo, fim);
    RODADAS[r.tipo](r, corpo, (certo, detalhe) => concluir(certo, detalhe, r, fim));
    return h2;
  }

  function concluir(certo, detalhe, r, fim) {
    estado.resultados[estado.rodada] = certo;
    if (certo) estado.acertos++;
    atualizarContador();
    fim.append(el("div", { class: "folha fita" },
      el("p", { class: `revelacao-veredito${certo ? " certo" : ""}`, text: certo ? C.acertou : C.errou }),
      detalhe ? el("p", { class: "revelacao-detalhe", text: detalhe }) : null,
      el("p", { text: r.texto }),
      el("p", { class: "nota", style: "margin-top:.6rem", text: C.notaFelicidade })));
    const ultima = estado.rodada >= C.rodadas.length - 1;
    const foco = botao({
      texto: ultima ? "Ver o resultado" : C.botaoProximaRodada,
      onclick: () => {
        if (ultima) return final();
        estado.rodada++;
        const h2 = renderRodada();
        area.scrollIntoView({ behavior: reduz ? "auto" : "smooth", block: "start" });
        h2.focus({ preventScroll: true });
      }
    });
    fim.append(el("div", { class: "acoes" }, foco));
    setTimeout(() => { fim.scrollIntoView({ behavior: reduz ? "auto" : "smooth", block: "center" }); foco.focus({ preventScroll: true }); }, 500);
  }

  function final() {
    area.innerHTML = "";
    const frase = C.final.replace("{acertos}", estado.acertos);
    const i = frase.indexOf(". ");
    const p = el("p", { class: "final-frase", tabindex: "-1" });
    if (i > 0) p.append(frase.slice(0, i + 1) + " ", el("em", { text: frase.slice(i + 2) })); else p.textContent = frase;
    area.append(el("div", { class: "final" }, p,
      el("div", { class: "fim-capitulo" },
        botao({ texto: C.botaoProximo, href: "#grupos" }),
        botao({ texto: C.botaoJogarDeNovo, tipo: "secundario", onclick: () => { iniciar(); area.scrollIntoView({ block: "start" }); area.querySelector("h2")?.focus({ preventScroll: true }); } }))));
    area.scrollIntoView({ behavior: reduz ? "auto" : "smooth", block: "start" });
    p.focus({ preventScroll: true });
  }

  // ====================================================
  const RODADAS = {
    // ---------- 1. O termômetro ----------
    termometro(r, corpo, fim) {
      const p = D.paises[r.pais];
      const capa = capaMisterio(r.pais, "Disco misterioso", -2);
      let v = 5, travado = false;
      const escala = el("div", { class: "termo-escala", "aria-hidden": "true" });
      for (let k = 0; k <= 10; k += 2) escala.append(el("span", { style: `bottom:${k * 10}%`, text: String(k) }));
      const tubo = el("div", {
        class: "termo-tubo", role: "slider", tabindex: "0", "aria-label": "Seu chute para a felicidade do país, de 0 a 10",
        "aria-valuemin": "0", "aria-valuemax": "10", "aria-orientation": "vertical"
      },
        el("span", { class: "termo-liquido" }), el("span", { class: "termo-alca" }),
        el("span", { class: "termo-media", style: `--m:${D.media.felicidade / 10}`, "aria-hidden": "true" }, el("span", { text: `média ${fmt(D.media.felicidade, 2)}` })),
        el("span", { class: "termo-bulbo" }));
      const leitura = el("strong");
      const definir = (nv) => {
        v = Math.round(Math.min(10, Math.max(0, nv)) * 10) / 10;
        tubo.style.setProperty("--t", v / 10);
        leitura.textContent = fmt(v, 1);
        tubo.setAttribute("aria-valuenow", v); tubo.setAttribute("aria-valuetext", `${fmt(v, 1)} de 10`);
      };
      definir(5);
      const mover = (e) => { const rr = tubo.getBoundingClientRect(); definir((1 - (e.clientY - rr.top) / rr.height) * 10); };
      tubo.addEventListener("pointerdown", (e) => {
        if (travado) return;
        e.preventDefault(); tubo.setPointerCapture(e.pointerId); mover(e);
        const mv = (ev) => mover(ev);
        const up = () => { tubo.removeEventListener("pointermove", mv); tubo.removeEventListener("pointerup", up); tubo.removeEventListener("pointercancel", up); som.clique(); };
        tubo.addEventListener("pointermove", mv); tubo.addEventListener("pointerup", up); tubo.addEventListener("pointercancel", up);
      });
      tubo.addEventListener("keydown", (e) => {
        if (travado) return;
        const passos = { ArrowUp: .1, ArrowRight: .1, ArrowDown: -.1, ArrowLeft: -.1, PageUp: 1, PageDown: -1 };
        if (e.key in passos) { e.preventDefault(); definir(v + passos[e.key]); }
        else if (e.key === "Home") { e.preventDefault(); definir(0); }
        else if (e.key === "End") { e.preventDefault(); definir(10); }
      });
      const conf = botao({
        texto: r.botao, onclick: () => {
          if (travado) return;
          travado = true;
          conf.setAttribute("aria-disabled", "true"); tubo.setAttribute("aria-disabled", "true");
          tubo.append(el("span", { class: "termo-real", style: `--rv:${p.felicidade / 10}`, "aria-hidden": "true" }, el("span", { text: `real ${fmt(p.felicidade, 2)}` })));
          capa.revelar();
          const d = Math.abs(v - p.felicidade);
          fim(d <= r.tolerancia + 1e-9, `Seu chute: ${fmt(v, 1)}. Nota real: ${fmt(p.felicidade, 2)}. Distância: ${fmt(d, 2)} ${d === 1 ? "ponto" : "pontos"}.`);
        }
      });
      corpo.append(el("div", { class: "r-termo" }, capa.el,
        el("div", { class: "termo-area" },
          el("div", { class: "termo" }, escala, tubo),
          el("div", { class: "termo-leitura" }, el("span", { text: "Seu chute" }), leitura, el("span", { text: "de 10" }), el("div", { style: "margin-top:1.4rem" }, conf)))));
    },

    // ---------- 2. Coloque em ordem ----------
    ordem(r, corpo, fim) {
      const correta = r.paises.slice().sort((a, b) => D.paises[b].felicidade - D.paises[a].felicidade);
      let inicial = embaralhar(r.paises);
      while (inicial.every((p, i) => p === correta[i])) inicial = embaralhar(r.paises);
      const letras = "ABCD", letraDe = {};
      inicial.forEach((p, i) => (letraDe[p] = letras[i]));
      const ul = el("ul", { class: "ordem", "aria-label": "Discos para ordenar, do mais feliz ao menos feliz" });
      let travado = false;

      const itens = inicial.map((pais, i) => {
        const capa = capaMisterio(pais, `Disco ${letraDe[pais]}`, [-2, 1.5, -1, 2][i]);
        const pos = el("span", { class: "ordem-pos", "aria-hidden": "true" });
        const esq = el("button", { type: "button", "aria-label": `Mover disco ${letraDe[pais]} para a esquerda`, html: ICONE.esq });
        const dir = el("button", { type: "button", "aria-label": `Mover disco ${letraDe[pais]} para a direita`, html: ICONE.dir });
        const ctrl = el("span", { class: "ordem-ctrl" }, esq, el("span", { class: "alca", "aria-hidden": "true", text: "Arrastar" }), dir);
        const li = el("li", { class: "ordem-item", tabindex: "0" }, pos, capa.el, ctrl);
        const item = { pais, li, capa, pos, esq, dir, ctrl };
        esq.addEventListener("click", () => mover(item, -1, esq));
        dir.addEventListener("click", () => mover(item, 1, dir));
        li.addEventListener("keydown", (e) => {
          if (e.target !== li) return;
          if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); mover(item, -1, li); }
          else if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); mover(item, 1, li); }
        });
        arrastavel(item);
        return item;
      });
      let arr = itens.slice();

      function rotular() {
        arr.forEach((it, i) => {
          it.pos.textContent = `${i + 1}º`;
          if (!travado) it.li.setAttribute("aria-label", `Disco ${letraDe[it.pais]}, posição ${i + 1} de 4. ${descreverBarras(D.paises[it.pais])}. Use as setas para mudar de posição.`);
          it.esq.disabled = travado || i === 0; it.dir.disabled = travado || i === arr.length - 1;
        });
      }
      function render(exceto = null, dur = 280) {
        const antes = new Map(arr.map((it) => [it, it.li.getBoundingClientRect()]));
        if (exceto) {
          const k = arr.indexOf(exceto);
          arr.slice(0, k).forEach((o) => ul.insertBefore(o.li, exceto.li));
          arr.slice(k + 1).forEach((o) => ul.append(o.li));
        } else arr.forEach((it) => ul.append(it.li));
        rotular();
        if (reduz) return;
        arr.forEach((it) => {
          if (it === exceto) return;
          const a = antes.get(it), b = it.li.getBoundingClientRect(), dx = a.left - b.left, dy = a.top - b.top;
          if (dx || dy) it.li.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], { duration: dur, easing: "cubic-bezier(.3,1.2,.5,1)" });
        });
      }
      function mover(it, d, foco) {
        if (travado) return;
        const i = arr.indexOf(it), j = i + d;
        if (j < 0 || j >= arr.length) return;
        arr.splice(i, 1); arr.splice(j, 0, it);
        render(); som.clique();
        anunciar(`Disco ${letraDe[it.pais]} agora na posição ${j + 1}`);
        (foco && !foco.disabled ? foco : it.li).focus({ preventScroll: true });
      }
      function arrastavel(it) {
        let ativo = false, gx = 0, gy = 0, ulR = null, pid = null;
        it.li.addEventListener("pointerdown", (e) => {
          if (travado || e.target.closest("button")) return;
          if (e.pointerType === "mouse" ? e.button !== 0 : !e.target.closest(".alca")) return;
          e.preventDefault();
          ativo = true; pid = e.pointerId;
          try { it.li.setPointerCapture(pid); } catch (err) { /* ok */ }
          it.li.classList.add("arrastando");
          ulR = ul.getBoundingClientRect();
          gx = e.clientX - ulR.left - it.li.offsetLeft; gy = e.clientY - ulR.top - it.li.offsetTop;
        });
        it.li.addEventListener("pointermove", (e) => {
          if (!ativo || e.pointerId !== pid) return;
          const x = e.clientX - ulR.left - gx, y = e.clientY - ulR.top - gy;
          const cx = x + it.li.offsetWidth / 2, cy = y + it.li.offsetHeight / 2;
          let melhor = arr.indexOf(it), menor = Infinity;
          arr.forEach((o, i) => {
            const ox = o.li.offsetLeft + o.li.offsetWidth / 2, oy = o.li.offsetTop + o.li.offsetHeight / 2, d = (ox - cx) ** 2 + (oy - cy) ** 2;
            if (d < menor) { menor = d; melhor = i; }
          });
          const atual = arr.indexOf(it);
          if (melhor !== atual) { arr.splice(atual, 1); arr.splice(melhor, 0, it); render(it); }
          it.li.style.transform = `translate(${x - it.li.offsetLeft}px, ${y - it.li.offsetTop}px)`;
        });
        const soltar = () => {
          if (!ativo) return;
          ativo = false;
          it.li.classList.remove("arrastando");
          const t = it.li.style.transform; it.li.style.transform = "";
          if (!reduz && t) it.li.animate([{ transform: t }, { transform: "none" }], { duration: 220, easing: "ease-out" });
          som.clique();
          anunciar(`Disco ${letraDe[it.pais]} na posição ${arr.indexOf(it) + 1}`);
        };
        it.li.addEventListener("pointerup", soltar);
        it.li.addEventListener("pointercancel", soltar);
      }

      render();
      const conf = botao({
        texto: r.botao, onclick: () => {
          if (travado) return;
          travado = true;
          conf.setAttribute("aria-disabled", "true");
          const posUsuario = new Map(arr.map((it, i) => [it.pais, i]));
          let n = 0;
          correta.forEach((p, i) => { if (posUsuario.get(p) === i) n++; });
          arr = correta.map((p) => itens.find((it) => it.pais === p));
          render(null, 750);
          itens.forEach((it) => {
            it.li.classList.add("travado");
            it.capa.revelar();
            const iu = posUsuario.get(it.pais), ic = correta.indexOf(it.pais), ok = iu === ic;
            it.ctrl.replaceWith(el("span", { class: `ordem-voce ${ok ? "certo" : "errado"}`, text: ok ? `Você pôs em ${iu + 1}º: certo` : `Você pôs em ${iu + 1}º` }));
            it.li.setAttribute("aria-label", `${ic + 1}º: ${it.pais}, felicidade ${fmt(D.paises[it.pais].felicidade, 2)}. Você colocou em ${iu + 1}º.`);
          });
          fim(n >= r.minimoAcertos, `Você acertou ${n} de 4 posições.`);
        }
      });
      corpo.append(
        el("div", { class: "ordem-escala", "aria-hidden": "true" }, el("span", { text: "Mais feliz" }), el("i"), el("span", { text: "Menos feliz" })),
        ul, el("div", { class: "acoes" }, conf));
    },

    // ---------- 3. O impostor ----------
    impostor(r, corpo, fim) {
      const ordem = embaralhar(r.paises);
      const ul = el("ul", { class: "impostor" });
      let feito = false;
      const discos = ordem.map((pais, i) => {
        const capa = capaMisterio(pais, `Disco ${i + 1}`, [-2, 1.4, -1, 2.2, -1.6, 1][i]);
        const rot = el("span", { class: "escolha-rot" });
        const b = el("button", { type: "button", "aria-label": `Disco ${i + 1}: ${descreverBarras(D.paises[pais])}. Escolher como intruso.` }, capa.el, rot);
        b.addEventListener("click", () => escolher(pais));
        ul.append(el("li", {}, b));
        return { pais, b, capa, rot };
      });
      function escolher(pais) {
        if (feito) return;
        feito = true; som.clique();
        const certo = pais === r.impostor;
        discos.forEach((x) => {
          x.b.setAttribute("aria-disabled", "true");
          x.capa.revelar();
          if (x.pais === r.impostor) { x.capa.el.classList.add("intruso"); x.rot.textContent = "O intruso"; }
          if (x.pais === pais) { x.b.classList.add("escolhido"); x.rot.textContent = certo ? "Sua escolha: o intruso" : "Sua escolha"; }
          x.b.setAttribute("aria-label", `${x.pais}, felicidade ${fmt(D.paises[x.pais].felicidade, 2)}${x.pais === r.impostor ? ", o intruso" : ""}${x.pais === pais ? ", sua escolha" : ""}`);
        });
        fim(certo, certo ? "" : `Você escolheu ${pais}.`);
      }
      corpo.append(ul);
    }
  };

  T.capitulos.jogo = { montar, entrar() {} };
})();
