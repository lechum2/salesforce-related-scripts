'use strict';

const { execSync } = require( 'child_process' );

const orgFromAlias = process.argv[2];
const orgToAlias = process.argv[3];

const project_path = 'C:\\Users\\Y2DX\\workspace\\core';

function getInstalledPackages(orgAlias) {
    const orgFromPackages = execSync(`sf package installed list --target-org ${orgAlias} --json`, {
        cwd: project_path
    });
    const result = JSON.parse(orgFromPackages.toString());

    return result.result.map(x => (
        {
            [x.SubscriberPackageName]: {
                'version': x.SubscriberPackageVersionNumber,
                'installId': x.SubscriberPackageVersionId,
            }
        }
    ));
}

console.log(getInstalledPackages(orgFromAlias));
