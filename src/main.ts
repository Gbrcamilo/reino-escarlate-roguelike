import './style.css';

type Vec = { x: number; y: number };
type EnemyKind = 'crawler' | 'archer' | 'stitcher';
type Relic = { id: string; name: string; description: string; apply: () => void };
type Particle = Vec & { vx: number; vy: number; life: number; maxLife: number; color: string; size: number };
type Projectile = Vec & { vx: number; vy: number; radius: number; life: number };
type Obstacle = { x: number; y: number; w: number; h: number };

const W = 960;
const H = 540;
const canvas = document.querySelector<HTMLCanvasElement>('#game');
if (!canvas) throw new Error('Canvas não encontrado.');
const ctx = canvas.getContext('2d');
if (!ctx) throw new Error('Canvas 2D indisponível.');

const keys = new Set<string>();
const pressed = new Set<string>();
window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (!keys.has(key)) pressed.add(key);
  keys.add(key);
  if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) event.preventDefault();
});
window.addEventListener('keyup', (event) => keys.delete(event.key.toLowerCase()));

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const length = (v: Vec) => Math.hypot(v.x, v.y);
const normalized = (v: Vec): Vec => { const l = length(v) || 1; return { x: v.x / l, y: v.y / l }; };
const distance = (a: Vec, b: Vec) => Math.hypot(a.x - b.x, a.y - b.y);
const pointInRect = (p: Vec, r: Obstacle, padding = 0) => p.x > r.x - padding && p.x < r.x + r.w + padding && p.y > r.y - padding && p.y < r.y + r.h + padding;

const obstacles: Obstacle[] = [
  { x: 308, y: 202, w: 72, h: 72 },
  { x: 580, y: 266, w: 72, h: 72 },
  { x: 430, y: 390, w: 96, h: 42 },
];

class Player {
  pos: Vec = { x: W / 2, y: H / 2 };
  facing: Vec = { x: 1, y: 0 };
  hp = 100;
  maxHp = 100;
  momentum = 100;
  maxMomentum = 100;
  essence = 0;
  boxCharge = 0;
  attackTimer = 0;
  dashTimer = 0;
  dashCooldown = 0;
  invulnerable = 0;
  attackHit = false;
  capturing = 0;
  bleedBonus = 0;
  chainCapture = false;
  fastSeal = false;
  relics: string[] = [];

  update(dt: number): void {
    const input = { x: (keys.has('d') ? 1 : 0) - (keys.has('a') ? 1 : 0), y: (keys.has('s') ? 1 : 0) - (keys.has('w') ? 1 : 0) };
    const moving = input.x !== 0 || input.y !== 0;
    if (moving) this.facing = normalized(input);
    if (pressed.has(' ') && this.dashCooldown <= 0 && moving && this.momentum >= 18 && gameState === 'play') {
      this.dashTimer = 0.16; this.dashCooldown = 0.55; this.invulnerable = 0.2; this.momentum -= 18;
    }
    const speed = this.dashTimer > 0 ? 880 : this.capturing > 0 ? 80 : 235;
    if (moving && gameState === 'play') {
      const direction = normalized(input);
      const old = { ...this.pos };
      this.pos.x += direction.x * speed * dt;
      this.pos.y += direction.y * speed * dt;
      this.pos.x = clamp(this.pos.x, 38, W - 38);
      this.pos.y = clamp(this.pos.y, 78, H - 38);
      if (obstacles.some((obstacle) => pointInRect(this.pos, obstacle, 15))) this.pos = old;
    }
    if (pressed.has('j') && this.attackTimer <= 0 && this.capturing <= 0 && gameState === 'play') { this.attackTimer = 0.23; this.attackHit = false; }
    this.attackTimer = Math.max(0, this.attackTimer - dt);
    this.dashTimer = Math.max(0, this.dashTimer - dt);
    this.dashCooldown = Math.max(0, this.dashCooldown - dt);
    this.invulnerable = Math.max(0, this.invulnerable - dt);
    this.capturing = Math.max(0, this.capturing - dt);
    this.momentum = clamp(this.momentum + 18 * dt, 0, this.maxMomentum);
    this.boxCharge = clamp(this.boxCharge - 2.4 * dt, 0, 100);
  }

  hurt(amount: number): void {
    if (this.invulnerable > 0) return;
    this.hp = Math.max(0, this.hp - amount);
    this.invulnerable = 0.5;
    this.capturing = 0;
  }
}

