module.exports = {
    moduleFileExtensions: ["js", "jsx", "json", "vue"],
    transform: {
        "^.+\\.(js|jsx)?$": "babel-jest"
    },
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1"
    },
    testMatch: [
        "<rootDir>/(tests/unit/**/*.(test|spec).(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)|*/*/__tests__/*.test.js)"
    ],
    transformIgnorePatterns: ["<rootDir>/node_modules/"]
};