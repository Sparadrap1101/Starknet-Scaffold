#!/usr/bin/env node
import { promisify } from "util";
import cp from "child_process";
import path from "path";
import fs from "fs";
// cli spinners
import ora from "ora";

// convert libs to promises
const exec = promisify(cp.exec);
const rm = promisify(fs.rm);

if (process.argv.length < 3) {
  console.log("You have to provide an app name and optionally choose if you need a basic boilerplate or a full debugger.");
  console.log("For example :");
  console.log("    npx create-starknetkit-app my-app basic");
  process.exit(1);
}

const projectName = process.argv[2];
const projectType = process.argv[3];
const currentPath = process.cwd();

const projectPath = path.join(currentPath, projectName);

// get github repo
const git_repo = "https://github.com/argentlabs/Starknet-Scaffold.git";

// create project directory
if (fs.existsSync(projectPath)) {
  console.log(`The file ${projectName} already exist in the current directory, please give it another name.`);
  process.exit(1);
}
else {
  fs.mkdirSync(projectPath);
}

try {
  const gitSpinner = ora("Downloading files...").start();
  // clone the repo into the project folder -> creates the new boilerplate
  await exec(`git clone --depth 1 ${git_repo} ${projectPath} --quiet`);
  gitSpinner.succeed();

  let basicCleanupTasks = [];
  if (projectType === "basic") {
    const FRONTEND_BASE_PATH = "frontend/src/app";
    const componentsToRemove = [
      "devnet",
      `${FRONTEND_BASE_PATH}/burner`,
      `${FRONTEND_BASE_PATH}/wikipedia`,
      `${FRONTEND_BASE_PATH}/scaffold-deployer`,
      `${FRONTEND_BASE_PATH}/address-book`,
      `${FRONTEND_BASE_PATH}/components/Burner`,
      `${FRONTEND_BASE_PATH}/components/BurnerWallet`,
      `${FRONTEND_BASE_PATH}/components/ScaffoldDeployer`,
      `${FRONTEND_BASE_PATH}/components/AssetTransferModal.tsx`,
      `${FRONTEND_BASE_PATH}/components/ConnectionModal.tsx`,
      `${FRONTEND_BASE_PATH}/components/ContractExecutionModal.tsx`,
    ];
    basicCleanupTasks.push(
      ...componentsToRemove.map((comp) =>
        rm(path.join(projectPath, comp), {
          recursive: true,
          force: true,
        }),
      ),
    );
  }

  // remove useless files
  const cleanSpinner = ora("Removing useless files").start();
  const rmGit = rm(path.join(projectPath, ".git"), {
    recursive: true,
    force: true,
  });
  const rmGithub = rm(path.join(projectPath, ".github"), {
    recursive: true,
    force: true,
  });
  const rmContributing = rm(path.join(projectPath, "CONTRIBUTING.md"), {
    recursive: true,
    force: true,
  });
  const rmBin = rm(path.join(projectPath, "bin"), {
    recursive: true,
    force: true,
  });
  const rmBurner = rm(path.join(projectPath, "burner"), {
    recursive: true,
    force: true,
  });
  const rmWebsite = rm(path.join(projectPath, "website"), {
    recursive: true,
    force: true,
  });
  const rmDocs = rm(path.join(projectPath, "docs"), {
    recursive: true,
    force: true,
  });
  await Promise.all([
    rmGit,
    rmBin,
    rmGithub,
    rmContributing,
    rmBurner,
    rmWebsite,
    rmDocs,
    ...basicCleanupTasks,
  ]);

  process.chdir(projectPath);
  // remove the packages needed for cli
  await exec("npm uninstall ora cli-spinners");
  cleanSpinner.succeed();

  // install dependencies
  const npmSpinner = ora("Installing dependencies...").start();
  await exec("npm run install");
  npmSpinner.succeed();

  console.log("The installation is done!");
  console.log("You can now run the scaffold with:");
  console.log(`    cd ${projectName}`);
  console.log(`    npm run start`);
} catch (error) {
  // clean up in case of error, so the user does not have to do it manually
  fs.rmSync(projectPath, { recursive: true, force: true });
  console.log(error);
}
