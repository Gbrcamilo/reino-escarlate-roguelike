import './style.css';

type Vec = { x: number; y: number };
type Particle = Vec & { vx: number; vy: number; life: number; maxLife: number; color: string; size: number };

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

  update(dt: number): void {
    const input = { x: (keys.has('d') ? 1 : 0) - (keys.has('a') ? 1 : 0), y: (keys.has('s') ? 1 : 0) - (keys.has('w') ? 1 : 0) };
    const moving = input.x !== 0 || input.y !== 0;
    if (moving) this.facing = normalized(input);
    if (pressed.has(' ') && this.dashCooldown <= 0 && moving && this.momentum >= 18) {
      this.dashTimer = 0.16; this.dashCooldown = 0.55; this.invulnerable = 0.2; this.momentum -= 18;
    }
    const speed = this.dashTimer > 0 ? 880 : this.capturing > 0 ? 80 : 235;
    if (moving) {
      const direction = normalized(input);
      this.pos.x += direction.x * speed * dt;
      this.pos.y += direction.y * speed * dt;
    }
    this.pos.x = clamp(this.pos.x, 38, W - 38);
    this.pos.y = clamp(this.pos.y, 78, H - 38);
    if (pressed.has('j') && this.attackTimer <= 0 && this.capturing <= 0) { this.attackTimer = 0.23; this.attackHit = false; }
    this.attackTimer = Math.max(0, this.attackTimer - dt);
    this.dashTimer = Math.max(0, this.dashTimer - dt);
    this.dashCooldown = Math.max(0, this.dashCooldown - dt);
    this.invulnerable = Math.max(0, this.invulnerable - dt);
    this.capturing = Math.max(0, this.capturing - dt);
    this.momentum = clamp(this.momentum + 18 * dt, 0, this.maxMomentum);
    this.boxCharge = clamp(this.boxCharge - 3 * dt, 0, 100);
  }

  hurt(amount: number): void {
    if (this.invulnerable > 0) return;
    this.hp = Math.max(0, this.hp - amount);
    this.invulnerable = 0.55;
    if (this.capturing > 0) this.capturing = 0;
  }
}

class Enemy {
  pos: Vec;
  radius = 21;
  hp = 80;
  maxHp = 80;
  speed = 95;
  hitFlash = 0;
  attackTimer = 0;
  alive = true;

  constructor(x: number, y: number) { this.pos = { x, y }; }

  get ruptured(): boolean { return this.alive && this.hp <= this.maxHp * 0.25; }

  update(dt: number, player: Player): void {
    if (!this.alive) return;
    const toPlayer = { x: player.pos.x - this.pos.x, y: player.pos.y - this.pos.y };
    const d = length(toPlayer);
    if (d > 48) {
      const n = normalized(toPlayer);
      const speed = this.ruptured ? this.speed * 0.7 : this.speed;
      this.pos.x += n.x * speed * dt;
      this.pos.y += n.y * speed * dt;
    }
    if (d < 50 && this.attackTimer <= 0) { player.hurt(11); this.attackTimer = 0.8; }
    this.attackTimer = Math.max(0, this.attackTimer - dt);
    this.hitFlash = Math.max(0, this.hitFlash - dt);
  }

  hurt(amount: number): boolean {
    this.hp -= amount; this.hitFlash = 0.12;
    if (this.hp <= 0) { this.alive = false; return true; }
    return false;
  }
}

let player: Player;
let enemy: Enemy;
let particles: Particle[];
let kills = 0;
let captures = 0;
let elapsed = 0;
let gameOver = false;
let messageTimer = 5;
let captureText = '';
let captureTextTimer = 0;

function reset(): void {
  player = new Player();
  enemy = new Enemy(720, 270);
  particles = [];
  kills = 0; captures = 0; elapsed = 0; gameOver = false; messageTimer = 5;
  captureText = ''; captureTextTimer = 0;
}

function spawnParticles(pos: Vec, color: string, count: number): void {
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 45 + Math.random() * 135;
    particles.push({ x: pos.x, y: pos.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 0.34 + Math.random() * 0.36, maxLife: 0.7, color, size: 2 + Math.random() * 4 });
  }
}

function spawnEnemy(): void {
  enemy = new Enemy(110 + Math.random() * 740, 115 + Math.random() * 340);
}

