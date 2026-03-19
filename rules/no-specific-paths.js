const path = require('path');

const noSpecificPathsRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow adding code to the path',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [
      {
        type: 'array',
        minItems: 1,
        uniqueItems: true,
        items: { type: 'string' },
      },
    ],
  },
  create: function (context) {
    const disallowedPaths = context.options[0] ?? [];

    if (!disallowedPaths.length) {
      return {};
    }

    const absoluteDisallowedPaths = disallowedPaths.map((p) => path.resolve(p));
    const currentFilePath = context.getFilename();
    const absoluteCurrentFilePath = path.resolve(currentFilePath);
    const isDisallowed = absoluteDisallowedPaths.some((disallowedPath) =>
      absoluteCurrentFilePath.startsWith(disallowedPath)
    );

    if (isDisallowed) {
      context.report({
        message: `Adding code to the paths ${disallowedPaths} is not allowed.`,
        loc: { line: 1, column: 0 },
      });
    }

    return {};
  },
};

module.exports = noSpecificPathsRule;