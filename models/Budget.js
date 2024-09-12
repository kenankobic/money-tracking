const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');

const Budget = sequelize.define('Budget', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'start_date',
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'end_date',
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
    },
});

// Associations
Budget.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Budget.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

module.exports = Budget;
