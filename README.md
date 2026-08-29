# Reino Escarlate

Roguelite de ação 2D original feito com TypeScript e Canvas 2D. **Pandora** explora um conto de fadas corrompido carregando a **Caixa dos Ecos**, um artefato que sela fragmentos de monstros enfraquecidos e os converte em poder.

## Estado atual

O protótipo contém uma expedição curta com transição fluida entre salas:

- Clareira dos Sussurros: combate em três ondas e escolhas de relíquias
- Refúgio de Cinzas: recuperação de Vida, Ímpeto e Carga da Caixa
- Jardim dos Espinhos Mortos: segunda arena de combate com layout diferente
- Porta dourada de saída, fade entre arenas e introdução de sala
- Persistência de Vida, Essência, Carga e relíquias durante a expedição
- Vulto Rastejante, Arqueira de Vidro, Espantalho Costurado, projéteis e investidas
- Captura de Ecos com `F` em inimigos em Ruptura

## Executar localmente

```bash
npm install
npm run dev
```

## Controles

| Tecla | Ação |
|---|---|
| WASD | Mover Pandora |
| J | Atacar |
| Espaço | Esquivar; consome Ímpeto |
| F | Selar Eco em Ruptura; ativar altar no Refúgio de Cinzas |
| 1, 2, 3 | Escolher relíquia entre ondas |
| R | Reiniciar a expedição |

## Como avançar

1. Limpe todas as ondas de uma sala de combate.
2. Escolha uma relíquia usando `1`, `2` ou `3`.
3. Caminhe até a porta dourada no topo da arena.
4. No Refúgio de Cinzas, aproxime-se do altar central e pressione `F`; então use a porta dourada.
5. Vida, Essência, Carga e relíquias permanecem entre salas.

## Documentação

- [GDD](docs/GDD.md)
- [Sistema de Pandora](docs/PANDORA_SYSTEM.md)
- [Sistema de sala](docs/ROOM_SYSTEM.md)
- [Transição entre salas](docs/ROOM_TRANSITIONS.md)
- [Arquitetura técnica](docs/TECHNICAL_DESIGN.md)
- [Direção de arte](docs/ART_DIRECTION.md)
- [Roadmap](docs/ROADMAP.md)

## Licença

Projeto em desenvolvimento. Direitos reservados.
