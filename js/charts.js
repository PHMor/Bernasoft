document.addEventListener('DOMContentLoaded', function() {

    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const categorias = JSON.parse(localStorage.getItem('categorias')) || [];

    const categoriasAtivas = categorias.filter(cat => !cat.includes("(Excluido)"));

    criarGrafico(produtos, categoriasAtivas);
});

function criarGrafico(produtos, categorias) {
    const ctx = document.getElementById('graficoPizza').getContext('2d');

    const contagem = {};
    categorias.forEach(cat => {
        contagem[cat] = produtos.filter(prod => prod.cat === cat).length;
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
                legend: { position: 'right' }
            }
        }
    });
}
