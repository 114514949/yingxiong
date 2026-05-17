// 允许的名字列表 - 只有这四个名字才能触发判断逻辑
const allowedNames = ['一怒压下', '水晶龙', '晚安', '愚人'];

// 当前选择的英雄
let currentHero = '';

// DOM元素
const modalOverlay = document.getElementById('selectModal');
const modalHeroName = document.getElementById('modalHeroName');
const modalInput = document.getElementById('modalInput');
const modalMessage = document.getElementById('modalMessage');

// ============ 粒子系统 ============
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resizeCanvas();
        this.initParticles();
        this.animate();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    initParticles() {
        const count = Math.min(60, Math.floor(window.innerWidth / 20));
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2.5 + 0.5,
                speedX: Math.random() * 0.4 - 0.2,
                speedY: Math.random() * 0.4 - 0.2,
                opacity: Math.random() * 0.4 + 0.1,
                color: Math.random() > 0.75 ? '#e8a838' : '#ffffff'
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            
            if (p.x < 0 || p.x > this.canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.speedY *= -1;
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.opacity;
            this.ctx.fill();
        });
        
        // 粒子连线
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = '#e8a838';
                    this.ctx.globalAlpha = 0.08 * (1 - dist / 100);
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// ============ 卡片展开/收起 ============
function toggleCard(headerEl) {
    const card = headerEl.parentElement;
    const wasActive = card.classList.contains('active');
    
    // 收起所有卡片
    document.querySelectorAll('.hero-card').forEach(c => c.classList.remove('active'));
    
    // 如果之前不是激活状态，则展开
    if (!wasActive) {
        card.classList.add('active');
    }
}

// ============ 弹窗操作 ============
function openModal(heroName) {
    currentHero = heroName;
    modalHeroName.textContent = heroName;
    modalInput.value = '';
    modalMessage.textContent = '';
    modalMessage.className = 'modal-message';
    modalOverlay.classList.add('active');
    
    // 聚焦输入框
    setTimeout(() => modalInput.focus(), 300);
}

function closeModal() {
    modalOverlay.classList.remove('active');
    currentHero = '';
}

// 点击遮罩层关闭弹窗
modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

// ESC键关闭弹窗
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
    }
});

// 输入框回车确认
modalInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        confirmSelection();
    }
});

// ============ 确认选择逻辑 ============
function confirmSelection() {
    const inputName = modalInput.value.trim();
    
    // 清除之前的消息
    modalMessage.textContent = '';
    modalMessage.className = 'modal-message';
    
    // 检查输入是否为空
    if (!inputName) {
        showModalMessage('请输入你的名字！', 'unknown');
        return;
    }
    
    // 核心逻辑：只有输入四个指定名字之一才能进行下一步判断
    if (!allowedNames.includes(inputName)) {
        showModalMessage('作者还不了解你呢，请补充信息给作者哦～', 'unknown');
        return;
    }
    
    // 输入的名字在允许列表中，进行判断
    if (currentHero === '愚人') {
        // 选择愚人，无论输入什么名字，都提示好眼光
        showModalMessage('少侠好眼光！我也这么觉得！', 'great-choice');
    } else if (inputName === currentHero) {
        // 输入的名字和选择的英雄一样 - 自恋
        showModalMessage('自己选自己，你咋这么自恋呢？', 'narcissist');
    } else {
        // 输入的名字和选择的英雄不一样 - 不自信
        showModalMessage('不选自己，你怎么这么没有自信呢？', 'no-confidence');
    }
}

function showModalMessage(text, type) {
    modalMessage.textContent = text;
    modalMessage.className = 'modal-message ' + type;
    
    // 添加震动效果
    modalMessage.style.animation = 'none';
    modalMessage.offsetHeight; // 触发重排
    modalMessage.style.animation = 'messageShake 0.4s ease';
}

// 消息震动动画
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes messageShake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-8px); }
        40% { transform: translateX(8px); }
        60% { transform: translateX(-5px); }
        80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyle);

// ============ 初始化 ============
const particleSystem = new ParticleSystem();

// 页面加载完成后的入场动画
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.hero-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 150 * index + 200);
    });
});
