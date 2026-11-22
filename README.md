## Ícones Font Awesome

A interface utiliza Font Awesome 6.7.2 para setas, controles, ações e ícones funcionais. Consulte `ICONES-FONTAWESOME.md` para o inventário das substituições.

# 🏁 Supercar Gallery

> **Uma experiência digital dedicada à engenharia, ao design e à performance dos supercarros mais extraordinários do mundo.**

A **Supercar Gallery** é uma aplicação web de página única (SPA) para explorar uma coleção de supercarros e hipercarros. O projeto combina uma interface escura de estética premium com catálogo interativo, filtros, detalhes técnicos, favoritos, comparação de veículos, agendamento demonstrativo de test drive e uma área administrativa local.

---

## 📌 Índice

- [Visão geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias e dependências](#-tecnologias-e-dependências)
- [Mapa completo do projeto](#-mapa-completo-do-projeto)
- [Arquitetura da aplicação](#-arquitetura-da-aplicação)
- [Como executar](#-como-executar)
- [Onde editar cada parte](#-onde-editar-cada-parte)
- [Dados e armazenamento](#-dados-e-armazenamento)
- [Responsividade e organização do CSS](#-responsividade-e-organização-do-css)
- [Cuidados e limitações](#-cuidados-e-limitações)
- [Próximas evoluções](#-próximas-evoluções)

## ✨ Visão geral

| Área | Descrição |
|---|---|
| Identidade visual | Tema escuro, detalhes dourados, tipografia tecnológica e cartões com efeitos sutis |
| Página inicial | Hero, destaques e chamadas para explorar a coleção |
| Garagem | Catálogo com pesquisa, filtros e ordenação |
| Detalhes | Página de informações e especificações de cada veículo |
| Favoritos | Lista pessoal de veículos salvos no navegador |
| Comparação | Seleção e comparação de características dos veículos |
| Test drive | Formulário demonstrativo para iniciar um agendamento |
| Administração | Acesso local, gerenciamento demonstrativo do catálogo e controles administrativos |
| Código Full-Stack | Área demonstrativa com arquivos e exemplos de código apresentados pela interface |

## 🚘 Funcionalidades

- Navegação entre as visualizações sem recarregar a página.
- Catálogo inicial de veículos com dados técnicos e imagens.
- Pesquisa e filtros por critérios disponíveis na interface.
- Ordenação e apresentação de veículos em cartões.
- Visualização detalhada e visualização rápida.
- Inclusão e remoção de favoritos.
- Exportação da lista de favoritos.
- Comparação de veículos selecionados.
- Formulário de test drive com preenchimento contextual do veículo.
- Área administrativa demonstrativa para visualizar, cadastrar, editar e excluir veículos.
- Alteração local da senha administrativa e encerramento da sessão.
- Select personalizado, notificações e modais.
- Recursos de animação, efeitos de rolagem e adaptação para desktop, tablets e celulares.
- Otimização de imagens adicionadas pela interface e recursos de exportação/compactação quando acionados.

## 🧰 Tecnologias e dependências

| Tecnologia | Papel no projeto |
|---|---|
| HTML5 | Estrutura semântica e conteúdo da aplicação |
| CSS3 | Identidade visual, componentes, animações e responsividade |
| JavaScript Vanilla | Estado, navegação, catálogo, filtros e interações |
| Tailwind CSS (CDN) | Classes utilitárias usadas no HTML |
| GSAP | Animações e transições |
| GSAP ScrollTrigger | Animações vinculadas à rolagem |
| Font Awesome | Biblioteca de ícones |
| Google Fonts | Orbitron, Inter e JetBrains Mono |
| JSZip | Geração de arquivos ZIP pela interface |

As bibliotecas externas são carregadas por CDN. Portanto, a primeira abertura precisa de conexão com a internet para carregar fontes, estilos utilitários, ícones e bibliotecas externas.

---

## 🗂️ Mapa completo do projeto

```text
supercar/
│
├── index.html
│   ├── Metadados, título e dependências externas
│   ├── Configuração do tema Tailwind
│   ├── Ajuste específico do campo de data do test drive
│   ├── Tela de carregamento
│   ├── Cabeçalho e navegação
│   ├── Visualização inicial (home)
│   ├── Garagem / catálogo de veículos
│   ├── Detalhes do veículo
│   ├── Favoritos
│   ├── Acesso e painel administrativo
│   ├── Área demonstrativa de código Full-Stack
│   ├── Rodapé, modais e notificações
│   └── Inclusão do JavaScript principal
│
├── assets/
│   ├── css/
│   │   └── style.css
│   │       ├── A. Variáveis globais (:root)
│   │       ├── B. Base, tipografia e efeitos
│   │       ├── C. Botões e cartões
│   │       ├── D. Movimento e revelação
│   │       ├── E. Formulários
│   │       ├── F. Modais e notificações
│   │       ├── G. Componentes diversos
│   │       ├── H. Keyframes
│   │       ├── I. Responsividade principal
│   │       ├── J. Tipografia fluida
│   │       ├── K. Select personalizado
│   │       ├── L. Zoom de imagens
│   │       ├── M. Painel de personalização
│   │       ├── N. Compatibilidade mobile
│   │       ├── O. Página de código Full-Stack
│   │       ├── P. Comparação de veículos
│   │       ├── Q. Cabeçalho em tablets
│   │       ├── R. Hero desktop e rodapé em tablets
│   │       ├── S. Acesso administrativo
│   │       └── Ajustes finais de espaçamento e test drive
│   │
│   ├── js/
│   │   └── app.js
│   │       ├── 01. Configuração e dados iniciais
│   │       ├── 02. Estado global
│   │       ├── 03. Utilitários
│   │       ├── 04. Persistência
│   │       ├── 05. Modais e roteamento
│   │       ├── 06. Catálogo e filtros
│   │       ├── 07. Favoritos
│   │       ├── 08. Detalhes, visualização rápida e test drive
│   │       ├── 09. Acesso e painel administrativo
│   │       ├── 10. Comparação de veículos
│   │       ├── 11. Select personalizado
│   │       ├── 12. Visualizador de código Full-Stack
│   │       └── 13. Inicialização
│   │
│   └── images/
│       ├── banners/
│       │   └── ferrari-499p.webp
│       ├── icons/
│       ├── logos/
│       │   └── logo.webp
│       ├── pages/
│       ├── vehicles/
│       │   ├── aston-martin-valkyrie.webp
│       │   ├── ferrari-sf90-stradale.webp
│       │   ├── koenigsegg-jesko-absolut.webp
│       │   ├── lamborghini-revuelto.webp
│       │   ├── mclaren-750s.webp
│       │   ├── pagani-huayra-r.webp
│       │   └── rimac-nevera.webp
│       └── img-preview.webp
│
├── .gitignore
├── license
└── README.md
```

> As pastas `icons/` e `pages/` estão preparadas para receber novos recursos visuais. Os arquivos `.gitkeep` mantêm essas pastas no controle de versão mesmo quando estão vazias.

## 🧭 Arquitetura da aplicação

A aplicação é organizada em três camadas principais:

1. **`index.html` — estrutura:** contém as visualizações, componentes, modais e pontos de montagem da interface.
2. **`assets/css/style.css` — apresentação:** concentra o tema, os componentes visuais, animações e ajustes responsivos.
3. **`assets/js/app.js` — comportamento:** controla os dados, o estado, a navegação, os eventos e a persistência no navegador.

### Visualizações principais

| Identificador | Responsabilidade |
|---|---|
| `view-home` | Página inicial e destaques |
| `view-cars` | Catálogo / garagem |
| `view-details` | Detalhes de um veículo |
| `view-favorites` | Veículos favoritados |
| `view-login` | Acesso e painel administrativo |
| `view-backend` | Conteúdo demonstrativo de código Full-Stack |

O JavaScript controla a navegação por hash/rota e alterna a visualização ativa. Assim, a navegação acontece dentro da mesma página.

### Organização interna do JavaScript

O arquivo `app.js` possui um sumário no início e está dividido em 13 seções. Para localizar uma funcionalidade, procure pelo título da seção ou pelo nome da função.

| Seção | O que procurar |
|---|---|
| Dados iniciais | `DEFAULT_CARS`, `HERO_FERRARI`, imagens permitidas e configurações |
| Estado global | Variáveis que representam seleções e estado atual |
| Utilitários | Formatação, notificações, cópia e tratamento de imagens |
| Persistência | Leitura e gravação no armazenamento do navegador |
| Roteamento | Abertura/fechamento de modais e troca de visualizações |
| Catálogo | Renderização, pesquisa, filtros e ordenação |
| Favoritos | Alternância, sincronização, renderização e exportação |
| Detalhes e test drive | Ficha do veículo, visualização rápida e formulário |
| Administração | Login demonstrativo, estoque e operações de cadastro |
| Comparação | Seleção e renderização dos veículos comparados |
| Select | Personalização e sincronização dos campos |
| Código Full-Stack | Visualização e download de arquivos demonstrativos |
| Inicialização | Eventos e configuração executados ao carregar a aplicação |

---

## 🚀 Como executar

Não é necessário instalar dependências nem executar um processo de build para abrir a versão estática.

### Opção 1 — Abrir no navegador

1. Extraia o ZIP ou clone o repositório.
2. Abra a pasta `supercar`.
3. Abra o arquivo `index.html` no navegador.

### Opção 2 — Servidor local (recomendado)

Com Python instalado, abra o terminal dentro da pasta do projeto e execute:

```bash
python -m http.server 8000
```

Acesse no navegador:

```text
http://localhost:8000
```

Um servidor local costuma oferecer um comportamento mais previsível para carregamento de arquivos e recursos do navegador.

---

## 🛠️ Onde editar cada parte

| Quero alterar... | Arquivo / local |
|---|---|
| Título, descrição e metadados | `index.html` — seção `<head>` |
| Textos, títulos e estrutura das telas | `index.html` |
| Cores, fontes e medidas globais | `assets/css/style.css` — primeiro `:root` |
| Botões, cartões, formulários e modais | `assets/css/style.css` — seção correspondente |
| Animações | `assets/css/style.css` — seção `KEYFRAMES` |
| Ajustes para tablet e celular | `assets/css/style.css` — blocos `@media` |
| Veículos do catálogo inicial | `assets/js/app.js` — `DEFAULT_CARS` |
| Veículo de destaque da home | `assets/js/app.js` — `HERO_FERRARI` |
| Regras de imagens aceitas | `assets/js/app.js` — `AVAILABLE_IMAGE_PATHS` |
| Favoritos e armazenamento | `assets/js/app.js` — seção de persistência e favoritos |
| Login e painel administrativo | `assets/js/app.js` — seção administrativa |
| Comparação de veículos | `assets/js/app.js` — seção de comparação |
| Imagens dos veículos | `assets/images/vehicles/` |
| Banner principal | `assets/images/banners/` |
| Logo | `assets/images/logos/` |

### Alterar cores e identidade visual

As variáveis globais estão no início de `assets/css/style.css`, dentro de `:root`. É o primeiro lugar para procurar quando quiser mudar as cores, fontes, raios, sombras, larguras e medidas gerais.

As variáveis de espaçamento global também estão centralizadas nesse bloco. As variáveis que mudam especificamente em telas pequenas permanecem dentro do `@media` correspondente.

### Adicionar um veículo ao catálogo

Os veículos iniciais ficam no array `DEFAULT_CARS`, em `assets/js/app.js`. Um registro segue este formato:

```js
{
  id: 1,
  name: "SF90 Stradale",
  brand: "Ferrari",
  year: 2024,
  price: 625000,
  engine: "V8 híbrido biturbo de 4,0 L",
  horsepower: 986,
  top_speed: 211,
  zero_sixty: 2.5,
  torque: "590 lb-ft",
  transmission: "DCT de 8 marchas",
  drivetrain: "AWD",
  category: "Hipercarro híbrido",
  description: "Descrição do veículo.",
  image_url: "assets/images/vehicles/ferrari-sf90-stradale.webp"
}
```

Use um `id` único e confira se o caminho da imagem corresponde exatamente ao arquivo existente.

### Adicionar ou substituir imagens

1. Coloque o arquivo na pasta adequada em `assets/images/`.
2. Prefira WebP para imagens fotográficas, com dimensões proporcionais ao espaço em que serão exibidas.
3. Atualize o caminho correspondente nos dados do veículo ou no HTML.
4. Quando a imagem for usada como imagem de veículo cadastrável, confira também a lista `AVAILABLE_IMAGE_PATHS` em `app.js`.
5. Teste a imagem em desktop e celular.

---

## 💾 Dados e armazenamento

A versão atual utiliza o armazenamento do próprio navegador:

| Chave | Armazenamento | Finalidade |
|---|---|---|
| `sg_cars_v2` | `localStorage` | Dados do catálogo de veículos |
| `sg_favs` | `localStorage` | Veículos favoritos |
| `sg_admin_password` | `localStorage` | Senha administrativa demonstrativa |
| `sg_admin` | `sessionStorage` | Estado da sessão administrativa |

Esses dados são locais ao navegador e não são sincronizados entre dispositivos ou usuários. Limpar os dados do site pode apagar as informações salvas.

## 📱 Responsividade e organização do CSS

O CSS foi separado por áreas de responsabilidade e possui um mapa no próprio início do arquivo.

- As propriedades de cada regra seguem ordem alfabética sempre que a reorganização não prejudica fallbacks, prefixos ou a leitura.
- As variáveis globais ficam reunidas no `:root` inicial.
- As variáveis específicas de mobile permanecem nos seus respectivos breakpoints.
- Os `@keyframes` ficam reunidos em uma única seção.
- Os blocos `@media` preservam a ordem funcional de aplicação.

**Importante:** a ordem das media queries não deve ser alterada mecanicamente apenas para agrupar larguras. Em CSS, regras posteriores podem sobrescrever regras anteriores; alguns ajustes finais do projeto foram mantidos no fim intencionalmente para prevalecer sobre estilos anteriores.

## ⚠️ Cuidados e limitações

- **Administração demonstrativa:** o login e a troca de senha são locais. A senha é armazenada no navegador e não há autenticação segura no servidor. Não utilize esse mecanismo para proteger dados reais.
- **Sem backend ativo:** esta versão é uma aplicação estática executada no navegador. A área chamada “Código Full-Stack” apresenta conteúdo demonstrativo; não significa que exista uma API Flask ou banco de dados conectado.
- **Persistência local:** catálogo, favoritos e credenciais demonstrativas não são compartilhados entre navegadores ou dispositivos.
- **Dependências externas:** Tailwind, GSAP, ScrollTrigger, JSZip, Font Awesome e Google Fonts dependem de conexão para serem carregados por CDN.
- **Dados automotivos:** preços e especificações têm finalidade demonstrativa e devem ser conferidos antes de qualquer uso comercial.

## 🔭 Próximas evoluções

- Criar uma API para catálogo, favoritos e administração.
- Implementar autenticação real com senhas protegidas e permissões.
- Persistir dados em SQLite ou PostgreSQL.
- Implementar upload de imagens no servidor.
- Criar testes automatizados para filtros, formulários e operações administrativas.
- Adicionar validação de dados e tratamento de erros no backend.
- Implementar otimização de imagens e carregamento sob demanda.

Esses pontos são sugestões de evolução, não funcionalidades de backend já implementadas nesta versão.

---

## 📄 Licença

Consulte o arquivo [`license`](license) incluído na raiz do projeto.

## 👨‍💻 Créditos

Desenvolvido por **Jesi Solutions**.

<p align="center">
  <strong>SUPERCAR GALLERY</strong><br>
  <em>Beyond performance. A gallery of automotive excellence.</em>
</p>


---

## ⚡ Otimizações aplicadas

- Bibliotecas GSAP, ScrollTrigger e JSZip carregadas com `defer` para não bloquear a análise inicial do HTML.
- O Tailwind CDN permanece síncrono porque gera CSS utilitário em tempo de execução; adiá-lo com `defer` provocava um primeiro paint sem os estilos utilitários e um salto visual após o carregamento.
- Imagens geradas dinamicamente usam carregamento tardio (`loading="lazy"`) e decodificação assíncrona.
- Logo PNG substituído por WebP com transparência, reduzindo o arquivo de aproximadamente 1,16 MB para 223 KB.
- Dados dinâmicos exibidos nos cartões, detalhes, favoritos e painel administrativo passam por escape HTML.
- URLs de imagens dinâmicas são validadas antes de serem inseridas no HTML.
- Registro do ScrollTrigger protegido quando a biblioteca não estiver disponível.
- CSS respeita `prefers-reduced-motion` para usuários que desativam animações no sistema.
- Removida a pasta `.git` do pacote de distribuição; o histórico Git não é necessário para executar o site.

### Limite de segurança

O painel administrativo desta versão continua sendo demonstrativo e local: senha e catálogo são armazenados no navegador. Não use esse mecanismo para proteger dados ou operações em produção. Para isso, implemente autenticação e autorização no backend, hash de senha, sessões seguras, validação no servidor e proteção CSRF.


## 🧪 Auditoria técnica e validações

Esta revisão complementar foi executada em 16/11/2026.

### Correções aplicadas

- Corrigidos os dois caminhos do logotipo para `assets/images/logos/logo.webp`, que é o arquivo existente no pacote.
- Removidos da lista de imagens permitidas os caminhos de Bugatti e Porsche que não existem nesta distribuição, evitando manter registros locais que apontem para arquivos ausentes.
- Protegido o registro do `ScrollTrigger`: o plugin só é registrado quando GSAP e ScrollTrigger estão disponíveis.
- Protegido o salvamento de favoritos contra falhas de armazenamento do navegador.
- Otimizado o efeito 3D do hero com `gsap.quickTo`, reutilizando tweens em vez de criar uma animação nova a cada movimento do mouse; o efeito fica restrito a dispositivos com ponteiro preciso.
- Scripts externos JavaScript passaram a usar `defer`, preservando a ordem de execução e reduzindo bloqueio da análise do HTML.

### Verificações executadas

| Verificação | Resultado |
|---|---|
| Sintaxe de `app.js` (`node --check`) | Aprovada |
| Parsing estrutural de HTML | Aprovado |
| IDs duplicados | Nenhum encontrado |
| Referências estáticas `$()` sem elemento HTML | Nenhuma encontrada |
| Handlers inline sem função correspondente | Nenhum encontrado |
| Parsing de CSS | 223 regras, sem erros de parsing |
| Integridade dos arquivos de imagem | 10 arquivos verificados, nenhum corrompido |
| Caminhos locais do logotipo, CSS e JavaScript | Corrigidos/verificados |

### Limitações da validação

A execução automatizada em navegador headless não foi concluída neste ambiente. Portanto, esta auditoria **não certifica** cliques e fluxos ponta a ponta reais, nem substitui testes em Chrome/Safari em aparelhos físicos. Os breakpoints CSS foram inspecionados, mas não foi possível confirmar visualmente o layout em iPad Mini, iPad Pro ou celulares.

Antes de publicar, teste manualmente: navegação e menu mobile; pesquisa/filtros/ordenação; favoritos e exportação; comparação; detalhes e visualização rápida; formulário de test drive; login, redefinição de senha e CRUD administrativo; upload/remoção de imagem; newsletter; downloads do visualizador.

**Segurança:** o painel administrativo continua sendo demonstrativo e exclusivamente local. A senha padrão (`admin123`) e a sessão no `localStorage`/`sessionStorage` não protegem uma aplicação pública. Não use esse mecanismo como autenticação de produção; implemente autenticação e autorização no servidor, hash de senha, sessão segura e validação no backend.


## 📱 Estabilidade visual na atualização mobile

- Removida a camada de pré-carregamento em tela cheia e a animação de desaparecimento executada em toda atualização.
- O fundo escuro e o esquema de cores são definidos em CSS inline no `<head>`, antes de baixar as folhas externas, para evitar um primeiro paint claro nas bordas da viewport.
- O gesto nativo de rolar/puxar para atualizar não é bloqueado por `overscroll-behavior: none`.
- A versão do CSS foi atualizada para `20261116-5`, evitando reutilização de cache antigo.
