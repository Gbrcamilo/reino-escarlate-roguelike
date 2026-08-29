# Transição entre Salas

## Objetivo
A transição preserva a build de Pandora e dá consequência visual à conclusão de uma sala. A personagem só pode avançar ao limpar o encontro e atravessar a porta dourada do norte.

## Estados
| Estado | Papel |
|---|---|
| `play` | Combate, captura e movimentação ativos |
| `relic` | Jogo congelado para escolha de uma relíquia |
| `room-cleared` | Porta dourada aberta; Pandora pode caminhar até a saída |
| `transition-out` | Cortina escura cobre a arena em 0,5 s |
| `transition-in` | Próxima arena é carregada e a cortina recua em 0,5 s |
| `room-intro` | Nome e subtítulo da sala são exibidos por 1,5 s |
| `victory` / `defeat` | Encerramento da expedição |

## Persistência
Entre salas, Pandora mantém Vida, Vida máxima, Ímpeto, Essência, Carga da Caixa, relíquias e contadores de Ecos/Vultos. Apenas inimigos, projéteis, partículas, ondas e objetos temporários são limpos.

## Sequência atual
1. Clareira dos Sussurros — três ondas de combate.
2. Refúgio de Cinzas — usar `F` no altar para recuperar 32 de Vida, preencher Ímpeto e reduzir 35 de Carga.
3. Jardim dos Espinhos Mortos — três ondas com novo layout.

## Saída
Após limpar combate ou usar o altar, a porta superior torna-se dourada. Pandora deve alcançá-la para iniciar o fade e entrar na sala seguinte.

## Próxima evolução
- Mapa de escolha com duas ou três rotas por andar.
- Salas de Elite, Câmara da Caixa e Mercador.
- Gerador determinístico por seed.
- Guardião do Bosque após a rota inicial.
