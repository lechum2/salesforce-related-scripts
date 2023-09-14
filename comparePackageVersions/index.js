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

    return result.result.reduce(
        (resultMap, current) => resultMap.set(
            current.SubscriberPackageName,
            {
                'version': current.SubscriberPackageVersionNumber,
                'installId': current.SubscriberPackageVersionId
            }
        ),
        new Map()
    );
}

const fromOrgPackages = getInstalledPackages(orgFromAlias);
const toOrgPackages = getInstalledPackages(orgToAlias);

for (const packageName of fromOrgPackages.keys()) {
    const fromOrgPackage = fromOrgPackages.get(packageName);
    const toOrgPackage = toOrgPackages.get(packageName);
    if (!toOrgPackage) {
        console.log(`package: ${packageName} is not installed on ${orgToAlias}: ${fromOrgPackage.installId}`);
        continue;
    }
    if (fromOrgPackage.version != toOrgPackage.version) {
        console.log(`${packageName}  ${fromOrgPackage.version} ${toOrgPackage.version}  ${fromOrgPackage.installId}\n`);
    }
}

