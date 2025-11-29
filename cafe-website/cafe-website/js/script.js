// Animação de entrada suave
document.addEventListener('DOMContentLoaded', function() {
    console.log('Site Café & Cultura carregado com sucesso!');
    
    // Adiciona animação aos cards ao carregar
    const cards = document.querySelectorAll('.feature-card, .coffee-card, .tip-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Quiz de Café Ideal
const quizBtn = document.getElementById('quizBtn');
if (quizBtn) {
    quizBtn.addEventListener('click', function() {
        const coffeeTypes = [
            {
                name: 'Espresso',
                description: 'Você é intenso e direto! O Espresso é perfeito para quem aprecia sabores fortes e decisões rápidas.',
                icon: '☕'
            },
            {
                name: 'Cappuccino',
                description: 'Você busca equilíbrio na vida! O Cappuccino representa harmonia entre intensidade e suavidade.',
                icon: '☕'
            },
            {
                name: 'Café Latte',
                description: 'Você é uma pessoa suave e gentil! O Latte é perfeito para quem aprecia momentos tranquilos.',
                icon: '☕'
            },
            {
                name: 'Mocha',
                description: 'Você tem um lado doce! O Mocha combina café e chocolate, ideal para os amantes de sabores ricos.',
                icon: '☕'
            },
            {
                name: 'Cold Brew',
                description: 'Você é moderno e inovador! O Cold Brew representa frescor e uma abordagem única ao café.',
                icon: '☕'
            }
        ];
        
        const randomCoffee = coffeeTypes[Math.floor(Math.random() * coffeeTypes.length)];
        const resultDiv = document.getElementById('quizResult');
        
        resultDiv.innerHTML = `
            <h3>${randomCoffee.icon} Seu café ideal: ${randomCoffee.name}</h3>
            <p>${randomCoffee.description}</p>
        `;
        resultDiv.classList.add('show');
        
        // Scroll suave até o resultado
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}

// Calculadora de Café
const calculateBtn = document.getElementById('calculateBtn');
if (calculateBtn) {
    calculateBtn.addEventListener('click', function() {
        const waterAmount = parseFloat(document.getElementById('waterAmount').value);
        
        if (isNaN(waterAmount) || waterAmount < 50) {
            alert('Por favor, insira uma quantidade válida de água (mínimo 50ml)');
            return;
        }
        
        // Proporção padrão: 1g de café para 16ml de água
        const coffeeAmount = (waterAmount / 16).toFixed(1);
        
        // Proporção forte: 1:14
        const coffeeStrong = (waterAmount / 14).toFixed(1);
        
        // Proporção suave: 1:18
        const coffeeMild = (waterAmount / 18).toFixed(1);
        
        const resultDiv = document.getElementById('calcResult');
        resultDiv.innerHTML = `
            <h3>📊 Resultado do Cálculo</h3>
            <p><strong>Para ${waterAmount}ml de água:</strong></p>
            <p>☕ Café normal: <strong>${coffeeAmount}g</strong></p>
            <p>💪 Café forte: <strong>${coffeeStrong}g</strong></p>
            <p>🌸 Café suave: <strong>${coffeeMild}g</strong></p>
            <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
                Dica: Use uma balança digital para medir com precisão!
            </p>
        `;
        resultDiv.classList.add('show');
        
        // Scroll suave até o resultado
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    
    // Permitir calcular pressionando Enter
    document.getElementById('waterAmount').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateBtn.click();
        }
    });
}

// Modal da Galeria
function openModal(element) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const caption = document.getElementById('modalCaption');
    
    const img = element.querySelector('img');
    const captionText = element.querySelector('.gallery-caption');
    
    modal.style.display = 'block';
    modalImg.src = img.src;
    caption.innerHTML = captionText.innerHTML;
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
}

// Fechar modal ao clicar fora da imagem
window.onclick = function(event) {
    const modal = document.getElementById('imageModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Fechar modal com tecla ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Scroll suave para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Efeito de hover nos cards de café
const coffeeCards = document.querySelectorAll('.coffee-card');
coffeeCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// Destaque no menu ativo ao fazer scroll
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Validação e feedback para elementos de áudio e vídeo
const audioElements = document.querySelectorAll('audio');
audioElements.forEach(audio => {
    audio.addEventListener('error', function() {
        console.warn('Erro ao carregar áudio. Certifique-se de adicionar os arquivos de áudio na pasta audio/');
    });
});

const videoElements = document.querySelectorAll('video');
videoElements.forEach(video => {
    video.addEventListener('error', function() {
        console.warn('Erro ao carregar vídeo. Certifique-se de adicionar os arquivos de vídeo na pasta video/');
    });
});

// Animação de contagem para números (se houver estatísticas)
function animateNumber(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Log de interações (para fins de demonstração)
console.log('%c☕ Bem-vindo ao Site Café & Cultura!', 'color: #6B4423; font-size: 20px; font-weight: bold;');
console.log('%cSite desenvolvido com HTML, CSS e JavaScript puro', 'color: #FFD700; font-size: 14px;');
console.log('%cTodas as funcionalidades interativas foram implementadas sem frameworks externos', 'color: #666; font-size: 12px;');
