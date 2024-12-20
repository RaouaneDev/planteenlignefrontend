// Liste des produits
const products = [
    {
        id: 1,
        name: "Monstera Deliciosa",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=300",
        description: "Plante d'intérieur tropicale aux grandes feuilles"
    },
    {
        id: 2,
        name: "Ficus Lyrata",
        price: 34.99,
        image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=300",
        description: "Ficus décoratif avec de grandes feuilles en forme de violon"
    },
    {
        id: 3,
        name: "Strelitzia Nicolai",
        price: 39.99,
        image: "https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?auto=format&fit=crop&w=300",
        description: "Oiseau du paradis géant avec de spectaculaires feuilles"
    }
];

// Panier
let cart = [];

// Afficher les produits
function displayProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;

    container.innerHTML = products.map(product => {
        return `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text"><strong>${product.price.toFixed(2)} €</strong></p>
                        <button onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})" class="btn btn-success w-100">
                            Ajouter au panier
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Fonction pour ajouter au panier
function addToCart(product) {
    // Vérifier si le produit est déjà dans le panier
    const existingProduct = cart.find(item => item.id === product.id);
    
    if (existingProduct) {
        // Si le produit existe, augmenter la quantité
        existingProduct.quantity = (existingProduct.quantity || 0) + 1;
    } else {
        // Si le produit n'existe pas, l'ajouter avec une quantité de 1
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    showNotification('Produit ajouté au panier');
}

// Mettre à jour l'affichage du panier
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const floatingCartCount = document.getElementById('floatingCartCount');
    const floatingCartItems = document.getElementById('floatingCartItems');
    const floatingCartTotal = document.getElementById('floatingCartTotal');

    // Mettre à jour le compteur
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    floatingCartCount.textContent = cartCount.textContent;

    // Calculer le total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Mettre à jour les items dans le modal
    cartItems.innerHTML = cart.map((item, index) => `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <div>
                <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
                ${item.name} (${item.quantity}x)
            </div>
            <div>
                <span class="me-3">${(item.price * item.quantity).toFixed(2)}€</span>
                <button class="btn btn-outline-danger btn-sm" onclick="removeFromCart(${index})">×</button>
            </div>
        </div>
    `).join('');

    // Mettre à jour les items dans le panier flottant
    floatingCartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="d-flex align-items-center">
                <img src="${item.image}" alt="${item.name}" style="width: 30px; height: 30px; object-fit: cover; margin-right: 10px;">
                <span>${item.name} (${item.quantity}x)</span>
            </div>
            <div>
                <span class="me-2">${(item.price * item.quantity).toFixed(2)}€</span>
                <button class="btn btn-outline-danger btn-sm py-0" onclick="removeFromCart(${index})">×</button>
            </div>
        </div>
    `).join('');

    // Mettre à jour les totaux
    cartTotal.textContent = `Total: ${total.toFixed(2)}€`;
    floatingCartTotal.textContent = `Total: ${total.toFixed(2)}€`;
}

// Supprimer du panier
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
    showNotification('Produit retiré du panier');
}

// Afficher une notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'alert alert-success position-fixed top-0 end-0 m-3';
    notification.style.zIndex = '1000';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Gérer le paiement
async function handlePayment() {
    console.log('=== DÉBUT DU PROCESSUS DE PAIEMENT ===');
    console.log('Contenu du panier:', cart);
    
    try {
        // Préparer les items pour Stripe
        const items = cart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
        }));
        
        console.log('Items préparés pour Stripe:', items);

        // URL du backend
        const BACKEND_URL = 'https://planteligne.onrender.com';

        // Créer la session de paiement
        console.log('Envoi de la requête au serveur...');
        try {
            const response = await fetch(`${BACKEND_URL}/api/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ items })
            });

            console.log('Réponse reçue du serveur');
            console.log('Status:', response.status);
            console.log('Headers:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erreur de réponse du serveur:', errorText);
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();
            console.log('Données reçues du serveur:', data);

            if (!data.sessionId) {
                throw new Error('ID de session non reçu du serveur');
            }

            // Rediriger vers Stripe Checkout
            console.log('Redirection vers Stripe Checkout...');
            const stripe = Stripe('pk_test_51OgnMoHyjf3wZJG1uTOUqnHHMyb0HEKodOCnifzyH06O9G4HiYTkq0WRINguLov7UDticCCG9hET57OBCHXXdCKF00bfLWLl3w');
            
            const result = await stripe.redirectToCheckout({
                sessionId: data.sessionId
            });

            if (result.error) {
                console.error('Erreur Stripe:', result.error);
                throw result.error;
            }
        } catch (error) {
            console.error('Erreur lors de la création de la session de paiement:', error);
        }
    } catch (error) {
        console.error('=== ERREUR LORS DU PAIEMENT ===');
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        showNotification('Une erreur est survenue lors du paiement. Veuillez réessayer.');
    }
}

document.getElementById('checkout-button')?.addEventListener('click', handlePayment);

// Fonction pour afficher une notification
function showNotification(message) {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Ajouter au document
    document.body.appendChild(notification);
    
    // Ajouter la classe pour l'animation d'entrée
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Ajouter des styles pour la notification
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #198754;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
        z-index: 1000;
    }
    .notification.show {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Initialiser l'affichage des produits au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    updateCartUI();
});