class Enemy {
  pos: Vec;
  readonly kind: EnemyKind;
  radius: number;
  hp: number;
  maxHp: number;
  speed: number;
  hitFlash = 0;
  attackTimer = 0;
  dashTimer = 0;
  shootTimer = 0.8;
  alive = true;
  bleed = 0;

  constructor(kind: EnemyKind, x: number, y: number) {
    this.kind = kind;
    this.pos = { x, y };
    this.radius = kind === 'stitcher' ? 28 : kind === 'archer' ? 18 : 21;
    this.maxHp = kind === 'stitcher' ? 110 : kind === 'archer' ? 55 : 80;
    this.hp = this.maxHp;
    this.speed = kind === 'stitcher' ? 75 : kind === 'archer' ? 68 : 105;
  }

  get ruptured(): boolean { return this.alive && this.hp <= this.maxHp * 0.25; }
  get ecoName(): string { return this.kind === 'archer' ? 'Vidro' : this.kind === 'stitcher' ? 'Fúria' : 'Fome'; }

  update(dt: number): void {
    if (!this.alive) return;
    const toPlayer = { x: player.pos.x - this.pos.x, y: player.pos.y - this.pos.y };
    const d = length(toPlayer);
    const n = normalized(toPlayer);
    if (this.kind === 'archer') {
      if (d < 190) { this.pos.x -= n.x * this.speed * dt; this.pos.y -= n.y * this.speed * dt; }
      if (d > 270) { this.pos.x += n.x * this.speed * dt; this.pos.y += n.y * this.speed * dt; }
      if (this.shootTimer <= 0 && d < 360) {
        projectiles.push({ x: this.pos.x, y: this.pos.y, vx: n.x * 270, vy: n.y * 270, radius: 6, life: 2.4 });
        this.shootTimer = 1.25;
      }
    } else if (this.kind === 'stitcher') {
      if (this.dashTimer > 0) { this.pos.x += n.x * 330 * dt; this.pos.y += n.y * 330 * dt; }
      else if (d > 80) { this.pos.x += n.x * this.speed * dt; this.pos.y += n.y * this.speed * dt; }
      if (d < 210 && this.attackTimer <= 0 && this.dashTimer <= 0) { this.dashTimer = 0.32; this.attackTimer = 1.2; }
    } else {
      if (d > 48) { this.pos.x += n.x * this.speed * dt; this.pos.y += n.y * this.speed * dt; }
    }
    if (d < this.radius + 25 && this.attackTimer <= 0 && this.kind !== 'archer') { player.hurt(this.kind === 'stitcher' ? 17 : 11); this.attackTimer = 0.75; }
    for (const obstacle of obstacles) if (pointInRect(this.pos, obstacle, this.radius)) { this.pos.x -= n.x * this.speed * dt * 2; this.pos.y -= n.y * this.speed * dt * 2; }
    this.attackTimer = Math.max(0, this.attackTimer - dt);
    this.dashTimer = Math.max(0, this.dashTimer - dt);
    this.shootTimer = Math.max(0, this.shootTimer - dt);
    this.hitFlash = Math.max(0, this.hitFlash - dt);
    this.bleed = Math.max(0, this.bleed - dt);
    if (this.bleed > 0) this.hp -= 4 * dt;
    if (this.hp <= 0) this.alive = false;
  }

  hurt(amount: number): boolean {
    this.hp -= amount;
    this.hitFlash = 0.12;
    if (player.bleedBonus > 0) this.bleed = 2.6;
    if (this.hp <= 0) { this.alive = false; return true; }
    return false;
  }
}

let player: Player;
let enemies: Enemy[] = [];
let particles: Particle[] = [];
let projectiles: Projectile[] = [];
let wave = 1;
let roomCleared = false;
let gameState: 'play' | 'relic' | 'victory' | 'defeat' = 'play';
let selectedRelics: Relic[] = [];
let elapsed = 0;
let messageText = '';
let messageTimer = 4.5;
let kills = 0;
let captures = 0;

function randomSpawn(): Vec {
  const points: Vec[] = [{ x: 110, y: 120 }, { x: 840, y: 130 }, { x: 110, y: 430 }, { x: 840, y: 420 }, { x: 470, y: 110 }, { x: 470, y: 470 }];
  return points[Math.floor(Math.random() * points.length)];
}

