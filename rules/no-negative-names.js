const { toKebabCase } = require('../utils/case');

const noNegativeNamesRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow negative variable and function names and suggest positive replacements',
      category: 'Best Practices',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
    messages: {
      noNegativeVarName:
        'Avoid using negative name "{{ name }}". Consider using "{{ suggestion }}" instead.',
    },
  },
  create: function (context) {
    const negativeMap = {
      disallow: 'allow',
      disable: 'enable',
      no: '',
      not: '',
    };

    const getPositiveName = (name) => {
      Object.entries(negativeMap).forEach(([key, value]) => {
        const titleCasedKey = key.charAt(0).toUpperCase() + key.slice(1);
        const titleCasedValue =
          value.length === 0
            ? ''
            : value.charAt(0).toUpperCase() + value.slice(1);
        name = name
          .replaceAll(key, value)
          .replaceAll(titleCasedKey, titleCasedValue);
      });
      return name;
    };

    const isNegativeSubstringPresent = (name) =>
      toKebabCase(name)
        .split('-')
        .map((s) => s.toLowerCase())
        .some((s) => Object.keys(negativeMap).includes(s));

    const checkNode = (node, name) => {
      if (name !== undefined && isNegativeSubstringPresent(name)) {
        const positiveName = getPositiveName(name);
        context.report({
          node: node,
          messageId: 'noNegativeVarName',
          data: { name: name, suggestion: positiveName },
          fix: (fixer) => fixer.replaceText(node, positiveName),
        });
      }
    };

    return {
      VariableDeclarator(node) {
        const varName = node.id.name;
        checkNode(node.id, varName);
      },
      AssignmentExpression(node) {
        if (node.left.type === 'Identifier') {
          const varName = node.left.name;
          checkNode(node.left, varName);
        }
      },
      FunctionDeclaration(node) {
        if (node.id && node.id.name) {
          const funcName = node.id.name;
          checkNode(node.id, funcName);
        }
      },
      FunctionExpression(node) {
        if (node.id && node.id.name) {
          const funcName = node.id.name;
          checkNode(node.id, funcName);
        }
      },
      ArrowFunctionExpression(node) {
        if (node.id && node.id.name) {
          const funcName = node.id.name;
          checkNode(node.id, funcName);
        }
      },
    };
  },
};

module.exports = noNegativeNamesRule;