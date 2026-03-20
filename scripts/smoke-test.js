const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { ESLint } = require('eslint');
const airdevPlugin = require('../index');

async function main() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'airdev-eslint-'));
  const filePath = path.join(tmpDir, 'src', 'sample.js');
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, 'const isNotReady = true;\n', 'utf8');

  const eslint = new ESLint({
    cwd: tmpDir,
    ignore: false,
    overrideConfigFile: true,
    overrideConfig: [
      {
        languageOptions: {
          ecmaVersion: 2020,
          sourceType: 'module',
        },
        plugins: {
          airdev: airdevPlugin,
        },
        rules: {
          'airdev/no-negative-names': 'error',
        },
      },
    ],
  });

  const [result] = await eslint.lintFiles([filePath]);
  assert(result, 'Expected a lint result.');
  assert.strictEqual(result.errorCount, 1, 'Expected one lint error.');
  assert(
    result.messages.some(
      (message) => message.ruleId === 'airdev/no-negative-names'
    ),
    'Expected the airdev/no-negative-names rule to report.'
  );

  fs.rmSync(tmpDir, { recursive: true, force: true });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
