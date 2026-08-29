# Sistema de Sala Roguelite

## Objetivo
Uma sala é uma unidade curta de desafio: Pandora entra, enfrenta ondas de Vultos, decide entre destruir ou selar Ecos e recebe uma relíquia antes de avançar.

## Estrutura do protótipo
- Três ondas por sala.
- Portas bloqueadas enquanto houver inimigos vivos.
- Três obstáculos estáticos funcionam como cobertura contra a Arqueira de Vidro e restringem deslocamento.
- Ao eliminar ou selar todos os inimigos, a simulação pausa para uma escolha de relíquia.
- Após a terceira escolha, a sala termina em vitória.

## Ondas atuais
| Onda | Composição | Função |
|---|---|---|
| 1 | 2 Rastejantes + 1 Arqueira | Ensina aproximação e cobertura |
| 2 | 1 Rastejante + 2 Arqueiras + 1 Costurado | Mistura pressão à distância e investida |
| 3 | 2 Costurados + 1 Arqueira + 2 Rastejantes | Teste de controle de espaço e captura |

## Inimigos
| Inimigo | Comportamento | Eco | Contrajogo |
|---|---|---|---|
| Vulto Rastejante | Persegue a curta distância | Fome | Esquiva lateral e captura em Ruptura |
| Arqueira de Vidro | Mantém distância e dispara projéteis | Vidro | Usar os blocos como cobertura e aproximar durante a recarga |
| Espantalho Costurado | Avança e executa investidas | Fúria | Manter distância, punir após a investida |

## Captura
- Todo inimigo entra em Ruptura a 25% de vida.
- O contorno dourado indica que `F` pode selar o Eco.
- Captura concede 1 Essência, recupera Ímpeto e eleva a Carga da Caixa.
- Matar o inimigo elimina o Eco e evita o ganho de Essência.

## Relíquias atuais
| Relíquia | Efeito |
|---|---|
| Espinho de Rosa Morta | Ataques aplicam sangramento |
| Fio da Tecelã | Capturas danificam inimigos próximos |
| Botas da Cinderela Quebrada | Captura mais rápida |
| Lanterna da Avó | Vida máxima e cura imediata |
| Chave de Marfim | Essência extra e redução de Carga |

## Próxima evolução
- Gerar a sequência de salas com seed.
- Adicionar salas de cura, Câmara da Caixa, mercador e elite.
- Evoluir relíquias para combinações de Ecos específicos.
