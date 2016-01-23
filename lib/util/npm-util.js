/**
 * @fileoverview Utility for executing npm commands.
 * @author Ian VanSchooten
 * @copyright 2016 Ilya Volodin. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var execSync = require("child_process").execSync;

//------------------------------------------------------------------------------
// Private
//------------------------------------------------------------------------------

/**
 * Install node modules synchronously and save to devDependencies in package.json
 * @param   {string|string[]} packages Node module or modules to install
 * @returns {void}
 */
function installSyncSaveDev(packages) {
    if (Array.isArray(packages)) {
        packages = packages.join(" ");
    }
    execSync("npm i --save-dev " + packages, {stdio: "inherit"});
}

/**
 * Check whether a node module or set of node modules is installed within a project
 * Assumes cwd is within the project.
 *
 * @param   {string|string[]} packages Node module or modules to check.
 * @returns {Object}                   An object whose keys are the module names
 *                                     and values are booleans indicating installation.
 */
function checkInstalled(packages) {
    var pkgString,
        result,
        dependencies;

    if (typeof packages === "string") {
        pkgString = packages;
        packages = [packages];
    } else if (Array.isArray(packages)) {
        pkgString = packages.join(" ");
    }

    try {
        result = execSync("npm ls " + pkgString + " --json --depth=0", { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8" });
        dependencies = Object.keys(JSON.parse(result).dependencies);
        return packages.reduce(function(status, pkgName) {
            status[pkgName] = dependencies.indexOf(pkgName) > -1;
            return status;
        }, {});
    } catch (err) { // error is thrown if no matches were found
        return packages.reduce(function(status, pkgName) {
            status[pkgName] = false;
            return status;
        }, {});
    }
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = {
    installSyncSaveDev: installSyncSaveDev,
    checkInstalled: checkInstalled
};
