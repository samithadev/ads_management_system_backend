module.exports = (sequelize, DataTypes) => {
    const Advertisement = sequelize.define("advertisement", {
        adId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        topic: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING, 
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2), // Assuming price is stored with 2 decimal places
            allowNull: false
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        telephoneNo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sellerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'sellers', // This is the name of the model
                key: 'sellerId'       // This is the name of the column
            }
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false // Default value is false, indicating not deleted
        }
        
    } , {
        timestamps: true, // Adds createdAt and updatedAt timestamps
    } );

    Advertisement.associate = models => {
        Advertisement.belongsTo(models.Seller, {
            foreignKey: 'sellerId',
            onDelete: 'CASCADE' 
        });
    };

    return Advertisement;
};