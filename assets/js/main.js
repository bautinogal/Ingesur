//S: UI section
const inputs = document.querySelectorAll(".input");


function addcl() {
    let parent = this.parentNode.parentNode;
    parent.classList.add("focus");
}

function remcl() {
    let parent = this.parentNode.parentNode;
    if (this.value == "") {
        parent.classList.remove("focus");
    }
}


inputs.forEach(input => {
    input.addEventListener("focus", addcl);
    input.addEventListener("blur", remcl);
});
////////////////////////////////////////////

//S: login form

let ServerLogin = function(username, password) { //A: manda un POST al endpoint con el usuario y contraseña devuelve una promesa
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
            .then(result => resolve(result))
            .catch(error => reject(error));

    })
}


window.onload = function() {
    document.getElementById('loginForm').onsubmit = function(e) {
        e.preventDefault();

        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        if (!username || !password) { return alert("usuario y contraseña obligatorios"); }
        console.log("username: ", username, " password: ", password)
        ServerLogin(username, password)
            .then(result => {
                let resultObj = JSON.parse(result);
                if (resultObj.status == "error") return alert(resultObj.msg)
                localStorage.setItem('token', resultObj.token);
                window.location.href = "index.html";
            })
            .catch(err => {
                console.log("Login error: ", err)
            })
    }
}