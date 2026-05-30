CREATE TABLE IF NOT EXISTS dishes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    category TEXT NOT NULL,
    image TEXT,
    description TEXT,
    ingredients TEXT[],
    tag TEXT,
    rating NUMERIC DEFAULT 5.0,
    reviewsCount INTEGER DEFAULT 0
);\n\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('dadinhos', 'Dadinhos de Coalho', 22.90, 'destaques', NULL, 'Dadinhos de queijo coalho fritos até dourar, super crocantes por fora e macios por dentro. Servidos com um maravilhoso melaço de cana artesanal.', ARRAY['Queijo coalho artesanal', 'Melaço de cana de açúcar', 'Tempero da casa'], 'mais-pedido', 4.8, 28)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('baiao_de_dois', 'Baião de Dois Completo', 34.90, 'destaques', NULL, 'O clássico baião de dois nordestino feito com arroz, feijão de corda, queijo coalho derretido, nata da terra, calabresa artesanal e coentro fresco. Acompanha carne de sol desfiada e farofa de manteiga.', ARRAY['Arroz e feijão de corda', 'Queijo coalho derretido', 'Nata da terra', 'Calabresa artesanal', 'Carne de sol desfiada', 'Coentro fresco', 'Farofa de manteiga'], 'destaque', 4.9, 37)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('carne_sol_nata', 'Carne de Sol na Nata', 42.90, 'destaques', NULL, 'Generosa porção de carne de sol de primeira, desfiada e mergulhada em nata cremosa da terra. Acompanha arroz branco, macaxeira frita dourada e vinagrete fresco.', ARRAY['Carne de sol de primeira', 'Nata cremosa da terra', 'Arroz branco', 'Macaxeira frita', 'Vinagrete'], 'mais-pedido', 5.0, 45)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('escondidinho', 'Escondidinho de Carne de Sol', 32.90, 'destaques', NULL, 'Escondidinho cremoso de macaxeira com recheio de carne de sol desfiada e temperada, gratinado com queijo coalho até borbulhar. Sabor que é a cara do Nordeste.', ARRAY['Purê de macaxeira cremoso', 'Carne de sol desfiada', 'Queijo coalho gratinado', 'Manteiga de garrafa', 'Temperos nordestinos'], 'destaque', 4.9, 33)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('feijoada', 'Executivo Feijoada', 26.99, 'executivos', 'assets/executivo_feijoada.png', 'Deliciosa feijoada completa servida na panela de barro. Acompanha arroz branco soltinho, couve refogada na manteiga, farofa artesanal, vinagrete fresco e fatias de laranja.', ARRAY['Feijoada de carnes nobres', 'Arroz branco soltinho', 'Couve na manteiga', 'Farofa artesanal da casa', 'Vinagrete fresco', 'Fatias de laranja'], 'prato-do-dia', 4.9, 18)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('cupim', 'Executivo Cupim', 29.99, 'executivos', 'assets/executivo_cupim.png', 'Cupim bovino selecionado, assado lentamente até desfiar, extremamente macio. Acompanha arroz branco, feijão de corda caseiro, farofa da casa, vinagrete e folhas de alface fresca.', ARRAY['Cupim assado lentamente', 'Arroz branco', 'Feijão de corda', 'Farofa artesanal', 'Vinagrete', 'Folhas de alface'], 'promocao', 4.8, 22)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('camarao', 'Executivo Camarão Especial', 29.99, 'executivos', 'assets/executivo_camarao.png', 'Camarões selecionados mergulhados em um creme de queijo super cremoso e especial. Acompanha arroz branco bem soltinho, batatas fritas douradas e salada fresca de alface.', ARRAY['Camarões frescos selecionados', 'Creme de queijo especial', 'Arroz branco soltinho', 'Batatas fritas crocantes', 'Salada fresca de alface'], 'destaque', 5.0, 15)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('exec_frango_grelhado', 'Executivo Frango Grelhado', 24.90, 'executivos', NULL, 'Filé de frango grelhado suculento, temperado com ervas finas nordestinas. Acompanha arroz branco, feijão caseiro, farofa, vinagrete e salada de alface com tomate.', ARRAY['Filé de frango grelhado', 'Arroz branco', 'Feijão caseiro', 'Farofa artesanal', 'Vinagrete', 'Salada verde'], 'prato-do-dia', 4.6, 12)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('exec_bisteca', 'Executivo Bisteca Suína', 27.90, 'executivos', NULL, 'Bisteca suína grossa e suculenta, grelhada no ponto com tempero especial da casa. Acompanha arroz, feijão, farofa de cebola e vinagrete.', ARRAY['Bisteca suína grelhada', 'Arroz branco', 'Feijão carioca', 'Farofa de cebola', 'Vinagrete fresco'], NULL, 4.5, 8)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('exec_charque', 'Executivo Charque', 28.90, 'executivos', NULL, 'Charque pernambucano desfiado e refogado na manteiga de garrafa, com aroma inconfundível do sertão. Acompanha arroz, feijão de corda, macaxeira frita e vinagrete.', ARRAY['Charque desfiado', 'Manteiga de garrafa', 'Arroz branco', 'Feijão de corda', 'Macaxeira frita', 'Vinagrete'], NULL, 4.7, 14)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('exec_peixe', 'Executivo Peixe Grelhado', 28.90, 'executivos', NULL, 'Filé de peixe branco grelhado, fresco do dia, com molho de alcaparras suave. Acompanha arroz, purê de macaxeira, salada fresca e vinagrete.', ARRAY['Filé de peixe fresco', 'Molho de alcaparras', 'Arroz branco', 'Purê de macaxeira', 'Salada mista', 'Vinagrete'], NULL, 4.6, 10)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('picanha_brasa', 'Picanha na Brasa', 74.90, 'carnes', NULL, 'Picanha bovina de primeira assada na brasa, suculenta e no ponto escolhido. Servida com arroz, feijão tropeiro, farofa de ovos, vinagrete e mandioca frita. Serve 2 pessoas.', ARRAY['Picanha bovina selecionada', 'Arroz branco', 'Feijão tropeiro', 'Farofa de ovos', 'Vinagrete', 'Mandioca frita'], 'mais-pedido', 4.9, 29)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('costela_bafo', 'Costela no Bafo', 69.90, 'carnes', NULL, 'Costela bovina cozida lentamente no bafo por horas até desfiar no garfo. Extremamente macia e suculenta. Acompanha arroz, feijão de corda, farofa de manteiga e vinagrete. Serve 2 pessoas.', ARRAY['Costela bovina no bafo', 'Arroz branco', 'Feijão de corda', 'Farofa de manteiga', 'Vinagrete fresco'], 'destaque', 4.8, 21)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('bife_acebolado', 'Bife Acebolado', 38.90, 'carnes', NULL, 'Bife bovino suculento de contra-filé, grelhado e coberto com uma generosa cama de cebolas douradas na manteiga. Acompanha arroz, feijão, farofa e vinagrete.', ARRAY['Bife de contra-filé', 'Cebolas caramelizadas na manteiga', 'Arroz branco', 'Feijão caseiro', 'Farofa', 'Vinagrete'], NULL, 4.6, 16)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('carne_sol_macaxeira', 'Carne de Sol com Macaxeira', 44.90, 'carnes', NULL, 'Peça de carne de sol assada na brasa, servida com macaxeira frita crocante, arroz, feijão de corda, manteiga de garrafa e vinagrete. Clássico pernambucano.', ARRAY['Carne de sol assada na brasa', 'Macaxeira frita', 'Arroz branco', 'Feijão de corda', 'Manteiga de garrafa', 'Vinagrete'], 'mais-pedido', 4.9, 38)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('bode_guisado', 'Bode Guisado', 46.90, 'carnes', NULL, 'Bode guisado lentamente no tempero sertanejo com pimentão, tomate, cebola e coentro. Sabor forte e autêntico do interior de Pernambuco. Acompanha arroz, pirão de leite e farofa.', ARRAY['Carne de bode', 'Pimentão', 'Tomate', 'Cebola', 'Coentro', 'Arroz branco', 'Pirão de leite', 'Farofa'], 'destaque', 4.7, 19)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('costelinha_suina', 'Costelinha Suína ao Molho Barbecue', 52.90, 'suinos', NULL, 'Costelinha suína assada lentamente e finalizada com molho barbecue artesanal defumado. Carne que solta do osso! Acompanha arroz, coleslaw nordestino e batatas rústicas.', ARRAY['Costelinha suína', 'Molho barbecue artesanal', 'Arroz branco', 'Coleslaw nordestino', 'Batatas rústicas'], 'destaque', 4.8, 17)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('pernil_assado', 'Pernil Assado Desfiado', 39.90, 'suinos', NULL, 'Pernil suíno assado por horas, desfiado e finalizado com crocância na chapa. Acompanha arroz, feijão caseiro, farofa de cebola e vinagrete.', ARRAY['Pernil suíno assado', 'Arroz branco', 'Feijão caseiro', 'Farofa de cebola', 'Vinagrete'], NULL, 4.6, 11)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('porco_tapioca', 'Lombo Suíno à Sertaneja', 42.90, 'suinos', NULL, 'Lombo suíno grelhado com crosta de manteiga de garrafa e ervas do sertão. Servido com purê de macaxeira, arroz e couve refogada na manteiga.', ARRAY['Lombo suíno', 'Manteiga de garrafa', 'Ervas do sertão', 'Purê de macaxeira', 'Arroz branco', 'Couve na manteiga'], NULL, 4.7, 9)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('torresmo', 'Porção de Torresmo Crocante', 24.90, 'suinos', NULL, 'Porção generosa de torresmo de barriga suína, frito até ficar super crocante e sequinho. Acompanha limão e molho vinagrete picante.', ARRAY['Barriga suína selecionada', 'Limão', 'Vinagrete picante', 'Sal grosso'], 'mais-pedido', 4.8, 25)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('galeto', 'Galeto Completo', 69.99, 'aves', 'assets/galeto_completo.png', 'Galeto inteiro assado na brasa, super suculento e dourado. Acompanha porção generosa de batatas fritas crocantes, arroz branco, feijão caseiro, farofa e vinagrete. Serve de 2 a 3 pessoas.', ARRAY['Galeto inteiro na brasa', 'Batatas fritas crocantes', 'Arroz branco', 'Feijão caseiro temperado', 'Farofa artesanal', 'Vinagrete'], 'mais-pedido', 4.9, 34)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('frango_catupiry', 'Frango ao Catupiry', 36.90, 'aves', NULL, 'Peito de frango grelhado e coberto com creme de catupiry gratinado, acompanhado de arroz branco, batata frita crocante e salada fresca.', ARRAY['Peito de frango grelhado', 'Creme de catupiry gratinado', 'Arroz branco', 'Batata frita', 'Salada fresca'], NULL, 4.5, 13)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('coxa_sobrecoxa', 'Coxa e Sobrecoxa Assada', 34.90, 'aves', NULL, 'Coxa e sobrecoxa de frango caipira assadas com tempero caseiro nordestino, douradas e super suculentas. Acompanha arroz, feijão, farofa de manteiga e vinagrete.', ARRAY['Coxa e sobrecoxa caipira', 'Tempero caseiro nordestino', 'Arroz branco', 'Feijão caseiro', 'Farofa de manteiga', 'Vinagrete'], 'prato-do-dia', 4.7, 18)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('galinha_cabidela', 'Galinha à Cabidela', 39.90, 'aves', NULL, 'Tradicional galinha à cabidela pernambucana, cozida no molho pardo encorpado com especiarias regionais. Acompanha arroz branco, farofa de dendê e vinagrete.', ARRAY['Galinha caipira', 'Molho pardo tradicional', 'Especiarias regionais', 'Arroz branco', 'Farofa de dendê', 'Vinagrete'], 'destaque', 4.8, 22)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('filé_frango_parmegiana', 'Frango à Parmegiana', 36.90, 'aves', NULL, 'Filé de frango empanado e frito, coberto com molho de tomate caseiro e queijo muçarela gratinado. Acompanha arroz branco e batata frita.', ARRAY['Filé de frango empanado', 'Molho de tomate caseiro', 'Queijo muçarela gratinado', 'Arroz branco', 'Batata frita'], NULL, 4.6, 15)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('moqueca_peixe', 'Moqueca de Peixe', 54.90, 'frutos-do-mar', NULL, 'Moqueca de peixe fresco com leite de coco, azeite de dendê, pimentão, tomate e coentro, servida na panela de barro fervendo. Acompanha arroz branco e pirão de peixe. Serve 2 pessoas.', ARRAY['Peixe fresco do dia', 'Leite de coco', 'Azeite de dendê', 'Pimentão', 'Tomate', 'Cebola', 'Coentro', 'Arroz branco', 'Pirão de peixe'], 'destaque', 4.9, 26)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('camarao_alho_oleo', 'Camarão no Alho e Óleo', 49.90, 'frutos-do-mar', NULL, 'Camarões graúdos salteados no alho dourado e azeite de oliva extra virgem, finalizados com ervas frescas e limão siciliano. Acompanha arroz branco e salada verde.', ARRAY['Camarões graúdos', 'Alho dourado', 'Azeite extra virgem', 'Ervas frescas', 'Limão siciliano', 'Arroz branco', 'Salada verde'], 'mais-pedido', 4.8, 20)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('peixe_frito', 'Peixe Frito Inteiro', 44.90, 'frutos-do-mar', NULL, 'Peixe inteiro do dia, frito crocante na hora, com tempero regional de limão e coentro. Acompanha arroz, baião de dois, vinagrete e macaxeira frita.', ARRAY['Peixe inteiro fresco', 'Limão', 'Coentro', 'Arroz branco', 'Baião de dois', 'Vinagrete', 'Macaxeira frita'], NULL, 4.7, 14)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('casquinha_siri', 'Casquinha de Siri', 19.90, 'frutos-do-mar', NULL, 'Casquinha de siri gratinada com recheio cremoso de siri desfiado, temperado com ervas, leite de coco e gratinado com queijo parmesão. Porção com 2 unidades.', ARRAY['Siri desfiado', 'Leite de coco', 'Queijo parmesão gratinado', 'Ervas finas', 'Farinha de rosca'], NULL, 4.6, 11)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('caldeirada_peixe', 'Caldeirada de Peixe', 49.90, 'frutos-do-mar', NULL, 'Caldeirada caprichada de peixe fresco com batatas, tomate, pimentão, cebola, coentro e cheiro-verde. Caldo encorpado e saboroso, servido com arroz e pirão. Serve 2 pessoas.', ARRAY['Peixe fresco em postas', 'Batata', 'Tomate', 'Pimentão', 'Cebola', 'Coentro', 'Cheiro-verde', 'Arroz branco', 'Pirão'], NULL, 4.7, 13)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('salada_tropical', 'Salada Tropical', 18.90, 'saladas', NULL, 'Mix de folhas verdes frescas com manga, tomate-cereja, palmito, queijo coalho grelhado em cubos e molho de maracujá artesanal.', ARRAY['Mix de folhas verdes', 'Manga fresca', 'Tomate-cereja', 'Palmito', 'Queijo coalho grelhado', 'Molho de maracujá'], 'destaque', 4.7, 12)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('salada_caesar', 'Salada Caesar Nordestina', 22.90, 'saladas', NULL, 'Releitura nordestina da clássica Caesar: alface americana crocante, tiras de carne de sol grelhada, croutons de macaxeira frita, parmesão e molho caesar da casa.', ARRAY['Alface americana', 'Tiras de carne de sol', 'Croutons de macaxeira', 'Queijo parmesão', 'Molho caesar artesanal'], NULL, 4.6, 8)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('salada_fresca', 'Salada Fresca da Casa', 14.90, 'saladas', NULL, 'Salada refrescante de alface, tomate, pepino, cenoura ralada, beterraba e cebola roxa, temperada com azeite de oliva e limão.', ARRAY['Alface', 'Tomate', 'Pepino', 'Cenoura ralada', 'Beterraba', 'Cebola roxa', 'Azeite de oliva', 'Limão'], NULL, 4.4, 7)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('salada_camarao', 'Salada com Camarão Grelhado', 29.90, 'saladas', NULL, 'Salada premium com mix de folhas nobres, camarões grelhados, tomate seco, palmito pupunha, manga verde em lâminas e molho de mostarda com mel.', ARRAY['Mix de folhas nobres', 'Camarões grelhados', 'Tomate seco', 'Palmito pupunha', 'Manga verde', 'Molho de mostarda e mel'], 'mais-pedido', 4.8, 10)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('macaxeira_frita', 'Macaxeira Frita', 16.90, 'petiscos', NULL, 'Porção de macaxeira cozida e frita até dourar, crocante por fora e macia por dentro. Servida com manteiga de garrafa e sal grosso.', ARRAY['Macaxeira selecionada', 'Manteiga de garrafa', 'Sal grosso'], NULL, 4.6, 19)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('bolinho_bacalhau', 'Bolinho de Bacalhau', 24.90, 'petiscos', NULL, 'Porção com 8 bolinhos de bacalhau super recheados, fritos até dourar, crocantes e cremosos por dentro. Servidos com maionese temperada da casa.', ARRAY['Bacalhau desfiado', 'Batata', 'Salsinha', 'Cebola', 'Maionese temperada'], NULL, 4.5, 13)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('caldo_sururu', 'Caldo de Sururu', 15.90, 'petiscos', NULL, 'Caldo quente e encorpado de sururu, temperado com coentro, cebolinha e um toque de pimenta. Servido com farofa de dendê à parte. Porção individual.', ARRAY['Sururu fresco', 'Coentro', 'Cebolinha', 'Pimenta', 'Farofa de dendê'], 'destaque', 4.7, 15)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('pasteis_queijo_carne', 'Mini Pastéis Variados', 19.90, 'petiscos', NULL, 'Porção com 10 mini pastéis fritos crocantes, sortidos de queijo coalho, carne de sol e camarão. Acompanha molho de pimenta artesanal.', ARRAY['Massa crocante', 'Queijo coalho', 'Carne de sol', 'Camarão', 'Molho de pimenta artesanal'], 'mais-pedido', 4.7, 22)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('tapioca_recheada', 'Tapioca Recheada', 14.90, 'petiscos', NULL, 'Tapioca de goma artesanal recheada com queijo coalho e carne de sol desfiada. Crocante por fora e recheio cremoso, com manteiga de garrafa.', ARRAY['Goma de tapioca artesanal', 'Queijo coalho', 'Carne de sol desfiada', 'Manteiga de garrafa'], NULL, 4.6, 16)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('calabresa_acebolada', 'Calabresa Acebolada', 21.90, 'petiscos', NULL, 'Porção de linguiça calabresa artesanal grelhada e fatiada, coberta com cebolas caramelizadas na manteiga. Acompanha farofa e vinagrete.', ARRAY['Linguiça calabresa artesanal', 'Cebola caramelizada', 'Farofa', 'Vinagrete'], NULL, 4.5, 14)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('buchada_guisada', 'Buchada de Bode', 39.90, 'pratos', NULL, 'Buchada de bode tradicional do sertão pernambucano, guisada lentamente em tempero regional com coentro, pimenta-do-reino e cheiro-verde. Acompanha arroz e pirão de leite.', ARRAY['Buchada de bode', 'Coentro', 'Pimenta-do-reino', 'Cheiro-verde', 'Arroz branco', 'Pirão de leite'], NULL, 4.6, 11)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('rabada', 'Rabada com Agrião', 49.90, 'pratos', NULL, 'Rabada bovina cozida por horas até a carne se soltar do osso, acompanhada de agrião refogado, arroz branco, polenta cremosa e farofa.', ARRAY['Rabada bovina', 'Agrião refogado', 'Arroz branco', 'Polenta cremosa', 'Farofa artesanal'], NULL, 4.7, 9)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('sarapatel', 'Sarapatel Pernambucano', 35.90, 'pratos', NULL, 'Sarapatel legítimo de Pernambuco, preparado com miúdos selecionados no tempero tradicional com coentro e cominho. Sabor forte e autêntico. Acompanha arroz e farofa.', ARRAY['Miúdos selecionados', 'Coentro', 'Cominho', 'Pimentão', 'Tomate', 'Arroz branco', 'Farofa'], 'destaque', 4.5, 8)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('chambaril', 'Chambaril ao Molho', 52.90, 'pratos', NULL, 'Chambaril bovino cozido lentamente até desmanchar, em molho encorpado de tomate com ervas. Tutano macio e carne que derrete. Acompanha arroz e purê de batata.', ARRAY['Chambaril bovino', 'Molho de tomate e ervas', 'Arroz branco', 'Purê de batata'], NULL, 4.8, 7)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('suco_caju', 'Suco Natural de Caju', 7.90, 'bebidas', NULL, 'Suco natural de caju, feito com a fruta fresca colhida. Super refrescante e rico em vitamina C.', ARRAY['Polpa natural de caju', 'Água gelada', 'Gelo picado'], NULL, 4.5, 9)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('suco_graviola', 'Suco de Graviola', 8.90, 'bebidas', NULL, 'Suco cremoso de graviola natural. Uma explosão de sabor tropical, gelado e nutritivo.', ARRAY['Polpa pura de graviola', 'Água gelada ou leite', 'Gelo'], 'destaque', 4.8, 14)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('cerveja_artesanal', 'Cerveja Nordestina 600ml', 14.90, 'bebidas', NULL, 'Cerveja artesanal estilo Pale Ale, de fabricação regional em Pernambuco. Perfeita harmonia de malte e lúpulo, servida trincando de gelada.', ARRAY['Lúpulo selecionado', 'Malte especial', 'Água mineral da região'], 'mais-pedido', 4.9, 31)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('suco_mangaba', 'Suco de Mangaba', 8.90, 'bebidas', NULL, 'Suco natural de mangaba, fruta típica do Nordeste com sabor único e adocicado. Servido bem gelado.', ARRAY['Polpa de mangaba', 'Água gelada', 'Gelo'], NULL, 4.6, 7)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('suco_acerola', 'Suco de Acerola', 7.90, 'bebidas', NULL, 'Suco de acerola natural, pura vitamina C! Refrescante e levemente ácido, perfeito para acompanhar a refeição.', ARRAY['Polpa de acerola fresca', 'Água gelada', 'Gelo'], NULL, 4.5, 6)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('suco_maracuja', 'Suco de Maracujá', 7.90, 'bebidas', NULL, 'Suco natural de maracujá, levemente adoçado. Sabor marcante e refrescante, perfeito para o calor de Pernambuco.', ARRAY['Polpa de maracujá', 'Água gelada', 'Gelo'], NULL, 4.5, 8)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('agua_coco', 'Água de Coco Natural', 6.90, 'bebidas', NULL, 'Água de coco natural, geladinha e refrescante. Direto do coqueiro para sua mesa!', ARRAY['Água de coco natural'], NULL, 4.7, 12)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('caipirinha', 'Caipirinha de Cachaça Artesanal', 15.90, 'bebidas', NULL, 'Caipirinha preparada com cachaça artesanal pernambucana, limão tahiti fresco, açúcar e gelo. Opções: limão, maracujá, caju ou manga.', ARRAY['Cachaça artesanal pernambucana', 'Limão fresco', 'Açúcar', 'Gelo'], 'mais-pedido', 4.8, 19)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('refrigerante', 'Refrigerante Lata 350ml', 5.90, 'bebidas', NULL, 'Refrigerante em lata 350ml gelado. Opções: Coca-Cola, Guaraná Antarctica, Fanta Laranja, Sprite.', ARRAY['Refrigerante gelado 350ml'], NULL, 4.3, 5)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('cartola', 'Cartola Pernambucana', 15.90, 'sobremesas', NULL, 'A mais tradicional sobremesa pernambucana! Bananas maduras fritas na chapa, queijo coalho assado derretido, tudo polvilhado com muito açúcar e canela.', ARRAY['Bananas maduras', 'Queijo coalho de Pernambuco', 'Açúcar refinado', 'Canela em pó especial'], 'destaque', 4.9, 41)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('pudim', 'Pudim de Leite Condensado', 12.00, 'sobremesas', NULL, 'Pudim de leite condensado super cremoso e aveludado, feito sem furinhos, coberto com uma calda brilhante de caramelo artesanal.', ARRAY['Leite condensado selecionado', 'Leite integral', 'Ovos frescos', 'Caramelo de açúcar'], 'promocao', 4.7, 19)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('bolo_rolo', 'Bolo de Rolo', 13.90, 'sobremesas', NULL, 'Fatia generosa do legítimo bolo de rolo pernambucano, com camadas fininhas de massa e recheio de goiabada artesanal derretida. Patrimônio doce de PE.', ARRAY['Massa fina de bolo', 'Goiabada artesanal', 'Manteiga', 'Ovos caipira'], 'destaque', 4.9, 27)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('cocada', 'Cocada Cremosa', 9.90, 'sobremesas', NULL, 'Cocada cremosa artesanal feita com coco fresco ralado, leite condensado e um toque de canela. Servida em porção individual.', ARRAY['Coco fresco ralado', 'Leite condensado', 'Açúcar', 'Canela'], NULL, 4.6, 11)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('bolo_macaxeira', 'Bolo de Macaxeira', 10.90, 'sobremesas', NULL, 'Bolo de macaxeira caseiro, úmido e fofinho, com sabor suave de coco. Receita tradicional de família do interior de Pernambuco.', ARRAY['Macaxeira ralada', 'Leite de coco', 'Ovos', 'Açúcar', 'Manteiga'], NULL, 4.6, 9)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('sorvete_tapioca', 'Sorvete de Tapioca com Coco', 11.90, 'sobremesas', NULL, 'Sorvete artesanal de tapioca com pedaços de coco queimado, servido com calda de rapadura. Uma sobremesa que é a cara do Nordeste.', ARRAY['Sorvete de tapioca artesanal', 'Coco queimado', 'Calda de rapadura'], 'mais-pedido', 4.8, 16)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('promo_casal', 'Combo Casal Nordestino', 59.90, 'promocoes', NULL, 'Combo especial para 2: Baião de dois com carne de sol desfiada + 2 sucos naturais à escolha + 2 fatias de cartola. Economia e sabor na mesa!', ARRAY['Baião de dois completo', 'Carne de sol desfiada', '2 sucos naturais', '2 cartolas'], 'promocao', 4.9, 20)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('promo_happy_hour', 'Happy Hour VK', 39.90, 'promocoes', NULL, 'Combo happy hour: Porção de dadinhos de coalho + porção de macaxeira frita + 2 cervejas artesanais 600ml. Válido de terça a quinta, das 17h às 19h.', ARRAY['Dadinhos de coalho', 'Macaxeira frita', '2 cervejas artesanais 600ml'], 'promocao', 4.8, 24)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\nINSERT INTO dishes (id, name, price, category, image, description, ingredients, tag, rating, reviewsCount) 
VALUES ('promo_familia', 'Combo Família VK', 119.90, 'promocoes', NULL, 'Combo para a família inteira (4 pessoas): Galeto completo na brasa + porção de macaxeira frita + arroz, feijão e farofa + 1 jarra de suco natural de 1L + 4 pudins.', ARRAY['Galeto completo', 'Macaxeira frita', 'Arroz, feijão e farofa', 'Jarra de suco 1L', '4 pudins de leite condensado'], 'promocao', 4.9, 15)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, category = EXCLUDED.category, image = EXCLUDED.image, 
    description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, tag = EXCLUDED.tag, 
    rating = EXCLUDED.rating, reviewsCount = EXCLUDED.reviewsCount;\n
