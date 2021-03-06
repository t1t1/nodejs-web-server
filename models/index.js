const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'local';
const config = require(`${__dirname}/../config/config.json`)[env];
const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

fs.readdirSync(__dirname)
    .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
    .forEach((file) => {
        const model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

// sync db
// insert seeders
sequelize.sync()
    .then(() => {
        fs.readdirSync(`${__dirname}/../seeders`)
            .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
            .forEach((file) => {
                const seed = require(path.join(`${__dirname}/../seeders`, file));
                seed.up(sequelize.queryInterface, Sequelize);
            });
    });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
