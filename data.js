// Base de dados padrão para o VK Restaurante
// Contém categorias, pratos e comentários iniciais (aprovados e pendentes)

const DEFAULT_CATEGORIES = [
  { id: 'destaques', name: 'Destaques' },
  { id: 'executivos', name: 'Executivos' },
  { id: 'carnes', name: 'Carnes Bovinas' },
  { id: 'suinos', name: 'Carnes Suínas' },
  { id: 'aves', name: 'Aves' },
  { id: 'frutos-do-mar', name: 'Frutos do Mar' },
  { id: 'saladas', name: 'Saladas' },
  { id: 'petiscos', name: 'Petiscos' },
  { id: 'pratos', name: 'Pratos Principais' },
  { id: 'bebidas', name: 'Bebidas' },
  { id: 'sobremesas', name: 'Sobremesas' },
  { id: 'promocoes', name: 'Promoções' }
];

const DEFAULT_DISHES = [
  // =============================================
  // DESTAQUES 🌟
  // =============================================
  {
    id: 'dadinhos',
    name: 'Dadinhos de Coalho',
    price: 22.90,
    category: 'destaques',
    image: 'assets/macaxeira_frita.png',
    description: 'Dadinhos de queijo coalho fritos até dourar, super crocantes por fora e macios por dentro. Servidos com um maravilhoso melaço de cana artesanal.',
    ingredients: ['Queijo coalho artesanal', 'Melaço de cana de açúcar', 'Tempero da casa'],
    tag: 'mais-pedido',
    rating: 4.8,
    reviewsCount: 28
  },
  {
    id: 'baiao_de_dois',
    name: 'Baião de Dois Completo',
    price: 34.90,
    category: 'destaques',
    image: 'assets/carne_sol_macaxeira.png',
    description: 'O clássico baião de dois nordestino feito com arroz, feijão de corda, queijo coalho derretido, nata da terra, calabresa artesanal e coentro fresco. Acompanha carne de sol desfiada e farofa de manteiga.',
    ingredients: ['Arroz e feijão de corda', 'Queijo coalho derretido', 'Nata da terra', 'Calabresa artesanal', 'Carne de sol desfiada', 'Coentro fresco', 'Farofa de manteiga'],
    tag: 'destaque',
    rating: 4.9,
    reviewsCount: 37
  },
  {
    id: 'carne_sol_nata',
    name: 'Carne de Sol na Nata',
    price: 42.90,
    category: 'destaques',
    image: 'assets/bode_guisado.png',
    description: 'Generosa porção de carne de sol de primeira, desfiada e mergulhada em nata cremosa da terra. Acompanha arroz branco, macaxeira frita dourada e vinagrete fresco.',
    ingredients: ['Carne de sol de primeira', 'Nata cremosa da terra', 'Arroz branco', 'Macaxeira frita', 'Vinagrete'],
    tag: 'mais-pedido',
    rating: 5.0,
    reviewsCount: 45
  },
  {
    id: 'escondidinho',
    name: 'Escondidinho de Carne de Sol',
    price: 32.90,
    category: 'destaques',
    image: 'assets/costela_bafo.png',
    description: 'Escondidinho cremoso de macaxeira com recheio de carne de sol desfiada e temperada, gratinado com queijo coalho até borbulhar. Sabor que é a cara do Nordeste.',
    ingredients: ['Purê de macaxeira cremoso', 'Carne de sol desfiada', 'Queijo coalho gratinado', 'Manteiga de garrafa', 'Temperos nordestinos'],
    tag: 'destaque',
    rating: 4.9,
    reviewsCount: 33
  },

  // =============================================
  // EXECUTIVOS 🍽️ (almoço executivo com acompanhamentos)
  // =============================================
  {
    id: 'feijoada',
    name: 'Executivo Feijoada',
    price: 26.99,
    category: 'executivos',
    image: 'assets/executivo_feijoada.png',
    description: 'Deliciosa feijoada completa servida na panela de barro. Acompanha arroz branco soltinho, couve refogada na manteiga, farofa artesanal, vinagrete fresco e fatias de laranja.',
    ingredients: ['Feijoada de carnes nobres', 'Arroz branco soltinho', 'Couve na manteiga', 'Farofa artesanal da casa', 'Vinagrete fresco', 'Fatias de laranja'],
    tag: 'prato-do-dia',
    rating: 4.9,
    reviewsCount: 18
  },
  {
    id: 'cupim',
    name: 'Executivo Cupim',
    price: 29.99,
    category: 'executivos',
    image: 'assets/executivo_cupim.png',
    description: 'Cupim bovino selecionado, assado lentamente até desfiar, extremamente macio. Acompanha arroz branco, feijão de corda caseiro, farofa da casa, vinagrete e folhas de alface fresca.',
    ingredients: ['Cupim assado lentamente', 'Arroz branco', 'Feijão de corda', 'Farofa artesanal', 'Vinagrete', 'Folhas de alface'],
    tag: 'promocao',
    rating: 4.8,
    reviewsCount: 22
  },
  {
    id: 'camarao',
    name: 'Executivo Camarão Especial',
    price: 29.99,
    category: 'executivos',
    image: 'assets/executivo_camarao.png',
    description: 'Camarões selecionados mergulhados in um creme de queijo super cremoso e especial. Acompanha arroz branco bem soltinho, batatas fritas douradas e salada fresca de alface.',
    ingredients: ['Camarões frescos selecionados', 'Creme de queijo especial', 'Arroz branco soltinho', 'Batatas fritas crocantes', 'Salada fresca de alface'],
    tag: 'destaque',
    rating: 5.0,
    reviewsCount: 15
  },
  {
    id: 'exec_frango_grelhado',
    name: 'Executivo Frango Grelhado',
    price: 24.90,
    category: 'executivos',
    image: 'assets/exec_frango_grelhado.png',
    description: 'Filé de frango grelhado suculento, temperado com ervas finas nordestinas. Acompanha arroz branco, feijão caseiro, farofa, vinagrete e salada de alface com tomate.',
    ingredients: ['Filé de frango grelhado', 'Arroz branco', 'Feijão caseiro', 'Farofa artesanal', 'Vinagrete', 'Salada verde'],
    tag: 'prato-do-dia',
    rating: 4.6,
    reviewsCount: 12
  },
  {
    id: 'exec_bisteca',
    name: 'Executivo Bisteca Suína',
    price: 27.90,
    category: 'executivos',
    image: 'assets/costelinha_suina.png',
    description: 'Bisteca suína grossa e suculenta, grelhada no ponto com tempero especial da casa. Acompanha arroz, feijão, farofa de cebola e vinagrete.',
    ingredients: ['Bisteca suína grelhada', 'Arroz branco', 'Feijão carioca', 'Farofa de cebola', 'Vinagrete fresco'],
    tag: '',
    rating: 4.5,
    reviewsCount: 8
  },
  {
    id: 'exec_charque',
    name: 'Executivo Charque',
    price: 28.90,
    category: 'executivos',
    image: 'assets/exec_charque.png',
    description: 'Charque pernambucano desfiado e refogado na manteiga de garrafa, com aroma inconfundível do sertão. Acompanha arroz, feijão de corda, macaxeira frita e vinagrete.',
    ingredients: ['Charque desfiado', 'Manteiga de garrafa', 'Arroz branco', 'Feijão de corda', 'Macaxeira frita', 'Vinagrete'],
    tag: '',
    rating: 4.7,
    reviewsCount: 14
  },
  {
    id: 'exec_peixe',
    name: 'Executivo Peixe Grelhado',
    price: 28.90,
    category: 'executivos',
    image: 'assets/exec_peixe.png',
    description: 'Filé de peixe branco grelhado, fresco do dia, com molho de alcaparras suave. Acompanha arroz, purê de macaxeira, salada fresca e vinagrete.',
    ingredients: ['Filé de peixe fresco', 'Molho de alcaparras', 'Arroz branco', 'Purê de macaxeira', 'Salada mista', 'Vinagrete'],
    tag: '',
    rating: 4.6,
    reviewsCount: 10
  },

  // =============================================
  // CARNES BOVINAS 🥩
  // =============================================
  {
    id: 'picanha_brasa',
    name: 'Picanha na Brasa',
    price: 74.90,
    category: 'carnes',
    image: 'assets/picanha_brasa.png',
    description: 'Picanha bovina de primeira assada na brasa, suculenta e no ponto escolhido. Servida com arroz, feijão tropeiro, farofa de ovos, vinagrete e mandioca frita. Serve 2 pessoas.',
    ingredients: ['Picanha bovina selecionada', 'Arroz branco', 'Feijão tropeiro', 'Farofa de ovos', 'Vinagrete', 'Mandioca frita'],
    tag: 'mais-pedido',
    rating: 4.9,
    reviewsCount: 29
  },
  {
    id: 'costela_bafo',
    name: 'Costela no Bafo',
    price: 69.90,
    category: 'carnes',
    image: 'assets/costela_bafo.png',
    description: 'Costela bovina cozida lentamente no bafo por horas até desfiar no garfo. Extremamente macia e suculenta. Acompanha arroz, feijão de corda, farofa de manteiga e vinagrete. Serve 2 pessoas.',
    ingredients: ['Costela bovina no bafo', 'Arroz branco', 'Feijão de corda', 'Farofa de manteiga', 'Vinagrete fresco'],
    tag: 'destaque',
    rating: 4.8,
    reviewsCount: 21
  },
  {
    id: 'bife_acebolado',
    name: 'Bife Acebolado',
    price: 38.90,
    category: 'carnes',
    image: 'assets/bife_acebolado.png',
    description: 'Bife bovino suculento de contra-filé, grelhado e coberto com uma generosa cama de cebolas douradas na manteiga. Acompanha arroz, feijão, farofa e vinagrete.',
    ingredients: ['Bife de contra-filé', 'Cebolas caramelizadas na manteiga', 'Arroz branco', 'Feijão caseiro', 'Farofa', 'Vinagrete'],
    tag: '',
    rating: 4.6,
    reviewsCount: 16
  },
  {
    id: 'carne_sol_macaxeira',
    name: 'Carne de Sol com Macaxeira',
    price: 44.90,
    category: 'carnes',
    image: 'assets/carne_sol_macaxeira.png',
    description: 'Peça de carne de sol assada na brasa, servida com macaxeira frita crocante, arroz, feijão de corda, manteiga de garrafa e vinagrete. Clássico pernambucano.',
    ingredients: ['Carne de sol assada na brasa', 'Macaxeira frita', 'Arroz branco', 'Feijão de corda', 'Manteiga de garrafa', 'Vinagrete'],
    tag: 'mais-pedido',
    rating: 4.9,
    reviewsCount: 38
  },
  {
    id: 'bode_guisado',
    name: 'Bode Guisado',
    price: 46.90,
    category: 'carnes',
    image: 'assets/bode_guisado.png',
    description: 'Bode guisado lentamente no tempero sertanejo com pimentão, tomate, cebola e coentro. Sabor forte e autêntico do interior de Pernambuco. Acompanha arroz, pirão de leite e farofa.',
    ingredients: ['Carne de bode', 'Pimentão', 'Tomate', 'Cebola', 'Coentro', 'Arroz branco', 'Pirão de leite', 'Farofa'],
    tag: 'destaque',
    rating: 4.7,
    reviewsCount: 19
  },

  // =============================================
  // CARNES SUÍNAS 🐷
  // =============================================
  {
    id: 'costelinha_suina',
    name: 'Costelinha Suína ao Molho Barbecue',
    price: 52.90,
    category: 'suinos',
    image: 'assets/costelinha_suina.png',
    description: 'Costelinha suína assada lentamente e finalizada com molho barbecue artesanal defumado. Carne que solta do osso! Acompanha arroz, coleslaw nordestino e batatas rústicas.',
    ingredients: ['Costelinha suína', 'Molho barbecue artesanal', 'Arroz branco', 'Coleslaw nordestino', 'Batatas rústicas'],
    tag: 'destaque',
    rating: 4.8,
    reviewsCount: 17
  },
  {
    id: 'pernil_assado',
    name: 'Pernil Assado Desfiado',
    price: 39.90,
    category: 'suinos',
    image: 'assets/pernil_assado.png',
    description: 'Pernil suíno assado por horas, desfiado e finalizado com crocância na chapa. Acompanha arroz, feijão caseiro, farofa de cebola e vinagrete.',
    ingredients: ['Pernil suíno assado', 'Arroz branco', 'Feijão caseiro', 'Farofa de cebola', 'Vinagrete'],
    tag: '',
    rating: 4.6,
    reviewsCount: 11
  },
  {
    id: 'porco_tapioca',
    name: 'Lombo Suíno à Sertaneja',
    price: 42.90,
    category: 'suinos',
    image: 'assets/pernil_assado.png',
    description: 'Lombo suíno grelhado com crosta de manteiga de garrafa e ervas do sertão. Servido com purê de macaxeira, arroz e couve refogada na manteiga.',
    ingredients: ['Lombo suíno', 'Manteiga de garrafa', 'Ervas do sertão', 'Purê de macaxeira', 'Arroz branco', 'Couve na manteiga'],
    tag: '',
    rating: 4.7,
    reviewsCount: 9
  },
  {
    id: 'torresmo',
    name: 'Porção de Torresmo Crocante',
    price: 24.90,
    category: 'suinos',
    image: 'assets/torresmo.png',
    description: 'Porção generosa de torresmo de barriga suína, frito até ficar super crocante e sequinho. Acompanha limão e molho vinagrete picante.',
    ingredients: ['Barriga suína selecionada', 'Limão', 'Vinagrete picante', 'Sal grosso'],
    tag: 'mais-pedido',
    rating: 4.8,
    reviewsCount: 25
  },

  // =============================================
  // AVES 🍗
  // =============================================
  {
    id: 'galeto',
    name: 'Galeto Completo',
    price: 69.99,
    category: 'aves',
    image: 'assets/galeto_completo.png',
    description: 'Galeto inteiro assado na brasa, super suculento e dourado. Acompanha porção generosa de batatas fritas crocantes, arroz branco, feijão caseiro, farofa e vinagrete. Serve de 2 a 3 pessoas.',
    ingredients: ['Galeto inteiro na brasa', 'Batatas fritas crocantes', 'Arroz branco', 'Feijão caseiro temperado', 'Farofa artesanal', 'Vinagrete'],
    tag: 'mais-pedido',
    rating: 4.9,
    reviewsCount: 34
  },
  {
    id: 'frango_catupiry',
    name: 'Frango ao Catupiry',
    price: 36.90,
    category: 'aves',
    image: 'assets/frango_parmegiana.png',
    description: 'Peito de frango grelhado e coberto com creme de catupiry gratinado, acompanhado de arroz branco, batata frita crocante e salada fresca.',
    ingredients: ['Peito de frango grelhado', 'Creme de catupiry gratinado', 'Arroz branco', 'Batata frita', 'Salada fresca'],
    tag: '',
    rating: 4.5,
    reviewsCount: 13
  },
  {
    id: 'coxa_sobrecoxa',
    name: 'Coxa e Sobrecoxa Assada',
    price: 34.90,
    category: 'aves',
    image: 'assets/exec_frango_grelhado.png',
    description: 'Coxa e sobrecoxa de frango caipira assadas com tempero caseiro nordestino, douradas e super suculentas. Acompanha arroz, feijão, farofa de manteiga e vinagrete.',
    ingredients: ['Coxa e sobrecoxa caipira', 'Tempero caseiro nordestino', 'Arroz branco', 'Feijão caseiro', 'Farofa de manteiga', 'Vinagrete'],
    tag: 'prato-do-dia',
    rating: 4.7,
    reviewsCount: 18
  },
  {
    id: 'galinha_cabidela',
    name: 'Galinha à Cabidela',
    price: 39.90,
    category: 'aves',
    image: 'assets/bode_guisado.png',
    description: 'Tradicional galinha à cabidela pernambucana, cozida no molho pardo encorpado com especiarias regionais. Acompanha arroz branco, farofa de dendê e vinagrete.',
    ingredients: ['Galinha caipira', 'Molho pardo tradicional', 'Especiarias regionais', 'Arroz branco', 'Farofa de dendê', 'Vinagrete'],
    tag: 'destaque',
    rating: 4.8,
    reviewsCount: 22
  },
  {
    id: 'filé_frango_parmegiana',
    name: 'Frango à Parmegiana',
    price: 36.90,
    category: 'aves',
    image: 'assets/frango_parmegiana.png',
    description: 'Filé de frango empanado e frito, coberto com molho de tomate caseiro e queijo muçarela gratinado. Acompanha arroz branco e batata frita.',
    ingredients: ['Filé de frango empanado', 'Molho de tomate caseiro', 'Queijo muçarela gratinado', 'Arroz branco', 'Batata frita'],
    tag: '',
    rating: 4.6,
    reviewsCount: 15
  },

  // =============================================
  // FRUTOS DO MAR 🦐
  // =============================================
  {
    id: 'moqueca_peixe',
    name: 'Moqueca de Peixe',
    price: 54.90,
    category: 'frutos-do-mar',
    image: 'assets/moqueca_peixe.png',
    description: 'Moqueca de peixe fresco com leite de coco, azeite de dendê, pimentão, tomate e coentro, servida na panela de barro fervendo. Acompanha arroz branco e pirão de peixe. Serve 2 pessoas.',
    ingredients: ['Peixe fresco do dia', 'Leite de coco', 'Azeite de dendê', 'Pimentão', 'Tomate', 'Cebola', 'Coentro', 'Arroz branco', 'Pirão de peixe'],
    tag: 'destaque',
    rating: 4.9,
    reviewsCount: 26
  },
  {
    id: 'camarao_alho_oleo',
    name: 'Camarão no Alho e Óleo',
    price: 49.90,
    category: 'frutos-do-mar',
    image: 'assets/executivo_camarao.png',
    description: 'Camarões graúdos salteados no alho dourado e azeite de oliva extra virgem, finalizados com ervas frescas e limão siciliano. Acompanha arroz branco e salada verde.',
    ingredients: ['Camarões graúdos', 'Alho dourado', 'Azeite extra virgem', 'Ervas frescas', 'Limão siciliano', 'Arroz branco', 'Salada verde'],
    tag: 'mais-pedido',
    rating: 4.8,
    reviewsCount: 20
  },
  {
    id: 'peixe_frito',
    name: 'Peixe Frito Inteiro',
    price: 44.90,
    category: 'frutos-do-mar',
    image: 'assets/exec_peixe.png',
    description: 'Peixe inteiro do dia, frito crocante na hora, com tempero regional de limão e coentro. Acompanha arroz, baião de dois, vinagrete e macaxeira frita.',
    ingredients: ['Peixe inteiro fresco', 'Limão', 'Coentro', 'Arroz branco', 'Baião de dois', 'Vinagrete', 'Macaxeira frita'],
    tag: '',
    rating: 4.7,
    reviewsCount: 14
  },
  {
    id: 'casquinha_siri',
    name: 'Casquinha de Siri',
    price: 19.90,
    category: 'frutos-do-mar',
    image: 'assets/moqueca_peixe.png',
    description: 'Casquinha de siri gratinada com recheio cremoso de siri desfiado, temperado com ervas, leite de coco e gratinado com queijo parmesão. Porção com 2 unidades.',
    ingredients: ['Siri desfiado', 'Leite de coco', 'Queijo parmesão gratinado', 'Ervas finas', 'Farinha de rosca'],
    tag: '',
    rating: 4.6,
    reviewsCount: 11
  },
  {
    id: 'caldeirada_peixe',
    name: 'Caldeirada de Peixe',
    price: 49.90,
    category: 'frutos-do-mar',
    image: 'assets/moqueca_peixe.png',
    description: 'Caldeirada caprichada de peixe fresco com batatas, tomate, pimentão, cebola, coentro e cheiro-verde. Caldo encorpado e saboroso, servido com arroz e pirão. Serve 2 pessoas.',
    ingredients: ['Peixe fresco em postas', 'Batata', 'Tomate', 'Pimentão', 'Cebola', 'Coentro', 'Cheiro-verde', 'Arroz branco', 'Pirão'],
    tag: '',
    rating: 4.7,
    reviewsCount: 13
  },

  // =============================================
  // SALADAS 🥗
  // =============================================
  {
    id: 'salada_tropical',
    name: 'Salada Tropical',
    price: 18.90,
    category: 'saladas',
    image: 'assets/exec_peixe.png',
    description: 'Mix de folhas verdes frescas com manga, tomate-cereja, palmito, queijo coalho grelhado em cubos e molho de maracujá artesanal.',
    ingredients: ['Mix de folhas verdes', 'Manga fresca', 'Tomate-cereja', 'Palmito', 'Queijo coalho grelhado', 'Molho de maracujá'],
    tag: 'destaque',
    rating: 4.7,
    reviewsCount: 12
  },
  {
    id: 'salada_caesar',
    name: 'Salada Caesar Nordestina',
    price: 22.90,
    category: 'saladas',
    image: 'assets/exec_frango_grelhado.png',
    description: 'Releitura nordestina da clássica Caesar: alface americana crocante, tiras de carne de sol grelhada, croutons de macaxeira frita, parmesão e molho caesar da casa.',
    ingredients: ['Alface americana', 'Tiras de carne de sol', 'Croutons de macaxeira', 'Queijo parmesão', 'Molho caesar artesanal'],
    tag: '',
    rating: 4.6,
    reviewsCount: 8
  },
  {
    id: 'salada_fresca',
    name: 'Salada Fresca da Casa',
    price: 14.90,
    category: 'saladas',
    image: 'assets/exec_peixe.png',
    description: 'Salada refrescante de alface, tomate, pepino, cenoura ralada, beterraba e cebola roxa, temperada com azeite de oliva e limão.',
    ingredients: ['Alface', 'Tomate', 'Pepino', 'Cenoura ralada', 'Beterraba', 'Cebola roxa', 'Azeite de oliva', 'Limão'],
    tag: '',
    rating: 4.4,
    reviewsCount: 7
  },
  {
    id: 'salada_camarao',
    name: 'Salada com Camarão Grelhado',
    price: 29.90,
    category: 'saladas',
    image: 'assets/executivo_camarao.png',
    description: 'Salada premium com mix de folhas nobres, camarões grelhados, tomate seco, palmito pupunha, manga verde em lâminas e molho de mostarda com mel.',
    ingredients: ['Mix de folhas nobres', 'Camarões grelhados', 'Tomate seco', 'Palmito pupunha', 'Manga verde', 'Molho de mostarda e mel'],
    tag: 'mais-pedido',
    rating: 4.8,
    reviewsCount: 10
  },

  // =============================================
  // PETISCOS 🧀
  // =============================================
  {
    id: 'macaxeira_frita',
    name: 'Macaxeira Frita',
    price: 16.90,
    category: 'petiscos',
    image: 'assets/macaxeira_frita.png',
    description: 'Porção de macaxeira cozida e frita até dourar, crocante por fora e macia por dentro. Servida com manteiga de garrafa e sal grosso.',
    ingredients: ['Macaxeira selecionada', 'Manteiga de garrafa', 'Sal grosso'],
    tag: '',
    rating: 4.6,
    reviewsCount: 19
  },
  {
    id: 'bolinho_bacalhau',
    name: 'Bolinho de Bacalhau',
    price: 24.90,
    category: 'petiscos',
    image: 'assets/macaxeira_frita.png',
    description: 'Porção com 8 bolinhos de bacalhau super recheados, fritos até dourar, crocantes e cremosos por dentro. Servidos com maionese temperada da casa.',
    ingredients: ['Bacalhau desfiado', 'Batata', 'Salsinha', 'Cebola', 'Maionese temperada'],
    tag: '',
    rating: 4.5,
    reviewsCount: 13
  },
  {
    id: 'caldo_sururu',
    name: 'Caldo de Sururu',
    price: 15.90,
    category: 'petiscos',
    image: 'assets/moqueca_peixe.png',
    description: 'Caldo quente e encorpado de sururu, temperado with coentro, cebolinha e um toque de pimenta. Servido com farofa de dendê à parte. Porção individual.',
    ingredients: ['Sururu fresco', 'Coentro', 'Cebolinha', 'Pimenta', 'Farofa de dendê'],
    tag: 'destaque',
    rating: 4.7,
    reviewsCount: 15
  },
  {
    id: 'pasteis_queijo_carne',
    name: 'Mini Pastéis Variados',
    price: 19.90,
    category: 'petiscos',
    image: 'assets/macaxeira_frita.png',
    description: 'Porção com 10 mini pastéis fritos crocantes, sortidos de queijo coalho, carne de sol e camarão. Acompanha molho de pimenta artesanal.',
    ingredients: ['Massa crocante', 'Queijo coalho', 'Carne de sol', 'Camarão', 'Molho de pimenta artesanal'],
    tag: 'mais-pedido',
    rating: 4.7,
    reviewsCount: 22
  },
  {
    id: 'tapioca_recheada',
    name: 'Tapioca Recheada',
    price: 14.90,
    category: 'petiscos',
    image: 'assets/macaxeira_frita.png',
    description: 'Tapioca de gama artesanal recheada com queijo coalho e carne de sol desfiada. Crocante por fora e recheio cremoso, com manteiga de garrafa.',
    ingredients: ['Goma de tapioca artesanal', 'Queijo coalho', 'Carne de sol desfiada', 'Manteiga de garrafa'],
    tag: '',
    rating: 4.6,
    reviewsCount: 16
  },
  {
    id: 'calabresa_acebolada',
    name: 'Calabresa Acebolada',
    price: 21.90,
    category: 'petiscos',
    image: 'assets/bife_acebolado.png',
    description: 'Porção de linguiça calabresa artesanal grelhada e fatiada, coberta com cebolas caramelizadas na manteiga. Acompanha farofa e vinagrete.',
    ingredients: ['Linguiça calabresa artesanal', 'Cebola caramelizada', 'Farofa', 'Vinagrete'],
    tag: '',
    rating: 4.5,
    reviewsCount: 14
  },

  // =============================================
  // PRATOS PRINCIPAIS 🍲 (porções maiores / para compartilhar)
  // =============================================
  {
    id: 'buchada_guisada',
    name: 'Buchada de Bode',
    price: 39.90,
    category: 'pratos',
    image: 'assets/bode_guisado.png',
    description: 'Buchada de bode tradicional do sertão pernambucano, guisada lentamente em tempero regional com coentro, pimenta-do-reino e cheiro-verde. Acompanha arroz e pirão de leite.',
    ingredients: ['Buchada de bode', 'Coentro', 'Pimenta-do-reino', 'Cheiro-verde', 'Arroz branco', 'Pirão de leite'],
    tag: '',
    rating: 4.6,
    reviewsCount: 11
  },
  {
    id: 'rabada',
    name: 'Rabada com Agrião',
    price: 49.90,
    category: 'pratos',
    image: 'assets/costela_bafo.png',
    description: 'Rabada bovina cozida por horas até a carne se soltar do osso, acompanhada de agrião refogado, arroz branco, polenta cremosa e farofa.',
    ingredients: ['Rabada bovina', 'Agrião refogado', 'Arroz branco', 'Polenta cremosa', 'Farofa artesanal'],
    tag: '',
    rating: 4.7,
    reviewsCount: 9
  },
  {
    id: 'sarapatel',
    name: 'Sarapatel Pernambucano',
    price: 35.90,
    category: 'pratos',
    image: 'assets/bode_guisado.png',
    description: 'Sarapatel legítimo de Pernambuco, preparado com miúdos selecionados no tempero tradicional com coentro e cominho. Sabor forte e autêntico. Acompanha arroz e farofa.',
    ingredients: ['Miúdos selecionados', 'Coentro', 'Cominho', 'Pimentão', 'Tomate', 'Arroz branco', 'Farofa'],
    tag: 'destaque',
    rating: 4.5,
    reviewsCount: 8
  },
  {
    id: 'chambaril',
    name: 'Chambaril ao Molho',
    price: 52.90,
    category: 'pratos',
    image: 'assets/costela_bafo.png',
    description: 'Chambaril bovino cozido lentamente até desmanchar, em molho encorpado de tomate com ervas. Tutano macio e carne que derrete. Acompanha arroz e purê de batata.',
    ingredients: ['Chambaril bovino', 'Molho de tomate e ervas', 'Arroz branco', 'Purê de batata'],
    tag: '',
    rating: 4.8,
    reviewsCount: 7
  },

  // =============================================
  // BEBIDAS 🍻
  // =============================================
  {
    id: 'suco_caju',
    name: 'Suco Natural de Caju',
    price: 7.90,
    category: 'bebidas',
    image: 'assets/agua_coco.png',
    description: 'Suco natural de caju, feito com a fruta fresca colhida. Super refrescante e rico em vitamina C.',
    ingredients: ['Polpa natural de caju', 'Água gelada', 'Gelo picado'],
    tag: '',
    rating: 4.5,
    reviewsCount: 9
  },
  {
    id: 'suco_graviola',
    name: 'Suco de Graviola',
    price: 8.90,
    category: 'bebidas',
    image: 'assets/agua_coco.png',
    description: 'Suco cremoso de graviola natural. Uma explosão de sabor tropical, gelado e nutritivo.',
    ingredients: ['Polpa pura de graviola', 'Água gelada ou leite', 'Gelo'],
    tag: 'destaque',
    rating: 4.8,
    reviewsCount: 14
  },
  {
    id: 'cerveja_artesanal',
    name: 'Cerveja Nordestina 600ml',
    price: 14.90,
    category: 'bebidas',
    image: 'assets/caipirinha.png',
    description: 'Cerveja artesanal estilo Pale Ale, de fabricação regional em Pernambuco. Perfeita harmonia de malte e lúpulo, servida trincando de gelada.',
    ingredients: ['Lúpulo selecionado', 'Malte especial', 'Água mineral da região'],
    tag: 'mais-pedido',
    rating: 4.9,
    reviewsCount: 31
  },
  {
    id: 'suco_mangaba',
    name: 'Suco de Mangaba',
    price: 8.90,
    category: 'bebidas',
    image: 'assets/agua_coco.png',
    description: 'Suco natural de mangaba, fruta típica do Nordeste com sabor único e adocicado. Servido bem gelado.',
    ingredients: ['Polpa de mangaba', 'Água gelada', 'Gelo'],
    tag: '',
    rating: 4.6,
    reviewsCount: 7
  },
  {
    id: 'suco_acerola',
    name: 'Suco de Acerola',
    price: 7.90,
    category: 'bebidas',
    image: 'assets/caipirinha.png',
    description: 'Suco de acerola natural, pura vitamina C! Refrescante e levemente ácido, perfeito para acompanhar a refeição.',
    ingredients: ['Polpa de acerola fresca', 'Água gelada', 'Gelo'],
    tag: '',
    rating: 4.5,
    reviewsCount: 6
  },
  {
    id: 'suco_maracuja',
    name: 'Suco de Maracujá',
    price: 7.90,
    category: 'bebidas',
    image: 'assets/caipirinha.png',
    description: 'Suco natural de maracujá, levemente adoçado. Sabor marcante e refrescante, perfeito para o calor de Pernambuco.',
    ingredients: ['Polpa de maracujá', 'Água gelada', 'Gelo'],
    tag: '',
    rating: 4.5,
    reviewsCount: 8
  },
  {
    id: 'agua_coco',
    name: 'Água de Coco Natural',
    price: 6.90,
    category: 'bebidas',
    image: 'assets/agua_coco.png',
    description: 'Água de coco natural, geladinha e refrescante. Direto do coqueiro para sua mesa!',
    ingredients: ['Água de coco natural'],
    tag: '',
    rating: 4.7,
    reviewsCount: 12
  },
  {
    id: 'caipirinha',
    name: 'Caipirinha de Cachaça Artesanal',
    price: 15.90,
    category: 'bebidas',
    image: 'assets/caipirinha.png',
    description: 'Caipirinha preparada com cachaça artesanal pernambucana, limão tahiti fresco, açúcar e gelo. Opções: limão, maracujá, caju ou manga.',
    ingredients: ['Cachaça artesanal pernambucana', 'Limão fresco', 'Açúcar', 'Gelo'],
    tag: 'mais-pedido',
    rating: 4.8,
    reviewsCount: 19
  },
  {
    id: 'refrigerante',
    name: 'Refrigerante Lata 350ml',
    price: 5.90,
    category: 'bebidas',
    image: 'assets/caipirinha.png',
    description: 'Refrigerante em lata 350ml gelado. Opções: Coca-Cola, Guaraná Antarctica, Fanta Laranja, Sprite.',
    ingredients: ['Refrigerante gelado 350ml'],
    tag: '',
    rating: 4.3,
    reviewsCount: 5
  },

  // =============================================
  // SOBREMESAS 🍮
  // =============================================
  {
    id: 'cartola',
    name: 'Cartola Pernambucana',
    price: 15.90,
    category: 'sobremesas',
    image: 'assets/cartola.png',
    description: 'A mais tradicional sobremesa pernambucana! Bananas maduras fritas na chapa, queijo coalho assado derretido, tudo polvilhado com muito açúcar e canela.',
    ingredients: ['Bananas maduras', 'Queijo coalho de Pernambuco', 'Açúcar refinado', 'Canela em pó especial'],
    tag: 'destaque',
    rating: 4.9,
    reviewsCount: 41
  },
  {
    id: 'pudim',
    name: 'Pudim de Leite Condensado',
    price: 12.00,
    category: 'sobremesas',
    image: 'assets/cartola.png',
    description: 'Pudim de leite condensado super cremoso e aveludado, feito sem furinhos, coberto com uma calda brilhante de caramelo artesanal.',
    ingredients: ['Leite condensado selecionado', 'Leite integral', 'Ovos frescos', 'Caramelo de açúcar'],
    tag: 'promocao',
    rating: 4.7,
    reviewsCount: 19
  },
  {
    id: 'bolo_rolo',
    name: 'Bolo de Rolo',
    price: 13.90,
    category: 'sobremesas',
    image: 'assets/cartola.png',
    description: 'Fatia generosa do legítimo bolo de rolo pernambucano, com camadas fininhas de massa e recheio de goiabada artesanal derretida. Patrimônio doce de PE.',
    ingredients: ['Massa fina de bolo', 'Goiabada artesanal', 'Manteiga', 'Ovos caipira'],
    tag: 'destaque',
    rating: 4.9,
    reviewsCount: 27
  },
  {
    id: 'cocada',
    name: 'Cocada Cremosa',
    price: 9.90,
    category: 'sobremesas',
    image: 'assets/cartola.png',
    description: 'Cocada cremosa artesanal feita com coco fresco ralado, leite condensado e um toque de canela. Servida em porção individual.',
    ingredients: ['Coco fresco ralado', 'Leite condensado', 'Açúcar', 'Canela'],
    tag: '',
    rating: 4.6,
    reviewsCount: 11
  },
  {
    id: 'bolo_macaxeira',
    name: 'Bolo de Macaxeira',
    price: 10.90,
    category: 'sobremesas',
    image: 'assets/cartola.png',
    description: 'Bolo de macaxeira caseiro, úmido e fofinho, com sabor suave de coco. Receita tradicional de família do interior de Pernambuco.',
    ingredients: ['Macaxeira ralada', 'Leite de coco', 'Ovos', 'Açúcar', 'Manteiga'],
    tag: '',
    rating: 4.6,
    reviewsCount: 9
  },
  {
    id: 'sorvete_tapioca',
    name: 'Sorvete de Tapioca com Coco',
    price: 11.90,
    category: 'sobremesas',
    image: 'assets/cartola.png',
    description: 'Sorvete artesanal de tapioca com pedaços de coco queimado, servido com calda de rapadura. Uma sobremesa que é a cara do Nordeste.',
    ingredients: ['Sorvete de tapioca artesanal', 'Coco queimado', 'Calda de rapadura'],
    tag: 'mais-pedido',
    rating: 4.8,
    reviewsCount: 16
  },

  // =============================================
  // PROMOÇÕES 🏷️
  // =============================================
  {
    id: 'promo_casal',
    name: 'Combo Casal Nordestino',
    price: 59.90,
    category: 'promocoes',
    image: 'assets/carne_sol_macaxeira.png',
    description: 'Combo especial para 2: Baião de dois com carne de sol desfiada + 2 sucos naturais à escolha + 2 fatias de cartola. Economia e sabor na mesa!',
    ingredients: ['Baião de dois completo', 'Carne de sol desfiada', '2 sucos naturais', '2 cartolas'],
    tag: 'promocao',
    rating: 4.9,
    reviewsCount: 20
  },
  {
    id: 'promo_happy_hour',
    name: 'Happy Hour VK',
    price: 39.90,
    category: 'promocoes',
    image: 'assets/caipirinha.png',
    description: 'Combo happy hour: Porção de dadinhos de coalho + porção de macaxeira frita + 2 cervejas artesanais 600ml. Válido de terça a quinta, das 17h às 19h.',
    ingredients: ['Dadinhos de coalho', 'Macaxeira frita', '2 cervejas artesanais 600ml'],
    tag: 'promocao',
    rating: 4.8,
    reviewsCount: 24
  },
  {
    id: 'promo_familia',
    name: 'Combo Família VK',
    price: 119.90,
    category: 'promocoes',
    image: 'assets/galeto_completo.png',
    description: 'Combo para a família inteira (4 pessoas): Galeto completo na brasa + porção de macaxeira frita + arroz, feijão e farofa + 1 jarra de suco natural de 1L + 4 pudins.',
    ingredients: ['Galeto completo', 'Macaxeira frita', 'Arroz, feijão e farofa', 'Jarra de suco 1L', '4 pudins de leite condensado'],
    tag: 'promocao',
    rating: 4.9,
    reviewsCount: 15
  }
];

const DEFAULT_COMMENTS = [];

// Exporta para uso no app.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DEFAULT_CATEGORIES, DEFAULT_DISHES, DEFAULT_COMMENTS };
}
