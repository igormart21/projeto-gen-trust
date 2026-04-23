(function () {
  const STORAGE_KEY = "gt_locale";
  const ALLOWED = ["pt", "en", "es"];
  const FLAG = {
    pt: "https://flagcdn.com/w40/br.png",
    es: "https://flagcdn.com/w40/es.png",
    en: "https://flagcdn.com/w40/gb.png"
  };

  const STRINGS = {
    pt: {
      nav_home: "Início",
      nav_catalog: "Catálogo",
      nav_features: "Diferenciais",
      nav_about: "Sobre",
      nav_calc: "Calculadora",
      a11y_open_menu: "Abrir menu",
      a11y_close_menu: "Fechar menu",
      a11y_lang_group: "Idioma do site",
      lang_pt: "Português",
      lang_en: "English",
      lang_es: "Español",
      page_home_title: "GT — GenTrust | Performance avançada",
      page_home_desc:
        "GT GenTrust — Catálogo premium de peptídeos e protocolos de alta performance com padrão internacional.",
      page_cat_title: "Catálogo | GT — GenTrust",
      page_cat_desc: "Catálogo completo GenTrust — peptídeos, hormônios e medicamentos com dosagem e preço.",
      page_product_title: "Produto | GT — GenTrust",
      page_product_desc: "Ficha do produto GenTrust — imagens, características e compra via WhatsApp.",
      page_calc_title: "Calculadora de doses | GT — GenTrust",
      page_calc_desc:
        "Ferramenta educativa para conversão entre mg, ml e UI (seringa U-100). Uso informativo — não substitui orientação médica.",
      calc_insulin_unit: "UI",
      calc_hero_eyebrow: "Ferramenta educativa",
      calc_h1: "Calculadora de doses",
      calc_lead:
        "Conversão entre <strong>mg</strong>, <strong>ml</strong> e <strong>Unidades Internacionais (UI)</strong> para soluções com seringa <strong>U-100</strong> (100 UI = 1 ml). Baseada apenas na matemática da concentração que você informar.",
      calc_conc_title: "Configure a concentração",
      calc_conc_help: "Informe quantos mg do princípio ativo existem em quantos ml de solução.",
      calc_per: "por",
      calc_unit_mg: "mg",
      calc_unit_ml: "ml",
      calc_conc_out_none: "Concentração: —",
      calc_conc_prefix: "Concentração:",
      calc_dose_title: "Dose desejada",
      calc_dose_help: "Escolha a unidade e informe o valor. As demais unidades são calculadas automaticamente.",
      calc_seg_aria: "Unidade da dose",
      calc_val_mg: "Valor (mg)",
      calc_val_ui: "Valor (UI)",
      calc_val_ml: "Valor (ml)",
      calc_seg_ui: "UI",
      calc_syringe_title: "Seringa interativa U-100",
      calc_syringe_hint: "1 ml = 100 UI · arraste o controle ou clique na escala",
      calc_range_aria: "Ajustar dose em UI na seringa U-100 (0 a 100 UI)",
      calc_live_none: "Dose atual: —",
      calc_live_line: "Dose atual: {{mg}} mg = {{ui}} {{unit}} = {{ml}} ml",
      calc_stat_mg: "Dose (mg)",
      calc_stat_ui: "UI na seringa",
      calc_stat_ml: "Volume (ml)",
      calc_stat_pct: "% da seringa (100 UI)",
      calc_btn_clear: "Limpar",
      calc_btn_copy: "Copiar resumo",
      calc_btn_example: "Ver exemplo",
      calc_disclaimer_title: "Aviso importante",
      calc_disclaimer_p:
        "Este conteúdo e a ferramenta têm finalidade exclusivamente <strong>educativa e informativa</strong>. Não substituem consulta, diagnóstico, exames, laudos ou tratamento. Decisões clínicas exigem avaliação presencial e análise individualizada por profissionais habilitados. Para qualquer conduta, consulte seu médico.",
      calc_copy_invalid: "Preencha concentração e dose válidas.",
      calc_copy_ok: "Resumo copiado para a área de transferência.",
      calc_copy_fail: "Não foi possível copiar automaticamente. Selecione e copie manualmente.",
      calc_copy_header: "GT GenTrust — Resumo da calculadora de doses (educativo)",
      calc_copy_conc:
        "Concentração: {{c}} mg/ml ({{a}} mg / {{b}} ml)",
      calc_copy_dose: "Dose: {{mg}} mg | {{ui}} {{unit}} | {{ml}} ml",
      calc_copy_vis_over: "Indicador visual U-100 (1 ml): {{p}}%+ (dose total {{ui}} {{unit}})",
      calc_copy_vis_ok: "Indicador visual U-100 (1 ml): {{p}}% do volume de 1 ml (100 {{unit}})",
      calc_copy_edu: "Uso apenas educativo. Não substitui orientação profissional.",
      calc_cap_note:
        "Dose total de {{ui}} {{unit}} ultrapassa 100 {{unit}} (1 ml) na seringa U-100. O mostrador permanece no máximo (100%) — use os campos numéricos para doses maiores.",
      hero_eyebrow: "Biotecnologia de performance",
      hero_title: "Produtos premium selecionados para quem exige performance",
      hero_sub:
        "Peptídeos e protocolos de alta performance com padrão internacional. Curadoria premium para quem busca resultados acima do comum.",
      hero_cta: "Ver catálogo completo",
      feat_eyebrow: "Portfólio premium",
      feat_title: "Conheça nossa linha em destaque",
      feat_cta: "Abrir catálogo completo",
      diff_eyebrow: "Diferenciais GT",
      diff_title: "Confiança, ciência e execução global",
      diff1_t: "Alta pureza e procedência",
      diff1_p: "Produtos com padrão farmacêutico internacional e rastreabilidade.",
      diff2_t: "Protocolos otimizados",
      diff2_p: "Estruturas focadas em performance, recomposição e recuperação.",
      diff3_t: "Qualidade controlada",
      diff3_p: "Curadoria técnica com foco em consistência de resultado.",
      diff4_t: "Atendimento global",
      diff4_p: "Operação com foco no Brasil e suporte para clientes internacionais.",
      about_eyebrow: "Sobre a GT — GenTrust",
      about_title: "Autoridade técnica para um mercado de alta exigência",
      about_p:
        "A GenTrust conecta tecnologia aplicada à performance humana com um processo de seleção rigoroso. Trabalhamos com peptídeos e linha hormonal de alto padrão, posicionamento premium e atendimento estratégico para quem busca excelência.",
      cta_eyebrow: "Acompanhamento consultivo",
      cta_title: "Fale com um especialista GT",
      cta_p:
        "Converse com nosso time e receba uma recomendação personalizada de produtos e protocolos para o seu objetivo de performance, com orientação clara e segura.",
      cta_btn: "Falar com especialista",
      footer_title: "GT GenTrust",
      footer_desc:
        "Catálogo premium de peptídeos e protocolos de alta performance. Curadoria técnica, atendimento consultivo e posicionamento global.",
      footer_desc_brief: "Catálogo premium de peptídeos e protocolos de alta performance.",
      footer_label: "Canais oficiais",
      footer_note: "Atendimento global com foco no Brasil",
      bc_home: "Início",
      bc_catalog: "Catálogo",
      cat_eyebrow: "Catálogo oficial",
      cat_h1: "Produtos GenTrust",
      cat_lead:
        "Clique em qualquer item para abrir a ficha completa com imagens, características e preço em reais. Use “Adicionar ao carrinho” e finalize pelo WhatsApp com o pedido já montado.",
      cat_trust1:
        "Pagamentos via PIX, cartão e cripto · Envio para todo o Brasil · Entrega segura e sigilosa · Atendimento VIP",
      cat_trust_fine:
        "Preços e disponibilidade confirmados no WhatsApp. Uso de peptídeos e hormônios apenas com orientação qualificada.",
      tbl_eyebrow: "Tabela de referência",
      tbl_h2: "Todos os itens",
      tbl_p: "Visão compacta; use a coluna Detalhes para abrir a página do produto.",
      th_product: "Produto",
      th_category: "Categoria",
      th_dose: "Dosagem",
      th_price: "Preço (R$)",
      th_summary: "Resumo",
      th_actions: "Ações",
      prod_footer_desc: "Curadoria técnica e atendimento consultivo.",
      prod_footer_back: "Voltar ao catálogo",
      prod_footer_wa: "WhatsApp",
      cat_all: "Todos",
      stock_low: "Estoque limitado",
      stock_on_request: "Sob consulta",
      btn_view_details: "Ver detalhes",
      btn_add_cart: "Adicionar ao carrinho",
      btn_view_product: "Ver produto",
      tbl_details: "Detalhes",
      tbl_add: "Adicionar",
      pd_add_cart: "Adicionar ao carrinho",
      pd_continue: "Continuar comprando",
      pd_specs: "Ficha técnica",
      pd_chars: "Características",
      dt_category: "Categoria",
      dt_dose: "Dosagem",
      dt_price: "Preço",
      dt_badge: "Badge",
      dt_focus: "Foco",
      dt_context: "Contexto",
      pd_gallery_aria: "Imagens do produto",
      nf_error: "Erro",
      nf_eyebrow: "Produto",
      nf_title: "Item não encontrado",
      nf_desc: "O link pode estar incorreto ou o produto foi removido do catálogo.",
      nf_btn: "Voltar ao catálogo",
      nf_title_doc: "Produto não encontrado | GT GenTrust",
      product_suffix: "— GT GenTrust",
      cart_open: "Abrir carrinho",
      cart_close: "Fechar carrinho",
      cart_title: "Carrinho",
      cart_total_lbl: "Total estimado",
      cart_checkout: "Finalizar no WhatsApp",
      cart_clear: "Esvaziar carrinho",
      cart_empty: "Seu carrinho está vazio. Adicione produtos nas páginas do catálogo.",
      cart_invalid: "Alguns itens não estão mais no catálogo e foram omitidos do total.",
      cart_toast: "Adicionado ao carrinho",
      cart_confirm_clear: "Esvaziar todo o carrinho?",
      cart_per_unit: "/ un.",
      cart_remove: "Remover item",
      cart_remove_short: "Remover",
      cart_dec: "Diminuir quantidade",
      cart_inc: "Aumentar quantidade"
    },
    en: {
      nav_home: "Home",
      nav_catalog: "Catalog",
      nav_features: "Why us",
      nav_about: "About",
      nav_calc: "Dose calculator",
      a11y_open_menu: "Open menu",
      a11y_close_menu: "Close menu",
      a11y_lang_group: "Site language",
      lang_pt: "Portuguese",
      lang_en: "English",
      lang_es: "Spanish",
      page_home_title: "GT — GenTrust | Advanced performance",
      page_home_desc:
        "GT GenTrust — Premium catalog of peptides and high-performance protocols with international-grade standards.",
      page_cat_title: "Catalog | GT — GenTrust",
      page_cat_desc: "Full GenTrust catalog — peptides, hormones and medicines with dosage and price.",
      page_product_title: "Product | GT — GenTrust",
      page_product_desc: "GenTrust product page — images, features and purchase via WhatsApp.",
      page_calc_title: "Dose calculator | GT — GenTrust",
      page_calc_desc:
        "Educational tool to convert mg, ml and IU (U-100 syringe). Informational only — not medical advice.",
      calc_insulin_unit: "IU",
      calc_hero_eyebrow: "Educational tool",
      calc_h1: "Dose calculator",
      calc_lead:
        "Convert <strong>mg</strong>, <strong>ml</strong> and <strong>international units (IU)</strong> for U-100 insulin syringe solutions (100 IU = 1 ml). Based only on the math of the concentration you enter.",
      calc_conc_title: "Set concentration",
      calc_conc_help: "Enter how many mg of active ingredient are in how many ml of solution.",
      calc_per: "per",
      calc_unit_mg: "mg",
      calc_unit_ml: "ml",
      calc_conc_out_none: "Concentration: —",
      calc_conc_prefix: "Concentration:",
      calc_dose_title: "Desired dose",
      calc_dose_help: "Pick a unit and enter the value. The other units are calculated automatically.",
      calc_seg_aria: "Dose unit",
      calc_val_mg: "Amount (mg)",
      calc_val_ui: "Amount (IU)",
      calc_val_ml: "Amount (ml)",
      calc_seg_ui: "IU",
      calc_syringe_title: "Interactive U-100 syringe",
      calc_syringe_hint: "1 ml = 100 IU · drag the slider or tap the scale",
      calc_range_aria: "Adjust dose in IU on U-100 syringe (0 to 100 IU)",
      calc_live_none: "Current dose: —",
      calc_live_line: "Current dose: {{mg}} mg = {{ui}} {{unit}} = {{ml}} ml",
      calc_stat_mg: "Dose (mg)",
      calc_stat_ui: "IU in syringe",
      calc_stat_ml: "Volume (ml)",
      calc_stat_pct: "% of syringe (100 IU)",
      calc_btn_clear: "Clear",
      calc_btn_copy: "Copy summary",
      calc_btn_example: "See example",
      calc_disclaimer_title: "Important notice",
      calc_disclaimer_p:
        "This content and tool are for <strong>educational and informational purposes only</strong>. They do not replace consultation, diagnosis, tests, reports or treatment. Clinical decisions require in-person evaluation and individualized analysis by licensed professionals. For any decision, consult your physician.",
      calc_copy_invalid: "Enter a valid concentration and dose.",
      calc_copy_ok: "Summary copied to the clipboard.",
      calc_copy_fail: "Could not copy automatically. Please select and copy manually.",
      calc_copy_header: "GT GenTrust — Dose calculator summary (educational)",
      calc_copy_conc: "Concentration: {{c}} mg/ml ({{a}} mg / {{b}} ml)",
      calc_copy_dose: "Dose: {{mg}} mg | {{ui}} {{unit}} | {{ml}} ml",
      calc_copy_vis_over: "U-100 (1 ml) visual gauge: {{p}}%+ (total dose {{ui}} {{unit}})",
      calc_copy_vis_ok: "U-100 (1 ml) visual gauge: {{p}}% of 1 ml volume (100 {{unit}})",
      calc_copy_edu: "Educational use only. Not a substitute for professional medical advice.",
      calc_cap_note:
        "A total dose of {{ui}} {{unit}} exceeds 100 {{unit}} (1 ml) in a U-100 syringe. The gauge stays at maximum (100%) — use the numeric fields for larger doses.",
      hero_eyebrow: "Performance biotechnology",
      hero_title: "Premium products for those who demand performance",
      hero_sub:
        "Peptides and high-performance protocols with international standards. Premium curation for above-average results.",
      hero_cta: "View full catalog",
      feat_eyebrow: "Premium portfolio",
      feat_title: "Explore our featured line",
      feat_cta: "Open full catalog",
      diff_eyebrow: "GT advantages",
      diff_title: "Trust, science and global execution",
      diff1_t: "High purity and provenance",
      diff1_p: "Products with international pharmaceutical-grade standards and traceability.",
      diff2_t: "Optimized protocols",
      diff2_p: "Structures focused on performance, recomposition and recovery.",
      diff3_t: "Controlled quality",
      diff3_p: "Technical curation focused on consistent outcomes.",
      diff4_t: "Global service",
      diff4_p: "Operations focused on Brazil with support for international clients.",
      about_eyebrow: "About GT — GenTrust",
      about_title: "Technical authority for a demanding market",
      about_p:
        "GenTrust connects human-performance technology with a rigorous selection process. We work with peptides and premium-grade hormone lines, premium positioning and strategic support for those seeking excellence.",
      cta_eyebrow: "Consultative support",
      cta_title: "Talk to a GT specialist",
      cta_p:
        "Speak with our team and receive a tailored recommendation of products and protocols for your performance goals, with clear and safe guidance.",
      cta_btn: "Contact specialist",
      footer_title: "GT GenTrust",
      footer_desc:
        "Premium catalog of peptides and high-performance protocols. Technical curation, consultative service and global positioning.",
      footer_desc_brief: "Premium catalog of peptides and high-performance protocols.",
      footer_label: "Official channels",
      footer_note: "Global service with a focus on Brazil",
      bc_home: "Home",
      bc_catalog: "Catalog",
      cat_eyebrow: "Official catalog",
      cat_h1: "GenTrust products",
      cat_lead:
        "Click any item to open the full sheet with images, features and prices in BRL. Use “Add to cart” and complete your order via WhatsApp with everything ready.",
      cat_trust1:
        "Payments via PIX, card and crypto · Shipping across Brazil · Safe, discreet delivery · VIP support",
      cat_trust_fine:
        "Prices and availability confirmed on WhatsApp. Use of peptides and hormones only with qualified guidance.",
      tbl_eyebrow: "Reference table",
      tbl_h2: "All items",
      tbl_p: "Compact view; use the Details column to open the product page.",
      th_product: "Product",
      th_category: "Category",
      th_dose: "Dosage",
      th_price: "Price (BRL)",
      th_summary: "Summary",
      th_actions: "Actions",
      prod_footer_desc: "Technical curation and consultative support.",
      prod_footer_back: "Back to catalog",
      prod_footer_wa: "WhatsApp",
      cat_all: "All",
      stock_low: "Limited stock",
      stock_on_request: "On request",
      btn_view_details: "View details",
      btn_add_cart: "Add to cart",
      btn_view_product: "View product",
      tbl_details: "Details",
      tbl_add: "Add",
      pd_add_cart: "Add to cart",
      pd_continue: "Keep shopping",
      pd_specs: "Datasheet",
      pd_chars: "Features",
      dt_category: "Category",
      dt_dose: "Dosage",
      dt_price: "Price",
      dt_badge: "Badge",
      dt_focus: "Focus",
      dt_context: "Context",
      pd_gallery_aria: "Product images",
      nf_error: "Error",
      nf_eyebrow: "Product",
      nf_title: "Product not found",
      nf_desc: "The link may be incorrect or the product was removed from the catalog.",
      nf_btn: "Back to catalog",
      nf_title_doc: "Product not found | GT GenTrust",
      product_suffix: "— GT GenTrust",
      cart_open: "Open cart",
      cart_close: "Close cart",
      cart_title: "Cart",
      cart_total_lbl: "Estimated total",
      cart_checkout: "Checkout on WhatsApp",
      cart_clear: "Empty cart",
      cart_empty: "Your cart is empty. Add products from the catalog pages.",
      cart_invalid: "Some items are no longer in the catalog and were omitted from the total.",
      cart_toast: "Added to cart",
      cart_confirm_clear: "Empty the entire cart?",
      cart_per_unit: "/ ea.",
      cart_remove: "Remove item",
      cart_remove_short: "Remove",
      cart_dec: "Decrease quantity",
      cart_inc: "Increase quantity"
    },
    es: {
      nav_home: "Inicio",
      nav_catalog: "Catálogo",
      nav_features: "Diferenciales",
      nav_about: "Nosotros",
      nav_calc: "Calculadora",
      a11y_open_menu: "Abrir menú",
      a11y_close_menu: "Cerrar menú",
      a11y_lang_group: "Idioma del sitio",
      lang_pt: "Portugués",
      lang_en: "Inglés",
      lang_es: "Español",
      page_home_title: "GT — GenTrust | Performance avanzada",
      page_home_desc:
        "GT GenTrust — Catálogo premium de péptidos y protocolos de alto rendimiento con estándar internacional.",
      page_cat_title: "Catálogo | GT — GenTrust",
      page_cat_desc: "Catálogo completo GenTrust — péptidos, hormonas y medicamentos con dosificación y precio.",
      page_product_title: "Producto | GT — GenTrust",
      page_product_desc: "Ficha del producto GenTrust — imágenes, características y compra vía WhatsApp.",
      page_calc_title: "Calculadora de dosis | GT — GenTrust",
      page_calc_desc:
        "Herramienta educativa para convertir mg, ml y UI (jeringa U-100). Solo informativa — no sustituye orientación médica.",
      calc_insulin_unit: "UI",
      calc_hero_eyebrow: "Herramienta educativa",
      calc_h1: "Calculadora de dosis",
      calc_lead:
        "Conversión entre <strong>mg</strong>, <strong>ml</strong> y <strong>Unidades Internacionales (UI)</strong> para soluciones con jeringa <strong>U-100</strong> (100 UI = 1 ml). Basada solo en la matemática de la concentración que indiques.",
      calc_conc_title: "Configura la concentración",
      calc_conc_help: "Indica cuántos mg de principio activo hay en cuántos ml de solución.",
      calc_per: "por",
      calc_unit_mg: "mg",
      calc_unit_ml: "ml",
      calc_conc_out_none: "Concentración: —",
      calc_conc_prefix: "Concentración:",
      calc_dose_title: "Dosis deseada",
      calc_dose_help: "Elige la unidad e ingresa el valor. Las demás unidades se calculan automáticamente.",
      calc_seg_aria: "Unidad de la dosis",
      calc_val_mg: "Valor (mg)",
      calc_val_ui: "Valor (UI)",
      calc_val_ml: "Valor (ml)",
      calc_seg_ui: "UI",
      calc_syringe_title: "Jeringa interactiva U-100",
      calc_syringe_hint: "1 ml = 100 UI · arrastra el control o haz clic en la escala",
      calc_range_aria: "Ajustar dosis en UI en jeringa U-100 (0 a 100 UI)",
      calc_live_none: "Dosis actual: —",
      calc_live_line: "Dosis actual: {{mg}} mg = {{ui}} {{unit}} = {{ml}} ml",
      calc_stat_mg: "Dosis (mg)",
      calc_stat_ui: "UI en la jeringa",
      calc_stat_ml: "Volumen (ml)",
      calc_stat_pct: "% de la jeringa (100 UI)",
      calc_btn_clear: "Limpiar",
      calc_btn_copy: "Copiar resumen",
      calc_btn_example: "Ver ejemplo",
      calc_disclaimer_title: "Aviso importante",
      calc_disclaimer_p:
        "Este contenido y la herramienta tienen finalidad exclusivamente <strong>educativa e informativa</strong>. No sustituyen consulta, diagnóstico, exámenes, informes o tratamiento. Las decisiones clínicas exigen evaluación presencial y análisis individualizado por profesionales habilitados. Para cualquier conducta, consulte a su médico.",
      calc_copy_invalid: "Completa una concentración y dosis válidas.",
      calc_copy_ok: "Resumen copiado al portapapeles.",
      calc_copy_fail: "No se pudo copiar automáticamente. Seleccione y copie manualmente.",
      calc_copy_header: "GT GenTrust — Resumen de la calculadora de dosis (educativo)",
      calc_copy_conc: "Concentración: {{c}} mg/ml ({{a}} mg / {{b}} ml)",
      calc_copy_dose: "Dosis: {{mg}} mg | {{ui}} {{unit}} | {{ml}} ml",
      calc_copy_vis_over: "Indicador visual U-100 (1 ml): {{p}}%+ (dosis total {{ui}} {{unit}})",
      calc_copy_vis_ok: "Indicador visual U-100 (1 ml): {{p}}% del volumen de 1 ml (100 {{unit}})",
      calc_copy_edu: "Solo uso educativo. No sustituye orientación profesional.",
      calc_cap_note:
        "La dosis total de {{ui}} {{unit}} supera 100 {{unit}} (1 ml) en una jeringa U-100. El indicador permanece al máximo (100%) — use los campos numéricos para dosis mayores.",
      hero_eyebrow: "Biotecnología de performance",
      hero_title: "Productos premium para quien exige rendimiento",
      hero_sub:
        "Péptidos y protocolos de alto rendimiento con estándar internacional. Curaduría premium para resultados por encima de lo común.",
      hero_cta: "Ver catálogo completo",
      feat_eyebrow: "Portafolio premium",
      feat_title: "Conoce nuestra línea destacada",
      feat_cta: "Abrir catálogo completo",
      diff_eyebrow: "Diferenciales GT",
      diff_title: "Confianza, ciencia y ejecución global",
      diff1_t: "Alta pureza y procedencia",
      diff1_p: "Productos con estándar farmacéutico internacional y trazabilidad.",
      diff2_t: "Protocolos optimizados",
      diff2_p: "Estructuras enfocadas en performance, recomposición y recuperación.",
      diff3_t: "Calidad controlada",
      diff3_p: "Curaduría técnica con foco en consistencia de resultados.",
      diff4_t: "Atención global",
      diff4_p: "Operación con foco en Brasil y soporte para clientes internacionales.",
      about_eyebrow: "Sobre GT — GenTrust",
      about_title: "Autoridad técnica para un mercado exigente",
      about_p:
        "GenTrust conecta tecnología aplicada al rendimiento humano con un proceso de selección riguroso. Trabajamos con péptidos y línea hormonal de alto estándar, posicionamiento premium y atención estratégica para quien busca excelencia.",
      cta_eyebrow: "Acompañamiento consultivo",
      cta_title: "Habla con un especialista GT",
      cta_p:
        "Habla con nuestro equipo y recibe una recomendación personalizada de productos y protocolos para tu objetivo de performance, con orientación clara y segura.",
      cta_btn: "Hablar con especialista",
      footer_title: "GT GenTrust",
      footer_desc:
        "Catálogo premium de péptidos y protocolos de alto rendimiento. Curaduría técnica, atención consultiva y posicionamiento global.",
      footer_desc_brief: "Catálogo premium de péptidos y protocolos de alto rendimiento.",
      footer_label: "Canales oficiales",
      footer_note: "Atención global con foco en Brasil",
      bc_home: "Inicio",
      bc_catalog: "Catálogo",
      cat_eyebrow: "Catálogo oficial",
      cat_h1: "Productos GenTrust",
      cat_lead:
        "Haz clic en cualquier ítem para abrir la ficha completa con imágenes, características y precio en reales. Usa “Añadir al carrito” y finaliza por WhatsApp con el pedido listo.",
      cat_trust1:
        "Pagos vía PIX, tarjeta y cripto · Envío a todo Brasil · Entrega segura y discreta · Atención VIP",
      cat_trust_fine:
        "Precios y disponibilidad confirmados en WhatsApp. Uso de péptidos y hormonas solo con orientación calificada.",
      tbl_eyebrow: "Tabla de referencia",
      tbl_h2: "Todos los ítems",
      tbl_p: "Vista compacta; usa la columna Detalles para abrir la página del producto.",
      th_product: "Producto",
      th_category: "Categoría",
      th_dose: "Dosificación",
      th_price: "Precio (R$)",
      th_summary: "Resumen",
      th_actions: "Acciones",
      prod_footer_desc: "Curaduría técnica y atención consultiva.",
      prod_footer_back: "Volver al catálogo",
      prod_footer_wa: "WhatsApp",
      cat_all: "Todos",
      stock_low: "Stock limitado",
      stock_on_request: "Bajo consulta",
      btn_view_details: "Ver detalles",
      btn_add_cart: "Añadir al carrito",
      btn_view_product: "Ver producto",
      tbl_details: "Detalles",
      tbl_add: "Añadir",
      pd_add_cart: "Añadir al carrito",
      pd_continue: "Seguir comprando",
      pd_specs: "Ficha técnica",
      pd_chars: "Características",
      dt_category: "Categoría",
      dt_dose: "Dosificación",
      dt_price: "Precio",
      dt_badge: "Badge",
      dt_focus: "Foco",
      dt_context: "Contexto",
      pd_gallery_aria: "Imágenes del producto",
      nf_error: "Error",
      nf_eyebrow: "Producto",
      nf_title: "Producto no encontrado",
      nf_desc: "El enlace puede ser incorrecto o el producto fue retirado del catálogo.",
      nf_btn: "Volver al catálogo",
      nf_title_doc: "Producto no encontrado | GT GenTrust",
      product_suffix: "— GT GenTrust",
      cart_open: "Abrir carrito",
      cart_close: "Cerrar carrito",
      cart_title: "Carrito",
      cart_total_lbl: "Total estimado",
      cart_checkout: "Finalizar en WhatsApp",
      cart_clear: "Vaciar carrito",
      cart_empty: "Tu carrito está vacío. Añade productos desde las páginas del catálogo.",
      cart_invalid: "Algunos ítems ya no están en el catálogo y fueron omitidos del total.",
      cart_toast: "Añadido al carrito",
      cart_confirm_clear: "¿Vaciar todo el carrito?",
      cart_per_unit: "/ ud.",
      cart_remove: "Quitar ítem",
      cart_remove_short: "Quitar",
      cart_dec: "Disminuir cantidad",
      cart_inc: "Aumentar cantidad"
    }
  };

  function normalizeLang(lang) {
    const l = String(lang || "").toLowerCase().slice(0, 2);
    return ALLOWED.includes(l) ? l : "pt";
  }

  function getLang() {
    try {
      return normalizeLang(localStorage.getItem(STORAGE_KEY));
    } catch {
      return "pt";
    }
  }

  function t(key) {
    const lang = getLang();
    const table = STRINGS[lang] || STRINGS.pt;
    return Object.prototype.hasOwnProperty.call(table, key) ? table[key] : STRINGS.pt[key] || key;
  }

  function setHtmlLang(lang) {
    const l = normalizeLang(lang);
    document.documentElement.lang = l === "pt" ? "pt-BR" : l === "es" ? "es" : "en";
  }

  function applyMeta() {
    const page = document.body ? document.body.getAttribute("data-i18n-page") : null;
    const lang = getLang();
    const table = STRINGS[lang] || STRINGS.pt;

    if (page === "home") {
      if (table.page_home_title) document.title = table.page_home_title;
      const m = document.querySelector('meta[name="description"]');
      if (m && table.page_home_desc) m.setAttribute("content", table.page_home_desc);
    } else if (page === "catalog") {
      if (table.page_cat_title) document.title = table.page_cat_title;
      const m = document.querySelector('meta[name="description"]');
      if (m && table.page_cat_desc) m.setAttribute("content", table.page_cat_desc);
    } else if (page === "product") {
      if (table.page_product_title) document.title = table.page_product_title;
      const m = document.querySelector('meta[name="description"]');
      if (m && table.page_product_desc) m.setAttribute("content", table.page_product_desc);
    } else if (page === "calculator") {
      if (table.page_calc_title) document.title = table.page_calc_title;
      const m = document.querySelector('meta[name="description"]');
      if (m && table.page_calc_desc) m.setAttribute("content", table.page_calc_desc);
    }
  }

  function applyDom() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      const val = t(key);
      if (el.dataset.i18nHtml === "true") el.innerHTML = val;
      else el.textContent = val;
    });
    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      const raw = el.getAttribute("data-i18n-attr");
      if (!raw) return;
      const parts = raw.split("|");
      if (parts.length !== 2) return;
      const attr = parts[0].trim();
      const key = parts[1].trim();
      if (!attr || !key) return;
      el.setAttribute(attr, t(key));
    });
  }

  function updateLangButtons() {
    const lang = getLang();
    document.querySelectorAll(".lang-btn[data-lang]").forEach((btn) => {
      const b = /** @type {HTMLElement} */ (btn);
      const is = b.getAttribute("data-lang") === lang;
      b.setAttribute("aria-pressed", is ? "true" : "false");
      b.classList.toggle("lang-btn--active", is);
    });
  }

  function mountLangSwitcher() {
    const nav = document.getElementById("topbarNav");
    if (!nav || nav.querySelector(".lang-switcher")) return;

    const group = document.createElement("div");
    group.className = "lang-switcher";
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", t("a11y_lang_group"));

    function btn(lang, labelKey) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "lang-btn";
      b.setAttribute("data-lang", lang);
      b.setAttribute("title", t(labelKey));
      b.setAttribute("aria-label", t(labelKey));
      const img = document.createElement("img");
      img.src = FLAG[lang];
      img.alt = "";
      img.width = 20;
      img.height = 15;
      img.loading = "lazy";
      img.decoding = "async";
      b.appendChild(img);
      b.addEventListener("click", () => {
        setLang(lang);
      });
      return b;
    }

    group.appendChild(btn("pt", "lang_pt"));
    group.appendChild(btn("es", "lang_es"));
    group.appendChild(btn("en", "lang_en"));
    nav.appendChild(group);
    updateLangButtons();
  }

  function setLang(lang) {
    const next = normalizeLang(lang);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    setHtmlLang(next);
    applyMeta();
    applyDom();
    const g = document.querySelector(".lang-switcher");
    if (g) g.setAttribute("aria-label", t("a11y_lang_group"));
    updateLangButtons();
    window.dispatchEvent(new CustomEvent("gt:locale", { detail: { lang: next } }));
  }

  function init() {
    setHtmlLang(getLang());
    mountLangSwitcher();
    applyMeta();
    applyDom();
    updateLangButtons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.GT_i18n = {
    getLang,
    setLang,
    t,
    init,
    normalizeLang
  };
})();
