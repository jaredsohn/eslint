/**
 * @fileoverview Tests for rule fixer.
 * @author Ian VanSchooten
 * @copyright 2016 Ian VanSchooten. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    npmUtil = require("../../../lib/util/npm-util");


describe("npmUtil", function() {

    describe("checkInstalled()", function() {
        var installStatus;

        before(function() {
            this.timeout(4000); // eslint-disable-line no-invalid-this
            installStatus = npmUtil.checkInstalled(["debug", "mocha", "notarealpackage", "jshint"]);
        });

        it("should find a direct dependency of the project", function() {
            assert.isTrue(installStatus.debug);
        });

        it("should find a dev dependency of the project", function() {
            assert.isTrue(installStatus.mocha);
        });

        it("should not find non-dependencies", function() {
            assert.isFalse(installStatus.notarealpackage);
        });

        it("should not find nested dependencies", function() {
            assert.isFalse(installStatus.jshint);
        });

        it("should return false for a single, non-existent package provided as a string", function() {
            this.timeout(4000); // eslint-disable-line no-invalid-this
            installStatus = npmUtil.checkInstalled("notarealpackage");
            assert.isFalse(installStatus.notarealpackage);
        });
    });
});
