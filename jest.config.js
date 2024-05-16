module.exports = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    preset: 'ts-jest',
    testTimeout: 20000, 
    moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
    transform: {
      '^.+\\.(ts|tsx)?$': 'ts-jest',
      '^.+\\.(js|jsx)$': 'babel-jest',
    }
  };

