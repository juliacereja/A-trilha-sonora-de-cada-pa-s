/*
 * ==========================================================
 *  DADOS DO SITE "A trilha sonora de um país"
 * ==========================================================
 *  Este é o único arquivo que você precisa editar para corrigir
 *  números, textos, cores ou adicionar os players do Spotify.
 *
 *  Dicas:
 *  - Números usam PONTO como separador decimal (0.499, e não 0,499).
 *    O site mostra com vírgula automaticamente.
 *  - Textos ficam entre aspas. Se precisar de aspas dentro do texto,
 *    use as aspas curvas “assim” ou escreva \" (barra + aspas).
 *  - spotifyId: copie o código do link da música no Spotify.
 *    Exemplo: https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC
 *             o ID é 4uLU6hMCjMI75M1A2tKUQC
 *    Enquanto estiver vazio (""), o site mostra o nome da música.
 * ==========================================================
 */

window.SITE_DATA = {
  titulo: "A trilha sonora de um país",

  // As três barras que aparecem no site inteiro (escala de 0 a 1)
  barras: [
    { chave: "alegria", nome: "Alegria" },
    { chave: "energia", nome: "Energia" },
    { chave: "danca", nome: "Dança" }
  ],

  // Média dos 70 países
  media: { alegria: 0.535, energia: 0.654, danca: 0.660, explicitas: 29.4, felicidade: 6.34 },

  // Países usados no jogo e nas regiões.
  // iso = código numérico do país no mapa (não mude).
  paises: {
    "Indonésia":     { iso: "360", alegria: 0.385, energia: 0.539, danca: 0.542, explicitas: 0.0,  felicidade: 5.62 },
    "Malásia":       { iso: "458", alegria: 0.412, energia: 0.555, danca: 0.582, explicitas: 11.5, felicidade: 6.01 },
    "Vietnã":        { iso: "704", alegria: 0.462, energia: 0.541, danca: 0.643, explicitas: 5.4,  felicidade: 6.43 },
    "Romênia":       { iso: "642", alegria: 0.670, energia: 0.739, danca: 0.761, explicitas: 23.3, felicidade: 6.63 },
    "Bulgária":      { iso: "100", alegria: 0.657, energia: 0.777, danca: 0.714, explicitas: 20.1, felicidade: 5.70 },
    "Hungria":       { iso: "348", alegria: 0.585, energia: 0.717, danca: 0.725, explicitas: 42.6, felicidade: 5.94 },
    "Eslováquia":    { iso: "703", alegria: 0.488, energia: 0.676, danca: 0.723, explicitas: 68.3, felicidade: 6.26 },
    "México":        { iso: "484", alegria: 0.654, energia: 0.696, danca: 0.731, explicitas: 69.9, felicidade: 6.97 },
    "Brasil":        { iso: "076", alegria: 0.636, energia: 0.729, danca: 0.657, explicitas: 18.2, felicidade: 6.63 },
    "Guatemala":     { iso: "320", alegria: 0.624, energia: 0.671, danca: 0.717, explicitas: 60.3, felicidade: 6.53 },
    "Costa Rica":    { iso: "188", alegria: 0.468, energia: 0.616, danca: 0.648, explicitas: 48.1, felicidade: 7.44 },
    "Finlândia":     { iso: "246", alegria: 0.578, energia: 0.751, danca: 0.674, explicitas: 25.3, felicidade: 7.76 },
    "Islândia":      { iso: "352", alegria: 0.499, energia: 0.540, danca: 0.677, explicitas: 6.6,  felicidade: 7.54 },
    "Dinamarca":     { iso: "208", alegria: 0.504, energia: 0.646, danca: 0.675, explicitas: 23.7, felicidade: 7.54 },
    "Suécia":        { iso: "752", alegria: 0.563, energia: 0.648, danca: 0.620, explicitas: 16.6, felicidade: 7.26 },
    "Noruega":       { iso: "578", alegria: 0.599, energia: 0.715, danca: 0.635, explicitas: 29.8, felicidade: 7.24 },
    "Egito":         { iso: "818", alegria: 0.588, energia: 0.665, danca: 0.701, explicitas: 2.2,  felicidade: 3.86 },
    "Marrocos":      { iso: "504", alegria: 0.509, energia: 0.610, danca: 0.674, explicitas: 50.0, felicidade: 4.65 },
    "Nigéria":       { iso: "566", alegria: 0.610, energia: 0.654, danca: 0.698, explicitas: 28.6, felicidade: 4.79 },
    "África do Sul": { iso: "710", alegria: 0.630, energia: 0.654, danca: 0.684, explicitas: 2.3,  felicidade: 5.01 },
    "Japão":         { iso: "392", alegria: 0.639, energia: 0.766, danca: 0.623, explicitas: 4.1,  felicidade: 6.13 },
    "Coreia do Sul": { iso: "410", alegria: 0.547, energia: 0.700, danca: 0.635, explicitas: 7.7,  felicidade: 6.04 },
    "Taiwan":        { iso: "158", alegria: 0.469, energia: 0.617, danca: 0.626, explicitas: 5.9,  felicidade: 6.71 },
    "Hong Kong":     { iso: "344", alegria: 0.502, energia: 0.631, danca: 0.607, explicitas: 8.7,  felicidade: 5.57 }
  },

  // Paleta dos capítulos 1, 2 e 4.
  // bg = fundo · texto = texto · suave = texto secundário
  // destaque = cor de botões e barras · sobreDestaque = cor do texto em cima do destaque
  // destaqueTexto = cor de destaque usada em textos (mais escura/clara para dar contraste)
  // barra = cor das barras · detalhe = cor de enfeites
  paletaGeral: {
    bg: "#F7F5F0", texto: "#1D1D1F", suave: "#55555B",
    destaque: "#FF5A36", sobreDestaque: "#1D1D1F", destaqueTexto: "#B8360F",
    barra: "#FF5A36", detalhe: "#FF5A36",
    // cores das três barras (alegria, energia, dança) nos capítulos gerais
    barras: ["#E8502E", "#D99A1E", "#2E6F73"]
  },

  capitulos: {
    // ---------------- CAPÍTULO 1 ----------------
    jogo: {
      menu: "O jogo",
      titulo: "Qual destes países é mais feliz?",
      intro: "Cada país tem uma trilha sonora. Em cada rodada, você vê o som das 50 músicas mais ouvidas no Spotify de dois países em maio e junho de 2025, resumido em três barras: o quanto elas soam alegres, o quanto têm energia e o quanto fazem dançar. Olhe as barras e aposte em qual país é o mais feliz.",
      notaFelicidade: "Felicidade é uma nota de 0 a 10. A média dos 70 países é 6,34.",
      acertou: "Acertou!",
      errou: "Não foi dessa vez.",
      botaoProximaRodada: "Próxima rodada",
      botaoJogarDeNovo: "Jogar de novo",
      // Três rodadas, cada uma com uma mecânica (tipo): termometro, ordem, impostor
      rodadas: [
        {
          tipo: "termometro",
          nome: "O termômetro",
          pais: "Islândia",
          instrucao: "Este é o som do top 50 de um país. Arraste o termômetro para chutar a felicidade dele, de 0 a 10.",
          botao: "Cravar o chute",
          tolerancia: 1, // ganha ponto quem chegar a até 1 ponto da nota real
          texto: "Playlist calma, povo feliz: a Islândia é o segundo país mais feliz do mundo."
        },
        {
          tipo: "ordem",
          nome: "Coloque em ordem",
          paises: ["Islândia", "Bulgária", "Costa Rica", "Egito"],
          instrucao: "Arraste os discos para colocá-los em ordem, do mais feliz ao menos feliz.",
          botao: "Conferir a ordem",
          minimoAcertos: 3, // ganha ponto quem acertar pelo menos 3 das 4 posições
          texto: "Os dois países mais felizes têm as playlists mais calmas. O som não segue a felicidade."
        },
        {
          tipo: "impostor",
          nome: "O impostor",
          paises: ["Finlândia", "Dinamarca", "Islândia", "Suécia", "Noruega", "Egito"],
          impostor: "Egito",
          instrucao: "Cinco destes discos são de países entre os mais felizes do mundo. Um é do país menos feliz da amostra. Clique no intruso.",
          texto: "O Egito se escondeu no meio dos cinco países mais felizes do mundo. Pelo som, ninguém diria."
        }
      ],
      // {acertos} é trocado pelo número de acertos
      final: "Você acertou {acertos} de 3. E tudo bem: a música engana mesmo.",
      botaoProximo: "Foi só coincidência? Vamos ver 70 países."
    },

    // ---------------- CAPÍTULO 2 ----------------
    grupos: {
      menu: "Os grupos",
      titulo: "Três grupos, a mesma trilha sonora",
      texto: "Dividimos os 70 países em três grupos do mesmo tamanho, conforme a nota de felicidade: os menos felizes, os do meio e os mais felizes. Depois, calculamos o som médio do top 50 de cada grupo. Troque de grupo e veja o que acontece com as barras.",
      grupos: [
        { nome: "Menos felizes", faixa: "3,9 a 6,1", paises: 24, alegria: 0.533, energia: 0.647, danca: 0.660 },
        { nome: "Do meio",       faixa: "6,2 a 6,7", paises: 23, alegria: 0.538, energia: 0.652, danca: 0.665 },
        { nome: "Mais felizes",  faixa: "6,7 a 7,8", paises: 23, alegria: 0.533, energia: 0.662, danca: 0.654 }
      ],
      textoDepoisDaTroca: "As barras praticamente não se mexem. A alegria média das músicas é de 0,533 nos países menos felizes, 0,538 nos do meio e 0,533 nos mais felizes. Medindo país a país, a correlação entre a alegria das músicas e a felicidade é de -0,02, numa escala em que 0 significa nenhuma relação.",
      dicaMesa: "Deslize o fader da mesa de som e olhe os ponteiros.",
      tituloDispersao: "Cada disco é um país",
      legendaDispersao: "Os 24 países das regiões deste site, com a felicidade (horizontal) e a alegria do top 50 (vertical). A correlação de -0,02 foi calculada com os 70 países. Passe o mouse ou use as setas do teclado.",
      botaoProximo: "Se a música não mostra a felicidade, o que ela mostra?"
    },

    // ---------------- CAPÍTULO 3 ----------------
    mapa: {
      menu: "O mapa",
      titulo: "Cada lugar tem o seu som",
      texto: "Das 3.971 músicas que entraram em algum top 50 no período, 81% fizeram sucesso em um único país. A maior parte do que o mundo ouve é local, e por isso cada região tem um som próprio. Clique numa região para ouvir o que ela ouve.",
      numeroDestaque: 81,
      legendaDestaque: "das 3.971 músicas fizeram sucesso em um único país",
      dicaCarrossel: "Use as setas, arraste ou clique nos discos dos lados. Clique no disco do centro para tocar.",
      dicaCena: "Clique nos objetos da cena para abrir os encartes:",
      // Arquivo do mapa (não precisa mudar)
      mapaUrl: "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json",
      botaoProximo: "Ir para a resposta"
    },

    // ---------------- CAPÍTULO 4 ----------------
    resposta: {
      menu: "A resposta",
      titulo: "A playlist conta de onde você é, mas não o quanto você é feliz",
      texto: "Juntas, a alegria, a energia e a dançabilidade das músicas explicam apenas 5% das diferenças de felicidade entre os países. Quando o continente entra na conta, esse número sobe para 46%. A felicidade medida pelo World Happiness Report depende de outros fatores: apoio social, renda, expectativa de vida saudável, liberdade para fazer escolhas, generosidade e confiança nas instituições. A Costa Rica mostra bem essa diferença, porque subiu do 23º para o 4º lugar no ranking com o fortalecimento dos laços familiares e sociais, enquanto ouvia uma das playlists mais melancólicas da América Latina.",
      tituloGrafico: "Quanto cada coisa explica da felicidade dos países",
      grafico: [
        { nome: "O som das músicas", valor: 5 },
        { nome: "O continente", valor: 46 }
      ],
      tituloFatores: "Do que depende a felicidade, segundo o relatório",
      // icone: pessoas, moeda, coracao, caminhos, presente, instituicao
      fatores: [
        { nome: "Apoio social", icone: "pessoas" },
        { nome: "Renda", icone: "moeda" },
        { nome: "Expectativa de vida saudável", icone: "coracao" },
        { nome: "Liberdade para fazer escolhas", icone: "caminhos" },
        { nome: "Generosidade", icone: "presente" },
        { nome: "Confiança nas instituições", icone: "instituicao" }
      ],
      fraseFinal: "A música que um país ouve conta muito sobre a sua cultura, e quase nada sobre a sua felicidade.",
      botaoVoltar: "Voltar ao mapa"
    }
  },

  // ---------------- REGIÕES (capítulo 3) ----------------
  // corMapa = cor da região no mapa-múndi
  // marcadores = pontinhos clicáveis para lugares pequenos demais no mapa
  regioes: [
    {
      id: "sudeste-asiatico",
      nome: "Sudeste Asiático",
      paises: ["Indonésia", "Malásia", "Vietnã"],
      personagem: "Indonésia",
      destaques: [],
      corMapa: "#2B3A67",
      paletaNome: "Batik ao entardecer",
      paleta: {
        bg: "#2B3A67", texto: "#F2E8D5", suave: "#D3CAB8",
        destaque: "#8B5A2B", sobreDestaque: "#F2E8D5", destaqueTexto: "#E6BC8A",
        barra: "#C98A4F", detalhe: "#8B5A2B"
      },
      titulo: "A região que transformou a tristeza em hit",
      texto: "A Indonésia tem a playlist mais melancólica entre os 70 países analisados. Em maio e junho de 2025, a música mais ouvida do país foi “Mangu”, de Fourtwnty e Charita Utami, que ficou em primeiro lugar todos os dias com uma alegria de apenas 0,20 numa escala de 0 a 1. O som acompanha o momento da música local: o Jakarta Post descreveu 2025 como o ano de uma enxurrada de baladas de fazer chorar, quase todas de artistas indonésios, que hoje ocupam 78% das paradas do país. Malásia e Vietnã seguem o mesmo tom, com tops calmos e pouco dançantes.",
      curiosidade: "Numa pesquisa da Ipsos de 2026, que pergunta se as pessoas se sentem felizes, a Indonésia ficou em primeiro lugar no mundo, com 85% da população dizendo que sim.",
      // Objetos clicáveis da cena (o id liga ao desenho em ilustracoes.js)
      cena: [
        { id: "microfone", rotulo: "Microfone de karaokê", titulo: "2025, o ano das baladas tristes", texto: "O Jakarta Post descreveu 2025 como o ano de uma enxurrada de baladas de fazer chorar, quase todas de artistas indonésios." },
        { id: "radio", rotulo: "Rádio", titulo: "78% de música local", texto: "Artistas indonésios ocupam hoje 78% das paradas do país." }
      ],
      curiosidadeNaInteracao: true,
      mini: {
        tipo: "virada",
        titulo: "Plot twist",
        texto: "Mude a pesquisa no interruptor e veja a Indonésia virar do avesso.",
        ladoA: { fonte: "World Happiness Report 2026", numero: "5,62", legenda: "é a nota de satisfação com a vida da Indonésia, de 0 a 10. A média dos 70 países é 6,34." },
        ladoB: { fonte: "Ipsos 2026", numero: "1º", legenda: "lugar no mundo: 85% da população diz que se sente feliz." },
        nota: "As duas pesquisas medem coisas diferentes: o World Happiness Report pede uma nota para a vida, de 0 a 10; a Ipsos pergunta se a pessoa se sente feliz."
      },
      musicas: [
        { titulo: "Mangu", artista: "Fourtwnty e Charita Utami", spotifyId: "4e6TmHCC4PRUj75knNplNP" }
      ]
    },
    {
      id: "leste-europeu",
      nome: "Leste Europeu",
      paises: ["Romênia", "Bulgária", "Hungria", "Eslováquia"],
      personagem: "Romênia",
      destaques: [],
      corMapa: "#D6247F",
      paletaNome: "Luz de discoteca",
      paleta: {
        bg: "#2A0A3D", texto: "#FFF4FB", suave: "#DCC8E6",
        destaque: "#D6247F", sobreDestaque: "#FFFFFF", destaqueTexto: "#F2B705",
        barra: "#D6247F", detalhe: "#F2B705"
      },
      titulo: "A pista de dança do mundo",
      texto: "A Romênia tem o top 50 mais alegre e mais dançante entre os 70 países. Boa parte desse som vem da manele, um gênero romeno-romani com raízes em ritmos turcos, que nasceu nos casamentos e chegou às discotecas nos anos 1990. A segunda música mais ouvida do período tem como artista o “Ministerul Manelelor”, algo como Ministério das Manele. Na vizinha Bulgária, o chalga cumpre um papel parecido, misturando ritmos orientais e folk com uma batida que lembra o reggaeton. Por serem gêneros de festa e celebração, eles ajudam a entender como a Bulgária tem uma das playlists mais animadas da amostra e uma das menores notas de felicidade da Europa.",
      curiosidade: "A manele costuma liderar o Spotify romeno, mas passou décadas cercada de preconceito, dirigido mais aos artistas romani do que à própria música.",
      cena: [
        { id: "mesa", rotulo: "Mesa de festa", titulo: "Nasceu nos casamentos", texto: "A manele é um gênero romeno-romani com raízes em ritmos turcos, que nasceu nos casamentos e chegou às discotecas nos anos 1990." },
        { id: "cartaz", rotulo: "Cartaz", titulo: "Ministerul Manelelor", texto: "A segunda música mais ouvida do período na Romênia tem como artista o “Ministerul Manelelor”, algo como Ministério das Manele." },
        { id: "chalga", rotulo: "Disco de chalga", titulo: "O chalga da Bulgária", texto: "Na vizinha Bulgária, o chalga cumpre um papel parecido, misturando ritmos orientais e folk com uma batida que lembra o reggaeton." }
      ],
      mini: {
        tipo: "pista",
        titulo: "Pista de dança",
        texto: "Escolha um país: os dançarinos se mexem numa velocidade proporcional à dançabilidade do top 50 dele."
      },
      musicas: [
        { titulo: "Damelo", artista: "Tzanca Uraganu e Mr. Juve", spotifyId: "37h8o6hEV5jdmiNpZkFxRF" }
      ]
    },
    {
      id: "america-latina",
      nome: "América Latina",
      paises: ["México", "Brasil", "Guatemala", "Costa Rica"],
      personagem: "México",
      destaques: ["Brasil"],
      corMapa: "#C8102E",
      paletaNome: "Vermelho de corrido e pôr do sol",
      paleta: {
        bg: "#3B1F14", texto: "#FFF1E6", suave: "#E8CDBA",
        destaque: "#C8102E", sobreDestaque: "#FFFFFF", destaqueTexto: "#F28C28",
        barra: "#F28C28", detalhe: "#C8102E"
      },
      titulo: "O Brasil canta feliz, mas dança menos do que você imagina",
      texto: "O México tem o top 50 mais explícito entre os 70 países, com 69,9% das músicas marcadas com conteúdo explícito. É o reflexo dos corridos tumbados, que misturam o corrido tradicional mexicano com o trap e falam de migração, sobrevivência e narcotráfico, e do Fuerza Regida, dono da música mais ouvida do período. O Brasil tem o quinto top mais alegre da amostra, mas fica só em 38º lugar em dançabilidade. As cinco músicas mais ouvidas no país foram gravações ao vivo de sertanejo e pagode, românticas e feitas para cantar junto, o que pode explicar um som alegre sem a batida marcada que o Spotify classifica como dançante.",
      curiosidade: "A Costa Rica, quarta mais feliz do mundo, tem uma das playlists mais melancólicas da América Latina. O relatório atribui a felicidade do país aos laços familiares e às conexões sociais.",
      cena: [
        { id: "ingresso", rotulo: "Ingresso “Ao Vivo”", titulo: "Top 5 ao vivo", texto: "As cinco músicas mais ouvidas no Brasil foram gravações ao vivo de sertanejo e pagode, românticas e feitas para cantar junto." },
        { id: "chapeu", rotulo: "Chapéu e violão", titulo: "Corridos tumbados", texto: "Os corridos tumbados misturam o corrido tradicional mexicano com o trap e falam de migração, sobrevivência e narcotráfico." },
        { id: "postal", rotulo: "Cartão-postal", titulo: "Costa Rica", texto: "A Costa Rica, quarta mais feliz do mundo, tem uma das playlists mais melancólicas da América Latina. O relatório atribui a felicidade do país aos laços familiares e às conexões sociais." }
      ],
      curiosidadeNaCena: true,
      mini: {
        tipo: "duelo",
        titulo: "Quem é mais dançante?",
        texto: "Aposte: qual dos dois tem o top 50 mais dançante?",
        paises: ["Brasil", "México"],
        resposta: "Na alegria, os dois quase empatam: o Brasil tem o quinto top mais alegre do mundo. Mas em dança ele fica em 38º lugar, bem atrás do México."
      },
      musicas: [
        { titulo: "Marlboro Rojo", artista: "Fuerza Regida", spotifyId: "3hpm0fTeSqlhJbnqAgaLZs" },
        { titulo: "P do Pecado (Ao Vivo)", artista: "Grupo Menos É Mais e Simone Mendes", spotifyId: "7EknynLJTt9YMm1HL37s5D" }
      ]
    },
    {
      id: "nordicos",
      nome: "Nórdicos",
      paises: ["Finlândia", "Islândia", "Dinamarca", "Suécia", "Noruega"],
      personagem: "Islândia",
      destaques: [],
      corMapa: "#3DDC97",
      paletaNome: "Aurora boreal",
      paleta: {
        bg: "#0B1D3A", texto: "#E6F4F1", suave: "#B6CDD0",
        destaque: "#3DDC97", sobreDestaque: "#0B1D3A", destaqueTexto: "#3DDC97",
        barra: "#3DDC97", detalhe: "#3DDC97"
      },
      titulo: "Os povos mais felizes não precisam de música feliz",
      texto: "Finlândia, Islândia, Dinamarca, Suécia e Noruega estão entre os seis países mais felizes do mundo, mas suas playlists têm pouco em comum. A Islândia, segunda mais feliz, tem um dos tops mais calmos da amostra, tanto que o modelo estatístico previa para ela uma felicidade abaixo da média. A Finlândia, a mais feliz de todas, tem um dos tops mais enérgicos. Na região, a música parece mais ligada à educação e à indústria do que ao humor da população: os alunos suecos têm pelo menos 230 horas de música obrigatória na escola, e a Suécia é a maior exportadora de pop per capita do mundo.",
      curiosidade: "Em maio de 2025, o top islandês tinha músicas da Eurovisão, como “Espresso Macchiato”, da Estônia, e “Bara Bada Bastu”, da Suécia, que ficaram em 3º e 4º lugar no concurso.",
      cena: [
        { id: "partitura", rotulo: "Partitura escolar", titulo: "230 horas de música", texto: "Os alunos suecos têm pelo menos 230 horas de música obrigatória na escola." },
        { id: "microfone", rotulo: "Microfone da Eurovisão", titulo: "Eurovisão no top", texto: "Em maio de 2025, o top islandês tinha músicas da Eurovisão, como “Espresso Macchiato”, da Estônia, e “Bara Bada Bastu”, da Suécia, que ficaram em 3º e 4º lugar no concurso." },
        { id: "mapa", rotulo: "Mapa", titulo: "Cinco entre os seis", texto: "Finlândia, Islândia, Dinamarca, Suécia e Noruega estão entre os seis países mais felizes do mundo." }
      ],
      curiosidadeNaCena: true,
      mini: {
        tipo: "previsto",
        titulo: "Previsto x real",
        texto: "A partir das músicas, o modelo estatístico previa uma felicidade para a Islândia. Toque para comparar com a real.",
        pais: "Islândia",
        previsto: 5.92,
        legenda: "a diferença entre o que a playlist sugere e o que o país sente"
      },
      musicas: [
        { titulo: "LXS", artista: "Birnir", spotifyId: "68DUVQdRVFQYj0Xr2V5YTm" }
      ]
    },
    {
      id: "africa",
      nome: "África",
      paises: ["Nigéria", "Egito", "África do Sul", "Marrocos"],
      personagem: "Nigéria",
      destaques: [],
      corMapa: "#0B6E4F",
      paletaNome: "Log drum e festa de rua",
      paleta: {
        bg: "#161616", texto: "#F5F1E8", suave: "#CFC8BA",
        destaque: "#0B6E4F", sobreDestaque: "#FFFFFF", destaqueTexto: "#E8B10E",
        barra: "#E8B10E", detalhe: "#F25C54"
      },
      titulo: "Música para celebrar em grupo",
      texto: "Os quatro países africanos da amostra, Nigéria, Egito, África do Sul e Marrocos, têm tops um pouco mais dançantes que a média mundial e estão entre as menores notas de felicidade da base. Os gêneros ajudam a explicar: o afrobeats nigeriano, cujos streams cresceram mais de 5.000% no Spotify do país entre 2021 e 2025, o amapiano, que nasceu nas periferias de Joanesburgo e se espalhou por desafios de dança, e o mahraganat, música das festas de rua do Cairo. São sons feitos para celebrar em grupo, muitas vezes nascidos em bairros pobres. No Marrocos, o destaque é o rap cantado em árabe marroquino.",
      curiosidade: "O Egito tem a menor nota de felicidade da amostra (3,86), mas um top 50 mais alegre do que a média dos 70 países.",
      cena: [
        { id: "afrobeats", rotulo: "Disco de afrobeats", titulo: "Afrobeats", texto: "Os streams de afrobeats cresceram mais de 5.000% no Spotify da Nigéria entre 2021 e 2025." },
        { id: "amapiano", rotulo: "Disco de amapiano", titulo: "Amapiano", texto: "O amapiano nasceu nas periferias de Joanesburgo e se espalhou por desafios de dança." },
        { id: "mahraganat", rotulo: "Disco de mahraganat", titulo: "Mahraganat", texto: "O mahraganat é a música das festas de rua do Cairo." },
        { id: "microfone", rotulo: "Microfone", titulo: "Rap no Marrocos", texto: "No Marrocos, o destaque é o rap cantado em árabe marroquino." }
      ],
      mini: {
        tipo: "tambor",
        titulo: "Log drum",
        texto: "Toque os pads com o mouse, o dedo ou as teclas 1 a 4. A cada batida, as luzes da rua piscam. O som é gerado pelo navegador."
      },
      musicas: [
        { titulo: "With You", artista: "Davido e Omah Lay", spotifyId: "5GyaXqMfcIGHfmTUITFacS" }
      ]
    },
    {
      id: "leste-asiatico",
      nome: "Leste Asiático",
      paises: ["Japão", "Coreia do Sul", "Taiwan", "Hong Kong"],
      personagem: "Japão",
      destaques: [],
      corMapa: "#8E6CCF",
      paletaNome: "Lilac",
      paleta: {
        bg: "#FAF7FF", texto: "#2A2140", suave: "#574C6E",
        destaque: "#6B4BB0", sobreDestaque: "#FFFFFF", destaqueTexto: "#6B4BB0",
        barra: "#8E6CCF", detalhe: "#8EC9F0"
      },
      titulo: "A trilha sonora que saiu dos desenhos animados",
      texto: "O Japão tem um top 50 alegre e muito enérgico, mas quase sem músicas explícitas, só 4,1%. Ele é dominado por artistas japoneses: o Mrs. GREEN APPLE tinha as três músicas mais ouvidas do país no período, entre elas “Lilac”, abertura do anime de beisebol Oblivion Battery e a música mais tocada do Spotify Japão em 2025. Coreia do Sul, Taiwan e Hong Kong têm tops mais calmos que o japonês.",
      curiosidade: "Entre as 100 músicas mais tocadas do Spotify Japão em 2025, as únicas estrangeiras eram coreanas, com exceção de “APT.”.",
      cena: [
        { id: "abertura", rotulo: "Placa de abertura", titulo: "Abertura de anime", texto: "“Lilac”, do Mrs. GREEN APPLE, é a abertura do anime de beisebol Oblivion Battery e foi a música mais tocada do Spotify Japão em 2025." },
        { id: "parada", rotulo: "Parada de sucessos", titulo: "Três de três", texto: "O Mrs. GREEN APPLE tinha as três músicas mais ouvidas do Japão no período." }
      ],
      mini: {
        tipo: "abertura",
        titulo: "Abertura de anime",
        texto: "Aperte o play para ver a abertura do Japão."
      },
      musicas: [
        { titulo: "Lilac", artista: "Mrs. GREEN APPLE", spotifyId: "78W4mTLIh4qoLu92W4IQhO" }
      ],
      marcadores: [{ nome: "Hong Kong", coord: [114.17, 22.32] }]
    }
  ],

  metodologia: "Músicas: top 50 diário do Spotify em 70 países, de 13 de maio a 11 de junho de 2025 (base Top Spotify Songs in 73 Countries, Kaggle). Felicidade: World Happiness Report 2026, nota média de satisfação com a vida de 0 a 10, com pesquisas de 2023 a 2025. Alegria, energia e dançabilidade são estimadas pelo Spotify a partir do som de cada música, sem considerar a letra. A análise compara países e não permite conclusões sobre pessoas."
};
