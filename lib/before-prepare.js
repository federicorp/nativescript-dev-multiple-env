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
module.exports = function (androidResourcesMigrationService, logger, platformsData, projectData, hookArgs) {
    const platformName = hookArgs.platform.toLowerCase();
    const platformData = platformsData.getPlatformData(platformName, projectData);
    let environmentName;
    if (hookArgs && hookArgs.env && hookArgs.env.use) {
        environmentName = hookArgReader(hookArgs.env.use);
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
