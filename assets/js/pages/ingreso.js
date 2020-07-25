//Auto-login para poder pegarle al server:
token = "";

let ServerLogin = function(username, password) { //A: manda un POST al endpoint con el usuario y contraseña devuelve una promesa
    console.log("llamando al servidor");
    return new Promise(function(resolve, reject) {
        var raw = {
            username: username,
            password: password
        }
        var requestOptions = {
            method: 'POST',
            body: JSON.stringify(raw),
            redirect: 'follow',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        fetch("https://dabau-api.herokuapp.com/api/login", requestOptions)
            .then(response => response.text())
            .then(response => {
                token = JSON.parse(response).token;
                console.log("Token: " + token);
                resolve(response);
            })
            .catch(error => reject(error));

    })
}
ServerLogin("admin@admin.com", "123");

//-----------------------------------------------------------------------------
//Autocompletado del formulario del "Despachante"

//Data que le vamos a mandar al servidor con todos los datos ingresados

let ingreso = {
    equipos: []
};

const formDespachante = document.getElementById('form-despachante');
const formReceptor = document.getElementById('form-receptor');
const formUsuario = document.getElementById('form-usuario');
const formResponsableSeguridad = document.getElementById('FormResSeguridad');
const formResponsableCompras = document.getElementById('FormResCompras');

const inputDniDespachante = document.getElementById('dni-despachante');
const inputDniUsuario = document.getElementById('dni-usuario');
const inputDniResponsableSeguridad = document.getElementById('dni-responsable-seguridad');
const inputDniResponsableCompras = document.getElementById('dni-responsable-compras');


const receptorName = document.getElementById("receptor-name");
receptorName.innerHTML = "Gonzalez N.";

const date = document.getElementById("date");
const time = document.getElementById("time");
const interval = setInterval(function() {
    var dt = new Date();
    date.innerHTML = dt.toLocaleDateString();
    time.innerHTML = dt.toLocaleTimeString();
}, 500)

// Uso esta función para mapear los datos de los usuarios que vienen de la bd con los campos de los formularios 
//(uso los placeholders para identificarlos)
const userDataMap = function(field) {
    switch (field) {
        case "DNI":
            return "dni";
        case "Nombre":
            return "nombre";
        case "Apellido":
            return "apellido";
        case "Fecha":
            return "fechaNacimiento";
        case "Empresa":
            return "empresa";
        case "Sector":
            return "sector";
        case "Posición":
            return "posicion";
        case "Mail":
            return "mail";
        case "Teléfono":
            return "telefono";
        case "Dirección":
            return "direccion";
        default:
            return "";
    }

}

// Me devuelve un objeto con la info del form
const formToData = function(form) {
    var formElements = form.elements;
    var postData = {};
    for (var i = 0; i < formElements.length; i++)
        if (formElements[i].type != "submit") //we dont want to include the submit-buttom
            postData[formElements[i].name] = formElements[i].value;

    console.log("ingreso@formToData: postData: %s", JSON.stringify(postData));
    return postData;
}

//Función que autocompleta el form con la data
function autoComplete(data, map, root, fields) {
    if (data.length != 0) {
        console.log("ingreso@autoComplete: root: %s fields: %s data: %s", root, fields, JSON.stringify(data));
        for (var i = 0; i < fields.length; i++) {
            let field = fields[i];
            let value = map(field.placeholder);
            if (value) {
                field.value = data[value];
            }
        }
    } else {
        console.log("ingreso@autoComplete: user list was empty!");
    }
}

//Función que autocompleta el form si el servidor encuentra ese field en la bd
function autoCompleteOnInput(form, inputField) {

    inputField.addEventListener('input', function(e) {
        if (inputField.value != "") {
            const requestOptions = {
                method: 'GET',
                //body: JSON.stringify(raw),
                redirect: 'follow',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                }
            };
            const url = `https://dabau-api.herokuapp.com/api/user?q= {"dni": "${inputField.value}"} `
            const fetchPromise = fetch(url, requestOptions);
            const fields = form.querySelectorAll('input');
            console.log("ingreso@autocomplete: fetching from: %s", url);
            fetchPromise
                .then(response => response.json())
                .then(data => {
                    if (data.users.length > 0)
                        autoComplete(data.users[0], userDataMap, form, fields);
                    else
                        console.log("ingreso@autocomplete: User not found with document: %s", inputField.value)
                })
                .catch(e => console.log("ingreso@autocomplete: Error parsing response: %s", e))
        }
    });


}

autoCompleteOnInput(formDespachante, inputDniDespachante);
autoCompleteOnInput(formUsuario, inputDniUsuario);
autoCompleteOnInput(formResponsableSeguridad, inputDniResponsableSeguridad);
autoCompleteOnInput(formResponsableCompras, inputDniResponsableCompras);

//-----------------------------------------------------------------------------
//Manejo de los datos agregar/sacar equipos


//TODO: este id no sigue la convención porque el elemento lo llamo de nuevo-equipo-ingreso (unificar)
const btnAgregarEquipo = document.getElementById('submitModalBtn');
const btnSubmit = document.getElementById('listo');
const tableEquipos = document.getElementById('lista-equipos');

