'use strict';

const { execSync } = require( 'child_process' );
const semver = require('semver');
const argv = require('minimist')(process.argv.slice(2));

const orgFromAlias = argv._[0];
const orgToAlias = argv._[1];
const checkOnly = argv['check-only'];

const project_path = 'C:\\Users\\x9t\\workspace\\nyk\\core';
const packagesToSkip = ['bookme', 'NykreditAi'];

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

function installPackage(packageName, id, orgAlias) {
    if (checkOnly) {
        return
    }
    if (packagesToSkip.includes(packageName)) {
        return
    }
    console.log(`installing ${packageName} to ${orgAlias}`);
    try {
        const install = execSync(`sf package install --package ${id} --wait 20 --target-org ${orgAlias} --security-type AdminsOnly --apex-compile package --no-prompt --json`, {
            cwd: project_path,
        });
        const output = JSON.parse(install.toString());
        console.log(output.result.Status);

    } catch (error) {
        console.log(`installation of ${packageName} failed with error:`);
        const result = JSON.parse(error.stdout.toString());
        cosnole.log(result.message);
    }
}

const fromOrgPackages = getInstalledPackages(orgFromAlias);
const toOrgPackages = getInstalledPackages(orgToAlias);

for (const packageName of fromOrgPackages.keys()) {
    const fromOrgPackage = fromOrgPackages.get(packageName);
    const toOrgPackage = toOrgPackages.get(packageName);
    if (!toOrgPackage) {
        console.log(`package: ${packageName} is not installed on ${orgToAlias}: ${fromOrgPackage.installId}`);
        installPackage(packageName, fromOrgPackage.installId, orgToAlias);
        continue;
    }
    if (semver.gt(semver.coerce(fromOrgPackage.version), semver.coerce(toOrgPackage.version))) {
        console.log(`${packageName}  ${fromOrgPackage.version} ${toOrgPackage.version}  ${fromOrgPackage.installId}\n`);
        installPackage(packageName, fromOrgPackage.installId, orgToAlias);
    }
}

