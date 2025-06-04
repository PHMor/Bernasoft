class produto { //Construção da classe dos produtos
    constructor(img,nm,prc,cat,fabricantev,descricaov,modelo,status,excluido) {
        this.img = img;
        this.nm = nm;
        this.prc = prc;
        this.cat = cat;
        this.fabricantev = fabricantev;
        this.descricaov = descricaov;
        this.modelo = modelo;
        this.status = status;
        this.excluido = excluido;
    }
}

//Parte do codigo que pega os dados que estão salvos no localstorage.
const prodsdados = localStorage.getItem('produtos');
const catdados = localStorage.getItem('categorias');
let produtos = [];
let categorias = [];

if (prodsdados) {
  const arrayBruto = JSON.parse(prodsdados);
  produtos = arrayBruto.map(obj => new produto(obj.img, obj.nm, obj.prc,obj.cat, obj.fabricantev, obj.descricaov, obj.modelo, obj.status, obj.excluido));
}

if (catdados){
    categorias = JSON.parse(catdados);
    
}
//Area dedicada a captura dos elementos do html partir do id.
let img = null;
const btnexlcuirent = document.getElementById("excluir")
const input = document.getElementById('imageInput');
const botaoimg = document.getElementById('imglabel');
const preview = document.getElementById('preview');
const fechar = document.getElementById('fechar');
const prodnovo = document.getElementById('backgroundbox');
const btnnovoprod = document.getElementById('novoprod');
const numerodemaquinas = document.getElementById("numerodemaquinas");
const btncategorias = document.getElementById("categoriasbtn");
const categoriasbox = document.getElementById("categoriasbox");
const Nomecat = document.getElementById("Nomecat");
const msgmodelo = document.getElementById("msgmodelo")
const nome = document.getElementById('nome')
const preco = document.getElementById('preco')
const fabricante = document.getElementById('fabricante')
const descricao = document.getElementById('descricao')
const categoriaprod = document.getElementById('categoria')
const enviar = document.getElementById('enviar')
const modeloobj = document.getElementById('modelo')

input.addEventListener('change', function () { //Função responsável por capturar a imagem do produto e transformar ela em base64, sendo possivel salva-la no localstorage.
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (teste) {
        const base64 = teste.target.result;
        preview.src = base64;
        preview.style.display = 'block';
        botaoimg.textContent = 'Trocar imagem';
        img = base64;
  };
});


//Função que verifica o clique do botão de envir um novo prduto
enviar.addEventListener('click', function() {
    if (!validar()) { //Ele valida se todos os dados estão preenchidos e só prossegue se for verdadeiro.
        return; 
    }
    const modelov = modeloobj.value //Aqui caaptura os valores dos inputs
    const cat = categoriaprod.value
    const nomev = nome.value
    const fabricantev = fabricante.value
    const descricaov = descricao.value
    const precov = preco.value
    let statusv = "";


    if(btnstatus.classList.contains('statusativo')){ //Verifica o botão de ativar ou desativar um produto e da um valor para salvar.
        statusv = 'Ativo'
    } else {
        statusv = 'Inativo'}
    if(editarmaq !== null){ //Se algum dos três pontos for clicado ele aplica um valor a variavel "editarmaq", se ela possuir um valor entra em modo de edição e apenas substitui dados que já existem no localstorage.
        produtos[Number(editarmaq)-1].nm = nomev
        produtos[Number(editarmaq)-1].prc = precov
        produtos[Number(editarmaq)-1].cat = cat
        produtos[Number(editarmaq)-1].fabricantev = fabricantev
        produtos[Number(editarmaq)-1].modelo = modelov
        produtos[Number(editarmaq)-1].descricaov = descricaov
        produtos[Number(editarmaq)-1].img = img
        produtos[Number(editarmaq)-1].status = statusv
        prodnovo.classList.remove("ativo");
        editarmaq = null;
    } else { 
        if(img == null){ //No momento de criar maquina, se nenhuma imagem for definida ele aplica uma generica.
            img = "maquinagenerica.png"
        }
    const prod = new produto(img,nomev,precov,cat,fabricantev,descricaov,modelov,statusv,false) //Criacao do objeto com os dados coletados
    produtos.push(prod)} //Coloca o objeto na lista de produtos
    localStorage.setItem('produtos', JSON.stringify(produtos)); //Salva a lista atualizada
    nome.value = "";preco.value = "";fabricante.value = "";descricao.value = "";categoriaprod.value = "";modeloobj.value = "";input.value ="";preview.src = "";img = null; //Redefine os valores dos inputs para o proximo cadastro.
    btnstatus.className = "statusativo"
    btnstatus.textContent = "Ativo"
    AtualizarProds(); //Atualista a tabela de produtos para o produto novo aparecer.
    console.log(produtos)
    botoeseditar() //Replica a funcao listener nos botoes de editar.
})

