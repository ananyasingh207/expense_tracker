const API_URL = `${window.location.origin}/api/expenses`;
const form = document.getElementById('expense-form');
const expenseIdInput = document.getElementById('expense-id');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('date');
const descriptionInput = document.getElementById('description');
const submitBtn = document.getElementById('submit-btn');
const expenseList = document.getElementById('expense-list').querySelector('tbody');
const totalAmountSpan = document.getElementById('total-amount');
const errorMessage = document.getElementById('error-message');
const filterCategory = document.getElementById('filter-category');
const filterDate = document.getElementById('filter-date');
const formLoading = document.getElementById('form-loading');

document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, fetching expenses'); // Debug
    loadExpenses();
    form.addEventListener('submit', handleFormSubmit);
    filterCategory.addEventListener('change', applyFilters);
    filterDate.addEventListener('change', applyFilters);
});

function validateForm() {
    const amount = parseFloat(amountInput.value);
    console.log('Validating:', { amount, category: categoryInput.value, date: dateInput.value }); // Debug
    if (isNaN(amount) || amount <= 0) {
        showError('Amount must be a positive number');
        return false;
    }
    if (!categoryInput.value) {
        showError('Please select a category');
        return false;
    }
    if (!dateInput.value) {
        showError('Please select a date');
        return false;
    }
    return true;
}

function showError(message, isError = true) {
    console.log(`${isError ? 'Error' : 'Success'}: ${message}`); // Debug
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    errorMessage.classList.toggle('text-red-500', isError);
    errorMessage.classList.toggle('text-tealaccent', !isError);
    setTimeout(() => errorMessage.classList.add('hidden'), 3000);
}

async function loadExpenses(category = '', date = '') {
    try {
        document.getElementById('expense-list').classList.add('loading');
        
        const url = new URL(API_URL);
        if (category) url.searchParams.append('category', category);
        if (date) url.searchParams.append('date', date);
        console.log('Fetching filtered expenses from:', url.toString()); // Debug
        const filteredResponse = await fetch(url);
        if (!filteredResponse.ok) throw new Error(`HTTP ${filteredResponse.status}: Failed to load filtered expenses`);
        const filteredExpenses = await filteredResponse.json();

        console.log('Fetching all expenses for summary:', API_URL); // Debug
        const allResponse = await fetch(API_URL);
        if (!allResponse.ok) throw new Error(`HTTP ${allResponse.status}: Failed to load all expenses`);
        const allExpenses = await allResponse.json();

        renderExpenses(filteredExpenses, category, date);
        updateSummary(allExpenses);
    } catch (error) {
        showError(error.message);
    } finally {
        document.getElementById('expense-list').classList.remove('loading');
    }
}

