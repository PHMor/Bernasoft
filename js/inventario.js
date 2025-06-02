class produto {
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

const prodsdados = localStorage.getItem('produtos');
let produtos = [];

if (prodsdados) {
  const arrayBruto = JSON.parse(prodsdados);
  produtos = arrayBruto.map(obj => new produto(obj.img, obj.nm, obj.prc,obj.cat, obj.fabricantev, obj.descricaov, obj.modelo, obj.status, obj.excluido));
}

console.log(produtos)
const selecionarprod = document.getElementById('maquinasel')
produtos.forEach(maquina => {
    const maqopcao = document.createElement('option');
            maqopcao.value = maquina.nm;
            maqopcao.textContent = maquina.nm;
            selecionarprod.appendChild(maqopcao);
});

const inputdata = document.getElementById('datainv')
const inputmaq = document.getElementById('maquinasel')
const inputqnt = document.getElementById('qntmaquinas')

inputqnt.addEventListener('input', function(){
    inputqnt.value = inputqnt.value.replace(".","")
    inputqnt.value = inputqnt.value.replace(",","")
})

const btnenviarinv = document.getElementById('enviarinv')

let inventarios = {}
if(localStorage.getItem('inventarios')){
    inventarios = JSON.parse(localStorage.getItem('inventarios'))
    console.log(inventarios)
}

btnenviarinv.addEventListener('click', function() {
    let vdata = inputdata.value;
    let vmaq = inputmaq.value;
    let vqnt = inputqnt.value;
    inventarios[vdata] = {'nome': vmaq, 'qnt':vqnt}
    console.log(inventarios)
    localStorage.setItem('inventarios',JSON.stringify(inventarios))
});

