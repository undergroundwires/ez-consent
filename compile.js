/* eslint-disable no-console */

const fs = require('fs');
const babel = require('@babel/core');
const path = require('path');
const esbuild = require('esbuild');
const CleanCSS = require('clean-css');

const outputFolder = 'dist';
const inputFile = './src/ez-consent.js';
const cssFolder = './src/themes/';

(async () => {
  await deleteFolderRecursiveAsync(outputFolder);
  await fs.promises.mkdir(outputFolder, { recursive: true });
  const noModulesCode = (await babel.transformFileAsync(inputFile, {
    plugins: ['remove-import-export'],
  })).code;
  await Promise.all([
    compileAsync(noModulesCode, path.join(outputFolder, path.basename(inputFile))),
    compileAsync(noModulesCode, path.join(outputFolder, `${removeExtension(path.basename(inputFile))}.min.js`), true),
    minifyCssAsync(cssFolder, path.join(outputFolder, 'themes')),
  ]);
})().catch((err) => {
  console.error(err);
  process.exit(-1);
});

async function minifyCssAsync(srcDir, targetDir) {
  const files = await fs.promises.readdir(srcDir);
  const cleanCSS = new CleanCSS();
  return Promise.all(files.map(async (name) => {
    const filePath = path.join(srcDir, name);
    // Copy as it is
    const nonMinifiedTarget = path.join(targetDir, name);
    await copyFile(filePath, nonMinifiedTarget);
    console.log(`CSS copied to "${nonMinifiedTarget}"`);
    // Minify content
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const minified = cleanCSS.minify(content).styles;
    const targetPath = path.join(targetDir, `${removeExtension(path.basename(name))}.min.css`);
    await fs.promises.writeFile(targetPath, minified);
    console.log(`CSS minified to "${targetPath}"`);
  }));
}

async function copyFile(src, dest) {
  await fs.promises.mkdir(path.dirname(dest), { recursive: true });
  await fs.promises.copyFile(src, dest);
}

function removeExtension(str) {
  return str.slice(0, -path.extname(str).length);
}

async function compileAsync(codeString, targetPath, minifyCode = false) {
  try {
    await esbuild.build({
      stdin: {
        contents: codeString,
        loader: 'js',
      },
      outfile: targetPath,
      minify: minifyCode,
    });
    console.log(`JavaScript compiled to "${targetPath}" (${minifyCode ? 'minified' : 'not minified'})`);
  } catch (error) {
    console.error('[ERROR] esbuild', error);
    process.exit(1);
  }
}

async function deleteFolderRecursiveAsync(folderPath) {
  await fs.promises.rm(folderPath, { recursive: true, force: true });
}
