const query = require("./config/db");

async function migrateTable() {
  try {
    const user = await query("CREATE TABLE IF NOT EXISTS users ( \
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT, \
    username TEXT UNIQUE, \
    hashed_password TEXT, \
    salt TEXT, \
    name TEXT, \
    email TEXT UNIQUE, \
    email_verified INT(1) \
  )");

    await query("CREATE TABLE IF NOT EXISTS federated_credentials ( \
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT, \
    user_id INT NOT NULL, \
    provider TEXT NOT NULL, \
    subject TEXT NOT NULL, \
    UNIQUE (provider, subject) \
  )");

    await query("CREATE TABLE IF NOT EXISTS todos ( \
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT, \
    owner_id INT NOT NULL, \
    title TEXT NOT NULL, \
    completed INT \
  )");

  process.exit();

  } catch (error) {
    console.log(error);
  }

}

migrateTable();