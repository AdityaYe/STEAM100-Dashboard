const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src/tests"],
  setupFilesAfterEnv: [
    "<rootDir>/src/tests/setup.ts"
  ],
  testTimeout: 30000
};