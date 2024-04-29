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

//fetch advertisements with pagination & order
const getAdvertisements = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const pageSize = parseInt(req.query.pageSize, 10) || 10;

        const advertisements = await Advertisement.findAll({
            order: [['createdAt', 'DESC']],
            offset: (page - 1) * pageSize,
            limit: pageSize,
        });

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
        const advertisement = await Advertisement.findByPk(adId, { include: {model:Seller, as:'seller'} });

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

        info = {topic, description, category,image, price, city, telephoneNo}

        await advertisement.update(info)

         res.status(200).json({message: "Advertisement updated! "});
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

            await advertisement.destroy();

            res.status(200).json({ message: "Advertisement deleted successfully" });
        }catch (error) {

        console.error("Error deleting advertisement:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    createAdvertisement,
    getAdvertisements,
    getSingleAdvertisement,
    updateAdvertisement,
    deleteAdvertisement
};
