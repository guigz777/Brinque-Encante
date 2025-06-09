// main.js - Este arquivo contém o código JavaScript que adiciona interatividade ao site.

document.addEventListener('DOMContentLoaded', () => {
    // Carregar produtos dinamicamente se houver container
    const produtosLista = document.getElementById('produtos-lista');
    if (produtosLista) {
        fetch('../assets/produtos.json')
            .then(response => response.json())
            .then(produtos => {
                // Se estiver na Home (produtos-lista dentro de .featured-products), mostra só 5 aleatórios
                if (document.querySelector('.featured-products')) {
                    // Embaralha o array e pega 4
                    const produtosAleatorios = produtos
                        .sort(() => Math.random() - 0.5)
                        .slice(0, 4);
                    produtosLista.innerHTML = produtosAleatorios.map(produto => `
                        <article class="product-item">
                            <img src="../assets/${produto.imagem}" alt="${produto.nome}">
                            <div class="product-info">
                                <h3>${produto.nome}</h3>
                                <p>${produto.descricao}</p>
                                <p><strong>R$ ${produto.preco.toFixed(2)}</strong></p>
                            </div>
                            <button class="add-to-cart" data-product-id="${produto.id}">Adicionar ao Carrinho</button>
                        </article>
                    `).join('');
                } else {
                    // Em Produtos.html mostra todos
                    produtosLista.innerHTML = produtos.map(produto => `
                        <article class="product-item">
                            <img src="../assets/${produto.imagem}" alt="${produto.nome}">
                            <div class="product-info">
                                <h3>${produto.nome}</h3>
                                <p>${produto.descricao}</p>
                                <p><strong>R$ ${produto.preco.toFixed(2)}</strong></p>
                            </div>
                            <button class="add-to-cart" data-product-id="${produto.id}">Adicionar ao Carrinho</button>
                        </article>
                    `).join('');
                }
                adicionarEventosBotoes();
            });
    } else {
        adicionarEventosBotoes();
    }

    function adicionarEventosBotoes() {
        // Função para adicionar um item ao carrinho
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.dataset.productId;
                addToCart(productId);
            });
        });
    }

    function addToCart(productId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Produto adicionado ao carrinho!');
    }

    // Exemplo de manipulação de eventos para o botão de checkout
    const checkoutButton = document.getElementById('finalizar-compra');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            alert('Compra finalizada! Obrigado por comprar conosco.');
            localStorage.removeItem('cart');
            location.reload();
        });
    }

    // Exibe os itens do carrinho na página Carrinho.html
    const carrinhoDiv = document.getElementById('carrinho');
    if (carrinhoDiv) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length > 0) {
            fetch('../assets/produtos.json')
                .then(response => response.json())
                .then(produtos => {
                    // Conta a quantidade de cada produto no carrinho
                    const counts = {};
                    cart.forEach(id => {
                        counts[id] = (counts[id] || 0) + 1;
                    });

                    // Monta a lista de produtos com nome e quantidade
                    carrinhoDiv.innerHTML = `
                        <ul>
                            ${Object.entries(counts).map(([id, qtd]) => {
                                const produto = produtos.find(p => p.id == id);
                                if (produto) {
                                    return `<li>${produto.nome} ${qtd > 1 ? `(<strong>${qtd}x</strong>)` : ''} - R$ ${(produto.preco * qtd).toFixed(2)}</li>`;
                                } else {
                                    return `<li>Produto não encontrado</li>`;
                                }
                            }).join('')}
                        </ul>
                    `;
                });
        }
    }

    const limparBtn = document.getElementById('limpar-carrinho');
    if (limparBtn) {
        limparBtn.addEventListener('click', () => {
            localStorage.removeItem('cart');
            location.reload();
        });
    }
});