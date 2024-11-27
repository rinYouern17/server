import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const router = express.Router();

let products = [];

// Load existing products from products.json if it exists
if (fs.existsSync('data/products.json')) {
  const data = fs.readFileSync('data/products.json');
  products = JSON.parse(data);
}

// Save products to products.json
const saveProductsToFile = () => {
  const data = JSON.stringify(products, null, 2);
  fs.writeFile('data/products.json', data, (err) => {
    if (err) {
      console.error('Error writing to file', err);
    } else {
      console.log('Successfully wrote to products.json');
    }
  });
};

// Get all products
router.get('/', (req, res) => {
  res.send(products);
});

// Create a new product
router.post('/', (req, res) => {
  const product = req.body;
  products.push({ ...product, id: uuidv4() });
  saveProductsToFile();
  res.send(`Product with the name ${product.name} added to the database!`);
});

// Get a product by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const foundProduct = products.find((product) => product.id === id);
  res.send(foundProduct);
});

// Update a product by ID
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;

  const product = products.find((product) => product.id === id);

  if (product) {
    if (name) product.name = name;
    if (price) product.price = price;
    if (description) product.description = description;

    saveProductsToFile();
    res.send(`Product with the id ${id} has been updated.`);
  } else {
    res.status(404).send('Product not found');
  }
});

// Delete a product by ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  products = products.filter((product) => product.id !== id);
  saveProductsToFile();
  res.send(`Product with the id ${id} deleted from the database!`);
});

export default router;
