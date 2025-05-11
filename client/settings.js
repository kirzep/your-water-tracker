function openSettingsModal() {
    document.querySelector('.settings-modal').style.display = 'block';
}

function closeSettingsModal() {
    document.querySelector('.settings-modal').style.display = 'none';
}

function validateWeight(weight) {
 return weight >= 30 && weight <= 200 && !isNaN(weight);
}
 
document.querySelector('.close-button').addEventListener('click', closeSettingsModal);
