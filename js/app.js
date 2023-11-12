
const carbtn = document.querySelector('#newButton');
carbtn.addEventListener("click" , recoverList);
const btn = document.querySelector('#cotizar');
btn.addEventListener("click" , construir);
const saleBtn = document.querySelector('#button-addon2');
saleBtn.addEventListener("click" , confirmSale);
let material2 = document.getElementById("valorCalculado");
let costTruehold;
let costMaterial;
let costLayer;
let costQuality;
let costshipping;
let costCountry;
let cotizacion = 0;
let totalAmount = 0;
let inputSales = [];
const listaSale = [];

viewSales();
if (storageRecover("encargue")){
    inputSales = storageRecover("encargue");
}
if (storageRecover("amount")){
    totalAmount = storageRecover("amount");
}

function construir(){
    let campoTruehold = document.getElementById("inputGroupSelect01").value;
    let material      = document.getElementById("inputGroupSelect02").value;
    let numeroCapas   = document.getElementById("inputGroupSelect03").value;
    let colorMascara  = document.getElementById("inputGroupSelect04").value;
    let cantidad      = document.getElementById("inputGroupSelect05").value;
    let grosor        = document.getElementById("inputGroupSelect06").value;
    let envio         = document.getElementById("inputGroupSelect07").value;
    let pais          = document.getElementById("inputGroupSelect08").value;    
    let largo         = document.getElementById("largo").value;
    let ancho         = document.getElementById("ancho").value;
    
    class nuevoObjeto {
        constructor(campoTruehold, material, numeroCapas, colorMascara, cantidad, grosor,
                            envio, pais,largo, ancho){
                            this.campoTruehold = campoTruehold;
                            this.material      = material;
                            this.numeroCapas   = numeroCapas;
                            this.colorMascara  = colorMascara;
                            this.cantidad      = cantidad;
                            this.grosor        = grosor;
                            this.envio         = envio;
                            this.pais          = pais;
                            this.largo         = largo;
                            this.ancho         = ancho;
                            
        }
    // Conviene ver video de flor objetos para meter aca los valores con su modificacion segun el dato recibido
    }
    const encargue = new nuevoObjeto(campoTruehold, material, numeroCapas, colorMascara, cantidad,
        grosor, envio, pais, largo, ancho);
    camposMedidas(largo, ancho, encargue);
}
//Gueardamos el objeto cotizado en local storage
function storageSave(key, listaLocal){
    const convJSON = JSON.stringify(listaLocal);
    localStorage.setItem(key, convJSON);
}
//recuperando datos del Localstorage y convirtiendolos a objet.
function storageRecover(key){
    const userLocal = JSON.parse(localStorage.getItem(key));
    return userLocal;
}
//resumimos los campos seleccionado y los guardamos en variables globales para tratamiento. tambien verifica que en todos se hayan seleccionado los campos.

