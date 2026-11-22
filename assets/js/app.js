/**
 * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
 * ┃  SUPERCAR GALLERY — app.js                               ┃
 * ┃  Lógica da página única: dados, rotas, filtros,          ┃
 * ┃  favoritos, comparação e formulários.                    ┃
 * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
 *
 * SUMÁRIO
 *  §01  CONFIGURAÇÃO E DADOS INICIAIS
 *  §02  ESTADO GLOBAL
 *  §03  UTILITÁRIOS
 *  §04  PERSISTÊNCIA (localStorage / sessionStorage)
 *  §05  MODAIS E ROTEAMENTO
 *  §06  CATÁLOGO E FILTROS
 *  §07  FAVORITOS
 *  §08  DETALHES, VISUALIZAÇÃO RÁPIDA E TEST DRIVE
 *  §09  ACESSO E PAINEL ADMINISTRATIVO
 *  §10  COMPARAÇÃO DE VEÍCULOS
 *  §11  SELECT PERSONALIZADO
 *  §12  VISUALIZADOR DE CÓDIGO FULL-STACK
 *  §13  INICIALIZAÇÃO
 *
 * GUIA RÁPIDO
 *  • Dados iniciais: DEFAULT_CARS e HERO_FERRARI.
 *  • Persistência: sg_cars_v2 e sg_favs no localStorage.
 *  • Administração: sg_admin_password no localStorage e sg_admin
 *    no sessionStorage. O acesso é demonstrativo, não é autenticação
 *    adequada para proteger dados em produção.
 *  • Para localizar uma funcionalidade, use este sumário e procure
 *    pelo nome da função com Ctrl + F.
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// §01 · CONFIGURAÇÃO E DADOS INICIAIS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Imagem padrão usada quando um carro não tem foto (vazia = nenhuma).
 */
const FALLBACK = "";

/** Escapa valores dinâmicos antes de inseri-los em templates HTML. */
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

/** Aceita apenas imagens locais, HTTPS ou data URLs de imagem. */
function safeImageURL(value) {
  const url = String(value ?? "").trim();
  if (/^https:\/\//i.test(url) || /^data:image\/(?:png|jpe?g|webp|gif);base64,/i.test(url)) {
    return escapeHTML(url);
  }
  if (/^(?:assets\/)[a-z0-9_./\s-]+\.(?:png|jpe?g|webp|gif)$/i.test(url) && !url.includes("..")) {
    return escapeHTML(url);
  }
  return FALLBACK;
}

/**
 * Imagem escolhida no formulário de upload, já otimizada (data URL WebP).
 */
let selectedCarImage = null;

/**
 * Lista branca das imagens locais existentes. Carros apontando para
 * arquivos fora desta lista são descartados ao carregar.
 */
const AVAILABLE_IMAGE_PATHS = new Set([
  "assets/images/banners/ferrari-499p.webp",
  "assets/images/vehicles/aston-martin-valkyrie.webp",
  "assets/images/vehicles/czinger-21C.webp",
  "assets/images/vehicles/de-tomaso-p72.webp",
  "assets/images/vehicles/delage-d12.webp",
  "assets/images/vehicles/ferrari-sf90-stradale.webp",
  "assets/images/vehicles/gordon-murray t.50.webp",
  "assets/images/vehicles/hennessey-venom.webp",
  "assets/images/vehicles/koenigsegg-jesko-absolut.webp",
  "assets/images/vehicles/lamborghini-revuelto.webp",
  "assets/images/vehicles/lotus-evija.webp",
  "assets/images/vehicles/maserati-mc20.webp",
  "assets/images/vehicles/mclaren-750s.webp",
  "assets/images/vehicles/pagani-huayra-r.webp",
  "assets/images/vehicles/pininfarina-battista.webp",
  "assets/images/vehicles/porsche-gt3-rs.webp",
  "assets/images/vehicles/rimac-nevera.webp",
  "assets/images/vehicles/ssc-tuatara.webp",
]);

/**
 * Ferrari 499P: carro do banner principal. É sempre recolocado no
 * catálogo ao carregar, garantindo que exista uma única cópia.
 */
const HERO_FERRARI = {
  id: 10,
  name: "499P",
  brand: "Ferrari",
  year: 2023,
  price: 0,
  engine: "V6 híbrido biturbo de 3,0 L",
  horsepower: 680,
  top_speed: 211,
  zero_sixty: 2.5,
  torque: "755 Nm",
  transmission: "Sequencial de 7 marchas",
  drivetrain: "AWD",
  category: "Hipercarro de Le Mans",
  description:
    "Ferrari 499P, protótipo híbrido de competição desenvolvido para provas de endurance e para a categoria Hipercarro do Campeonato Mundial de Endurance (WEC).",
  image_url: "assets/images/banners/ferrari-499p.webp",
};

/**
 * Catálogo inicial. Usado quando o navegador ainda não tem
 * nenhum carro salvo no localStorage.
 */
const DEFAULT_CARS = [
  {
    id: 1,
    name: "SF90 Stradale",
    brand: "Ferrari",
    year: 2024,
    price: 4400000,
    engine: "V8 híbrido biturbo de 4,0 L",
    horsepower: 986,
    top_speed: 211,
    zero_sixty: 2.5,
    torque: "590 lb-ft",
    transmission: "DCT de 8 marchas",
    drivetrain: "AWD",
    category: "Hipercarro híbrido",
    description:
      "O primeiro hipercarro híbrido plug-in da Ferrari. Três motores elétricos combinados a um V8 biturbo proporcionam uma condução silenciosa no modo elétrico e uma explosão brutal de 986 CV, com dirigibilidade extremamente precisa.",
    image_url: "assets/images/vehicles/ferrari-sf90-stradale.webp",
  },

  {
    id: 2,
    name: "Revuelto",
    brand: "Lamborghini",
    year: 2024,
    price: 8500000,
    engine: "V12 híbrido de 6,5 L",
    horsepower: 1001,
    top_speed: 217,
    zero_sixty: 2.5,
    torque: "535 lb-ft",
    transmission: "DCT de 8 marchas",
    drivetrain: "AWD",
    category: "Híbrido V12",
    description:
      "O sucessor do Aventador. Um V12 que chega a 9.500 rpm, combinado com três motores elétricos, monofuselagem de carbono e uma experiência digna de uma nave espacial, entregando 1.001 CV.",
    image_url: "assets/images/vehicles/lamborghini-revuelto.webp",
  },

  {
    id: 3,
    name: "750S",
    brand: "McLaren",
    year: 2024,
    price: 4250000,
    engine: "V8 4.0L biturbo",
    horsepower: 740,
    top_speed: 206,
    zero_sixty: 2.7,
    torque: "590 lb-ft",
    transmission: "SSG de 7 marchas",
    drivetrain: "RWD",
    category: "Supercarro",
    description:
      "O modelo de produção mais leve e focado no motorista da McLaren. Direção hidráulica, Controle de Chassi Proativo e resposta brutal do motor V8 biturbo.",
    image_url: "assets/images/vehicles/mclaren-750s.webp",
  },

  {
    id: 6,
    name: "Jesko Absolut",
    brand: "Koenigsegg",
    year: 2024,
    price: 15300000,
    engine: "V8 5.0L biturbo",
    horsepower: 1600,
    top_speed: 330,
    zero_sixty: 2.5,
    torque: "1106 lb-ft",
    transmission: "LST de 9 marchas",
    drivetrain: "RWD",
    category: "Megacarro",
    description:
      "Desenvolvido para alcançar a maior velocidade possível. Coeficiente de arrasto de 0,278, 1.600 CV com E85 e uma revolucionária transmissão de 9 marchas Light Speed Transmission.",
    image_url: "assets/images/vehicles/koenigsegg-jesko-absolut.webp",
  },

  {
    id: 7,
    name: "Valkyrie",
    brand: "Aston Martin",
    year: 2024,
    price: 16300000,
    engine: "V12 híbrido de 6,5 L",
    horsepower: 1140,
    top_speed: 217,
    zero_sixty: 2.5,
    torque: "546 lb-ft",
    transmission: "Sequencial de 7 marchas",
    drivetrain: "RWD",
    category: "Hipercarro de pista",
    description:
      "O carro de F1 de Adrian Newey para as ruas. V12 Cosworth capaz de atingir 11.000 rpm, aerodinâmica de efeito solo e 1.140 CV de pura intensidade.",
    image_url: "assets/images/vehicles/aston-martin-valkyrie.webp",
  },

  {
    id: 8,
    name: "Huayra R",
    brand: "Pagani",
    year: 2023,
    price: 16000000,
    engine: "6.0L NA V12",
    horsepower: 838,
    top_speed: 238,
    zero_sixty: 2.8,
    torque: "553 lb-ft",
    transmission: "Sequencial de 6 marchas",
    drivetrain: "RWD",
    category: "Arte de pista",
    description:
      "Uma obra-prima com motor aspirado que chega a 9.000 rpm. Uma escultura artesanal em carbono e titânio que também entrega desempenho extremo.",
    image_url: "assets/images/vehicles/pagani-huayra-r.webp",
  },

  {
    id: 9,
    name: "Nevera",
    brand: "Rimac",
    year: 2024,
    price: 12200000,
    engine: "Elétrico com quatro motores",
    horsepower: 1914,
    top_speed: 258,
    zero_sixty: 1.74,
    torque: "1696 lb-ft",
    transmission: "Velocidade única x4",
    drivetrain: "AWD",
    category: "Hipercarro elétrico",
    description:
      "O carro elétrico mais rápido do mundo. 1.914 CV, controle vetorial de torque 100 vezes por segundo e uma aceleração de 0 a 60 km/h em apenas 1,74 segundo, capaz de deixar qualquer um sem fôlego.",
    image_url: "assets/images/vehicles/rimac-nevera.webp",
  },
,

  {
    id: 12,
    name: "21C",
    brand: "Czinger",
    year: 2024,
    price: 9700000,
    engine: "V8 2.88L biturbo híbrido",
    horsepower: 1250,
    top_speed: 407,
    zero_sixty: 1.9,
    torque: "N/D",
    transmission: "Automatizada sequencial de 7 marchas",
    drivetrain: "AWD",
    category: "Hipercarro híbrido",
    description:
      "Hipercarro projetado com engenharia Human-AI e fabricação aditiva. O 21C combina um V8 biturbo de 2,88 litros com dois motores elétricos dianteiros, entregando 1.250 CV e uma relação potência-peso próxima de 1:1.",
    image_url: "assets/images/vehicles/czinger-21C.webp",
  },

  {
    id: 13,
    name: "P72",
    brand: "De Tomaso",
    year: 2024,
    price: 6600000,
    engine: "V8 5.0L supercharged",
    horsepower: 700,
    top_speed: 355,
    zero_sixty: 2.9,
    torque: "610 lb-ft",
    transmission: "Manual de 6 marchas",
    drivetrain: "RWD",
    category: "Supercarro artesanal",
    description:
      "O De Tomaso P72 combina inspiração nos protótipos de endurance dos anos 1960 com uma construção moderna em fibra de carbono e um V8 supercharged, com foco em exclusividade e envolvimento do motorista.",
    image_url: "assets/images/vehicles/de-tomaso-p72.webp",
  },

  {
    id: 14,
    name: "D12",
    brand: "Delage",
    year: 2024,
    price: 11700000,
    engine: "V12 7.6L aspirado + elétrico",
    horsepower: 1100,
    top_speed: 360,
    zero_sixty: 2.6,
    torque: "N/D",
    transmission: "Sequencial",
    drivetrain: "RWD",
    category: "Hipercarro híbrido",
    description:
      "Um hipercarro francês inspirado na Fórmula 1. O D12 combina um V12 aspirado de 7,6 litros com assistência elétrica e uma configuração de dois lugares centralizados para aproximar a experiência de condução à de um monoposto.",
    image_url: "assets/images/vehicles/delage-d12.webp",
  },

  {
    id: 15,
    name: "T.50",
    brand: "Gordon Murray Automotive",
    year: 2022,
    price: 14400000,
    engine: "V12 4.0L aspirado",
    horsepower: 654,
    top_speed: 364,
    zero_sixty: 2.8,
    torque: "344 lb-ft",
    transmission: "Manual de 6 marchas",
    drivetrain: "RWD",
    category: "Supercarro analógico",
    description:
      "Projetado por Gordon Murray como uma celebração do automóvel analógico. O T.50 usa um V12 Cosworth de alta rotação, câmbio manual e ventilador aerodinâmico traseiro para priorizar leveza, resposta e envolvimento.",
    image_url: "assets/images/vehicles/gordon-murray t.50.webp",
  },

  {
    id: 16,
    name: "Venom F5",
    brand: "Hennessey",
    year: 2024,
    price: 9200000,
    engine: "V8 6.6L biturbo",
    horsepower: 1817,
    top_speed: 500,
    zero_sixty: 2.6,
    torque: "1193 lb-ft",
    transmission: "Automatizada de 7 marchas",
    drivetrain: "RWD",
    category: "Hipercarro",
    description:
      "O Hennessey Venom F5 foi criado para atingir desempenho extremo com baixo peso e uma arquitetura de fibra de carbono. Seu V8 biturbo entrega 1.817 CV e é desenvolvido com foco absoluto em aceleração e velocidade final.",
    image_url: "assets/images/vehicles/hennessey-venom.webp",
  },

  {
    id: 17,
    name: "Evija",
    brand: "Lotus",
    year: 2024,
    price: 11100000,
    engine: "Elétrico com quatro motores",
    horsepower: 2011,
    top_speed: 350,
    zero_sixty: 2.9,
    torque: "1254 lb-ft",
    transmission: "Velocidade única",
    drivetrain: "AWD",
    category: "Hipercarro elétrico",
    description:
      "O primeiro hipercarro totalmente elétrico da Lotus. Quatro motores independentes fornecem tração integral e potência superior a 2.000 CV, combinadas com construção leve em fibra de carbono e aerodinâmica extrema.",
    image_url: "assets/images/vehicles/lotus-evija.webp",
  },

  {
    id: 18,
    name: "MC20",
    brand: "Maserati",
    year: 2024,
    price: 2800000,
    engine: "V6 3.0L biturbo",
    horsepower: 621,
    top_speed: 325,
    zero_sixty: 2.9,
    torque: "538 lb-ft",
    transmission: "DCT de 8 marchas",
    drivetrain: "RWD",
    category: "Supercarro",
    description:
      "O Maserati MC20 marca o retorno da marca ao segmento de supercarros. Seu V6 Nettuno biturbo utiliza tecnologia derivada do automobilismo e entrega mais de 600 CV em uma arquitetura leve de motor central.",
    image_url: "assets/images/vehicles/maserati-mc20.webp",
  },

  {
    id: 19,
    name: "Battista",
    brand: "Pininfarina",
    year: 2024,
    price: 12700000,
    engine: "Elétrico com quatro motores",
    horsepower: 1874,
    top_speed: 350,
    zero_sixty: 1.86,
    torque: "1696 lb-ft",
    transmission: "Velocidade única x4",
    drivetrain: "AWD",
    category: "Hipercarro elétrico",
    description:
      "O Battista é um hipercarro elétrico italiano de quatro motores, com torque vetorial individual nas rodas e uma carroceria de fibra de carbono desenhada pela Automobili Pininfarina.",
    image_url: "assets/images/vehicles/pininfarina-battista.webp",
  },

  {
    id: 20,
    name: "911 GT3 RS",
    brand: "Porsche",
    year: 2024,
    price: 3100000,
    engine: "Flat-six 4.0L aspirado",
    horsepower: 518,
    top_speed: 296,
    zero_sixty: 3.0,
    torque: "342 lb-ft",
    transmission: "PDK de 7 marchas",
    drivetrain: "RWD",
    category: "Carro de pista",
    description:
      "O 911 GT3 RS é uma das versões mais focadas em pista da Porsche. Aerodinâmica ativa, enorme carga aerodinâmica e um motor boxer aspirado de alta rotação transformam o 911 em uma máquina voltada para o circuito.",
    image_url: "assets/images/vehicles/porsche-gt3-rs.webp",
  },

  {
    id: 21,
    name: "Tuatara",
    brand: "SSC",
    year: 2024,
    price: 9700000,
    engine: "V8 5.9L biturbo",
    horsepower: 1750,
    top_speed: 455,
    zero_sixty: 2.5,
    torque: "1193 lb-ft",
    transmission: "Automatizada de 7 marchas",
    drivetrain: "RWD",
    category: "Hipercarro",
    description:
      "O SSC Tuatara é um hipercarro americano de motor central desenvolvido para combinar baixo peso, aerodinâmica de baixa resistência e um V8 biturbo de grande potência.",
    image_url: "assets/images/vehicles/ssc-tuatara.webp",
  },
];

