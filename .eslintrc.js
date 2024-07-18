module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    // prettier can be updated to error if you want to enforce formatting
    'prettier/prettier': 'warn',
  },
};
