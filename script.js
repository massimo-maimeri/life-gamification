// Funzioni per gestire i dati in localStorage
const storage = {
    saveActions: function(actions) {
        console.log('Saving actions:', actions);
        localStorage.setItem('lifeActions', JSON.stringify(actions));
    },
    getActions: function() {
        const actions = localStorage.getItem('lifeActions');
        console.log('Retrieved actions from storage:', actions);
        return actions ? JSON.parse(actions) : [];
    },
    addAction: function(action) {
        const actions = this.getActions();
        actions.push(action);
        this.saveActions(actions);
    },
    removeAction: function(id) {
        console.log('Removing action with id:', id);
        let actions = this.getActions();
        console.log('Actions before removal:', actions);
        actions = actions.filter(action => action.id !== id); // Confronta stringhe
        console.log('Actions after removal:', actions);
        this.saveActions(actions);
        console.log('Actions saved:', this.getActions());
    },
};

// Funzione per aggiungere una nuova azione
function addNewAction(title, score) {
    const newAction = {
        id: Date.now().toString(), // Usa solo Date.now() come stringa
        title: title,
        score: parseInt(score),
        date: new Date()
    };
    console.log('Adding new action:', newAction);
    storage.addAction(newAction);
    updateTotalScore();
    updateActionsList();
}


// Funzione per eliminare un'azione
function deleteAction(id) {
    console.log('deleteAction called with id:', id);
    storage.removeAction(id);
    updateTotalScore();
    updateActionsList();
}

// Funzione per aggiornare il punteggio totale
function updateTotalScore() {
    const actions = storage.getActions();
    const totalScore = actions.reduce((sum, action) => sum + action.score, 0);
    document.getElementById('total-score').textContent = totalScore;
}

// Funzione per formattare la data
function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    return new Date(date).toLocaleDateString('it-IT', options);
}

// Funzione per aggiornare la lista delle azioni
function updateActionsList() {
    console.log('Updating actions list');
    const actionsList = document.getElementById('actions-list');
    actionsList.innerHTML = '';

    const actions = storage.getActions();
    console.log('Current actions:', actions);

    if (actions.length === 0) {
        const li = document.createElement('li');
        li.textContent = "Nessuna azione presente. Aggiungi la tua prima azione!";
        li.style.textAlign = "center";
        li.style.padding = "20px 0";
        actionsList.appendChild(li);
    } else {
        actions.sort((a, b) => new Date(b.date) - new Date(a.date));
        actions.forEach((action) => {
            const li = document.createElement('li');
            li.className = 'action-item';
            const emoji = action.score >= 0 ? '😊' : '😔';
            li.innerHTML = `
                <div class="action-content">
                    <span>${emoji} ${action.title}</span>
                    <span class="action-score ${action.score >= 0 ? 'positive' : 'negative'}">
                        ${action.score >= 0 ? '+' : ''}${action.score}
                    </span>
                </div>
                <small>${formatDate(new Date(action.date))}</small>
                <button class="delete-btn" data-id="${action.id}">❌</button>
            `;
            actionsList.appendChild(li);
        });
    }
}

document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('delete-btn')) {
        const id = e.target.getAttribute('data-id');
        console.log('Delete button clicked for id:', id);
        deleteAction(id);
    }
});

function handleDelete() {
    const id = parseInt(this.getAttribute('data-id'));
    console.log('Delete button clicked for id:', id);
    deleteAction(id);
}

// Event listener per il form di nuova azione
document.getElementById('new-action-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('action-title').value;
    const score = document.getElementById('action-score').value;
    addNewAction(title, score);
    this.reset();
});

// Inizializzazione
updateTotalScore();
updateActionsList();