function attemptAttack(): void {
  if (player.attackTimer <= 0 || player.attackHit || !enemy.alive) return;
  const attackCenter = { x: player.pos.x + player.facing.x * 42, y: player.pos.y + player.facing.y * 42 };
  if (distance(attackCenter, enemy.pos) < 60) {
    player.attackHit = true;
    const killed = enemy.hurt(20);
    player.momentum = clamp(player.momentum + 7, 0, player.maxMomentum);
    spawnParticles(enemy.pos, '#d7263d', 9);
    if (killed) {
      kills += 1;
      captureText = 'Eco dissipado. Sem Essência.';
      captureTextTimer = 1.5;
      setTimeout(() => { if (!gameOver) spawnEnemy(); }, 550);
    }
  }
}

function attemptCapture(): void {
  if (!pressed.has('f') || !enemy.alive || !enemy.ruptured || player.capturing > 0) return;
  if (distance(player.pos, enemy.pos) > 76) {
    captureText = 'Aproxime-se do Eco em Ruptura.'; captureTextTimer = 1.2; return;
  }
  player.capturing = 0.58;
  enemy.alive = false;
  captures += 1;
  player.essence += 1;
  player.boxCharge = clamp(player.boxCharge + 24, 0, 100);
  player.momentum = clamp(player.momentum + 24, 0, player.maxMomentum);
  captureText = 'Eco de Fome selado +1 Essência';
  captureTextTimer = 1.8;
  spawnParticles(enemy.pos, '#d9a441', 25);
  setTimeout(() => { if (!gameOver) spawnEnemy(); }, 700);
}

function update(dt: number): void {
  if (pressed.has('r')) reset();
  if (!gameOver) {
    elapsed += dt;
    player.update(dt);
    enemy.update(dt, player);
    attemptAttack();
    attemptCapture();
    if (player.hp <= 0) gameOver = true;
  }
  messageTimer = Math.max(0, messageTimer - dt);
  captureTextTimer = Math.max(0, captureTextTimer - dt);
  particles = particles.filter((p) => {
    p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.92; p.vy *= 0.92; p.life -= dt; return p.life > 0;
  });
  pressed.clear();
}

function bar(x: number, y: number, width: number, value: number, max: number, color: string, label: string): void {
  ctx.fillStyle = '#0a0b11'; ctx.fillRect(x, y, width, 14);
  ctx.fillStyle = '#352f3d'; ctx.fillRect(x + 2, y + 2, width - 4, 10);
  ctx.fillStyle = color; ctx.fillRect(x + 2, y + 2, (width - 4) * (value / max), 10);
  if (label) { ctx.fillStyle = '#d8d2c5'; ctx.font = '600 13px Satoshi, sans-serif'; ctx.fillText(label, x, y - 7); }
}

function renderArena(): void {
  ctx.fillStyle = '#10121b'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(216,210,197,.055)'; ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 48) { ctx.beginPath(); ctx.moveTo(x, 58); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 58; y <= H; y += 48) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.fillStyle = '#171725'; ctx.fillRect(0, 0, W, 58);
  ctx.fillStyle = '#d8d2c5'; ctx.font = '700 21px Boska, Georgia, serif'; ctx.fillText('BOSQUE DAS FÁBULAS QUEIMADAS', 28, 37);
  ctx.fillStyle = '#6d6875'; ctx.font = '500 13px Satoshi, sans-serif'; ctx.fillText('Pandora e a Caixa dos Ecos', 739, 34);
}

function drawBox(): void {
  const floatY = Math.sin(elapsed * 4) * 3;
  const x = player.pos.x - 26;
  const y = player.pos.y - 16 + floatY;
  const active = player.capturing > 0;
  ctx.save();
  if (active) { ctx.shadowColor = '#d9a441'; ctx.shadowBlur = 20; }
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
  if (p.attackTimer > 0) {
    ctx.strokeStyle = '#f0d8ac'; ctx.lineWidth = 4; ctx.beginPath();
    ctx.arc(0, 0, 48, Math.atan2(p.facing.y, p.facing.x) - 0.7, Math.atan2(p.facing.y, p.facing.x) + 0.7); ctx.stroke();
  }
  ctx.restore();
  drawBox();
}

