import Product from '../models/Product.js';

export const createProduct = async (req, res) => {
    const { name, description, price, stock } = req.body;

    if(!name || !description || !price || !stock) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const product = await Product.create({ name, description, price, stock });
    return res.status(201).json(product);
}


export const getAllProducts = async (req, res) => {
    const products = await Product.find();
    return res.status(200).json(products);
}

export const getProductById = async (req, res) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    if(!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json(product);
}
   

export const updateProduct = async (req, res) => {
    const {id} = req.params;
    const {name, description, price, stock} = req.body;
    const product = await Product.findByIdAndUpdate(id, {name, description, price, stock}, {new: true});
    return res.status(200).json(product);
}


export const deleteProduct = async (req, res) => {
    const {id} = req.params;
    const product = await Product.findByIdAndDelete(id);
    if(!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json({ message: 'Product deleted successfully' });
}


