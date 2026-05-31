-- ====================================================================
-- VK RESTAURANTE — SCRIPT DE ATUALIZAÇÃO E VINCULAÇÃO DE IMAGENS PREMIUM
-- ====================================================================
-- Como usar: Cole este script completo no SQL Editor do seu painel Supabase
-- e clique em "Run". Isso atualizará instantaneamente a nuvem em 1 segundo!
-- ====================================================================

-- 1. DESTAQUES
UPDATE dishes SET image = 'assets/macaxeira_frita.png' WHERE id = 'dadinhos';
UPDATE dishes SET image = 'assets/carne_sol_macaxeira.png' WHERE id = 'baiao_de_dois';
UPDATE dishes SET image = 'assets/bode_guisado.png' WHERE id = 'carne_sol_nata';
UPDATE dishes SET image = 'assets/costela_bafo.png' WHERE id = 'escondidinho';

-- 2. EXECUTIVOS
UPDATE dishes SET image = 'assets/executivo_feijoada.png' WHERE id = 'feijoada';
UPDATE dishes SET image = 'assets/executivo_cupim.png' WHERE id = 'cupim';
UPDATE dishes SET image = 'assets/executivo_camarao.png' WHERE id = 'camarao';
UPDATE dishes SET image = 'assets/exec_frango_grelhado.png' WHERE id = 'exec_frango_grelhado';
UPDATE dishes SET image = 'assets/costelinha_suina.png' WHERE id = 'exec_bisteca';
UPDATE dishes SET image = 'assets/exec_charque.png' WHERE id = 'exec_charque';
UPDATE dishes SET image = 'assets/exec_peixe.png' WHERE id = 'exec_peixe';

-- 3. CARNES BOVINAS
UPDATE dishes SET image = 'assets/picanha_brasa.png' WHERE id = 'picanha_brasa';
UPDATE dishes SET image = 'assets/costela_bafo.png' WHERE id = 'costela_bafo';
UPDATE dishes SET image = 'assets/bife_acebolado.png' WHERE id = 'bife_acebolado';
UPDATE dishes SET image = 'assets/carne_sol_macaxeira.png' WHERE id = 'carne_sol_macaxeira';
UPDATE dishes SET image = 'assets/bode_guisado.png' WHERE id = 'bode_guisado';

-- 4. CARNES SUÍNAS
UPDATE dishes SET image = 'assets/costelinha_suina.png' WHERE id = 'costelinha_suina';
UPDATE dishes SET image = 'assets/pernil_assado.png' WHERE id = 'pernil_assado';
UPDATE dishes SET image = 'assets/pernil_assado.png' WHERE id = 'porco_tapioca';
UPDATE dishes SET image = 'assets/torresmo.png' WHERE id = 'torresmo';

-- 5. AVES
UPDATE dishes SET image = 'assets/galeto_completo.png' WHERE id = 'galeto';
UPDATE dishes SET image = 'assets/frango_parmegiana.png' WHERE id = 'frango_catupiry';
UPDATE dishes SET image = 'assets/exec_frango_grelhado.png' WHERE id = 'coxa_sobrecoxa';
UPDATE dishes SET image = 'assets/bode_guisado.png' WHERE id = 'galinha_cabidela';
UPDATE dishes SET image = 'assets/frango_parmegiana.png' WHERE id = 'filé_frango_parmegiana';

-- 6. FRUTOS DO MAR
UPDATE dishes SET image = 'assets/moqueca_peixe.png' WHERE id = 'moqueca_peixe';
UPDATE dishes SET image = 'assets/executivo_camarao.png' WHERE id = 'camarao_alho_oleo';
UPDATE dishes SET image = 'assets/exec_peixe.png' WHERE id = 'peixe_frito';
UPDATE dishes SET image = 'assets/moqueca_peixe.png' WHERE id = 'casquinha_siri';
UPDATE dishes SET image = 'assets/moqueca_peixe.png' WHERE id = 'caldeirada_peixe';

-- 7. SALADAS
UPDATE dishes SET image = 'assets/exec_peixe.png' WHERE id = 'salada_tropical';
UPDATE dishes SET image = 'assets/exec_frango_grelhado.png' WHERE id = 'salada_caesar';
UPDATE dishes SET image = 'assets/exec_peixe.png' WHERE id = 'salada_fresca';
UPDATE dishes SET image = 'assets/executivo_camarao.png' WHERE id = 'salada_camarao';

-- 8. PETISCOS
UPDATE dishes SET image = 'assets/macaxeira_frita.png' WHERE id = 'macaxeira_frita';
UPDATE dishes SET image = 'assets/macaxeira_frita.png' WHERE id = 'bolinho_bacalhau';
UPDATE dishes SET image = 'assets/moqueca_peixe.png' WHERE id = 'caldo_sururu';
UPDATE dishes SET image = 'assets/macaxeira_frita.png' WHERE id = 'pasteis_queijo_carne';
UPDATE dishes SET image = 'assets/macaxeira_frita.png' WHERE id = 'tapioca_recheada';
UPDATE dishes SET image = 'assets/bife_acebolado.png' WHERE id = 'calabresa_acebolada';

-- 9. PRATOS PRINCIPAIS
UPDATE dishes SET image = 'assets/bode_guisado.png' WHERE id = 'buchada_guisada';
UPDATE dishes SET image = 'assets/costela_bafo.png' WHERE id = 'rabada';
UPDATE dishes SET image = 'assets/bode_guisado.png' WHERE id = 'sarapatel';
UPDATE dishes SET image = 'assets/costela_bafo.png' WHERE id = 'chambaril';

-- 10. BEBIDAS
UPDATE dishes SET image = 'assets/agua_coco.png' WHERE id = 'suco_caju';
UPDATE dishes SET image = 'assets/agua_coco.png' WHERE id = 'suco_graviola';
UPDATE dishes SET image = 'assets/caipirinha.png' WHERE id = 'cerveja_artesanal';
UPDATE dishes SET image = 'assets/agua_coco.png' WHERE id = 'suco_mangaba';
UPDATE dishes SET image = 'assets/caipirinha.png' WHERE id = 'suco_acerola';
UPDATE dishes SET image = 'assets/caipirinha.png' WHERE id = 'suco_maracuja';
UPDATE dishes SET image = 'assets/agua_coco.png' WHERE id = 'agua_coco';
UPDATE dishes SET image = 'assets/caipirinha.png' WHERE id = 'caipirinha';
UPDATE dishes SET image = 'assets/caipirinha.png' WHERE id = 'refrigerante';

-- 11. SOBREMESAS
UPDATE dishes SET image = 'assets/cartola.png' WHERE id = 'cartola';
UPDATE dishes SET image = 'assets/cartola.png' WHERE id = 'pudim';
UPDATE dishes SET image = 'assets/cartola.png' WHERE id = 'bolo_rolo';
UPDATE dishes SET image = 'assets/cartola.png' WHERE id = 'cocada';
UPDATE dishes SET image = 'assets/cartola.png' WHERE id = 'bolo_macaxeira';
UPDATE dishes SET image = 'assets/cartola.png' WHERE id = 'sorvete_tapioca';

-- 12. PROMOÇÕES
UPDATE dishes SET image = 'assets/carne_sol_macaxeira.png' WHERE id = 'promo_casal';
UPDATE dishes SET image = 'assets/caipirinha.png' WHERE id = 'promo_happy_hour';
UPDATE dishes SET image = 'assets/galeto_completo.png' WHERE id = 'promo_familia';

-- ====================================================================
-- OPERAÇÃO CONCLUÍDA COM SUCESSO!
-- ====================================================================
