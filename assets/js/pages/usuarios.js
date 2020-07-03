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

//Data que vamos a recibir del servidor
let usuarios = [{
        "nombre": "Juan Bautista",
        "apellido": "Nogal",
        "dni": "36181166",
        "empresa": "Ventum",
        "sector": "Desarrollo",
        "usuario": "SI",
        "mail": "jbnogal@gmail.com",
        "telefono": "1549703070",
        "fechaNac": "11-06-1991"
    },
    {
        "nombre": "Juan Bautista",
        "apellido": "Nogal",
        "dni": "36181166",
        "empresa": "Ventum",
        "sector": "Desarrollo",
        "usuario": "SI",
        "mail": "jbnogal@gmail.com",
        "telefono": "1549703070",
        "fechaNac": "11-06-1991"
    },
    {
        "nombre": "Juan Bautista",
        "apellido": "Nogal",
        "dni": "36181166",
        "empresa": "Ventum",
        "sector": "Desarrollo",
        "usuario": "SI",
        "mail": "jbnogal@gmail.com",
        "telefono": "1549703070",
        "fechaNac": "11-06-1991"
    },
    {
        "nombre": "Juan Bautista",
        "apellido": "Nogal",
        "dni": "36181166",
        "empresa": "Ventum",
        "sector": "Desarrollo",
        "usuario": "SI",
        "mail": "jbnogal@gmail.com",
        "telefono": "1549703070",
        "fechaNac": "11-06-1991"
    },
    {
        "nombre": "Juan Bautista",
        "apellido": "Nogal",
        "dni": "36181166",
        "empresa": "Ventum",
        "sector": "Desarrollo",
        "usuario": "SI",
        "mail": "jbnogal@gmail.com",
        "telefono": "1549703070",
        "fechaNac": "11-06-1991"
    },
    {
        "nombre": "Juan Bautista",
        "apellido": "Nogal",
        "dni": "36181166",
        "empresa": "Ventum",
        "sector": "Desarrollo",
        "usuario": "SI",
        "mail": "jbnogal@gmail.com",
        "telefono": "1549703070",
        "fechaNac": "11-06-1991"
    },
    {
        "nombre": "Juan Bautista",
        "apellido": "Nogal",
        "dni": "36181166",
        "empresa": "Ventum",
        "sector": "Desarrollo",
        "usuario": "SI",
        "mail": "jbnogal@gmail.com",
        "telefono": "1549703070",
        "fechaNac": "11-06-1991"
    }
];

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


const getUsers = new Promise((onSuccess, onFailed) => {
    var url = 'https://dabau-api.herokuapp.com/api/user?desde=4'; //TODO: agrear params ?desde=2&hasta=3

    var params = {
        method: 'GET', // or 'PUT'
        //  body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
            'Content-Type': 'application/json'
        }
    }

    fetch(url, params)
        .then((res) => res.json())
        .then(onSuccess)
        .catch(onFailed);
});

function showModal() {
    console.log("showModal");
    modal.classList.remove("d-block");
    modal.classList.remove("d-none");
    modal.classList.add("d-block");
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

//Dibuja la tabla de usuarios
function drawTable(usuarios, pag) {
    tableEquipos.innerHTML = '';
    console.log("ingreso@drawTable: dibujando tabla con: %s", JSON.stringify(usuarios));
    try {
        usuarios.forEach(usuario => {
            console.log("ingreso@drawTable: agregando linea: %s", JSON.stringify(usuario));
            var newLine = document.createElement("tr");
            var nombre = document.createElement("td");
            nombre.appendChild(document.createTextNode(usuario.nombre || '-'));
            newLine.appendChild(nombre);
            var apellido = document.createElement("td");
            apellido.appendChild(document.createTextNode(usuario.apellido || '-'));
            newLine.appendChild(apellido);
            var dni = document.createElement("td");
            dni.appendChild(document.createTextNode(usuario.dni || '-'));
            newLine.appendChild(dni);
            var empresa = document.createElement("td");
            empresa.appendChild(document.createTextNode(usuario.empresa || '-'));
            newLine.appendChild(empresa);
            var sector = document.createElement("td");
            sector.appendChild(document.createTextNode(usuario.sector || '-'));
            newLine.appendChild(sector);
            var usuarioPortal = document.createElement("td");
            usuarioPortal.appendChild(document.createTextNode(usuario.usuario || '-'));
            newLine.appendChild(usuarioPortal);
            var mail = document.createElement("td");
            mail.appendChild(document.createTextNode(usuario.mail || '-'));
            newLine.appendChild(mail);
            var telefono = document.createElement("td");
            telefono.appendChild(document.createTextNode(usuario.telefono || '-'));
            newLine.appendChild(telefono);
            var fechaNac = document.createElement("td");
            fechaNac.appendChild(document.createTextNode(usuario.fechaNac || '-'));
            newLine.appendChild(fechaNac);


            var editCell = document.createElement("td");

            //Agrego el boton para editar el equipo
            var editBtn = document.createElement("button");
            editBtn.rel = "tooltip";
            editBtn.className = "btn btn-success btn-icon btn-sm ";
            var editBtnInfo = document.createElement("i");
            editBtnInfo.className = "fa fa-edit";
            editBtn.appendChild(editBtnInfo);
            //TODO: poder editar el equipo
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
        });

    } catch (e) {
        console.error("ingreso@drawTable: error: %s", e);
    }
}

function agregarEquipo() {
    var formData = getFormData();
    ingreso.equipos.push(formData);
    drawTable(ingreso.equipos);
}

abrirModalBtn.addEventListener('click', () => getUsers.then((res) => console.log(res)).catch((err) => console.log(err)) /*showModal*/ );
closeModal.addEventListener('click', hideModal);
//btnAgregarEquipo.addEventListener('click', agregarEquipo);

getUsers
    .then((UsersObj) => { console.log("UsersObj: ", UsersObj); return drawTable(UsersObj.users) })
    .catch((err) => console.log('getUsers GET error: ', err))