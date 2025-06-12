module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.js"],
  testTimeout: 30000,
  // detectOpenHandles: false,
  // forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  // Uncomment to run tests serially to avoid memory server conflicts
  maxWorkers: 1,
};