function spawnWave(nextWave: number): void {
  wave = nextWave;
  const layout: EnemyKind[][] = [
    ['crawler', 'crawler', 'archer'],
    ['crawler', 'archer', 'archer', 'stitcher'],
    ['stitcher', 'stitcher', 'archer', 'crawler', 'crawler'],
  ];
  enemies = layout[nextWave - 1].map((kind) => { const p = randomSpawn(); return new Enemy(kind, p.x, p.y); });
  projectiles = [];
  roomCleared = false;
  gameState = 'play';
  messageText = `Onda ${wave} de 3 — Portas seladas.`;
  messageTimer = 1.8;
}

function reset(): void {
  player = new Player();
  enemies = [];
  particles = [];
  projectiles = [];
  wave = 1;
  roomCleared = false;
  gameState = 'play';
  selectedRelics = [];
  elapsed = 0;
  kills = 0;
  captures = 0;
  messageText = 'Enfraqueça os Vultos, sele Ecos e sobreviva às três ondas.';
  messageTimer = 5;
  spawnWave(1);
}

function spawnParticles(pos: Vec, color: string, count: number): void {
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 45 + Math.random() * 135;
    particles.push({ x: pos.x, y: pos.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 0.32 + Math.random() * 0.38, maxLife: 0.7, color, size: 2 + Math.random() * 4 });
  }
}

function tryAttack(): void {
  if (player.attackTimer <= 0 || player.attackHit) return;
  const attackCenter = { x: player.pos.x + player.facing.x * 42, y: player.pos.y + player.facing.y * 42 };
  let hit = false;
  for (const enemy of enemies) {
    if (!enemy.alive || distance(attackCenter, enemy.pos) >= enemy.radius + 38) continue;
    player.attackHit = true;
    hit = true;
    const killed = enemy.hurt(20);
    spawnParticles(enemy.pos, '#d7263d', 9);
    if (killed) { kills += 1; messageText = 'Eco dissipado. Sem Essência.'; messageTimer = 1.1; }
    break;
  }
  if (hit) player.momentum = clamp(player.momentum + 7, 0, player.maxMomentum);
}

function tryCapture(): void {
  if (!pressed.has('f') || player.capturing > 0) return;
  const target = enemies.find((enemy) => enemy.ruptured && distance(player.pos, enemy.pos) <= 78);
  if (!target) {
    if (enemies.some((enemy) => enemy.ruptured)) { messageText = 'Aproxime-se do Eco em Ruptura.'; messageTimer = 1.2; }
    return;
  }
  player.capturing = player.fastSeal ? 0.32 : 0.58;
  target.alive = false;
  captures += 1;
  player.essence += 1;
  player.boxCharge = clamp(player.boxCharge + 24, 0, 100);
  player.momentum = clamp(player.momentum + 24, 0, player.maxMomentum);
  messageText = `Eco de ${target.ecoName} selado +1 Essência`;
  messageTimer = 1.8;
  spawnParticles(target.pos, '#d9a441', 25);
  if (player.chainCapture) {
    for (const enemy of enemies) if (enemy.alive && distance(enemy.pos, target.pos) < 115) enemy.hurt(16);
  }
}

function availableRelics(): Relic[] {
  const relics: Relic[] = [
    { id: 'thorn', name: 'Espinho de Rosa Morta', description: 'Ataques aplicam sangramento por 2,6 s.', apply: () => { player.bleedBonus = 1; } },
    { id: 'thread', name: 'Fio da Tecelã', description: 'Selar um Eco causa dano em inimigos próximos.', apply: () => { player.chainCapture = true; } },
    { id: 'boots', name: 'Botas da Cinderela Quebrada', description: 'A captura fica quase duas vezes mais rápida.', apply: () => { player.fastSeal = true; } },
    { id: 'lantern', name: 'Lanterna da Avó', description: '+35 de Vida máxima e cura 25 agora.', apply: () => { player.maxHp += 35; player.hp = clamp(player.hp + 25, 0, player.maxHp); } },
    { id: 'key', name: 'Chave de Marfim', description: '+1 Essência e -30 de Carga da Caixa.', apply: () => { player.essence += 1; player.boxCharge = clamp(player.boxCharge - 30, 0, 100); } },
  ];
  return relics.sort(() => Math.random() - 0.5).slice(0, 3);
}

function chooseRelic(index: number): void {
  const relic = selectedRelics[index];
  if (!relic) return;
  relic.apply();
  player.relics.push(relic.name);
  selectedRelics = [];
  if (wave < 3) spawnWave(wave + 1);
  else {
    roomCleared = true;
    gameState = 'victory';
    messageText = 'A sala foi purificada. A porta do Bosque se abre.';
    messageTimer = 99;
  }
}

