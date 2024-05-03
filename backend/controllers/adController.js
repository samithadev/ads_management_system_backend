const { where, Model } = require("sequelize");
const db = require("../models");
const jwt = require("jsonwebtoken");

//create main model
const Advertisement = db.advertisements;
const Seller = db.sellers

//main work

//create advertisement
const createAdvertisement = async (req, res) => {
    try {
        const { topic, description, category, price, city, telephoneNo } = req.body;

        // Check if req.file contains the uploaded file
        if (!req.file) {
            return res.status(400).send({ message: "Image file is required" });
        }

        const image = req.file.filename;

        // Ensure all required fields are provided
        if (!topic || !description || !category || !price || !city || !telephoneNo) {
            return res.status(400).send({ message: "All fields are required" });
        }

        //get sellerId from token
        let sellerId;
        try {
            const token = req.headers.authorization.split(" ")[1];
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
            sellerId = decodedToken.sellerId;
        } catch (error) {
            console.log("Error verifying seller token: " + error);
            return res
                .status(401)
                .send({ message: "Need to login! Seller token is required or invalid" });
        }

        const info = { topic, description, category, image, price, city, telephoneNo, sellerId };

        // Create a new advertisement in the database
        const advertisement = await Advertisement.create(info);
        res.status(201).json({ message: "Ad sucessfully created! " });
    } catch (error) {
        console.log("Error: " + error);
        res.status(500).send({ message: "Error creating advertisement" });
    }
};

// Fetch advertisements by a specific seller
const getAdvertisementsBySeller = async (req, res) => {
    try {
        const sellerId = req.params.sellerId; 
        const {page, pageSize} = req.body;

        // Check if seller exists
        const seller = await Seller.findByPk(sellerId);
        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        const advertisements = await Advertisement.findAll({
            where: { sellerId: sellerId, isDeleted: false },
            order: [['createdAt', 'DESC']],
            offset: (page - 1) * pageSize,
            limit: pageSize
        });

        res.status(200).json(advertisements);
    } catch (error) {
        console.error("Error fetching advertisements for seller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//fetch advertisements with pagination & order
const getAdvertisements = async (req, res) => {
    try {
        
        const { page, pageSize, sortBy, category } = req.body;

        let order = [['createdAt', 'DESC']];
        if (sortBy === 'price') {
            order = [['price', 'ASC']];
        }

         // query conditions
         const queryConditions = {
            where: { isDeleted: false },
            order,
            offset: (page - 1) * pageSize,
            limit: pageSize,
        };

        // filter category 
        if (category) {
            queryConditions.where.category = category;
        }

        const advertisements = await Advertisement.findAll(queryConditions);

        // Check if there are no advertisements
        if (advertisements.length === 0) {
            return res.status(404).json({ message: "No advertisements found!" });
        }

        res.status(200).json(advertisements);
    } catch (error) {
        console.error("Error fetching advertisements:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//get single advertisement with seller details
const getSingleAdvertisement = async (req, res) => {
    try {
        const adId = req.params.id;
        const advertisement = await Advertisement.findByPk(adId, { 
            include: {
                model:Seller, 
                as:'seller', 
                attributes: ['name', 'email', 'contact']} 
            });

        if (!advertisement) {
            return res.status(404).json({ message: "Advertisement not found" });
        }

        res.status(200).json(advertisement);
    } catch (error) {
        console.error("Error fetching advertisement:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//update advertisement
const updateAdvertisement = async (req, res) => {

    try{
        const adId = req.params.id;
        const { topic, description, category, price, city, telephoneNo } = req.body;
        const image = req.file.filename;

        const advertisement = await Advertisement.findByPk(adId);

        if (!advertisement) {
            return res.status(404).json({ message: "Advertisement not found" });
        }

        // Check if the sellerId from the token matches the sellerId of the advertisement
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (decodedToken.sellerId !== advertisement.sellerId) {
            return res.status(403).json({ message: "You are not authorized to update this advertisement" });
        }

        info = {topic, description, category,image, price, city, telephoneNo}

        const updatedAd = await advertisement.update(info)

         res.status(200).json({message: "Advertisement updated! ", data: updatedAd});
    }catch (error) {

        console.error("Error update advertisement:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//delete advertisement 
const deleteAdvertisement = async (req, res) => {
    try {
            const adId = req.params.id;

            const advertisement = await Advertisement.findByPk(adId);

            if (!advertisement) {
                return res.status(404).json({ message: "Advertisement not found" });
            }

            // Check if the sellerId from the token matches the sellerId of the advertisement
            const token = req.headers.authorization.split(" ")[1];
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
            if (decodedToken.sellerId !== advertisement.sellerId) {
                return res.status(403).json({ message: "You are not authorized to delete this advertisement" });
            }

            // Update the isDeleted flag to true
            await advertisement.update({ isDeleted: true });

            res.status(200).json({ message: "Advertisement deleted successfully" });
        }catch (error) {

        console.error("Error deleting advertisement:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    createAdvertisement,
    getAdvertisements,
    getAdvertisementsBySeller,
    getSingleAdvertisement,
    updateAdvertisement,
    deleteAdvertisement
};
