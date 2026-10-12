const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'doctors.ts');
let code = fs.readFileSync(filePath, 'utf8');

code = code.replace(/id:\s*"doc-(\d+)",/g, (match, num) => {
  const n = parseInt(num, 10);
  const role = (n === 1 || n === 2) ? 'admin' : 'doctor';
  return `id: "doc-${n}",\n    orderNumber: ${n},\n    username: "dokter${n}",\n    password: "1234",\n    role: "${role}",`;
});

fs.writeFileSync(filePath, code, 'utf8');
console.log('SUCCESS: doctors.ts updated with orderNumber, username, password, and role!');
