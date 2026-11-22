# Atualização de ícones — Font Awesome

A interface foi padronizada para utilizar Font Awesome 6.7.2 nos controles iconográficos.

## Substituições

- Menu móvel: barras CSS substituídas por `fa-bars`, alternando para `fa-xmark` ao abrir.
- Pesquisa da Garagem: SVG substituído por `fa-magnifying-glass`.
- Favorito do hero: SVG substituído por `fa-heart` com estado regular/sólido sincronizado.
- Controles numéricos do cadastro: dez SVGs substituídos por `fa-chevron-up` e `fa-chevron-down`.
- Selects personalizados: chevron desenhado em CSS substituído por `fa-chevron-down` com rotação ao abrir.
- Prévia de imagem do veículo: caracteres CSS `+` e `×` substituídos por `fa-plus` e `fa-xmark`.
- Ações de adicionar e comparar: caracteres `+` substituídos por `fa-plus`.
- Ações de edição/exclusão, cópia, download, exportação, cadastro, login de demonstração e newsletter receberam ícones coerentes.
- Botões icon-only ganharam rótulos acessíveis, sem alterar sua ação.
- Prévia em modo de edição: corrigida para exibir a imagem como `background-image`, compatível com o elemento `<div>` usado no preview.
- Botões de favorito dinâmicos: estados `aria-pressed`, `aria-label` e título sincronizados com o ícone.

## Itens preservados intencionalmente

- Separadores tipográficos (`•`, `—`) e sinais matemáticos/unidades.
- Indicadores de status e decorações não funcionais.
- Árvore textual e exemplos do código-fonte exibidos na seção Full-Stack: são conteúdo/documentação, não ícones de controle da interface.
- Tela de carregamento, layout, responsividade e funcionalidades existentes.

## Dependência

A folha Font Awesome 6.7.2 já existente no HTML foi mantida. Nenhuma nova biblioteca foi adicionada.
