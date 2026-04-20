const fs = require('fs-extra');
const csv = require('csvtojson');

const csvFilePath = process.argv[2];
const outputFile = process.argv[3];

if (!csvFilePath || !outputFile) {
  console.log('Error: Please specify a CSV file and output file to generate icons.');
  console.log('Usage: node generateIconLibrary.js path-to-icon-csv-file.csv path-to-output-file.ts');
  process.exit(0);
}

csv()
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    const icons = jsonObj.reduce((cur, icon) => {
      let key = `${icon.Library}-${icon.Weight}`.toLowerCase();
      if (key.charAt(key.length - 1) === '-') return cur;
      key = `@fortawesome/${key}-svg-icons`;

      icon = {
        import: `import { ${icon['FA Name']} as ${icon.Name}} from '${key}';`,
        export: `${icon.Name}`,
      };

      if (cur[key]) {
        cur[key].push(icon);
      } else {
        cur[key] = [icon];
      }
      return cur;
    }, {});

    let importText = '';
    let exportText = 'export const IconEnum = {';

    Object.values(icons).flat().forEach((icon) => {
      importText += `${icon.import}\n`;
      exportText += `\n  ${icon.export},`;
    });
    exportText += '\n};\n';

    const finalText = `${importText}\n${exportText}`;
    return finalText;
  })
  .then(async (finalText) => fs.writeFile(outputFile, finalText, 'utf8'))
  .catch((e) => console.error(e));

console.log('Finished');
