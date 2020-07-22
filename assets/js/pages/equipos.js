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
ServerLogin("jbnogal@gcomentarios.com", "123456");

//-----------------------------------------------------------------------------

//Data que vamos a recibir del servidor
let usuarios = [];

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

//-----------------------------------------------------------------------------
//Manejo de los datos agregar/sacar usuarios

//TODO: este id no sigue la convención porque el elemento lo llamo de nuevo-equipo-ingreso (unificar)
const modal = document.getElementById('cargar-nuevo-equipo-modal');
const abrirModalBtn = document.getElementById('cargar-nuevo-equipo-btn');
const closeModal = document.getElementById('close-modal');
const btnAgregarEquipo = document.getElementById('submitModalBtn');
const tableEquipos = document.getElementById('lista-equipos');
const pagination = document.getElementById('pagination');
const userForm = document.getElementById('form-usuario');

const inputDniDespachante = document.getElementById('dni-despachante');
const inputDniUsuario = document.getElementById('dni-usuario');
const inputDniResponsableSeguridad = document.getElementById('dni-responsable-seguridad');
const inputDniResponsableCompras = document.getElementById('dni-responsable-compras');

const btnSubmit = document.getElementById('listo');

const formSelector = document.getElementById('TipoDeEquipoDrop');
const formA = document.getElementById('formEquipoA');
const formB = document.getElementById('formEquipoB');
const formC = document.getElementById('formEquipoC');


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


const getUsers = new Promise((onSuccess, onFailed) => {
    var url = 'https://dabau-api.herokuapp.com/api/equipos?desde=0&hasta=99999999'; //TODO: sacar el 9999999999999

    var params = {
        method: 'GET', // or 'PUT'
        //  body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
            'Content-Type': 'application/json'
        }
    }

    fetch(url, params)
        .then((res) => res.json())
        .then((res) => {
            usuarios = res.equipos;
            onSuccess(res);
        })
        .catch(onFailed);
});

function showModal(data) {
    modal.style.display = 'block';
    jsonToForm(inputDniUsuario.form, {});
    jsonToForm(inputDniResponsableSeguridad.form, {});
    jsonToForm(inputDniResponsableCompras.form, {});
    jsonToForm(formA, {});
    jsonToForm(formB, {});
    jsonToForm(formC, {});
    console.log("showModal");
    modal.classList.remove("d-block");
    modal.classList.remove("d-none");
    modal.classList.add("d-block");
    //document.getElementById("form-usuario").innerHTML = "";

}