const formSelector = document.getElementById('TipoDeEquipoDrop');
const formA = document.getElementById('formEquipoA');
const formB = document.getElementById('formEquipoB');
const formC = document.getElementById('formEquipoC');

//Devuelve un objeto con la info que se ingreso en el formulario de nuevo equipo
function getFormData() {
    var result = {};
    result.usuario = formToData(formUsuario);
    result.resCompras = formToData(formResponsableCompras);
    result.resSeguridad = formToData(formResponsableSeguridad);
    switch (selectedGroup) {
        case "Multigas-Monogas-Fijos":
            result.equipo = formToData(formA);
            result.equipo.grupo = "Multigas-Monogas-Fijos";
            break;
        case "Autónomos":
            result.equipo = formToData(formB);
            result.equipo.grupo = "Autónomos";
            break;
        case "Varios":
            result.equipo = formToData(formC);
            result.equipo.grupo = "Varios";
            break;
        default:
            result.equipo = {};
            break;
    }
    return result;
}

function jsonToForm(form, json) {
    elements = form.elements;
    for (let index = 0; index < elements.length; index++) {
        const element = elements[index];
        console.log(element.name);
        if (json[element.name]) {
            console.log("contains: %s", element.name);
            element.value = json[element.name];
        } else {
            console.log("doesnt contains: %s", element.name);
            element.value = "";
        }
    }
}

function getReceptorData() {
    var result = {};
    result.nombre = "";
    result.apellido = "";
    var dt = new Date();
    result.date = dt.toLocaleDateString();
    result.time = dt.toLocaleTimeString();
    result.lugar = document.getElementById('lugar').innerHTML;
    result.comentarios = document.getElementById('comentarios').innerHTML;
    return result;
}

function editarEquipo(equipo) {
    selectedEquipo = ingreso.equipos.indexOf(equipo);
    data = ingreso.equipos[selectedEquipo];
    openModal();
    jsonToForm(inputDniUsuario.form, data.usuario);
    jsonToForm(inputDniResponsableSeguridad.form, data.resSeguridad);
    jsonToForm(inputDniResponsableCompras.form, data.resCompras);
    jsonToForm(formA, data.equipo);
    jsonToForm(formB, data.equipo);
    jsonToForm(formC, data.equipo);
}

function eliminarEquipo(equipo) {
    console.log("eliminarEquipo: equipo %s", JSON.stringify(equipo));
    const index = ingreso.equipos.indexOf(equipo);
    console.log("eliminarEquipo: index %s", index);
    if (index > -1) {
        ingreso.equipos.splice(index, 1);
    }
    drawTable(ingreso.equipos);
}

//Dibuja la tabla de equipos cargados
function drawTable(equipos) {
    tableEquipos.innerHTML = '';
    console.log("ingreso@drawTable: dibujando tabla con: %s", JSON.stringify(equipos));
    var counter = 1;
    try {
        equipos.forEach(equipo => {
            console.log("ingreso@drawTable: agregando linea: %s", JSON.stringify(equipo));
            const data = equipo.equipo;
            var newLine = document.createElement("tr");
            var numero = document.createElement("td");
            numero.appendChild(document.createTextNode(counter || '-'));
            newLine.appendChild(numero);
            var grupo = document.createElement("td");
            grupo.appendChild(document.createTextNode(data.grupo || '-'));
            newLine.appendChild(grupo);
            //var tipo = document.createElement("td");
            //tipo.appendChild(document.createTextNode(data.tipo || '-'));
            //newLine.appendChild(tipo);
            var marca = document.createElement("td");
            marca.appendChild(document.createTextNode(data.marca || '-'));
            newLine.appendChild(marca);
            var modelo = document.createElement("td");
            modelo.appendChild(document.createTextNode(data.modelo || '-'));
            newLine.appendChild(modelo);
            var serialNo = document.createElement("td");
            serialNo.appendChild(document.createTextNode(data.serialNo || '-'));
            newLine.appendChild(serialNo);
            var diasEntreCal = document.createElement("td");
            diasEntreCal.appendChild(document.createTextNode(data.diasEntreCal || '-'));
            newLine.appendChild(diasEntreCal);
            var comentarios = document.createElement("td");
            comentarios.appendChild(document.createTextNode(data.comentarios || '-'));
            newLine.appendChild(comentarios);

            var editCell = document.createElement("td");

            //Agrego el boton para editar el equipo
            var editBtn = document.createElement("button");
            editBtn.rel = "tooltip";
            editBtn.className = "btn btn-success btn-icon btn-sm ";
            var editBtnInfo = document.createElement("i");
            editBtnInfo.className = "fa fa-edit";
            editBtn.appendChild(editBtnInfo);
            //TODO: poder editar el equipo
            editBtn.addEventListener('click', () => editarEquipo(equipo));
            editCell.appendChild(editBtn);

            //Agrego el boton para borrar el equipo
            var eraseBtn = document.createElement("button");
            eraseBtn.rel = "tooltip";
            eraseBtn.className = "btn btn-danger btn-icon btn-sm ";
            var eraseBtnInfo = document.createElement("i");
            eraseBtnInfo.className = "fa fa-times";
            eraseBtn.appendChild(eraseBtnInfo);
            eraseBtn.addEventListener('click', () => eliminarEquipo(equipo));
            editCell.appendChild(eraseBtn);

            newLine.appendChild(editCell);

            tableEquipos.appendChild(newLine);
            counter++;
        });

    } catch (e) {
        console.error("ingreso@drawTable: error: %s", e);
    }
}

