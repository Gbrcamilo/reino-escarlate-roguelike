# Reino Escarlate

Roguelite de ação 2D original feito com TypeScript e Canvas 2D. **Pandora** explora um conto de fadas corrompido carregando a **Caixa dos Ecos**, um artefato que sela fragmentos de monstros enfraquecidos e os converte em poder.

## Estado atual

O protótipo agora contém uma sala roguelite jogável completa:

- Arena com obstáculos sólidos e portas seladas por combate
- Três ondas de inimigos por sala
- Vulto Rastejante, Arqueira de Vidro e Espantalho Costurado
- Ataque, esquiva com Ímpeto, projéteis e investidas
- Estado de Ruptura e captura de Ecos com `F`
- Essência, Carga da Caixa, partículas e feedback visual
- Escolha de uma entre três relíquias após cada onda
- Tela de vitória ao concluir a terceira onda e tela de derrota

## Executar localmente

```bash
npm install
npm run dev
```

Para gerar a versão de produção:

```bash
npm run build
```

## Controles

| Tecla | Ação |
|---|---|
| WASD | Mover Pandora |
| J | Atacar |
| Espaço | Esquivar; consome Ímpeto |
| F | Selar Eco de inimigo em Ruptura |
| 1, 2, 3 | Escolher relíquia entre ondas |
| R | Reiniciar a sala |

## Fluxo da sala

1. Derrote ou sele todos os inimigos de uma onda.
2. Escolha uma relíquia com `1`, `2` ou `3`.
3. Sobreviva às três ondas.
4. Use captura de Ecos para ganhar Essência e melhorar sua run.

## Documentação

- [GDD](docs/GDD.md)
- [Sistema de Pandora](docs/PANDORA_SYSTEM.md)
- [Sistema de sala](docs/ROOM_SYSTEM.md)
- [Arquitetura técnica](docs/TECHNICAL_DESIGN.md)
- [Direção de arte](docs/ART_DIRECTION.md)
- [Roadmap](docs/ROADMAP.md)

## Licença

Projeto em desenvolvimento. Direitos reservados.