function renderExpenses(expenses, category, date) {
    console.log('Rendering expenses:', expenses, 'Filters:', { category, date }); // Debug
    const fragment = document.createDocumentFragment();
    
    if (expenses.length === 0) {
        const row = document.createElement('tr');
        row.className = 'bg-offwhite h-8 xs:h-10 sm:h-12';
        row.innerHTML = `
            <td colspan="5" class="py-2 xs:py-3 sm:py-4 px-1 xs:px-2 sm:px-4 text-center text-tealaccent font-semibold rounded-md text-[10px] xs:text-xs sm:text-sm break-all" role="alert">
                ${category || date ? 'No results found for this category' : 'No expenses have been added yet'}
            </td>
        `;
        fragment.appendChild(row);
    } else {
        expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
        expenses.forEach((expense, index) => {
            const row = document.createElement('tr');
            row.className = `border-b border-mint ${index % 2 === 0 ? 'bg-white' : 'bg-offwhite'} hover:bg-mint/20 h-8 xs:h-10 sm:h-12`;
            row.innerHTML = `
                <td class="py-1 xs:py-2 sm:py-3 px-1 xs:px-2 sm:px-4 text-tealaccent font-medium rounded-md text-[10px] xs:text-xs sm:text-sm truncate">₹${parseFloat(expense.amount).toFixed(2)}</td>
                <td class="py-1 xs:py-2 sm:py-3 px-1 xs:px-2 sm:px-4 font-medium rounded-md text-[10px] xs:text-xs sm:text-sm truncate">${expense.category}</td>
                <td class="py-1 xs:py-2 sm:py-3 px-1 xs:px-2 sm:px-4 font-medium rounded-md text-[10px] xs:text-xs sm:text-sm truncate">${expense.date}</td>
                <td class="py-1 xs:py-2 sm:py-3 px-1 xs:px-2 sm:px-4 font-medium rounded-md text-[10px] xs:text-xs sm:text-sm break-all">${expense.description || 'N/A'}</td>
                <td class="py-1 xs:py-2 sm:py-3 px-1 xs:px-2 sm:px-4 flex space-x-0.5 xs:space-x-1 sm:space-x-2">
                    <button onclick="editExpense('${expense.id}')" class="bg-blueprimary text-white px-0.5 xs:px-1 sm:px-2 py-0.5 xs:py-1 rounded-md hover:bg-bluehover transition text-[10px] xs:text-xs sm:text-sm" aria-label="Edit expense">Edit</button>
                    <button onclick="deleteExpense('${expense.id}')" class="bg-red-500 text-white px-0.5 xs:px-1 sm:px-2 py-0.5 xs:py-1 rounded-md hover:bg-red-600 transition text-[10px] xs:text-xs sm:text-sm" aria-label="Delete expense">Delete</button>
                </td>
            `;
            fragment.appendChild(row);
        });
    }
    
    expenseList.innerHTML = '';
    expenseList.appendChild(fragment);
}

function updateSummary(expenses) {
    const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const categories = [...new Set(expenses.map(exp => exp.category))];

    totalAmountSpan.textContent = total.toFixed(2);

    const breakdownHTML = categories.map(category => {
        const categoryTotal = expenses
            .filter(exp => exp.category === category)
            .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
        return `${category}: ₹${categoryTotal.toFixed(2)}`;
    }).join('<br>');

    document.getElementById('category-breakdown').innerHTML = breakdownHTML;
}

async function handleFormSubmit(e) {
    e.preventDefault();
    console.log('Form submitted'); // Debug
    if (!validateForm()) return;

    formLoading.classList.remove('hidden');
    submitBtn.disabled = true;

    const expense = {
        amount: amountInput.value,
        category: categoryInput.value,
        date: dateInput.value,
        description: descriptionInput.value
    };
    const id = expenseIdInput.value;

    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_URL}/${id}` : API_URL;
        console.log(`Sending ${method} request to ${url}`, expense); // Debug
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expense)
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${id ? 'Failed to update expense' : 'Failed to add expense'}`);
        form.reset();
        expenseIdInput.value = '';
        submitBtn.textContent = 'Add Expense';
        showError(id ? 'Expense updated successfully' : 'Expense added successfully', false);
        await loadExpenses(); 
    } catch (error) {
        showError(error.message);
    } finally {
        formLoading.classList.add('hidden');
        submitBtn.disabled = false;
    }
}

async function editExpense(id) {
    try {
        console.log('Fetching expense:', id); // Debug
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to load expense`);
        const expense = await response.json();
        expenseIdInput.value = expense.id;
        amountInput.value = expense.amount;
        categoryInput.value = expense.category;
        dateInput.value = expense.date;
        descriptionInput.value = expense.description || '';
        submitBtn.textContent = 'Update Expense';
        amountInput.focus();
    } catch (error) {
        showError(error.message);
    }
}

async function deleteExpense(id) {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    try {
        console.log('Deleting expense:', id); // Debug
        document.getElementById('expense-list').classList.add('loading');
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to delete expense`);
        showError('Expense deleted successfully', false);
        await loadExpenses();
    } catch (error) {
        showError(error.message);
    } finally {
        document.getElementById('expense-list').classList.remove('loading');
    }
}

function applyFilters() {
    const category = filterCategory.value;
    const date = filterDate.value;
    console.log('Applying filters:', { category, date }); 
    loadExpenses(category, date);
}