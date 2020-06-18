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
let ingreso = {};

const formDespachante = document.getElementById('form-despachante');
const formReceptor = document.getElementById('form-receptor');
const formUsuario = document.getElementById('form-usuario');
const formResponsableSeguridad = document.getElementById('form-responsable-seguridad');
const formResponsableCompras = document.getElementById('form-responsable-compras');
const tableEquipos = document.getElementById('table-equipos');

const inputDniDespachante = document.getElementById('dni-despachante');
const inputDniUsuario = document.getElementById('dni-usuario');
const inputDniResponsableSeguridad = document.getElementById('dni-responsable-seguridad');
const inputDniResponsableCompras = document.getElementById('dni-responsable-compras');



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
        const requestOptions = {
            method: 'GET',
            //body: JSON.stringify(raw),
            redirect: 'follow',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        };
        const url = "https://dabau-api.herokuapp.com/api/user?buscar=" + inputField.value;
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
    });
}

autoCompleteOnInput(formDespachante, inputDniDespachante);
autoCompleteOnInput(formUsuario, inputDniUsuario);
autoCompleteOnInput(formResponsableSeguridad, inputDniResponsableSeguridad);
autoCompleteOnInput(formResponsableCompras, inputDniResponsableCompras);

//-----------------------------------------------------------------------------
//Manejo de los datos agregar/sacar equipos

let equipos = [];

//TODO: este id no sigue la convención porque el elemento lo llamo de nuevo-equipo-ingreso (unificar)
btnAgregarEquipo = document.getElementById('submitModalBtn');
btnSubmit = document.getElementById('btn-submit');
tableEquipos = document.getElementById('lista-equipos');

function getFormData() {

}

function drawTable() { <
    /* tr id = "lista-equipos" >
         <
         td class = "text-left" >
         1 <
         /td>*/
}

function agregarEquipo() {
    var formData = getFormData();
    ingreso.equipos.push(formData);
    drawTable(equipos);
}

function submit() {

}

btnAgregarEquipo.addEventListener('click', agregarEquipo);
btnSubmit.addEventListener('click', submit);

//-----------------------------------------------------------------------------
//TODO: ver si podemos pasar esto de jquery a js común
$(document).ready(function() {
    $('.dropdown').each(function(key, dropdown) {
        var $dropdown = $(dropdown);
        $dropdown.find('.dropdown-menu a').on('click', function() {
            $dropdown.find('button').text($(this).text()).append('');
            showFormForGroup($(this).text());
        });
    });
});

function showFormForGroup(group) {
    console.log(group);
    switch (group) {
        case "Grupo A":
            $('#formEquipoA').collapse('show');
            $('#formEquipoB').collapse('hide');
            $('#formEquipoC').collapse('hide');
            break;
        case "Grupo B":
            $('#formEquipoA').collapse('hide');
            $('#formEquipoB').collapse('show');
            $('#formEquipoC').collapse('hide');
            break;
        case "Grupo C":
            $('#formEquipoA').collapse('hide');
            $('#formEquipoB').collapse('hide');
            $('#formEquipoC').collapse('show');
            break;
        default:
            $('#formEquipoA').collapse('show');
            $('#formEquipoB').collapse('hide');
            $('#formEquipoC').collapse('hide');
            break;
    }
}

//-----------------------------------------------
//TODO: creo q no estamos llamando esta funcion. deberiamos mostrar alertas?
function hideAlerts() {
    var succesAlert = document.getElementById("succes-alert");
    if (succesAlert) succesAlert.style.display = "none";
    //$('#succes-alert').alert('close');
}