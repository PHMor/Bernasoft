//Código JS para gerar inventário dos produtos

class produto {  //Construção da classe dos produtos
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

const msgerro = document.getElementById('erromsg')

const prodsdados = localStorage.getItem('produtos');
let produtos = [];

if (prodsdados) { //Pega os dados do localstorage e reconstrói.
  const arrayBruto = JSON.parse(prodsdados);
  produtos = arrayBruto.map(obj => new produto(obj.img, obj.nm, obj.prc,obj.cat, obj.fabricantev, obj.descricaov, obj.modelo, obj.status, obj.excluido));
}

console.log(produtos)
const selecionarprod = document.getElementById('maquinasel')
produtos.forEach(maquina => {
    console.log(maquina.status) //Se a maquina estiver inativa ela nao aparece como opção para inventariar.
    if(maquina.status == 'Inativo'){

    }else{
    const maqopcao = document.createElement('option'); //Se for uma maquina valida adiciona como opção de inventario
            maqopcao.value = maquina.nm;
            maqopcao.textContent = maquina.nm;
            selecionarprod.appendChild(maqopcao);
        }
});

const inputdata = document.getElementById('datainv')
const inputmaq = document.getElementById('maquinasel')
const inputqnt = document.getElementById('qntmaquinas')

inputqnt.addEventListener('input', function(){
    inputqnt.value = inputqnt.value.replace(".","")
    inputqnt.value = inputqnt.value.replace(",","")
})

const btnenviarinv = document.getElementById('enviarinv')

let inventarios = {} //Lista de inventarios criados
if(localStorage.getItem('inventarios')){ //Se ja existir algum inventario no localstorage ele pega os dados.
    inventarios = JSON.parse(localStorage.getItem('inventarios'))
    console.log(inventarios)
}

//Funcao de coletar os dados e salvar
btnenviarinv.addEventListener('click', function() {
    let vdata = inputdata.value;
    let vmaq = inputmaq.value;
    let vqnt = inputqnt.value;
    if(vdata == "" || vmaq == "" || vqnt == ""){ //valida se todos os dados estão devidamente preenchidos
        msgerro.innerText = 'É preciso preencher todos os campos para enviar!'
        msgerro.style.display = 'block'
    }
    else {
    inventarios[vdata] = {'nome': vmaq, 'qnt':vqnt} //o Objeto de invetario é definido a partir da sua data, por exemplo "01/06/2025 = {nome: Jungle Story, qnt: 5}". Assim é possivel fazer um relatório com esses dados.
    console.log(inventarios)
    localStorage.setItem('inventarios',JSON.stringify(inventarios)) //Salva a lista de inventarios atualizada

    //reseta os valores dos inputs
    inputmaq.value = '';
    inputdata.value = '';
    inputqnt.value = '';
    msgerro.innerText = 'Inventário registrado com sucesso!'
    msgerro.style.color = 'royalblue'
    msgerro.style.display = 'block'
    setTimeout(() => { //Usa programação assincrona para fazer a mensagem de erro/sucesso sumir após 5 segundos
        msgerro.style.display = 'none'
        msgerro.innerText = 'É preciso preencher todos os campos para enviar!'
        msgerro.style.color = 'red'
    }, 5000);
    }
});


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

