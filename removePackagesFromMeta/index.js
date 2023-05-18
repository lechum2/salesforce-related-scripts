import { glob } from 'glob';
import { readFileSync } from 'fs';
import { XMLParser } from 'fast-xml-parser';

const files = await glob('../../core/force-app/main/default/classes/**/*meta.xml', { stat: true, withFileTypes: true });
const parser = new XMLParser();
for (const file of files) {
    const xmlFile = readFileSync(file.fullpath(), 'utf8');
    if (!xmlFile.includes('<packageVersions>')) {
        continue;
    }
    let json = parser.parse(xmlFile);
    delete json['ApexClass']['packageVersions'];
    console.log(json);
}
