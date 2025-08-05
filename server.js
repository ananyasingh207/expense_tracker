const express = require('express');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const path = require('path');

const app = express();
const FILE_PATH = './expenses.json';
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); 

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

async function initializeFile() {
  try {
    await fs.access(FILE_PATH);
  } catch {
    await fs.writeFile(FILE_PATH, JSON.stringify([]));
  }
}

app.get('/api/expenses', async (req, res) => {
  try {
    const { category, date } = req.query;
    const data = await fs.readFile(FILE_PATH, 'utf8');
    let expenses = JSON.parse(data);
    if (category) expenses = expenses.filter(exp => exp.category === category);
    if (date) expenses = expenses.filter(exp => exp.date === date);
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load expenses' });
  }
});

app.get('/api/expenses/:id', async (req, res) => {
  try {
    const data = await fs.readFile(FILE_PATH, 'utf8');
    const expenses = JSON.parse(data);
    const expense = expenses.find(exp => exp.id === req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load expense' });
  }
});

app.post('/api/expenses', async (req, res) => {
  try {
    const { amount, category, date, description } = req.body;
    if (!amount || !category || !date) {
      return res.status(400).json({ message: 'Amount, category, and date are required' });
    }
    const data = await fs.readFile(FILE_PATH, 'utf8');
    const expenses = JSON.parse(data);
    const newExpense = { id: uuidv4(), amount, category, date, description: description || '' };
    expenses.push(newExpense);
    await fs.writeFile(FILE_PATH, JSON.stringify(expenses, null, 2));
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add expense' });
  }
});

app.put('/api/expenses/:id', async (req, res) => {
  try {
    const { amount, category, date, description } = req.body;
    if (!amount || !category || !date) {
      return res.status(400).json({ message: 'Amount, category, and date are required' });
    }
    const data = await fs.readFile(FILE_PATH, 'utf8');
    let expenses = JSON.parse(data);
    const index = expenses.findIndex(exp => exp.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Expense not found' });
    expenses[index] = { id: req.params.id, amount, category, date, description: description || '' };
    await fs.writeFile(FILE_PATH, JSON.stringify(expenses, null, 2));
    res.json(expenses[index]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update expense' });
  }
});

app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const data = await fs.readFile(FILE_PATH, 'utf8');
    let expenses = JSON.parse(data);
    const index = expenses.findIndex(exp => exp.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Expense not found' });
    expenses = expenses.filter(exp => exp.id !== req.params.id);
    await fs.writeFile(FILE_PATH, JSON.stringify(expenses, null, 2));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete expense' });
  }
});

initializeFile().then(() => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});
