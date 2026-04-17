(function () {
  const C = window.GT_CatalogCore;
  if (!C) return;

  const { readProducts, formatBRL, productDetailHref } = C;

  const FEATURED_COUNT = 6;
  const testimonials = [
    {
      text: "Qualidade premium em cada pedido. Os protocolos chegaram exatamente como esperado e com atendimento extremamente profissional.",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
      name: "Carolina M.",
      role: "Atleta amadora",
    },
    {
      text: "A curadoria da GT trouxe previsibilidade para meus ciclos. Excelente procedência e suporte consultivo em toda a jornada.",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80",
      name: "Rafael P.",
      role: "Coach de performance",
    },
    {
      text: "Conseguimos padronizar protocolos com muito mais segurança. O catálogo é claro e a ficha técnica ajuda bastante na decisão.",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
      name: "Ana Luiza S.",
      role: "Profissional da saúde",
    },
    {
      text: "Entrega consistente e comunicação rápida. A experiência toda passa confiança de marca premium de verdade.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
      name: "Bruno T.",
      role: "Empreendedor fitness",
    },
    {
      text: "O nível de qualidade é acima da média. A galeria e as características no site deixaram tudo muito objetivo e transparente.",
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=120&q=80",
      name: "Mariana C.",
      role: "Cliente recorrente",
    },
    {
      text: "Minha equipe ganhou tempo no processo de escolha. Conteúdo técnico e atendimento consultivo realmente fazem diferença.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
      name: "Felipe A.",
      role: "Gestor de clínica",
    },
    {
      text: "A GT combina performance com credibilidade. Hoje é nossa referência para produtos de alta exigência.",
      image:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=120&q=80",
      name: "Patricia R.",
      role: "Nutricionista esportiva",
    },
    {
      text: "Visual premium, informações completas e execução impecável. O padrão percebido é alto do começo ao fim.",
      image:
        "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=120&q=80",
      name: "Lucas D.",
      role: "Consultor de bem-estar",
    },
    {
      text: "O suporte é muito acima do esperado. Sempre rápidos e precisos para recomendar as melhores opções para cada objetivo.",
      image:
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=120&q=80",
      name: "Juliana V.",
      role: "Personal trainer",
    },
  ];

  function renderFeatured() {
    const grid = document.getElementById("featuredProducts");
    if (!grid) return;

    const products = readProducts();
    const slice = products.slice(0, FEATURED_COUNT);

    grid.innerHTML = "";
    slice.forEach((product) => {
      const thumb = product.images[0];
      const card = document.createElement("article");
      const nudgedCoverClass = product.id === "gt-p014" ? " product-card--cover-up" : "";
      card.className = `product-card product-card--clickable product-card--compact${nudgedCoverClass}`;
      card.innerHTML = `
        <a class="product-card__cover" href="${productDetailHref(product.id)}">
          <img src="${thumb}" alt="" loading="lazy" width="640" height="360">
        </a>
        <div class="product-card__body">
          <div class="product-top">
            <span class="badge">${product.badge}</span>
          </div>
          <h3><a href="${productDetailHref(product.id)}">${product.name}</a></h3>
          <p class="product-meta">${product.dosage} · <span class="product-price">${formatBRL(product.price)}</span></p>
          <div class="product-card__actions">
            <a class="btn btn-primary" href="${productDetailHref(product.id)}">Ver produto</a>
            <button type="button" class="btn btn-outline" data-add-cart="${product.id}">Adicionar ao carrinho</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function renderTestimonialColumn(targetId, items, durationSeconds) {
    const col = document.getElementById(targetId);
    if (!col) return;

    col.style.setProperty("--testimonials-duration", `${durationSeconds}s`);

    const duplicated = items.concat(items);
    const scroller = document.createElement("div");
    scroller.className = "testimonials-column__scroller";

    duplicated.forEach((item) => {
      const card = document.createElement("article");
      card.className = "testimonial-card";
      card.innerHTML = `
        <p class="testimonial-card__text">${item.text}</p>
        <div class="testimonial-card__author">
          <img src="${item.image}" alt="${item.name}" width="40" height="40" loading="lazy">
          <div>
            <p class="testimonial-card__name">${item.name}</p>
            <p class="testimonial-card__role">${item.role}</p>
          </div>
        </div>
      `;
      scroller.appendChild(card);
    });

    col.innerHTML = "";
    col.appendChild(scroller);
  }

  function renderTestimonials() {
    const first = testimonials.slice(0, 3);
    const second = testimonials.slice(3, 6);
    const third = testimonials.slice(6, 9);

    renderTestimonialColumn("testimonialsCol1", first, 15);
    renderTestimonialColumn("testimonialsCol2", second, 19);
    renderTestimonialColumn("testimonialsCol3", third, 17);
  }

  renderFeatured();
  renderTestimonials();
})();
