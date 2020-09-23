"use strict";
const env_switcher_android_1 = require("./env-switcher.android");
const env_switcher_ios_1 = require("./env-switcher.ios");
const hookArgReader = (args) => {
    if (typeof args !== 'string') {
        return Object.keys(args)[0];
    }
    else {
        return args;
    }
};
module.exports = function (androidResourcesMigrationService, logger, platformsDataService, projectData, hookArgs) {
    const platformName = hookArgs.prepareData.platform.toLowerCase();
    const platformData = platformsDataService.getPlatformData(platformName, projectData);
    let environmentName;
    if (hookArgs && hookArgs.prepareData && hookArgs.prepareData.env && hookArgs.prepareData.env.use) {
        environmentName = hookArgReader(hookArgs.prepareData.env.use);
    }
    else {
        environmentName = 'staging';
    }
    let envSwitcher;
    if (platformName === "android") {
        envSwitcher = new env_switcher_android_1.EnvSwitcherAndroid(androidResourcesMigrationService, logger, platformData, projectData, environmentName);
    }
    else if (platformName === "ios") {
        envSwitcher = new env_switcher_ios_1.EnvSwitcherIOS(logger, platformData, projectData, environmentName);
    }
    else {
        logger.warn(`Platform '${platformName}' isn't supported: skipping environment copy... `);
        return;
    }
    envSwitcher.run();
};
