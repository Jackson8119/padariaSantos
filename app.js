const products = [
    { 
        id: 1, 
        name: 'Pão Francês', 
        price: 0.50, 
        category: 'comidas', 
        image: 'https://cdn.2rscms.com.br/imgcache/5054/uploads/5054/layout/Linha%20Gold%20Paes/pao-frances-12h-gg.png.webp' 
    },
    { 
        id: 2, 
        name: 'Bolo Caseiro', 
        price: 12.00, 
        category: 'comidas', 
        image: 'https://receitatodahora.com.br/wp-content/uploads/2022/06/bolo-caseiro.jpg.webp' 
    },
    { 
        id: 3, 
        name: 'Coca Cola 350ml', 
        price: 6.00, 
        category: 'bebidas', 
        image: 'https://hortifrutibr.vtexassets.com/arquivos/ids/173841/Refrigerante-Coca-Cola-Lata-350ml-gelada.jpg.jpg?v=638931057551370000' 
    },
    { 
        id: 4, 
        name: 'Suco de Laranja 120ml', 
        price: 3.50, 
        category: 'bebidas', 
        image: 'https://cdn.iset.io/assets/00946/produtos/627/alimentosemporcoessuco-de-laranja-c6717.jpg' 
    }
];

let cart = JSON.parse(localStorage.getItem('devMenuCart')) || [];

const dom = {
    grid: document.getElementById('productsGrid'),
    sidebar: document.getElementById('cartSidebar'),
    toggle: document.getElementById('cartToggle'),
    close: document.getElementById('closeCart'),
    cartItems: document.getElementById('cartItems'),
    cartTotal: document.getElementById('cartTotal'),
    cartCount: document.getElementById('cartCount'),
    checkoutBtn: document.querySelector('.checkout-btn'),
    categoryBtns: document.querySelectorAll('.category-btn')
};

let currentCategory = 'all';

function renderProducts() {
    const filteredProducts = currentCategory === 'all' 
        ? products 
        : products.filter(product => product.category === currentCategory);

    dom.grid.innerHTML = filteredProducts.map(product => `
        <article class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-price">R$ ${product.price.toFixed(2)}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    Adicionar
                </button>
            </div>
        </article>
    `).join('');
}

dom.categoryBtns.forEach(button => {
    button.addEventListener('click', (e) => {
        // Remove a classe ativa de todos os botões
        dom.categoryBtns.forEach(btn => btn.classList.remove('active'));
        
        // Adiciona a classe ativa no botão clicado
        e.target.classList.add('active');
        
        // Atualiza a categoria atual e renderiza a tela novamente
        currentCategory = e.target.dataset.category;
        renderProducts();
    });
});

function addToCart(id) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const product = products.find(p => p.id === id);
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
}

function updateCart() {
    localStorage.setItem('devMenuCart', JSON.stringify(cart));
    renderCartItems();
    calculateTotal();
}

function renderCartItems() {
    dom.cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <small>R$ ${item.price.toFixed(2)} &times; ${item.quantity}</small>
            </div>
            <div class="cart-item-actions">
                <span class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2)}</span>
                <button class="remove-btn" onclick="removeFromCart(${item.id})" title="Remover unidade">
                    &times;
                </button>
            </div>
        </div>
    `).join('');
}


function removeFromCart(id) {
    const existingItem = cart.find(item => item.id === id);

    if (!existingItem) return;

    if (existingItem.quantity > 1) {
        existingItem.quantity -= 1;
    } else {
        cart = cart.filter(item => item.id !== id);
    }

    updateCart();
}

function calculateTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    dom.cartTotal.innerText = `R$ ${total.toFixed(2)}`;
    dom.cartCount.innerText = count;
    dom.checkoutBtn.disabled = cart.length === 0;
}

dom.toggle.addEventListener('click', () => dom.sidebar.classList.add('open'));
dom.close.addEventListener('click', () => dom.sidebar.classList.remove('open'));

renderProducts();

function sendOrderToWhatsApp() {
    if (cart.length === 0) return;

    const phoneNumber = '5583993244983'; 

    const orderDetails = cart.map(item => 
        `- ${item.name} (x${item.quantity}): R$ ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const message = `*Novo Pedido Realizado!*\n\n*Itens:*\n${orderDetails}\n\n*Total:* R$ ${total.toFixed(2)}\n\n*Observações:*`;   
    const encodedMessage = encodeURIComponent(message);
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
}

dom.checkoutBtn.addEventListener('click', sendOrderToWhatsApp);

updateCart();
