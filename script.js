// ===== HERO STARS ANIMATION =====
(function () {
    const canvas = document.getElementById('star-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const stars = [];

    function createStar(randomY) {
        return {
            x: Math.random() * canvas.width,
            y: randomY !== undefined ? Math.random() * canvas.height : -10,
            size: Math.random() * 5 + 2,
            speed: Math.random() * 1.2 + 0.4,
            opacity: Math.random() * 0.6 + 0.3,
            twinkleSpeed: Math.random() * 0.018 + 0.004,
            twinkleDir: Math.random() < 0.5 ? 1 : -1,
            drift: (Math.random() - 0.5) * 0.3
        };
    }

    for (let i = 0; i < 100; i++) stars.push(createStar(true));

    function drawStar(star) {
        ctx.save();
        ctx.globalAlpha = star.opacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = '#e0b45c';
        ctx.fill();
        if (star.size > 2) {
            ctx.strokeStyle = 'rgba(255, 220, 140, 0.7)';
            ctx.lineWidth = 0.6;
            const arm = star.size * 3;
            ctx.beginPath();
            ctx.moveTo(star.x - arm, star.y);
            ctx.lineTo(star.x + arm, star.y);
            ctx.moveTo(star.x, star.y - arm);
            ctx.lineTo(star.x, star.y + arm);
            ctx.stroke();
        }
        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (stars.length < 140 && Math.random() < 0.4) stars.push(createStar());
        for (let i = stars.length - 1; i >= 0; i--) {
            const star = stars[i];
            star.y += star.speed;
            star.x += star.drift;
            star.opacity += star.twinkleSpeed * star.twinkleDir;
            if (star.opacity >= 0.95) { star.opacity = 0.95; star.twinkleDir = -1; }
            if (star.opacity <= 0.1)  { star.opacity = 0.1;  star.twinkleDir = 1; }
            if (star.y > canvas.height + 10) { stars.splice(i, 1); }
            else { drawStar(star); }
        }
        requestAnimationFrame(animate);
    }
    animate();
})();

// ===== CART SYSTEM =====
let cart = [];

function addToCart(name, price, btn) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ name, price, qty: 1 });
    }

    // Button feedback
    if (btn) {
        btn.textContent = '✔ Added!';
        btn.classList.add('added');
        setTimeout(() => {
            btn.textContent = '+ Add to Cart';
            btn.classList.remove('added');
        }, 1200);
    }

    updateCartUI();
    updateBadge();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
    updateBadge();
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    updateCartUI();
    updateBadge();
}

function clearCart() {
    cart = [];
    updateCartUI();
    updateBadge();
}

function updateBadge() {
    const badge = document.getElementById('cartBadge');
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    badge.textContent = total;
    badge.classList.remove('pop');
    void badge.offsetWidth; // reflow to restart animation
    badge.classList.add('pop');
}

function updateCartUI() {
    const cartItemsEl = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotalEl = document.getElementById('cartTotal');

    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p class="cart-empty">Your cart is empty 🍽️</p>';
        cartFooter.style.display = 'none';
        return;
    }

    cartFooter.style.display = 'block';

    let html = '';
    let total = 0;

    cart.forEach((item, i) => {
        total += item.price * item.qty;
        html += `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">PKR ${(item.price * item.qty).toLocaleString()}</div>
            </div>
            <div class="cart-item-controls">
                <button class="cart-qty-btn" onclick="changeQty(${i}, -1)">−</button>
                <span class="cart-qty">${item.qty}</span>
                <button class="cart-qty-btn" onclick="changeQty(${i}, 1)">+</button>
                <button class="cart-remove-btn" onclick="removeFromCart(${i})">✕</button>
            </div>
        </div>`;
    });

    cartItemsEl.innerHTML = html;
    cartTotalEl.textContent = 'PKR ' + total.toLocaleString();
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
}

function checkoutCart() {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    alert(`✅ Order placed successfully!\nTotal: PKR ${total.toLocaleString()}\n\nWe will contact you shortly for delivery!`);
    clearCart();
    toggleCart();
}

// ===== FULL MENU SECTION - EXPLORE TOGGLE =====
function toggleMenu(id) {
    const el = document.getElementById(id);
    el.classList.toggle('open');
    const btn = el.previousElementSibling;
    btn.textContent = el.classList.contains('open') ? 'CLOSE ↑' : 'EXPLORE ↓';
}

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
    });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || this.id === 'openBookModal' || this.id === 'ctaBookBtn') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 10;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});

// ===== BOOKING MODAL =====
const bookingModal = document.getElementById('bookingModal');
const openBookModal = document.getElementById('openBookModal');
const closeBookModal = document.getElementById('closeBookModal');
const ctaBookBtn = document.getElementById('ctaBookBtn');
const confirmBooking = document.getElementById('confirmBooking');

function openModal() {
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeModal() {
    bookingModal.classList.remove('active');
    document.body.style.overflow = '';
}

openBookModal.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
ctaBookBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
closeBookModal.addEventListener('click', closeModal);

bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

confirmBooking.addEventListener('click', () => {
    alert('✅ Reservation confirmed! We will contact you shortly.');
    closeModal();
});