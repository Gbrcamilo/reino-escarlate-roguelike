# Arquitetura Técnica

## Stack
- Vite + TypeScript + HTML5 Canvas 2D.
- Sem engine na primeira versão para manter o protótipo pequeno e transparente.
- Publicação estática no GitHub Pages via GitHub Actions.

## Motivos
Vite fornece um template vanilla TypeScript oficial e uma configuração simples para desenvolvimento e build. O loop do jogo usará requestAnimationFrame, API do navegador que agenda o callback antes da próxima repintura, adequada para atualização e renderização contínuas no Canvas.

## Estrutura proposta
```text
src/
  core/       Game, Input, Random, Audio, StateMachine
  entities/   Player, Enemy, Boss, Projectile, Pickup
  systems/    Combat, Collision, WeakPoint, Room, Reward
  content/    enemies, relics, rooms, bosses
  render/     Renderer, Camera, Effects, Palette
  ui/         Hud, Menu, RewardOverlay, PauseOverlay
  main.ts
```

## Estados da aplicação
- BOOT: carrega configurações e cria canvas.
- TITLE: tela inicial e instruções.
- PLAYING: simulação ativa.
- REWARD: jogo pausado para escolha de relíquia.
- PAUSED: pausa manual.
- DEFEAT: resumo de expedição e reinício.
- VICTORY: fim do ato/chefe.

## Loop
```ts
function frame(time: number) {
  const delta = Math.min((time - lastTime) / 1000, 0.033);
  update(delta);
  render();
  lastTime = time;
  requestAnimationFrame(frame);
}
```
Limitar delta evita grandes saltos após uma aba ficar inativa.

## Regras de implementação
- Separar atualização da simulação e renderização.
- Usar unidades em pixels lógicos; canvas escalado por devicePixelRatio.
- Usar seed para a sequência de salas, permitindo reproduzir uma run durante testes.
- Colisão inicial: círculos e retângulos alinhados; migrar somente se necessário.
- Não usar localStorage no protótipo sandboxado; no deploy normal, persistência será encapsulada em um adaptador opcional.

## Qualidade
- TypeScript strict.
- Sem dependência de framework visual.
- Funções pequenas e conteúdo de inimigos/recompensas definido por dados.
- Testes de regras puras para sorteio de salas e escolhas de relíquias quando a base estiver pronta.
