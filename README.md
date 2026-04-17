# GT — GenTrust | Site institucional premium

Landing institucional com **catálogo dedicado** (`catalogo.html`) e **ficha de produto** (`produto.html?id=...`), além do fluxo de compra via WhatsApp.

## Arquivos

- `index.html`: home (destaques + CTAs para o catálogo)
- `catalogo.html`: catálogo completo (filtros, grid e tabela)
- `produto.html`: página de detalhe do produto (galeria, ficha, características)
- `catalog-core.js`: leitura do catálogo, enriquecimento (imagens/características) e helpers compartilhados
- `catalog.js`: filtros e listagem na página de catálogo
- `product-detail.js`: render da ficha em `produto.html`
- `styles.css`: identidade visual premium dark
- `products-data.js`: catálogo padrão (preços, dosagens, categorias)
- `app.js`: destaques na home
- `admin.html` / `admin.js` / `admin.css`: painel admin e CRUD

## Como usar

1. Abra `index.html` no navegador.
2. Use **Catálogo** no menu ou o CTA para abrir `catalogo.html`.
3. Clique em um produto ou em **Detalhes** para ver `produto.html?id=...`.
4. Abra `admin.html` para editar o catálogo (uso interno); as páginas públicas leem os mesmos dados.

## Observação técnica

Os produtos são persistidos no `localStorage` com a chave `gt_products_v5`.
Isso permite editar sem backend, mantendo a estrutura pronta para migrar para Firebase ou Supabase no futuro.
