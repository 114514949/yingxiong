// 英雄数据
const heroes = {
    '一怒压下': {
        mainGames: ['诅咒之岛', '泰坦之路', '罗布乐思', '洛克王国：世界'],
        personality: '性情温和，手法强劲',
        version: '热门英雄'
    },
    '水晶龙': {
        mainGames: ['罗布乐思', '洛克王国：世界'],
        occasionalGames: ['诅咒之岛', '泰坦之路'],
        personality: '有时暴躁，画画高手，喜玩休闲游戏',
        version: '强势英雄'
    },
    '晚安': {
        mainGames: ['诅咒之岛'],
        occasionalGames: ['三角洲行动'],
        personality: '颇帅，手法强劲，比较暴躁',
        version: '黑马'
    },
    '愚人': {
        mainGames: ['诅咒之岛'],
        occasionalGames: ['三角洲行动', '王者荣耀', '超自然行动组', '洛克王国：世界'],
        barelyGames: ['罗布乐思'],
        personality: '人见人爱花见花开车见车载一见倾心惊为天人，涉猎极广，玩转互联网',
        version: '人见人爱'
    }
};

// 允许的名字列表
const allowedNames = ['一怒压下', '水晶龙', '晚安', '愚人'];

// DOM元素
const heroCards = document.querySelectorAll('.hero-card');
const heroInput = document.getElementById('heroInput');
const submitBtn = document.getElementById('submitBtn');
const messageDiv = document.getElementById('message');
const successOverlay = document.getElementById('successOverlay');
const successText = document.getElementById('successText');

// 粒子系统
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
        const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25,
                opacity: Math.random() * 0.5 + 0.1,
                color: Math.random() > 0.7 ? '#e8a838' : '#ffffff'
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // 更新位置
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // 边界检测
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.speedX *= -1;
            }
            
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.speedY *= -1;
            }
            
            // 绘制粒子
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fill();
            
            // 绘制粒子间的连线
            this.particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.strokeStyle = '#e8a838';
                    this.ctx.globalAlpha = 0.1 * (1 - distance / 120);
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// 卡片交互
heroCards.forEach(card => {
    card.addEventListener('click', function() {
        // 移除其他卡片的active状态
        heroCards.forEach(c => c.classList.remove('active'));
        
        // 添加当前卡片的active状态
        this.classList.add('active');
        
        // 将英雄名字填入输入框
        const heroName = this.dataset.hero;
        heroInput.value = heroName;
        
        // 清除消息
        messageDiv.textContent = '';
        messageDiv.className = 'message';
    });
});

// 输入框验证
heroInput.addEventListener('input', function() {
    const value = this.value.trim();
    
    // 实时验证输入是否在允许的列表中
    if (value && !allowedNames.includes(value)) {
        // 不在列表中的名字，输入框边框变红
        this.style.borderColor = 'rgba(255, 80, 60, 0.5)';
    } else {
        // 在列表中的名字，恢复默认边框
        this.style.borderColor = '';
    }
});

// 提交按钮点击事件
submitBtn.addEventListener('click', function() {
    const inputName = heroInput.value.trim();
    
    // 检查输入是否为空
    if (!inputName) {
        showMessage('请输入你的名字或选择一个英雄！', 'unknown');
        return;
    }
    
    // 检查输入是否在允许的列表中
    if (!allowedNames.includes(inputName)) {
        showMessage('作者还不了解你呢，请补充信息给作者哦～', 'unknown');
        return;
    }
    
    // 获取当前选中的英雄
    const selectedHero = document.querySelector('.hero-card.active');
    const selectedHeroName = selectedHero ? selectedHero.dataset.hero : null;
    
    // 逻辑判断
    if (inputName === '愚人') {
        // 无论输入什么，选择愚人都提示好眼光
        showMessage('少侠好眼光！我也这么觉得！', 'great-choice');
        showSuccessOverlay('你选择了愚人，真是独具慧眼！');
    } else if (inputName === selectedHeroName) {
        // 选择自己，自恋提示
        showMessage('自己选自己，你咋这么自恋呢？', 'narcissist');
    } else {
        // 选择别人，没有自信提示
        showMessage('不选自己，你怎么这么没有自信呢？', 'no-confidence');
    }
});

// 显示消息函数
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = 'message ' + type;
    
    // 3秒后清除消息
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = 'message';
    }, 5000);
}

// 显示成功叠加层
function showSuccessOverlay(text) {
    successText.textContent = text;
    successOverlay.classList.add('active');
    
    // 3秒后关闭叠加层
    setTimeout(() => {
        successOverlay.classList.remove('active');
    }, 3000);
}

// 键盘事件支持
heroInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        submitBtn.click();
    }
});

// 初始化粒子系统
const particleSystem = new ParticleSystem();

// 页面加载动画
document.addEventListener('DOMContentLoaded', function() {
    // 延迟显示内容，确保粒子系统初始化
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// 添加一些额外的视觉效果
document.addEventListener('mousemove', function(e) {
    const cards = document.querySelectorAll('.hero-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 如果鼠标在卡片上方，添加微妙的阴影效果
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const distanceX = (x - centerX) / centerX;
            const distanceY = (y - centerY) / centerY;
            
            card.style.transform = `translateY(-8px) rotateX(${distanceY * 3}deg) rotateY(${distanceX * 3}deg)`;
        } else {
            card.style.transform = '';
        }
    });
});

// 添加点击涟漪效果
document.addEventListener('click', function(e) {
    const ripple = document.createElement('div');
    ripple.style.position = 'fixed';
    ripple.style.borderRadius = '50%';
    ripple.style.backgroundColor = 'rgba(232, 168, 56, 0.3)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.left = e.clientX - 25 + 'px';
    ripple.style.top = e.clientY - 25 + 'px';
    ripple.style.width = '50px';
    ripple.style.height = '50px';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '9999';
    
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        document.body.removeChild(ripple);
    }, 600);
});

// 添加涟漪动画的CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
