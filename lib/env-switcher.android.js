"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const env_switcher_common_1 = require("./env-switcher.common");
class EnvSwitcherAndroid extends env_switcher_common_1.EnvSwitcherCommon {
    constructor(androidResourcesMigrationService, logger, platformData, projectData, environmentName) {
        super(logger, platformData, projectData, environmentName);
        this.androidResourcesMigrationService = androidResourcesMigrationService;
        if (androidResourcesMigrationService.hasMigrated(projectData.appResourcesDirectoryPath)) {
            this.androidAppResourcesFolder = path_1.join(this.androidAppResourcesFolder, "src", "main", "res");
        }
    }
    copyResources() {
        this.copyFiles(this.androidAppResourcesFolder);
    }
}
exports.EnvSwitcherAndroid = EnvSwitcherAndroid;