function hideModal() {
    console.log("hideModal");
    modal.classList.remove("d-block");
    modal.classList.remove("d-none");
    modal.classList.add("d-none");
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

function drawPagination(index, pageCount) {
    //<li class="page-item"><a class="page-link" href="#">1</a></li>
    //Limpio la paginacion:
    pagination.innerHTML = '';
    for (let ind = 0; ind < pageCount; ind++) {
        var newLine = document.createElement("li");
        newLine.classList.add("page-item");
        if (ind == index)
            newLine.classList.add("active");
        var newA = document.createElement("a");
        newA.classList.add("page-link");
        newA.innerHTML = Number(ind.toString()) + 1;
        newA.addEventListener('click', () => drawTable(usuarios, ind));
        newLine.appendChild(newA);
        pagination.appendChild(newLine);
    }
}

//Dibuja la tabla de usuarios
function drawTable(usuarios, pag) {
    const elementsPerPage = 7;
    //Limpio la tabla:
    tableEquipos.innerHTML = '';
    console.log("ingreso@drawTable: dibujando tabla con: %s", usuarios);
    const pageCount = Math.ceil(usuarios.length / elementsPerPage);
    console.log("ingreso@drawTable: pageCount: %s", pageCount);
    const from = pag * elementsPerPage;
    let to = from + elementsPerPage;
    if (to > usuarios.length)
        to = usuarios.length;
    console.log("ingreso@drawTable: showing from element %s to %s", from, to);
    //Agrego los elementos de la tabla:
    try {
        let i = 0;
        usuarios.forEach(usuario => {
            if (i >= from && i < to) {
                console.log("ingreso@drawTable: agregando linea: %s", JSON.stringify(usuario));
                var newLine = document.createElement("tr");
                var grupo = document.createElement("td");
                grupo.appendChild(document.createTextNode(usuario.grupo || '-'));
                newLine.appendChild(grupo);
                var marca = document.createElement("td");
                marca.appendChild(document.createTextNode(usuario.marca || '-'));
                newLine.appendChild(marca);
                var modelo = document.createElement("td");
                modelo.appendChild(document.createTextNode(usuario.modelo || '-'));
                newLine.appendChild(modelo);
                var empresa = document.createElement("td");
                empresa.appendChild(document.createTextNode(usuario.empresa || '-'));
                newLine.appendChild(empresa);
                var NoSerie = document.createElement("td");
                NoSerie.appendChild(document.createTextNode(usuario.serialNo || '-'));
                newLine.appendChild(NoSerie);
                var diasEntreCal = document.createElement("td");
                diasEntreCal.appendChild(document.createTextNode(usuario.diasEntreCal || '-'));
                newLine.appendChild(diasEntreCal);
                var comentarios = document.createElement("td");
                comentarios.appendChild(document.createTextNode(usuario.comentarios || '-'));
                newLine.appendChild(comentarios);
                var status = document.createElement("td");
                status.appendChild(document.createTextNode(usuario.status || '-'));
                newLine.appendChild(status);



                var editCell = document.createElement("td");

                //Agrego el boton para editar el equipo
                var editBtn = document.createElement("button");
                editBtn.rel = "tooltip";
                editBtn.className = "btn btn-success btn-icon btn-sm ";
                editBtn.addEventListener('click', () => showModal(usuarios[0]));
                var editBtnInfo = document.createElement("i");
                editBtnInfo.className = "fa fa-edit";
                editBtn.appendChild(editBtnInfo);
                editCell.appendChild(editBtn);


                var eraseBtn = document.createElement("button");
                eraseBtn.rel = "tooltip";
                eraseBtn.className = "btn btn-info btn-icon btn-sm ";
                var eraseBtnInfo = document.createElement("i");
                eraseBtnInfo.className = "nc nc-paper ";
                eraseBtn.appendChild(eraseBtnInfo);
                eraseBtn.addEventListener('click', () => modalCertificados(usuarios[0]));
                editCell.appendChild(eraseBtn);


                newLine.appendChild(editCell);

                tableEquipos.appendChild(newLine);
            }
            i++;
        });

    } catch (e) {
        console.error("ingreso@drawTable: error: %s", e);
    }
    drawPagination(pag, pageCount);
}

function addUser(user, cb) {
    console.log("addUser: user %s", JSON.stringify(user));
    var url = 'https://dabau-api.herokuapp.com/api/user';

    var data = {
        'token': token,
        'user': user
    }

    data.user.username = data.user.comentarios;
    data.user.password = data.user.pass;

    var params = {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
            'Content-Type': 'application/json',
        }
    }

    console.log("Posting: body: %s", JSON.stringify(data));
    fetch(url, params)
        .then((res) => res.json())
        .then(cb)
        .catch((err) => console.log(err));
}

function agregarUsuario() {
    var formData = formToData(userForm);
    addUser(formData, (res) => updateTable((users) => location.reload()));
    hideModal();
}

function updateTable(onSucces) {
    getUsers
        .then((UsersObj) => {
            console.log("UsersObj: ", UsersObj);
            if (onSucces != null)
                onSucces(UsersObj.equipos);
            return drawTable(UsersObj.equipos, 0);
        })
        .catch((err) => console.log('getUsers GET error: ', err))
}

function modalCertificados() {
    modalCert = document.getElementById("carga-archivos");
    modalCert.style.display = 'block';
    //document.getElementById("form-usuario").innerHTML = "";
}

function closeModalCertificados() {
    modalCert.style.display = 'none';
}

document.getElementById("carga-archivos-close-modal").addEventListener('click', closeModalCertificados);
updateTable((users) => console.log("UpdateTable with: %s", users));

closeModal.addEventListener('click', hideModal);
//btnAgregarEquipo.addEventListener('click', agregarUsuario);

//showModal(usuarios[0]);