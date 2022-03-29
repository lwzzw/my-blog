require('dotenv').config();

exports.DATABASEURL = process.env.DATABASEURL;
exports.USERNAME = process.env.NAME || 'admin';//admin name
exports.PASSWORD = process.env.PASSWORD || 'admin';//admin password
exports.PORT = process.env.PORT || 3000;
exports.TOKENSECURE = process.env.TOKENSECURE || 'default';
exports.CLOUD_NAME = process.env.CLOUD_NAME;
exports.CLOUD_API_KEY = process.env.CLOUD_API_KEY;
exports.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET;
exports.GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;