function updateProjectiles(dt: number): void {
  projectiles = projectiles.filter((projectile) => {
    projectile.x += projectile.vx * dt;
    projectile.y += projectile.vy * dt;
    projectile.life -= dt;
    if (distance(projectile, player.pos) < projectile.radius + 15) { player.hurt(12); return false; }
    return projectile.life > 0 && projectile.x > 0 && projectile.x < W && projectile.y > 58 && projectile.y < H;
  });
}

function update(dt: number): void {
  if (pressed.has('r')) reset();
  if (gameState === 'play') {
    elapsed += dt;
    player.update(dt);
    for (const enemy of enemies) enemy.update(dt);
    tryAttack();
    tryCapture();
    updateProjectiles(dt);
    enemies = enemies.filter((enemy) => enemy.alive);
    if (enemies.length === 0 && !roomCleared) {
      roomCleared = true;
      gameState = 'relic';
      selectedRelics = availableRelics();
      messageText = 'Onda vencida. Escolha uma relíquia.';
      messageTimer = 99;
    }
    if (player.hp <= 0) gameState = 'defeat';
  }
  if (gameState === 'relic') {
    if (pressed.has('1')) chooseRelic(0);
    if (pressed.has('2')) chooseRelic(1);
    if (pressed.has('3')) chooseRelic(2);
  }
  messageTimer = Math.max(0, messageTimer - dt);
  particles = particles.filter((p) => { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.92; p.vy *= 0.92; p.life -= dt; return p.life > 0; });
  pressed.clear();
}

function bar(x: number, y: number, width: number, value: number, max: number, color: string, label: string): void {
  ctx.fillStyle = '#0a0b11'; ctx.fillRect(x, y, width, 14);
  ctx.fillStyle = '#352f3d'; ctx.fillRect(x + 2, y + 2, width - 4, 10);
  ctx.fillStyle = color; ctx.fillRect(x + 2, y + 2, (width - 4) * (value / max), 10);
  ctx.fillStyle = '#d8d2c5'; ctx.font = '600 13px Satoshi, sans-serif'; ctx.fillText(label, x, y - 7);
}

function renderArena(): void {
  ctx.fillStyle = '#10121b'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(216,210,197,.055)'; ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 48) { ctx.beginPath(); ctx.moveTo(x, 58); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 58; y <= H; y += 48) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.fillStyle = '#171725'; ctx.fillRect(0, 0, W, 58);
  ctx.fillStyle = '#d8d2c5'; ctx.font = '700 21px Boska, Georgia, serif'; ctx.fillText('BOSQUE DAS FÁBULAS QUEIMADAS', 28, 37);
  ctx.fillStyle = '#6d6875'; ctx.font = '500 13px Satoshi, sans-serif'; ctx.fillText('Pandora e a Caixa dos Ecos', 739, 34);

  for (const o of obstacles) {
    ctx.fillStyle = '#2a2834'; ctx.fillRect(o.x, o.y, o.w, o.h);
    ctx.strokeStyle = '#6d6875'; ctx.lineWidth = 2; ctx.strokeRect(o.x, o.y, o.w, o.h);
    ctx.fillStyle = 'rgba(216,210,197,.06)'; ctx.fillRect(o.x + 7, o.y + 7, o.w - 14, 7);
  }
  const doorColor = roomCleared ? '#d9a441' : '#6b1e2f';
  ctx.fillStyle = doorColor; ctx.fillRect(W / 2 - 44, 58, 88, 10);
  ctx.fillRect(W / 2 - 44, H - 10, 88, 10);
  ctx.fillStyle = '#6d6875'; ctx.font = '600 13px Satoshi, sans-serif';
  ctx.fillText(roomCleared ? 'PORTAS ABERTAS' : `PORTAS SELADAS · ONDA ${wave}/3`, 360, H - 20);
}

function drawBox(): void {
  const floatY = Math.sin(elapsed * 4) * 3;
  const x = player.pos.x - 26;
  const y = player.pos.y - 16 + floatY;
  ctx.save();
  if (player.capturing > 0) { ctx.shadowColor = '#d9a441'; ctx.shadowBlur = 20; }
  ctx.fillStyle = '#3b2a18'; ctx.fillRect(x - 8, y - 8, 16, 16);
  ctx.strokeStyle = '#d9a441'; ctx.lineWidth = 2; ctx.strokeRect(x - 8, y - 8, 16, 16);
  ctx.fillStyle = '#d9a441'; ctx.fillRect(x - 2, y - 8, 4, 16);
  ctx.restore();
}

