/**
 * ============================================================
 * VK Restaurante - Sistema de Ranking de Pratos
 * ============================================================
 * 
 * Módulo autônomo para rastreamento de interações com pratos,
 * cálculo de pontuações, identificação de tendências e
 * renderização de seções de ranking no menu digital.
 * 
 * Este módulo é carregado ANTES do app.js e NÃO referencia
 * o objeto App diretamente. O app.js chamará os métodos
 * do RankingSystem conforme necessário.
 * 
 * ARMAZENAMENTO: localStorage na chave 'vk_interactions'
 * 
 * PONTUAÇÃO:
 *   - view (visualização)  = 1 ponto
 *   - click (clique)       = 2 pontos
 *   - favorite (favorito)  = 3 pontos
 *   - comment (comentário) = 4 pontos
 *   - order (pedido)       = 5 pontos
 * 
 * @author VK Restaurante
 * @version 1.0.0
 */

const RankingSystem = {

  // ============================================================
  // Estado interno - armazena todas as interações em memória
  // ============================================================
  state: {
    interactions: []
  },

  // ============================================================
  // Mapa de pontuação por tipo de interação
  // ============================================================
  POINTS_MAP: {
    view: 1,
    click: 2,
    favorite: 3,
    comment: 4,
    order: 5
  },

  // ============================================================
  // Medalhas para o pódio de pratos mais populares
  // ============================================================
  MEDALS: ['🥇', '🥈', '🥉'],

  // ============================================================
  // Rótulos em português para os tipos de interação
  // ============================================================
  TYPE_LABELS: {
    view: 'Visualizações',
    click: 'Cliques',
    favorite: 'Favoritos',
    comment: 'Comentários',
    order: 'Pedidos'
  },

  // ============================================================
  // Ícones para cada tipo de interação (usado no admin)
  // ============================================================
  TYPE_ICONS: {
    view: '👁️',
    click: '👆',
    favorite: '❤️',
    comment: '💬',
    order: '🛒'
  },

  // ============================================================
  // INICIALIZAÇÃO
  // Carrega as interações salvas do localStorage para o estado
  // ============================================================
  init() {
    try {
      const saved = localStorage.getItem('vk_interactions');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validação: garantir que é um array válido
        if (Array.isArray(parsed)) {
          this.state.interactions = parsed;
        } else {
          console.warn('[RankingSystem] Dados inválidos no localStorage, inicializando vazio.');
          this.state.interactions = [];
        }
      } else {
        this.state.interactions = [];
      }
      console.log(`[RankingSystem] Inicializado com ${this.state.interactions.length} interações carregadas.`);
    } catch (error) {
      // Em caso de JSON corrompido, reinicia com array vazio
      console.error('[RankingSystem] Erro ao carregar interações:', error);
      this.state.interactions = [];
    }
  },

  // ============================================================
  // PERSISTÊNCIA
  // Salva o estado atual das interações no localStorage
  // ============================================================
  saveState() {
    try {
      localStorage.setItem('vk_interactions', JSON.stringify(this.state.interactions));
    } catch (error) {
      console.error('[RankingSystem] Erro ao salvar interações:', error);
    }
  },

  // ============================================================
  // HELPERS DE DATA
  // Funções auxiliares para manipulação de datas
  // ============================================================

  /**
   * Retorna a data atual no formato YYYY-MM-DD
   * @returns {string} Data formatada
   */
  _getToday() {
    return new Date().toISOString().split('T')[0];
  },

  /**
   * Retorna a hora atual (0-23)
   * @returns {number} Hora atual
   */
  _getCurrentHour() {
    return new Date().getHours();
  },

  /**
   * Calcula a data de corte para um período específico
   * @param {string} period - 'today' | 'week' | 'month' | 'all'
   * @returns {string|null} Data de corte no formato YYYY-MM-DD ou null para 'all'
   */
  _getCutoffDate(period) {
    const now = new Date();

    switch (period) {
      case 'today':
        // Retorna a data de hoje (somente interações do dia atual)
        return this._getToday();

      case 'week':
        // Retorna a data de 7 dias atrás
        now.setDate(now.getDate() - 7);
        return now.toISOString().split('T')[0];

      case 'month':
        // Retorna a data de 30 dias atrás
        now.setDate(now.getDate() - 30);
        return now.toISOString().split('T')[0];

      case 'all':
      default:
        // Sem corte - retorna todas as interações
        return null;
    }
  },

  /**
   * Filtra interações por período
   * @param {string} period - 'today' | 'week' | 'month' | 'all'
   * @returns {Array} Interações filtradas
   */
  _filterByPeriod(period) {
    const cutoff = this._getCutoffDate(period);

    // Sem filtro para 'all'
    if (cutoff === null) {
      return this.state.interactions;
    }

    // Para 'today', comparação exata com a data de hoje
    if (period === 'today') {
      return this.state.interactions.filter(i => i.date === cutoff);
    }

    // Para 'week' e 'month', incluir tudo a partir da data de corte
    return this.state.interactions.filter(i => i.date >= cutoff);
  },

  /**
   * Retorna a data de ontem no formato YYYY-MM-DD
   * @returns {string} Data de ontem formatada
   */
  _getYesterday() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  },

  // ============================================================
  // RASTREAMENTO DE INTERAÇÕES
  // Registra uma nova interação do usuário com um prato
  // ============================================================

  /**
   * Registra uma interação com um prato
   * @param {string} dishId - Identificador único do prato
   * @param {string} type - Tipo de interação: 'view' | 'click' | 'favorite' | 'comment' | 'order'
   * @param {string|null} customerId - Identificador opcional do cliente
   */
  trackInteraction(dishId, type, customerId = null) {
    // Validação do tipo de interação
    if (!this.POINTS_MAP.hasOwnProperty(type)) {
      console.warn(`[RankingSystem] Tipo de interação desconhecido: "${type}"`);
      return;
    }

    // Validação do dishId
    if (!dishId) {
      console.warn('[RankingSystem] dishId é obrigatório para registrar interação.');
      return;
    }

    // Criação do registro de interação
    const interaction = {
      id: Date.now(),
      dishId: String(dishId),
      type: type,
      points: this.POINTS_MAP[type],
      date: this._getToday(),
      hour: this._getCurrentHour(),
      customerId: customerId || null
    };

    // Adiciona ao estado e persiste
    this.state.interactions.push(interaction);
    this.saveState();

    console.log(`[RankingSystem] Interação registrada: ${type} no prato ${dishId} (${this.POINTS_MAP[type]} pts)`);
  },

  // ============================================================
  // CONSULTAS DE RANKING
  // Métodos para obter dados de ranking e estatísticas
  // ============================================================

  /**
   * Retorna os pratos mais populares em um período
   * @param {string} period - 'today' | 'week' | 'month' | 'all'
   * @param {number} limit - Número máximo de pratos a retornar
   * @returns {Array<{dishId: string, totalPoints: number, interactionCount: number}>}
   */
  getTopDishes(period = 'today', limit = 10) {
    const filtered = this._filterByPeriod(period);

    // Agrupa por dishId e calcula totais
    const dishMap = {};

    filtered.forEach(interaction => {
      const id = interaction.dishId;
      if (!dishMap[id]) {
        dishMap[id] = {
          dishId: id,
          totalPoints: 0,
          interactionCount: 0
        };
      }
      dishMap[id].totalPoints += interaction.points;
      dishMap[id].interactionCount += 1;
    });

    // Converte para array, ordena por pontuação decrescente e limita
    return Object.values(dishMap)
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, limit);
  },

  /**
   * Retorna os pratos em tendência (crescimento em relação a ontem)
   * Compara as interações de hoje com as de ontem para encontrar
   * pratos com crescimento positivo
   * @param {number} limit - Número máximo de pratos a retornar
   * @returns {Array<{dishId: string, todayPoints: number, yesterdayPoints: number, growth: number}>}
   */
  getTrending(limit = 5) {
    const today = this._getToday();
    const yesterday = this._getYesterday();

    // Calcula pontos de hoje por prato
    const todayMap = {};
    // Calcula pontos de ontem por prato
    const yesterdayMap = {};

    this.state.interactions.forEach(interaction => {
      const id = interaction.dishId;

      if (interaction.date === today) {
        todayMap[id] = (todayMap[id] || 0) + interaction.points;
      } else if (interaction.date === yesterday) {
        yesterdayMap[id] = (yesterdayMap[id] || 0) + interaction.points;
      }
    });

    // Coleta todos os dishIds que aparecem hoje ou ontem
    const allDishIds = new Set([
      ...Object.keys(todayMap),
      ...Object.keys(yesterdayMap)
    ]);

    // Calcula o crescimento de cada prato
    const trending = [];

    allDishIds.forEach(dishId => {
      const todayPoints = todayMap[dishId] || 0;
      const yesterdayPoints = yesterdayMap[dishId] || 0;

      // Cálculo do crescimento:
      // Se ontem foi 0, o crescimento é os pontos de hoje (novo prato popular)
      // Caso contrário, é a diferença percentual ou absoluta
      const growth = todayPoints - yesterdayPoints;

      // Incluir somente pratos com crescimento positivo ou que são novos hoje
      if (growth > 0 || (todayPoints > 0 && yesterdayPoints === 0)) {
        trending.push({
          dishId,
          todayPoints,
          yesterdayPoints,
          growth
        });
      }
    });

    // Ordena por crescimento decrescente e limita
    return trending
      .sort((a, b) => b.growth - a.growth)
      .slice(0, limit);
  },

  /**
   * Retorna estatísticas gerais: prato mais visto, mais clicado, etc.
   * Considera TODAS as interações (sem filtro de período)
   * @returns {{mostViewed: string|null, mostClicked: string|null, mostFavorited: string|null, mostCommented: string|null, mostOrdered: string|null}}
   */
  getStats() {
    // Mapas de contagem por tipo de interação
    const counters = {
      view: {},
      click: {},
      favorite: {},
      comment: {},
      order: {}
    };

    // Contabiliza cada interação no mapa correspondente
    this.state.interactions.forEach(interaction => {
      const { dishId, type } = interaction;
      if (counters[type]) {
        counters[type][dishId] = (counters[type][dishId] || 0) + 1;
      }
    });

    /**
     * Encontra o dishId com maior contagem em um mapa
     * @param {Object} map - Mapa de dishId -> contagem
     * @returns {string|null} dishId com maior contagem ou null
     */
    const findTop = (map) => {
      let topId = null;
      let topCount = 0;

      for (const [dishId, count] of Object.entries(map)) {
        if (count > topCount) {
          topCount = count;
          topId = dishId;
        }
      }

      return topId;
    };

    return {
      mostViewed: findTop(counters.view),
      mostClicked: findTop(counters.click),
      mostFavorited: findTop(counters.favorite),
      mostCommented: findTop(counters.comment),
      mostOrdered: findTop(counters.order)
    };
  },

  /**
   * Retorna a pontuação total de um prato específico (todo o histórico)
   * @param {string} dishId - Identificador do prato
   * @returns {number} Total de pontos do prato
   */
  getDishScore(dishId) {
    return this.state.interactions
      .filter(i => i.dishId === String(dishId))
      .reduce((total, i) => total + i.points, 0);
  },

  // ============================================================
  // HELPERS DE RENDERIZAÇÃO
  // Funções auxiliares para busca de nomes de pratos
  // ============================================================

  /**
   * Busca o nome de um prato no array de pratos do App
   * @param {Array} dishes - Array de pratos com propriedade 'id' e 'name'
   * @param {string} dishId - Identificador do prato
   * @returns {string} Nome do prato ou 'Prato desconhecido'
   */
  _getDishName(dishes, dishId) {
    if (!dishes || !Array.isArray(dishes)) return 'Prato desconhecido';

    const dish = dishes.find(d => String(d.id) === String(dishId));
    return dish ? dish.name : 'Prato desconhecido';
  },

  /**
   * Conta interações de um tipo específico para um prato
   * @param {string} dishId - Identificador do prato
   * @param {string} type - Tipo de interação
   * @returns {number} Contagem de interações
   */
  _countByType(dishId, type) {
    return this.state.interactions
      .filter(i => i.dishId === String(dishId) && i.type === type)
      .length;
  },

  // ============================================================
  // RENDERIZAÇÃO - Seção de Tendências (Público)
  // Gera o HTML da seção "🔥 Mais Pedidos Hoje"
  // ============================================================

  /**
   * Renderiza a seção de pratos em destaque / mais pedidos
   * Mostra o top 3 com medalhas, nomes, pontuação e barras de popularidade
   * Inclui botões de filtro por período: Hoje | Semana | Mês
   * 
   * @param {Array} dishes - Array completo de pratos do App para busca de nomes
   * @returns {string} HTML completo da seção de trending
   */
  renderTrendingSection(dishes) {
    // Obtém o top 3 pratos do dia (padrão inicial)
    const topDishes = this.getTopDishes('today', 3);

    // Pontuação máxima para calcular a largura relativa das barras
    const maxPoints = topDishes.length > 0 ? topDishes[0].totalPoints : 1;

    // Geração dos cards dos pratos em destaque
    let cardsHTML = '';

    if (topDishes.length === 0) {
      // Mensagem quando não há dados ainda
      cardsHTML = `
        <div class="ranking-card ranking-empty" style="
          text-align: center;
          padding: 24px 16px;
          color: var(--text-secondary, #888);
          font-style: italic;
        ">
          <p style="font-size: 2em; margin-bottom: 8px;">📊</p>
          <p>Nenhuma interação registrada ainda.</p>
          <p style="font-size: 0.85em; margin-top: 4px;">Os pratos mais populares aparecerão aqui!</p>
        </div>
      `;
    } else {
      topDishes.forEach((dish, index) => {
        const name = this._getDishName(dishes, dish.dishId);
        const medal = this.MEDALS[index] || `#${index + 1}`;
        const barWidth = Math.round((dish.totalPoints / maxPoints) * 100);

        cardsHTML += `
          <div class="ranking-card" style="
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            margin-bottom: 8px;
            background: var(--card-bg, #fff);
            border-radius: 12px;
            box-shadow: var(--card-shadow, 0 2px 8px rgba(0,0,0,0.08));
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          ">
            <!-- Medalha / Posição -->
            <span class="ranking-medal" style="
              font-size: 1.8em;
              min-width: 40px;
              text-align: center;
              line-height: 1;
            ">${medal}</span>

            <!-- Informações do prato -->
            <div style="flex: 1; min-width: 0;">
              <div style="
                font-weight: 600;
                font-size: 0.95em;
                color: var(--text-primary, #333);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              ">${name}</div>

              <!-- Barra de popularidade animada -->
              <div class="ranking-bar" style="
                width: 100%;
                height: 8px;
                background: var(--ranking-bar-bg, #e9ecef);
                border-radius: 4px;
                margin-top: 6px;
                overflow: hidden;
              ">
                <div class="ranking-bar-fill" style="
                  width: ${barWidth}%;
                  height: 100%;
                  background: var(--ranking-bar-fill, linear-gradient(90deg, #ff6b35, #f7c948));
                  border-radius: 4px;
                  transition: width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                  animation: rankingBarGrow 1s ease-out;
                "></div>
              </div>
            </div>

            <!-- Pontuação -->
            <div style="
              text-align: right;
              min-width: 55px;
            ">
              <span style="
                font-weight: 700;
                font-size: 1.1em;
                color: var(--accent-color, #ff6b35);
              ">${dish.totalPoints}</span>
              <div style="
                font-size: 0.7em;
                color: var(--text-secondary, #888);
                margin-top: 2px;
              ">${dish.interactionCount} interações</div>
            </div>
          </div>
        `;
      });
    }

    // HTML completo da seção de trending
    return `
      <section class="ranking-section" style="
        padding: 16px;
        margin-bottom: 16px;
      ">
        <!-- Cabeçalho da seção -->
        <div class="ranking-header" style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 8px;
        ">
          <h2 style="
            margin: 0;
            font-size: 1.2em;
            font-weight: 700;
            color: var(--text-primary, #333);
          ">🔥 Mais Pedidos Hoje</h2>

          <!-- Botões de filtro por período -->
          <div style="display: flex; gap: 6px;">
            <button class="ranking-filter-btn active" data-period="today"
              onclick="RankingSystem._handleFilterClick(this, 'today')"
              style="
                padding: 6px 14px;
                border: 1px solid var(--border-color, #ddd);
                border-radius: 20px;
                background: var(--accent-color, #ff6b35);
                color: var(--accent-text, #fff);
                font-size: 0.8em;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            ">Hoje</button>

            <button class="ranking-filter-btn" data-period="week"
              onclick="RankingSystem._handleFilterClick(this, 'week')"
              style="
                padding: 6px 14px;
                border: 1px solid var(--border-color, #ddd);
                border-radius: 20px;
                background: var(--card-bg, #fff);
                color: var(--text-primary, #333);
                font-size: 0.8em;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            ">Semana</button>

            <button class="ranking-filter-btn" data-period="month"
              onclick="RankingSystem._handleFilterClick(this, 'month')"
              style="
                padding: 6px 14px;
                border: 1px solid var(--border-color, #ddd);
                border-radius: 20px;
                background: var(--card-bg, #fff);
                color: var(--text-primary, #333);
                font-size: 0.8em;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            ">Mês</button>
          </div>
        </div>

        <!-- Cards dos pratos em destaque -->
        <div class="ranking-cards-container" id="ranking-cards-container">
          ${cardsHTML}
        </div>
      </section>

      <!-- Animação CSS para a barra de popularidade -->
      <style>
        @keyframes rankingBarGrow {
          from { width: 0%; }
        }

        .ranking-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--card-shadow-hover, 0 4px 16px rgba(0,0,0,0.12)) !important;
        }

        .ranking-filter-btn:hover {
          opacity: 0.85;
        }
      </style>
    `;
  },

  // ============================================================
  // HANDLER DE FILTRO - Troca de período na seção de trending
  // ============================================================

  /**
   * Manipula o clique nos botões de filtro de período
   * Atualiza visualmente o botão ativo e recarrega os cards
   * 
   * NOTA: Este método precisa que o App forneça o array de pratos.
   * Ele tenta acessar o container diretamente no DOM.
   * 
   * @param {HTMLElement} btn - Botão clicado
   * @param {string} period - Período selecionado
   */
  _handleFilterClick(btn, period) {
    // Atualiza os estilos dos botões de filtro
    const allBtns = btn.parentElement.querySelectorAll('.ranking-filter-btn');
    allBtns.forEach(b => {
      b.classList.remove('active');
      b.style.background = 'var(--card-bg, #fff)';
      b.style.color = 'var(--text-primary, #333)';
    });

    btn.classList.add('active');
    btn.style.background = 'var(--accent-color, #ff6b35)';
    btn.style.color = 'var(--accent-text, #fff)';

    // Atualiza o título com base no período
    const headerEl = btn.closest('.ranking-section')?.querySelector('h2');
    if (headerEl) {
      const titles = {
        today: '🔥 Mais Pedidos Hoje',
        week: '🔥 Mais Pedidos da Semana',
        month: '🔥 Mais Pedidos do Mês'
      };
      headerEl.textContent = titles[period] || '🔥 Mais Pedidos';
    }

    // Obtém os pratos do período selecionado
    const topDishes = this.getTopDishes(period, 3);
    const maxPoints = topDishes.length > 0 ? topDishes[0].totalPoints : 1;

    // Tenta obter o array de pratos do App (se disponível globalmente)
    let dishes = [];
    if (typeof App !== 'undefined' && App.state && App.state.dishes) {
      dishes = App.state.dishes;
    }

    // Reconstrói os cards
    const container = document.getElementById('ranking-cards-container');
    if (!container) return;

    if (topDishes.length === 0) {
      container.innerHTML = `
        <div class="ranking-card ranking-empty" style="
          text-align: center;
          padding: 24px 16px;
          color: var(--text-secondary, #888);
          font-style: italic;
        ">
          <p style="font-size: 2em; margin-bottom: 8px;">📊</p>
          <p>Nenhuma interação neste período.</p>
        </div>
      `;
      return;
    }

    let html = '';
    topDishes.forEach((dish, index) => {
      const name = this._getDishName(dishes, dish.dishId);
      const medal = this.MEDALS[index] || `#${index + 1}`;
      const barWidth = Math.round((dish.totalPoints / maxPoints) * 100);

      html += `
        <div class="ranking-card" style="
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          margin-bottom: 8px;
          background: var(--card-bg, #fff);
          border-radius: 12px;
          box-shadow: var(--card-shadow, 0 2px 8px rgba(0,0,0,0.08));
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        ">
          <span class="ranking-medal" style="
            font-size: 1.8em;
            min-width: 40px;
            text-align: center;
            line-height: 1;
          ">${medal}</span>

          <div style="flex: 1; min-width: 0;">
            <div style="
              font-weight: 600;
              font-size: 0.95em;
              color: var(--text-primary, #333);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            ">${name}</div>

            <div class="ranking-bar" style="
              width: 100%;
              height: 8px;
              background: var(--ranking-bar-bg, #e9ecef);
              border-radius: 4px;
              margin-top: 6px;
              overflow: hidden;
            ">
              <div class="ranking-bar-fill" style="
                width: ${barWidth}%;
                height: 100%;
                background: var(--ranking-bar-fill, linear-gradient(90deg, #ff6b35, #f7c948));
                border-radius: 4px;
                transition: width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                animation: rankingBarGrow 1s ease-out;
              "></div>
            </div>
          </div>

          <div style="text-align: right; min-width: 55px;">
            <span style="
              font-weight: 700;
              font-size: 1.1em;
              color: var(--accent-color, #ff6b35);
            ">${dish.totalPoints}</span>
            <div style="
              font-size: 0.7em;
              color: var(--text-secondary, #888);
              margin-top: 2px;
            ">${dish.interactionCount} interações</div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  // ============================================================
  // RENDERIZAÇÃO - Painel de Estatísticas do Admin
  // Gera o HTML completo do painel de estatísticas administrativas
  // ============================================================

  /**
   * Renderiza o painel de estatísticas para a área administrativa
   * Mostra:
   *   - Prato mais visto, mais clicado, mais favoritado,
   *     mais comentado e mais pedido
   *   - Gráfico de barras comparando os 5 pratos com mais pontos
   * 
   * @param {Array} dishes - Array completo de pratos do App para busca de nomes
   * @returns {string} HTML completo do painel de estatísticas admin
   */
  renderAdminStats(dishes) {
    // Obtém as estatísticas gerais
    const stats = this.getStats();

    // Obtém o top 5 pratos de todos os tempos para o gráfico
    const top5 = this.getTopDishes('all', 5);
    const maxPoints = top5.length > 0 ? top5[0].totalPoints : 1;

    // ---- Geração dos cards de estatísticas por tipo ----

    const statEntries = [
      { key: 'mostViewed',    type: 'view',     label: 'Mais Visualizado' },
      { key: 'mostClicked',   type: 'click',    label: 'Mais Clicado' },
      { key: 'mostFavorited', type: 'favorite', label: 'Mais Favoritado' },
      { key: 'mostCommented', type: 'comment',  label: 'Mais Comentado' },
      { key: 'mostOrdered',   type: 'order',    label: 'Mais Pedido' }
    ];

    let statCardsHTML = '';

    statEntries.forEach(entry => {
      const dishId = stats[entry.key];
      const name = dishId ? this._getDishName(dishes, dishId) : '—';
      const count = dishId ? this._countByType(dishId, entry.type) : 0;
      const icon = this.TYPE_ICONS[entry.type];

      statCardsHTML += `
        <div class="admin-stat-card" style="
          flex: 1;
          min-width: 140px;
          padding: 16px;
          background: var(--card-bg, #fff);
          border-radius: 12px;
          box-shadow: var(--card-shadow, 0 2px 8px rgba(0,0,0,0.08));
          text-align: center;
          transition: transform 0.2s ease;
        ">
          <div style="font-size: 1.5em; margin-bottom: 6px;">${icon}</div>
          <div class="admin-stat-label" style="
            font-size: 0.75em;
            color: var(--text-secondary, #888);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
            margin-bottom: 8px;
          ">${entry.label}</div>
          <div class="admin-stat-value" style="
            font-weight: 700;
            font-size: 0.95em;
            color: var(--text-primary, #333);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          ">${name}</div>
          <div style="
            font-size: 0.8em;
            color: var(--accent-color, #ff6b35);
            font-weight: 600;
            margin-top: 4px;
          ">${count} ${this.TYPE_LABELS[entry.type].toLowerCase()}</div>
        </div>
      `;
    });

    // ---- Geração do gráfico de barras do top 5 ----

    let barChartHTML = '';

    if (top5.length === 0) {
      barChartHTML = `
        <div style="
          text-align: center;
          padding: 24px;
          color: var(--text-secondary, #888);
          font-style: italic;
        ">
          <p>Sem dados suficientes para o gráfico.</p>
        </div>
      `;
    } else {
      // Cores para cada barra do gráfico (usando CSS variables com fallback)
      const barColors = [
        'var(--chart-color-1, #ff6b35)',
        'var(--chart-color-2, #f7c948)',
        'var(--chart-color-3, #4ecdc4)',
        'var(--chart-color-4, #45b7d1)',
        'var(--chart-color-5, #96ceb4)'
      ];

      top5.forEach((dish, index) => {
        const name = this._getDishName(dishes, dish.dishId);
        const barWidth = Math.round((dish.totalPoints / maxPoints) * 100);
        const color = barColors[index] || barColors[0];

        barChartHTML += `
          <div class="admin-bar" style="
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
          ">
            <!-- Nome do prato -->
            <div style="
              min-width: 120px;
              max-width: 150px;
              font-size: 0.85em;
              font-weight: 500;
              color: var(--text-primary, #333);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              text-align: right;
            " title="${name}">${name}</div>

            <!-- Barra do gráfico -->
            <div style="
              flex: 1;
              height: 24px;
              background: var(--ranking-bar-bg, #e9ecef);
              border-radius: 6px;
              overflow: hidden;
              position: relative;
            ">
              <div class="admin-bar-fill" style="
                width: ${barWidth}%;
                height: 100%;
                background: ${color};
                border-radius: 6px;
                transition: width 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                animation: rankingBarGrow 1.2s ease-out;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding-right: 8px;
              ">
                <span style="
                  font-size: 0.7em;
                  font-weight: 700;
                  color: #fff;
                  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                ">${barWidth >= 20 ? dish.totalPoints + ' pts' : ''}</span>
              </div>

              ${barWidth < 20 ? `
                <span style="
                  position: absolute;
                  right: -50px;
                  top: 50%;
                  transform: translateY(-50%);
                  font-size: 0.75em;
                  font-weight: 600;
                  color: var(--text-secondary, #888);
                ">${dish.totalPoints} pts</span>
              ` : ''}
            </div>
          </div>
        `;
      });
    }

    // ---- Montagem do HTML final do painel admin ----

    // Calcula estatísticas resumidas para o cabeçalho
    const totalInteractions = this.state.interactions.length;
    const totalPoints = this.state.interactions.reduce((sum, i) => sum + i.points, 0);
    const uniqueDishes = new Set(this.state.interactions.map(i => i.dishId)).size;

    return `
      <div class="admin-stats-panel" style="padding: 16px;">

        <!-- Cabeçalho com resumo geral -->
        <div style="
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        ">
          <div style="
            flex: 1;
            min-width: 100px;
            text-align: center;
            padding: 12px;
            background: var(--card-bg, #fff);
            border-radius: 12px;
            box-shadow: var(--card-shadow, 0 2px 8px rgba(0,0,0,0.08));
          ">
            <div style="font-size: 1.5em; font-weight: 700; color: var(--accent-color, #ff6b35);">
              ${totalInteractions}
            </div>
            <div style="font-size: 0.75em; color: var(--text-secondary, #888); text-transform: uppercase; font-weight: 600;">
              Total de Interações
            </div>
          </div>

          <div style="
            flex: 1;
            min-width: 100px;
            text-align: center;
            padding: 12px;
            background: var(--card-bg, #fff);
            border-radius: 12px;
            box-shadow: var(--card-shadow, 0 2px 8px rgba(0,0,0,0.08));
          ">
            <div style="font-size: 1.5em; font-weight: 700; color: var(--accent-color, #ff6b35);">
              ${totalPoints}
            </div>
            <div style="font-size: 0.75em; color: var(--text-secondary, #888); text-transform: uppercase; font-weight: 600;">
              Pontos Totais
            </div>
          </div>

          <div style="
            flex: 1;
            min-width: 100px;
            text-align: center;
            padding: 12px;
            background: var(--card-bg, #fff);
            border-radius: 12px;
            box-shadow: var(--card-shadow, 0 2px 8px rgba(0,0,0,0.08));
          ">
            <div style="font-size: 1.5em; font-weight: 700; color: var(--accent-color, #ff6b35);">
              ${uniqueDishes}
            </div>
            <div style="font-size: 0.75em; color: var(--text-secondary, #888); text-transform: uppercase; font-weight: 600;">
              Pratos Ativos
            </div>
          </div>
        </div>

        <!-- Título da seção de destaques -->
        <h3 style="
          margin: 0 0 16px 0;
          font-size: 1.05em;
          font-weight: 700;
          color: var(--text-primary, #333);
        ">📈 Destaques por Categoria</h3>

        <!-- Cards de estatísticas por tipo de interação -->
        <div style="
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        ">
          ${statCardsHTML}
        </div>

        <!-- Título do gráfico de barras -->
        <h3 style="
          margin: 0 0 16px 0;
          font-size: 1.05em;
          font-weight: 700;
          color: var(--text-primary, #333);
        ">📊 Top 5 Pratos - Pontuação Total</h3>

        <!-- Gráfico de barras comparativo -->
        <div class="admin-bar-chart" style="
          padding: 16px;
          background: var(--card-bg, #fff);
          border-radius: 12px;
          box-shadow: var(--card-shadow, 0 2px 8px rgba(0,0,0,0.08));
        ">
          ${barChartHTML}
        </div>
      </div>

      <!-- Animação CSS (caso ainda não exista) -->
      <style>
        @keyframes rankingBarGrow {
          from { width: 0%; }
        }

        .admin-stat-card:hover {
          transform: translateY(-3px);
        }
      </style>
    `;
  }
};
