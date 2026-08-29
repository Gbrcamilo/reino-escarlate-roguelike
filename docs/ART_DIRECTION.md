# Direção de Arte

## Ideia visual
Conto de fadas em decomposição: sombras pesadas, vermelho usado com intenção e leitura clara em combate. A arte do MVP é criada inteiramente com Canvas 2D, polígonos, círculos, retângulos e partículas.

## Paleta
| Papel | Cor | Uso |
|---|---|---|
| Noite | #10121B | Fundo e áreas vazias |
| Cinza de osso | #D8D2C5 | Texto e detalhes neutros |
| Cinza de cinza | #6D6875 | Obstáculos e elementos secundários |
| Escarlate | #D7263D | Perigo, vida, nós vulneráveis e críticos |
| Vinho | #6B1E2F | Inimigos e sangue estilizado |
| Violeta | #8C6CCF | Magia, elite e chefes |
| Ouro velho | #D9A441 | Recompensas e interações |

## Personagens
- Liora: capa triangular, máscara clara, núcleo escarlate no peito e lâmina curta.
- Inimigos: silhueta reconhecível primeiro; detalhes são opcionais.
- Chefes: pelo menos três vezes maiores que Liora, com ataques marcados por telegráfos no piso.

## Feedback de combate
- Ataque conectado: flash curto, partículas, recuo e som seco.
- Crítico no nó: moldura branca breve, partículas escarlates e desaceleração de 60 a 90 ms.
- Dano recebido: vinheta escura e tremor opcional, nunca piscada que atrapalhe acessibilidade.
- Ataque inimigo: indicador no chão antes do dano e contraste com o fundo.

## Interface
- HUD discreto nos cantos.
- Vida em barra horizontal escarlate; Fôlego em barra violeta/rosa.
- Texto com tipografia serifada para títulos e sans-serif clara no HUD.
- Alto contraste e ícones acompanhados de texto quando a informação for crítica.

## Resolução e escala
- Área lógica inicial: 960 x 540.
- Canvas ocupa a viewport mantendo proporção.
- Sprites/elementos renderizados com bordas nítidas; pixelização opcional no futuro.
