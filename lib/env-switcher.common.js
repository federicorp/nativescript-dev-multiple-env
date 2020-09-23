"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
class EnvSwitcherCommon {
    constructor(logger, platformData, projectData, environmentName) {
        this.logger = logger;
        this.platformData = platformData;
        this.projectData = projectData;
        this.environmentName = environmentName;
        this.rules = this.readRules();
        this.androidPlatformFolder = path.join(this.projectData.platformsDir, 'android');
        this.androidAppResourcesFolder = path.join(this.projectData.appResourcesDirectoryPath, 'Android');
        this.iosPlatformFolder = path.join(this.projectData.platformsDir, 'ios');
        this.iosAppResourcesFolder = path.join(this.projectData.appResourcesDirectoryPath, 'iOS');
        this.logger.info(`Using ${this.environmentName}.`);
    }
    get currentEnvironment() {
        let foundRules = this.rules.environments.find(envs => envs.name === this.environmentName);
        if (foundRules) {
            return foundRules;
        }
        else {
            this.logger.fatal("Unable to find Rules for Environment: " + this.environmentName);
        }
    }
    readRules() {
        const ruleFile = path.join(this.projectData.projectDir, "environment-rules.json");
        if (fs.existsSync(ruleFile)) {
            this.logger.debug("Environment Rules found, reading contents");
            return JSON.parse(fs.readFileSync(ruleFile).toString());
        }
        else {
            this.logger.fatal("Environment Rules File does not exist, Skipping....");
            return;
        }
    }
    copyFiles(inputFolder) {
        const matchesRules = new RegExp(this.currentEnvironment.copyRules);
        let dirName = inputFolder.indexOf(this.projectData.$projectHelper.cachedProjectDir) < 0 ? path.join(this.projectData.$projectHelper.cachedProjectDir, inputFolder) : inputFolder;
        const dir = fs.readdirSync(dirName);
        const getNewFilename = function (file) {
            let fileNameParts = file.split(".");
            let ext = fileNameParts[fileNameParts.length - 1];
            let fileName = fileNameParts[0];
            return `${fileName}.${ext}`;
        };
        const testForRelease = file => {
            const filePath = path.join(inputFolder, file);
            try {
                const stat = fs.statSync(filePath);
                if (stat.isDirectory()) {
                    fs.readdirSync(filePath).forEach(testForRelease);
                }
                else {
                    if (matchesRules.test(file)) {
                        const fileContents = fs.readFileSync(filePath).toString();
                        const newFileName = getNewFilename(file);
                        const newFilePath = path.join(inputFolder, newFileName);
                        if (!this.doesSourceMatchDestination(filePath, newFilePath)) {

                            fs.writeFileSync(newFilePath, fileContents);
                        }
                        else {
                            this.logger.debug('Not writing new file, as file that exists matches the file that it will be replaced with.');
                        }
                    }
                }
            }
            catch (_a) { }
        };
        dir.forEach(testForRelease);
    }
    doesSourceMatchDestination(sourcePath, destinationPath) {
        let sourceFileContents, destinationFileContents;
        if (fs.existsSync(sourcePath)) {
            sourceFileContents = fs.readFileSync(sourcePath).toString();
        }
        else {
            this.logger.fatal('Source File: (' + sourcePath + ') does not exist!');
        }
        if (fs.existsSync(destinationPath)) {
            destinationFileContents = fs.readFileSync(destinationPath).toString();
        }
        else {
            this.logger.debug('Destination File: ( ' + destinationPath + ' ) does not exist!');
            return false;
        }
        return sourceFileContents === destinationFileContents;
    }
    changePackageId() {
        this.logger.info(`Updating project Identifier to ${this.currentEnvironment.packageId}`);
        const packageJSONFile = path.join(this.projectData.projectDir, 'package.json');
        const packageJSONBackup = path.join(this.projectData.projectDir, 'package.orig.json');
        const packageJSON = JSON.parse(fs.readFileSync(packageJSONFile).toString());
        const gradleFile = path.resolve(this.projectData.appResourcesDirectoryPath, 'Android', 'app.gradle');
        const gradleBackup = path.resolve(this.projectData.appResourcesDirectoryPath, 'Android', 'app.gradle.bak');
        this.projectData.projectIdentifiers.ios = this.projectData.projectIdentifiers.android = this.currentEnvironment.packageId;

        try {
            if (fs.existsSync(gradleFile)) {
                const currentGradleFile = fs.readFileSync(gradleFile).toString();
                fs.writeFileSync(gradleBackup, currentGradleFile);
                const oldApplicationId = /applicationId = "([A-Za-z]{1}[A-Za-z\d_]*\.)*[A-Za-z][A-Za-z\d_]*"/;
                const newApplicationId = `applicationId = "${this.currentEnvironment.packageId}"`;
                const modifiedGradleFile = currentGradleFile.replace(oldApplicationId, newApplicationId);
                fs.writeFileSync(gradleFile, modifiedGradleFile);
            }
            else {
                this.logger.info('appResourcesFile: ' + this.projectData.appResourcesDirectoryPath);
                this.logger.info('Project File Path: ' + this.projectData.projectFilePath);
                this.logger.fatal(`Unable to find Gradle file to replace, looked at ${gradleFile}`);
            }
        }
        catch (e) {
            throw e;
        }
    }
    maybeCreateEnvironmentRules() {
        const projectRules = path.join(this.projectData.projectDir, 'environment-rules.json');
        if (!fs.existsSync(projectRules)) {
            this.logger.info('Environment Rules file does not exist, creating a basic one now.');
            const environmentRules = {
                "version": "1.0.0",
                "default": "staging",
                "extraPaths": [
                    "app/environments"
                ],
                "environments": [
                    create_environment('staging'),
                    create_environment('release')
                ]
            };
            fs.writeFileSync(projectRules, JSON.stringify(environmentRules, null, 4));
        }
    }
    copyResources() { }
    ;
    copyExtraFolders() {
        this.rules.extraPaths.forEach((filePath) => {
            this.copyFiles(filePath);
        });
    }
    run() {
        this.maybeCreateEnvironmentRules();
        this.changePackageId();
        this.copyResources();
        this.copyExtraFolders();
    }
}
exports.EnvSwitcherCommon = EnvSwitcherCommon;
function create_environment(versionName) {
    return {
        name: versionName,
        packageId: `org.nativescript.appName.${versionName}`,
        copyRules: `(.*\\.${versionName}\\..*)`
    };
}
