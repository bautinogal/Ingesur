/*
$(document).ready(function() {
    $('#DNIDespachante').change(function() {
        const fetchPromise = fetch("https://ghibliapi.herokuapp.com/people");
        fetchPromise.then(response => {
            return response.json();
        }).then(data => {
            autoComplete(data, document.getElementById("FormDespachante"));
        });
    });
});*/

dniInput = document.getElementById('DNIDespachante');
dniInput.addEventListener('input', function(e) {
    const fetchPromise = fetch("https://ghibliapi.herokuapp.com/people");
    fetchPromise.then(response => {
        return response.json();
    }).then(data => {
        autoComplete(data, document.getElementById("FormDespachante"));
    });
    console.log("value changed!");
});

function autoComplete(data, root) {
    console.log("fields:");
    fields = root.getElementsByClassName('form-control');
    console.log(fields);
    for (var i = 0; i < fields.length; i++) {
        console.log(fields[i].placeholder); //second console output
        fields[i].value = "Automplete Test";
    }
    console.log("data:");
    console.log(data);
}