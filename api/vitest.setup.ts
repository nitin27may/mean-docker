// The API refuses to boot without a real SECRET, which is the behaviour under
// test elsewhere. Give the rest of the suite a valid one.
process.env.SECRET = 'test-secret-that-is-at-least-32-characters-long';
process.env.MONGO_DB_USERNAME = 'testuser';
process.env.MONGO_DB_PASSWORD = 'testpassword';
process.env.MONGO_DB_HOST = 'localhost';
process.env.MONGO_DB_PORT = '27017';
process.env.MONGO_DB_DATABASE = 'test_db';
process.env.MONGO_DB_PARAMETERS = '?authSource=admin';
