# UI/UX Dark-Fantasy — Reino Escarlate

Este guia define a direção visual e os estados de interface para o jogo. Ele funciona como referência de implementação para preservar legibilidade, feedback de combate, responsividade e acessibilidade.

## Princípios

1. Legibilidade antes de ornamento: a atmosfera deve enquadrar a informação, não competir com ela.
2. Decisão antes de decoração: vida, recurso de turno, intenção inimiga e ações disponíveis têm prioridade máxima.
3. Cor é semântica: não use cor como único indicador; combine texto, ícone, borda e forma.
4. Feedback imediato: cada interação deve responder visualmente.
5. Estado previsível: a mesma ação deve ter o mesmo vocabulário visual em todas as telas.

## Hierarquia do HUD

| Prioridade | Conteúdo | Tratamento |
| --- | --- | --- |
| Crítica | Vida do jogador, intenção inimiga, ameaça e ação principal | Maior contraste, números legíveis e posição estável |
| Decisória | Energia, custo, habilidades, bloqueio, cooldowns, buffs e debuffs | Agrupamento por função e leitura rápida |
| Contextual | Andar, sala, objetivo, ouro e experiência | Barra superior discreta |
| Histórico | Registro de combate e notificações | Painel compacto com última mensagem destacada |
| Opcional | Lore, estatísticas e configurações | Menu, abas ou modal |

## Grade sugerida

```text
┌──────────────────────────────────────────────────────────────────────┐
│ REINO ESCARLATE        Andar 04 · Câmara Rubra       Ouro 128        │
├───────────────────┬───────────────────────────────┬──────────────────┤
│ HERÓI             │       CENA / COMBATE          │ INIMIGO          │
│ Vida 72 / 100     │ personagem, inimigos e efeitos │ Vida 44 / 80     │
│ Vigor 3 / 3       │                               │ Intenção: 18 dano│
│ Defesa 12         │                               │ efeitos ativos   │
├───────────────────┴───────────────────────────────┴──────────────────┤
│ [1] Golpe   [2] Guarda   [3] Ruptura   [E] Encerrar turno            │
├──────────────────────────────────────────────────────────────────────┤
│ Registro: Guardião prepara Investida · Sangramento aplicado (2)      │
└──────────────────────────────────────────────────────────────────────┘
```

## Tokens de tema

```css
:root {
  --void: #09070a;
  --ash: #130f15;
  --panel: #1b141c;
  --panel-raised: #271a25;
  --line-muted: rgb(255 235 225 / 12%);
  --line-strong: rgb(255 229 210 / 24%);
  --blood: #d84456;
  --gold: #e8b963;
  --arcane: #9b8cff;
  --verdant: #62ce91;
  --warning: #ffad58;
  --text: #f7efe6;
  --text-muted: #b7a8ab;
  --text-dim: #817276;
}
```

Distribuição recomendada: 70% tons escuros e neutros, 20% superfícies e bordas, 10% cores semânticas. O escarlate deve representar dano, ameaça e ações irreversíveis; dourado representa recompensa, foco e seleção; violeta representa magia; verde representa cura ou confirmação.

## Tipografia

- Use uma fonte de exibição, como Cinzel, somente para título do jogo, chefes, raridades e cabeçalhos.
- Use uma sans-serif legível para números, atributos, descrições, botões, tooltips e registro de combate.
- Nunca use fonte decorativa como fonte principal de leitura.
- Garanta fundo sólido ou sombra atrás de texto mostrado sobre arte dinâmica.

## Estados de componentes

| Estado | Sinal obrigatório |
| --- | --- |
| Normal | Fundo escuro, borda sutil e texto legível |
| Hover | Elevação discreta, borda mais clara e brilho limitado |
| Foco por teclado | Outline forte com offset externo; nunca remover `:focus-visible` |
| Selecionado | Borda destacada, rótulo ou ícone de seleção e fundo diferenciado |
| Pressionado | Redução de escala leve e sombra reduzida |
| Indisponível | Opacidade e dessaturação parciais, mais motivo escrito |
| Cooldown | Indicador de progresso e contador de turnos restante |
| Perigo | Escarlate, alerta textual e ícone; não usar apenas cor |
| Sucesso | Dourado ou verde, confirmação curta e ícone |
| Erro | Mensagem direta com a ação necessária para corrigir |
| Carregando | Skeleton ou brilho lento, sem congelar controles sem explicação |

Exemplo: uma habilidade bloqueada deve dizer `Requer 2 de vigor` em vez de apenas aparecer acinzentada.

## Combate

### Jogador

- Sempre exibir vida em texto, por exemplo `72 / 100`.
- Em vida baixa, acrescentar `CRÍTICO`, ícone e contorno suave; evitar flash agressivo.
- Mostrar energia ou vigor com unidades e custo da ação.
- Exibir bloqueio e efeitos com ícone, pilhas, duração e tooltip.

### Inimigo

- Espelhar vida, defesa e efeitos com o vocabulário visual do jogador.
- Mostrar intenção com ícone, verbo e valor: `Investida · 18 dano`.
- Sinalizar ação especial com rótulo: `RITUAL — ganha 12 de escudo`.
- Em mudança de fase, usar moldura/aviso temporário e registrar o evento no log.

## Acessibilidade

- Não comunique estados somente por cor.
- Mantenha foco de teclado visível e ordem de tabulação coerente com a tela.
- Exiba atalhos nas ações, por exemplo `[1]`, `[2]`, `[3]` e `[E]`.
- Respeite `prefers-reduced-motion`.
- Ofereça escalas de HUD de 80%, 100%, 120% e 140% quando a configuração existir.
- Mantenha texto comum com contraste próximo ou superior a 4.5:1.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
  }
}
```

## Referências e ferramentas

- Referências de telas: Game UI Database e Interface In Game.
- Componentes e inspiração de dark-fantasy: Figma Community, Behance e Dribbble.
- Assets permissivos para prototipagem: Kenney UI Pack e RPG Extension, CC0.
- Se o projeto migrar para React, considerar Radix UI para diálogos, tooltips e navegação acessível, com Shadcn/UI como referência de composição.

## Checklist de revisão

- [ ] A informação crítica vence a arte decorativa?
- [ ] Vida, recurso e intenção inimiga são legíveis sem hover?
- [ ] Toda ação tem normal, hover, foco, selecionado, pressionado e indisponível?
- [ ] Estados críticos têm texto ou ícone além da cor?
- [ ] A navegação funciona por teclado?
- [ ] A redução de movimento é respeitada?
- [ ] O layout continua legível em telas estreitas?
