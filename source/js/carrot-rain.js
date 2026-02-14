/**
 * Carrot Rain Effect - 萝卜雨全屏飘落动画
 * 纯原生 JS + Canvas 2D 实现
 * 无外部依赖，性能优化，移动端友好
 * v2.0 - 图片风格萝卜 + Header 内嵌金属拨动开关
 */

(function() {
  'use strict';

  // 注入 CSS 样式
  const style = document.createElement('style');
  style.textContent = `
    #carrot-rain-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 9999;
      pointer-events: none;
    }

    /* 金属拨动开关样式 */
    .carrot-switch {
      display: inline-flex;
      align-items: center;
      margin-left: 16px;
      cursor: pointer;
      user-select: none;
      vertical-align: middle;
    }

    .menu-item-carrot-switch {
      margin-right: 15px;
      margin-left: 0;
      vertical-align: middle;
    }

    .menu-item-carrot-switch .carrot-switch {
      margin-left: 0;
    }

    .menu-item-carrot-switch .carrot-switch-track {
      margin-top: -2px;
    }

    @media (max-width: 768px) {
      .menu-item-carrot-switch {
        display: inline-block;
        margin: 0 8px 0 0;
      }
    }

    .carrot-switch-track {
      position: relative;
      width: 48px;
      height: 24px;
      border-radius: 12px;
      background: linear-gradient(180deg, #bbb 0%, #ddd 50%, #bbb 100%);
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.3), 0 1px 2px rgba(255,255,255,0.5);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid #999;
      overflow: hidden;
    }

    /* 槽底萝卜图标（仅打开时显示） */
    .carrot-switch-track::after {
      content: '';
      position: absolute;
      left: 7px;
      top: 3px;
      width: 18px;
      height: 18px;
      opacity: 0;
      transform: scale(0.85);
      transition: opacity 0.25s ease, transform 0.25s ease;
      background-repeat: no-repeat;
      background-size: contain;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%2334c96b' d='M11 3c.8 1.6 1.8 2.4 3.4 2.6-1.3.4-2.1 1.1-2.7 2.3-.3-1.2-1.1-2-2.3-2.5 1.2-.2 1.9-.9 1.6-2.4zM7.8 5.2c.5 1.1 1.2 1.7 2.4 1.9-1 .3-1.6.8-2 1.8-.2-.9-.8-1.5-1.7-1.9.9-.2 1.5-.7 1.3-1.8zM15.6 5.5c.5 1 1.1 1.5 2.1 1.7-.9.2-1.4.7-1.8 1.6-.2-.8-.7-1.3-1.5-1.7.8-.2 1.3-.6 1.2-1.6z'/%3E%3Cpath fill='%23ff8a2a' stroke='%23d86310' stroke-width='1.1' d='M12.2 7.2c1.7 0 4.9 1.2 4.9 3.7 0 4.5-2.2 8.3-4.9 10.7-2.7-2.4-4.9-6.2-4.9-10.7 0-2.5 3.2-3.7 4.9-3.7z'/%3E%3Cpath fill='none' stroke='%23fff3dd' stroke-width='1.2' stroke-linecap='round' d='M10 12.1h4.4M9.7 14.8h4.7M10 17.2h3.9'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 1;
      filter: drop-shadow(0 0 1px rgba(0,0,0,0.22));
    }

    .carrot-switch-track::before {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
      box-shadow: 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.8);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid #aaa;
      z-index: 2;
    }

    .carrot-switch.on .carrot-switch-track {
      background: linear-gradient(180deg, #ff8c42 0%, #ffb366 50%, #ff8c42 100%);
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.2), 0 1px 2px rgba(255,255,255,0.5), 0 0 8px rgba(255,140,66,0.4);
      border-color: #ff6b35;
    }

    .carrot-switch.on .carrot-switch-track::after {
      opacity: 1;
      transform: scale(1);
    }

    .carrot-switch.on .carrot-switch-track::before {
      left: 26px;
      background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
      box-shadow: 0 2px 6px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.9);
    }

    .carrot-switch:hover .carrot-switch-track {
      transform: scale(1.05);
    }

    .carrot-switch:active .carrot-switch-track::before {
      transform: scale(0.95);
    }

    /* 移动端适配 */
    @media (max-width: 768px) {
      .carrot-switch {
        margin-left: 8px;
      }
      .carrot-switch-track {
        width: 40px;
        height: 20px;
        border-radius: 10px;
      }
      .carrot-switch-track::before {
        width: 16px;
        height: 16px;
      }
      .carrot-switch.on .carrot-switch-track::before {
        left: 22px;
      }
    }
  `;
  document.head.appendChild(style);

  // 配置
  const CONFIG = {
    PARTICLE_COUNT: 24, // 降为60%（40 * 0.6 = 24）
    MIN_SIZE: 15,
    MAX_SIZE: 35,
    MIN_SPEED: 1,
    MAX_SPEED: 3,
    MIN_OPACITY: 0.24, // 降低20%（0.3 * 0.8 = 0.24）
    MAX_OPACITY: 0.64, // 降低20%（0.8 * 0.8 = 0.64）
    WOBBLE_SPEED_MIN: 0.01,
    WOBBLE_SPEED_MAX: 0.03,
    ROTATION_SPEED_MIN: -0.02,
    ROTATION_SPEED_MAX: 0.02,
    STORAGE_KEY: 'carrot-rain-enabled'
  };

  // 工具函数：随机数
  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  // 绘制可爱萝卜图片（离屏 canvas）
  function createCarrotSprite(size) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = size;
    canvas.height = size * 1.3; // 萝卜稍微高一点

    const centerX = size / 2;
    const bodyWidth = size * 0.78;
    const bodyHeight = size * 0.9;
    const bodyTop = size * 0.35;

    // 萝卜根茎（橙色，子弹型：上宽下尖）
    ctx.save();
    ctx.fillStyle = '#ff8c42';
    ctx.strokeStyle = '#e67e22';
    ctx.lineWidth = 1.5;

    const topY = bodyTop;
    const bottomY = bodyTop + bodyHeight;
    const halfW = bodyWidth / 2;

    ctx.beginPath();
    ctx.moveTo(centerX - halfW * 0.9, topY + bodyHeight * 0.18);
    ctx.quadraticCurveTo(centerX - halfW * 1.05, topY + bodyHeight * 0.55, centerX - halfW * 0.35, bottomY - bodyHeight * 0.08);
    ctx.quadraticCurveTo(centerX - halfW * 0.18, bottomY, centerX, bottomY + bodyHeight * 0.03);
    ctx.quadraticCurveTo(centerX + halfW * 0.18, bottomY, centerX + halfW * 0.35, bottomY - bodyHeight * 0.08);
    ctx.quadraticCurveTo(centerX + halfW * 1.05, topY + bodyHeight * 0.55, centerX + halfW * 0.9, topY + bodyHeight * 0.18);
    ctx.quadraticCurveTo(centerX + halfW * 0.65, topY - bodyHeight * 0.02, centerX, topY);
    ctx.quadraticCurveTo(centerX - halfW * 0.65, topY - bodyHeight * 0.02, centerX - halfW * 0.9, topY + bodyHeight * 0.18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 横向土痕
    ctx.strokeStyle = '#de6f1c';
    ctx.lineWidth = Math.max(1, size * 0.045);
    ctx.lineCap = 'round';
    const scarYs = [0.32, 0.48, 0.64, 0.77];
    scarYs.forEach((ratio, i) => {
      const y = topY + bodyHeight * ratio;
      const w = bodyWidth * (0.48 - i * 0.06);
      ctx.beginPath();
      ctx.moveTo(centerX - w / 2, y);
      ctx.lineTo(centerX + w / 2, y);
      ctx.stroke();
    });

    // 高光
    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.beginPath();
    ctx.ellipse(centerX - bodyWidth * 0.16, topY + bodyHeight * 0.26, bodyWidth * 0.14, bodyHeight * 0.12, -0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // 绿色叶子（3片）
    ctx.save();
    ctx.fillStyle = '#27ae60';
    ctx.strokeStyle = '#229954';
    ctx.lineWidth = 1;

    const leafY = bodyTop - size * 0.05;
    const leafWidth = size * 0.25;
    const leafHeight = size * 0.35;

    // 左叶
    ctx.beginPath();
    ctx.ellipse(centerX - leafWidth * 0.6, leafY, leafWidth / 2, leafHeight / 2, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 中叶
    ctx.beginPath();
    ctx.ellipse(centerX, leafY - leafHeight * 0.2, leafWidth / 2, leafHeight / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 右叶
    ctx.beginPath();
    ctx.ellipse(centerX + leafWidth * 0.6, leafY, leafWidth / 2, leafHeight / 2, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();

    return canvas;
  }

  // 萝卜粒子类
  class Carrot {
    constructor(canvas, sprite) {
      this.canvas = canvas;
      this.sprite = sprite;
      this.reset();
    }

    reset() {
      this.x = random(0, this.canvas.width);
      this.y = random(-100, 0);
      this.size = random(CONFIG.MIN_SIZE, CONFIG.MAX_SIZE);
      this.speed = random(CONFIG.MIN_SPEED, CONFIG.MAX_SPEED);
      this.wobble = random(0, Math.PI * 2);
      this.wobbleSpeed = random(CONFIG.WOBBLE_SPEED_MIN, CONFIG.WOBBLE_SPEED_MAX);
      this.rotation = random(0, Math.PI * 2);
      this.rotationSpeed = random(CONFIG.ROTATION_SPEED_MIN, CONFIG.ROTATION_SPEED_MAX);
      this.opacity = random(CONFIG.MIN_OPACITY, CONFIG.MAX_OPACITY);
      this.wobbleAmplitude = random(0.5, 1.5);
      
      // 为每个粒子生成对应尺寸的 sprite
      this.currentSprite = createCarrotSprite(this.size);
    }

    update() {
      this.y += this.speed;
      this.wobble += this.wobbleSpeed;
      this.rotation += this.rotationSpeed;
      this.x += Math.sin(this.wobble) * this.wobbleAmplitude;

      // 循环：飘落到底部后回到顶部
      if (this.y > this.canvas.height + 50) {
        this.y = -50;
        this.x = random(0, this.canvas.width);
      }

      // 边界检查：左右摇摆不要超出屏幕
      if (this.x < -50) this.x = this.canvas.width + 50;
      if (this.x > this.canvas.width + 50) this.x = -50;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.drawImage(
        this.currentSprite,
        -this.currentSprite.width / 2,
        -this.currentSprite.height / 2
      );
      ctx.restore();
    }
  }

  // 萝卜雨管理器
  class CarrotRain {
    constructor() {
      this.canvas = document.getElementById('carrot-rain-canvas');
      this.toggle = document.getElementById('carrot-rain-toggle');
      
      if (!this.canvas || !this.toggle) {
        console.error('CarrotRain: Required elements not found');
        return;
      }

      this.ctx = this.canvas.getContext('2d');
      this.carrots = [];
      this.animationId = null;
      this.enabled = this.loadPreference();

      this.init();
    }

    init() {
      this.resize();
      this.createCarrots();
      this.bindEvents();
      this.updateToggleState();

      if (this.enabled) {
        this.start();
      }
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    createCarrots() {
      this.carrots = [];
      const baseSprite = createCarrotSprite(30); // 基础 sprite（实际不用，每个粒子自己生成）
      for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
        this.carrots.push(new Carrot(this.canvas, baseSprite));
      }
    }

    bindEvents() {
      // 窗口大小变化
      window.addEventListener('resize', () => {
        this.resize();
        // 重新初始化萝卜位置
        this.carrots.forEach(carrot => {
          if (carrot.x > this.canvas.width) {
            carrot.x = random(0, this.canvas.width);
          }
        });
      });

      // 开关按钮点击
      this.toggle.addEventListener('click', () => {
        this.enabled = !this.enabled;
        this.savePreference();
        this.updateToggleState();

        if (this.enabled) {
          this.start();
        } else {
          this.stop();
        }
      });
    }

    start() {
      if (this.animationId) return;
      this.animate();
    }

    stop() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.carrots.forEach(carrot => {
        carrot.update();
        carrot.draw(this.ctx);
      });

      this.animationId = requestAnimationFrame(() => this.animate());
    }

    updateToggleState() {
      if (this.enabled) {
        this.toggle.classList.add('on');
      } else {
        this.toggle.classList.remove('on');
      }
    }

    loadPreference() {
      const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
      // 默认开启
      return saved === null ? true : saved === 'true';
    }

    savePreference() {
      localStorage.setItem(CONFIG.STORAGE_KEY, this.enabled.toString());
    }
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new CarrotRain();
    });
  } else {
    new CarrotRain();
  }
})();
