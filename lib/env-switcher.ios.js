"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_switcher_common_1 = require("./env-switcher.common");
class EnvSwitcherIOS extends env_switcher_common_1.EnvSwitcherCommon {
    copyResources() {
        this.copyFiles(this.iosAppResourcesFolder);
    }
}
exports.EnvSwitcherIOS = EnvSwitcherIOS;
