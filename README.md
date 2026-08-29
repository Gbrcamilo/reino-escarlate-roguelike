# Reino Escarlate

Roguelite de ação 2D original feito com TypeScript e Canvas 2D. **Pandora** explora um conto de fadas corrompido carregando a **Caixa dos Ecos**, um artefato que sela monstros enfraquecidos e transforma suas Aflições em poder.

## Estado atual

- Expedição curta: Clareira dos Sussurros → Refúgio de Cinzas → Jardim dos Espinhos Mortos
- Transição fluida por porta dourada e preservação da build
- Três tipos de inimigo: Rastejante, Arqueira e Espantalho
- Captura de Ecos em Ruptura com `F`
- Arquétipos iniciais: **Gula** e **Ira**, cada um com três níveis
- Aflições: fome exige agressividade; dano recebido alimenta a Ira
- Ressonância **Banquete Carmesim** quando Gula e Ira coexistem
- Poder ativo `Q`: Mandíbula do Vazio ou Martelo da Ira
- Relíquias, Essência, Ímpeto e Carga da Caixa

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
| F | Selar Eco em Ruptura; ativar altar do Refúgio |
| Q | Usar poder do Lacre dominante |
| 1, 2, 3 | Escolher relíquia entre ondas |
| R | Reiniciar a expedição |

## Testar os Lacres

1. Capture Rastejantes para aumentar **Gula**.
2. Capture Espantalhos para aumentar **Ira**.
3. Use `Q`: Gula dominante ativa Mandíbula do Vazio; Ira dominante ativa Martelo da Ira.
4. Com os dois Lacres ativos, capture um alvo sangrando para testar Banquete Carmesim.
5. Observe a Carga e as Aflições na HUD.

## Documentação

- [GDD](docs/GDD.md)
- [Arquétipos](docs/ARCHETYPES.md)
- [Sistema de Pandora](docs/PANDORA_SYSTEM.md)
- [Sistema de sala](docs/ROOM_SYSTEM.md)
- [Transição entre salas](docs/ROOM_TRANSITIONS.md)
- [Roadmap](docs/ROADMAP.md)

## Licença

Projeto em desenvolvimento. Direitos reservados.
