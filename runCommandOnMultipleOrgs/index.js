const { execSync, exec } = require("child_process");

const COMMAND_TEMPLATE =
    "sf org open -o {org} --path lightning/setup/CDPSetupHome/home";
const RUN_ASYNC = true;

const ORG_LIST = [];
const ORG_PREFIX = "bec.agenhack";
const ORG_START = 1;
const ORG_END = 20;

function getOrgs() {
    if (ORG_LIST.length > 0) {
        return ORG_LIST;
    }
    const orgs = [];
    for (let i = ORG_START; i <= ORG_END; i++) {
        orgs.push(`${ORG_PREFIX}${String(i).padStart(2, "0")}`);
    }
    return orgs;
}

function runForOrg(org) {
    const command = COMMAND_TEMPLATE.replace("{org}", org);
    console.log(`\n--- Running for ${org} ---`);
    console.log(`> ${command}`);

    if (RUN_ASYNC) {
        exec(command, (err, stdout) => {
            if (err) return console.error(`Error on ${org}: ${err.message}`);
            if (stdout) console.log(`[${org}] ${stdout}`);
        });
    } else {
        try {
            const output = execSync(command, { encoding: "utf8" });
            if (output) console.log(output);
        } catch (err) {
            console.error(`Error on ${org}: ${err.message}`);
        }
    }
}

getOrgs().forEach(runForOrg);
