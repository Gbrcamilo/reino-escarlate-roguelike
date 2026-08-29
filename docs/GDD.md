# Reino Escarlate — Game Design Document

## Premissa
Reino Escarlate é um roguelite de ação 2D original, ambientado em um conto de fadas sombrio. A protagonista Liora explora uma terra onde histórias foram corrompidas pela Tecelã Pálida. Cada expedição muda a sequência de salas, inimigos, recompensas e combinações de relíquias.

## Princípios de design
- Combate legível, rápido e com feedback forte.
- Runs curtas: 15 a 25 minutos no MVP.
- Repetição com descoberta: cada morte deve ensinar um padrão ou liberar uma possibilidade.
- Arte minimalista: silhuetas, formas geométricas e paleta limitada.
- Originalidade: referências servem ao gênero e ao ritmo, nunca a personagens, arte, narrativa, nomes ou conteúdo de títulos existentes.

## Loop principal
1. Partir do Santuário da Cinza.
2. Entrar em uma sequência procedural de 8 a 12 salas.
3. Lutar, escolher recompensas e adaptar a build.
4. Enfrentar o Guardião do bioma.
5. Voltar ao santuário após vitória ou morte.
6. Gastar Fragmentos de Cinza em desbloqueios permanentes leves.

## A protagonista
### Liora
- Movimento em oito direções.
- Ataque básico com lâmina curta.
- Esquiva curta com janela de invencibilidade.
- Visão da Fissura: revela o nó de fábula, ponto vulnerável de inimigos.

## Sistema: Visão da Fissura
- Ativação: manter botão dedicado.
- Efeito: cenário dessaturado, nós vulneráveis são destacados.
- Recurso: consome Fôlego Carmesim.
- Recuperação: ataques normais, eliminações e esquivas perfeitas.
- Acerto no nó: dano crítico, quebra de defesa ou interrupção de golpe perigoso.
- Chefes usam nós móveis, iscas e mudanças de fase.

## Recursos do jogador
| Recurso | Função |
|---|---|
| Vida | Zerada ao morrer; recuperável por fontes de cura e recompensas |
| Fôlego Carmesim | Alimenta a Visão da Fissura |
| Fragmentos de Cinza | Moeda meta obtida no fim de uma run |
| Ouro de Expedição | Moeda temporária para lojas dentro da run |

## Salas do MVP
| Tipo | Papel |
|---|---|
| Combate | Ondas de inimigos; libera porta após limpar a sala |
| Recompensa | Escolha uma entre três relíquias |
| Cura | Recuperação parcial, com limite de uso |
| Evento | Decisão com risco e benefício |
| Mercador | Compra de cura, relíquia ou melhoria temporária |
| Elite | Inimigo reforçado e recompensa superior |
| Guardião | Chefe do bioma e encerramento do ato |

## Inimigos iniciais
| Nome | Comportamento | Contrajogo |
|---|---|---|
| Rastejante de Lã | Persegue em linha curta | Esquivar lateralmente; nó nas costas |
| Espantalho Costurado | Avanço lento e golpe amplo | Punir após o golpe; nó no peito |
| Corvo de Osso | Voa e dispara penas | Quebrar postura ao revelar o nó |
| Arqueira de Vidro | Mantém distância e atira em rajadas | Usar obstáculos; nó aparece ao recarregar |
| Guarda Carmesim | Protege com escudo frontal | Ler nó atrás do escudo para atordoar |

## Primeiro chefe
### O Lenhador Sem Rosto
- Fase 1: golpes horizontais e investida.
- Fase 2: derruba troncos que bloqueiam a arena.
- Fase 3: mistura investidas, golpes e falsos nós.
- Janela de vulnerabilidade: após machado cravado no chão.

## Relíquias iniciais
| Relíquia | Efeito |
|---|---|
| Lanterna da Avó | A Visão da Fissura dura 20% mais |
| Espinho de Rosa Morta | Críticos causam sangramento |
| Selo do Corvo | Eliminações recuperam Fôlego Carmesim |
| Botas da Cinderela Quebrada | Esquiva perfeita reduz o tempo de recarga do ataque |
| Fio da Tecelã | Ataques no nó encadeiam dano em inimigos próximos |
| Chave de Marfim | A primeira porta de recompensa da run oferece uma opção extra |

## Biomas planejados
1. Bosque das Fábulas Queimadas — MVP.
2. Vila de Vidro Partido.
3. Catedral das Marionetes.
4. Torre da Tecelã Pálida.

## Critérios do MVP
- Uma run completa jogável do início ao Lenhador Sem Rosto.
- Cinco inimigos, seis relíquias e ao menos seis modelos de sala.
- Combate, colisão, pausa, derrota e reinício funcionais.
- Sem dependência de arte externa para a primeira versão.
