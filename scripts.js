
// VARIABLES GLOBALES
const body = document.body
const gridLayout = document.querySelector('.grid-layout')
const sectionToday = document.querySelector('.today-section')
const sectionYesterday = document.querySelector('.yesterday-section')
const titleCaseInput = document.getElementById('caseTitle')
const idCaseInput = document.getElementById('caseId')
const noteCaseInput = document.getElementById('caseNote')
const statusCaseInput = document.getElementById('caseStatus')
const iconClose = document.querySelector('icon-close')
const iconChange = document.querySelector('icon-change')
const iconEdit = document.querySelector('icon-edit')
const buttonCancel = document.getElementById('cancelEdit')
const buttonEdit = document.getElementById('editCase')
const buttonAdd = document.getElementById('addCase')
const dateCase = new Date().toLocaleDateString("es-AR")


let todayCasesArray = []
let yesterdayCasesArray = []


//ELIMINAR y MOVER CARD
body.addEventListener('click', function (e){
    //ELIMINAR
    if (e.target.classList.contains('icon-close')){
        let idCase = e.target.dataset.id
        let cards = document.querySelectorAll('.card')
            
        for(let i = 0; i < cards.length ; i++){
            if (idCase === cards[i].dataset.id ){
                if (cards[i].parentNode.classList.contains("today-section")){
                    removeElementFromArray(idCase, todayCasesArray)
                } else {
                    removeElementFromArray(idCase, yesterdayCasesArray)
                }
                cards[i].parentNode.removeChild(cards[i])
                break;
            }
        }
    }
    //MOVER
    if (e.target.classList.contains('icon-change')){
        let idCase = e.target.dataset.id
        let cards = document.querySelectorAll('.card')
        
                    
        for(let i = 0; i < cards.length ; i++){
            if (idCase === cards[i].dataset.id ){
                
                if (cards[i].parentNode.classList.contains("today-section")){
                    moveElementFromArray(idCase, todayCasesArray, yesterdayCasesArray)
                    sectionYesterday.appendChild(cards[i])
                    break;
                } else {
                    moveElementFromArray(idCase, yesterdayCasesArray, todayCasesArray)
                    sectionToday.appendChild(cards[i])
                    break;
                }
            }
        }
    }
    //EDIT
    if (e.target.classList.contains('icon-edit')){
        let idCase = e.target.dataset.id
        let cards = document.querySelectorAll('.card')

        for(let i = 0; i < cards.length ; i++){
            if (idCase === cards[i].dataset.id ){
                                
                if (cards[i].parentNode.classList.contains("today-section")){
                    editCase(idCase, todayCasesArray)
                    break;
                } else {
                    editCase(idCase, yesterdayCasesArray)
                    break;
                }
                
            }
        }
    }
})


//FUNCION ELIMINA CLASE .ERROR DE LOS INPUT
function removeError() {
    this.classList.remove('error')
}
titleCaseInput.addEventListener('focus', removeError )
idCaseInput.addEventListener('focus', removeError )
noteCaseInput.addEventListener('focus', removeError)
statusCaseInput.addEventListener('focus', removeError)


//BOTON PARA AGREGAR CASO A LA LISTA
buttonAdd.addEventListener('click', function () {

    const caseObject = {
        title: titleCaseInput.value,
        id: idCaseInput.value,
        description:  noteCaseInput.value,
        status: statusCaseInput.value,
        date: dateCase
    }

    
    const esValido = caseValidator(caseObject)
    const idExiste = existeId(caseObject.id)
    

    //SI VALIDO ES "TRUE" EJECUTO LA FUNCION Q AGREGA LA INFO DEL CASO EN EL ARRAY DE CASOS
    if (esValido && !idExiste) {
        todayCasesArray.push(caseObject)
        agregarCaso(caseObject, 'today')
        clearForm()
        saveInLocalStorage()
    }

})