/**
 * Preços de referência em reais (mercado brasileiro / estimativas para
 * hipercarros sem cotação pública local). Atualiza também registros já
 * existentes no localStorage para refletir a revisão do catálogo.
 */
const REFERENCE_PRICES = new Map([
  ["ferrari|sf90 stradale", 4400000],
  ["lamborghini|revuelto", 8500000],
  ["mclaren|750s", 4250000],
  ["koenigsegg|jesko absolut", 15300000],
  ["aston martin|valkyrie", 16300000],
  ["pagani|huayra r", 16000000],
  ["rimac|nevera", 12200000],
  ["czinger|21c", 9700000],
  ["de tomaso|p72", 6600000],
  ["delage|d12", 11700000],
  ["gordon murray automotive|t.50", 14400000],
  ["hennessey|venom f5", 9200000],
  ["lotus|evija", 11100000],
  ["maserati|mc20", 2800000],
  ["pininfarina|battista", 12700000],
  ["porsche|911 gt3 rs", 3100000],
  ["ssc|tuatara", 9700000],
]);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// §02 · ESTADO GLOBAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Estado da aplicação compartilhado por todas as funções.
 *  cars        → catálogo atual
 *  favorites   → IDs dos carros favoritos
 *  isAdmin     → sessão administrativa ativa?
 *  editId/delId→ reservados para edição/exclusão
 *  compareTray → até 2 IDs selecionados para comparar
 *  currentFile → arquivo aberto no visualizador de código
 */
let cars = [],
  favorites = [],
  isAdmin = false,
  editId = null,
  delId = null,
  compareTray = [],
  currentFile = "app.py";

/**
 * Filtros ativos da Garagem (busca, marca, ordenação, preço e potência).
 */
let filters = {
  q: "",
  brand: "All",
  sort: "featured",
  maxPrice: 20000000,
  minHp: 0,
};

/**
 * Atalho para document.getElementById.
 * @param {string} id
 * @returns {HTMLElement|null}
 */
const $ = (id) => document.getElementById(id);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// §03 · UTILITÁRIOS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Formata um preço em reais (BRL). Valores 0/ausentes viram "Sob consulta".
 * @param {number} n
 * @returns {string}
 */
function fmt(n) {
  return Number(n) > 0 ? "R$" + Number(n).toLocaleString() : "Sob consulta";
}

/**
 * Mostra uma notificação temporária (some após ~3,2 s).
 * @param {string} msg  Texto (aceita HTML)
 * @param {"info"|"success"|"error"} [type="info"]
 */
function toast(msg, type = "info") {
  const t = document.createElement("div");
  t.className =
    "toast " +
    (type === "success" ? "success" : type === "error" ? "error" : "");
  t.innerHTML = `<div class="text-lg">${type === "success" ? '<i class="fa-solid fa-check" aria-hidden="true"></i>' : type === "error" ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>' : '<i class="fa-solid fa-circle-info" aria-hidden="true"></i>'}</div><div class="text-sm"><div class="font-semibold">${msg}</div><div class="text-[11px] font-mono text-gray-500 mt-0.5">${new Date().toLocaleTimeString()}</div></div>`;
  $("toasts").appendChild(t);
  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transform = "translateX(30px)";
    setTimeout(() => t.remove(), 400);
  }, 3200);
}

/**
 * Copia um texto para a área de transferência e avisa o resultado.
 * @param {string} txt
 */
function copyText(txt) {
  navigator.clipboard
    .writeText(txt)
    .then(() => toast("Copiado para a área de transferência!", "success"))
    .catch(() => toast("Falha ao copiar", "error"));
}

/**
 * Chamada no onerror das <img>: esconde a imagem quebrada.
 * @param {HTMLImageElement} el
 */
function imgFallback(el) {
  el.onerror = null;
  el.removeAttribute("src");
  el.classList.add("is-empty");
  el.setAttribute("aria-label", "Imagem não adicionada");
}

/**
 * Valida, redimensiona (máx. 1400px) e converte uma imagem para WebP.
 * @param {File} file
 * @returns {Promise<string>} data URL da imagem otimizada
 */
