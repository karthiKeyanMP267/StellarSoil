// hashPassword.js
import bcrypt from 'bcryptjs';

const password = 'admin@123';
if (!password) {
  console.log('Usage: node hashPassword.js <password>');
  process.exit(1);
}

bcrypt.genSalt(10, (err, salt) => {
  if (err) throw err;
  bcrypt.hash(password, salt, (err, hash) => {
    if (err) throw err;
    console.log('Hashed password:', hash);
  });
});