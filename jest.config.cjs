module.exports = {
    testEnvironment: 'node',
    testMatch: ['<rootDir>/backend/**/*.test.js'],
    verbose: true,
    forceExit: true,
    // cleanMocks: true,
	setupFilesAfterEnv: ['<rootDir>/backend/setupTests.js'],

};
