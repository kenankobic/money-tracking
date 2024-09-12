const sequelize = require('./config/database');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const Category = require('./models/Category');
const Budget = require('./models/Budget');

(async () => {
    try {
        await sequelize.sync({ force: true }); // Force true will drop and recreate tables
        console.log('Database synced!');
    } catch (error) {
        console.error('Error syncing database:', error);
    } finally {
        process.exit();
    }
})();
