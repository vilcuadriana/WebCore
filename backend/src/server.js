const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 4000;

sequelize.sync().then(() => {
  console.log('DB conectată');
  app.listen(PORT, () => {
    console.log(`Server pornit pe http://localhost:${PORT}`);
  });
});