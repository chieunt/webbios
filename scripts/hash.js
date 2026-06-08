// Run in node
const crypto = require('crypto');

async function generate() {
  const password = "password123";
  const salt = crypto.randomBytes(16);
  
  crypto.pbkdf2(password, salt, 100000, 32, 'sha256', (err, derivedKey) => {
    if (err) throw err;
    const saltHex = salt.toString('hex');
    const hashHex = derivedKey.toString('hex');
    console.log(`${saltHex}:${hashHex}`);
  });
}

generate();
