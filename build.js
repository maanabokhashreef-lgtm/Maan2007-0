// أداة إعادة البناء — تحوّل ملفات src/*.jsx إلى ملفات js الجاهزة للنشر
// الاستخدام: npm install ثم npm run build
const babel = require('@babel/core');
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'src');
const OUT = path.join(__dirname, '..', 'js');

const files = [
  ['icons.jsx', 'app.icons.js'],
  ['core.jsx', 'app.core.js'],
  ['algo.jsx', 'app.algo.js'],
  ['components.jsx', 'app.components.js'],
  ['screens1.jsx', 'app.screens1.js'],
  ['screens2.jsx', 'app.screens2.js'],
  ['screens3.jsx', 'app.screens3.js'],
  ['App.jsx', 'app.js'],
];

for (const [inF, outF] of files) {
  const res = babel.transformFileSync(path.join(SRC, inF), {
    presets: [require.resolve('@babel/preset-react')],
    comments: false,
    compact: false,
  });
  const banner = '/* تم توليد هذا الملف تلقائياً من src/' + inF + ' — عدّل ملف المصدر ثم شغّل: npm run build */\n';
  fs.writeFileSync(path.join(OUT, outF), banner + res.code);
  console.log('OK ->', outF);
}
console.log('BUILD OK — حدّث الصفحة لرؤية التغييرات');
