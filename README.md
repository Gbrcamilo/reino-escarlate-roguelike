# Reino Escarlate

Roguelite de ação 2D original, feito com TypeScript e Canvas 2D. **Pandora** explora um conto de fadas corrompido carregando a **Caixa dos Ecos**, um artefato que sela fragmentos de monstros enfraquecidos e os converte em poder.

## Estado atual

O vertical slice jogável inclui:

- Movimento em oito direções
- Ataque corpo a corpo
- Esquiva com invencibilidade breve e gasto de Ímpeto
- Inimigo perseguidor com vida e ataque
- Estado de Ruptura abaixo de 25% de vida
- Captura de Eco com `F` perto de inimigos em Ruptura
- Essência, Carga da Caixa e contador de Ecos selados
- Caixa flutuante, partículas douradas, feedback visual e tela de derrota

## Executar localmente

```bash
npm install
npm run dev
```

Para gerar a versão de produção:

```bash
npm run build
```

## Controles atuais

| Tecla | Ação |
|---|---|
| WASD | Mover Pandora |
| J | Atacar |
| Espaço | Esquivar; consome Ímpeto |
| F | Selar Eco de inimigo em Ruptura |
| R | Reiniciar a arena |

## Fluxo de captura

1. Ataque o Vulto até a barra chegar a 25%.
2. Ele ganhará um contorno dourado: está em Ruptura.
3. Aproxime-se e pressione `F`.
4. Pandora recebe Essência e a Caixa acumula Carga.

## Documentação

- [GDD](docs/GDD.md)
- [Sistema de Pandora](docs/PANDORA_SYSTEM.md)
- [Arquitetura técnica](docs/TECHNICAL_DESIGN.md)
- [Direção de arte](docs/ART_DIRECTION.md)
- [Roadmap](docs/ROADMAP.md)

## Licença

Projeto em desenvolvimento. Direitos reservados.