function drawPlayer(): void {
  const p = player;
  ctx.save(); ctx.translate(p.pos.x, p.pos.y);
  if (p.invulnerable > 0 && Math.floor(p.invulnerable * 20) % 2 === 0) ctx.globalAlpha = 0.45;
  ctx.fillStyle = '#6b1e2f'; ctx.beginPath(); ctx.moveTo(-15, 17); ctx.lineTo(0, -24); ctx.lineTo(16, 17); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#d8d2c5'; ctx.beginPath(); ctx.arc(0, -8, 10, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#d9a441'; ctx.fillRect(-5, 1, 10, 8);
  ctx.strokeStyle = '#d8d2c5'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(p.facing.x * 7, p.facing.y * 7); ctx.lineTo(p.facing.x * 28, p.facing.y * 28); ctx.stroke();
  if (p.attackTimer > 0) { ctx.strokeStyle = '#f0d8ac'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, 48, Math.atan2(p.facing.y, p.facing.x) - 0.7, Math.atan2(p.facing.y, p.facing.x) + 0.7); ctx.stroke(); }
  ctx.restore();
  drawBox();
}

function drawEnemy(enemy: Enemy): void {
  if (enemy.ruptured) {
    ctx.save(); ctx.strokeStyle = '#d9a441'; ctx.lineWidth = 3; ctx.shadowColor = '#d9a441'; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.arc(enemy.pos.x, enemy.pos.y, enemy.radius + 10 + Math.sin(elapsed * 9) * 2, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
  }
  ctx.save(); ctx.translate(enemy.pos.x, enemy.pos.y);
  const body = enemy.hitFlash > 0 ? '#f3c7ce' : enemy.kind === 'archer' ? '#645284' : enemy.kind === 'stitcher' ? '#7a342e' : '#6b1e2f';
  ctx.fillStyle = body;
  if (enemy.kind === 'archer') { ctx.beginPath(); ctx.moveTo(0, -enemy.radius); ctx.lineTo(enemy.radius, enemy.radius); ctx.lineTo(-enemy.radius, enemy.radius); ctx.closePath(); ctx.fill(); }
  else if (enemy.kind === 'stitcher') { ctx.fillRect(-enemy.radius, -enemy.radius + 5, enemy.radius * 2, enemy.radius * 2 - 5); }
  else { ctx.beginPath(); ctx.arc(0, 0, enemy.radius, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = '#24131c'; ctx.fillRect(-10, -5, 20, 13);
  ctx.fillStyle = '#d8d2c5'; ctx.fillRect(-7, -1, 4, 4); ctx.fillRect(4, -1, 4, 4);
  if (enemy.ruptured) { ctx.fillStyle = '#d9a441'; ctx.fillRect(-2, 7, 4, 8); }
  ctx.restore();
  bar(enemy.pos.x - 31, enemy.pos.y - enemy.radius - 22, 62, enemy.hp, enemy.maxHp, enemy.ruptured ? '#d9a441' : '#6b1e2f', '');
}

function renderCaptureLink(): void {
  if (player.capturing <= 0) return;
  const target = enemies.find((enemy) => !enemy.alive) ?? enemies[0];
  if (!target) return;
  ctx.save(); ctx.globalAlpha = player.capturing / 0.58; ctx.strokeStyle = '#d9a441'; ctx.lineWidth = 3; ctx.setLineDash([5, 6]);
  ctx.beginPath(); ctx.moveTo(player.pos.x - 25, player.pos.y - 15); ctx.lineTo(target.pos.x, target.pos.y); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
}

function renderHud(): void {
  bar(26, 86, 220, player.hp, player.maxHp, '#d7263d', 'VIDA');
  bar(26, 122, 220, player.momentum, player.maxMomentum, '#8c6ccf', 'ÍMPETO');
  bar(26, 158, 220, player.boxCharge, 100, '#d9a441', 'CARGA DA CAIXA');
  ctx.fillStyle = '#d8d2c5'; ctx.font = '600 14px Satoshi, sans-serif';
  ctx.fillText(`Essência: ${player.essence}`, 738, 86);
  ctx.fillText(`Ecos selados: ${captures}`, 738, 110);
  ctx.fillText(`Vultos dissipados: ${kills}`, 738, 134);
  const ready = enemies.some((enemy) => enemy.ruptured && distance(enemy.pos, player.pos) <= 78);
  ctx.fillStyle = ready ? '#d9a441' : '#6d6875';
  ctx.fillText(ready ? 'F · SELAR ECO' : 'Enfraqueça para romper o Eco', 738, 160);
  ctx.fillStyle = '#d9a441'; ctx.font = '600 12px Satoshi, sans-serif'; ctx.fillText(`Relíquias: ${player.relics.length ? player.relics.join(' · ') : 'nenhuma'}`, 26, 202);
}

function renderRelics(): void {
  ctx.fillStyle = 'rgba(10,11,17,.82)'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#d8d2c5'; ctx.font = '700 34px Boska, Georgia, serif'; ctx.textAlign = 'center'; ctx.fillText('A CAIXA OFERECE TRÊS CAMINHOS', W / 2, 116);
  ctx.fillStyle = '#d9a441'; ctx.font = '500 16px Satoshi, sans-serif'; ctx.fillText('Pressione 1, 2 ou 3 para escolher uma relíquia.', W / 2, 146);
  selectedRelics.forEach((relic, index) => {
    const x = 112 + index * 252;
    ctx.fillStyle = '#1c1b28'; ctx.fillRect(x, 190, 220, 190);
    ctx.strokeStyle = '#d9a441'; ctx.lineWidth = 2; ctx.strokeRect(x, 190, 220, 190);
    ctx.fillStyle = '#d9a441'; ctx.font = '700 18px Satoshi, sans-serif'; ctx.fillText(String(index + 1), x + 22, 220);
    ctx.fillStyle = '#d8d2c5'; ctx.font = '700 21px Boska, Georgia, serif'; ctx.fillText(relic.name, x + 110, 262);
    ctx.fillStyle = '#b6b0a6'; ctx.font = '500 15px Satoshi, sans-serif';
    const words = relic.description.split(' '); let line = ''; let y = 300;
    for (const word of words) { const next = `${line}${word} `; if (ctx.measureText(next).width > 182) { ctx.fillText(line.trim(), x + 110, y); y += 24; line = `${word} `; } else line = next; }
    ctx.fillText(line.trim(), x + 110, y);
  });
  ctx.textAlign = 'start';
}

function renderMessage(): void {
  if (messageTimer <= 0 || gameState === 'relic') return;
  ctx.fillStyle = 'rgba(16,18,27,.84)'; ctx.fillRect(205, 178, 550, 72);
  ctx.strokeStyle = 'rgba(216,210,197,.25)'; ctx.strokeRect(205, 178, 550, 72);
  ctx.fillStyle = '#d8d2c5'; ctx.font = '600 18px Satoshi, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(messageText, W / 2, 222); ctx.textAlign = 'start';
}

function renderEnd(): void {
  if (gameState !== 'victory' && gameState !== 'defeat') return;
  ctx.fillStyle = 'rgba(10,11,17,.80)'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#d8d2c5'; ctx.font = '700 44px Boska, Georgia, serif'; ctx.textAlign = 'center';
  ctx.fillText(gameState === 'victory' ? 'O BOSQUE SE CURVA DIANTE DA CAIXA' : 'A CAIXA SE FECHOU SOBRE PANDORA', W / 2, 218);
  ctx.fillStyle = '#d9a441'; ctx.font = '600 18px Satoshi, sans-serif'; ctx.fillText(`Ecos selados: ${captures} · Essência: ${player.essence}`, W / 2, 262);
  ctx.fillStyle = '#d8d2c5'; ctx.font = '500 17px Satoshi, sans-serif'; ctx.fillText('Pressione R para recomeçar a sala.', W / 2, 306); ctx.textAlign = 'start';
}

function render(): void {
  renderArena();
  for (const enemy of enemies) drawEnemy(enemy);
  for (const projectile of projectiles) { ctx.fillStyle = '#8c6ccf'; ctx.beginPath(); ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2); ctx.fill(); }
  renderCaptureLink();
  drawPlayer();
  for (const p of particles) { ctx.globalAlpha = p.life / p.maxLife; ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, p.size, p.size); }
  ctx.globalAlpha = 1;
  renderHud();
  renderMessage();
  if (gameState === 'relic') renderRelics();
  renderEnd();
}

let lastTime = performance.now();
function loop(time: number): void {
  const dt = Math.min((time - lastTime) / 1000, 0.033);
  lastTime = time;
  update(dt);
  render();
  requestAnimationFrame(loop);
}

reset();
requestAnimationFrame(loop);
