import fs from 'node:fs';
import selfsigned from 'selfsigned';

if (fs.existsSync('./cert/key.pem') && fs.existsSync('./cert/cert.pem')) {
  console.log('Dev certificates already exist. Skipping generation.');
  process.exit(0);
}

const attrs = [{ name: 'commonName', value: 'localhost' }];
const options = {
  keySize: 2048,
  days: 365,
  extensions: [
    {
      name: 'subjectAltName',
      altNames: [
        { type: 2, value: 'localhost' }, // DNS
        { type: 7, ip: '127.0.0.1' }, // IP address
      ],
    },
  ],
};

const { private: key, cert } = selfsigned.generate(attrs, options);

fs.mkdirSync('./cert', { recursive: true });
fs.writeFileSync('./cert/key.pem', key);
fs.writeFileSync('./cert/cert.pem', cert);

console.log('Dev certificates generated successfully.');