var selectedEquipo = null;

function agregarEquipo() {
    var formData = getFormData();
    if (selectedEquipo != null) {
        console.log("selectedEquipo: %s", selectedEquipo);
        ingreso.equipos[selectedEquipo] = formData;
    } else {
        console.log("selectedEquipo: null");
        ingreso.equipos.push(formData);
    }
    selectedEquipo = null;
    drawTable(ingreso.equipos);
}

function submit(e) {
    e.preventDefault();
    result = {};
    result.despachante = formToData(formDespachante);
    result.receptor = getReceptorData();
    result.equipos = ingreso.equipos;

    var url = "https://dabau-api.herokuapp.com/api/reception"

    var params = {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(result), // data can be `string` or {object}!
        headers: {
            'Content-Type': 'application/json',
        }
    }

    console.log("Submit: body: %s", JSON.stringify(result));
    fetch(url, params)
        .then((res) => res.json())
        .then((res) => {
            swal({
                    title: "Está seguro que quiere cargar el ingreso?",
                    text: "(Si necesita editar los datos mas adelante, lo puede hacer desde las bases de datos de usuarios y equipos)",
                    icon: "warning",
                    buttons: true,
                    dangerMode: false,
                })
                .then((willDelete) => {
                    if (willDelete) {
                        swal("Ingreso cargado", "", "success")
                            .then(() => location.reload());
                    }
                });
        })
        .catch((err) => console.log(err));

}

btnAgregarEquipo.addEventListener('click', agregarEquipo);
btnSubmit.addEventListener('click', submit);

drawTable(ingreso.equipos);

var selectedGroup = "";

const optionA = document.getElementById('optionA');
const optionB = document.getElementById('optionB');
const optionC = document.getElementById('optionC');
const titulo = document.getElementById('tituloEquipo');
var tituloText = document.createTextNode(`Equipo: Grupo A`);
titulo.appendChild(tituloText);

optionA.addEventListener('click', () => showFormForGroup('Multigas-Monogas-Fijos'));
optionB.addEventListener('click', () => showFormForGroup('Autónomos'));
optionC.addEventListener('click', () => showFormForGroup('Varios'));

function showFormForGroup(group) {
    console.log("showFormForGroup: " + group);
    selectedGroup = group;
    tituloText.nodeValue = `Equipo: ${group}`;

    switch (group) {
        case "Multigas-Monogas-Fijos":
            formA.style.display = "block";
            formB.style.display = "none";
            formC.style.display = "none";
            break;
        case "Autónomos":
            formA.style.display = "none";
            formB.style.display = "block";
            formC.style.display = "none";
            break;
        case "Varios":
            formA.style.display = "none";
            formB.style.display = "none";
            formC.style.display = "block";
            break;
        default:
            formA.style.display = "block";
            formB.style.display = "none";
            formC.style.display = "none";
            break;
    }
}

showFormForGroup("Multigas-Monogas-Fijos");

//-----------------------------------------------
//TODO: creo q no estamos llamando esta funcion. deberiamos mostrar alertas?
function hideAlerts() {
    var succesAlert = document.getElementById("succes-alert");
    if (succesAlert) succesAlert.style.display = "none";
    //$('#succes-alert').alert('close');
}

//-----------------------------------------------

// Get DOM Elements
const modal = document.querySelector('#cargar-nuevo-equipo-modal');
const modalBtn = document.querySelector('#cargar-nuevo-equipo-btn');
const closeBtn = document.querySelector('.close');
const modalSubmitBtn = document.querySelector('#submitModalBtn');
const equiposTable = document.querySelector('#equiposTable');

// Events
modalBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', outsideClick);
modalSubmitBtn.addEventListener('click', submitModal);

// Open
function openModal() {
    modal.style.display = 'block';
    jsonToForm(inputDniUsuario.form, {});
    jsonToForm(inputDniResponsableSeguridad.form, {});
    jsonToForm(inputDniResponsableCompras.form, {});
    jsonToForm(formA, {});
    jsonToForm(formB, {});
    jsonToForm(formC, {});
}

// Close
function closeModal() {
    modal.style.display = 'none';
    selectedEquipo = null;
}

// Close If Outside Click
function outsideClick(e) {
    if (e.target == modal) {
        modal.style.display = 'none';
        selectedEquipo = null;
    }
}

function submitModal() {
    tbody = equiposTable.getElementsByTagName("tbody");
    console.log(tbody);
    closeModal();
}