function valorOption(numberOption){
    if (!(numberOption.campoTruehold == "True Hole" || numberOption.cantidad == "Cantidad" || numberOption.colorMascara == "Color de Mascara" || numberOption.envio == "Tipo de Envio" || numberOption.grosor == "Grosor de Placa" || numberOption.material == "Material" || numberOption.numeroCapas == "N° de Capas" || numberOption.pais == "Pais")){
        costTruehold = (numberOption.campoTruehold == "SI") ? 5 : 1;
        costMaterial = (numberOption.material == "FR-4") ? 5 : 3;
        if(numberOption.numeroCapas == "1"){
            costLayer = 1
            }else if(numberOption.numeroCapas == 2){
                costLayer = 3;
            }else if(numberOption.numeroCapas == 4){
                costLayer = 5;
            }else{costLayer = 6}
        if(numberOption.grosor == "1.4"){
                costQuality = 2;
            }else if(numberOption.grosor == "1.8"){
                costQuality = 4;
            }else{costQuality = 5}
        if(numberOption.envio =="Rapido"){
                costshipping = 5;
            }else if(numberOption.envio == "Normal"){
                costshipping = 3;
            }else{costshipping = 1}
        if(numberOption.pais =="Uruguay"){
                costCountry = 5;
            }else if(numberOption.pais == "Argentina"){
                costCountry = 10;
            }else{
                costCountry = 15}
            cotizacion = ((((((numberOption.ancho*numberOption.largo)*0.0005)*costMaterial))*1/*costUnit*/  + (costCountry*costshipping)));
            inputSales.push(numberOption)
            storageSave('encargue', inputSales);
            viewSales();
            totalAmount += cotizacion;
            storageSave('amount', totalAmount);
            material2.innerHTML = `<p>U$D ${cotizacion.toFixed(2)}</p>`;
        }else{
            Swal.fire({
                icon: "error",
                title: "Algo salio mal",
                text: "Faltan seleccionar campos",
              });
        }
}
//verificamos que los campos de medidas sean correctos
function camposMedidas(x, y, objLista){
     
    if (x <30 || y<30 || isNaN(x) || isNaN(y)){
        x= parseInt(x);
        y= parseInt(y);
        if(x <30 || y<30 ){
            Swal.fire({
                icon: "error",
                title: "Algo salio mal",
                text: "Las medidas debes ser mayores a 30 mm",
              });
        }else if(isNaN(x) || isNaN(y)){
            Swal.fire({
                icon: "error",
                title: "Algo salio mal",
                text: "El campo de medidas no puede estar vacio y debe ser un valor nuemerico",
              });
        }
    }else{
        valorOption(objLista);
    }
}
//funcion para mostrar las compras guardadas en local
function recoverList (){
    if(inputSales){
        const saleList2 = document.getElementById("accordionFlushExample");
        const saleList = document.getElementById("accordionFlushExample");
        saleList2.innerHTML = ``;
        inputSales.forEach(element => {
        saleList.innerHTML += `
                            <div class="accordion-item">
                            <h2 class="accordion-header">
                                <button id="nuevaCompra" class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                PCB Ancho:${element.largo} Largo: ${element.ancho} Material: ${element.material} Perforacion: ${element.campoTruehold} Tipo de Envio: ${element.envio}
                                </button>
                            </h2>
                            <div id="flush-collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                <div class="accordion-body">PCB de largo </div>
                            </div>
                            </div>
            `; 
        });
    }
}
//confirmacion de compra ingresando email y verificandolo mediante una API con libreria switalert.
let titleSwal = "Ingrse un correo para confimrar la compra"
function inputCompra(){
    Swal.fire({
        title:"Confimacion de Compra",
        input: "text",
        inputAttributes: {
        autocapitalize: "off"
        },
        showCancelButton: true,
        confirmButtonText: "SEND",
        showLoaderOnConfirm: true,
        preConfirm: async (login) => {
        try {
            const emailData = `
            https://disify.com/api/email/${login}
            `;
            const response = await fetch(emailData);
            if (!response.ok) {
            return Swal.showValidationMessage(`
                ${JSON.stringify(await response.json())}
            `);
            }
            return response.json();
        } catch (error) {
            Swal.showValidationMessage(`
            `);
        }
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result) {
            console.log(result)
           if (result.value.format == false || result.value.dns == false){
            titleSwal = "El correo ingresado no es valido\nVuelva a ingresarlo"
            Swal.fire({
                icon: "error",
                title: titleSwal,
                text: "Faltan seleccionar campos",
              });
            inputCompra()
           }else{
            Swal.fire({
                text:"Se ha enviado informacion a su casilla de correo"});
           }
        }
    });
}

function viewSales(){
    let viewSalesHtml = document.querySelector("#newButton")
    viewSalesHtml.innerHTML = `<div class="d-grid gap-2 col-4 mx-auto" id="newButton">
                                    <button id="cotizar" class="btn btn-danger" type="button">Carrito (${storageRecover("encargue").length})</button>
                                </div>`;
    recoverList();
}  

function confirmSale(){
    definitiveList = storageRecover("encargue")
    let viewSalesHtml = document.querySelector("#newButton")
    viewSalesHtml.innerHTML = `<ul class="list-group">
                                    <li class="list-group-item list-group-item-dark"><p>Confirma la compra por los ${definitiveList.length} articulos de la lista? <br> Monto total: U$D ${storageRecover('amount').toFixed(2)}</p></li>
                                    <button class="btn btn-outline-secondary btn-warning letraComprar" type="button" id="confirmSale">Confirmar</button> 
                                    <button class="btn btn-outline-secondary btn-danger letraComprar" type="button" id="cancelSale">Cancelar</button> 
                                </ul>`;    
    recoverList();
    const emailConfirmSale = document.querySelector('#confirmSale');
    emailConfirmSale.addEventListener("click", inputCompra);
    const cancelSale = document.querySelector('#cancelSale');
    cancelSale.addEventListener("click", viewSales);
}
