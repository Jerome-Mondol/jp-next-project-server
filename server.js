const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const itemsFilePath = path.join(__dirname, 'items.json');

// Helper to read items
const readItems = () => {
  const data = fs.readFileSync(itemsFilePath);
  return JSON.parse(data);
};

// Helper to write items
const writeItems = (items) => {
  fs.writeFileSync(itemsFilePath, JSON.stringify(items, null, 2));
};

// GET /api/items
app.get('/api/items', (req, res) => {
  const items = readItems();
  res.json(items);
});

// GET /api/items/:id
app.get('/api/items/:id', (req, res) => {
  const items = readItems();
  const item = items.find(i => i.id == req.params.id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// POST /api/items
app.post('/api/items', (req, res) => {
  const items = readItems();
  const newItem = {
    id: items.length + 1,
    ...req.body
  };
  items.push(newItem);
  writeItems(items);
  res.status(201).json(newItem);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
