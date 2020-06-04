// Get DOM Elements
const modal = document.querySelector('#cargar-nuevo-equipo-modal');
const modalBtn = document.querySelector('#cargar-nuevo-equipo-btn');
const closeBtn = document.querySelector('.close');
const submitBtn = document.querySelector('#submitModalBtn');
const equiposTable = document.querySelector('#equiposTable');

// Events
modalBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', outsideClick);
submitBtn.addEventListener('click', submit);

// Open
function openModal() {
    modal.style.display = 'block';
}

// Close
function closeModal() {
    modal.style.display = 'none';
}

// Close If Outside Click
function outsideClick(e) {
    if (e.target == modal) {
        modal.style.display = 'none';
    }
}

function submit() {
    tbody = equiposTable.getElementsByTagName("tbody");
    console.log(tbody);
    closeModal();
}