console.log(produtos) //Testes


//Função de fechar o menu de criação de produto
fechar.addEventListener('click', function(){
    //Redefine todos os valores
    prodnovo.classList.remove("ativo");
    editarmaq = null;
    nome.value = "";preco.value = "";fabricante.value = "";descricao.value = "";categoriaprod.value = "";modeloobj.value = "";input.value ="";preview.src = "";img = null;
    document.querySelectorAll('.invalido').forEach(input => input.classList.remove('invalido'));
    document.querySelectorAll('.mensagem-erro').forEach(msg => {
        msg.textContent = '';
        msg.classList.remove('visivel');
    });
    btnstatus.className = "statusativo"
    btnstatus.textContent = "Ativo"
    btnexlcuirent.style.display = "none";
    btnexlcuirent.textContent = "Excluir"
    cliques = 0;
})


//Quando o botão de criar novo produto a tela de criação recebe uma classe visivel
btnnovoprod.addEventListener('click', function(){
    prodnovo.classList.add("ativo");
    msgmodelo.textContent = "Crie modelo novo"
})

//Quando o botão de criar nova categoria a tela de criação recebe uma classe visivel
btncategorias.addEventListener('click', function(){
    categoriasbox.classList.add("ativo");
})

//Funcao para fechar a tela de categoris.
const fechar2 = document.getElementById("fechar2")

fechar2.addEventListener('click', function(){
    categoriasbox.classList.remove("ativo");
})

const entidades = document.getElementById('entidades');

function AtualizarProds() { //Função que constroi a tabela de produtos com os dados do localstorage
    let qntprods = produtos.length;
    entidades.innerHTML = "";
while(qntprods > 0) {
    if(produtos[qntprods-1].excluido == true){ //Se o produto tiver o status de exlcuido como true ele não é listado.
        console.log("bernardo")
        qntprods -= 1;
    }else{
    const caixaproduto = document.createElement("tr");
    caixaproduto.id = qntprods
    caixaproduto.innerHTML = `  <td><img src="${produtos[qntprods-1].img}" alt="">${produtos[qntprods-1].nm}</td>
                                <td class="categoria">${produtos[qntprods-1].modelo}</td>
                                <td>${produtos[qntprods-1].fabricantev}</td>
                                <td>${produtos[qntprods-1].cat}</td>
                                <td>${produtos[qntprods-1].prc}</td>
                                <td><span class="status">${produtos[qntprods-1].status}</span></td>
                                <td class="tresponto">⋮</td>`

    const trespontoscoluna = caixaproduto.querySelector('.status');

    //Define a classe dependendo se o produto estiver ativo ou inativo para a bolinha ficar vermelha.
            if (produtos[qntprods-1].status === 'Inativo') {
                trespontoscoluna.classList.add('inativo');
                console.log("bisteca")
            } else {
                trespontoscoluna.classList.remove('inativo');
            }

    entidades.appendChild(caixaproduto)
    qntprods -= 1;
    let maquinasVal = produtos.filter(produto => produto.excluido === false); //Conta quantas maquinas existem que nao estao excluidas
    numerodemaquinas.innerText = `${maquinasVal.length}` //Atualiza o contador de produtos
    }
}
}

let maquinasVal = produtos.filter(produto => produto.excluido === false);
if(maquinasVal.length > 0){
    AtualizarProds();
}
else {
    numerodemaquinas.innerText = `0` //Se nao tiver nenhuma maquina criada ou que nao estiver excluida ele define o contador pra 0
}

//Funcao que ajusta o input de valor, para nao ocorrer erros ele aceita apenas texto e um ponto, alem de transformar a virgula em .
preco.addEventListener("input", function () {
  let valor = this.value;
  valor = valor.replace(",", ".");
  valor = valor.replace(/[^0-9.]/g, "");
  const partes = valor.split('.');
  if (partes.length > 2) { //Se for detectada mais que uma virugla, o texto original é dividido e juntado com um ponto
    valor = partes[0] + "." + partes.slice(1).join("");
  }
  this.value = valor; //Atualiza o input
});

