// Retry integration tests to avoid problems caused
// by parallel test execution using same entity ids.
jest.retryTimes(2);
