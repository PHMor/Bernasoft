document.addEventListener('DOMContentLoaded', function() {
    const produtosData = JSON.parse(localStorage.getItem('produtos')) || [];
    const categoriasData = JSON.parse(localStorage.getItem('categorias')) || [];
    const inventariosData = JSON.parse(localStorage.getItem('inventarios')) || {};

    const produtosAtivos = produtosData.filter(p => !p.excluido);
    const categoriasAtivas = categoriasData.filter(cat => !cat.includes("(Excluido)"));

    criarGraficoFabricantes(produtosAtivos);
    criarGraficoStatus(produtosData);
    criarGraficoCategorias(produtosAtivos, categoriasAtivas);
    criarGraficoInventario(inventariosData);
});

function criarGraficoFabricantes(produtos) {
    const ctx = document.getElementById('grafico1').getContext('2d');

    const fabricantes = {};
    produtos.forEach(p => {
        if (p.fabricantev) {
            fabricantes[p.fabricantev] = (fabricantes[p.fabricantev] || 0) + 1;
        }
    });

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(fabricantes),
            datasets: [{
                data: Object.values(fabricantes),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                    '#9966FF', '#FF9F40', '#8AC24A', '#607D8B',
                    '#795548', '#9E9E9E'
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
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw} máquina(s)`;
                        }
                    }
                }
            }
        }
    });
}

function criarGraficoStatus(produtos) {
    const ctx = document.getElementById('grafico2').getContext('2d');
    
    const ativos = produtos.filter(p => p.status === 'Ativo' && !p.excluido).length;
    const inativos = produtos.filter(p => p.status === 'Inativo' && !p.excluido).length;
    const excluidos = produtos.filter(p => p.excluido).length;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Ativas', 'Inativas', 'Excluídas'],
            datasets: [{
                label: 'Quantidade',
                data: [ativos, inativos, excluidos],
                backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Status das Máquinas',
                    font: { size: 16 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function criarGraficoCategorias(produtos, categorias) {
    const ctx = document.getElementById('grafico3').getContext('2d');

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
                    '#9966FF', '#FF9F40', '#8AC24A', '#607D8B',
                    '#795548', '#9E9E9E'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Distribuição por Categoria',
                    font: { size: 16 }
                },
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw} máquina(s)`;
                        }
                    }
                }
            }
        }
    });
}

function criarGraficoInventario(inventarios) {
    const ctx = document.getElementById('grafico4').getContext('2d');

    const { labels, datasets } = processarDadosInventarioPorModelo(inventarios);
    const cores = [
        '#9C27B0', '#3F51B5', '#009688', '#FF5722', '#607D8B',
        '#E91E63', '#2196F3', '#4CAF50', '#FFC107', '#795548'
    ];

    const chartDatasets = datasets.map((dataset, index) => ({
        label: dataset.label,
        data: dataset.data,
        borderColor: cores[index % cores.length],
        backgroundColor: 'rgba(0, 0, 0, 0)', 
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: cores[index % cores.length],
        spanGaps: true // Adicionado para conectar linhas com valores faltantes
    }));

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: chartDatasets
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Inventário Diário de Máquinas por Modelo',
                    font: { size: 16 }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw} Produto(s)`;
                        }
                    }
                },
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Quantidade'
                    },
                    ticks: {
                        stepSize: 1
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Data'
                    }
                }
            }
        }
    });
}

function processarDadosInventarioPorModelo(inventarios) {
    const labels = [];
    const datasets = [];
    const modelos = {};

    // Extrair e ordenar datas
    const datasOrdenadas = Object.keys(inventarios).sort((a, b) => new Date(a) - new Date(b));

    // Criar labels formatadas
    datasOrdenadas.forEach(dataKey => {
        const [ano, mes, dia] = dataKey.split('-');
        labels.push(`${dia}/${mes}/${ano.slice(2)}`);
    });

    // Inicializar estrutura para todos os modelos encontrados
    datasOrdenadas.forEach(dataKey => {
        const inventario = inventarios[dataKey];
        const nomeModelo = inventario.nome || 'Desconhecido';
        
        if (!modelos[nomeModelo]) {
            modelos[nomeModelo] = {
                label: nomeModelo,
                data: new Array(datasOrdenadas.length).fill(0) // Inicializa com 0 em vez de null
            };
        }
    });

    // Preencher os dados
    datasOrdenadas.forEach((dataKey, index) => {
        const inventario = inventarios[dataKey];
        const nomeModelo = inventario.nome || 'Desconhecido';
        
        modelos[nomeModelo].data[index] = parseInt(inventario.qnt) || 0;
    });

    // Converter objeto em array
    for (const nomeModelo in modelos) {
        datasets.push(modelos[nomeModelo]);
    }
    
    return { labels, datasets };
}

function formatarDataParaKey(dataDisplay) {
    const [dia, mes, ano] = dataDisplay.split('/');
    return `20${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
}