# Direção de Arte

## Ideia visual
Conto de fadas em decomposição: sombras pesadas, vermelho usado com intenção e leitura clara em combate. A arte do MVP é criada inteiramente com Canvas 2D, polígonos, círculos, retângulos e partículas.

## Paleta
| Papel | Cor | Uso |
|---|---|---|
| Noite | #10121B | Fundo e áreas vazias |
| Cinza de osso | #D8D2C5 | Texto e detalhes neutros |
| Cinza de cinza | #6D6875 | Obstáculos e elementos secundários |
| Escarlate | #D7263D | Perigo, vida e dano crítico |
| Vinho | #6B1E2F | Inimigos e sangue estilizado |
| Violeta | #8C6CCF | Ímpeto, magia e elites |
| Ouro velho | #D9A441 | Caixa dos Ecos, inimigos capturáveis e recompensas |

## Personagens
- Pandora: capa triangular, máscara clara, uma caixa dourada escura presa ao peito e lâmina curta.
- Caixa dos Ecos: cubo/caixa flutuante com fechaduras e linhas douradas; abre apenas durante a captura.
- Inimigos: silhueta reconhecível primeiro; um Eco em estado de Ruptura ganha contorno dourado.
- Chefes: pelo menos três vezes maiores que Pandora, com ataques marcados por telegráfos no piso.

## Feedback de captura
- Inimigo em Ruptura: pulso dourado e símbolo de fechadura quebrada.
- Captura iniciada: fios dourados conectam Pandora, Caixa e alvo.
- Captura concluída: Eco entra na Caixa como faísca colorida, com breve desaceleração de 60 a 90 ms.
- Captura interrompida: a Caixa se fecha de forma brusca e a Carga aumenta levemente.

## Interface
- HUD discreto nos cantos.
- Vida em barra horizontal escarlate; Ímpeto em barra violeta.
- Medidor da Caixa em ouro velho; marcas visíveis mostram risco de Ruptura.
- Até três ícones de Ecos equipados.
- Texto com tipografia serifada para títulos e sans-serif clara no HUD.

## Resolução e escala
- Área lógica inicial: 960 x 540.
- Canvas ocupa a viewport mantendo proporção.
- Sprites/elementos renderizados com bordas nítidas; pixelização opcional no futuro.
