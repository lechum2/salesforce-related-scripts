import { glob } from 'glob';
import { readFileSync, writeFileSync } from 'fs';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

const META_NODE_NAME = 'ApexTrigger';
const META_PATH_NAME = 'triggers';

const files = await glob(`../../nyk/core/force-app/main/default/${META_PATH_NAME}/**/*meta.xml`, { stat: true, withFileTypes: true });
const parser = new XMLParser({
    ignoreAttributes: false
});
for (const file of files) {
    const xmlFile = readFileSync(file.fullpath(), 'utf8');
    if (!xmlFile.includes('<packageVersions>')) {
        continue;
    }
    let json = parser.parse(xmlFile);
    delete json[META_NODE_NAME]['packageVersions'];
    delete json['?xml'];
    json[META_NODE_NAME]['apiVersion'] = Number.parseFloat(json[META_NODE_NAME]['apiVersion']).toFixed(1);
    const builder = new XMLBuilder({
        arrayNodeName: META_NODE_NAME,
        format: true,
        indentBy: '    ',
        ignoreAttributes: false,
    });
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
${builder.build(json)}`;
    console.log(xmlContent);
    writeFileSync(file.fullpath(), xmlContent);
}
