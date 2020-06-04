//Autocompletado del formulario del "Despachante"
token = "";
//Logs In
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


dniInput = document.getElementById('DNIDespachante');
dniInput.addEventListener('input', function(e) {
    var raw = {
        token: token,
    }
    var requestOptions = {
        method: 'GET',
        //body: JSON.stringify(raw),
        redirect: 'follow',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    };
    const fetchPromise = fetch("https://dabau-api.herokuapp.com/api/user?buscar=" + dniInput.value, requestOptions);
    console.log("URL: https://dabau-api.herokuapp.com/api/user?" + dniInput.value)
    fetchPromise
        .then(response => response.text())
        .then(response => autoComplete(response, document.getElementById('FormDespachante')))
        .catch(error => console.log(error))
});

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
    }
}

function autoComplete(data, root) {
    console.log("Data: " + data);
    try {
        data = JSON.stringify(data);
        console.log("Stringufy: " + data);
    } catch (error) {
        console.log("Autocomplete: Error parsing response!");
        //Muestro el cartel de que se hubo un error
    }
    console.log("Root: ");
    console.log(root);
    fields = root.getElementsByClassName('form-control');

    if ( /*data.found == "true"*/ true) {
        console.log("Automplete-fields:");
        console.log(fields);
        //Muestro el cartel de que se encontró el dni 
        for (var i = 0; i < fields.length; i++) {
            if (fields[i].placeholder != "DNI") {
                console.log(fields[i].placeholder); //second console output
                fields[i].value = "Automplete Test";
            }

        }
        console.log("Automplete-data:");
        console.log(data);
    } else {
        //Muestro el cartel de que NO se encontró el dni 
    }

}

function hideAlerts() {
    var succesAlert = document.getElementById("succes-alert");
    if (succesAlert) succesAlert.style.display = "none";
    //$('#succes-alert').alert('close');
}