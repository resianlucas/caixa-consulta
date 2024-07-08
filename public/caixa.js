import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, child, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDJTzpoFxQ9_W0JCGPXfwFasr_vdywwePs",
    authDomain: "hub-stock-control.firebaseapp.com",
    databaseURL: "https://hub-stock-control-default-rtdb.firebaseio.com",
    projectId: "hub-stock-control",
    storageBucket: "hub-stock-control.appspot.com",
    messagingSenderId: "1006784039020",
    appId: "1:1006784039020:web:5b824b2c2f0a2deed47049",
    measurementId: "G-LDEPBP8926"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let productCounters = {};
let products = {};

document.addEventListener('DOMContentLoaded', () => {
    const eanBar = document.getElementById('ean-bar');
    const searchEanButton = document.getElementById('search-ean-button');

    searchEanButton.addEventListener('click', searchProductByEan);
    eanBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchProductByEan();
        }
    });
});

async function searchProductByEan() {
    const ean = document.getElementById('ean-bar').value.trim();
    if (!ean) return;

    try {
        const productSnapshot = await getProductByEan(ean);
        if (productSnapshot.exists()) {
            const product = productSnapshot.val();
            products[product.sku] = product; // Adiciona o produto ao objeto products
            updateProductDetails(product);
            //incrementProductCounter(product.sku);
        } else {
            alert('Produto não encontrado.');
        }
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
    } finally {
        document.getElementById('ean-bar').value = '';
    }
}

async function getProductByEan(ean) {
    const dbRef = ref(db, 'products');
    const snapshot = await get(dbRef);
    let productSnapshot = null;

    snapshot.forEach(childSnapshot => {
        if (childSnapshot.val().ean === ean) {
            productSnapshot = childSnapshot;
        }
    });

    return productSnapshot;
}

function updateProductDetails(product) {
    document.getElementById('product-image').src = product.imageUrl || 'https://i.ibb.co/9stvHsP/placeholder-sem-foto.png';
    document.getElementById('last-scanned').textContent = product.name;
    document.getElementById('quantity').textContent = `Quantidade: ${product.quantity || 0}`;
    document.getElementById('price').textContent = `Preço: ${product.price}`;
    document.getElementById('subtotal').textContent = `Preço: R$ ${product.price}`

    const scannedProducts = document.getElementById('scanned-products');
    scannedProducts.value += 
    `${product.name}: R$${product.price}\n` +
    '___________________________________________\n';
}