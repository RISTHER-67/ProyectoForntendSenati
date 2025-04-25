// ================
// INITIALIZATION
// ================
let cart = [];

document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    setupChatbot();
    setupLogin();
    setupFilters();
    loadCart();
});

function setupLogin() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Validación básica
            if (email && password) {
                alert('Inicio de sesión exitoso!');
                $('#loginModal').modal('hide');
            } else {
                alert('Por favor complete todos los campos');
            }
        });
    }
}

// ================
// PRODUCT LOADING
// ================
let allProducts = [];

function loadProducts() {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            allProducts = data;
            renderProducts(allProducts);
        })
        .catch(error => console.error('Error al cargar los productos:', error));
}

function renderProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    
    if (products.length === 0) {
        document.getElementById('no-results').style.display = 'block';
        return;
    }
    
    document.getElementById('no-results').style.display = 'none';
    
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'col-md-3';
        productDiv.innerHTML = `
            <div class="product">
                <div class="card h-100">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}" onclick="viewProductDetail('${product.name}')">
                    <div class="card-body">
                        <h5 class="card-title" onclick="viewProductDetail('${product.name}')" style="cursor:pointer">${product.name}</h5>
                        <p class="card-text">${product.storage}</p>
                        <p class="card-text">$${product.price}</p>
                        <button class="btn btn-success" onclick="addToCart('${product.name}')">Añadir al Carrito</button>
                    </div>
                </div>
            </div>
        `;
        productList.appendChild(productDiv);
    });
}

function viewProductDetail(productName) {
    const product = allProducts.find(p => p.name === productName);
    if (product) {
        localStorage.setItem('currentProduct', JSON.stringify(product));
        window.location.href = 'product-detail.html';
    }
}

function loadProductDetail() {
    const product = JSON.parse(localStorage.getItem('currentProduct'));
    if (product) {
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-image').src = product.image;
        document.getElementById('product-specs').textContent = `Marca: ${product.brand}\nAlmacenamiento: ${product.storage}`;
        document.getElementById('product-price').textContent = `Precio: $${product.price}`;
        document.getElementById('product-availability').textContent = 'Disponible';
    }
}

function addToCart(productName, quantity = 1) {
    const product = allProducts.find(p => p.name === productName);
    if (product) {
        const existingItem = cart.find(item => item.name === productName);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({...product, quantity});
        }
        updateCart();
        alert(`Producto ${productName} añadido al carrito`);
    }
}

function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCart();
}

function updateQuantity(productName, newQuantity) {
    const item = cart.find(item => item.name === productName);
    if (item) {
        item.quantity = Math.max(1, newQuantity);
        updateCart();
    }
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    
    cartItems.innerHTML = '';
    let total = 0;
    let itemCount = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        itemCount += item.quantity;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item d-flex justify-content-between align-items-center mb-2 p-2 border-bottom';
        itemElement.innerHTML = `
            <div>
                <h6>${item.name}</h6>
                <small>${item.storage}</small>
            </div>
            <div class="d-flex align-items-center">
                <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${item.name}', ${item.quantity - 1})">-</button>
                <span class="mx-2">${item.quantity}</span>
                <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${item.name}', ${item.quantity + 1})">+</button>
                <span class="ml-3">$${itemTotal.toFixed(2)}</span>
                <button class="btn btn-sm btn-danger ml-2" onclick="removeFromCart('${item.name}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartItems.appendChild(itemElement);
    });
    
    cartTotal.textContent = `$${total.toFixed(2)}`;
    cartCount.textContent = itemCount;
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

function setupFilters() {
    const brandFilter = document.getElementById('filter-brand');
    const priceFilter = document.getElementById('filter-price');
    const modelFilter = document.getElementById('filter-model');
    
    [brandFilter, priceFilter, modelFilter].forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
    
    modelFilter.addEventListener('keyup', applyFilters);

    // Configurar eventos para el menú de navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const brand = e.target.textContent;
            document.getElementById('filter-brand').value = brand;
            applyFilters();
        });
    });
}
function toggleForms() {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    loginForm.classList.toggle("show");
    registerForm.classList.toggle("show");

}
function applyFilters() {
    const brand = document.getElementById('filter-brand').value;
    const maxPrice = document.getElementById('filter-price').value;
    const modelQuery = document.getElementById('filter-model').value.toLowerCase();
    
    const filtered = allProducts.filter(product => {
        const matchesBrand = !brand || product.brand === brand;
        const matchesPrice = !maxPrice || product.price <= maxPrice;
        const matchesModel = !modelQuery || product.name.toLowerCase().includes(modelQuery);
        
        return matchesBrand && matchesPrice && matchesModel;
    });
    
    renderProducts(filtered);
}

// ================
// CHATBOT SYSTEM
// ================
function setupChatbot() {
    // Element references
    const chatToggle = document.getElementById('chat-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const closeChat = document.getElementById('close-chat');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendChat = document.getElementById('send-chat');

    // Event listeners
    chatToggle.addEventListener('click', toggleChat);
    closeChat.addEventListener('click', () => chatbotContainer.style.display = 'none');
    sendChat.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
    });

    // Chat functions
    function toggleChat() {
        chatbotContainer.style.display = chatbotContainer.style.display === 'none' ? 'block' : 'none';
    }

    function addMessage(sender, message) {
        const messageDiv = document.createElement('div');
        messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleSendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        addMessage('Tú', message);
        chatInput.value = '';
        
        setTimeout(() => {
            addMessage('Asistente', generateResponse(message));
        }, 1000);
    }

    function generateResponse(message) {
        const lowerMsg = message.toLowerCase();
        
        // Respuestas específicas
        if (lowerMsg.includes('hola') || lowerMsg.includes('buenos días')) {
            return "¡Hola! Bienvenido a AltaGama Store. ¿En qué puedo ayudarte hoy?";
        }
        if (lowerMsg.includes('producto') || lowerMsg.includes('modelo')) {
            return "Tenemos los últimos modelos de iPhone, Samsung y Google Pixel. ¿Te interesa alguno en particular?";
        }
        if (lowerMsg.includes('precio') || lowerMsg.includes('cuánto cuesta')) {
            return "Los precios varían según el modelo. Por ejemplo: iPhone 13 Pro desde $999, Samsung Galaxy S21 Ultra desde $1,199.";
        }
        if (lowerMsg.includes('característica') || lowerMsg.includes('especificación')) {
            return "Nuestros productos tienen las mejores características: pantallas AMOLED, cámaras profesionales, gran capacidad de almacenamiento.";
        }
        if (lowerMsg.includes('tiempo de entrega') || lowerMsg.includes('envío')) {
            return "Los envíos tardan de 2 a 5 días hábiles. Ofrecemos envío express con costo adicional.";
        }

        // Respuestas genéricas
        const genericResponses = [
            "Gracias por tu mensaje. ¿En qué más puedo ayudarte?",
            "Entendido. ¿Necesitas información sobre algún producto?",
            "Estamos aquí para ayudarte. ¿Tienes alguna pregunta específica?"
        ];
        return genericResponses[Math.floor(Math.random() * genericResponses.length)];
    }
}
const slider = document.querySelector('.slider');
    
    function activate(e) {
      const items = document.querySelectorAll('.item');
      e.target.matches('.next') && slider.append(items[0])
      e.target.matches('.prev') && slider.prepend(items[items.length-1]);
    }
    
    document.addEventListener('click',activate,false);