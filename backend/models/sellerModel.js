
module.exports = (sequelize, DataTypes) => {

    const Seller = sequelize.define("seller", {
        sellerId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type:DataTypes.STRING,
            allowNull:false
        },
        email: {
            type:DataTypes.STRING,
            allowNull:false,
            unique: true
        },
        contact: {
            type:DataTypes.STRING,
            allowNull: true,
        },
        password: {
            type:DataTypes.STRING,
            allowNull:false
        }
    });

    return Seller;
}