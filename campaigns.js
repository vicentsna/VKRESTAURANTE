/**
 * ============================================================================
 * VK RESTAURANTE — Sistema de Campanhas e Cardápio Vivo
 * ============================================================================
 *
 * Módulo standalone que gerencia:
 *   • Campanhas promocionais (recorrentes e pontuais)
 *   • Prato do Dia (um por dia da semana)
 *   • Destaques / Featured (pratos em evidência permanente)
 *
 * IMPORTANTE: Este módulo é carregado ANTES do app.js.
 * Não deve referenciar `App` ou outros módulos diretamente,
 * exceto em atributos onclick de HTML renderizado.
 *
 * Chaves de localStorage utilizadas:
 *   vk_campaigns        → Array de objetos de campanha
 *   vk_daily_specials   → Objeto com chaves 0-6 (0=Domingo)
 *   vk_featured         → Array de pratos em destaque
 *   vk_campaign_version → String de versão para controle de seeds
 *
 * @author VK Restaurante
 * @version 2.0.0
 */

const CampaignSystem = (() => {
  // ─── Versão atual dos dados padrão ────────────────────────────────────
  // Ao alterar os seeds, incremente esta versão para forçar re-seed
  const CURRENT_VERSION = '2.0.0';

  // ─── Chaves de armazenamento ──────────────────────────────────────────
  const STORAGE_KEYS = {
    campaigns: 'vk_campaigns',
    dailySpecials: 'vk_daily_specials',
    featured: 'vk_featured',
    version: 'vk_campaign_version'
  };

  // ─── Nomes dos dias da semana em pt-BR ────────────────────────────────
  const DIAS_SEMANA = [
    'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'
  ];
  const DIAS_SEMANA_ABREV = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // ─── Dados padrão (seeds) ─────────────────────────────────────────────

  /**
   * Campanhas padrão pré-configuradas.
   * Cada campanha possui tipo 'recurring' (recorrente) ou 'one-time' (pontual).
   */
  const DEFAULT_CAMPAIGNS = [
    {
      id: 'sextou',
      name: '🔥 Sextou no VK',
      description: 'Toda sexta-feira à noite com o melhor da brasa e drinks especiais!',
      type: 'recurring',
      daysOfWeek: [5], // Sexta-feira
      startTime: '18:00',
      endTime: '23:00',
      startDate: null,
      endDate: null,
      dishes: ['picanha', 'cerveja-artesanal', 'caipirinha'],
      badgeLabel: '🔥 Sextou!',
      badgeColor: '#e74c3c',
      active: true,
      createdAt: '2026-01-15'
    },
    {
      id: 'sao-joao-2026',
      name: '🌽 São João VK 2026',
      description: 'Arraiá do VK! Comidas típicas e muita animação de 20 a 24 de junho.',
      type: 'one-time',
      daysOfWeek: [],
      startTime: '11:00',
      endTime: '23:00',
      startDate: '2026-06-20',
      endDate: '2026-06-24',
      dishes: ['baiao-de-dois', 'canjica', 'bolo-macaxeira'],
      badgeLabel: '🌽 São João',
      badgeColor: '#f39c12',
      active: true,
      createdAt: '2026-05-01'
    },
    {
      id: 'almoco-executivo',
      name: '🍽️ Almoço Executivo',
      description: 'De segunda a sexta, almoço completo com entrada, prato principal e sobremesa.',
      type: 'recurring',
      daysOfWeek: [1, 2, 3, 4, 5], // Seg a Sex
      startTime: '11:00',
      endTime: '15:00',
      startDate: null,
      endDate: null,
      dishes: ['executivo-feijoada', 'executivo-cupim', 'executivo-camarao'],
      badgeLabel: '🍽️ Executivo',
      badgeColor: '#3498db',
      active: true,
      createdAt: '2026-01-10'
    }
  ];

  /**
   * Pratos do dia padrão — um para cada dia da semana.
   * Chave 0 = Domingo, 1 = Segunda, ..., 6 = Sábado.
   */
  const DEFAULT_DAILY_SPECIALS = {
    '0': null, // Domingo — sem prato do dia
    '1': { dishId: 'parmegiana', label: '🥩 Parmegiana da Casa' },
    '2': { dishId: 'frango-parmegiana', label: '🍗 Frango à Parmegiana' },
    '3': { dishId: 'moqueca', label: '🐟 Moqueca de Peixe' },
    '4': { dishId: 'costela-bafo', label: '🥩 Costela no Bafo' },
    '5': { dishId: 'picanha', label: '🔥 Picanha na Brasa' },
    '6': { dishId: 'galeto', label: '🍗 Galeto Completo' }
  };

  /**
   * Pratos em destaque padrão.
   * Aparecem com badge especial no cardápio.
   */
  const DEFAULT_FEATURED = [
    { dishId: 'moqueca', badge: '⭐ Sugestão do Chef', badgeColor: '#E5A91A', active: true },
    { dishId: 'dadinhos-coalho', badge: '🆕 Novo no Cardápio', badgeColor: '#2ecc71', active: true }
  ];

  // =====================================================================
  // OBJETO PRINCIPAL DO MÓDULO
  // =====================================================================
  const module = {

    /**
     * Estado interno do sistema de campanhas.
     * Populado pelo init() a partir do localStorage ou dos seeds.
     */
    state: {
      campaigns: [],
      dailySpecials: {},
      featured: []
    },

    // ─── Inicialização ──────────────────────────────────────────────────

    /**
     * Inicializa o sistema de campanhas.
     * Carrega dados do localStorage; se a versão for diferente
     * ou não existir, popula com os dados padrão (seeds).
     */
    init() {
      const savedVersion = localStorage.getItem(STORAGE_KEYS.version);

      if (savedVersion === CURRENT_VERSION) {
        // Versão atual — carrega dados salvos
        try {
          const campaigns = JSON.parse(localStorage.getItem(STORAGE_KEYS.campaigns));
          const dailySpecials = JSON.parse(localStorage.getItem(STORAGE_KEYS.dailySpecials));
          const featured = JSON.parse(localStorage.getItem(STORAGE_KEYS.featured));

          this.state.campaigns = Array.isArray(campaigns) ? campaigns : DEFAULT_CAMPAIGNS;
          this.state.dailySpecials = dailySpecials && typeof dailySpecials === 'object'
            ? dailySpecials
            : { ...DEFAULT_DAILY_SPECIALS };
          this.state.featured = Array.isArray(featured) ? featured : DEFAULT_FEATURED;
        } catch (e) {
          console.warn('[CampaignSystem] Erro ao carregar dados salvos, usando padrões:', e);
          this._seedDefaults();
        }
      } else {
        // Primeira execução ou versão diferente — semeia dados padrão
        console.info('[CampaignSystem] Semeando dados padrão (versão ' + CURRENT_VERSION + ')');
        this._seedDefaults();
      }

      console.info('[CampaignSystem] Inicializado com', this.state.campaigns.length, 'campanhas,',
        Object.values(this.state.dailySpecials).filter(Boolean).length, 'pratos do dia,',
        this.state.featured.length, 'destaques.');
    },

    /**
     * Popula o estado com dados padrão e salva no localStorage.
     * @private
     */
    _seedDefaults() {
      this.state.campaigns = JSON.parse(JSON.stringify(DEFAULT_CAMPAIGNS));
      this.state.dailySpecials = JSON.parse(JSON.stringify(DEFAULT_DAILY_SPECIALS));
      this.state.featured = JSON.parse(JSON.stringify(DEFAULT_FEATURED));
      this.saveState();
      localStorage.setItem(STORAGE_KEYS.version, CURRENT_VERSION);
    },

    // ─── Persistência ───────────────────────────────────────────────────

    /**
     * Salva todo o estado atual no localStorage.
     */
    saveState() {
      try {
        localStorage.setItem(STORAGE_KEYS.campaigns, JSON.stringify(this.state.campaigns));
        localStorage.setItem(STORAGE_KEYS.dailySpecials, JSON.stringify(this.state.dailySpecials));
        localStorage.setItem(STORAGE_KEYS.featured, JSON.stringify(this.state.featured));
        localStorage.setItem(STORAGE_KEYS.version, CURRENT_VERSION);
      } catch (e) {
        console.error('[CampaignSystem] Erro ao salvar estado:', e);
      }
    },

    // ─── Consultas de Estado Ativo ──────────────────────────────────────

    /**
     * Retorna campanhas que estão ativas NESTE MOMENTO.
     *
     * Para campanhas recorrentes:
     *   - Verifica se o dia da semana atual está em daysOfWeek
     *   - Verifica se o horário atual está entre startTime e endTime
     *
     * Para campanhas pontuais (one-time):
     *   - Verifica se a data atual está entre startDate e endDate
     *   - Verifica se o horário atual está entre startTime e endTime
     *
     * @returns {Array} Campanhas ativas agora
     */
    getActiveCampaigns() {
      const now = new Date();
      const today = now.getDay(); // 0=Domingo, 6=Sábado

      return this.state.campaigns.filter(campaign => {
        // Campanha desativada manualmente
        if (!campaign.active) return false;

        // Verificação de horário (comum a ambos os tipos)
        if (!this.isNowBetween(campaign.startTime, campaign.endTime)) return false;

        if (campaign.type === 'recurring') {
          // Recorrente: verifica dia da semana
          return Array.isArray(campaign.daysOfWeek) && campaign.daysOfWeek.includes(today);
        } else if (campaign.type === 'one-time') {
          // Pontual: verifica intervalo de datas
          return this.isTodayBetween(campaign.startDate, campaign.endDate);
        }

        return false;
      });
    },

    /**
     * Retorna o prato do dia de HOJE, ou null se não houver.
     * Usa o dia da semana atual (0=Domingo) como chave.
     *
     * @returns {Object|null} { dishId, label } ou null
     */
    getDailySpecial() {
      const dayKey = String(new Date().getDay());
      const special = this.state.dailySpecials[dayKey];
      return special && special.dishId ? special : null;
    },

    /**
     * Retorna a lista de pratos em destaque que estão ativos.
     *
     * @returns {Array} Itens de destaque ativos
     */
    getFeaturedDishes() {
      return this.state.featured.filter(item => item.active);
    },

    // ─── Agregação de Destaques ─────────────────────────────────────────

    /**
     * Agrega todos os destaques do dia em uma lista unificada.
     * Combina: prato do dia + campanhas ativas + pratos em destaque.
     *
     * @param {Array} dishes - Array completo de pratos para lookup
     * @returns {Array} Lista de destaques com formato padronizado:
     *   { dishId, dish, highlightType, label, color }
     */
    getHighlightsForToday(dishes) {
      if (!Array.isArray(dishes)) return [];

      const highlights = [];
      const addedDishIds = new Set(); // Evita duplicatas

      /**
       * Busca um prato pelo ID no array de pratos.
       * @param {string} id - ID do prato
       * @returns {Object|null}
       */
      const findDish = (id) => dishes.find(d => d.id === id) || null;

      // 1) Prato do Dia — tem prioridade máxima
      const dailySpecial = this.getDailySpecial();
      if (dailySpecial) {
        const dish = findDish(dailySpecial.dishId);
        if (dish) {
          highlights.push({
            dishId: dailySpecial.dishId,
            dish: dish,
            highlightType: 'daily',
            label: dailySpecial.label || '⭐ Prato do Dia',
            color: '#E5A91A'
          });
          addedDishIds.add(dailySpecial.dishId);
        }
      }

      // 2) Campanhas Ativas — pratos promovidos por campanhas vigentes
      const activeCampaigns = this.getActiveCampaigns();
      for (const campaign of activeCampaigns) {
        if (!Array.isArray(campaign.dishes)) continue;
        for (const dishId of campaign.dishes) {
          if (addedDishIds.has(dishId)) continue;
          const dish = findDish(dishId);
          if (dish) {
            highlights.push({
              dishId: dishId,
              dish: dish,
              highlightType: 'campaign',
              label: campaign.badgeLabel || campaign.name,
              color: campaign.badgeColor || '#e74c3c'
            });
            addedDishIds.add(dishId);
          }
        }
      }

      // 3) Destaques / Featured — pratos em evidência permanente
      const featuredDishes = this.getFeaturedDishes();
      for (const featured of featuredDishes) {
        if (addedDishIds.has(featured.dishId)) continue;
        const dish = findDish(featured.dishId);
        if (dish) {
          highlights.push({
            dishId: featured.dishId,
            dish: dish,
            highlightType: 'featured',
            label: featured.badge || '⭐ Destaque',
            color: featured.badgeColor || '#E5A91A'
          });
          addedDishIds.add(featured.dishId);
        }
      }

      return highlights;
    },

    /**
     * Verifica se um prato possui badge especial (campanha, destaque ou prato do dia).
     *
     * Prioridade: Prato do Dia > Campanha Ativa > Destaque
     *
     * @param {string} dishId - ID do prato
     * @returns {Object|null} { label, color } ou null
     */
    getDishBadge(dishId) {
      // 1) Prato do Dia — prioridade máxima
      const dailySpecial = this.getDailySpecial();
      if (dailySpecial && dailySpecial.dishId === dishId) {
        return {
          label: dailySpecial.label || '⭐ Prato do Dia',
          color: '#E5A91A'
        };
      }

      // 2) Campanhas Ativas
      const activeCampaigns = this.getActiveCampaigns();
      for (const campaign of activeCampaigns) {
        if (Array.isArray(campaign.dishes) && campaign.dishes.includes(dishId)) {
          return {
            label: campaign.badgeLabel || campaign.name,
            color: campaign.badgeColor || '#e74c3c'
          };
        }
      }

      // 3) Destaques / Featured
      const featuredDishes = this.getFeaturedDishes();
      for (const featured of featuredDishes) {
        if (featured.dishId === dishId) {
          return {
            label: featured.badge || '⭐ Destaque',
            color: featured.badgeColor || '#E5A91A'
          };
        }
      }

      return null;
    },

    // ─── Helpers de Tempo ───────────────────────────────────────────────

    /**
     * Verifica se o horário ATUAL está entre startTime e endTime.
     * Suporta intervalos que cruzam a meia-noite (ex: 22:00 - 02:00).
     *
     * @param {string} startTime - Horário de início no formato "HH:MM"
     * @param {string} endTime   - Horário de término no formato "HH:MM"
     * @returns {boolean}
     */
    isNowBetween(startTime, endTime) {
      if (!startTime || !endTime) return true; // Sem restrição de horário

      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const [startH, startM] = startTime.split(':').map(Number);
      const [endH, endM] = endTime.split(':').map(Number);

      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      if (endMinutes >= startMinutes) {
        // Intervalo normal (ex: 11:00 - 15:00)
        return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
      } else {
        // Intervalo que cruza a meia-noite (ex: 22:00 - 02:00)
        return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
      }
    },

    /**
     * Verifica se a data de HOJE está entre startDate e endDate (inclusive).
     *
     * @param {string} startDate - Data de início no formato "YYYY-MM-DD"
     * @param {string} endDate   - Data de término no formato "YYYY-MM-DD"
     * @returns {boolean}
     */
    isTodayBetween(startDate, endDate) {
      if (!startDate || !endDate) return true; // Sem restrição de data

      // Monta a data de hoje no formato YYYY-MM-DD local
      const now = new Date();
      const todayStr =
        now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0');

      // Comparação lexicográfica funciona para formato YYYY-MM-DD
      return todayStr >= startDate && todayStr <= endDate;
    },

    // ─── Renderização: Seção de Destaques (público) ─────────────────────

    /**
     * Renderiza a seção "🔥 Destaques de Hoje" com scroll horizontal.
     * Exibe cards de destaque com imagem, badge, nome e preço.
     *
     * @param {Array} dishes - Array completo de pratos
     * @returns {string} HTML da seção de destaques
     */
    renderHighlightsSection(dishes) {
      const highlights = this.getHighlightsForToday(dishes);

      // Sem destaques? Não renderiza nada
      if (highlights.length === 0) return '';

      // Monta os cards de destaque
      const cards = highlights.map(item => {
        const dish = item.dish;
        const price = dish.price != null
          ? 'R$ ' + Number(dish.price).toFixed(2).replace('.', ',')
          : '';

        // Imagem do prato ou fallback com emoji
        const imageHtml = dish.image
          ? `<img class="highlight-card-img" src="${this._escapeHtml(dish.image)}" alt="${this._escapeHtml(dish.name)}" loading="lazy">`
          : `<div class="highlight-card-img highlight-card-img--fallback">${dish.emoji || '🍽️'}</div>`;

        // Classe especial para prato do dia
        const dailyClass = item.highlightType === 'daily' ? ' highlight-card--daily' : '';

        return `
          <div class="highlight-card${dailyClass}" onclick="App.openDishModal('${this._escapeHtml(dish.id)}')">
            ${imageHtml}
            <span class="highlight-badge" style="background:${this._escapeHtml(item.color)}">
              ${this._escapeHtml(item.label)}
            </span>
            <div class="highlight-info">
              <span class="highlight-name">${this._escapeHtml(dish.name)}</span>
              ${price ? `<span class="highlight-price">${price}</span>` : ''}
            </div>
          </div>`;
      }).join('');

      return `
        <section class="highlights-section">
          <div class="highlights-header">
            <h2>🔥 Destaques de Hoje</h2>
            <span class="highlights-day">${DIAS_SEMANA[new Date().getDay()]}</span>
          </div>
          <div class="highlights-scroll">
            ${cards}
          </div>
        </section>`;
    },

    // ─── Renderização: Painel Admin (Cardápio Vivo) ─────────────────────

    /**
     * Renderiza o painel administrativo completo do "Cardápio Vivo".
     * Contém 3 sub-seções:
     *   1. PRATO DO DIA — selecionar prato + rótulo para cada dia da semana
     *   2. DESTAQUES — lista de pratos em destaque + formulário de adição
     *   3. CAMPANHAS — CRUD completo de campanhas
     *
     * @param {Array} dishes     - Array completo de pratos
     * @param {Array} categories - Array de categorias para agrupamento
     * @returns {string} HTML do painel admin
     */
    renderAdminCampaigns(dishes, categories) {
      const dishOptions = this._buildDishOptions(dishes, categories);

      return `
        <div class="campaign-admin-section">
          <h2 style="margin-bottom:18px;color:var(--text-primary)">📡 Cardápio Vivo</h2>
          <p style="color:var(--text-secondary);margin-bottom:24px;font-size:0.95rem">
            Gerencie campanhas, pratos do dia e destaques em tempo real.
          </p>

          ${this._renderDailySpecialsAdmin(dishOptions)}
          ${this._renderFeaturedAdmin(dishOptions)}
          ${this._renderCampaignsAdmin(dishes, categories, dishOptions)}
        </div>`;
    },

    /**
     * Sub-seção Admin: Prato do Dia.
     * Um dropdown de prato e um campo de rótulo para cada dia da semana.
     *
     * @param {string} dishOptions - HTML das opções de pratos
     * @returns {string} HTML
     * @private
     */
    _renderDailySpecialsAdmin(dishOptions) {
      const rows = DIAS_SEMANA.map((dia, index) => {
        const special = this.state.dailySpecials[String(index)];
        const selectedDishId = special ? special.dishId : '';
        const label = special ? special.label : '';

        return `
          <div class="daily-special-row" data-day="${index}">
            <label class="daily-special-day">${dia}</label>
            <select class="daily-special-select" id="campaign-daily-dish-${index}">
              <option value="">— Sem prato do dia —</option>
              ${this._markSelected(dishOptions, selectedDishId)}
            </select>
            <input type="text"
                   id="campaign-daily-label-${index}"
                   class="daily-special-label-input"
                   placeholder="Ex: 🥩 Parmegiana da Casa"
                   value="${this._escapeHtml(label)}"
                   style="flex:1;padding:8px 10px;border:1px solid var(--border-color);border-radius:8px;background:var(--bg-primary);color:var(--text-primary)">
            <button class="btn-admin-save"
                    onclick="CampaignSystem.handleAdminAction('save-daily', { day: ${index}, dishId: document.getElementById('campaign-daily-dish-${index}').value, label: document.getElementById('campaign-daily-label-${index}').value })"
                    title="Salvar prato do dia">
              💾
            </button>
          </div>`;
      }).join('');

      return `
        <div class="campaign-admin-subsection">
          <h3 class="campaign-admin-subtitle">🍽️ Prato do Dia</h3>
          <p class="campaign-admin-desc">Defina o prato especial de cada dia da semana.</p>
          ${rows}
        </div>`;
    },

    /**
     * Sub-seção Admin: Destaques / Featured.
     * Lista de destaques atuais + formulário para adicionar novo.
     *
     * @param {string} dishOptions - HTML das opções de pratos
     * @returns {string} HTML
     * @private
     */
    _renderFeaturedAdmin(dishOptions) {
      // Lista de destaques existentes
      const featuredRows = this.state.featured.map((item, index) => {
        return `
          <div class="featured-admin-row" data-index="${index}">
            <span class="featured-badge-preview" style="background:${this._escapeHtml(item.badgeColor)}">
              ${this._escapeHtml(item.badge)}
            </span>
            <span class="featured-dish-name">${this._escapeHtml(item.dishId)}</span>
            <label class="featured-toggle-label">
              <input type="checkbox"
                     ${item.active ? 'checked' : ''}
                     onchange="CampaignSystem.handleAdminAction('toggle-featured', { index: ${index}, active: this.checked })">
              Ativo
            </label>
            <button class="btn-admin-delete"
                    onclick="CampaignSystem.handleAdminAction('delete-featured', { index: ${index} })"
                    title="Remover destaque">
              🗑️
            </button>
          </div>`;
      }).join('');

      // Formulário para adicionar novo destaque
      const addForm = `
        <div class="featured-add-form" style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          <select id="campaign-featured-dish" style="flex:1;min-width:150px;padding:8px 10px;border:1px solid var(--border-color);border-radius:8px;background:var(--bg-primary);color:var(--text-primary)">
            <option value="">Selecione um prato</option>
            ${dishOptions}
          </select>
          <input type="text"
                 id="campaign-featured-badge"
                 placeholder="Ex: ⭐ Sugestão do Chef"
                 style="flex:1;min-width:150px;padding:8px 10px;border:1px solid var(--border-color);border-radius:8px;background:var(--bg-primary);color:var(--text-primary)">
          <input type="color"
                 id="campaign-featured-color"
                 value="#E5A91A"
                 style="width:42px;height:38px;border:1px solid var(--border-color);border-radius:8px;cursor:pointer;padding:2px"
                 title="Cor do badge">
          <button class="btn-admin-add"
                  onclick="CampaignSystem.handleAdminAction('save-featured', {
                    dishId: document.getElementById('campaign-featured-dish').value,
                    badge: document.getElementById('campaign-featured-badge').value,
                    badgeColor: document.getElementById('campaign-featured-color').value
                  })">
            ➕ Adicionar
          </button>
        </div>`;

      return `
        <div class="campaign-admin-subsection">
          <h3 class="campaign-admin-subtitle">⭐ Destaques</h3>
          <p class="campaign-admin-desc">Pratos que aparecem em destaque no cardápio.</p>
          ${featuredRows || '<p style="color:var(--text-secondary);font-style:italic">Nenhum destaque cadastrado.</p>'}
          ${addForm}
        </div>`;
    },

    /**
     * Sub-seção Admin: Campanhas.
     * Lista de campanhas existentes + formulário completo de CRUD.
     *
     * @param {Array}  dishes      - Array de pratos
     * @param {Array}  categories  - Array de categorias
     * @param {string} dishOptions - HTML das opções de pratos
     * @returns {string} HTML
     * @private
     */
    _renderCampaignsAdmin(dishes, categories, dishOptions) {
      // Lista de campanhas existentes
      const campaignRows = this.state.campaigns.map((campaign, index) => {
        const statusClass = campaign.active ? 'campaign-status--active' : 'campaign-status--inactive';
        const statusText = campaign.active ? '🟢 Ativa' : '🔴 Inativa';
        const typeLabel = campaign.type === 'recurring' ? '🔄 Recorrente' : '📅 Pontual';

        // Resumo dos dias/datas
        let scheduleInfo = '';
        if (campaign.type === 'recurring' && Array.isArray(campaign.daysOfWeek)) {
          const days = campaign.daysOfWeek.map(d => DIAS_SEMANA_ABREV[d]).join(', ');
          scheduleInfo = `${days} • ${campaign.startTime || '?'} - ${campaign.endTime || '?'}`;
        } else if (campaign.type === 'one-time') {
          scheduleInfo = `${campaign.startDate || '?'} a ${campaign.endDate || '?'} • ${campaign.startTime || '?'} - ${campaign.endTime || '?'}`;
        }

        return `
          <div class="campaign-admin-row" data-campaign-id="${this._escapeHtml(campaign.id)}">
            <div class="campaign-row-header">
              <span class="campaign-row-name">${this._escapeHtml(campaign.name)}</span>
              <span class="campaign-row-type">${typeLabel}</span>
              <span class="campaign-row-status ${statusClass}">${statusText}</span>
            </div>
            <div class="campaign-row-schedule">${scheduleInfo}</div>
            <div class="campaign-row-actions">
              <button class="btn-admin-edit"
                      onclick="CampaignSystem._fillCampaignForm('${this._escapeHtml(campaign.id)}')"
                      title="Editar campanha">
                ✏️ Editar
              </button>
              <button class="btn-admin-toggle"
                      onclick="CampaignSystem.handleAdminAction('toggle-campaign', { id: '${this._escapeHtml(campaign.id)}' })">
                ${campaign.active ? '⏸️ Desativar' : '▶️ Ativar'}
              </button>
              <button class="btn-admin-delete"
                      onclick="if(confirm('Tem certeza que deseja excluir a campanha &quot;${this._escapeHtml(campaign.name)}&quot;?')) CampaignSystem.handleAdminAction('delete-campaign', { id: '${this._escapeHtml(campaign.id)}' })"
                      title="Excluir campanha">
                🗑️ Excluir
              </button>
            </div>
          </div>`;
      }).join('');

      // Checkboxes de dias da semana para o formulário
      const daysCheckboxes = DIAS_SEMANA.map((dia, index) => {
        return `
          <label class="campaign-day-checkbox">
            <input type="checkbox" id="campaign-form-day-${index}" value="${index}">
            <span>${DIAS_SEMANA_ABREV[index]}</span>
          </label>`;
      }).join('');

      // Checkboxes de pratos para o formulário (agrupados por categoria)
      const dishCheckboxes = this._buildDishCheckboxes(dishes, categories);

      // Formulário completo de campanha
      const campaignForm = `
        <div class="campaign-form" id="campaign-form">
          <h4 class="campaign-form-title" id="campaign-form-title">➕ Nova Campanha</h4>
          <input type="hidden" id="campaign-form-id" value="">

          <div class="campaign-form-group">
            <label for="campaign-form-name">Nome da campanha</label>
            <input type="text" id="campaign-form-name" placeholder="Ex: 🔥 Sextou no VK"
                   style="width:100%;padding:8px 12px;border:1px solid var(--border-color);border-radius:8px;background:var(--bg-primary);color:var(--text-primary)">
          </div>

          <div class="campaign-form-group">
            <label for="campaign-form-desc">Descrição</label>
            <textarea id="campaign-form-desc" rows="2" placeholder="Descreva a campanha..."
                      style="width:100%;padding:8px 12px;border:1px solid var(--border-color);border-radius:8px;background:var(--bg-primary);color:var(--text-primary);resize:vertical"></textarea>
          </div>

          <div class="campaign-form-group">
            <label>Tipo</label>
            <div class="campaign-type-toggle">
              <button type="button" class="campaign-type-btn campaign-type-btn--active"
                      id="campaign-form-type-recurring"
                      onclick="CampaignSystem._toggleCampaignType('recurring')">
                🔄 Recorrente
              </button>
              <button type="button" class="campaign-type-btn"
                      id="campaign-form-type-one-time"
                      onclick="CampaignSystem._toggleCampaignType('one-time')">
                📅 Pontual
              </button>
            </div>
          </div>

          <!-- Campos de dias da semana (recorrente) -->
          <div class="campaign-form-group" id="campaign-form-days-section">
            <label>Dias da Semana</label>
            <div class="campaign-days-grid">
              ${daysCheckboxes}
            </div>
          </div>

          <!-- Campos de datas (pontual) -->
          <div class="campaign-form-group" id="campaign-form-dates-section" style="display:none">
            <label>Período</label>
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
              <input type="date" id="campaign-form-start-date"
                     style="flex:1;padding:8px 10px;border:1px solid var(--border-color);border-radius:8px;background:var(--bg-primary);color:var(--text-primary)">
              <span style="color:var(--text-secondary)">até</span>
              <input type="date" id="campaign-form-end-date"
                     style="flex:1;padding:8px 10px;border:1px solid var(--border-color);border-radius:8px;background:var(--bg-primary);color:var(--text-primary)">
            </div>
          </div>

          <!-- Horário (comum a ambos) -->
          <div class="campaign-form-group">
            <label>Horário de Funcionamento</label>
            <div style="display:flex;gap:8px;align-items:center">
              <input type="time" id="campaign-form-start-time" value="11:00"
                     style="flex:1;padding:8px 10px;border:1px solid var(--border-color);border-radius:8px;background:var(--bg-primary);color:var(--text-primary)">
              <span style="color:var(--text-secondary)">às</span>
              <input type="time" id="campaign-form-end-time" value="23:00"
                     style="flex:1;padding:8px 10px;border:1px solid var(--border-color);border-radius:8px;background:var(--bg-primary);color:var(--text-primary)">
            </div>
          </div>

          <!-- Pratos da campanha -->
          <div class="campaign-form-group">
            <label>Pratos da Campanha</label>
            <div class="campaign-dishes-grid" id="campaign-form-dishes">
              ${dishCheckboxes}
            </div>
          </div>

          <!-- Badge / Selo -->
          <div class="campaign-form-group">
            <label>Selo (Badge)</label>
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
              <input type="text" id="campaign-form-badge" placeholder="Ex: 🔥 Sextou!"
                     style="flex:1;min-width:150px;padding:8px 12px;border:1px solid var(--border-color);border-radius:8px;background:var(--bg-primary);color:var(--text-primary)">
              <input type="color" id="campaign-form-badge-color" value="#e74c3c"
                     style="width:42px;height:38px;border:1px solid var(--border-color);border-radius:8px;cursor:pointer;padding:2px"
                     title="Cor do selo">
              <span class="campaign-badge-preview" id="campaign-form-badge-preview"
                    style="padding:4px 12px;border-radius:12px;font-size:0.85rem;color:#fff;background:#e74c3c">
                🔥 Preview
              </span>
            </div>
          </div>

          <!-- Ativo / Inativo -->
          <div class="campaign-form-group">
            <label class="campaign-active-toggle">
              <input type="checkbox" id="campaign-form-active" checked>
              <span>Campanha ativa</span>
            </label>
          </div>

          <!-- Botões de ação -->
          <div class="campaign-form-actions">
            <button class="btn-admin-save-campaign"
                    onclick="CampaignSystem._submitCampaignForm()">
              💾 Salvar Campanha
            </button>
            <button class="btn-admin-cancel"
                    onclick="CampaignSystem._resetCampaignForm()">
              ❌ Cancelar
            </button>
            <button class="btn-admin-delete" id="campaign-form-delete-btn" style="display:none"
                    onclick="CampaignSystem._deleteCampaignFromForm()">
              🗑️ Excluir
            </button>
          </div>
        </div>`;

      return `
        <div class="campaign-admin-subsection">
          <h3 class="campaign-admin-subtitle">📣 Campanhas</h3>
          <p class="campaign-admin-desc">Crie e gerencie campanhas promocionais.</p>
          ${campaignRows || '<p style="color:var(--text-secondary);font-style:italic">Nenhuma campanha cadastrada.</p>'}
          <hr style="border:0;border-top:1px solid var(--border-color);margin:16px 0">
          ${campaignForm}
        </div>`;
    },

    // ─── Helpers do Formulário Admin ────────────────────────────────────

    /**
     * Alterna a visibilidade dos campos de tipo no formulário de campanha.
     * Exibe campos de dias (recorrente) ou datas (pontual).
     *
     * @param {string} type - 'recurring' ou 'one-time'
     */
    _toggleCampaignType(type) {
      const daysSection = document.getElementById('campaign-form-days-section');
      const datesSection = document.getElementById('campaign-form-dates-section');
      const btnRecurring = document.getElementById('campaign-form-type-recurring');
      const btnOneTime = document.getElementById('campaign-form-type-one-time');

      if (!daysSection || !datesSection) return;

      if (type === 'recurring') {
        daysSection.style.display = '';
        datesSection.style.display = 'none';
        btnRecurring.classList.add('campaign-type-btn--active');
        btnOneTime.classList.remove('campaign-type-btn--active');
      } else {
        daysSection.style.display = 'none';
        datesSection.style.display = '';
        btnRecurring.classList.remove('campaign-type-btn--active');
        btnOneTime.classList.add('campaign-type-btn--active');
      }
    },

    /**
     * Preenche o formulário de campanha com dados de uma campanha existente.
     * Usado para edição.
     *
     * @param {string} campaignId - ID da campanha a editar
     */
    _fillCampaignForm(campaignId) {
      const campaign = this.state.campaigns.find(c => c.id === campaignId);
      if (!campaign) return;

      // Atualiza o título do formulário
      const titleEl = document.getElementById('campaign-form-title');
      if (titleEl) titleEl.textContent = '✏️ Editando: ' + campaign.name;

      // Campos simples
      this._setVal('campaign-form-id', campaign.id);
      this._setVal('campaign-form-name', campaign.name);
      this._setVal('campaign-form-desc', campaign.description || '');
      this._setVal('campaign-form-start-time', campaign.startTime || '');
      this._setVal('campaign-form-end-time', campaign.endTime || '');
      this._setVal('campaign-form-badge', campaign.badgeLabel || '');
      this._setVal('campaign-form-badge-color', campaign.badgeColor || '#e74c3c');
      this._setVal('campaign-form-start-date', campaign.startDate || '');
      this._setVal('campaign-form-end-date', campaign.endDate || '');

      // Ativo
      const activeEl = document.getElementById('campaign-form-active');
      if (activeEl) activeEl.checked = campaign.active;

      // Tipo
      this._toggleCampaignType(campaign.type || 'recurring');

      // Dias da semana
      for (let i = 0; i < 7; i++) {
        const cb = document.getElementById('campaign-form-day-' + i);
        if (cb) cb.checked = Array.isArray(campaign.daysOfWeek) && campaign.daysOfWeek.includes(i);
      }

      // Pratos selecionados
      const dishCheckboxes = document.querySelectorAll('#campaign-form-dishes input[type="checkbox"]');
      dishCheckboxes.forEach(cb => {
        cb.checked = Array.isArray(campaign.dishes) && campaign.dishes.includes(cb.value);
      });

      // Preview do badge
      this._updateBadgePreview();

      // Mostra botão de excluir
      const deleteBtn = document.getElementById('campaign-form-delete-btn');
      if (deleteBtn) deleteBtn.style.display = '';

      // Scroll até o formulário
      const formEl = document.getElementById('campaign-form');
      if (formEl) formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },

    /**
     * Coleta os dados do formulário e envia para handleAdminAction.
     */
    _submitCampaignForm() {
      const id = this._getVal('campaign-form-id');
      const name = this._getVal('campaign-form-name');
      const description = this._getVal('campaign-form-desc');
      const startTime = this._getVal('campaign-form-start-time');
      const endTime = this._getVal('campaign-form-end-time');
      const badgeLabel = this._getVal('campaign-form-badge');
      const badgeColor = this._getVal('campaign-form-badge-color');
      const startDate = this._getVal('campaign-form-start-date');
      const endDate = this._getVal('campaign-form-end-date');

      const activeEl = document.getElementById('campaign-form-active');
      const active = activeEl ? activeEl.checked : true;

      // Determina o tipo pela visibilidade
      const daysSection = document.getElementById('campaign-form-days-section');
      const type = daysSection && daysSection.style.display !== 'none' ? 'recurring' : 'one-time';

      // Coleta dias da semana
      const daysOfWeek = [];
      for (let i = 0; i < 7; i++) {
        const cb = document.getElementById('campaign-form-day-' + i);
        if (cb && cb.checked) daysOfWeek.push(i);
      }

      // Coleta pratos
      const dishes = [];
      const dishCheckboxes = document.querySelectorAll('#campaign-form-dishes input[type="checkbox"]');
      dishCheckboxes.forEach(cb => {
        if (cb.checked) dishes.push(cb.value);
      });

      // Validação mínima
      if (!name || !name.trim()) {
        alert('Por favor, informe o nome da campanha.');
        return;
      }

      const data = {
        id: id || this._generateId(name),
        name: name.trim(),
        description: (description || '').trim(),
        type,
        daysOfWeek,
        startTime,
        endTime,
        startDate: type === 'one-time' ? startDate : null,
        endDate: type === 'one-time' ? endDate : null,
        dishes,
        badgeLabel: (badgeLabel || '').trim(),
        badgeColor: badgeColor || '#e74c3c',
        active,
        isEdit: !!id // sinaliza se é edição
      };

      const result = this.handleAdminAction('save-campaign', data);
      if (result.success) {
        this._resetCampaignForm();
        // Notifica o app para atualizar a UI (se existir)
        if (typeof App !== 'undefined' && typeof App.renderAdmin === 'function') {
          App.renderAdmin();
        }
      }
      alert(result.message);
    },

    /**
     * Reseta o formulário de campanha para o estado inicial (nova campanha).
     */
    _resetCampaignForm() {
      const titleEl = document.getElementById('campaign-form-title');
      if (titleEl) titleEl.textContent = '➕ Nova Campanha';

      this._setVal('campaign-form-id', '');
      this._setVal('campaign-form-name', '');
      this._setVal('campaign-form-desc', '');
      this._setVal('campaign-form-start-time', '11:00');
      this._setVal('campaign-form-end-time', '23:00');
      this._setVal('campaign-form-badge', '');
      this._setVal('campaign-form-badge-color', '#e74c3c');
      this._setVal('campaign-form-start-date', '');
      this._setVal('campaign-form-end-date', '');

      const activeEl = document.getElementById('campaign-form-active');
      if (activeEl) activeEl.checked = true;

      this._toggleCampaignType('recurring');

      // Limpa checkboxes de dias
      for (let i = 0; i < 7; i++) {
        const cb = document.getElementById('campaign-form-day-' + i);
        if (cb) cb.checked = false;
      }

      // Limpa checkboxes de pratos
      const dishCheckboxes = document.querySelectorAll('#campaign-form-dishes input[type="checkbox"]');
      dishCheckboxes.forEach(cb => { cb.checked = false; });

      // Esconde botão de excluir
      const deleteBtn = document.getElementById('campaign-form-delete-btn');
      if (deleteBtn) deleteBtn.style.display = 'none';
    },

    /**
     * Exclui a campanha atualmente carregada no formulário.
     */
    _deleteCampaignFromForm() {
      const id = this._getVal('campaign-form-id');
      if (!id) return;

      const campaign = this.state.campaigns.find(c => c.id === id);
      const campaignName = campaign ? campaign.name : id;

      if (!confirm('Tem certeza que deseja excluir a campanha "' + campaignName + '"?')) return;

      const result = this.handleAdminAction('delete-campaign', { id });
      if (result.success) {
        this._resetCampaignForm();
        if (typeof App !== 'undefined' && typeof App.renderAdmin === 'function') {
          App.renderAdmin();
        }
      }
      alert(result.message);
    },

    /**
     * Atualiza o preview visual do badge no formulário.
     * @private
     */
    _updateBadgePreview() {
      const badge = this._getVal('campaign-form-badge');
      const color = this._getVal('campaign-form-badge-color');
      const preview = document.getElementById('campaign-form-badge-preview');
      if (preview) {
        preview.textContent = badge || '🔥 Preview';
        preview.style.background = color || '#e74c3c';
      }
    },

    // ─── Ações Administrativas ──────────────────────────────────────────

    /**
     * Handler central de ações administrativas.
     * Processa criação, edição e exclusão de campanhas, destaques e pratos do dia.
     *
     * @param {string} action - Tipo de ação:
     *   'save-daily'       — Salvar prato do dia
     *   'save-featured'    — Adicionar destaque
     *   'delete-featured'  — Remover destaque
     *   'toggle-featured'  — Ativar/desativar destaque
     *   'save-campaign'    — Criar ou editar campanha
     *   'delete-campaign'  — Excluir campanha
     *   'toggle-campaign'  — Ativar/desativar campanha
     *
     * @param {Object} data - Dados específicos da ação
     * @returns {{ success: boolean, message: string }}
     */
    handleAdminAction(action, data) {
      try {
        switch (action) {

          // ── Prato do Dia ──────────────────────────────────────────
          case 'save-daily': {
            const dayKey = String(data.day);
            if (data.dishId && data.dishId.trim()) {
              this.state.dailySpecials[dayKey] = {
                dishId: data.dishId.trim(),
                label: (data.label || '').trim() || '⭐ Prato do Dia'
              };
            } else {
              // Sem prato selecionado → remove o prato do dia
              this.state.dailySpecials[dayKey] = null;
            }
            this.saveState();
            return { success: true, message: '✅ Prato do dia de ' + DIAS_SEMANA[data.day] + ' atualizado!' };
          }

          // ── Destaques (Featured) ──────────────────────────────────
          case 'save-featured': {
            if (!data.dishId || !data.dishId.trim()) {
              return { success: false, message: '⚠️ Selecione um prato para destacar.' };
            }
            if (!data.badge || !data.badge.trim()) {
              return { success: false, message: '⚠️ Informe o texto do selo (badge).' };
            }

            // Verifica se o prato já está em destaque
            const alreadyFeatured = this.state.featured.some(f => f.dishId === data.dishId.trim());
            if (alreadyFeatured) {
              return { success: false, message: '⚠️ Este prato já está em destaque.' };
            }

            this.state.featured.push({
              dishId: data.dishId.trim(),
              badge: data.badge.trim(),
              badgeColor: data.badgeColor || '#E5A91A',
              active: true
            });
            this.saveState();

            // Atualiza UI se possível
            this._tryRefreshAdmin();
            return { success: true, message: '✅ Destaque adicionado com sucesso!' };
          }

          case 'delete-featured': {
            const index = data.index;
            if (index < 0 || index >= this.state.featured.length) {
              return { success: false, message: '⚠️ Destaque não encontrado.' };
            }
            const removed = this.state.featured.splice(index, 1);
            this.saveState();
            this._tryRefreshAdmin();
            return { success: true, message: '✅ Destaque "' + (removed[0] ? removed[0].badge : '') + '" removido!' };
          }

          case 'toggle-featured': {
            const idx = data.index;
            if (idx < 0 || idx >= this.state.featured.length) {
              return { success: false, message: '⚠️ Destaque não encontrado.' };
            }
            this.state.featured[idx].active = data.active;
            this.saveState();
            return { success: true, message: '✅ Destaque ' + (data.active ? 'ativado' : 'desativado') + '!' };
          }

          // ── Campanhas ─────────────────────────────────────────────
          case 'save-campaign': {
            if (!data.name || !data.name.trim()) {
              return { success: false, message: '⚠️ Informe o nome da campanha.' };
            }

            const isEdit = data.isEdit || false;
            const campaignId = data.id || this._generateId(data.name);

            const campaignObj = {
              id: campaignId,
              name: data.name.trim(),
              description: (data.description || '').trim(),
              type: data.type || 'recurring',
              daysOfWeek: Array.isArray(data.daysOfWeek) ? data.daysOfWeek.map(Number) : [],
              startTime: data.startTime || '',
              endTime: data.endTime || '',
              startDate: data.startDate || null,
              endDate: data.endDate || null,
              dishes: Array.isArray(data.dishes) ? data.dishes : [],
              badgeLabel: (data.badgeLabel || '').trim(),
              badgeColor: data.badgeColor || '#e74c3c',
              active: data.active !== undefined ? data.active : true,
              createdAt: ''
            };

            if (isEdit) {
              // Edição — substitui campanha existente
              const existingIndex = this.state.campaigns.findIndex(c => c.id === campaignId);
              if (existingIndex === -1) {
                return { success: false, message: '⚠️ Campanha não encontrada para edição.' };
              }
              // Preserva a data de criação original
              campaignObj.createdAt = this.state.campaigns[existingIndex].createdAt;
              this.state.campaigns[existingIndex] = campaignObj;
            } else {
              // Criação — verifica duplicidade de ID
              const exists = this.state.campaigns.some(c => c.id === campaignId);
              if (exists) {
                return { success: false, message: '⚠️ Já existe uma campanha com este ID.' };
              }
              // Define data de criação
              const now = new Date();
              campaignObj.createdAt =
                now.getFullYear() + '-' +
                String(now.getMonth() + 1).padStart(2, '0') + '-' +
                String(now.getDate()).padStart(2, '0');
              this.state.campaigns.push(campaignObj);
            }

            this.saveState();
            return {
              success: true,
              message: isEdit
                ? '✅ Campanha "' + campaignObj.name + '" atualizada!'
                : '✅ Campanha "' + campaignObj.name + '" criada!'
            };
          }

          case 'delete-campaign': {
            const idx = this.state.campaigns.findIndex(c => c.id === data.id);
            if (idx === -1) {
              return { success: false, message: '⚠️ Campanha não encontrada.' };
            }
            const removed = this.state.campaigns.splice(idx, 1);
            this.saveState();
            this._tryRefreshAdmin();
            return { success: true, message: '✅ Campanha "' + removed[0].name + '" excluída!' };
          }

          case 'toggle-campaign': {
            const campaign = this.state.campaigns.find(c => c.id === data.id);
            if (!campaign) {
              return { success: false, message: '⚠️ Campanha não encontrada.' };
            }
            campaign.active = !campaign.active;
            this.saveState();
            this._tryRefreshAdmin();
            return {
              success: true,
              message: '✅ Campanha "' + campaign.name + '" ' + (campaign.active ? 'ativada' : 'desativada') + '!'
            };
          }

          default:
            return { success: false, message: '⚠️ Ação desconhecida: ' + action };
        }
      } catch (err) {
        console.error('[CampaignSystem] Erro em handleAdminAction:', action, err);
        return { success: false, message: '❌ Erro inesperado: ' + err.message };
      }
    },

    // ─── Utilitários Internos ───────────────────────────────────────────

    /**
     * Gera um ID slug a partir de um nome.
     * Remove acentos, converte para minúsculas, substitui espaços por hifens.
     *
     * @param {string} name - Nome para gerar o ID
     * @returns {string} ID no formato slug
     * @private
     */
    _generateId(name) {
      return name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^\w\s-]/g, '')         // Remove caracteres especiais
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')            // Espaços → hifens
        .replace(/-+/g, '-');            // Hifens duplicados → simples
    },

    /**
     * Escapa caracteres HTML para prevenir XSS.
     *
     * @param {string} str - String a escapar
     * @returns {string} String escapada
     * @private
     */
    _escapeHtml(str) {
      if (str == null) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    },

    /**
     * Constrói opções HTML de pratos agrupadas por categoria (para <select>).
     *
     * @param {Array} dishes     - Array de pratos
     * @param {Array} categories - Array de categorias
     * @returns {string} HTML das opções
     * @private
     */
    _buildDishOptions(dishes, categories) {
      if (!Array.isArray(dishes)) return '';

      // Se não houver categorias, lista simples
      if (!Array.isArray(categories) || categories.length === 0) {
        return dishes.map(d =>
          `<option value="${this._escapeHtml(d.id)}">${this._escapeHtml(d.emoji || '')} ${this._escapeHtml(d.name)}</option>`
        ).join('');
      }

      // Agrupa por categoria
      let html = '';
      for (const cat of categories) {
        const catDishes = dishes.filter(d => d.category === cat.id);
        if (catDishes.length === 0) continue;
        html += `<optgroup label="${this._escapeHtml(cat.emoji || '')} ${this._escapeHtml(cat.name)}">`;
        for (const d of catDishes) {
          html += `<option value="${this._escapeHtml(d.id)}">${this._escapeHtml(d.emoji || '')} ${this._escapeHtml(d.name)}</option>`;
        }
        html += '</optgroup>';
      }

      // Pratos sem categoria
      const uncategorized = dishes.filter(d => !categories.some(c => c.id === d.category));
      if (uncategorized.length > 0) {
        html += '<optgroup label="Outros">';
        for (const d of uncategorized) {
          html += `<option value="${this._escapeHtml(d.id)}">${this._escapeHtml(d.emoji || '')} ${this._escapeHtml(d.name)}</option>`;
        }
        html += '</optgroup>';
      }

      return html;
    },

    /**
     * Retorna o HTML de opções de <select> com uma opção pré-selecionada.
     *
     * @param {string} optionsHtml  - HTML base das opções
     * @param {string} selectedValue - Valor a pré-selecionar
     * @returns {string} HTML com selected aplicado
     * @private
     */
    _markSelected(optionsHtml, selectedValue) {
      if (!selectedValue) return optionsHtml;
      // Adiciona 'selected' à option cujo value corresponde
      return optionsHtml.replace(
        new RegExp(`value="${this._escapeRegex(this._escapeHtml(selectedValue))}"`),
        `value="${this._escapeHtml(selectedValue)}" selected`
      );
    },

    /**
     * Escapa caracteres especiais para uso em RegExp.
     * @param {string} str
     * @returns {string}
     * @private
     */
    _escapeRegex(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },

    /**
     * Constrói checkboxes de pratos agrupados por categoria (para formulário de campanha).
     *
     * @param {Array} dishes     - Array de pratos
     * @param {Array} categories - Array de categorias
     * @returns {string} HTML dos checkboxes
     * @private
     */
    _buildDishCheckboxes(dishes, categories) {
      if (!Array.isArray(dishes)) return '<p style="color:var(--text-secondary)">Nenhum prato disponível.</p>';

      let html = '';

      /**
       * Renderiza um bloco de checkboxes de pratos.
       * @param {Array} dishList - Lista de pratos
       * @param {string} groupLabel - Rótulo do grupo (opcional)
       */
      const renderGroup = (dishList, groupLabel) => {
        if (dishList.length === 0) return;
        if (groupLabel) {
          html += `<div class="campaign-dish-group-label">${this._escapeHtml(groupLabel)}</div>`;
        }
        for (const d of dishList) {
          html += `
            <label class="campaign-dish-checkbox">
              <input type="checkbox" value="${this._escapeHtml(d.id)}">
              <span>${this._escapeHtml(d.emoji || '🍽️')} ${this._escapeHtml(d.name)}</span>
            </label>`;
        }
      };

      if (Array.isArray(categories) && categories.length > 0) {
        for (const cat of categories) {
          const catDishes = dishes.filter(d => d.category === cat.id);
          renderGroup(catDishes, (cat.emoji || '') + ' ' + cat.name);
        }
        // Pratos sem categoria
        const uncategorized = dishes.filter(d => !categories.some(c => c.id === d.category));
        renderGroup(uncategorized, 'Outros');
      } else {
        renderGroup(dishes, '');
      }

      return html;
    },

    /**
     * Obtém o valor de um elemento input/select/textarea.
     * @param {string} id - ID do elemento
     * @returns {string}
     * @private
     */
    _getVal(id) {
      const el = document.getElementById(id);
      return el ? el.value : '';
    },

    /**
     * Define o valor de um elemento input/select/textarea.
     * @param {string} id    - ID do elemento
     * @param {string} value - Valor a definir
     * @private
     */
    _setVal(id, value) {
      const el = document.getElementById(id);
      if (el) el.value = value;
    },

    /**
     * Tenta atualizar o painel admin (se o App estiver disponível).
     * @private
     */
    _tryRefreshAdmin() {
      if (typeof App !== 'undefined' && typeof App.renderAdmin === 'function') {
        try { App.renderAdmin(); } catch (e) { /* ignora */ }
      }
    }
  };

  return module;
})();
