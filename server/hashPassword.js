// hashPassword.js
import bcrypt from 'bcryptjs';
/*
bcrypt.hash('admin@123', 10, (err, hash) => {
  console.log(hash);
});
*/

bcrypt.hash('user@123', 10, (err, hash) => {
  console.log(hash);
});