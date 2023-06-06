const { connect, connection } = require('mongoose');

const connectionString =
  process.env.MONGODB_URI || 'mongodb+srv://teewalk32:Tevandbri!1@classactivities.gglazm9.mongodb.net/';

connect(connectionString);

module.exports = connection;
