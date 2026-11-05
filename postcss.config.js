// postcss.config.js
module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': 'postcss-nesting',
    tailwindcss: {},
    'postcss-preset-env': {
      features: {
        'nesting-rules': true,
        // Keep logical properties (inset-inline-start, margin-inline, ...) as written.
        // Converting them to left/right breaks right-to-left (Arabic) layouts.
        'logical-properties-and-values': false,
        'logical-overflow': false,
        'logical-overscroll-behavior': false,
        'float-clear-logical-values': false,
      },
    },
  }
}
