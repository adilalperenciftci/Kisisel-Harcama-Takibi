let expenseData = {
    labels: [],
    datasets: [{
        label: 'Harcamalar',
        data: [],
        backgroundColor: [],
        hoverOffset: 4
    }]
};

let chart = new Chart(document.getElementById('expenseChart'), {
    type: 'pie',
    data: expenseData,
    options: {
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Harcama Kategorileri'
            }
        }
    },
});

document.getElementById('expense-form').addEventListener('submit', function (e) {
    e.preventDefault();

    let description = document.getElementById('description').value;
    let category = document.getElementById('category').value;
    let amount = document.getElementById('amount').value;
    let date = document.getElementById('date').value;

    if (description && amount && category && date) {
        let expense = { description, category, amount, date };
        addExpenseToList(description, category, amount, date, true);
        addDataToChart(category, parseFloat(amount));
        saveExpensesToLocalStorage(expense);
        clearFormFields();
    } else {
        alert("Lütfen tüm alanları doldurun.");
    }
});

function addExpenseToList(description, category, amount, date, isEditing = false) {
    const list = document.getElementById('expense-list');
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.innerHTML = `${date} - ${category}: ${description} - ${amount} TL`;

    // Silme butonu
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Sil';
    deleteBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'ml-2');
    deleteBtn.onclick = function () {
        listItem.remove();
        removeFromLocalStorage(description, category, amount, date);
        removeDataFromChart(category, parseFloat(amount));
    };
    listItem.appendChild(deleteBtn);

    // Düzenleme butonu
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Düzenle';
    editBtn.classList.add('btn', 'btn-secondary', 'btn-sm', 'ml-2');
    editBtn.onclick = function () {
        loadExpenseToForm(description, category, amount, date);
        listItem.remove();
        removeFromLocalStorage(description, category, amount, date);
        removeDataFromChart(category, parseFloat(amount));
    };
    listItem.appendChild(editBtn);

    if (!isEditing) {
        list.appendChild(listItem);
    } else {
        list.insertBefore(listItem, list.firstChild);
    }
}

// Diğer fonksiyonlar ve kodlar buraya eklenmiştir.
// ... (Önceki kodlar)

function loadExpenseToForm(description, category, amount, date) {
    document.getElementById('description').value = description;
    document.getElementById('category').value = category;
    document.getElementById('amount').value = amount;
    document.getElementById('date').value = date;
}

function addDataToChart(category, amount) {
    let categoryIndex = expenseData.labels.indexOf(category);

    if (categoryIndex !== -1) {
        expenseData.datasets[0].data[categoryIndex] += amount;
    } else {
        expenseData.labels.push(category);
        expenseData.datasets[0].data.push(amount);
        expenseData.datasets[0].backgroundColor.push(getRandomColor());
    }

    chart.update();
}

function removeDataFromChart(category, amount) {
    let categoryIndex = expenseData.labels.indexOf(category);
    if (categoryIndex !== -1) {
        expenseData.datasets[0].data[categoryIndex] -= amount;
        if (expenseData.datasets[0].data[categoryIndex] <= 0) {
            expenseData.datasets[0].data.splice(categoryIndex, 1);
            expenseData.labels.splice(categoryIndex, 1);
            expenseData.datasets[0].backgroundColor.splice(categoryIndex, 1);
        }
        chart.update();
    }
}

function removeFromLocalStorage(description, category, amount, date) {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses = expenses.filter(expense => !(expense.description === description && expense.category === category && expense.amount === amount && expense.date === date));
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function clearFormFields() {
    document.getElementById('description').value = '';
    document.getElementById('category').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('date').value = '';
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function saveExpensesToLocalStorage(expense) {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function loadExpensesFromLocalStorage() {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    for (let expense of expenses) {
        addExpenseToList(expense.description, expense.category, expense.amount, expense.date);
        addDataToChart(expense.category, parseFloat(expense.amount));
    }
}

// Uygulama başlatıldığında harcamaları yükleyin
loadExpensesFromLocalStorage();

// Kategoriye göre filtreleme özelliği
document.getElementById('filter-category').addEventListener('change', function (e) {
    filterExpensesByCategory(e.target.value);
});

function filterExpensesByCategory(category) {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let filteredExpenses = category === 'All' ? expenses : expenses.filter(expense => expense.category === category);

    // Mevcut listeyi temizle
    document.getElementById('expense-list').innerHTML = '';

    // Filtrelenmiş harcamaları listeye ekle
    filteredExpenses.forEach(expense => {
        addExpenseToList(expense.description, expense.category, expense.amount, expense.date);
    });
}

// ... (Diğer fonksiyonlarınız ve kodunuzun geri kalanı)
