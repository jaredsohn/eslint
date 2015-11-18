/**
 * @fileoverview Tools for obtaining SourceCode objects.
 * @author Ian VanSchooten
 * @copyright 2016 Ian VanSchooten. All rights reserved.
 * See LICENSE in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assign = require("object-assign"),
    CLIEngine = require("../cli-engine"),
    eslint = require("../eslint"),
    globUtil = require("./glob-util"),
    defaultOptions = require("../../conf/cli-options");

defaultOptions = assign({}, defaultOptions, {cwd: process.cwd()});

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Get the SourceCode object for a single file
 * @param   {string}     filename The fully resolved filename to get SourceCode from.
 * @param   {Object}     options  A CLIEngine options object.
 * @returns {SourceCode}          The SourceCode object representing the file.
 */
function getSourceCodeOfFile(filename, options) {
    var opts = assign({}, options, { rules: {}});
    var cli = new CLIEngine(opts);
    cli.executeOnFiles([filename]);
    var sourceCode = eslint.getSourceCode();
    return sourceCode;
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------


/**
 * This callback is used to measure execution status in a progress bar
 * @callback progressCallback
 * @param {number} The total number of times the callback will be called.
 */

/**
 * Gets the SourceCode of a single file, or set of files.
 * @param   {string[]|string}  patterns   A filename, directory name, or glob,
 *                                        or an array of them
 * @param   {Object}           [options]  A CLIEngine options object. If not provided,
 *                                        the default cli options will be used.
 * @param   {progressCallback} [cb]       Callback for reporting execution status
 * @returns {Object}                      The SourceCode of all processed files.
 */
function getSourceCodeOfFiles(patterns, options, cb) {
    var sourceCodes = {},
        filenames;

    if (typeof patterns === "string") {
        patterns = [patterns];
    }

    if (typeof options === "undefined") {
        options = defaultOptions;
    } else if (typeof options === "function") {
        cb = options;
    } else if (typeof options === "object") {
        options = assign({}, defaultOptions, options);
    }

    patterns = globUtil.resolveFileGlobPatterns(patterns, options.extensions);
    filenames = globUtil.listFilesToProcess(patterns, options);
    filenames.forEach(function(filename) {
        var sourceCode = getSourceCodeOfFile(filename, options);
        if (sourceCode) {
            sourceCodes[filename] = sourceCode;
        }
        if (cb) {
            cb(filenames.length); // eslint-disable-line callback-return
        }
    });
    return sourceCodes;
}

module.exports = {
    getSourceCodeOfFiles: getSourceCodeOfFiles
};