function agregarCaso(caseInfo, sectionName) {
    let card = document.createElement('div')
    card.setAttribute('class','card')
    let statusButton = getStatusClass(caseInfo.status)
    card.setAttribute('data-id', caseInfo.id)

    card.innerHTML = `
        <div class="card-header">
            <h4 class="card-title"><a class="link" href="https://teg.avature.net/#Case/${caseInfo.id}" target="_blank">${caseInfo.title}</a></h4>
            <div class="card-actions">
                <span class="icon-action icon-edit tooltip" data-id="${caseInfo.id}">
                    <span class="tooltiptext">Edit case</span>
                </span>
                <span class="icon-action icon-change tooltip" data-id="${caseInfo.id}">
                    <span class="tooltiptext">Move case</span>
                </span>
                <span class="icon-action icon-close tooltip" data-id="${caseInfo.id}">
                    <span class="tooltiptext">Delete</span>
                </span>
            </div>
        </div>
        <div class="card-content">
            <p>${caseInfo.description}</p>
        </div>
        <div class="card-footer">
            <div class="btn-status ${statusButton}">${caseInfo.status}</div>
            <div class="">${dateCase}</div>
        </div>
        `
    if (sectionName === 'today'){
        sectionToday.appendChild(card)
    } else {
        sectionYesterday.appendChild(card)
    }


}

function mostrarCasos() {
    
    for (let i = 0; i < todayCasesArray.length; i++) {
        
        const caseInfo = {
            title : todayCasesArray[i].title,
            id : todayCasesArray[i].id,
            description : todayCasesArray[i].description,
            status : todayCasesArray[i].status,
            date: todayCasesArray[i].date
        }

        agregarCaso(caseInfo, 'today')
    }

    for (let i = 0; i < yesterdayCasesArray.length; i++) {
        
        const caseInfo = {
            title : yesterdayCasesArray[i].title,
            id : yesterdayCasesArray[i].id,
            description : yesterdayCasesArray[i].description,
            status : yesterdayCasesArray[i].status,
            date: todayCasesArray[i].date
        }

        agregarCaso(caseInfo, 'yesterday')
    }
}

function editCase(id, array){
    toggleButtons()
    

    for (let i=0; i < array.length; i++){
        if (array[i].id === id ){

            titleCaseInput.value = array[i].title
            idCaseInput.value = array[i].id
            noteCaseInput.value = array[i].description
            statusCaseInput.value = array[i].status
            break;
        }
    }
 
}

buttonCancel.addEventListener('click', function(){
    toggleButtons()
    clearForm()
})

buttonEdit.addEventListener('click', function(){

    const caseObject = {
        title: titleCaseInput.value,
        id: idCaseInput.value,
        description:  noteCaseInput.value,
        status: statusCaseInput.value,
        date: dateCase
    }

    const esValido = caseValidator(caseObject)

    if (esValido){
        let cards = document.querySelectorAll('.card')

        for (let i = 0; i < cards.length; i++){
            if (cards[i].dataset.id === caseObject.id){
                let statusButton = getStatusClass(caseObject.status)


                cards[i].innerHTML = `
                    <div class="card-header">
                        <h4 class="card-title"><a class="link" href="https://teg.avature.net/#Case/${caseObject.id}" target="_blank">${caseObject.title}</a></h4>
                        <div class="card-actions">
                            <span class="icon-action icon-edit tooltip" data-id="${caseObject.id}">
                                <span class="tooltiptext">Edit case</span>
                            </span>
                            <span class="icon-action icon-change tooltip" data-id="${caseObject.id}">
                                <span class="tooltiptext">Move case</span>
                            </span>
                            <span class="icon-action icon-close tooltip" data-id="${caseObject.id}">
                                <span class="tooltiptext">Delete</span>
                            </span>
                        </div>
                    </div>
                    <div class="card-content">
                        <p>${caseObject.description}</p>
                    </div>
                    <div class="card-footer">
                        <div class="btn-status ${statusButton}">${caseObject.status}</div>
                        <div class="">${dateCase}</div>
                    </div>
                    ` 

                    if (cards[i].parentNode.classList.contains("today-section")){
                        editElementFromArray(caseObject.id, todayCasesArray, caseObject)
                    } else {
                        editElementFromArray(caseObject.id, yesterdayCasesArray, caseObject)
                    }
                
                break;
                    
            }
        }
        toggleButtons()
        clearForm()
        saveInLocalStorage()
    }


})