const tabelacat = document.getElementById("tabcategorias")
const btnsalvarcat = document.getElementById("salvarcat")
const msgerro = document.getElementById("msgerro")
let IdEdicaocat = null; //Funciona semelhante a edição de produto, onde a variavel por padrao é nula. Quando ela é alterada para o valor do id do produto o cadastro entra em modo de edição.


//Botao de finalizar a criacao de categoria
btnsalvarcat.addEventListener('click',function(){
    if(Nomecat.value === ""){ //Valida se um nome foi colocado
        msgerro.innerText = "É necessário preencher um nome"
    } else {
    msgerro.innerText = ""
    if(IdEdicaocat !== null){ //Modo de edição, ele substitui os dados ao inves de adicionar novos.
        categorias[IdEdicaocat - 1] = Nomecat.value;
        IdEdicaocat = null;
        btnsalvarcat.textContent = "Salvar";
        localStorage.setItem('categorias', JSON.stringify(categorias));
        Nomecat.value = "";
        Atualizarcat(); //Recarrega a tabela de categorias
    }
    else {
    categorias.push(Nomecat.value); //Quando uma classe nova é criada ele adiciona ela na lista de classes.
    Nomecat.value = "";
    localStorage.setItem('categorias', JSON.stringify(categorias)); //Salva no localstorage a lista de classes atualizadas.
    Atualizarcat(); //Recarrega a tabela de categorias
    }}
})

const selecionarcat = document.getElementById('categoria');
function Atualizarcat() { //Função que constroi a tabela de categorias com os dados do localstorage
    tabelacat.innerHTML = "";
    for (let i = categorias.length; i > 0; i--) {
        if(categorias[i-1].includes("(Excluido)")){//Não coloca as categorias excluidas
        }
        else {
        const novacat = document.createElement("tr");
        novacat.id = `${i}`;
        novacat.className = "categoriarow";
        novacat.innerHTML = `<td>${categorias[i - 1]}</td>
                             <td><i class="fa-solid fa-pen-to-square"></i></td>
                             <td><i class="fa-solid fa-trash"></i></td>`;
        const iconeEditar = novacat.querySelector('.fa-pen-to-square');
        const iconeExcluir = novacat.querySelector('.fa-trash'); //Pega todos os icones de lixo, que sao os botoes de exlcuir
        iconeEditar.addEventListener('click', () => { //Adiciona um listener para o botao de editar a categoria.
            Nomecat.value = `${categorias[novacat.id-1]}`
            IdEdicaocat = novacat.id;
            btnsalvarcat.textContent = "Atualizar"
        });
        

        iconeExcluir.addEventListener('click', () => { //Se clicar no icone de lixeira a categoria é exluida.
            categorias[novacat.id-1] = `${categorias[novacat.id-1]}(Excluido)`
            localStorage.setItem('categorias', JSON.stringify(categorias));
            Nomecat.value = "";
            Atualizarcat();//Recarrega a tabela de categorias
        });
        
        tabelacat.appendChild(novacat);

            selecionarcat.innerHTML = `<option value="" disabled selected>Selecione uma categoria*</option>`;
            categorias.forEach(categoria => {
            if(categoria.includes("(Excluido)")){
                }
            else {
            const catopcao = document.createElement('option'); //Atualiza o input de escolher categoria do produto com cada categoria da lista.
            catopcao.value = categoria;
            catopcao.textContent = categoria;
            selecionarcat.appendChild(catopcao);}
});
    }
    }
}

Atualizarcat(); //Recarrega a tabela de categorias

const editarprod = document.querySelectorAll('.tresponto');
let editarmaq = null; //Edição de produto, onde a variavel por padrao é nula. Quando ela é alterada para o valor do id do produto o cadastro entra em modo de edição.

function botoeseditar(){ //Funcao do botao de editar
    entidades.addEventListener('click', function(event) {
    const botaoClicado = event.target.closest('.tresponto'); 
    if (!botaoClicado) {
        return;
    }
    const linhaDoProduto = botaoClicado.closest('tr');
    editarmaq = linhaDoProduto.id; //Verifica qual o id da linha que foi clicada.
    prodnovo.classList.add("ativo");

    //Define os valores dos inputs com os valores atuais do produto
    nome.value = produtos[editarmaq - 1].nm;
    msgmodelo.textContent = `Editando ${produtos[editarmaq - 1].nm}`;
    preco.value = produtos[editarmaq - 1].prc;
    fabricante.value = produtos[editarmaq - 1].fabricantev;
    descricao.value = produtos[editarmaq - 1].descricaov;
    categoriaprod.value = produtos[editarmaq - 1].cat;
    modeloobj.value = produtos[editarmaq - 1].modelo;
    img = produtos[Number(editarmaq)-1].img
    preview.src = produtos[Number(editarmaq)-1].img
    btnexlcuirent.style.display = "block";
    preview.style.display = 'block';

    //Atualiza o botao de status com o status atual do produto
    if(produtos[Number(editarmaq)-1].status == "Inativo"){
        console.log("pao com banana")
        btnstatus.className = "statusinativo"
        btnstatus.textContent = "Inativo"
    }
    else if(produtos[Number(editarmaq)-1].status == "Ativo"){
        btnstatus.className = "statusativo"
        btnstatus.textContent = "Ativo"
    }
});
}

