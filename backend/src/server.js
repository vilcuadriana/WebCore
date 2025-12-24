const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await sequelize.sync();
    console.log('DB conectată');

    app.listen(PORT, () => {
      console.log(`Server pornit pe http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Eroare la pornire server:', err);
  }
})();
