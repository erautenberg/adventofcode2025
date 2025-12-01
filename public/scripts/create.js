const fs = require('fs-extra');

const {
  dayJSTemplate,
  dayTXTTemplate,
  dayHTMLTemplate
} = require('./templates');

const [dayNum] = process.argv.slice(2);

if (!dayNum) {
  throw new Error('Missing the number of day to create. Try again with something like: `npm run createDay 10`');
} else {
  const dayJSContent = dayJSTemplate(dayNum);
  const dayTXTContent = dayTXTTemplate(dayNum);
  const dayHTMLContent = dayHTMLTemplate(dayNum);

  fs.writeFile(`public/src/${dayNum}.js`, dayJSContent);
  fs.writeFile(`public/input/${dayNum}.txt`, dayTXTContent);
  fs.writeFile(`public/days/${dayNum}.html`, dayHTMLContent);

  console.log(`Day ${dayNum} files successfully created.`);
}

