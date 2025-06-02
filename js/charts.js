document.addEventListener('DOMContentLoaded', function() {
    const produtosData = JSON.parse(localStorage.getItem('produtos')) || [];
    const categoriasData = JSON.parse(localStorage.getItem('categorias')) || [];

    const categoriasAtivas = categoriasData.filter(cat => !cat.includes("(Excluido)"));

    if (produtosData.length > 0) {
        criarGraficoCategorias(produtosData, categoriasAtivas);
    }

    if (produtosData.length > 0) {
        criarGraficoStatus(produtosData);
    }

    if (produtosData.length > 0) {
        criarGraficoValores(produtosData);
    }

    if (produtosData.length > 0) {
        criarGraficoFabricantes(produtosData);
    }
});

function criarGraficoCategorias(produtos, categorias) {
    const ctx = document.getElementById('grafico1').getContext('2d');
    
    const contagem = {};
    categorias.forEach(cat => {
        contagem[cat] = produtos.filter(p => p.cat === cat).length;
    });

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categorias,
            datasets: [{
                data: categorias.map(cat => contagem[cat]),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
                    '#9966FF', '#FF9F40', '#8AC24A', '#607D8B'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Máquinas por Categoria',
                    font: { size: 16 }
                },
                legend: { position: 'bottom' }
            }
        }
    });
}

function criarGraficoStatus(produtos) {
    const ctx = document.getElementById('grafico2').getContext('2d');
    
    const ativos = produtos.filter(p => p.status === 'Ativo').length;
    const inativos = produtos.filter(p => p.status === 'Inativo').length;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Ativas', 'Inativas'],
            datasets: [{
                label: 'Status das Máquinas',
                data: [ativos, inativos],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 99, 132, 0.7)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Status das Máquinas',
                    font: { size: 16 }
                }
            }
        }
    });
}

function criarGraficoValores(produtos) {
    const ctx = document.getElementById('grafico3').getContext('2d');
    
    const topProdutos = [...produtos]
        .sort((a, b) => parseFloat(b.prc) - parseFloat(a.prc))
        .slice(0, 5);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: topProdutos.map(p => p.nm),
            datasets: [{
                label: 'Valor (R$)',
                data: topProdutos.map(p => parseFloat(p.prc)),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: false }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Top 5 Máquinas (Valor)',
                    font: { size: 16 }
                }
            }
        }
    });
}

function criarGraficoFabricantes(produtos) {
    const ctx = document.getElementById('grafico4').getContext('2d');
    
    const fabricantes = {};
    produtos.forEach(p => {
        fabricantes[p.fabricantev] = (fabricantes[p.fabricantev] || 0) + 1;
    });

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(fabricantes),
            datasets: [{
                data: Object.values(fabricantes),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
                    '#9966FF', '#FF9F40', '#8AC24A', '#607D8B'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Distribuição por Fabricante',
                    font: { size: 16 }
                },
                legend: { position: 'bottom' }
            }
        }
    });
}
