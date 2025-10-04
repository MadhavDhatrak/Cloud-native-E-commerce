import User from '../models/User.js';
import bcrypt from 'bcryptjs';


export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create user with hashed password
        const user = await User.create({ 
            name, 
            email, 
            password: hashedPassword 
        });
        
        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(500).json({ 
            message: 'Error registering user',
            error: error.message 
        });
    }
}


export const getAllUsers = async (req, res) => {
    const users = await User.find();
    if(!users) {
        return res.status(404).json({ message: 'No users found' });
    }
    return res.status(200).json(users);
}


export const getUserById = async (req, res) => {
    const {id} = req.params;
    const user = await User.findById(id);
    if(!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
}

export const updateUser = async (req, res) => {
    const {id} = req.params;
    const {name, email, password} = req.body;
    const user = await User.findByIdAndUpdate(id, {name, email, password}, {new: true});
    if(!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
}

export const deleteUser = async (req, res) => {
    const {id} = req.params;
    const user = await User.findByIdAndDelete(id);
    if(!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User deleted successfully' });
}


export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        // Find user by email
        const user = await User.findOne({email});
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Verify password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        return res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(500).json({ 
            message: 'Error logging in',
            error: error.message 
        });
    }
}

