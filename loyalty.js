// ============================================================================
// SISTEMA DE FIDELIDADE GAMIFICADO — VK Restaurante
// ============================================================================
// Módulo standalone carregado ANTES do app.js.
// NÃO referencia App diretamente. O app.js chama os métodos deste módulo.
// Integra-se com RankingSystem (se disponível) para acumulação de pontos.
//
// Chaves de armazenamento (localStorage):
//   vk_customer       → Cliente logado atual (objeto ou null)
//   vk_all_customers  → Array com todos os perfis de clientes cadastrados
//   vk_achievements   → Array de definições de conquistas (editável pelo admin)
//   vk_levels         → Array de definições de níveis (editável pelo admin)
// ============================================================================

const LoyaltySystem = {

  // ========================================================================
  // ESTADO INTERNO
  // ========================================================================
  // Espelha os dados do localStorage para acesso rápido em memória.
  state: {
    customer: null,       // Cliente logado atual
    allCustomers: [],     // Todos os clientes registrados (para dashboard admin)
    achievements: [],     // Definições de conquistas
    levels: []            // Definições de níveis / tiers
  },

  // ========================================================================
  // CONQUISTAS PADRÃO (10)
  // ========================================================================
  // Semeadas automaticamente na primeira execução.
  // O admin pode editar, desativar ou criar novas pelo painel.
  _defaultAchievements: [
    {
      id: 'primeira-visita',
      name: 'Primeira Visita',
      icon: '🏆',
      description: 'Fez sua primeira visita ao VK Restaurante!',
      condition: { type: 'visits', target: 1 },
      points: 15,
      active: true
    },
    {
      id: 'primeiro-comentario',
      name: 'Primeiro Comentário',
      icon: '💬',
      description: 'Deixou seu primeiro comentário sobre um prato!',
      condition: { type: 'comments', target: 1 },
      points: 20,
      active: true
    },
    {
      id: 'primeiro-favorito',
      name: 'Primeiro Favorito',
      icon: '❤️',
      description: 'Adicionou seu primeiro prato aos favoritos!',
      condition: { type: 'favorites', target: 1 },
      points: 15,
      active: true
    },
    {
      id: 'explorador',
      name: 'Explorador do Cardápio',
      icon: '🗺️',
      description: 'Explorou 10 pratos diferentes do cardápio!',
      condition: { type: 'dishes_explored', target: 10 },
      points: 50,
      active: true
    },
    {
      id: 'bronze',
      name: 'Nível Bronze',
      icon: '🥉',
      description: 'Alcançou 500 pontos de fidelidade!',
      condition: { type: 'points', target: 500 },
      points: 100,
      active: true
    },
    {
      id: 'silver',
      name: 'Nível Prata',
      icon: '🥈',
      description: 'Alcançou 1500 pontos de fidelidade!',
      condition: { type: 'points', target: 1500 },
      points: 200,
      active: true
    },
    {
      id: 'gold',
      name: 'Nível Ouro',
      icon: '🥇',
      description: 'Alcançou 5000 pontos de fidelidade!',
      condition: { type: 'points', target: 5000 },
      points: 500,
      active: true
    },
    {
      id: 'platinum',
      name: 'Nível Platina',
      icon: '💎',
      description: 'Ultrapassou 5001 pontos — cliente VIP!',
      condition: { type: 'points', target: 5001 },
      points: 1000,
      active: true
    },
    {
      id: 'amante-sobremesas',
      name: 'Amante de Sobremesas',
      icon: '🍰',
      description: 'Adicionou 5 sobremesas aos favoritos!',
      condition: { type: 'favorites', target: 5 },
      points: 30,
      active: true
    },
    {
      id: 'critico',
      name: 'Crítico Gastronômico',
      icon: '✍️',
      description: 'Deixou 10 comentários no cardápio!',
      condition: { type: 'comments', target: 10 },
      points: 100,
      active: true
    }
  ],

  // ========================================================================
  // NÍVEIS PADRÃO (4 tiers)
  // ========================================================================
  _defaultLevels: [
    { id: 'bronze',   name: 'Bronze',   icon: '🥉', minPoints: 0,    maxPoints: 500,   color: '#cd7f32', active: true },
    { id: 'silver',   name: 'Prata',    icon: '🥈', minPoints: 501,  maxPoints: 1500,  color: '#c0c0c0', active: true },
    { id: 'gold',     name: 'Ouro',     icon: '🥇', minPoints: 1501, maxPoints: 5000,  color: '#ffd700', active: true },
    { id: 'platinum', name: 'Platina',  icon: '💎', minPoints: 5001, maxPoints: 99999, color: '#b5d4e8', active: true }
  ],

  // ========================================================================
  // INICIALIZAÇÃO
  // ========================================================================
  // Carrega todos os dados do localStorage.
  // Se não existirem, semeia com os valores padrão definidos acima.
  init() {
    // Conquistas
    const savedAchievements = localStorage.getItem('vk_achievements');
    if (savedAchievements) {
      this.state.achievements = JSON.parse(savedAchievements);
    } else {
      this.state.achievements = JSON.parse(JSON.stringify(this._defaultAchievements));
      localStorage.setItem('vk_achievements', JSON.stringify(this.state.achievements));
    }

    // Níveis
    const savedLevels = localStorage.getItem('vk_levels');
    if (savedLevels) {
      this.state.levels = JSON.parse(savedLevels);
    } else {
      this.state.levels = JSON.parse(JSON.stringify(this._defaultLevels));
      localStorage.setItem('vk_levels', JSON.stringify(this.state.levels));
    }

    // Todos os clientes (array global para o dashboard admin)
    const savedAll = localStorage.getItem('vk_all_customers');
    if (savedAll) {
      this.state.allCustomers = JSON.parse(savedAll);
    } else {
      this.state.allCustomers = [];
      localStorage.setItem('vk_all_customers', JSON.stringify(this.state.allCustomers));
    }

    // Cliente logado atual (pode ser null se ninguém estiver logado)
    const savedCustomer = localStorage.getItem('vk_customer');
    if (savedCustomer) {
      this.state.customer = JSON.parse(savedCustomer);
    } else {
      this.state.customer = null;
    }
  },

  // ========================================================================
  // PERSISTÊNCIA
  // ========================================================================
  // Salva todo o estado no localStorage de uma só vez.
  saveState() {
    localStorage.setItem('vk_customer', JSON.stringify(this.state.customer));
    localStorage.setItem('vk_all_customers', JSON.stringify(this.state.allCustomers));
    localStorage.setItem('vk_achievements', JSON.stringify(this.state.achievements));
    localStorage.setItem('vk_levels', JSON.stringify(this.state.levels));
  },

  // ========================================================================
  // AUTENTICAÇÃO DE CLIENTE
  // ========================================================================

  // Verifica se há um cliente logado
  isLoggedIn() {
    return this.state.customer !== null;
  },

  // Login / Cadastro do cliente por telefone e nome.
  // Se o telefone já existir no array global, carrega o perfil existente e incrementa visitas.
  // Caso contrário, cria um novo perfil de cliente.
  login(phone, name) {
    // Extrai somente dígitos do telefone para usar como identificador único
    const cleanPhone = this.parsePhone(phone);
    if (!cleanPhone || cleanPhone.length < 10) {
      return { success: false, message: 'Telefone inválido. Use o formato (XX) XXXXX-XXXX.' };
    }
    if (!name || name.trim().length < 2) {
      return { success: false, message: 'Por favor, informe seu nome completo.' };
    }

    const customerId = 'phone_' + cleanPhone;
    const trimmedName = name.trim();

    // Procura cliente já cadastrado
    let existingIndex = this.state.allCustomers.findIndex(c => c.id === customerId);

    if (existingIndex !== -1) {
      // Cliente encontrado — recarrega e incrementa visita
      const existing = this.state.allCustomers[existingIndex];
      existing.visits += 1;
      // Atualiza o nome caso tenha mudado
      existing.name = trimmedName;
      this.state.customer = existing;
      this.state.allCustomers[existingIndex] = existing;
    } else {
      // Novo cliente — cria perfil completo
      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      const newCustomer = {
        id: customerId,
        name: trimmedName,
        phone: cleanPhone,
        createdAt: dateStr,
        visits: 1,
        totalPoints: 0,
        level: 'bronze',
        favorites: [],
        achievements: [],
        dishesExplored: [],
        commentsCount: 0
      };

      this.state.customer = newCustomer;
      this.state.allCustomers.push(newCustomer);
    }

    this.saveState();
    return { success: true, message: `Bem-vindo(a), ${trimmedName}! 🎉` };
  },

  // Encerra a sessão do cliente (não exclui o cadastro)
  logout() {
    this.state.customer = null;
    localStorage.setItem('vk_customer', JSON.stringify(null));
  },

  // Retorna o objeto do cliente logado ou null
  getCustomer() {
    return this.state.customer;
  },

  // ========================================================================
  // ACÚMULO DE PONTOS E AÇÕES
  // ========================================================================

  // Adiciona pontos ao cliente logado, verifica subida de nível e persiste.
  // O parâmetro `reason` é apenas para log/rastreabilidade futura.
  addPoints(points, reason) {
    if (!this.state.customer) return;
    this.state.customer.totalPoints += points;

    // Verifica se o nível mudou com base nos novos pontos
    const newLevel = this.getLevel(this.state.customer.totalPoints);
    if (newLevel) {
      this.state.customer.level = newLevel.id;
    }

    // Sincroniza com o array global de clientes
    this._syncCustomerToAll();
    this.saveState();

    // Integração opcional com RankingSystem (se existir)
    if (typeof RankingSystem !== 'undefined' && RankingSystem.addPoints) {
      try {
        RankingSystem.addPoints(this.state.customer.id, points, reason);
      } catch (e) {
        // Falha silenciosa — RankingSystem não é obrigatório
      }
    }
  },

  // Registra uma visita do cliente (chamado no login, mas pode ser chamado manualmente)
  recordVisit() {
    if (!this.state.customer) return;
    this.state.customer.visits += 1;
    this._syncCustomerToAll();
    this.saveState();
  },

  // Alterna favorito de um prato.
  // Retorna true se foi adicionado, false se foi removido.
  addFavorite(dishId) {
    if (!this.state.customer) return false;

    const index = this.state.customer.favorites.indexOf(dishId);
    if (index === -1) {
      // Adiciona aos favoritos
      this.state.customer.favorites.push(dishId);
      this._syncCustomerToAll();
      this.saveState();
      return true;
    } else {
      // Remove dos favoritos (toggle)
      this.state.customer.favorites.splice(index, 1);
      this._syncCustomerToAll();
      this.saveState();
      return false;
    }
  },

  // Verifica se um prato está nos favoritos do cliente logado
  isFavorite(dishId) {
    if (!this.state.customer) return false;
    return this.state.customer.favorites.includes(dishId);
  },

  // Registra que o cliente explorou (visualizou detalhes de) um prato.
  // Não adiciona duplicatas.
  recordDishExplored(dishId) {
    if (!this.state.customer) return;
    if (!this.state.customer.dishesExplored.includes(dishId)) {
      this.state.customer.dishesExplored.push(dishId);
      this._syncCustomerToAll();
      this.saveState();
    }
  },

  // Registra que o cliente fez um comentário (incrementa contador)
  recordComment() {
    if (!this.state.customer) return;
    this.state.customer.commentsCount += 1;
    this._syncCustomerToAll();
    this.saveState();
  },

  // ========================================================================
  // CONQUISTAS (ACHIEVEMENTS)
  // ========================================================================
  // Verifica todas as condições de conquistas ativas contra as estatísticas
  // do cliente logado. Se desbloqueou nova conquista, concede os pontos e
  // chama showToastFn(mensagem) para exibir notificação.
  // showToastFn é passado pelo App para evitar acoplamento direto.
  checkAchievements(showToastFn) {
    if (!this.state.customer) return;

    const customer = this.state.customer;
    const activeAchievements = this.state.achievements.filter(a => a.active);

    activeAchievements.forEach(achievement => {
      // Pula conquistas que o cliente já desbloqueou
      if (customer.achievements.includes(achievement.id)) return;

      let achieved = false;

      // Avalia a condição da conquista
      switch (achievement.condition.type) {
        case 'visits':
          achieved = customer.visits >= achievement.condition.target;
          break;

        case 'comments':
          achieved = customer.commentsCount >= achievement.condition.target;
          break;

        case 'favorites':
          achieved = customer.favorites.length >= achievement.condition.target;
          break;

        case 'dishes_explored':
          achieved = customer.dishesExplored.length >= achievement.condition.target;
          break;

        case 'points':
          achieved = customer.totalPoints >= achievement.condition.target;
          break;

        default:
          achieved = false;
      }

      // Se atingiu a meta, desbloqueia a conquista
      if (achieved) {
        customer.achievements.push(achievement.id);
        customer.totalPoints += achievement.points;

        // Atualiza nível após ganhar pontos da conquista
        const newLevel = this.getLevel(customer.totalPoints);
        if (newLevel) {
          customer.level = newLevel.id;
        }

        // Notifica o usuário via callback
        if (typeof showToastFn === 'function') {
          showToastFn(`${achievement.icon} Conquista desbloqueada: ${achievement.name}! +${achievement.points} pontos`);
        }
      }
    });

    // Persiste alterações
    this._syncCustomerToAll();
    this.saveState();
  },

  // ========================================================================
  // NÍVEIS E PROGRESSO
  // ========================================================================

  // Retorna o objeto de nível correspondente à pontuação informada.
  // Considera somente níveis ativos e ordenados por minPoints.
  getLevel(points) {
    const activeLevels = this.state.levels
      .filter(l => l.active)
      .sort((a, b) => a.minPoints - b.minPoints);

    // Percorre de trás para frente para encontrar o nível mais alto atingido
    for (let i = activeLevels.length - 1; i >= 0; i--) {
      if (points >= activeLevels[i].minPoints) {
        return activeLevels[i];
      }
    }
    // Fallback: retorna o primeiro nível
    return activeLevels[0] || null;
  },

  // Retorna objeto com progresso do cliente logado:
  // { currentLevel, nextLevel, percentage, pointsToNext }
  getProgress() {
    if (!this.state.customer) {
      return { currentLevel: null, nextLevel: null, percentage: 0, pointsToNext: 0 };
    }

    const points = this.state.customer.totalPoints;
    const activeLevels = this.state.levels
      .filter(l => l.active)
      .sort((a, b) => a.minPoints - b.minPoints);

    const currentLevel = this.getLevel(points);
    const currentIndex = activeLevels.findIndex(l => l.id === (currentLevel ? currentLevel.id : ''));
    const nextLevel = (currentIndex >= 0 && currentIndex < activeLevels.length - 1)
      ? activeLevels[currentIndex + 1]
      : null;

    let percentage = 100;
    let pointsToNext = 0;

    if (nextLevel && currentLevel) {
      // Calcula porcentagem de progresso entre o nível atual e o próximo
      const rangeStart = currentLevel.minPoints;
      const rangeEnd = nextLevel.minPoints;
      const progress = points - rangeStart;
      const totalRange = rangeEnd - rangeStart;

      percentage = totalRange > 0 ? Math.min(Math.round((progress / totalRange) * 100), 100) : 100;
      pointsToNext = Math.max(rangeEnd - points, 0);
    }

    return { currentLevel, nextLevel, percentage, pointsToNext };
  },

  // ========================================================================
  // RENDERIZAÇÃO — MODAL DE LOGIN
  // ========================================================================
  // Retorna HTML string para o formulário de login do cliente.
  // O app.js injeta esta string no DOM e conecta os eventos.
  renderLoginModal() {
    const whatsappUrl = 'https://api.whatsapp.com/send?phone=558198069998&text=' +
      encodeURIComponent('Olá! Gostaria de me cadastrar no programa de fidelidade VK Restaurante. Meu nome é: ');

    return `
      <div class="loyalty-login" style="padding: 2rem; max-width: 400px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <span style="font-size: 3rem;">🎖️</span>
          <h2 style="color: var(--text-primary); margin: 0.5rem 0 0.25rem; font-size: 1.4rem; font-weight: 800;">
            Programa de Fidelidade
          </h2>
          <p style="color: var(--text-secondary); font-size: 0.85rem; line-height: 1.4;">
            Acumule pontos, desbloqueie conquistas e suba de nível a cada visita!
          </p>
        </div>

        <form id="loyalty-login-form" autocomplete="off">
          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label" for="loyalty-phone" style="color: var(--text-primary);">
              Telefone com DDD
            </label>
            <input
              type="tel"
              id="loyalty-phone"
              class="form-input loyalty-phone-input"
              placeholder="(81) 99806-9998"
              inputmode="tel"
              pattern="\\([0-9]{2}\\)\\s?[0-9]{4,5}-[0-9]{4}"
              maxlength="15"
              required
              style="font-size: 1.1rem; letter-spacing: 0.5px;"
            >
          </div>

          <div class="form-group" style="margin-bottom: 1.5rem;">
            <label class="form-label" for="loyalty-name" style="color: var(--text-primary);">
              Seu Nome
            </label>
            <input
              type="text"
              id="loyalty-name"
              class="form-input"
              placeholder="Ex: Severino da Silva"
              minlength="2"
              required
              style="font-size: 1rem;"
            >
          </div>

          <button type="submit" class="btn-submit" style="width: 100%; font-size: 1rem; padding: 0.85rem;">
            <span>🚀 Entrar</span>
          </button>
        </form>

        <div style="text-align: center; margin-top: 1rem;">
          <span style="display: block; color: var(--text-secondary); font-size: 0.75rem; margin-bottom: 0.5rem;">
            ou cadastre-se pelo WhatsApp
          </span>
          <a
            href="${whatsappUrl}"
            target="_blank"
            class="btn-submit"
            style="
              display: inline-flex; align-items: center; gap: 8px;
              background: #25d366; color: #fff; text-decoration: none;
              padding: 0.7rem 1.5rem; border-radius: 12px; font-size: 0.9rem;
              font-weight: 700; border: none; cursor: pointer;
              transition: opacity 0.2s;
            "
          >
            <span style="font-size: 1.2rem;">📱</span>
            Entrar com WhatsApp
          </a>
        </div>
      </div>
    `;
  },

  // ========================================================================
  // RENDERIZAÇÃO — MODAL DE PERFIL DO CLIENTE
  // ========================================================================
  // Retorna HTML string com o perfil completo: info, nível, progresso,
  // pontuação e grade de conquistas (desbloqueadas vs. travadas).
  // O parâmetro `dishes` permite lookup de nomes de pratos favoritos.
  renderProfileModal(dishes) {
    const customer = this.state.customer;
    if (!customer) return '<p style="text-align:center; padding:2rem; color:var(--text-secondary);">Nenhum cliente logado.</p>';

    const progress = this.getProgress();
    const currentLevel = progress.currentLevel;
    const nextLevel = progress.nextLevel;

    // Formata data de cadastro
    const memberSince = customer.createdAt || '—';

    // Monta lista de pratos favoritos (nomes)
    const favoriteNames = (customer.favorites || []).map(favId => {
      const dish = (dishes || []).find(d => d.id === favId);
      return dish ? dish.name : favId;
    });

    // Grade de conquistas
    const allAchievements = this.state.achievements.filter(a => a.active);
    let achievementsHtml = '';
    allAchievements.forEach(ach => {
      const unlocked = customer.achievements.includes(ach.id);

      // Calcula progresso individual para a barra
      let progressValue = 0;
      let progressMax = ach.condition.target;
      switch (ach.condition.type) {
        case 'visits': progressValue = customer.visits; break;
        case 'comments': progressValue = customer.commentsCount; break;
        case 'favorites': progressValue = customer.favorites.length; break;
        case 'dishes_explored': progressValue = customer.dishesExplored.length; break;
        case 'points': progressValue = customer.totalPoints; break;
      }
      progressValue = Math.min(progressValue, progressMax);
      const progressPct = progressMax > 0 ? Math.round((progressValue / progressMax) * 100) : 0;

      achievementsHtml += `
        <div class="achievement-card ${unlocked ? '' : 'locked'}"
             style="
               background: var(--bg-secondary);
               border: 1px solid ${unlocked ? 'var(--color-gold)' : 'var(--border-color)'};
               border-radius: 12px;
               padding: 1rem;
               text-align: center;
               position: relative;
               transition: transform 0.2s, box-shadow 0.2s;
               ${unlocked ? 'box-shadow: 0 0 12px rgba(229, 169, 26, 0.15);' : 'opacity: 0.55; filter: grayscale(60%);'}
             "
        >
          ${!unlocked ? '<span style="position:absolute; top:6px; right:8px; font-size:0.7rem;">🔒</span>' : ''}
          <div class="achievement-icon" style="font-size: 2rem; margin-bottom: 0.4rem;">${ach.icon}</div>
          <div class="achievement-name" style="font-weight: 700; font-size: 0.8rem; color: var(--text-primary); margin-bottom: 0.2rem;">
            ${ach.name}
          </div>
          <div class="achievement-desc" style="font-size: 0.7rem; color: var(--text-secondary); margin-bottom: 0.5rem; line-height: 1.3;">
            ${ach.description}
          </div>
          <div class="achievement-progress" style="font-size: 0.65rem; color: var(--text-secondary);">
            ${unlocked
              ? '<span style="color: var(--color-gold); font-weight: 700;">✓ Conquistado!</span>'
              : `<div style="background: var(--bg-tertiary, var(--bg-primary)); border-radius: 6px; height: 6px; overflow: hidden; margin-top: 4px;">
                   <div style="height: 100%; width: ${progressPct}%; background: var(--color-gold); border-radius: 6px; transition: width 0.3s;"></div>
                 </div>
                 <span>${progressValue}/${progressMax} · +${ach.points} pts</span>`
            }
          </div>
        </div>
      `;
    });

    return `
      <div class="loyalty-profile" style="padding: 1.5rem; max-width: 500px; margin: 0 auto;">

        <!-- Cabeçalho do Perfil -->
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div class="loyalty-level-badge" style="
            display: inline-flex; align-items: center; gap: 8px;
            background: ${currentLevel ? currentLevel.color : '#cd7f32'}22;
            border: 2px solid ${currentLevel ? currentLevel.color : '#cd7f32'};
            border-radius: 50px; padding: 0.5rem 1.2rem;
            margin-bottom: 0.75rem;
          ">
            <span style="font-size: 1.5rem;">${currentLevel ? currentLevel.icon : '🥉'}</span>
            <span style="font-weight: 800; font-size: 1rem; color: ${currentLevel ? currentLevel.color : '#cd7f32'};">
              ${currentLevel ? currentLevel.name : 'Bronze'}
            </span>
          </div>

          <h2 style="color: var(--text-primary); margin: 0.25rem 0; font-size: 1.3rem; font-weight: 800;">
            ${customer.name}
          </h2>
          <p style="color: var(--text-secondary); font-size: 0.8rem;">
            📞 ${this.formatPhone(customer.phone)} · Membro desde ${memberSince}
          </p>
        </div>

        <!-- Pontos e Barra de Progresso -->
        <div style="background: var(--bg-secondary); border-radius: 16px; padding: 1.2rem; margin-bottom: 1.5rem; border: 1px solid var(--border-color);">
          <div class="loyalty-points" style="text-align: center; margin-bottom: 0.75rem;">
            <span style="font-size: 2.2rem; font-weight: 900; color: var(--color-gold);">${customer.totalPoints}</span>
            <span style="display: block; font-size: 0.75rem; color: var(--text-secondary); font-weight: 600;">PONTOS DE FIDELIDADE</span>
          </div>

          <div class="loyalty-progress-bar" style="
            background: var(--bg-tertiary, var(--bg-primary));
            border-radius: 10px; height: 10px; overflow: hidden;
            margin-bottom: 0.5rem;
          ">
            <div class="loyalty-progress-fill" style="
              height: 100%; width: ${progress.percentage}%;
              background: linear-gradient(90deg, ${currentLevel ? currentLevel.color : '#cd7f32'}, var(--color-gold));
              border-radius: 10px;
              transition: width 0.5s ease;
            "></div>
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--text-secondary);">
            <span>${currentLevel ? currentLevel.icon + ' ' + currentLevel.name : '🥉 Bronze'}</span>
            ${nextLevel
              ? `<span>Faltam <strong style="color: var(--color-gold);">${progress.pointsToNext}</strong> pts para ${nextLevel.icon} ${nextLevel.name}</span>`
              : '<span style="color: var(--color-gold); font-weight: 700;">Nível Máximo! 🎉</span>'
            }
          </div>
        </div>

        <!-- Estatísticas Rápidas -->
        <div class="loyalty-stats-grid" style="
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;
          margin-bottom: 1.5rem;
        ">
          <div class="loyalty-stat" style="background: var(--bg-secondary); border-radius: 12px; padding: 0.8rem; text-align: center; border: 1px solid var(--border-color);">
            <span style="font-size: 1.3rem; font-weight: 900; color: var(--text-primary);">${customer.visits}</span>
            <span style="display: block; font-size: 0.7rem; color: var(--text-secondary);">Visitas</span>
          </div>
          <div class="loyalty-stat" style="background: var(--bg-secondary); border-radius: 12px; padding: 0.8rem; text-align: center; border: 1px solid var(--border-color);">
            <span style="font-size: 1.3rem; font-weight: 900; color: var(--text-primary);">${customer.dishesExplored.length}</span>
            <span style="display: block; font-size: 0.7rem; color: var(--text-secondary);">Pratos Explorados</span>
          </div>
          <div class="loyalty-stat" style="background: var(--bg-secondary); border-radius: 12px; padding: 0.8rem; text-align: center; border: 1px solid var(--border-color);">
            <span style="font-size: 1.3rem; font-weight: 900; color: var(--text-primary);">${customer.commentsCount}</span>
            <span style="display: block; font-size: 0.7rem; color: var(--text-secondary);">Comentários</span>
          </div>
          <div class="loyalty-stat" style="background: var(--bg-secondary); border-radius: 12px; padding: 0.8rem; text-align: center; border: 1px solid var(--border-color);">
            <span style="font-size: 1.3rem; font-weight: 900; color: var(--text-primary);">${customer.favorites.length}</span>
            <span style="display: block; font-size: 0.7rem; color: var(--text-secondary);">Favoritos</span>
          </div>
        </div>

        ${favoriteNames.length > 0 ? `
        <!-- Lista de Favoritos -->
        <div style="margin-bottom: 1.5rem;">
          <h3 style="font-size: 0.9rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">❤️ Pratos Favoritos</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${favoriteNames.map(name => `
              <span style="
                background: var(--bg-secondary); border: 1px solid var(--border-color);
                border-radius: 20px; padding: 4px 12px; font-size: 0.75rem;
                color: var(--text-secondary); font-weight: 500;
              ">${name}</span>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <!-- Grade de Conquistas -->
        <div style="margin-bottom: 1rem;">
          <h3 style="font-size: 0.9rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem;">
            🏅 Conquistas (${customer.achievements.length}/${allAchievements.length})
          </h3>
          <div class="achievement-grid" style="
            display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 10px;
          ">
            ${achievementsHtml}
          </div>
        </div>

        <!-- Botão Sair -->
        <div style="text-align: center; margin-top: 1.5rem;">
          <button id="loyalty-logout-btn" style="
            background: none; border: 1px solid var(--border-color);
            color: var(--text-secondary); border-radius: 10px;
            padding: 0.6rem 1.5rem; font-size: 0.85rem; cursor: pointer;
            font-weight: 600; transition: all 0.2s;
          ">
            Sair da Conta
          </button>
        </div>
      </div>
    `;
  },

  // ========================================================================
  // RENDERIZAÇÃO — ABA ADMIN DE FIDELIDADE
  // ========================================================================
  // Retorna HTML string com CRUD de conquistas, CRUD de níveis e dashboard.
  renderAdminLoyalty() {
    // ----- SEÇÃO 1: DASHBOARD -----
    const topCustomers = [...this.state.allCustomers]
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, 5);

    // Clientes com mais conquistas desbloqueadas
    const mostAchievements = [...this.state.allCustomers]
      .sort((a, b) => (b.achievements ? b.achievements.length : 0) - (a.achievements ? a.achievements.length : 0))
      .slice(0, 5);

    // Clientes perto do nível Ouro (entre 1001 e 1500 pontos)
    const nearGold = this.state.allCustomers.filter(c => c.totalPoints >= 1001 && c.totalPoints <= 1500);

    let dashboardHtml = `
      <div style="margin-bottom: 2rem;">
        <h3 style="font-size: 1rem; font-weight: 800; color: var(--text-primary); margin-bottom: 1rem;">📊 Dashboard de Fidelidade</h3>

        <!-- Top 5 por Pontos -->
        <div style="background: var(--bg-secondary); border-radius: 12px; padding: 1rem; margin-bottom: 1rem; border: 1px solid var(--border-color);">
          <h4 style="font-size: 0.85rem; color: var(--color-gold); margin-bottom: 0.5rem; font-weight: 700;">🏆 Top 5 Clientes por Pontos</h4>
          ${topCustomers.length === 0
            ? '<p style="color: var(--text-secondary); font-size: 0.8rem;">Nenhum cliente cadastrado ainda.</p>'
            : `<div style="display: flex; flex-direction: column; gap: 6px;">
                ${topCustomers.map((c, i) => `
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--border-color);">
                    <span style="font-size: 0.8rem; color: var(--text-primary); font-weight: 600;">
                      ${i + 1}. ${c.name}
                    </span>
                    <span style="font-size: 0.8rem; color: var(--color-gold); font-weight: 800;">${c.totalPoints} pts</span>
                  </div>
                `).join('')}
              </div>`
          }
        </div>

        <!-- Mais Conquistas Desbloqueadas -->
        <div style="background: var(--bg-secondary); border-radius: 12px; padding: 1rem; margin-bottom: 1rem; border: 1px solid var(--border-color);">
          <h4 style="font-size: 0.85rem; color: var(--color-gold); margin-bottom: 0.5rem; font-weight: 700;">🏅 Mais Conquistas Desbloqueadas</h4>
          ${mostAchievements.length === 0
            ? '<p style="color: var(--text-secondary); font-size: 0.8rem;">Nenhum cliente com conquistas ainda.</p>'
            : `<div style="display: flex; flex-direction: column; gap: 6px;">
                ${mostAchievements.map((c, i) => `
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--border-color);">
                    <span style="font-size: 0.8rem; color: var(--text-primary); font-weight: 600;">
                      ${i + 1}. ${c.name}
                    </span>
                    <span style="font-size: 0.8rem; color: var(--text-secondary);">${c.achievements ? c.achievements.length : 0} conquistas</span>
                  </div>
                `).join('')}
              </div>`
          }
        </div>

        <!-- Clientes Próximos do Ouro -->
        <div style="background: var(--bg-secondary); border-radius: 12px; padding: 1rem; margin-bottom: 1rem; border: 1px solid var(--border-color);">
          <h4 style="font-size: 0.85rem; color: #ffd700; margin-bottom: 0.5rem; font-weight: 700;">🥇 Clientes Próximos do Ouro</h4>
          ${nearGold.length === 0
            ? '<p style="color: var(--text-secondary); font-size: 0.8rem;">Nenhum cliente próximo do nível Ouro no momento.</p>'
            : `<div style="display: flex; flex-direction: column; gap: 6px;">
                ${nearGold.map(c => `
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--border-color);">
                    <span style="font-size: 0.8rem; color: var(--text-primary); font-weight: 600;">${c.name}</span>
                    <span style="font-size: 0.8rem; color: var(--text-secondary);">${c.totalPoints} pts (faltam ${1501 - c.totalPoints})</span>
                  </div>
                `).join('')}
              </div>`
          }
        </div>

        <p style="font-size: 0.75rem; color: var(--text-secondary); text-align: center;">
          Total de clientes cadastrados: <strong>${this.state.allCustomers.length}</strong>
        </p>
      </div>
    `;

    // ----- SEÇÃO 2: CRUD DE CONQUISTAS -----
    let achievementsListHtml = '';
    this.state.achievements.forEach((ach, idx) => {
      achievementsListHtml += `
        <div class="admin-achievement-row" style="
          display: flex; align-items: center; gap: 10px; padding: 10px;
          background: var(--bg-secondary); border-radius: 10px;
          border: 1px solid var(--border-color); margin-bottom: 8px;
          ${!ach.active ? 'opacity: 0.5;' : ''}
        ">
          <span style="font-size: 1.5rem; flex-shrink: 0;">${ach.icon}</span>
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary);">${ach.name}</div>
            <div style="font-size: 0.7rem; color: var(--text-secondary);">
              ${ach.description} · <strong>${ach.condition.type}</strong> ≥ ${ach.condition.target} · +${ach.points} pts
            </div>
          </div>
          <div style="display: flex; gap: 6px; flex-shrink: 0;">
            <button
              onclick="LoyaltySystem.toggleAchievementActive(${idx})"
              title="${ach.active ? 'Desativar' : 'Ativar'}"
              style="
                background: ${ach.active ? 'var(--color-gold)' : 'var(--bg-tertiary, var(--bg-primary))'};
                color: ${ach.active ? '#fff' : 'var(--text-secondary)'};
                border: none; border-radius: 6px; padding: 4px 10px;
                font-size: 0.7rem; cursor: pointer; font-weight: 700;
              "
            >${ach.active ? 'Ativo' : 'Inativo'}</button>
            <button
              onclick="LoyaltySystem.editAchievementForm(${idx})"
              title="Editar"
              style="background: none; border: 1px solid var(--border-color); border-radius: 6px; padding: 4px 8px; cursor: pointer; color: var(--text-secondary); font-size: 0.75rem;"
            >✏️</button>
            <button
              onclick="LoyaltySystem.deleteAchievement(${idx})"
              title="Excluir"
              style="background: none; border: 1px solid var(--color-error, #e74c3c); border-radius: 6px; padding: 4px 8px; cursor: pointer; color: var(--color-error, #e74c3c); font-size: 0.75rem;"
            >🗑️</button>
          </div>
        </div>
      `;
    });

    let achievementsCrudHtml = `
      <div style="margin-bottom: 2rem;">
        <h3 style="font-size: 1rem; font-weight: 800; color: var(--text-primary); margin-bottom: 1rem;">🏅 Gerenciar Conquistas</h3>
        
        <div id="loyalty-achievements-list">${achievementsListHtml}</div>

        <!-- Formulário para adicionar/editar conquista -->
        <div style="background: var(--bg-secondary); border-radius: 12px; padding: 1rem; margin-top: 1rem; border: 1px solid var(--border-color);">
          <h4 id="ach-form-title" style="font-size: 0.85rem; color: var(--color-gold); margin-bottom: 0.75rem; font-weight: 700;">
            ➕ Nova Conquista
          </h4>
          <form id="loyalty-achievement-form" onsubmit="LoyaltySystem.saveAchievementForm(event)">
            <input type="hidden" id="ach-edit-idx" value="-1">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
              <div>
                <label style="font-size: 0.7rem; color: var(--text-secondary); font-weight: 600;">Nome *</label>
                <input type="text" id="ach-name" class="form-input" placeholder="Ex: Super Fã" required style="font-size: 0.85rem; padding: 6px 10px;">
              </div>
              <div>
                <label style="font-size: 0.7rem; color: var(--text-secondary); font-weight: 600;">Ícone (emoji) *</label>
                <input type="text" id="ach-icon" class="form-input" placeholder="Ex: 🌟" required maxlength="4" style="font-size: 0.85rem; padding: 6px 10px;">
              </div>
            </div>
            <div style="margin-bottom: 8px;">
              <label style="font-size: 0.7rem; color: var(--text-secondary); font-weight: 600;">Descrição *</label>
              <input type="text" id="ach-desc" class="form-input" placeholder="Descrição da conquista" required style="font-size: 0.85rem; padding: 6px 10px;">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 8px;">
              <div>
                <label style="font-size: 0.7rem; color: var(--text-secondary); font-weight: 600;">Tipo *</label>
                <select id="ach-cond-type" class="form-input" required style="font-size: 0.8rem; padding: 6px 8px;">
                  <option value="visits">Visitas</option>
                  <option value="comments">Comentários</option>
                  <option value="favorites">Favoritos</option>
                  <option value="dishes_explored">Pratos Explorados</option>
                  <option value="points">Pontos</option>
                </select>
              </div>
              <div>
                <label style="font-size: 0.7rem; color: var(--text-secondary); font-weight: 600;">Meta *</label>
                <input type="number" id="ach-cond-target" class="form-input" placeholder="10" min="1" required style="font-size: 0.85rem; padding: 6px 10px;">
              </div>
              <div>
                <label style="font-size: 0.7rem; color: var(--text-secondary); font-weight: 600;">Pontos *</label>
                <input type="number" id="ach-points" class="form-input" placeholder="50" min="1" required style="font-size: 0.85rem; padding: 6px 10px;">
              </div>
            </div>
            <div style="display: flex; gap: 8px; margin-top: 0.75rem;">
              <button type="button" id="ach-cancel-btn" onclick="LoyaltySystem.resetAchievementForm()" style="
                flex: 0 0 auto; background: none; border: 1px solid var(--border-color);
                color: var(--text-secondary); border-radius: 8px; padding: 6px 14px;
                font-size: 0.8rem; cursor: pointer; display: none;
              ">Cancelar</button>
              <button type="submit" class="btn-submit" style="flex: 1; font-size: 0.85rem; padding: 0.6rem;">
                <span>💾 Salvar Conquista</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    // ----- SEÇÃO 3: CRUD DE NÍVEIS -----
    let levelsListHtml = '';
    this.state.levels.forEach((lvl, idx) => {
      levelsListHtml += `
        <div class="admin-level-row" style="
          display: flex; align-items: center; gap: 10px; padding: 10px;
          background: var(--bg-secondary); border-radius: 10px;
          border: 1px solid var(--border-color); margin-bottom: 8px;
          ${!lvl.active ? 'opacity: 0.5;' : ''}
        ">
          <span style="font-size: 1.3rem; flex-shrink: 0;">${lvl.icon}</span>
          <div style="
            width: 12px; height: 12px; border-radius: 50%;
            background: ${lvl.color}; flex-shrink: 0;
            border: 2px solid ${lvl.color};
          "></div>
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary);">${lvl.name}</div>
            <div style="font-size: 0.7rem; color: var(--text-secondary);">
              ${lvl.minPoints} — ${lvl.maxPoints} pontos · Cor: ${lvl.color}
            </div>
          </div>
          <div style="display: flex; gap: 6px; flex-shrink: 0;">
            <button
              onclick="LoyaltySystem.toggleLevelActive(${idx})"
              title="${lvl.active ? 'Desativar' : 'Ativar'}"
              style="
                background: ${lvl.active ? lvl.color : 'var(--bg-tertiary, var(--bg-primary))'};
                color: ${lvl.active ? '#fff' : 'var(--text-secondary)'};
                border: none; border-radius: 6px; padding: 4px 10px;
                font-size: 0.7rem; cursor: pointer; font-weight: 700;
              "
            >${lvl.active ? 'Ativo' : 'Inativo'}</button>
            <button
              onclick="LoyaltySystem.editLevelForm(${idx})"
              title="Editar"
              style="background: none; border: 1px solid var(--border-color); border-radius: 6px; padding: 4px 8px; cursor: pointer; color: var(--text-secondary); font-size: 0.75rem;"
            >✏️</button>
            <button
              onclick="LoyaltySystem.deleteLevel(${idx})"
              title="Excluir"
              style="background: none; border: 1px solid var(--color-error, #e74c3c); border-radius: 6px; padding: 4px 8px; cursor: pointer; color: var(--color-error, #e74c3c); font-size: 0.75rem;"
            >🗑️</button>
          </div>
        </div>
      `;
    });

    let levelsCrudHtml = `
      <div style="margin-bottom: 2rem;">
        <h3 style="font-size: 1rem; font-weight: 800; color: var(--text-primary); margin-bottom: 1rem;">🎖️ Gerenciar Níveis</h3>
        
        <div id="loyalty-levels-list">${levelsListHtml}</div>

        <!-- Formulário para adicionar/editar nível -->
        <div style="background: var(--bg-secondary); border-radius: 12px; padding: 1rem; margin-top: 1rem; border: 1px solid var(--border-color);">
          <h4 id="lvl-form-title" style="font-size: 0.85rem; color: var(--color-gold); margin-bottom: 0.75rem; font-weight: 700;">
            ➕ Novo Nível
          </h4>
          <form id="loyalty-level-form" onsubmit="LoyaltySystem.saveLevelForm(event)">
            <input type="hidden" id="lvl-edit-idx" value="-1">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
              <div>
                <label style="font-size: 0.7rem; color: var(--text-secondary); font-weight: 600;">Nome *</label>
                <input type="text" id="lvl-name" class="form-input" placeholder="Ex: Diamante" required style="font-size: 0.85rem; padding: 6px 10px;">
              </div>
              <div>
                <label style="font-size: 0.7rem; color: var(--text-secondary); font-weight: 600;">Ícone (emoji) *</label>
                <input type="text" id="lvl-icon" class="form-input" placeholder="Ex: 💎" required maxlength="4" style="font-size: 0.85rem; padding: 6px 10px;">
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 8px;">
              <div>
                <label style="font-size: 0.7rem; color: var(--text-secondary); font-weight: 600;">Pts Mín *</label>
                <input type="number" id="lvl-min" class="form-input" placeholder="0" min="0" required style="font-size: 0.85rem; padding: 6px 10px;">
              </div>
              <div>
                <label style="font-size: 0.7rem; color: var(--text-secondary); font-weight: 600;">Pts Máx *</label>
                <input type="number" id="lvl-max" class="form-input" placeholder="500" min="1" required style="font-size: 0.85rem; padding: 6px 10px;">
              </div>
              <div>
                <label style="font-size: 0.7rem; color: var(--text-secondary); font-weight: 600;">Cor (hex) *</label>
                <input type="color" id="lvl-color" value="#cd7f32" style="width: 100%; height: 34px; border-radius: 8px; border: 1px solid var(--border-color); cursor: pointer; padding: 2px;">
              </div>
            </div>
            <div style="display: flex; gap: 8px; margin-top: 0.75rem;">
              <button type="button" id="lvl-cancel-btn" onclick="LoyaltySystem.resetLevelForm()" style="
                flex: 0 0 auto; background: none; border: 1px solid var(--border-color);
                color: var(--text-secondary); border-radius: 8px; padding: 6px 14px;
                font-size: 0.8rem; cursor: pointer; display: none;
              ">Cancelar</button>
              <button type="submit" class="btn-submit" style="flex: 1; font-size: 0.85rem; padding: 0.6rem;">
                <span>💾 Salvar Nível</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Monta o HTML final da aba admin de fidelidade
    return `
      <div style="padding: 0.5rem 0;">
        ${dashboardHtml}
        ${achievementsCrudHtml}
        ${levelsCrudHtml}
      </div>
    `;
  },

  // ========================================================================
  // OPERAÇÕES CRUD — CONQUISTAS (chamadas via onclick inline)
  // ========================================================================

  // Alterna o estado ativo/inativo de uma conquista
  toggleAchievementActive(idx) {
    if (idx < 0 || idx >= this.state.achievements.length) return;
    this.state.achievements[idx].active = !this.state.achievements[idx].active;
    this.saveState();
    this._refreshAdminLoyaltyTab();
  },

  // Preenche o formulário com dados da conquista para edição
  editAchievementForm(idx) {
    if (idx < 0 || idx >= this.state.achievements.length) return;
    const ach = this.state.achievements[idx];

    const form = document.getElementById('loyalty-achievement-form');
    if (!form) return;

    document.getElementById('ach-edit-idx').value = idx;
    document.getElementById('ach-name').value = ach.name;
    document.getElementById('ach-icon').value = ach.icon;
    document.getElementById('ach-desc').value = ach.description;
    document.getElementById('ach-cond-type').value = ach.condition.type;
    document.getElementById('ach-cond-target').value = ach.condition.target;
    document.getElementById('ach-points').value = ach.points;

    // Atualiza título e exibe botão cancelar
    const titleEl = document.getElementById('ach-form-title');
    if (titleEl) titleEl.textContent = '✏️ Editando: ' + ach.name;
    const cancelBtn = document.getElementById('ach-cancel-btn');
    if (cancelBtn) cancelBtn.style.display = 'inline-block';

    // Rola até o formulário
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  },

  // Reseta o formulário de conquista para modo criação
  resetAchievementForm() {
    const form = document.getElementById('loyalty-achievement-form');
    if (form) form.reset();
    const idxInput = document.getElementById('ach-edit-idx');
    if (idxInput) idxInput.value = '-1';
    const titleEl = document.getElementById('ach-form-title');
    if (titleEl) titleEl.textContent = '➕ Nova Conquista';
    const cancelBtn = document.getElementById('ach-cancel-btn');
    if (cancelBtn) cancelBtn.style.display = 'none';
  },

  // Salva (cria ou atualiza) uma conquista via formulário
  saveAchievementForm(event) {
    event.preventDefault();

    const editIdx = parseInt(document.getElementById('ach-edit-idx').value);
    const name = document.getElementById('ach-name').value.trim();
    const icon = document.getElementById('ach-icon').value.trim();
    const desc = document.getElementById('ach-desc').value.trim();
    const condType = document.getElementById('ach-cond-type').value;
    const condTarget = parseInt(document.getElementById('ach-cond-target').value);
    const points = parseInt(document.getElementById('ach-points').value);

    if (!name || !icon || !desc || isNaN(condTarget) || isNaN(points)) return;

    if (editIdx >= 0 && editIdx < this.state.achievements.length) {
      // Atualiza conquista existente
      const ach = this.state.achievements[editIdx];
      ach.name = name;
      ach.icon = icon;
      ach.description = desc;
      ach.condition = { type: condType, target: condTarget };
      ach.points = points;
    } else {
      // Cria nova conquista
      const newId = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '_' + Date.now();
      this.state.achievements.push({
        id: newId,
        name: name,
        icon: icon,
        description: desc,
        condition: { type: condType, target: condTarget },
        points: points,
        active: true
      });
    }

    this.saveState();
    this.resetAchievementForm();
    this._refreshAdminLoyaltyTab();
  },

  // Exclui uma conquista pelo índice (com confirmação)
  deleteAchievement(idx) {
    if (idx < 0 || idx >= this.state.achievements.length) return;
    const ach = this.state.achievements[idx];
    if (confirm(`Deseja excluir a conquista "${ach.name}"?`)) {
      this.state.achievements.splice(idx, 1);
      this.saveState();
      this._refreshAdminLoyaltyTab();
    }
  },

  // ========================================================================
  // OPERAÇÕES CRUD — NÍVEIS (chamadas via onclick inline)
  // ========================================================================

  // Alterna o estado ativo/inativo de um nível
  toggleLevelActive(idx) {
    if (idx < 0 || idx >= this.state.levels.length) return;
    this.state.levels[idx].active = !this.state.levels[idx].active;
    this.saveState();
    this._refreshAdminLoyaltyTab();
  },

  // Preenche o formulário com dados do nível para edição
  editLevelForm(idx) {
    if (idx < 0 || idx >= this.state.levels.length) return;
    const lvl = this.state.levels[idx];

    const form = document.getElementById('loyalty-level-form');
    if (!form) return;

    document.getElementById('lvl-edit-idx').value = idx;
    document.getElementById('lvl-name').value = lvl.name;
    document.getElementById('lvl-icon').value = lvl.icon;
    document.getElementById('lvl-min').value = lvl.minPoints;
    document.getElementById('lvl-max').value = lvl.maxPoints;
    document.getElementById('lvl-color').value = lvl.color;

    const titleEl = document.getElementById('lvl-form-title');
    if (titleEl) titleEl.textContent = '✏️ Editando: ' + lvl.name;
    const cancelBtn = document.getElementById('lvl-cancel-btn');
    if (cancelBtn) cancelBtn.style.display = 'inline-block';

    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  },

  // Reseta o formulário de nível para modo criação
  resetLevelForm() {
    const form = document.getElementById('loyalty-level-form');
    if (form) form.reset();
    const idxInput = document.getElementById('lvl-edit-idx');
    if (idxInput) idxInput.value = '-1';
    const titleEl = document.getElementById('lvl-form-title');
    if (titleEl) titleEl.textContent = '➕ Novo Nível';
    const cancelBtn = document.getElementById('lvl-cancel-btn');
    if (cancelBtn) cancelBtn.style.display = 'none';
    // Reseta color picker para bronze padrão
    const colorInput = document.getElementById('lvl-color');
    if (colorInput) colorInput.value = '#cd7f32';
  },

  // Salva (cria ou atualiza) um nível via formulário
  saveLevelForm(event) {
    event.preventDefault();

    const editIdx = parseInt(document.getElementById('lvl-edit-idx').value);
    const name = document.getElementById('lvl-name').value.trim();
    const icon = document.getElementById('lvl-icon').value.trim();
    const minPts = parseInt(document.getElementById('lvl-min').value);
    const maxPts = parseInt(document.getElementById('lvl-max').value);
    const color = document.getElementById('lvl-color').value;

    if (!name || !icon || isNaN(minPts) || isNaN(maxPts)) return;

    if (minPts > maxPts) {
      alert('O valor mínimo de pontos não pode ser maior que o máximo.');
      return;
    }

    if (editIdx >= 0 && editIdx < this.state.levels.length) {
      // Atualiza nível existente
      const lvl = this.state.levels[editIdx];
      lvl.name = name;
      lvl.icon = icon;
      lvl.minPoints = minPts;
      lvl.maxPoints = maxPts;
      lvl.color = color;
    } else {
      // Cria novo nível
      const newId = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '_' + Date.now();
      this.state.levels.push({
        id: newId,
        name: name,
        icon: icon,
        minPoints: minPts,
        maxPoints: maxPts,
        color: color,
        active: true
      });

      // Reordena níveis por minPoints para manter hierarquia correta
      this.state.levels.sort((a, b) => a.minPoints - b.minPoints);
    }

    this.saveState();
    this.resetLevelForm();
    this._refreshAdminLoyaltyTab();
  },

  // Exclui um nível pelo índice (com confirmação)
  deleteLevel(idx) {
    if (idx < 0 || idx >= this.state.levels.length) return;
    const lvl = this.state.levels[idx];
    if (this.state.levels.filter(l => l.active).length <= 1) {
      alert('Não é possível excluir. Deve existir pelo menos 1 nível ativo.');
      return;
    }
    if (confirm(`Deseja excluir o nível "${lvl.name}"?`)) {
      this.state.levels.splice(idx, 1);
      this.saveState();
      this._refreshAdminLoyaltyTab();
    }
  },

  // ========================================================================
  // UTILITÁRIOS DE FORMATAÇÃO
  // ========================================================================

  // Formata número de telefone para exibição: (XX) XXXXX-XXXX
  formatPhone(phone) {
    const digits = String(phone).replace(/\D/g, '');
    if (digits.length === 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    } else if (digits.length === 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
    }
    return phone; // Retorna como está se não couber no padrão
  },

  // Extrai somente dígitos de um telefone formatado
  parsePhone(formatted) {
    return String(formatted).replace(/\D/g, '');
  },

  // ========================================================================
  // MÁSCARA DE TELEFONE (usada no input do login)
  // ========================================================================
  // Aplica máscara dinâmica no formato (XX) XXXXX-XXXX conforme o usuário digita.
  // Deve ser chamada com: oninput="LoyaltySystem.applyPhoneMask(this)"
  // Ou vinculada programaticamente pelo app.js após injetar o modal.
  applyPhoneMask(inputElement) {
    let value = inputElement.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    let formatted = '';
    if (value.length > 0) {
      formatted = '(' + value.slice(0, 2);
    }
    if (value.length >= 3) {
      formatted += ') ' + value.slice(2, 7);
    }
    if (value.length >= 8) {
      formatted += '-' + value.slice(7, 11);
    }

    inputElement.value = formatted;
  },

  // ========================================================================
  // MÉTODOS INTERNOS (prefixados com _)
  // ========================================================================

  // Sincroniza o estado do cliente logado de volta para o array global.
  // Garante que alterações feitas no cliente ativo sejam refletidas na lista completa.
  _syncCustomerToAll() {
    if (!this.state.customer) return;
    const idx = this.state.allCustomers.findIndex(c => c.id === this.state.customer.id);
    if (idx !== -1) {
      this.state.allCustomers[idx] = { ...this.state.customer };
    }
  },

  // Atualiza a aba de fidelidade no admin re-renderizando o conteúdo.
  // Procura um container com id "loyalty-admin-content" no DOM.
  // Se não existir, tenta usar a aba genérica do admin.
  _refreshAdminLoyaltyTab() {
    const container = document.getElementById('loyalty-admin-content');
    if (container) {
      container.innerHTML = this.renderAdminLoyalty();
    }
  }
};

// ============================================================================
// AUTO-INICIALIZAÇÃO
// ============================================================================
// O módulo se inicializa automaticamente quando o script é carregado,
// garantindo que os dados estejam prontos antes do app.js chamar qualquer método.
LoyaltySystem.init();
