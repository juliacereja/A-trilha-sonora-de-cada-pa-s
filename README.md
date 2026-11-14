# A trilha sonora de um país

Site interativo: "país feliz ouve música feliz?". Cruza o top 50 do Spotify de 70 países com o World Happiness Report 2026.

## Arquivos

| Arquivo | Para que serve |
|---|---|
| `index.html` | Esqueleto da página |
| `styles.css` | Visual da sala, animações e versão para celular |
| `data.js` | **Todos os números, textos, cores e IDs do Spotify.** É o único arquivo que você precisa editar |
| `ilustracoes.js` | As ilustrações em SVG: capas dos discos, toca-discos e os seis cenários |
| `nucleo.js` | Peças comuns: barras, sons, paletas e a sala |
| `cap1-jogo.js` | Capítulo 1: o jogo (termômetro, coloque em ordem, o impostor) |
| `cap2-mesa.js` | Capítulo 2: a mesa de som e o gráfico de dispersão |
| `cap3-regioes.js` | Capítulo 3: a parede de discos, o toca-discos e as páginas das regiões |
| `cap4-resposta.js` | Capítulo 4: a resposta |
| `app.js` | A navegação entre os capítulos |

Todas as ilustrações são originais, desenhadas em código (SVG e CSS). O site não usa nenhuma imagem baixada.

**Depois de editar um arquivo**, troque o número `?v=...` no fim dos links em `index.html` (por exemplo, de `?v=1794679389` para `?v=1794679390`). Assim o navegador de quem visita carrega a versão nova em vez da guardada.

## Como colocar os players do Spotify

1. No Spotify, abra a música, clique em **⋯ → Compartilhar → Copiar link da música**.
2. O link é parecido com `https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC?si=...`.
3. O ID é o trecho entre `/track/` e o `?`, neste exemplo `4uLU6hMCjMI75M1A2tKUQC`.
4. Em `data.js`, procure a música e cole o ID: `spotifyId: "4uLU6hMCjMI75M1A2tKUQC"`.

## Como ver o site no seu computador

Abrir o `index.html` com dois cliques funciona em parte, mas o mapa pode não carregar. O melhor é rodar um servidor local: abra o Terminal na pasta do site e digite:

```bash
python3 -m http.server 8000
```

Depois, abra http://localhost:8000 no navegador.

## Como publicar no GitHub Pages (passo a passo)

1. Crie uma conta gratuita em https://github.com.
2. Clique no **+** no canto superior direito → **New repository**.
3. Dê um nome (por exemplo `trilha-sonora`), deixe como **Public** e clique em **Create repository**.
4. Na página que aparece, clique no link **uploading an existing file**.
5. Arraste todos os arquivos `.html`, `.css` e `.js` da pasta para a janela. A pasta `.claude` não precisa ir.
6. Clique em **Commit changes**.
7. Vá em **Settings** (aba do repositório) → **Pages** (menu da esquerda).
8. Em **Branch**, escolha `main` e a pasta `/ (root)`, e clique em **Save**.
9. Espere 1 ou 2 minutos e recarregue a página. O endereço aparece no topo, algo como `https://seu-usuario.github.io/trilha-sonora/`.

**Para corrigir algo depois:** no repositório, clique em `data.js` → ícone de lápis (Edit) → faça a mudança → **Commit changes**. O site atualiza sozinho em cerca de 1 minuto.

## Observações sobre as cores

Para garantir contraste de texto adequado, algumas paletas ganharam um tom derivado da cor original (por exemplo, um lilás mais escuro, `#6B4BB0`, para textos e botões do Leste Asiático, e um marrom soga mais claro, `#C98A4F`, para as barras do Sudeste Asiático). Todas as cores ficam em `data.js` e podem ser trocadas lá.
