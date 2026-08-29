# Reino Escarlate

Roguelite de ação 2D original, feito com TypeScript e Canvas 2D. **Pandora** explora um conto de fadas corrompido carregando a **Caixa dos Ecos**, um artefato que sela fragmentos de monstros enfraquecidos e os converte em poder.

## Estado atual

O projeto inclui um vertical slice leve e jogável:

- Movimento em oito direções
- Ataque corpo a corpo
- Esquiva com invencibilidade breve
- Inimigo perseguidor com vida e ataque
- Base visual para o futuro sistema de captura pela Caixa dos Ecos
- HUD de Vida e recurso de combate
- Partículas, feedback de dano e tela de derrota

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
| Espaço | Esquivar |
| F | Reservado para selar Ecos pela Caixa |
| R | Reiniciar a arena |

## Documentação

- [GDD](docs/GDD.md)
- [Sistema de Pandora](docs/PANDORA_SYSTEM.md)
- [Arquitetura técnica](docs/TECHNICAL_DESIGN.md)
- [Direção de arte](docs/ART_DIRECTION.md)
- [Roadmap](docs/ROADMAP.md)

## Licença

Projeto em desenvolvimento. Direitos reservados.
