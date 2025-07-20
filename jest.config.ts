import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  testMatch: ['<rootDir>/src/**/__tests__/**/*.{ts,tsx,js,jsx}'],
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 50,
      functions: 50,
      lines: 50,
    },
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/*.spec.{js,jsx,ts,tsx}',
    '!src/index.{js,jsx,ts,tsx}',
    '!src/setupTests.{js,ts}',
    '!src/**/*.d.ts',
    '!node_modules/',
  ],
};

export default config;
