const { where } = require('sequelize')
const db = require('../models')
const jwt = require('jsonwebtoken')

//create main model
const Seller = db.sellers

//main work


// Seller register
const addSeller = async (req, res) => {
    try {
        const { name, email, contact, password } = req.body;

        // Ensure all required fields are provided
        if (!name || !email || !contact || !password) {
            return res.status(400).send({ message: "All fields are required" });
        }

        const info = { name, email, contact, password };

        // Create a new seller in the database
        const seller = await Seller.create(info);
        res.status(201).send(seller);  
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).send({ message: "Error registering seller" });
    }
};

//seller login
const loginSeller= async (req,res) => {
    const {email, password} = req.body;

    try{
        //check seller with the given email
        const seller = await Seller.findOne({where:{email}})
        if(!seller){
            return res.status(404).json({message: "Seller not found!"})
        }

        //validate password
        const isValidPassword = await compare(password, seller.password)
        if(!isValidPassword){
            return res.status(401).json({message: "invalid password! "})
        }

        //create JWT token
        const token = jwt.sign({sellerId: seller.sellerId}, process.env.JWT_SECRET_KEY, {expiresIn:'3h'})

        res.status(200).json({message:"Login Successful! " + token})
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Internal server error! "})
    }
}

//get single seller
const getSingleSeller = async (req,res) => {
    try{
        const id = req.params.id;
        const seller = await Seller.findByPk(id);

        if(!seller){
            return res.status(404).send({message: "Seller not found"})
        }

        res.status(200).send(seller)
    }catch(error){
        console.log(error);
        res.status(500).send({message: "Error retrieving seller with ID: " + id })
    }
}

module.exports = {
    addSeller,
    loginSeller,
    getSingleSeller
}