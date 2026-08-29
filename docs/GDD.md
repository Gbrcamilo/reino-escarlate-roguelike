# Reino Escarlate — Game Design Document

## Premissa
Reino Escarlate é um roguelite de ação 2D original, ambientado em um conto de fadas sombrio. **Pandora** explora uma terra onde histórias foram corrompidas pela Tecelã Pálida. Ela carrega a Caixa dos Ecos, um artefato capaz de selar fragmentos de monstros enfraquecidos e converter seus medos em poder. Cada expedição muda a sequência de salas, inimigos, recompensas e combinações de Ecos.

## Princípios de design
- Combate legível, rápido e com feedback forte.
- Runs curtas: 15 a 25 minutos no MVP.
- Risco contra recompensa: derrotar é seguro; selar Ecos é mais poderoso, mas expõe Pandora.
- Arte minimalista: silhuetas, formas geométricas e paleta limitada.
- Originalidade: referências servem ao gênero e ao ritmo, nunca a personagens, arte, narrativa, nomes ou conteúdo de títulos existentes.

## Loop principal
1. Partir do Santuário da Cinza.
2. Entrar em uma sequência procedural de 8 a 12 salas.
3. Enfraquecer inimigos, derrotá-los ou selar seus Ecos na Caixa.
4. Converter Essência em melhorias e adaptar a build.
5. Enfrentar o Guardião do bioma.
6. Voltar ao santuário após vitória ou morte.
7. Gastar Fendas em desbloqueios permanentes leves.

## A protagonista: Pandora
- Movimento em oito direções.
- Ataque básico com lâmina curta.
- Esquiva curta com janela de invencibilidade.
- Caixa dos Ecos: aprisiona o Eco de monstros enfraquecidos.
- Carga da Caixa: quanto mais Pandora captura, mais combinações e riscos ela libera.

## Sistema: Caixa dos Ecos
- Inimigos entram em Ruptura abaixo de 25% de vida.
- Pandora pode finalizar normalmente ou pressionar F perto do alvo para selar o Eco.
- A captura exige uma janela curta e pode ser interrompida por dano.
- Cada Eco concede Essência e pode alimentar relíquias/combinações da run.
- Capturas de elite elevam a Carga da Caixa e geram Fendas para progresso meta.
- Ver `docs/PANDORA_SYSTEM.md` para especificação detalhada.

## Recursos do jogador
| Recurso | Função |
|---|---|
| Vida | Zerada ao morrer; recuperável por fontes de cura e Ecos de Fome |
| Ímpeto | Alimenta esquiva e técnicas de mobilidade |
| Essência | Obtida ao selar Ecos; usada em melhorias temporárias |
| Fendas | Moeda meta de elites, chefes e Ecos corrompidos |
| Carga da Caixa | Amplifica poder e risco durante a run |

## Salas do MVP
| Tipo | Papel |
|---|---|
| Combate | Ondas de inimigos; libera porta após limpar a sala |
| Câmara da Caixa | Converter Essência, equipar Eco ou aliviar Carga |
| Recompensa | Escolha uma entre três relíquias |
| Cura | Recuperação parcial, com limite de uso |
| Evento | Decisão com risco e benefício |
| Mercador | Compra de cura, relíquia ou melhoria temporária |
| Elite | Inimigo reforçado, Eco raro e recompensa superior |
| Guardião | Chefe do bioma e encerramento do ato |

## Inimigos iniciais
| Nome | Comportamento | Eco | Contrajogo |
|---|---|---|---|
| Rastejante de Lã | Persegue em linha curta | Fome | Esquivar lateralmente e capturar em Ruptura |
| Espantalho Costurado | Avanço lento e golpe amplo | Fúria | Punir após o golpe |
| Corvo de Osso | Voa e dispara penas | Pavor | Aproximar após a rajada |
| Arqueira de Vidro | Mantém distância e atira em rajadas | Vidro | Usar obstáculos e interromper recarga |
| Guarda Carmesim | Protege com escudo frontal | Cinza | Contornar a defesa antes de selar |

## Primeiro chefe
### O Lenhador Sem Rosto
- Fase 1: golpes horizontais e investida.
- Fase 2: derruba troncos que bloqueiam a arena.
- Fase 3: mistura investidas e ecos falsos para atrair Pandora.
- Recompensa: Eco de Cinza Ancestral, que abre uma nova melhoria permanente.

## Relíquias iniciais
| Relíquia | Efeito |
|---|---|
| Lanterna da Avó | Aumenta a janela para selar um Eco |
| Espinho de Rosa Morta | Ecos de Fúria tornam críticos sangramentos |
| Selo do Corvo | Selar Eco de Pavor deixa um espectro protetor |
| Botas da Cinderela Quebrada | Esquiva perfeita acelera a captura em andamento |
| Fio da Tecelã | Ecos de Vidro se encadeiam a inimigos próximos |
| Chave de Marfim | A primeira Câmara da Caixa oferece uma escolha extra |

## Biomas planejados
1. Bosque das Fábulas Queimadas — MVP.
2. Vila de Vidro Partido.
3. Catedral das Marionetes.
4. Torre da Tecelã Pálida.

## Critérios do MVP
- Uma run completa jogável do início ao Lenhador Sem Rosto.
- Cinco inimigos, cinco Ecos, seis relíquias e ao menos seis modelos de sala.
- Combate, captura, colisão, pausa, derrota e reinício funcionais.
- Sem dependência de arte externa para a primeira versão.
