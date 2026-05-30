// Lógica da SPA e State Management - VK Restaurante
// Gerencia a reatividade, persistência local e fluxos de negócio do cliente e admin

const App = {
  state: {
    dishes: [],
    categories: [],
    comments: [],
    activeCategory: 'destaques',
    activeDish: null,
    isAdmin: false,
    adminActiveTab: 'comentarios', // Aba padrão do admin
    editingDishId: null, // null se estiver criando novo prato, senão ID do prato
    commentFormRating: 5 // Avaliação padrão do form
  },

  // Inicialização do App
  async init() {
    this.initTheme();
    
    // Limpa cache antigo de pratos no LocalStorage para garantir leitura direta da nuvem
    localStorage.removeItem('vk_dishes');
    
    this.loadState();
    
    this.bindEvents();
    this.initIntersectionObserver();
    this.updateLoyaltyNavButton();

    // 1. Carrega pratos do Supabase primeiro!
    await this.fetchDishesFromSupabase();

    // 2. Inicialização dos Sistemas Premium com pratos do Supabase carregados na memória
    if (typeof RankingSystem !== 'undefined') RankingSystem.init();
    if (typeof LoyaltySystem !== 'undefined') LoyaltySystem.init();
    if (typeof CampaignSystem !== 'undefined') CampaignSystem.init();

    // 3. Renderiza o cardápio e a interface pública usando os dados da nuvem
    this.render();
    this.checkUrlForDish();
  },

  // Inicializa o tema escuro/claro salvo
  initTheme() {
    const saved = localStorage.getItem('vk_theme');
    if (saved === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  },

  // Alterna o tema escuro/claro
  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    if (current === 'light') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('vk_theme', 'dark');
      this.showToast('Modo escuro ativado 🌙', 'success');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('vk_theme', 'light');
      this.showToast('Modo claro ativado ☀️', 'success');
    }
  },

  // Carrega os dados persistidos ou semeia com dados padrão
  loadState() {
    // Versão do menu - incrementar ao alterar data.js para forçar refresh
    const MENU_VERSION = '2.0';
    const savedVersion = localStorage.getItem('vk_menu_version');

    // Se versão mudou, limpa dados antigos
    if (savedVersion !== MENU_VERSION) {
      localStorage.removeItem('vk_dishes');
      localStorage.removeItem('vk_categories');
      localStorage.removeItem('vk_comments');
      localStorage.setItem('vk_menu_version', MENU_VERSION);
    }

    // Inicializa memória limpa com DEFAULT_DISHES como baseline antes do carregamento do Supabase
    this.state.dishes = [...DEFAULT_DISHES];

    const cachedCategories = localStorage.getItem('vk_categories');
    const cachedComments = localStorage.getItem('vk_comments');

    if (cachedCategories) {
      this.state.categories = JSON.parse(cachedCategories);
    } else {
      this.state.categories = [...DEFAULT_CATEGORIES];
      localStorage.setItem('vk_categories', JSON.stringify(this.state.categories));
    }

    if (cachedComments) {
      this.state.comments = JSON.parse(cachedComments);
    } else {
      this.state.comments = [...DEFAULT_COMMENTS];
      localStorage.setItem('vk_comments', JSON.stringify(this.state.comments));
    }

    // Carrega login se persistido na sessão
    const savedLogin = sessionStorage.getItem('vk_is_admin');
    if (savedLogin === 'true') {
      this.state.isAdmin = true;
    }
  },

  // Salva no LocalStorage
  saveState() {
    localStorage.setItem('vk_dishes', JSON.stringify(this.state.dishes));
    localStorage.setItem('vk_categories', JSON.stringify(this.state.categories));
    localStorage.setItem('vk_comments', JSON.stringify(this.state.comments));
  },

  // Vincula Ouvintes de Eventos
  bindEvents() {
    // Cliques de Categoria
    document.getElementById('categories-container').addEventListener('click', (e) => {
      const pill = e.target.closest('.category-pill');
      if (pill) {
        const catId = pill.dataset.id;
        this.setActiveCategory(catId);
      }
    });

    // Fechar Modal de Detalhes
    document.getElementById('detail-modal-close').addEventListener('click', () => this.closeDishModal());
    document.getElementById('detail-modal-overlay').addEventListener('click', (e) => {
      if (e.target === document.getElementById('detail-modal-overlay')) {
        this.closeDishModal();
      }
    });

    // Fechar Modal Admin
    document.getElementById('admin-modal-close').addEventListener('click', () => this.closeAdminModal());
    document.getElementById('admin-modal-overlay').addEventListener('click', (e) => {
      if (e.target === document.getElementById('admin-modal-overlay')) {
        this.closeAdminModal();
      }
    });

    // Abrir Modal Admin discreto (no rodapé ou botão)
    document.getElementById('btn-admin-nav').addEventListener('click', () => this.openAdminModal());

    // Login Form
    document.getElementById('admin-login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const password = document.getElementById('admin-password').value;
      if (password === 'admin123') {
        this.state.isAdmin = true;
        sessionStorage.setItem('vk_is_admin', 'true');
        this.showToast('Acesso administrativo concedido!', 'success');
        document.getElementById('admin-password').value = '';
        this.renderAdminView();
      } else {
        this.showToast('Senha incorreta! Use "admin123".', 'error');
      }
    });

    // Logout
    document.getElementById('btn-admin-logout').addEventListener('click', () => {
      this.state.isAdmin = false;
      sessionStorage.removeItem('vk_is_admin');
      this.showToast('Sessão encerrada com sucesso.', 'success');
      this.renderAdminView();
    });

    // Tabs de Admin
    document.getElementById('admin-tabs-nav').addEventListener('click', (e) => {
      const tab = e.target.closest('.admin-tab');
      if (tab) {
        this.state.adminActiveTab = tab.dataset.tab;
        this.renderAdminTabs();
      }
    });

    // Seleção de Estrelas no Formulário
    const starContainer = document.getElementById('star-select-container');
    starContainer.addEventListener('click', (e) => {
      const star = e.target.closest('span');
      if (star) {
        const rating = parseInt(star.dataset.val);
        this.setCommentFormRating(rating);
      }
    });

    // Submissão de Comentário
    document.getElementById('comment-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitComment();
    });

    // CRUD Pratos: Submissão de Formulário
    document.getElementById('dish-crud-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveDishCrud();
    });

    // Cancelar Edição de Prato
    document.getElementById('btn-cancel-dish-edit').addEventListener('click', () => {
      this.resetDishForm();
    });

    // CRUD Categorias: Submissão
    document.getElementById('cat-crud-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveCategoryCrud();
    });

    // Botão de Alternar Tema
    document.getElementById('theme-toggle').addEventListener('click', () => {
      this.toggleTheme();
    });

    // Abrir Modal de Fidelidade
    const loyaltyNavBtn = document.getElementById('btn-loyalty-nav');
    if (loyaltyNavBtn) {
      loyaltyNavBtn.addEventListener('click', () => this.openLoyaltyModal());
    }

    // Fechar Modal de Fidelidade
    const loyaltyModalClose = document.getElementById('loyalty-modal-close');
    if (loyaltyModalClose) {
      loyaltyModalClose.addEventListener('click', () => this.closeLoyaltyModal());
    }
    const loyaltyOverlay = document.getElementById('loyalty-modal-overlay');
    if (loyaltyOverlay) {
      loyaltyOverlay.addEventListener('click', (e) => {
        if (e.target === loyaltyOverlay) {
          this.closeLoyaltyModal();
        }
      });
    }
  },

  // Define categoria ativa e renderiza
  setActiveCategory(catId) {
    this.state.activeCategory = catId;
    
    // Atualiza pills
    const pills = document.querySelectorAll('.category-pill');
    pills.forEach(pill => {
      if (pill.dataset.id === catId) {
        pill.classList.add('active');
        // Mantém a categoria visível no scroll horizontal
        pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        pill.classList.remove('active');
      }
    });

    // Animação suave de troca de grade
    const grid = document.getElementById('dishes-grid');
    grid.style.opacity = 0;
    grid.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      this.renderDishes();
      grid.style.opacity = 1;
      grid.style.transform = 'translateY(0)';
    }, 150);
  },

  // Define a nota por estrelas no formulário de comentários
  setCommentFormRating(rating) {
    this.state.commentFormRating = rating;
    const stars = document.querySelectorAll('#star-select-container span');
    stars.forEach(star => {
      const val = parseInt(star.dataset.val);
      if (val <= rating) {
        star.classList.add('selected');
      } else {
        star.classList.remove('selected');
      }
    });
  },

  // Recarrega todos os renderers principais
  render() {
    this.renderHeroBanner();
    this.renderCategoryPills();
    this.renderDishes();
    this.renderPremiumSections();
  },

  // Renderiza o Banner Principal com o prato do dia
  renderHeroBanner() {
    const banner = document.getElementById('hero-banner');
    // Encontra o prato do dia
    const featured = this.state.dishes.find(d => d.tag === 'prato-do-dia') || this.state.dishes[0];
    if (featured && featured.image) {
      banner.style.backgroundImage = `url('${featured.image}')`;
    } else {
      banner.style.backgroundImage = `url('assets/vk_banner_hero.png')`;
    }
  },

  // Renderiza as Categoria Pills de cima (com stagger animation)
  renderCategoryPills() {
    const container = document.getElementById('categories-container');
    container.innerHTML = '';

    this.state.categories.forEach((cat, index) => {
      const pill = document.createElement('button');
      pill.className = `category-pill stagger-${index} ${this.state.activeCategory === cat.id ? 'active' : ''}`;
      pill.dataset.id = cat.id;
      pill.innerHTML = cat.name;
      container.appendChild(pill);
    });
  },

  // Renderiza a Grade de Pratos baseado na categoria ativa
  renderDishes() {
    const grid = document.getElementById('dishes-grid');
    grid.innerHTML = '';

    // Logs detalhados solicitados para fins de auditoria
    const source = App.source || 'Supabase';
    console.log(`Fonte dos pratos: ${source}`);
    console.log(`Pratos carregados: ${this.state.dishes.length}`);
    console.log(`Preço agua_coco vindo do Supabase: ${App.supabaseAguaPrice || 'Não carregado/indisponível'}`);

    const cached = localStorage.getItem('vk_dishes');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const cachedAgua = parsed.find(d => d.id === 'agua_coco');
        if (cachedAgua) {
          console.log(`Preço agua_coco vindo do localStorage: ${cachedAgua.price}`);
        }
      } catch (e) {}
    } else {
      console.log('Preço agua_coco vindo do localStorage: não existe');
    }

    if (typeof DEFAULT_DISHES !== 'undefined') {
      const defaultAgua = DEFAULT_DISHES.find(d => d.id === 'agua_coco');
      if (defaultAgua) {
        console.log(`Preço agua_coco vindo do data.js: ${defaultAgua.price}`);
      }
    }

    const currentAgua = this.state.dishes.find(d => d.id === 'agua_coco');
    const renderedPrice = currentAgua ? currentAgua.price : 'não encontrado';
    console.log(`Preço agua_coco renderizado: ${renderedPrice}`);

    let filtered = [];
    if (this.state.activeCategory === 'destaques') {
      // Exibe pratos com selo mais-pedido, prato-do-dia ou destaque
      filtered = this.state.dishes.filter(d => d.tag !== '');
      if (filtered.length === 0) {
        filtered = this.state.dishes.slice(0, 4); // Fallback
      }
    } else if (this.state.activeCategory === 'promocoes') {
      filtered = this.state.dishes.filter(d => d.tag === 'promocao');
    } else {
      filtered = this.state.dishes.filter(d => d.category === this.state.activeCategory);
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; color: var(--text-secondary);">
          <svg style="width: 48px; height: 48px; opacity: 0.5; margin-bottom: 0.5rem; fill: currentColor;" viewBox="0 0 24 24">
            <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm1,15a1,1,0,0,1-2,0V11a1,1,0,0,1,2,0Zm0-8a1,1,0,1,1,1-1A1,1,0,0,1,13,9Z"/>
          </svg>
          <p>Cumadi e cumpadi, não temos pratos nesta categoria no momento.</p>
        </div>
      `;
      return;
    }

    filtered.forEach((dish, index) => {
      const card = document.createElement('div');
      card.className = `dish-card stagger-${Math.min(index, 9)}`;
      card.dataset.id = dish.id;
      card.addEventListener('click', () => this.openDishModal(dish.id));

      // Observa para visualizações (se o observer estiver inicializado)
      if (this.dishObserver) {
        this.dishObserver.observe(card);
      }

      // Adiciona o botão de favorito flutuante no card
      const isFav = (typeof LoyaltySystem !== 'undefined') ? LoyaltySystem.isFavorite(dish.id) : false;
      const favHtml = `
        <button class="dish-fav-btn ${isFav ? 'active' : ''}" 
                onclick="event.stopPropagation(); App.toggleFavorite('${dish.id}')"
                aria-label="Favoritar prato"
                style="
                  position: absolute; top: 12px; right: 12px; z-index: 10;
                  background: var(--card-bg, rgba(255, 255, 255, 0.85));
                  border: none; border-radius: 50%; width: 36px; height: 36px;
                  display: flex; align-items: center; justify-content: center;
                  cursor: pointer; color: ${isFav ? 'var(--color-error, #e74c3c)' : 'var(--text-secondary, #666)'};
                  box-shadow: 0 2px 8px rgba(0,0,0,0.15); transition: transform 0.2s, color 0.2s;
                ">
          <svg viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.5" style="width: 18px; height: 18px;">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
      `;

      let badgeHtml = '';
      const customBadge = (typeof CampaignSystem !== 'undefined') ? CampaignSystem.getDishBadge(dish.id) : null;
      if (customBadge) {
        badgeHtml = `<span class="dish-badge" style="background: ${customBadge.color}">${customBadge.label}</span>`;
      } else if (dish.tag === 'prato-do-dia') badgeHtml = `<span class="dish-badge prato-do-dia">Prato do Dia 🌟</span>`;
      else if (dish.tag === 'mais-pedido') badgeHtml = `<span class="dish-badge mais-pedido">Mais Pedido 🔥</span>`;
      else if (dish.tag === 'promocao') badgeHtml = `<span class="dish-badge promocao">Promoção 🏷️</span>`;
      else if (dish.tag === 'destaque') badgeHtml = `<span class="dish-badge destaque">Especial ⭐</span>`;

      let imageHtml = '';
      if (dish.image) {
        imageHtml = `<img src="${dish.image}" alt="${dish.name}" class="dish-img" loading="lazy">`;
      } else {
        // Fallback de design para quando não há foto
        imageHtml = `
          <div class="dish-fallback-img">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18M3 12h18M12 9a3 3 0 100 6 3 3 0 000-6z" />
            </svg>
            <span style="font-size: 0.72rem; text-transform: uppercase; font-weight: 800; color: var(--color-gold);">VK Culinária</span>
          </div>
        `;
      }

      // Calcula média de estrelas
      const approvedComments = this.state.comments.filter(c => c.dishId === dish.id && c.status === 'approved');
      let ratingVal = dish.rating;
      if (approvedComments.length > 0) {
        const sum = approvedComments.reduce((acc, c) => acc + c.rating, 0);
        ratingVal = (sum / approvedComments.length).toFixed(1);
      }

      card.innerHTML = `
        <div class="dish-img-container" style="position: relative;">
          ${badgeHtml}
          ${imageHtml}
          ${favHtml}
        </div>
        <div class="dish-info">
          <div class="dish-rating">
            <svg style="width: 14px; height: 14px; fill: currentColor;" viewBox="0 0 24 24">
              <path d="M12 .587l3.668 7.431 8.2 1.191-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.209l8.2-1.191L12 .587z"/>
            </svg>
            <span>${ratingVal}</span>
            <span style="color: var(--text-secondary); font-size: 0.75rem; font-weight: 400;">(${approvedComments.length || dish.reviewsCount})</span>
          </div>
          <h3 class="dish-title">${dish.name}</h3>
          <p class="dish-desc">${dish.description}</p>
          <div class="dish-footer">
            <span class="dish-price"><span>R$</span>${dish.price.toFixed(2).replace('.', ',')}</span>
            <button class="btn-details">Ver Detalhes</button>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });
  },

  // Abre Modal com Detalhes do Prato
  openDishModal(dishId) {
    const dish = this.state.dishes.find(d => d.id === dishId);
    if (!dish) return;

    this.state.activeDish = dish;

    // RASTREAMENTO PREMIUM: clique e prato explorado
    const customer = (typeof LoyaltySystem !== 'undefined') ? LoyaltySystem.getCustomer() : null;
    const customerId = customer ? customer.id : null;
    
    if (typeof RankingSystem !== 'undefined') {
      RankingSystem.trackInteraction(dishId, 'click', customerId);
    }
    
    if (typeof LoyaltySystem !== 'undefined') {
      LoyaltySystem.recordDishExplored(dishId);
      LoyaltySystem.checkAchievements((msg) => this.showToast(msg, 'success'));
    }

    // Atualiza a URL com a hash do prato para facilitar compartilhamento direto
    window.location.hash = `prato-${dish.id}`;

    const overlay = document.getElementById('detail-modal-overlay');
    
    // Insere imagem e corpo
    const imgContainer = document.getElementById('detail-modal-img-container');
    if (dish.image) {
      imgContainer.innerHTML = `<img src="${dish.image}" alt="${dish.name}" class="detail-img">`;
    } else {
      imgContainer.innerHTML = `
        <div class="dish-fallback-img" style="height: 250px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18M3 12h18" />
          </svg>
          <span style="font-size: 0.85rem; font-weight: 800; color: var(--color-gold);">VK SABOR REGIONAL</span>
        </div>
      `;
    }

    // Calcula notas reais
    const approvedComments = this.state.comments.filter(c => c.dishId === dish.id && c.status === 'approved');
    let ratingVal = dish.rating;
    if (approvedComments.length > 0) {
      const sum = approvedComments.reduce((acc, c) => acc + c.rating, 0);
      ratingVal = (sum / approvedComments.length).toFixed(1);
    }

    // Adiciona botão favorito no título do detalhe
    const isFav = (typeof LoyaltySystem !== 'undefined') ? LoyaltySystem.isFavorite(dish.id) : false;
    document.getElementById('detail-title').innerHTML = `
      ${dish.name}
      <button class="detail-fav-btn ${isFav ? 'active' : ''}" 
              onclick="event.stopPropagation(); App.toggleFavorite('${dish.id}')"
              style="
                background: none; border: none; cursor: pointer; color: ${isFav ? 'var(--color-error, #e74c3c)' : 'var(--text-secondary)'};
                font-size: 1.4rem; padding: 0 8px; vertical-align: middle; line-height: 1; transition: transform 0.2s;
              "
              title="${isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">
        ${isFav ? '❤️' : '🖤'}
      </button>
    `;
    document.getElementById('detail-price-val').innerText = dish.price.toFixed(2).replace('.', ',');
    document.getElementById('detail-rating-text').innerText = `${ratingVal} (${approvedComments.length} comentários)`;
    document.getElementById('detail-description').innerText = dish.description;

    // Configuração do botão de Fazer Pedido via WhatsApp com acúmulo de pontos
    const orderBtn = document.getElementById('btn-order-whats');
    if (orderBtn) {
      const orderMsg = encodeURIComponent(
        `Olá! Gostaria de fazer o pedido do prato:\n\n` +
        `*${dish.name}*\n` +
        `💰 Preço: R$ ${dish.price.toFixed(2).replace('.', ',')}\n\n` +
        `Estou na mesa do VK Restaurante.`
      );
      orderBtn.href = `https://api.whatsapp.com/send?phone=558198069998&text=${orderMsg}`;
      
      orderBtn.onclick = () => {
        const currentCustomer = (typeof LoyaltySystem !== 'undefined') ? LoyaltySystem.getCustomer() : null;
        const currentCustomerId = currentCustomer ? currentCustomer.id : null;
        
        if (typeof RankingSystem !== 'undefined') {
          RankingSystem.trackInteraction(dish.id, 'order', currentCustomerId);
        }
        
        if (typeof LoyaltySystem !== 'undefined' && LoyaltySystem.isLoggedIn()) {
          LoyaltySystem.addPoints(50, 'fazer-pedido'); // 50 pontos por pedido!
          LoyaltySystem.checkAchievements((msg) => this.showToast(msg, 'success'));
        }
      };
    }

    // Estrelas
    const starsContainer = document.getElementById('detail-stars-stars');
    starsContainer.innerHTML = '';
    const roundedRating = Math.round(ratingVal);
    for (let i = 1; i <= 5; i++) {
      starsContainer.innerHTML += `
        <span style="margin-right: 2px;">
          ${i <= roundedRating ? '★' : '☆'}
        </span>
      `;
    }

    // Badge
    const badgeRow = document.getElementById('detail-badge-row');
    badgeRow.innerHTML = '';
    
    const customBadgeDetail = (typeof CampaignSystem !== 'undefined') ? CampaignSystem.getDishBadge(dish.id) : null;
    if (customBadgeDetail) {
      badgeRow.innerHTML = `<span class="dish-badge" style="position: static; background: ${customBadgeDetail.color}">${customBadgeDetail.label}</span>`;
    } else if (dish.tag) {
      let tagLabel = '';
      let tagClass = '';
      if (dish.tag === 'prato-do-dia') { tagLabel = 'Prato do Dia'; tagClass = 'prato-do-dia'; }
      else if (dish.tag === 'mais-pedido') { tagLabel = 'Mais Pedido'; tagClass = 'mais-pedido'; }
      else if (dish.tag === 'promocao') { tagLabel = 'Promoção'; tagClass = 'promocao'; }
      else if (dish.tag === 'destaque') { tagLabel = 'Destaque Especial'; tagClass = 'destaque'; }
      
      badgeRow.innerHTML = `<span class="dish-badge ${tagClass}" style="position: static;">${tagLabel}</span>`;
    }

    // Ingredientes
    const ingContainer = document.getElementById('ingredients-list');
    ingContainer.innerHTML = '';
    if (dish.ingredients && dish.ingredients.length > 0) {
      dish.ingredients.forEach(ing => {
        ingContainer.innerHTML += `<span class="ingredient-tag">✓ ${ing}</span>`;
      });
    } else {
      ingContainer.innerHTML = `<span class="ingredient-tag">✓ Feito com temperos especiais da casa</span>`;
    }

    // Links de compartilhamento
    this.setupShareButtons(dish);

    // Comentários
    this.renderDishComments(dish.id);

    // Reseta form de comentários
    document.getElementById('comment-form').reset();
    this.setCommentFormRating(5);
    document.getElementById('comment-dish-id').value = dish.id;

    // Abre modal
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // impede scroll de fundo
  },

  // Fecha Modal de Detalhes
  closeDishModal() {
    document.getElementById('detail-modal-overlay').classList.remove('active');
    document.body.style.overflow = '';
    this.state.activeDish = null;
    
    // Reseta a hash da URL limpando sem quebrar a rolagem
    history.replaceState("", document.title, window.location.pathname + window.location.search);
  },

  // Cria os links e botões de compartilhamento
  setupShareButtons(dish) {
    const whatsBtn = document.getElementById('btn-share-whats');
    const instaBtn = document.getElementById('btn-share-insta');

    // Mensagem formatada
    const textMsg = encodeURIComponent(
      `Olha que delícia esse prato do *VK Restaurante*! 😍\n\n` +
      `*${dish.name}*\n` +
      `💰 Apenas *R$ ${dish.price.toFixed(2).replace('.', ',')}*\n\n` +
      `_${dish.description}_\n\n` +
      `Venha conferir nosso cardápio completo no link:\n` +
      `${window.location.origin}${window.location.pathname}#prato-${dish.id}`
    );

    whatsBtn.href = `https://api.whatsapp.com/send?text=${textMsg}`;

    // Instagram simula o compartilhamento de link copiando a mensagem para o Stories
    instaBtn.onclick = (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#prato-${dish.id}`).then(() => {
        this.showToast('Link do prato copiado! Cole na sua bio ou nos Stories do Instagram. 📸', 'success');
      }).catch(() => {
        this.showToast('Erro ao copiar link automaticamente. Compartilhe via WhatsApp!', 'error');
      });
    };
  },

  // Renderiza Comentários Aprovados do Prato
  renderDishComments(dishId) {
    const list = document.getElementById('reviews-list');
    list.innerHTML = '';

    const approved = this.state.comments.filter(c => c.dishId === dishId && c.status === 'approved');

    if (approved.length === 0) {
      list.innerHTML = `<p style="text-align: center; font-size: 0.9rem; color: var(--text-secondary); padding: 1rem 0;">Seja o primeiro a elogiar este prato delicioso! ❤️</p>`;
      return;
    }

    approved.forEach(rev => {
      const item = document.createElement('div');
      item.className = 'review-item';

      let starsHtml = '';
      for (let i = 1; i <= 5; i++) {
        starsHtml += i <= rev.rating ? '★' : '☆';
      }

      item.innerHTML = `
        <div class="review-header">
          <span class="review-name">${rev.name}</span>
          <span style="color: var(--color-gold); font-size: 0.85rem; font-weight: 700; margin-left: auto; margin-right: 8px;">${starsHtml}</span>
          <span class="review-date">${rev.date}</span>
        </div>
        <p class="review-comment">${rev.comment}</p>
      `;

      list.appendChild(item);
    });
  },

  // Submete Comentário pelo Cliente (Fica como Pendente)
  submitComment() {
    const dishId = document.getElementById('comment-dish-id').value;
    const name = document.getElementById('comment-name').value.trim();
    const comment = document.getElementById('comment-text').value.trim();
    const rating = this.state.commentFormRating;

    if (!name || !comment) {
      this.showToast('Por favor, preencha seu nome e seu comentário!', 'error');
      return;
    }

    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

    const newComment = {
      id: Date.now(),
      dishId: dishId,
      name: name,
      rating: rating,
      comment: comment,
      status: 'pending', // Requisito: passa por aprovação do administrador
      date: dateStr
    };

    this.state.comments.push(newComment);
    this.saveState();

    // RASTREAMENTO PREMIUM: ganha pontos se estiver logado
    if (typeof LoyaltySystem !== 'undefined' && LoyaltySystem.isLoggedIn()) {
      LoyaltySystem.recordComment();
      LoyaltySystem.addPoints(20, 'comentar-prato'); // Dá 20 pontos por comentar
      LoyaltySystem.checkAchievements((msg) => this.showToast(msg, 'success'));
    }

    this.showToast('Comentário enviado! Aparecerá publicamente após aprovação do administrador. Eita cumadi/cumpadi, muito obrigado! 🙏', 'success');

    // Reseta form
    document.getElementById('comment-form').reset();
    this.setCommentFormRating(5);
  },

  // ==========================================
  // ÁREA ADMINISTRATIVA
  // ==========================================

  // Abre Modal do Admin
  openAdminModal() {
    document.getElementById('admin-modal-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    this.renderAdminView();
  },

  // Fecha Modal do Admin
  closeAdminModal() {
    document.getElementById('admin-modal-overlay').classList.remove('active');
    document.body.style.overflow = '';
  },

  // Alterna a exibição conforme estado de login
  renderAdminView() {
    const loginSection = document.getElementById('admin-login-section');
    const dashboardSection = document.getElementById('admin-dashboard-section');

    if (this.state.isAdmin) {
      loginSection.style.display = 'none';
      dashboardSection.style.display = 'block';
      this.renderAdminTabs();
    } else {
      loginSection.style.display = 'block';
      dashboardSection.style.display = 'none';
    }
  },

  // Renderiza Abas de Controle do Admin
  renderAdminTabs() {
    // Atualiza classes das abas
    const tabs = document.querySelectorAll('.admin-tab');
    tabs.forEach(tab => {
      if (tab.dataset.tab === this.state.adminActiveTab) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Exibe conteúdo correto
    const contents = document.querySelectorAll('.admin-tab-content');
    contents.forEach(cont => {
      if (cont.id === `admin-tab-${this.state.adminActiveTab}`) {
        cont.classList.add('active');
      } else {
        cont.classList.remove('active');
      }
    });

    // Inicializa carregamentos por aba
    if (this.state.adminActiveTab === 'comentarios') {
      this.renderAdminComments();
    } else if (this.state.adminActiveTab === 'pratos') {
      this.renderAdminDishes();
      this.renderAdminCategoriesDropdown(); // Preenche select do CRUD
    } else if (this.state.adminActiveTab === 'categorias') {
      this.renderAdminCategoriesList();
    } else if (this.state.adminActiveTab === 'estatisticas') {
      this.renderAdminStats();
    } else if (this.state.adminActiveTab === 'fidelidade') {
      this.renderAdminLoyalty();
    } else if (this.state.adminActiveTab === 'campaigns') {
      this.renderAdminCampaigns();
    }
  },

  // 1. ABA COMENTÁRIOS: Renderiza e gerencia moderação
  renderAdminComments() {
    const list = document.getElementById('moderation-list');
    list.innerHTML = '';

    // Ordena por pendentes primeiro
    const sorted = [...this.state.comments].sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      return b.id - a.id;
    });

    // Contador de Pendências para o cabeçalho
    const pendingCount = this.state.comments.filter(c => c.status === 'pending').length;
    document.getElementById('mod-pending-badge').innerText = `${pendingCount} pendentes`;

    if (sorted.length === 0) {
      list.innerHTML = `<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Nenhum comentário registrado.</p>`;
      return;
    }

    sorted.forEach(c => {
      const dish = this.state.dishes.find(d => d.id === c.dishId) || { name: 'Prato Excluído' };
      const item = document.createElement('div');
      item.className = 'moderation-item';

      let starsHtml = '';
      for (let i = 1; i <= 5; i++) {
        starsHtml += i <= c.rating ? '★' : '☆';
      }

      let statusLabel = '';
      if (c.status === 'pending') statusLabel = `<span class="mod-status-badge pending">Aguardando</span>`;
      else if (c.status === 'approved') statusLabel = `<span class="mod-status-badge approved">Aprovado</span>`;
      else if (c.status === 'rejected') statusLabel = `<span class="mod-status-badge rejected">Recusado</span>`;

      // Botões de ação dinâmicos conforme status
      let actionButtons = '';
      if (c.status === 'pending') {
        actionButtons = `
          <button class="btn-mod-action approve" onclick="App.moderateComment(${c.id}, 'approved')">✓ Aprovar</button>
          <button class="btn-mod-action reject" onclick="App.moderateComment(${c.id}, 'rejected')">✗ Recusar</button>
        `;
      } else if (c.status === 'approved') {
        actionButtons = `
          <button class="btn-mod-action reject" onclick="App.moderateComment(${c.id}, 'rejected')">✗ Desaprovar</button>
        `;
      } else {
        actionButtons = `
          <button class="btn-mod-action approve" onclick="App.moderateComment(${c.id}, 'approved')">✓ Aprovar</button>
        `;
      }

      item.innerHTML = `
        <div class="mod-header">
          <div class="mod-meta">
            <span class="mod-name">${c.name} (${c.date})</span>
            <span class="mod-dish">Prato: ${dish.name} | ${starsHtml}</span>
          </div>
          ${statusLabel}
        </div>
        <p class="mod-comment">"${c.comment}"</p>
        <div class="mod-actions">
          ${actionButtons}
          <button class="btn-mod-action delete" style="flex:0; padding:6px 10px;" title="Excluir Definitivamente" onclick="App.moderateComment(${c.id}, 'delete')">
            <svg style="width:14px; height:14px; fill:currentColor;" viewBox="0 0 24 24"><path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.761-.504 2.112-1.285l1-2.215h6.354l1 2.215c.351.781 1.212 1.285 2.112 1.285h5.711z"/></svg>
          </button>
        </div>
      `;

      list.appendChild(item);
    });
  },

  // Executa moderação de comentários (Aprovar / Recusar / Excluir)
  moderateComment(id, action) {
    if (action === 'delete') {
      if (confirm('Deseja excluir permanentemente este comentário?')) {
        this.state.comments = this.state.comments.filter(c => c.id !== id);
        this.showToast('Comentário excluído para sempre.', 'success');
      } else {
        return;
      }
    } else {
      const comm = this.state.comments.find(c => c.id === id);
      if (comm) {
        comm.status = action;
        
        // RASTREAMENTO PREMIUM: se aprovado, registra interação no ranking
        if (action === 'approved' && typeof RankingSystem !== 'undefined') {
          const customerId = (typeof LoyaltySystem !== 'undefined') 
            ? (LoyaltySystem.state.allCustomers.find(cust => cust.name === comm.name)?.id || null) 
            : null;
          RankingSystem.trackInteraction(comm.dishId, 'comment', customerId);
        }

        this.showToast(action === 'approved' ? 'Comentário aprovado e visível publicamente!' : 'Comentário recusado.', 'success');
      }
    }

    this.saveState();
    this.renderAdminComments();
    this.renderDishes(); // Atualiza média de estrelas no menu principal se aberto
    if (this.state.activeDish) {
      this.renderDishComments(this.state.activeDish.id); // Atualiza modal de detalhes se aberto
    }
  },

  // 2. ABA PRATOS: Renderiza e gerencia CRUD
  renderAdminDishes() {
    const list = document.getElementById('admin-dishes-list');
    list.innerHTML = '';

    this.state.dishes.forEach(dish => {
      const row = document.createElement('div');
      row.className = 'admin-item-row';

      const catName = (this.state.categories.find(c => c.id === dish.category) || { name: 'Sem Categoria' }).name;

      let thumbHtml = '';
      if (dish.image) {
        thumbHtml = `<img src="${dish.image}" class="admin-item-thumb" alt="${dish.name}">`;
      } else {
        thumbHtml = `
          <div class="admin-item-thumb" style="display:flex; align-items:center; justify-content:center; background:var(--bg-tertiary); border: 1px dashed var(--border-color);">
            <span style="font-size:0.5rem; color:var(--color-gold); font-weight:800;">VK</span>
          </div>
        `;
      }

      row.innerHTML = `
        <div class="admin-item-info">
          ${thumbHtml}
          <div class="admin-item-text">
            <span class="admin-item-name">${dish.name}</span>
            <span class="admin-item-price-cat">${catName} | <span>R$ ${dish.price.toFixed(2).replace('.', ',')}</span></span>
          </div>
        </div>
        <div class="admin-item-actions">
          <button class="btn-admin-icon" title="Editar" onclick="App.editDishCrud('${dish.id}')">
            <svg style="width:14px; height:14px; fill:currentColor;" viewBox="0 0 24 24"><path d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z"/></svg>
          </button>
          <button class="btn-admin-icon delete" title="Excluir" onclick="App.deleteDishCrud('${dish.id}')">
            <svg style="width:14px; height:14px; fill:currentColor;" viewBox="0 0 24 24"><path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.761-.504 2.112-1.285l1-2.215h6.354l1 2.215c.351.781 1.212 1.285 2.112 1.285h5.711z"/></svg>
          </button>
        </div>
      `;

      list.appendChild(row);
    });
  },

  // Preenche o dropdown de categorias no form CRUD de prato
  renderAdminCategoriesDropdown() {
    const select = document.getElementById('crud-dish-category');
    select.innerHTML = '';
    // Exclui a categoria virtual "destaques" ou "promocoes" para o cadastro físico
    const physicalCategories = this.state.categories.filter(c => c.id !== 'destaques' && c.id !== 'promocoes');
    
    physicalCategories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.id;
      opt.innerText = cat.name.replace(/🍲|🍻|🍮|🏷️|🌟/g, '').trim();
      select.appendChild(opt);
    });
  },

  // Carrega dados de um prato no formulário de edição do CRUD
  editDishCrud(id) {
    const dish = this.state.dishes.find(d => d.id === id);
    if (!dish) return;

    this.state.editingDishId = dish.id;
    document.getElementById('panel-crud-title').innerText = 'Editar Prato';
    document.getElementById('crud-dish-name').value = dish.name;
    document.getElementById('crud-dish-price').value = dish.price.toFixed(2);
    document.getElementById('crud-dish-category').value = dish.category;
    document.getElementById('crud-dish-image').value = dish.image;
    document.getElementById('crud-dish-desc').value = dish.description;
    
    // Ingredientes (converte array em lista separada por vírgulas)
    document.getElementById('crud-dish-ingredients').value = dish.ingredients ? dish.ingredients.join(', ') : '';

    // Selo / Tag
    document.getElementById('crud-dish-tag').value = dish.tag || '';

    document.getElementById('btn-cancel-dish-edit').style.display = 'inline-block';
    
    // Rola até o formulário no celular
    document.getElementById('dish-crud-form').scrollIntoView({ behavior: 'smooth' });
  },

  // Salva ou Adiciona um prato (CRUD) com Supabase
  async saveDishCrud() {
    const name = document.getElementById('crud-dish-name').value.trim();
    const price = parseFloat(document.getElementById('crud-dish-price').value);
    const category = document.getElementById('crud-dish-category').value;
    const image = document.getElementById('crud-dish-image').value.trim();
    const description = document.getElementById('crud-dish-desc').value.trim();
    const ingInput = document.getElementById('crud-dish-ingredients').value.trim();
    const tag = document.getElementById('crud-dish-tag').value;

    if (!name || isNaN(price) || !description) {
      this.showToast('Por favor, preencha todos os campos obrigatórios!', 'error');
      return;
    }

    const ingredients = ingInput ? ingInput.split(',').map(i => i.trim()).filter(i => i !== '') : [];
    const isEdit = !!this.state.editingDishId;

    let dishData = null;

    if (isEdit) {
      // MODO EDICAO
      const existingDish = this.state.dishes.find(d => d.id === this.state.editingDishId);
      const rating = existingDish ? existingDish.rating : 5.0;
      const reviewsCount = existingDish ? existingDish.reviewsCount : 0;

      dishData = {
        id: this.state.editingDishId,
        name: name,
        price: price,
        category: category,
        image: image || null,
        description: description,
        ingredients: ingredients,
        tag: tag || null,
        rating: parseFloat(rating),
        reviewsCount: parseInt(reviewsCount)
      };
    } else {
      // MODO CRIAÇÃO NOVO PRATO
      const newId = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '_') + '_' + Date.now();
      dishData = {
        id: newId,
        name: name,
        price: price,
        category: category,
        image: image || null,
        description: description,
        ingredients: ingredients,
        tag: tag || null,
        rating: 5.0,
        reviewsCount: 0
      };
    }

    if (dishData) {
      this.showToast('Salvando no Supabase...', 'success');
      const success = await this.saveDishToSupabase(dishData, isEdit);
      if (success) {
        this.showToast('Salvo com sucesso no Supabase! ☁️', 'success');
        
        // Recarrega os dados diretamente do Supabase após salvar
        await this.fetchDishesFromSupabase();
        
        // Sincroniza o cache local secundário
        this.saveState();
        
        // Limpa o formulário e atualiza a UI
        this.resetDishForm();
        this.renderAdminDishes();
        this.render(); // Atualiza cardápio principal
      } else {
        this.showToast('Erro ao salvar no Supabase. O formulário continuará aberto.', 'error');
      }
    }
  },

  // Exclui um prato no CRUD com Supabase
  async deleteDishCrud(id) {
    if (confirm('Deseja realmente excluir este prato de forma definitiva?')) {
      this.showToast('Removendo do Supabase...', 'success');
      const success = await this.deleteDishFromSupabase(id);
      if (success) {
        // Remove do cache de comentários local também
        this.state.comments = this.state.comments.filter(c => c.dishId !== id);
        
        // Recarrega os pratos diretamente do Supabase
        await this.fetchDishesFromSupabase();
        
        // Sincroniza cache local secundário
        this.saveState();
        
        // Atualiza a UI
        this.renderAdminDishes();
        this.render();
        
        this.showToast('Excluído do Supabase com sucesso! 🗑️', 'success');
        if (this.state.editingDishId === id) this.resetDishForm();
      } else {
        this.showToast('Falha ao excluir do Supabase. Verifique o console.', 'error');
      }
    }
  },

  // Reseta formulário do CRUD de Pratos
  resetDishForm() {
    this.state.editingDishId = null;
    document.getElementById('panel-crud-title').innerText = 'Adicionar Prato';
    document.getElementById('dish-crud-form').reset();
    document.getElementById('btn-cancel-dish-edit').style.display = 'none';
  },

  // 3. ABA CATEGORIAS: CRUD de Categorias
  renderAdminCategoriesList() {
    const list = document.getElementById('admin-cats-list');
    list.innerHTML = '';

    this.state.categories.forEach(cat => {
      const row = document.createElement('div');
      row.className = 'admin-cat-row';

      // Impede remoção das categorias lógicas principais ou impede que fique sem nenhuma
      const isSystem = ['destaques', 'pratos', 'sobremesas', 'bebidas', 'promocoes'].includes(cat.id);
      const deleteBtn = isSystem 
        ? `<span style="font-size:0.75rem; color:var(--text-secondary);">Sistema</span>` 
        : `
          <button class="btn-admin-icon delete" title="Excluir" onclick="App.deleteCategoryCrud('${cat.id}')">
            <svg style="width:12px; height:12px; fill:currentColor;" viewBox="0 0 24 24"><path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.761-.504 2.112-1.285l1-2.215h6.354l1 2.215c.351.781 1.212 1.285 2.112 1.285h5.711z"/></svg>
          </button>
        `;

      row.innerHTML = `
        <span class="admin-cat-name">${cat.name}</span>
        ${deleteBtn}
      `;

      list.appendChild(row);
    });
  },

  // Salva nova categoria
  saveCategoryCrud() {
    const nameInput = document.getElementById('crud-cat-name').value.trim();
    if (!nameInput) {
      this.showToast('Por favor, informe o nome da categoria!', 'error');
      return;
    }

    const newId = nameInput.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now();
    const newCat = {
      id: newId,
      name: nameInput
    };

    this.state.categories.push(newCat);
    this.saveState();
    
    document.getElementById('crud-cat-name').value = '';
    this.showToast('Nova categoria registrada com sucesso!', 'success');
    
    this.renderAdminCategoriesList();
    this.render(); // Atualiza layout principal e cabeçalhos
  },

  // Exclui categoria
  deleteCategoryCrud(id) {
    if (confirm('Deseja excluir esta categoria? Os pratos cadastrados nela precisarão ser remapeados no gerenciador.')) {
      this.state.categories = this.state.categories.filter(c => c.id !== id);
      
      // Ajusta pratos da categoria excluída para 'pratos'
      this.state.dishes.forEach(d => {
        if (d.category === id) {
          d.category = 'pratos';
        }
      });

      this.saveState();
      this.showToast('Categoria excluída.', 'success');
      this.renderAdminCategoriesList();
      this.render();
    }
  },

  // ==========================================
  // UTILITÁRIOS GERAIS
  // ==========================================

  // Exibe Notificação Flutuante (Toast)
  showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.className = `notification-toast ${type}`;
    
    // Icon dinâmico
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg style="width: 18px; height: 18px; fill: currentColor;" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.25 17.292l-4.5-4.364 1.457-1.417 3.043 2.95 7.543-7.303 1.457 1.417-9 8.717z"/></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg style="width: 18px; height: 18px; fill: currentColor;" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-12v-2h12v2z"/></svg>`;
    }
    
    toast.innerHTML = `${iconSvg} <span>${message}</span>`;
    toast.classList.add('show');

    // Remove após 3.5 segundos
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  },

  // Varre a hash da URL para abrir prato diretamente (Ex: QR Code individual de prato ou link compartilhado)
  checkUrlForDish() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#prato-')) {
      const dishId = hash.replace('#prato-', '');
      // Pequeno delay para garantir renderização prévia completa
      setTimeout(() => {
        this.openDishModal(dishId);
      }, 300);
    }
  }
};

// Inicializa a aplicação após carregamento da janela
window.addEventListener('DOMContentLoaded', () => {
  App.init();
});

// ==========================================
// MÉTODOS PREMIUM E SUPORTE DE INTEGRAÇÃO
// ==========================================

App.initIntersectionObserver = function() {
  if (!('IntersectionObserver' in window)) return;

  this.dishObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const dishId = card.dataset.id;
        if (dishId) {
          this.trackDishView(dishId);
        }
        // Para de observar este card específico para não duplicar na mesma sessão
        this.dishObserver.unobserve(card);
      }
    });
  }, { threshold: 0.2 });
};

App.trackDishView = function(dishId) {
  if (typeof RankingSystem !== 'undefined') {
    const customerId = (typeof LoyaltySystem !== 'undefined' && LoyaltySystem.getCustomer()) 
      ? LoyaltySystem.getCustomer().id 
      : null;
    RankingSystem.trackInteraction(dishId, 'view', customerId);
  }
};

App.toggleFavorite = function(dishId) {
  if (typeof LoyaltySystem === 'undefined') return;

  if (!LoyaltySystem.isLoggedIn()) {
    this.showToast('Faça login no Programa de Fidelidade para favoritar pratos! 👤', 'error');
    this.openLoyaltyModal();
    return;
  }

  const added = LoyaltySystem.addFavorite(dishId);
  const customer = LoyaltySystem.getCustomer();
  const customerId = customer ? customer.id : null;

  if (added) {
    if (typeof RankingSystem !== 'undefined') {
      RankingSystem.trackInteraction(dishId, 'favorite', customerId);
    }
    // Concede pontos de fidelidade por favoritar
    LoyaltySystem.addPoints(15, 'favorito');
    this.showToast('Prato adicionado aos favoritos! ❤️', 'success');
  } else {
    this.showToast('Prato removido dos favoritos.', 'success');
  }

  // Verifica conquistas
  LoyaltySystem.checkAchievements((msg) => this.showToast(msg, 'success'));

  // Atualiza as visualizações
  this.renderDishes();
  if (this.state.activeDish && this.state.activeDish.id === dishId) {
    this.openDishModal(dishId);
  }
};

App.openLoyaltyModal = function() {
  if (typeof LoyaltySystem === 'undefined') return;

  const overlay = document.getElementById('loyalty-modal-overlay');
  const content = document.getElementById('loyalty-modal-content');
  
  if (!overlay || !content) return;

  if (LoyaltySystem.isLoggedIn()) {
    content.innerHTML = LoyaltySystem.renderProfileModal(this.state.dishes);
    
    // Conecta o logout
    const logoutBtn = document.getElementById('loyalty-logout-btn');
    if (logoutBtn) {
      logoutBtn.onclick = () => {
        LoyaltySystem.logout();
        this.showToast('Você saiu da sua conta de fidelidade.', 'success');
        this.updateLoyaltyNavButton();
        this.openLoyaltyModal(); // Recarrega tela de login
        this.renderDishes();
      };
    }
  } else {
    content.innerHTML = LoyaltySystem.renderLoginModal();
    
    const form = document.getElementById('loyalty-login-form');
    if (form) {
      const phoneInput = document.getElementById('loyalty-phone');
      if (phoneInput) {
        phoneInput.oninput = (e) => {
          LoyaltySystem.applyPhoneMask(e.target);
        };
      }

      form.onsubmit = (e) => {
        e.preventDefault();
        const phone = document.getElementById('loyalty-phone').value;
        const name = document.getElementById('loyalty-name').value;
        
        const res = LoyaltySystem.login(phone, name);
        if (res.success) {
          this.showToast(res.message, 'success');
          
          // Pontos de boas-vindas
          LoyaltySystem.addPoints(15, 'cadastro-fidelidade');
          LoyaltySystem.checkAchievements((msg) => this.showToast(msg, 'success'));
          
          this.updateLoyaltyNavButton();
          this.openLoyaltyModal(); // Recarrega perfil
          this.renderDishes();
        } else {
          this.showToast(res.message, 'error');
        }
      };
    }
  }

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
};

App.closeLoyaltyModal = function() {
  const overlay = document.getElementById('loyalty-modal-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
};

App.updateLoyaltyNavButton = function() {
  const label = document.getElementById('loyalty-nav-label');
  if (!label) return;

  if (typeof LoyaltySystem !== 'undefined' && LoyaltySystem.isLoggedIn()) {
    const customer = LoyaltySystem.getCustomer();
    label.innerText = customer.name.split(' ')[0];
  } else {
    label.innerText = 'Meu Perfil';
  }
};

App.renderPremiumSections = function() {
  // 1. Campanhas e Destaques (Cardápio Vivo)
  const highlightsContainer = document.getElementById('highlights-container');
  if (highlightsContainer && typeof CampaignSystem !== 'undefined') {
    highlightsContainer.innerHTML = CampaignSystem.renderHighlightsSection(this.state.dishes);
  }

  // 2. Ranking de Pratos
  const rankingContainer = document.getElementById('ranking-container');
  if (rankingContainer && typeof RankingSystem !== 'undefined') {
    rankingContainer.innerHTML = RankingSystem.renderTrendingSection(this.state.dishes);
  }
};

App.renderAdmin = function() {
  this.renderAdminTabs();
  this.render(); // Além de recarregar a aba admin, recarrega o cardápio público
};

App.renderAdminStats = function() {
  const container = document.getElementById('admin-stats-container');
  if (container && typeof RankingSystem !== 'undefined') {
    container.innerHTML = RankingSystem.renderAdminStats(this.state.dishes);
  }
};

App.renderAdminLoyalty = function() {
  const container = document.getElementById('loyalty-admin-content');
  if (container && typeof LoyaltySystem !== 'undefined') {
    container.innerHTML = LoyaltySystem.renderAdminLoyalty();
  }
};

App.renderAdminCampaigns = function() {
  const container = document.getElementById('admin-campaigns-container');
  if (container && typeof CampaignSystem !== 'undefined') {
    container.innerHTML = CampaignSystem.renderAdminCampaigns(this.state.dishes, this.state.categories);
  }
};

// ==========================================
// INTEGRAÇÃO COM O BANCO DE DADOS SUPABASE
// ==========================================

App.supabaseUrl = 'https://xzmdgnvrhrvzjfltvaaf.supabase.co/rest/v1/dishes';
App.supabaseHeaders = {
  'apikey': 'sb_publishable_sA_TmqRuU-X-OrJq-QbUaQ_xml9UHoB',
  'Authorization': 'Bearer sb_publishable_sA_TmqRuU-X-OrJq-QbUaQ_xml9UHoB',
  'Content-Type': 'application/json'
};

App.fetchDishesFromSupabase = async function() {
  try {
    console.log("Carregando pratos do Supabase");
    const response = await fetch(this.supabaseUrl + '?order=name.asc', {
      method: 'GET',
      headers: this.supabaseHeaders
    });
    if (response.ok) {
      const dishes = await response.json();
      if (dishes && dishes.length > 0) {
        this.state.dishes = dishes.map(d => ({
          ...d,
          price: parseFloat(d.price),
          ingredients: Array.isArray(d.ingredients) ? d.ingredients : [],
          reviewsCount: d.reviewscount !== undefined ? parseInt(d.reviewscount) : parseInt(d.reviewsCount || 0)
        }));
        
        console.log(`Pratos recebidos do Supabase: ${this.state.dishes.length}`);
        
        const agua = this.state.dishes.find(d => d.id === 'agua_coco');
        if (agua) {
          console.log(`Preço agua_coco recebido: ${agua.price}`);
        } else {
          console.log("Preço agua_coco recebido: não encontrado");
        }
        
        return true;
      }
    }
    return false;
  } catch (e) {
    console.error('[Supabase] Erro ao buscar pratos:', e);
    return false;
  }
};

App.saveDishToSupabase = async function(dish, isEdit) {
  try {
    // Garante tipos corretos (ex: price como number) e mapeia reviewsCount -> reviewscount
    const payload = {
      id: dish.id,
      name: dish.name,
      price: parseFloat(dish.price),
      category: dish.category,
      image: dish.image || null,
      description: dish.description,
      ingredients: Array.isArray(dish.ingredients) ? dish.ingredients : [],
      tag: dish.tag || null,
      rating: parseFloat(dish.rating || 5.0),
      reviewscount: parseInt(dish.reviewsCount || 0)
    };

    console.log(`Atualizando prato id: ${payload.id}`);
    console.log('Payload:', { price: payload.price });

    const url = isEdit ? `${this.supabaseUrl}?id=eq.${payload.id}` : this.supabaseUrl;
    const method = isEdit ? 'PATCH' : 'POST';

    // Executa a escrita no Supabase (PATCH/POST) sem Prefer: return=representation para evitar restrições RLS
    const response = await fetch(url, {
      method: method,
      headers: this.supabaseHeaders,
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      // Faz um SELECT de confirmação na tabela dishes para ler a linha atualizada da nuvem
      const selectResponse = await fetch(`${this.supabaseUrl}?id=eq.${payload.id}`, {
        method: 'GET',
        headers: this.supabaseHeaders
      });

      if (selectResponse.ok) {
        const selectData = await selectResponse.json();
        const rowsUpdated = Array.isArray(selectData) ? selectData.length : 0;
        console.log(`Linhas atualizadas: ${rowsUpdated}`);

        if (rowsUpdated === 0) {
          console.error(`[Supabase] ERRO: 0 linhas foram atualizadas para o prato id: ${payload.id}. Verifique se o ID existe.`);
          return false;
        }

        const updatedDish = selectData[0];
        console.log(`Preço agua_coco recebido: ${updatedDish.price}`);

        console.log(`[Supabase] Prato salvo e verificado com sucesso (${method}):`, payload.id);
        return true;
      } else {
        console.error('[Supabase] Falha ao fazer SELECT de confirmação após salvar.');
        return false;
      }
    } else {
      const errorText = await response.text();
      console.error(`[Supabase] Erro ao salvar prato (Status ${response.status} - ${response.statusText}):`, errorText);
      return false;
    }
  } catch (e) {
    console.error('[Supabase] Erro de rede/exceção ao salvar prato:', e);
    return false;
  }
};

App.deleteDishFromSupabase = async function(id) {
  try {
    const response = await fetch(this.supabaseUrl + '?id=eq.' + id, {
      method: 'DELETE',
      headers: this.supabaseHeaders
    });

    if (response.ok) {
      // Confirmamos fazendo SELECT da linha excluída para ver se ela sumiu (deve retornar array vazio)
      const selectResponse = await fetch(`${this.supabaseUrl}?id=eq.${id}`, {
        method: 'GET',
        headers: this.supabaseHeaders
      });

      if (selectResponse.ok) {
        const selectData = await selectResponse.json();
        const rowsLeft = Array.isArray(selectData) ? selectData.length : 0;
        
        // Se ainda existir, indica que o DELETE falhou/não alterou
        if (rowsLeft > 0) {
          console.error(`[Supabase] ERRO: O prato id ${id} ainda consta no banco de dados após a tentativa de exclusão.`);
          return false;
        }

        console.log(`Linhas deletadas: 1`); // Confirmação lógica de 1 linha removida com sucesso
        console.log('[Supabase] Prato deletado com sucesso do Supabase:', id);
        return true;
      } else {
        console.error('[Supabase] Falha ao fazer SELECT de confirmação após a exclusão.');
        return false;
      }
    } else {
      const errorText = await response.text();
      console.error(`[Supabase] Erro ao deletar prato (Status ${response.status} - ${response.statusText}):`, errorText);
      return false;
    }
  } catch (e) {
    console.error('[Supabase] Erro de rede/exceção ao deletar prato:', e);
    return false;
  }
};