function optimizeImage(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/"))
      return reject(new Error("Selecione um arquivo de imagem válido."));
    if (file.size > 12 * 1024 * 1024)
      return reject(new Error("A imagem não pode ter mais de 12 MB."));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () =>
        reject(new Error("Formato de imagem não compatível."));
      image.onload = () => {
        const maxSide = 1400;
        const scale = Math.min(
          1,
          maxSide / Math.max(image.width, image.height),
        );
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/webp", 0.78));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// §04 · PERSISTÊNCIA (localStorage / sessionStorage)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Carrega carros, favoritos e sessão do armazenamento local,
 * remove imagens inválidas e modelos duplicados.
 */
function load() {
  try {
    cars = JSON.parse(localStorage.getItem("sg_cars_v2")) || null;
  } catch (e) {
    cars = null;
  }
  if (!cars || !cars.length) {
    cars = [...DEFAULT_CARS];
  } else {
    // Mantém os carros já salvos pelo usuário e incorpora automaticamente
    // os novos veículos que foram adicionados ao catálogo padrão.
    const existingModels = new Set(
      cars.map(
        (car) =>
          `${String(car?.brand || "").trim().toLowerCase()}|${String(car?.name || "").trim().toLowerCase()}`,
      ),
    );
    DEFAULT_CARS.forEach((car) => {
      const key = `${String(car.brand).trim().toLowerCase()}|${String(car.name).trim().toLowerCase()}`;
      if (!existingModels.has(key)) {
        cars.push({ ...car });
        existingModels.add(key);
      }
    });
  }
  cars.forEach((car) => {
    const key = `${String(car?.brand || "").trim().toLowerCase()}|${String(car?.name || "").trim().toLowerCase()}`;
    if (REFERENCE_PRICES.has(key)) car.price = REFERENCE_PRICES.get(key);
  });
  cars = cars.filter(
    (car) =>
      car &&
      car.image_url &&
      (/^https?:\/\//i.test(car.image_url) ||
        /^data:image\//i.test(car.image_url) ||
        AVAILABLE_IMAGE_PATHS.has(car.image_url.split("?")[0])),
  );
  cars = cars.filter((car) => car.id !== HERO_FERRARI.id);
  cars.push({ ...HERO_FERRARI });
  const seenModels = new Set();
  cars = cars.filter((car) => {
    const key = `${String(car.brand).trim().toLowerCase()}|${String(car.name).trim().toLowerCase()}`;
    if (seenModels.has(key)) return false;
    seenModels.add(key);
    return true;
  });
  saveCars();
  try {
    favorites = JSON.parse(localStorage.getItem("sg_favs")) || [];
  } catch (e) {
    favorites = [];
  }
  favorites = favorites.filter((id) => cars.some((car) => car.id === id));
  isAdmin = sessionStorage.getItem("sg_admin") === "1";
}

/**
 * Salva o catálogo no localStorage.
 * @returns {boolean} false se o armazenamento estiver cheio
 */
function saveCars() {
  try {
    localStorage.setItem("sg_cars_v2", JSON.stringify(cars));
    return true;
  } catch (error) {
    console.error("Não foi possível salvar os veículos:", error);
    toast(
      "O armazenamento está cheio. Use imagens menores ou remova imagens antigas.",
      "error",
    );
    return false;
  }
}

/**
 * Salva a lista de favoritos no localStorage.
 */
function saveFavs() {
  try {
    localStorage.setItem("sg_favs", JSON.stringify(favorites));
    return true;
  } catch (error) {
    console.error("Não foi possível salvar os favoritos:", error);
    toast("Não foi possível salvar os favoritos neste navegador.", "error");
    return false;
  }
}

/**
 * @param {number} id
 * @returns {boolean} true se o carro estiver nos favoritos
 */
function isFav(id) {
  return favorites.includes(id);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// §05 · MODAIS E ROTEAMENTO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Abre um modal e trava a rolagem da página.
 * @param {string} id
 */
function openModal(id) {
  $(id).classList.add("active");
  document.body.style.overflow = "hidden";
}

/**
 * Fecha um modal e libera a rolagem da página.
 * @param {string} id
 */
function closeModal(id) {
  $(id).classList.remove("active");
  document.body.style.overflow = "";
}

/**
 * Navega para a página de detalhes de um carro.
 * @param {number} id
 */
function goCar(id) {
  location.hash = "#/car/" + id;
}

/**
 * Exibe apenas a visão pedida, marca o link ativo, fecha o menu
 * móvel, volta ao topo e anima a entrada.
 * @param {"home"|"cars"|"details"|"favorites"|"login"|"backend"} name
 */
function showView(name) {
  ["home", "cars", "details", "favorites", "login", "backend"].forEach((v) =>
    $("view-" + v).classList.add("hidden"),
  );
  if (name === "login") renderAdmin();
  $("view-" + name).classList.remove("hidden");
  document
    .querySelectorAll("[data-nav]")
    .forEach((a) => a.classList.toggle("active", a.dataset.nav === name));
  $("mobileMenu").classList.add("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (window.gsap)
    gsap.fromTo(
      "#view-" + name,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
    );
  document
    .querySelectorAll(".reveal")
    .forEach((el) => el.classList.add("visible"));
}

/**
 * Roteador: lê location.hash e decide qual visão mostrar.
 */
function handleRoute() {
  const h = location.hash || "#/";
  if (h.startsWith("#/car/")) {
    const id = parseInt(h.split("/")[2]);
    renderDetails(id);
    showView("details");
  } else if (h === "#/cars") showView("cars");
  else if (h === "#/favorites") {
    renderFavs();
    showView("favorites");
  } else if (h === "#/login") showView("login");
  // Links antigos continuam funcionando, mas apontam ao acesso único.
  else if (h === "#/admin") {
    location.replace("#/login");
    showView("login");
  } else if (h === "#/backend") showView("backend");
  else showView("home");
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// §06 · CATÁLOGO E FILTROS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * @returns {string[]} marcas únicas do catálogo, em ordem alfabética
 */
function brands() {
  return [...new Set(cars.map((c) => c.brand))].sort();
}

/**
 * Aplica busca, marca, preço, potência e ordenação ao catálogo.
 * @returns {object[]} carros filtrados
 */
function filtered() {
  let r = [...cars];
  if (filters.q) {
    const q = filters.q.toLowerCase();
    r = r.filter((c) =>
      (c.name + " " + c.brand + " " + c.engine + " " + c.category)
        .toLowerCase()
        .includes(q),
    );
  }
  if (filters.brand !== "All") r = r.filter((c) => c.brand === filters.brand);
  r = r.filter(
    (c) => c.price <= filters.maxPrice && c.horsepower >= filters.minHp,
  );
  if (filters.sort === "price-asc") r.sort((a, b) => a.price - b.price);
  else if (filters.sort === "price-desc") r.sort((a, b) => b.price - a.price);
  else if (filters.sort === "hp-desc")
    r.sort((a, b) => b.horsepower - a.horsepower);
  else if (filters.sort === "speed-desc")
    r.sort((a, b) => b.top_speed - a.top_speed);
  else if (filters.sort === "year-desc") r.sort((a, b) => b.year - a.year);
  return r;
}

/**
 * Gera o HTML do cartão de um carro (grades da Home e da Garagem).
 * @param {object} c carro
 * @returns {string}
 */
function cardHTML(c) {
  const fav = isFav(c.id) ? "active" : "";
  return `<article class="card rounded-3xl overflow-hidden">
<div class="relative h-52 overflow-hidden"><img src="${safeImageURL(c.image_url)}" onerror="imgFallback(this)" loading="lazy" decoding="async" class="image-zoom w-full h-full object-cover" alt="">
<div class="absolute top-3 left-3 flex gap-2"><span class="text-[10px] font-mono bg-black/70 backdrop-blur px-2.5 py-1 rounded-full border border-white/20">${escapeHTML(c.brand).toUpperCase()}</span><span class="text-[10px] font-mono bg-white/15 backdrop-blur px-2.5 py-1 rounded-full">${c.year}</span></div>
<button onclick="toggleFav(${c.id},this)" data-fav-id="${c.id}" aria-label="${isFav(c.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}" aria-pressed="${isFav(c.id)}" title="${isFav(c.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}" class="fav-heart ${fav} absolute top-3 right-3 w-10 h-10 rounded-full bg-black/70 backdrop-blur border border-white/20 flex items-center justify-center hover:scale-110"><i class="${isFav(c.id) ? "fa-solid" : "fa-regular"} fa-heart text-xl" aria-hidden="true"></i></button>
<div class="absolute bottom-3 left-3 text-[10px] font-mono bg-amber-500 text-black font-bold px-2.5 py-1 rounded-full">${escapeHTML(c.category || "Supercar")}</div></div>
<div class="p-5"><h3 class="font-display font-bold leading-tight">${escapeHTML(c.brand)} ${escapeHTML(c.name)}</h3>
<div class="flex gap-3 mt-2 text-[11px] font-mono text-gray-400"><span><i class="fa-solid fa-bolt" aria-hidden="true"></i> ${c.horsepower} CV</span><span><i class="fa-solid fa-rocket" aria-hidden="true"></i> ${c.top_speed} km/h</span><span><i class="fa-solid fa-stopwatch" aria-hidden="true"></i> ${c.zero_sixty || "-"}s</span></div>
<div class="text-[11px] text-gray-500 mt-1 truncate">${escapeHTML(c.engine)}</div>
<div class="flex items-center justify-between mt-4"><div class="font-display font-bold text-amber-400">${fmt(c.price)}</div><div class="flex gap-2"><button onclick="quickView(${c.id})" class="btn-ghost rounded-lg px-3 py-2 text-xs" aria-label="Visualização rápida de ${escapeHTML(c.brand)} ${escapeHTML(c.name)}" title="Visualização rápida"><i class="fa-solid fa-eye" aria-hidden="true"></i></button><button onclick="goCar(${c.id})" class="btn-gold rounded-lg px-4 py-2 text-xs">Detalhes <i class="fa-solid fa-arrow-right ml-1" aria-hidden="true"></i></button></div></div>
<button onclick="addCompare(${c.id})" class="w-full mt-2 text-[11px] font-mono text-gray-500 hover:text-amber-400 border border-white/10 hover:border-amber-500/50 rounded-lg py-1.5 transition"><i class="fa-solid fa-plus mr-1" aria-hidden="true"></i> COMPARAR</button></div></article>`;
}

/**
 * Renderiza os 6 carros mais caros na seção de destaques.
 */
function renderDestaques() {
  const feat = [...cars].sort((a, b) => b.price - a.price).slice(0, 6);
  $("featuredGrid").innerHTML = feat.map(cardHTML).join("");
}

/**
 * Renderiza a Garagem: grade, contador, rota simulada e bandeja.
 */
function renderCars() {
  const r = filtered();
  $("carsGrid").innerHTML = r.map(cardHTML).join("");
  $("noResults").classList.toggle("hidden", r.length > 0);
  $("resultCount").textContent = r.length;
  $("activeRoute").textContent =
    "carros" +
    (filters.q ? "?q=" + encodeURIComponent(filters.q) : "") +
    (filters.brand !== "All"
      ? "&marca=" + encodeURIComponent(filters.brand)
      : "");
  renderTray();
}

/**
 * Renderiza os botões de marca (Garagem e Home).
 */
function renderPills() {
  const b = ["Todos", ...brands()];
  $("brandPills").innerHTML = b
    .map(
      (x) =>
        `<button class="pill ${filters.brand === x ? "active" : ""}" onclick="setBrand('${x}')">${x}</button>`,
    )
    .join("");
  $("brandPillsInício").innerHTML = b
    .map(
      (x) =>
        `<button class="pill ${filters.brand === x ? "active" : ""}" onclick="setBrandHome('${x}')">${x}</button>`,
    )
    .join("");
}

/**
 * Filtra a Garagem por marca.
 * @param {string} b
 */
function setBrand(b) {
  filters.brand = b;
  renderPills();
  renderCars();
}

/**
 * Filtra por marca a partir da Home e leva para a Garagem.
 * @param {string} b
 */
function setBrandHome(b) {
  filters.brand = b;
  location.hash = "#/cars";
  renderPills();
  renderCars();
}

/**
 * Volta todos os filtros e controles ao estado inicial.
 */
function resetFilters() {
  filters = {
    q: "",
    brand: "All",
    sort: "featured",
    maxPrice: 20000000,
    minHp: 0,
  };
  $("searchInput").value = "";
  $("sortSelect").value = "featured";
  syncCustomSelect($("sortSelect"));
  $("priceRange").value = 20000000;
  $("hpRange").value = 0;
  $("priceLabel").textContent = "R$ 20.000.000";
  $("hpLabel").textContent = "0 HP";
  renderPills();
  renderCars();
  toast("Filtros redefinidos", "success");
}

/**
 * Busca do banner: copia o termo para a Garagem e navega até ela.
 */
function heroGo() {
  filters.q = $("heroSearch").value.trim();
  $("searchInput").value = filters.q;
  location.hash = "#/cars";
  renderCars();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// §07 · FAVORITOS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Adiciona/remove um favorito e atualiza todas as telas afetadas.
 * @param {number} id
 * @param {HTMLElement} [btn] botão clicado (recebe a animação "pop")
 */
function toggleFav(id, btn) {
  if (isFav(id)) {
    favorites = favorites.filter((f) => f !== id);
    toast("Removido dos favoritos");
  } else {
    favorites.push(id);
    toast(
      'Adicionado aos favoritos! <i class="fa-solid fa-heart" aria-hidden="true"></i>',
      "success",
    );
  }
  saveFavs();
  updateBadges();
  document.querySelectorAll(".fav-heart").forEach(() => {});
  if (btn) {
    btn.classList.add("pop");
    setTimeout(() => btn.classList.remove("pop"), 400);
  }
  renderCars();
  renderDestaques();
  if (!$("view-favorites").classList.contains("hidden")) renderFavs();
  syncHearts();
}

/**
 * Sincroniza os ícones Font Awesome de favoritos e seus estados acessíveis.
 */
function syncHearts() {
  document.querySelectorAll(".fav-heart[data-fav-id]").forEach((button) => {
    const active = isFav(Number(button.dataset.favId));
    const icon = button.querySelector(".fa-heart");
    if (icon) {
      icon.classList.toggle("fa-solid", active);
      icon.classList.toggle("fa-regular", !active);
    }
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
    const label = active ? "Remover dos favoritos" : "Adicionar aos favoritos";
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
  });
}

/**
 * Atualiza contadores de favoritos e rótulos de login no cabeçalho.
 */
function updateBadges() {
  $("favBadge").textContent = favorites.length;
  $("favBadgeM").textContent = favorites.length;
  $("authLabel").innerHTML = isAdmin
    ? 'admin <i class="fa-solid fa-circle text-green-500" aria-hidden="true"></i>'
    : "visitante";
  $("loginBtn").href = "#/login";
  $("loginBtn").textContent = "Acesso administrativo";
}

/**
 * Renderiza a página de favoritos e suas estatísticas.
 */
function renderFavs() {
  const list = cars.filter((c) => favorites.includes(c.id));
  $("favGrid").innerHTML = list
    .map(
      (c) =>
        `<article class="card rounded-3xl overflow-hidden"><div class="relative h-48 overflow-hidden"><img src="${safeImageURL(c.image_url)}" onerror="imgFallback(this)" loading="lazy" decoding="async" class="image-zoom w-full h-full object-cover"><button onclick="toggleFav(${c.id},this)" class="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold rounded-full px-3 py-1.5 hover:bg-red-500" aria-label="Remover dos favoritos"><i class="fa-solid fa-xmark mr-1" aria-hidden="true"></i></button></div><div class="p-5"><h3 class="font-display font-bold">${escapeHTML(c.brand)} ${escapeHTML(c.name)}</h3><div class="text-[11px] font-mono text-gray-400 mt-1">${c.horsepower} CV • ${c.top_speed} km/h</div><div class="flex items-center justify-between mt-3"><span class="font-display text-amber-400 font-bold">${fmt(c.price)}</span><button onclick="goCar(${c.id})" class="btn-gold rounded-lg px-4 py-2 text-xs">Detalhes <i class="fa-solid fa-arrow-right ml-1" aria-hidden="true"></i></button></div></div></article>`,
    )
    .join("");
  $("favEmpty").style.display = list.length ? "none" : "";
  const val = list.reduce((s, c) => s + c.price, 0),
    hp = list.reduce((s, c) => s + c.horsepower, 0);
  $("favCountStat").textContent = list.length;
  $("favValueStat").textContent = fmt(val);
  $("favHpStat").textContent = hp.toLocaleString() + " HP";
}

/**
 * Remove todos os favoritos.
 */
function clearFavs() {
  if (!favorites.length) {
    toast("Não há favoritos para limpar");
    return;
  }
  favorites = [];
  saveFavs();
  updateBadges();
  renderFavs();
  renderCars();
  renderDestaques();
  toast("Favoritos removidos", "success");
}

/**
 * Baixa os favoritos como arquivo JSON.
 */
function exportFavs() {
  const list = cars.filter((c) => favorites.includes(c.id));
  const blob = new Blob([JSON.stringify(list, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "supercar-favorites.json";
  a.click();
  toast("Favoritos exported!", "success");
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// §08 · DETALHES, VISUALIZAÇÃO RÁPIDA E TEST DRIVE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Abre o modal de visualização rápida de um carro.
 * @param {number} id
 */
function quickView(id) {
  const c = cars.find((x) => x.id === id);
  if (!c) return;
  $("quickBody").innerHTML =
    `<img src="${safeImageURL(c.image_url)}" onerror="imgFallback(this)" loading="lazy" decoding="async" class="image-zoom w-full h-44 object-contain bg-black/30"><div class="p-6"><div class="flex items-start justify-between gap-3"><div><div class="text-[11px] font-mono text-amber-400">${escapeHTML(c.brand).toUpperCase()} • ${c.year}</div><h3 class="font-display font-bold text-xl mt-1">${c.name}</h3></div><button onclick="closeModal('quickModal')" class="text-gray-400 hover:text-white text-xl" aria-label="Fechar visualização rápida" title="Fechar"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button></div><p class="text-sm text-gray-400 mt-3 leading-relaxed">${escapeHTML(c.description)}</p><div class="grid gap-2 mt-4 text-center"><div class="bg-white/5 rounded-xl p-3"><div class="font-display font-bold text-amber-400">${c.horsepower}</div><div class="text-[10px] font-mono text-gray-500">CV</div></div><div class="bg-white/5 rounded-xl p-3"><div class="font-display font-bold text-amber-400">${c.top_speed}</div><div class="text-[10px] font-mono text-gray-500">km/h</div></div><div class="bg-white/5 rounded-xl p-3"><div class="font-display font-bold text-green-400">${fmt(c.price)}</div><div class="text-[10px] font-mono text-gray-500">PREÇO</div></div></div><div class="flex gap-2 mt-5"><button onclick="closeModal('quickModal');goCar(${c.id})" class="btn-gold rounded-xl flex-1 py-2.5 text-sm">Detalhe completo <i class="fa-solid fa-arrow-right ml-1" aria-hidden="true"></i></button><button onclick="toggleFav(${c.id},this)" data-fav-id="${c.id}" aria-label="${isFav(c.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}" aria-pressed="${isFav(c.id)}" title="${isFav(c.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}" class="fav-heart btn-ghost rounded-xl px-5 py-2.5 text-sm"><i class="${isFav(c.id) ? "fa-solid" : "fa-regular"} fa-heart" aria-hidden="true"></i></button></div></div>`;
  openModal("quickModal");
}

/**
 * Monta a página de detalhes: imagem, ficha técnica, barras de
 * desempenho, ações e carros relacionados.
 * @param {number} id
 */
function renderDetails(id) {
  const c =
    id === HERO_FERRARI.id ? HERO_FERRARI : cars.find((x) => x.id === id);
  if (!c) {
    $("detailsWrap").innerHTML =
      `<div class="text-center py-20"><h3 class="font-display text-2xl font-bold">Carro não encontrado</h3><a href="#/cars" class="btn-gold rounded-xl px-6 py-2.5 text-sm mt-5 inline-block">Voltar à garagem</a></div>`;
    return;
  }
  const hpPct = Math.min(100, Math.round(((c.horsepower || 0) / 1914) * 100));
  const spPct = Math.min(100, Math.round(((c.top_speed || 0) / 330) * 100));
  const sameModel = (a, b) =>
    String(a.brand).trim().toLowerCase() ===
      String(b.brand).trim().toLowerCase() &&
    String(a.name).trim().toLowerCase() === String(b.name).trim().toLowerCase();
  const uniqueCars = (list) =>
    list.filter(
      (car, index, all) =>
        all.findIndex((item) => sameModel(item, car)) === index,
    );
  const availableCars = uniqueCars(
    cars.filter((x) => x.id !== c.id && !sameModel(x, c)),
  );
  const rel = availableCars.filter((x) => x.brand === c.brand).slice(0, 3);
  const more = rel.length ? rel : availableCars.slice(0, 3);
  $("detailsWrap").innerHTML =
    `<a href="#/cars" class="text-sm text-gray-400 hover:text-amber-400"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Voltar à garagem</a> <span class="font-mono text-xs text-gray-600">/ GET /carro/${c.id} • SELECIONAR * DE carros ONDE id = ${c.id}.</span>
<div class="grid lg:grid-cols-2 gap-8 mt-5">
<div><div class="card details-visual rounded-3xl overflow-hidden"><img src="${safeImageURL(c.image_url)}" onerror="imgFallback(this)" loading="lazy" decoding="async" class="image-zoom details-image w-full aspect-[1.46] object-cover bg-black/25"></div>
<div class="grid grid-cols-3 gap-3 mt-4"><div class="card rounded-2xl p-4 text-center"><div class="text-[10px] font-mono text-gray-500">MOTOR</div><div class="text-xs font-semibold mt-1">${escapeHTML(c.engine)}</div></div><div class="card rounded-2xl p-4 text-center"><div class="text-[10px] font-mono text-gray-500">TRANSMISSÃO</div><div class="text-xs font-semibold mt-1">${escapeHTML(c.transmission || "DCT")}</div></div><div class="card rounded-2xl p-4 text-center"><div class="text-[10px] font-mono text-gray-500">SISTEMA DE TRANSMISSÃO</div><div class="text-xs font-semibold mt-1">${escapeHTML(c.drivetrain || "AWD")}</div></div></div></div>
<div><div class="flex items-center gap-2"><span class="text-[11px] font-mono bg-amber-500 text-black font-bold px-3 py-1 rounded-full">${escapeHTML(c.category || "SUPERCAR").toUpperCase()}</span><span class="text-[11px] font-mono border border-white/20 px-3 py-1 rounded-full">${c.year}</span><span class="text-[11px] font-mono border border-white/20 px-3 py-1 rounded-full">${escapeHTML(c.brand).toUpperCase()}</span></div>
<h1 class="font-display text-3xl md:text-5xl font-black mt-3">${c.brand} <span class="text-grad">${c.name}</span></h1>
<p class="text-gray-400 text-sm mt-4 leading-relaxed">${escapeHTML(c.description)}</p>
<div class="font-display text-3xl font-bold text-amber-400 mt-5">${c.price ? fmt(c.price) : "Preço sob consulta"}</div>
<div class="mt-5 space-y-4">
<div><div class="flex justify-between text-xs font-mono mb-1.5"><span class="text-gray-400">CAVALOS DE POTÊNCIA</span><span class="text-amber-400 font-bold">${c.horsepower} CV</span></div><div class="spec-bar"><div data-w="${hpPct}"></div></div></div>
<div><div class="flex justify-between text-xs font-mono mb-1.5"><span class="text-gray-400">VELOCIDADE MÁXIMA</span><span class="text-amber-400 font-bold">${c.top_speed ? c.top_speed + " Km/h" : "N/D"}</span></div><div class="spec-bar"><div data-w="${spPct}"></div></div></div>
<div class="grid grid-cols-3 gap-3 text-center">
<div class="bg-white/5 rounded-2xl p-4"><div class="font-display font-bold text-lg">${c.zero_sixty ? c.zero_sixty + "s" : "N/D"}</div><div class="text-[10px] font-mono text-gray-500">0-60</div></div>
<div class="bg-white/5 rounded-2xl p-4"><div class="font-display font-bold text-lg">${escapeHTML(c.torque || "N/D")}</div><div class="text-[10px] font-mono text-gray-500">TORQUE</div></div>
<div class="bg-white/5 rounded-2xl p-4"><div class="font-display font-bold text-lg">${c.year}</div><div class="text-[10px] font-mono text-gray-500">MODELO</div></div></div></div>
<div class="flex flex-wrap gap-3 mt-6"><button onclick="toggleFav(${c.id},this)" data-fav-id="${c.id}" aria-label="${isFav(c.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}" aria-pressed="${isFav(c.id)}" class="fav-heart ${isFav(c.id) ? "active" : ""} btn-ghost rounded-xl px-6 py-3 text-sm font-semibold">${isFav(c.id) ? '<i class="fa-solid fa-heart" aria-hidden="true"></i> Salvo' : '<i class="fa-regular fa-heart" aria-hidden="true"></i> Salvar nos Favoritos'}</button><button onclick="acesseDrive(${c.id})" class="btn-gold rounded-xl px-6 py-3 text-sm">Agendar Test Drive</button><button onclick="addCompare(${c.id});openModal('compareModal');initCompare()" class="btn-ghost rounded-xl px-6 py-3 text-sm"><i class="fa-solid fa-scale-balanced" aria-hidden="true"></i> Comparar</button></div>
<div class="mt-4 text-[11px] font-mono text-gray-600">POST /favorites/add/${c.id} • Flask session + SQLite INSERT</div></div></div>
<div class="mt-12"><h3 class="font-display font-bold text-xl">Máquinas <span class="text-grad">Relacionadas</span></h3><div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">${more.map(cardHTML).join("")}</div></div>`;
  setTimeout(
    () =>
      document
        .querySelectorAll("#detailsWrap .spec-bar > div")
        .forEach((d) => (d.style.width = d.dataset.w + "%")),
    80,
  );
}

/**
 * Abre o modal de agendamento de test drive para um carro.
 * @param {number} id
 */
function acesseDrive(id) {
  const c = cars.find((x) => x.id === id);
  $("driveCarName").textContent = c
    ? c.brand + " " + c.name + " • " + fmt(c.price)
    : "";
  $("driveForm").dataset.car = id;
  openModal("driveModal");
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// §09 · ACESSO E PAINEL ADMINISTRATIVO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Preenche o login com as credenciais de demonstração.
 */
function fillDemo() {
  $("loginUser").value = "admin";
  $("loginPass").value = "admin123";
}

/**
 * Revela a senha somente enquanto o botão do olho estiver pressionado.
 * Os eventos Pointer funcionam com mouse, toque e caneta.
 */
function showPass() {
  const input = $("loginPass");
  const button = $("toggleLoginPass");
  if (!input || !button) return;

  input.type = "text";
  button.setAttribute("aria-pressed", "true");
  button.querySelector("i")?.classList.replace("fa-eye", "fa-eye-slash");
}

function hidePass() {
  const input = $("loginPass");
  const button = $("toggleLoginPass");
  if (!input || !button) return;

  input.type = "password";
  button.setAttribute("aria-pressed", "false");
  button.querySelector("i")?.classList.replace("fa-eye-slash", "fa-eye");
}

/**
 * Alterna login e gerenciamento dentro da página de acesso administrativo.
 * A sessão é demonstrativa e não protege um servidor.
 */
function renderAdmin() {
  const w = $("adminWrap");
  $("loginAccess").classList.toggle("hidden", isAdmin);
  w.classList.toggle("hidden", !isAdmin);
  if (!isAdmin) {
    w.innerHTML = "";
    return;
  }
  const total = cars.reduce((s, c) => s + c.price, 0),
    avg = Math.round(
      cars.reduce((s, c) => s + c.horsepower, 0) / Math.max(1, cars.length),
    );
  w.innerHTML = `<div class="flex flex-wrap items-end justify-between gap-4"><div><div class="font-mono text-xs text-amber-400">/// ACESSO ADMINISTRATIVO</div><h2 class="font-display text-3xl md:text-4xl font-black mt-2">Acesso <span class="text-grad">Administrativo</span></h2></div><div class="flex gap-2"><button onclick="acesseCarForm('add')" class="btn-gold rounded-xl px-5 py-2.5 text-sm"><i class="fa-solid fa-plus mr-1" aria-hidden="true"></i> Adicionar carro</button><button onclick="logout()" class="btn-ghost rounded-xl px-5 py-2.5 text-sm"><i class="fa-solid fa-arrow-right-from-bracket mr-1" aria-hidden="true"></i> Sair</button></div></div>
<div class="grid sm:grid-cols-4 gap-4 mt-6">
<div class="card rounded-2xl p-5"><div class="text-xs font-mono text-gray-400">TOTAL DE CARROS</div><div class="font-display text-3xl font-bold text-amber-400">${cars.length}</div><div class="text-[11px] font-mono text-gray-500">Selecionados</div></div>
<div class="card rounded-2xl p-5"><div class="text-xs font-mono text-gray-400">VALOR DA FROTA</div><div class="font-display text-2xl font-bold text-green-400">${fmt(total)}</div><div class="text-[11px] font-mono text-gray-500">Valor Total</div></div>
<div class="card rounded-2xl p-5"><div class="text-xs font-mono text-gray-400">POTÊNCIA MÉDIA</div><div class="font-display text-3xl font-bold">${avg} <span class="text-sm">CV</span></div><div class="text-[11px] font-mono text-gray-500">Potência (CV)</div></div>
<div class="card rounded-2xl p-5"><div class="text-xs font-mono text-gray-400">FAVORITOS</div><div class="font-display text-3xl font-bold text-pink-500">${favorites.length}</div><div class="text-[11px] font-mono text-gray-500">Adicionados aos Favoritos</div></div></div>
<div class="card rounded-2xl mt-6 p-5">
  <div class="font-display text-sm font-bold tracking-widest">SEGURANÇA DA CONTA</div>
  <p class="text-xs text-gray-400 mt-1 mb-4">Altere a senha utilizada para entrar no painel.</p>
  <form id="changePasswordForm" class="grid md:grid-cols-3 gap-3">
    <input id="currentAdminPassword" type="password" placeholder="Senha atual" autocomplete="current-password" required>
    <input id="newAdminPassword" type="password" placeholder="Nova senha (mín. 6 caracteres)" autocomplete="new-password" minlength="6" required>
    <input id="confirmAdminPassword" type="password" placeholder="Confirmar nova senha" autocomplete="new-password" minlength="6" required>
    <button class="btn-gold rounded-xl px-5 py-2.5 text-sm md:col-span-3">Salvar nova senha</button>
  </form>
  <p class="text-[11px] text-amber-300 mt-3">Modo demonstrativo: esta versão salva a senha neste navegador. Para uso público, a troca deve ser feita no backend Flask com hash e sessão segura.</p>
</div>
<div class="card rounded-3xl mt-6 overflow-hidden"><div class="p-4 border-b border-white/10 flex flex-wrap gap-3 items-center justify-between"><div class="font-display text-sm font-bold tracking-widest">TABELA DE ESTOQUE • carros</div><input id="adminSearch" placeholder="Filtrar estoque..." class="!w-56 !py-2 text-sm" oninput="renderAdminRows(this.value)"></div><div class="overflow-x-auto"><table class="admin-table"><thead><tr><th>ID</th><th>Carro</th><th>Ano</th><th>Preço</th><th>CV</th><th>Top</th><th>Ações</th></tr></thead><tbody id="adminRows"></tbody></table></div></div>
<div class="grid md:grid-cols-2 gap-4 mt-5"><div class="card rounded-2xl p-5"><div class="font-display text-xs font-bold tracking-widest text-gray-400">ESQUEMA DE BANCO DE DADOS (SQLite)</div><pre class="font-mono text-[11px] text-gray-400 mt-3 leading-6">cars(id, nome, marca, ano, preço,
     engine, horsepower, top_speed,
     description, image_url)
favorites(id, car_id, created_at)
admin(id, username, password#hash)</pre></div>
<div class="card rounded-2xl p-5"><div class="font-display text-xs font-bold tracking-widest text-gray-400">CRUD = CONSULTAS PARAMETRIZADAS</div><pre class="font-mono text-[11px] text-green-400 mt-3 leading-6">INSERT INTO cars(...) VALUES(?,?,?,?,?)
UPDATE cars SET price=? WHERE id=?
DELETE FROM cars WHERE id=?</pre><div class="text-[11px] text-gray-500 mt-2">Werkzeug: generate_password_hash / check_password_hash</div></div></div>`;
  renderAdminRows("");
}
/**
 * Filtra o estoque pelo nome ou marca e desenha as ações de edição e exclusão.
 * @param {string} q Termo digitado na busca do painel.
 */
function renderAdminRows(q) {
  const rows = cars.filter(
    (c) => !q || (c.name + c.brand).toLowerCase().includes(q.toLowerCase()),
  );
  $("adminRows").innerHTML =
    rows
      .map(
        (c) =>
          `<tr><td class="font-mono text-gray-500">#${c.id}</td><td><div class="flex items-center gap-3"><span class="admin-image-frame"><img src="${safeImageURL(c.image_url)}" onerror="imgFallback(this)" loading="lazy" decoding="async" class="image-zoom w-14 h-10 object-cover rounded-lg border border-white/10"></span><div><div class="font-semibold text-white">${escapeHTML(c.brand)} ${escapeHTML(c.name)}</div><div class="text-[11px] text-gray-500 truncate max-w-[220px]">${escapeHTML(c.engine)}</div></div></div></td><td class="font-mono">${c.year}</td><td class="font-semibold text-amber-400">${fmt(c.price)}</td><td>${c.horsepower}</td><td>${c.top_speed}</td><td><div class="flex gap-2"><button onclick="acesseCarForm('edit',${c.id})" class="text-xs bg-sky-600/20 border border-sky-500/40 text-sky-300 rounded-lg px-3 py-1.5 hover:bg-sky-600/40"><i class="fa-solid fa-pen-to-square mr-1" aria-hidden="true"></i>Editar</button><button onclick="askExcluir(${c.id})" class="text-xs bg-red-600/20 border border-red-500/40 text-red-300 rounded-lg px-3 py-1.5 hover:bg-red-600/40"><i class="fa-solid fa-trash-can mr-1" aria-hidden="true"></i>Excluir</button></div></td></tr>`,
      )
      .join("") ||
    `<tr><td colspan="7" class="text-center py-8 text-gray-500">Nenhum carro corresponde aos filtros.</td></tr>`;
}
/**
 * Encerra a sessão demonstrativa e volta ao formulário na mesma página de acesso.
 */
function logout() {
  isAdmin = false;
  sessionStorage.removeItem("sg_admin");
  updateBadges();
  $("loginForm").reset();
  $("loginPass").type = "password";
  $("forgotPasswordForm").classList.add("hidden");
  $("loginForm").classList.remove("hidden");
  renderAdmin();
  location.hash = "#/login";
  toast("Sessão encerrada", "success");
}
/**
 * Preenche o formulário de cadastro ou edição e prepara a prévia da imagem.
 * @param {"add"|"edit"} mode Operação solicitada.
 * @param {number} [id] Identificador do veículo a editar.
 */
function acesseCarForm(mode, id) {
  if (!isAdmin) return;
  selectedCarImage = null;
  $("fImageFile").value = "";
  editId = mode === "edit" ? id : null;
  const c = mode === "edit" ? cars.find((x) => x.id === id) : null;
  $("carFormTitle").textContent =
    mode === "edit" ? "Editar veículo #" + id : "Adicionar novo carro";
  $("carSubmit").innerHTML =
    mode === "edit"
      ? '<i class="fa-solid fa-floppy-disk mr-2" aria-hidden="true"></i>Atualizar veículo'
      : '<i class="fa-solid fa-plus mr-2" aria-hidden="true"></i>Adicionar carro';
  $("fName").value = c?.name || "";
  $("fBrand").value = c?.brand || "";
  $("fYear").value = c?.year || "";
  $("fPrice").value = c?.price || "";
  $("fEngine").value = c?.engine || "";
  $("fHp").value = c?.horsepower || "";
  $("fSpeed").value = c?.top_speed || "";
  $("fZero").value = c?.zero_sixty || "";
  $("fCat").value = c?.category || "";
  $("fImg").value = c?.image_url || "";
  $("fDesc").value = c?.description || "";
  selectedCarImage = c?.image_url || null;
  if (c?.image_url) {
    $("fPreview").style.backgroundImage = `url("${safeImageURL(c.image_url)}")`;
    $("fPreview").classList.remove("is-empty");
  } else {
    $("fPreview").style.backgroundImage = "none";
    $("fPreview").classList.add("is-empty");
  }
  $("carErr").classList.add("hidden");
  $("brandList").innerHTML = brands()
    .map((b) => `<option value="${b}">`)
    .join("");
  openModal("carModal");
}
/**
 * Prepara a confirmação de exclusão sem remover o veículo antecipadamente.
 * @param {number} id Identificador do veículo.
 */
function askExcluir(id) {
  if (!isAdmin) return;
  const c = cars.find((x) => x.id === id);
  delId = id;
  $("delName").textContent = c ? c.brand + " " + c.name : "";
  openModal("delModal");
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// §10 · COMPARAÇÃO DE VEÍCULOS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Adiciona um carro à comparação (máx. 2; o mais antigo sai).
 * @param {number} id
 */
function addCompare(id) {
  if (compareTray.includes(id)) {
    toast("Este carro já está na lista de comparação");
    return;
  }
  if (compareTray.length >= 2) compareTray.shift();
  compareTray.push(id);
  renderTray();
  toast("Adicionado à comparação (" + compareTray.length + "/2)", "success");
}

/**
 * Renderiza a bandeja de comparação da Garagem.
 */
function renderTray() {
  const t = $("compareTray");
  if (!compareTray.length) {
    t.classList.add("hidden");
    return;
  }
  t.classList.remove("hidden");
  t.innerHTML =
    `<span class="text-xs font-mono text-gray-400"><i class="fa-solid fa-scale-balanced" aria-hidden="true"></i> COMPARAR (${compareTray.length}/2):</span>` +
    compareTray
      .map((id) => {
        const c = cars.find((x) => x.id === id);
        return c
          ? `<span class="text-xs bg-white/10 border border-white/15 rounded-full px-3 py-1.5">${escapeHTML(c.brand)} ${escapeHTML(c.name)} <button onclick="compareTray=compareTray.filter(x=>x!==${id});renderTray()" class="text-red-400 ml-1" aria-label="Remover ${escapeHTML(c.brand)} ${escapeHTML(c.name)} da comparação" title="Remover da comparação"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button></span>`
          : "";
      })
      .join("") +
    `<button onclick="openModal('compareModal');initCompare()" class="btn-gold rounded-lg px-4 py-1.5 text-xs ml-auto">Comparar agora <i class="fa-solid fa-arrow-right ml-1" aria-hidden="true"></i></button>`;
}

/**
 * Preenche os seletores do modal de comparação.
 */
function initCompare() {
  const opts = cars
    .map(
      (c) =>
        `<option value="${c.id}">${escapeHTML(c.brand)} ${escapeHTML(c.name)} — ${c.horsepower}CV</option>`,
    )
    .join("");
  $("cmpA").innerHTML = opts;
  $("cmpB").innerHTML = opts;
  if (compareTray[0]) $("cmpA").value = compareTray[0];
  if (compareTray[1]) $("cmpB").value = compareTray[1];
  else if (cars[4]) $("cmpB").value = cars[4].id;
}

/**
 * Compara os dois carros escolhidos e destaca o vencedor de cada item.
 */
function runCompare() {
  const a = cars.find((x) => x.id == $("cmpA").value),
    b = cars.find((x) => x.id == $("cmpB").value);
  if (!a || !b) return;

  const row = (label, av, bv, format, lowerIsBetter = false) => {
    const aWins = lowerIsBetter ? av < bv : av > bv;
    const bWins = lowerIsBetter ? bv < av : bv > av;
    return `<tr class="compare-row">
      <th scope="row" class="compare-label"><span>${label}</span></th>
      <td class="compare-value ${aWins ? "is-winner" : ""}">${format(av)}${aWins ? '<span class="compare-best"><i class="fa-solid fa-check" aria-hidden="true"></i> Melhor</span>' : ""}</td>
      <td class="compare-value ${bWins ? "is-winner" : ""}">${format(bv)}${bWins ? '<span class="compare-best"><i class="fa-solid fa-check" aria-hidden="true"></i> Melhor</span>' : ""}</td>
    </tr>`;
  };

  const winner =
    a.horsepower + a.top_speed > b.horsepower + b.top_speed
      ? `${a.brand} ${a.name}`
      : `${b.brand} ${b.name}`;

  $("cmpResult").innerHTML = `
    <section class="compare-results" aria-label="Resultado da comparação">
      <div class="compare-cars">
        <div class="compare-spacer"><span>ESPECIFICAÇÕES</span></div>
        <article class="compare-car-card">
          <div class="compare-car-image"><img src="${a.image_url}" onerror="imgFallback(this)" alt="${a.brand} ${a.name}" class="image-zoom"></div>
          <div class="compare-car-name">${a.brand}<strong>${a.name}</strong></div>
        </article>
        <article class="compare-car-card">
          <div class="compare-car-image"><img src="${b.image_url}" onerror="imgFallback(this)" alt="${b.brand} ${b.name}" class="image-zoom"></div>
          <div class="compare-car-name">${b.brand}<strong>${b.name}</strong></div>
        </article>
      </div>
      <div class="compare-table-wrap">
        <table class="compare-table">
          <tbody>
            ${row("Preço", a.price, b.price, (v) => fmt(v), true)}
            ${row("Potência", a.horsepower, b.horsepower, (v) => `${v} CV`)}
            ${row("Velocidade máxima", a.top_speed, b.top_speed, (v) => `${v} km/h`)}
            ${row("0–60 Km/h", a.zero_sixty || 9, b.zero_sixty || 9, (v) => `${v}s`, true)}
            ${row("Ano", a.year, b.year, (v) => v)}
          </tbody>
        </table>
      </div>
      <div class="compare-verdict">
        <span class="compare-verdict-icon"><i class="fa-solid fa-trophy" aria-hidden="true"></i></span>
        <div><small>DESTAQUE DE DESEMPENHO</small><strong>${winner}</strong><p>Melhor resultado no desempenho combinado</p></div>
      </div>
    </section>`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// §11 · SELECT PERSONALIZADO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Fecha um select personalizado.
 * @param {HTMLElement} wrapper
 */
function closeCustomSelect(wrapper) {
  if (!wrapper) return;
  wrapper.classList.remove("is-open");
  const trigger = wrapper.querySelector(".custom-select__trigger");
  if (trigger) trigger.setAttribute("aria-expanded", "false");
}

/**
 * Sincroniza o visual do select personalizado com o <select> nativo.
 * @param {HTMLSelectElement} select
 */
function syncCustomSelect(select) {
  const wrapper = select?.closest(".custom-select");
  if (!wrapper) return;
  const trigger = wrapper.querySelector(".custom-select__trigger");
  const value = wrapper.querySelector(".custom-select__value");
  const menu = wrapper.querySelector(".custom-select__menu");
  const selected = select.options[select.selectedIndex];
  value.textContent = selected
    ? selected.textContent.trim()
    : "Selecione uma opção";
  menu.innerHTML = Array.from(select.options)
    .map(
      (option, index) =>
        `<button type="button" class="custom-select__option" role="option" data-index="${index}" aria-selected="${option.selected}" ${option.disabled ? "disabled" : ""}>${option.textContent.trim()}</button>`,
    )
    .join("");
  menu.querySelectorAll(".custom-select__option").forEach((optionButton) => {
    optionButton.addEventListener("click", () => {
      const option = select.options[Number(optionButton.dataset.index)];
      if (!option || option.disabled) return;
      select.selectedIndex = Number(optionButton.dataset.index);
      select.dispatchEvent(new Event("change", { bubbles: true }));
      syncCustomSelect(select);
      closeCustomSelect(wrapper);
      trigger.focus();
    });
  });
  trigger.disabled = select.disabled;
}

/**
 * Envolve um <select> nativo com um controle visual acessível
 * (teclado: setas, Enter, Espaço, Esc e Tab).
 * @param {HTMLSelectElement} select
 */
function enhanceSelect(select) {
  if (!select || select.dataset.customized === "true") return;
  const wrapper = document.createElement("div");
  wrapper.className = "custom-select";
  select.parentNode.insertBefore(wrapper, select);
  wrapper.appendChild(select);
  select.classList.add("custom-select__native");
  select.tabIndex = -1;
  select.setAttribute("aria-hidden", "true");
  select.dataset.customized = "true";
  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "custom-select__trigger";
  trigger.setAttribute("role", "combobox");
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");
  trigger.innerHTML =
    '<span class="custom-select__value"></span><i class="fa-solid fa-chevron-down custom-select__chevron" aria-hidden="true"></i>';
  const menu = document.createElement("div");
  menu.className = "custom-select__menu";
  menu.setAttribute("role", "listbox");
  wrapper.append(trigger, menu);
  trigger.addEventListener("click", () => {
    const willOpen = !wrapper.classList.contains("is-open");
    document
      .querySelectorAll(".custom-select.is-open")
      .forEach(closeCustomSelect);
    if (willOpen) {
      wrapper.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
    }
  });
  trigger.addEventListener("keydown", (event) => {
    if (["ArrowDown", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      wrapper.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
      const current =
        menu.querySelector('[aria-selected="true"]:not(:disabled)') ||
        menu.querySelector(".custom-select__option:not(:disabled)");
      current?.focus();
    }
  });
  menu.addEventListener("keydown", (event) => {
    const options = [
      ...menu.querySelectorAll(".custom-select__option:not(:disabled)"),
    ];
    const currentIndex = options.indexOf(document.activeElement);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      options[
        Math.max(
          0,
          Math.min(
            options.length - 1,
            currentIndex + (event.key === "ArrowDown" ? 1 : -1),
          ),
        )
      ]?.focus();
    } else if (event.key === "Escape") {
      closeCustomSelect(wrapper);
      trigger.focus();
    } else if (event.key === "Tab") {
      closeCustomSelect(wrapper);
    }
  });
  select.addEventListener("change", () => syncCustomSelect(select));
  const observer = new MutationObserver(() => syncCustomSelect(select));
  observer.observe(select, {
    childList: true,
    subtree: true,
    characterData: true,
  });
  syncCustomSelect(select);
}

/**
 * Aplica o select personalizado a todos os <select> e fecha
 * os menus ao clicar fora.
 */
function initCustomSelects() {
  document.querySelectorAll("select").forEach(enhanceSelect);
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".custom-select"))
      document
        .querySelectorAll(".custom-select.is-open")
        .forEach(closeCustomSelect);
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// §12 · VISUALIZADOR DE CÓDIGO FULL-STACK
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Ordem dos arquivos no visualizador e no .zip gerado.
 */
const FILE_ORDER = [
  "app.py",
  "requirements.txt",
  "README.md",
  "templates/base.html",
  "templates/index.html",
  "templates/cars.html",
  "templates/car_details.html",
  "templates/favorites.html",
  "templates/login.html",
  "templates/admin.html",
  "static/css/style.css",
  "static/js/script.js",
];

/**
 * Caminho do arquivo → id do <script type="text/plain"> que guarda o código.
 */
const SRC_MAP = {
  "app.py": "src-app-py",
  "requirements.txt": "src-requirements",
  "README.md": "src-readme",
  "templates/base.html": "src-base",
  "templates/index.html": "src-index",
  "templates/cars.html": "src-cars",
  "templates/car_details.html": "src-details",
  "templates/favorites.html": "src-favorites",
  "templates/login.html": "src-login",
  "templates/admin.html": "src-admin",
  "static/css/style.css": "src-css",
  "static/js/script.js": "src-js",
};

/**
 * Lê o código de um arquivo armazenado no HTML.
 * @param {string} f caminho do arquivo
 * @returns {string}
 */
function fileContent(f) {
  const el = document.getElementById(SRC_MAP[f]);
  if (!el) return "";
  return el.textContent
    .replaceAll("<\\/script>", "</scr" + "ipt>")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

/**
 * Exibe um arquivo no visualizador de código.
 * @param {string} f
 */
function loadFile(f) {
  currentFile = f;
  document
    .querySelectorAll(".filebtn")
    .forEach((b) => b.classList.toggle("active", b.dataset.f === f));
  $("fileTitle").textContent = f;
  $("codePre").textContent = fileContent(f);
  $("fileMeta").textContent =
    fileContent(f).split("\n").length +
    " lines • " +
    new Blob([fileContent(f)]).size +
    " bytes";
}

/**
 * Baixa o arquivo aberto no visualizador.
 */
function downloadCurrent() {
  const blob = new Blob([fileContent(currentFile)], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = currentFile.split("/").pop();
  a.click();
  toast("Baixado " + currentFile, "success");
}

/**
 * Gera e baixa um .zip com todo o projeto Flask (JSZip).
 */
async function downloadZip() {
  try {
    toast("Building projeto zip...");
    const zip = new JSZip();
    FILE_ORDER.forEach((f) => zip.file(f, fileContent(f)));
    zip.file(
      "supercar-gallery-download-note.txt",
      "Execute: pip install -r requirements.txt && python app.py",
    );
    const blob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "supercar-gallery.zip";
    a.click();
    toast("Projeto .zip downloaded!", "success");
  } catch (e) {
    toast("Falha ao gerar o ZIP — use os botões de cópia", "error");
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// §13 · INICIALIZAÇÃO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Ponto de entrada: executa quando o HTML termina de carregar.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Tela de carregamento original: preserva a barra de progresso e o fade-out.
  const loader = $("loader");
  const loadbar = $("loadbar");
  if (loader && loadbar) {
    let progress = 0;
    const loaderInterval = window.setInterval(() => {
      progress = Math.min(100, progress + 14);
      loadbar.style.width = `${progress}%`;

      if (progress >= 100) {
        window.clearInterval(loaderInterval);
        window.setTimeout(() => {
          loader.style.opacity = "0";
          window.setTimeout(() => {
            loader.remove();
            startHomeCounters();
          }, 600);
        }, 250);
      }
    }, 120);
  }
  // Controles numéricos premium do cadastro: setas laranja no extremo direito.
  document
    .querySelectorAll("#carModal .number-spinner button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const input = document.getElementById(button.dataset.target);
        if (!input) return;
        if (button.dataset.spin === "up") input.stepUp();
        else input.stepDown();
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.focus();
      });
    });

  // Dados e primeira renderização de todas as telas.
  load();
  updateBadges();
  renderPills();
  renderDestaques();
  renderCars();
  renderFavs();
  syncHearts();
  // Faixa de marcas (lista duplicada para o loop infinito do marquee).
  $("brandMarquee").innerHTML = [...brands(), ...brands()]
    .map(
      (b) =>
        `<span><i class="fa-solid fa-diamond" aria-hidden="true"></i> ${b.toUpperCase()}</span>`,
    )
    .join("");
  // Árvore de arquivos do visualizador de código.
  $("fileTree").innerHTML = FILE_ORDER.map(
    (f, i) =>
      `<button class="filebtn ${i === 0 ? "active" : ""}" data-f="${f}" onclick="loadFile('${f}')"><i class="fa-solid fa-file-lines" aria-hidden="true"></i> ${f}</button>`,
  ).join("");
  loadFile("app.py");
  // Roteamento por hash e selects personalizados.
  window.addEventListener("hashchange", handleRoute);
  handleRoute();
  initCustomSelects();
  // ── Controles de filtro da Garagem ──
  $("searchInput").addEventListener("input", (e) => {
    filters.q = e.target.value.trim();
    renderCars();
  });
  $("sortSelect").addEventListener("change", (e) => {
    filters.sort = e.target.value;
    renderCars();
  });
  $("priceRange").addEventListener("input", (e) => {
    filters.maxPrice = +e.target.value;
    $("priceLabel").textContent = fmt(filters.maxPrice);
    renderCars();
  });
  $("hpRange").addEventListener("input", (e) => {
    filters.minHp = +e.target.value;
    $("hpLabel").textContent = filters.minHp + " HP";
    renderCars();
  });
  // Busca do banner: Enter dispara a pesquisa.
  $("heroSearch").addEventListener("keydown", (e) => {
    if (e.key === "Enter") heroGo();
  });
  // Upload de imagem: otimiza e mostra a pré-visualização.
  $("fImageFile").addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      selectedCarImage = await optimizeImage(file);
      $("fPreview").style.backgroundImage = `url("${selectedCarImage}")`;
      $("fPreview").classList.remove("is-empty");
      toast("Imagem enviada e otimizada.", "success");
    } catch (error) {
      selectedCarImage = null;
      e.target.value = "";
      toast(error.message || "Falha ao enviar a imagem.", "error");
    }
  });

  // Clique na prévia: abre o seletor ou remove a imagem pelo X.
  $("fPreview").addEventListener("click", (e) => {
    const preview = $("fPreview");

    if (
      e.offsetX > preview.clientWidth - 30 &&
      e.offsetY < 30 &&
      !preview.classList.contains("is-empty")
    ) {
      e.stopPropagation();

      selectedCarImage = null;
      $("fImageFile").value = "";
      preview.style.backgroundImage = "none";
      preview.classList.add("is-empty");
    } else {
      $("fImageFile").click();
    }
  });

  // Menu móvel: alterna o menu e o ícone Font Awesome com estado acessível.
  const burger = $("burger");
  const mobileMenu = $("mobileMenu");
  const setMobileMenu = (open) => {
    mobileMenu.classList.toggle("hidden", !open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    const icon = burger.querySelector("i");
    icon?.classList.toggle("fa-bars", !open);
    icon?.classList.toggle("fa-xmark", open);
  };
  burger.addEventListener("click", () =>
    setMobileMenu(mobileMenu.classList.contains("hidden")),
  );
  document
    .querySelectorAll("#mobileMenu a")
    .forEach((a) => a.addEventListener("click", () => setMobileMenu(false)));
  // ── Login: valida campos e compara com a senha salva (padrão "admin123") ──
  $("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const u = $("loginUser").value.trim(),
      pw = $("loginPass").value;
    $("e-user").classList.toggle("hidden", !!u);
    $("e-pass").classList.toggle("hidden", pw.length >= 6);
    $("loginUser").classList.toggle("err", !u);
    $("loginPass").classList.toggle("err", pw.length < 6);
    if (!u || pw.length < 6) return;
    const savedPassword =
      localStorage.getItem("sg_admin_password") || "admin123";
    if (u === "admin" && pw === savedPassword) {
      isAdmin = true;
      sessionStorage.setItem("sg_admin", "1");
      updateBadges();
      location.hash = "#/login";
      renderAdmin();
      $("loginError").classList.add("hidden");
      toast("Bem-vindo de volta, administrador!", "success");
    } else {
      $("loginError").classList.remove("hidden");
      $("loginForm").classList.add("shake");
      setTimeout(() => $("loginForm").classList.remove("shake"), 450);
      toast("Credenciais inválidas", "error");
    }
  });

  // Troca de senha: listener delegado porque o formulário é recriado ao atualizar o painel.
  document.addEventListener("submit", (e) => {
    if (e.target.id !== "changePasswordForm") return;
    e.preventDefault();
    if (!isAdmin) return;
    const current = $("currentAdminPassword").value;
    const next = $("newAdminPassword").value;
    const confirm = $("confirmAdminPassword").value;
    const saved = localStorage.getItem("sg_admin_password") || "admin123";
    if (current !== saved)
      return toast("A senha atual está incorreta.", "error");
    if (next.length < 6)
      return toast("A nova senha deve ter pelo menos 6 caracteres.", "error");
    if (next !== confirm)
      return toast("A confirmação da senha não confere.", "error");
    localStorage.setItem("sg_admin_password", next);
    e.target.reset();
    toast("Senha atualizada neste navegador.", "success");
  });

  // ── Recuperação de senha (alterna formulários e salva a nova senha localmente) ──
  $("forgotPasswordLink")?.addEventListener("click", (e) => {
    e.preventDefault();
    $("loginForm").classList.add("hidden");
    $("forgotPasswordForm").classList.remove("hidden");
    $("loginError").classList.add("hidden");
  });
  $("backToLogin")?.addEventListener("click", (e) => {
    e.preventDefault();
    $("forgotPasswordForm").classList.add("hidden");
    $("loginForm").classList.remove("hidden");
  });
  $("forgotPasswordForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = $("resetUser").value.trim();
    const next = $("resetPassword").value;
    const confirm = $("resetPasswordConfirm").value;
    if (user !== "admin")
      return toast("Usuário administrativo não encontrado.", "error");
    if (next.length < 6)
      return toast("A senha deve ter pelo menos 6 caracteres.", "error");
    if (next !== confirm) return toast("As senhas não conferem.", "error");
    localStorage.setItem("sg_admin_password", next);
    e.target.reset();
    $("forgotPasswordForm").classList.add("hidden");
    $("loginForm").classList.remove("hidden");
    toast(
      "Senha redefinida neste navegador. Faça login com a nova senha.",
      "success",
    );
  });

  // ── Test drive: valida nome, e-mail, telefone e data ──
  $("driveForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const n = $("dName").value.trim(),
      em = $("dEmail").value.trim(),
      ph = $("dPhone").value.trim();
    const errs = [];
    if (n.length < 2) errs.push("Digite seu nome completo.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em))
      errs.push("Digite um e-mail válido.");
    const phoneDigits = ph.replace(/\D/g, "");
    const validDDDs = new Set([
      "11", "12", "13", "14", "15", "16", "17", "18", "19",
      "21", "22", "24", "27", "28", "31", "32", "33", "34", "35", "37", "38",
      "41", "42", "43", "44", "45", "46", "47", "48", "49", "51", "53", "54", "55",
      "61", "62", "63", "64", "65", "66", "67", "68", "69", "71", "73", "74", "75",
      "77", "79", "81", "82", "83", "84", "85", "86", "87", "88", "89", "91", "92",
      "93", "94", "95", "96", "97", "98", "99",
    ]);
    const validDDD = validDDDs.has(phoneDigits.slice(0, 2));
    if ((phoneDigits.length !== 10 && phoneDigits.length !== 11) || !validDDD)
      errs.push("Digite um telefone válido com DDD.");
    const dateText = $("dDateText")?.value.trim() || "";
    const dateValue = $("dDate")?.value || "";
    if (!dateText) {
      errs.push("Selecione uma data.");
    } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateText) || !dateValue) {
      errs.push("Digite uma data válida no formato dd/mm/aaaa.");
    }
    if (errs.length) {
      $("driveErr").innerHTML = errs.join("<br>");
      $("driveErr").classList.remove("hidden");
      return;
    }
    $("driveErr").classList.add("hidden");
    closeModal("driveModal");
    e.target.reset();
    toast(
      "Test drive agendado! A concessionária entrará em contato.",
      "success",
    );
  });
  // ── Newsletter: valida o e-mail e mostra a mensagem de retorno ──
  // Cadastro/edição: valida os dados, salva no navegador e atualiza o catálogo.
  $("carForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    const currentCar = editId ? cars.find((x) => x.id === editId) : null;
    const v = {
      name: $("fName").value.trim(),
      brand: $("fBrand").value.trim(),
      year: parseInt($("fYear").value),
      price: parseFloat($("fPrice").value),
      engine: $("fEngine").value.trim(),
      hp: parseInt($("fHp").value),
      sp: parseInt($("fSpeed").value) || 200,
      zero: parseFloat($("fZero").value) || null,
      cat: $("fCat").value.trim() || "Supercar",
      img: selectedCarImage || currentCar?.image_url || "",
      desc: $("fDesc").value.trim(),
    };
    const errs = [];
    if (!v.name) errs.push("O nome é obrigatório.");
    if (!v.brand) errs.push("A marca é obrigatória.");
    if (!(v.year >= 1950 && v.year <= 2026))
      errs.push("O ano deve estar entre 1950 e 2026.");
    if (!(v.price > 0)) errs.push("O preço deve ser maior que zero.");
    if (!v.engine) errs.push("O campo motor é obrigatório.");
    if (!(v.hp > 0)) errs.push("A potência deve ser maior que zero.");
    if (!v.desc) errs.push("A descrição é obrigatória.");
    if (errs.length) {
      $("carErr").innerHTML = errs.join("<br>");
      $("carErr").classList.remove("hidden");
      return;
    }
    $("carErr").classList.add("hidden");
    if (editId) {
      const c = cars.find((x) => x.id === editId);
      Object.assign(c, {
        name: v.name,
        brand: v.brand,
        year: v.year,
        price: v.price,
        engine: v.engine,
        horsepower: v.hp,
        top_speed: v.sp,
        zero_sixty: v.zero,
        category: v.cat,
        image_url: v.img,
        description: v.desc,
      });
      toast("Car #" + editId + " atualizado!", "success");
    } else {
      const nid = Math.max(...cars.map((c) => c.id), 0) + 1;
      cars.unshift({
        id: nid,
        name: v.name,
        brand: v.brand,
        year: v.year,
        price: v.price,
        engine: v.engine,
        horsepower: v.hp,
        top_speed: v.sp,
        zero_sixty: v.zero,
        torque: "—",
        transmission: "DCT",
        drivetrain: "RWD",
        category: v.cat,
        image_url: v.img,
        description: v.desc,
      });
      toast("Carro adicionado ao banco de dados!", "success");
    }
    saveCars();
    closeModal("carModal");
    renderPills();
    renderCars();
    renderDestaques();
    renderFavs();
    renderAdmin();
  });
  $("delConfirm").addEventListener("click", () => {
    if (!isAdmin) return;
    cars = cars.filter((c) => c.id !== delId);
    favorites = favorites.filter((f) => f !== delId);
    saveCars();
    saveFavs();
    updateBadges();
    closeModal("delModal");
    renderPills();
    renderCars();
    renderDestaques();
    renderAdmin();
    renderFavs();
    toast("Carro excluído (favoritos removidos em cascata).", "success");
  });
  // Newsletter: preserva a correção dos ícones aplicada no V2.
  $("newsForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const em = $("newsEmail").value.trim();
    const m = $("newsMsg");
    m.classList.remove("hidden");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      m.innerHTML =
        '<i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> Digite um endereço de e-mail válido.';
      m.className = "text-xs mt-2 text-red-400";
      return;
    }
    m.innerHTML =
      '<i class="fa-solid fa-check" aria-hidden="true"></i> Você está na lista. Boas-vindas à pista!';
    m.className = "text-xs mt-2 text-green-400";
    e.target.reset();
    toast("Subscribed!", "success");
  });
  // Terminal animado: escreve uma linha a cada 700 ms.
  const termLines = [
    "$ pip install -r requirements.txt",
    '<i class="fa-solid fa-check" aria-hidden="true"></i> Flask 3.0.0 + Werkzeug installed',
    "$ python app.py",
    " * Serving Flask app • sqlite: database.db",
    " * 12 cars seeded • admin created",
    " * Running on http://127.0.0.1:5000",
    " * Press CTRL+C to quit",
  ];
  let ti = 0;
  $("terminal").innerHTML = "";
  const tInt = setInterval(() => {
    if (ti >= termLines.length) {
      clearInterval(tInt);
      return;
    }
    $("terminal").innerHTML +=
      `<div><span class="text-gray-600">${String(ti + 1).padStart(2, "0")}</span> <span class="${termLines[ti].startsWith("$") ? "text-white" : termLines[ti].startsWith(" * Running") ? "text-green-400" : "text-gray-400"}">${termLines[ti]}</span></div>`;
    ti++;
  }, 700);
  // Revela elementos .reveal ao entrarem na tela e dispara contadores.
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((x) => {
        if (x.isIntersecting) {
          x.target.classList.add("visible");
          if (x.target.querySelector(".counter"))
            x.target.querySelectorAll(".counter").forEach(runCounter);
        }
      }),
    { threshold: 0.2 },
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  /** Anima os indicadores quando entram na área visível, uma única vez. */
  function runCounter(el) {
    if (el.dataset.done === "1") return;

    const target = Number(el.dataset.target);
    if (!Number.isFinite(target)) return;

    el.dataset.done = "1";
    const duration = 1600;
    const start = performance.now();
    const formatter = new Intl.NumberFormat("pt-BR", {
      maximumFractionDigits: Number.isInteger(target) ? 0 : 1,
    });

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      // Ease-out cúbico: acelera no início e desacelera suavemente no final.
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = formatter.format(progress === 1 ? target : value);

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  // Atualiza os indicadores da página inicial com os dados reais do catálogo.
  // A animação começa após a saída do loader para não terminar escondida.
  function startHomeCounters() {
    const home = $("view-home");
    if (!home) return;

    const homeCounters = home.querySelectorAll(".counter[data-counter]");
    if (!homeCounters.length) return;

    const totalCars = cars.length;
    const totalBrands = new Set(
      cars.map((car) => String(car.brand || "").trim().toLowerCase()).filter(Boolean),
    ).size;
    const fleetValueMillions = cars.reduce(
      (total, car) => total + Math.max(0, Number(car.price) || 0),
      0,
    ) / 1_000_000;
    // Soma a potência de todos os veículos do catálogo, mantendo o total
    // original exibido no indicador e atualizando-o também com dados salvos.
    const totalHorsepower = cars.reduce(
      (total, car) => total + Math.max(0, Number(car.horsepower) || 0),
      0,
    );

    const values = {
      cars: totalCars,
      brands: totalBrands,
      horsepower: totalHorsepower,
      fleet: fleetValueMillions,
    };

    homeCounters.forEach((counter) => {
      const key = counter.dataset.counter;
      if (!(key in values)) return;
      counter.dataset.target = String(values[key]);
      counter.dataset.done = "0";
      counter.textContent = "0";
      runCounter(counter);
    });
  }

  // Fallback caso a página não tenha loader.
  if (!loader) startHomeCounters();
  // Registra o plugin de rolagem do GSAP, se a biblioteca carregou.
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(window.ScrollTrigger);
  }
  // Efeito 3D: usa quickTo para reutilizar tweens e evita custo em touch.
  const hc = $("heroCard");
  if (hc && window.gsap && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const rotateYTo = gsap.quickTo(hc, "rotationY", { duration: 0.35, ease: "power2.out" });
    const rotateXTo = gsap.quickTo(hc, "rotationX", { duration: 0.35, ease: "power2.out" });
    document.addEventListener("pointermove", (e) => {
      const r = hc.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) / Math.max(1, r.width);
      const y = (e.clientY - r.top - r.height / 2) / Math.max(1, r.height);
      rotateYTo(x * 8);
      rotateXTo(-y * 8);
    }, { passive: true });
    hc.addEventListener("pointerleave", () => {
      rotateYTo(0);
      rotateXTo(0);
    }, { passive: true });
  }
});
