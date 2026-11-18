# Relatório de auditoria — Supercar Gallery

**Data:** 16/11/2026  
**Escopo:** revisão estática de HTML, CSS, JavaScript, caminhos de recursos, integridade de imagens e pontos de risco de execução.

## Correções aplicadas

1. Caminhos do logotipo ajustados de `logo.png` para `logo.webp`.
2. Removidos da allowlist os caminhos de imagens Bugatti/Porsche inexistentes neste pacote.
3. Registro do ScrollTrigger condicionado à disponibilidade de GSAP e do plugin.
4. `saveFavs()` agora trata falhas de armazenamento sem interromper a interação.
5. Efeito 3D do hero passou a reutilizar tweens via `gsap.quickTo` e só executa em dispositivos com mouse/ponteiro preciso.
6. Scripts JavaScript externos usam `defer` para reduzir bloqueio do parser.
7. Removido o pré-carregador em tela cheia e seu temporizador/efeito de fade, que acrescentavam uma camada fixa sobre toda a viewport a cada atualização.
8. Adicionado CSS crítico inline no `<head>` e `color-scheme: dark` para pintar a tela com o fundo do projeto antes da chegada dos recursos externos.
9. O Tailwind CDN voltou a carregar sem `defer`: como o CDN gera os estilos utilitários em tempo de execução, adiá-lo criava um primeiro paint sem esses estilos e um salto visual posterior. GSAP, ScrollTrigger, JSZip e `app.js` continuam com `defer`.
10. Mantida a rolagem nativa em dispositivos móveis; não há `overscroll-behavior: none`, portanto o código não bloqueia deliberadamente o gesto de puxar para atualizar.
11. Atualizada a versão da URL do CSS para invalidar o cache (`style.css?v=20261116-5`).

## Resultados

- `node --check assets/js/app.js`: aprovado.
- HTML parseado: estrutura `html/head/body` presente.
- IDs duplicados: 0.
- Referências estáticas de elementos via `$()` ausentes: 0.
- Handlers inline sem função correspondente: 0.
- CSS: 223 regras analisadas na auditoria anterior; após o ajuste mobile, nova análise de sintaxe executada.
- Mobile: `overscroll-behavior-y: none`/`overscroll-behavior: none` não é aplicado; o gesto nativo de atualização permanece habilitado.
- Imagens: 10 arquivos verificados, 0 corrompidos.
- Referências de logo, CSS e JavaScript: verificadas.

## Não executado

A automação headless de navegador não concluiu neste ambiente. Assim, não há evidência de teste ponta a ponta real dos fluxos ou de inspeção visual nos viewports de celular/iPad/desktop. Não declarar estes fluxos como aprovados sem executar testes reais em navegador.

## Risco de segurança

O login administrativo é local e demonstrativo. A senha padrão `admin123`, a redefinição local e o uso de `localStorage`/`sessionStorage` não fornecem segurança para produção. É necessário backend com autenticação/autorização, hash de senha e sessão segura.

## Checklist para teste manual

- [ ] Desktop: navegação, pesquisa, filtros e ordenação.
- [ ] Desktop: favoritos, exportação e comparação.
- [ ] Desktop: detalhes, visualização rápida e test drive.
- [ ] Admin: login, alteração de senha, CRUD e upload/remoção de imagem.
- [ ] Mobile: menu, navegação, formulários, modais e cards sem overflow horizontal.
- [ ] iPad Mini retrato/paisagem: cabeçalho, menu, largura e grids.
- [ ] iPad Pro 13 retrato/paisagem: cabeçalho, grids e detalhes.
- [ ] Console: ausência de erros JS e recursos 404.


## Revisão adicional do flash nos cantos (16/11/2026)

A versão anterior continha uma camada fixa `#loader` cobrindo a viewport inteira, removida por um fade após um temporizador, e o Tailwind CDN estava com `defer`. Como o Tailwind CDN injeta CSS utilitário em runtime, essa combinação podia revelar a página antes de todos os estilos estarem prontos e provocar uma mudança visual após a primeira pintura.

Nesta revisão, a camada de pré-carregamento e o temporizador foram removidos; o fundo e `color-scheme` passaram a ser declarados inline no `<head>`; o Tailwind voltou a executar antes do parsing do restante do documento; e a rolagem/atualização nativa não foi bloqueada. A URL do CSS foi versionada para evitar cache antigo.

**Limite:** a origem exata do flash ainda não pode ser certificada sem reproduzi-lo no navegador e aparelho afetados. Efeitos visuais gerados pela interface do próprio navegador/sistema operacional (por exemplo, feedback nativo de overscroll ou transição de navegação) não são controlados pelo CSS do site. Esta revisão remove causas plausíveis dentro do projeto, mas não equivale a uma validação física no aparelho.

## Ajuste solicitado — tela de carregamento

A tela original `#loader` foi preservada e restaurada no HTML, no CSS e no fluxo de inicialização do JavaScript. A barra `#loadbar` volta a avançar e a tela desaparece com a transição original após completar o progresso. O ajuste não remove o loader nem bloqueia a rolagem/atualização nativa do navegador.