let cliques = 0; //Variavel que permite a confirmação na hora de exlcuir um produto, é preciso clicar duas vezes.
btnexlcuirent.addEventListener('click' ,function(){ //Função que verifica o botao de excluir produto.
    cliques +=1;
    btnexlcuirent.textContent = "Confirmar"
    if(cliques == 2){
    produtos[Number(editarmaq)-1].excluido = true;
    localStorage.setItem('produtos', JSON.stringify(produtos));
    AtualizarProds() //Atualiza a lista assim que o produto for excluido
    cliques = 0;

    prodnovo.classList.remove("ativo");//Fecha o menu de edição
    //Redefine todos os inputs para a proxima edição/criação
    editarmaq = null; 
    nome.value = "";preco.value = "";fabricante.value = "";descricao.value = "";categoriaprod.value = "";modeloobj.value = "";input.value ="";preview.src = "";img = null;
    document.querySelectorAll('.invalido').forEach(input => input.classList.remove('invalido'));
    document.querySelectorAll('.mensagem-erro').forEach(msg => {
        msg.textContent = '';
        msg.classList.remove('visivel');
    });
    btnstatus.className = "statusativo"
    btnstatus.textContent = "Ativo"
    btnexlcuirent.style.display = "none";
    btnexlcuirent.textContent = "Excluir"

    }
})

botoeseditar()

function validar() { //Função que valida se todos os dados estão preenchidos
    let formulario = true;
    document.querySelectorAll('.invalido').forEach(input => input.classList.remove('invalido'));
    document.querySelectorAll('.mensagem-erro').forEach(msg => {
        msg.textContent = '';
        msg.classList.remove('visivel');
    });
    const campos = [
        { input: nome, mensagem: 'O campo Nome é obrigatório.' },
        { input: preco, mensagem: 'O campo Custo é obrigatório.' },
        { input: fabricante, mensagem: 'O campo Fabricante é obrigatório.' },
        { input: categoriaprod, mensagem: 'O campo Categoria é obrigatório.' },
        { input: modeloobj, mensagem: 'O campo Modelo é obrigatório.' }
    ];
    campos.forEach(campo => {
        if (campo.input.value.trim() === '') {
            formulario = false; //Se qualquer campo estiver vazio o formulario vai retornar como false e solicitar o preenchimento do campo que nao esta preenchido corretamente.
            campo.input.classList.add('invalido');
            const erro = campo.input.nextElementSibling; //O proximo elemento do campo no html é sempre uma div responsável por ser a msg de erro
            if (erro.classList.contains('mensagem-erro')) { //Verifica se realmente é a div citada acima.
                erro.textContent = campo.mensagem; //Apresenta a respectiva mensagem
                erro.classList.add('visivel');
            }
        }
    });
    return formulario; //Retorna se o formulario esta preenchido corretamente ou não.
}


//Funcao que faz o botao de status trocar o seu estilo quando clicado
const btnstatus = document.getElementById("statusbtn")
btnstatus.addEventListener('click', function(){
    if(btnstatus.classList.contains('statusativo')){
        btnstatus.className = "statusinativo"
        btnstatus.textContent = "Inativo"
    }
    else if(btnstatus.classList.contains('statusinativo')){
        btnstatus.className = "statusativo"
        btnstatus.textContent = "Ativo"
    }
})

console.log(categorias,produtos)


//Função do menu suspenso de "Como usar"
const btninfo = document.getElementById('infobtn1')
const infobox = document.getElementById('infobox')

btninfo.addEventListener('mouseover',function(){
    console.log('bernardao')
    infobox.style.visibility = 'visible'
    infobox.style.opacity = '1'
})

btninfo.addEventListener('mouseout',function(){
    infobox.style.visibility = 'hidden'
    infobox.style.opacity = '0'
})