function drawEnemy(): void {
  if (!enemy.alive) return;
  const e = enemy;
  if (e.ruptured) {
    ctx.save(); ctx.strokeStyle = '#d9a441'; ctx.lineWidth = 3; ctx.shadowColor = '#d9a441'; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.arc(e.pos.x, e.pos.y, 31 + Math.sin(elapsed * 9) * 2, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }
  ctx.save(); ctx.translate(e.pos.x, e.pos.y);
  ctx.fillStyle = e.hitFlash > 0 ? '#f3c7ce' : '#6b1e2f';
  ctx.beginPath(); ctx.arc(0, 0, e.radius, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#24131c'; ctx.fillRect(-11, -6, 22, 15);
  ctx.fillStyle = '#d8d2c5'; ctx.fillRect(-7, -2, 4, 4); ctx.fillRect(4, -2, 4, 4);
  if (e.ruptured) { ctx.fillStyle = '#d9a441'; ctx.fillRect(-2, 7, 4, 8); }
  ctx.restore();
  bar(e.pos.x - 31, e.pos.y - 42, 62, e.hp, e.maxHp, e.ruptured ? '#d9a441' : '#6b1e2f', '');
}

function renderCaptureLink(): void {
  if (player.capturing <= 0) return;
  const alpha = player.capturing / 0.58;
  ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = '#d9a441'; ctx.lineWidth = 3; ctx.setLineDash([5, 6]);
  ctx.beginPath(); ctx.moveTo(player.pos.x - 25, player.pos.y - 15); ctx.lineTo(enemy.pos.x, enemy.pos.y); ctx.stroke();
  ctx.setLineDash([]); ctx.restore();
}

function renderHud(): void {
  bar(26, 86, 220, player.hp, player.maxHp, '#d7263d', 'VIDA');
  bar(26, 122, 220, player.momentum, player.maxMomentum, '#8c6ccf', 'ÍMPETO');
  bar(26, 158, 220, player.boxCharge, 100, '#d9a441', 'CARGA DA CAIXA');
  ctx.fillStyle = '#d8d2c5'; ctx.font = '600 14px Satoshi, sans-serif';
  ctx.fillText(`Essência: ${player.essence}`, 738, 86);
  ctx.fillText(`Ecos selados: ${captures}`, 738, 110);
  ctx.fillText(`Vultos dissipados: ${kills}`, 738, 134);
  ctx.fillStyle = enemy.ruptured ? '#d9a441' : '#6d6875';
  ctx.fillText(enemy.ruptured ? 'F · SELAR ECO' : 'Enfraqueça para romper o Eco', 738, 160);
}

function renderOverlay(): void {
  if (messageTimer > 0 && !gameOver) {
    ctx.fillStyle = 'rgba(16,18,27,.84)'; ctx.fillRect(190, 174, 580, 128);
    ctx.strokeStyle = 'rgba(216,210,197,.25)'; ctx.strokeRect(190, 174, 580, 128);
    ctx.fillStyle = '#d8d2c5'; ctx.font = '700 25px Boska, Georgia, serif'; ctx.textAlign = 'center';
    ctx.fillText('Enfraqueça. Aprisione. Transforme o medo em poder.', W / 2, 218);
    ctx.fillStyle = '#d9a441'; ctx.font = '500 15px Satoshi, sans-serif';
    ctx.fillText('Quando o inimigo brilhar em ouro, aproxime-se e pressione F.', W / 2, 250);
    ctx.fillStyle = '#8c6ccf'; ctx.fillText('A captura concede Essência, mas aumenta a Carga da Caixa.', W / 2, 276);
    ctx.textAlign = 'start';
  }
  if (captureTextTimer > 0) {
    ctx.fillStyle = '#d9a441'; ctx.font = '700 16px Satoshi, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(captureText, W / 2, H - 28); ctx.textAlign = 'start';
  }
  if (gameOver) {
    ctx.fillStyle = 'rgba(10,11,17,.78)'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#d8d2c5'; ctx.font = '700 52px Boska, Georgia, serif'; ctx.textAlign = 'center';
    ctx.fillText('A CAIXA SE FECHOU SOBRE PANDORA', W / 2, 220);
    ctx.fillStyle = '#d9a441'; ctx.font = '600 18px Satoshi, sans-serif';
    ctx.fillText(`Ecos selados: ${captures} · Essência: ${player.essence}`, W / 2, 262);
    ctx.fillStyle = '#d8d2c5'; ctx.font = '500 17px Satoshi, sans-serif';
    ctx.fillText('Pressione R para voltar ao Bosque.', W / 2, 306); ctx.textAlign = 'start';
  }
}

function render(): void {
  renderArena();
  drawEnemy();
  renderCaptureLink();
  drawPlayer();
  for (const p of particles) { ctx.globalAlpha = p.life / p.maxLife; ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, p.size, p.size); }
  ctx.globalAlpha = 1;
  renderHud();
  renderOverlay();
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