function caseValidator(caseObject){

    let esValido = true
    
    // VALIDANDO SI TIENE CONTENIDO LOS INPUT
    if (caseObject.title === ''){
        esValido = false
        titleCaseInput.classList.add('error');
    }
    if (caseObject.id === '' ){
        esValido = false
        idCaseInput.classList.add('error');  
    }
    if (caseObject.description === '') {
        esValido = false
        noteCaseInput.classList.add('error');    
    }

    return esValido
}

function toggleButtons() {
    buttonCancel.classList.toggle('dNone')
    buttonEdit.classList.toggle('dNone')
    buttonAdd.classList.toggle('dNone')
    idCaseInput.toggleAttribute('disabled')
    gridLayout.classList.toggle('blur-disabled')
}

function getStatusClass(status) {
    switch (status) {
        case 'Queue for Dev' :  return 'btn-grey'
        case 'Sent to Case Owner' :  return 'btn-pink'
        case 'Development' :  return 'btn-blue'
        case 'Code Review' :  return 'btn-purple'
        case 'First Review' :  return 'btn-green'
        case 'In QA' : return 'btn-orange'
        case 'Changes and Feedback' : return 'btn-primary'
        case 'Bugfixing' : return 'btn-error'
        case 'Merged' : return 'btn-green'
        default : return 'btn-orange'
    }
}

function removeElementFromArray(id, array) {
    for (let i=0; i < array.length; i++){
        if (array[i].id === id ){
            array.splice( i, 1)
            break
        }
    }
    saveInLocalStorage()
}

function editElementFromArray(id, array, info) {
    for (let i=0; i < array.length; i++){
        if (array[i].id === id ){
            array[i].title = info.title
            array[i].description = info.description
            array[i].status = info.status
            array[i].date = info.date
            break;
        }
    }
    saveInLocalStorage()
}

function moveElementFromArray(id, arrayFrom, arrayTo ) {
    for (let i=0; i < arrayFrom.length; i++){
        if (arrayFrom[i].id === id ){
            let caseObj = arrayFrom[i];
            arrayFrom.splice( i, 1)
            arrayTo.push(caseObj)
            break;
        }
    }
    saveInLocalStorage()
}

function clearForm(){
    titleCaseInput.value = null
    idCaseInput.value = null
    noteCaseInput.value = null
    statusCaseInput.value = null
}

function saveInLocalStorage(){
    localStorage.setItem('arregloDeHoy', JSON.stringify(todayCasesArray))
    localStorage.setItem('arregloDeAyer', JSON.stringify(yesterdayCasesArray))
}

function loadLocalStorage(){
    todayCasesArray = JSON.parse(localStorage.getItem('arregloDeHoy')) 
    yesterdayCasesArray = JSON.parse(localStorage.getItem('arregloDeAyer')) 
    if (todayCasesArray === null){
        todayCasesArray = []
    }

    if (yesterdayCasesArray === null){
        yesterdayCasesArray = []
    }
}

function existeId(id){
    for (let i=0; i < todayCasesArray.length; i++){
        if (todayCasesArray[i].id === id ){
            idCaseInput.classList.add('error')
            return true
        }
    }
    
    for (let i=0; i < yesterdayCasesArray.length; i++){
        if (yesterdayCasesArray[i].id === id ){
            idCaseInput.classList.add('error')
            return true
        }
    }
    return false
}

loadLocalStorage()
mostrarCasos()


