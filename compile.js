/* eslint-disable no-console, import/no-extraneous-dependencies */

const fs = require('fs');
const babel = require('@babel/core');
const path = require('path');
const esbuild = require('esbuild');
const CleanCSS = require('clean-css');

const outputFolder = 'dist';
const inputFile = './src/ez-consent.js';
const cssFolder = './src/themes/';

main();

async function main() {
  try {
    await deleteFolderRecursive(outputFolder);
    await fs.promises.mkdir(outputFolder, { recursive: true });
    const noModulesCode = (await babel.transformFileAsync(inputFile, {
      plugins: ['remove-import-export'],
    })).code;
    await Promise.all([
      compile(noModulesCode, path.join(outputFolder, path.basename(inputFile))),
      compile(noModulesCode, path.join(outputFolder, `${removeExtension(path.basename(inputFile))}.min.js`), true),
      minifyCss(cssFolder, path.join(outputFolder, 'themes')),
    ]);
  } catch (err) {
    console.error(err);
    process.exit(-1);
  }
}

async function minifyCss(srcDir, targetDir) {
  const files = await fs.promises.readdir(srcDir);
  const cleanCSS = new CleanCSS();
  return Promise.all(files.map(async (name) => {
    const filePath = path.join(srcDir, name);
    // Copy the CSS file without modification
    const nonMinifiedTarget = path.join(targetDir, name);
    await copyFile(filePath, nonMinifiedTarget);
    console.log(`CSS copied to "${nonMinifiedTarget}".`);
    // Minify content
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const minified = cleanCSS.minify(content).styles;
    const targetPath = path.join(targetDir, `${removeExtension(path.basename(name))}.min.css`);
    await fs.promises.writeFile(targetPath, minified);
    console.log(`CSS minified to "${targetPath}".`);
  }));
}

async function copyFile(src, dest) {
  await fs.promises.mkdir(path.dirname(dest), { recursive: true });
  await fs.promises.copyFile(src, dest);
}

function removeExtension(str) {
  return str.slice(0, -path.extname(str).length);
}

async function compile(codeString, targetPath, minifyCode = false) {
  try {
    await esbuild.build({
      stdin: {
        contents: codeString,
        loader: 'js',
      },
      outfile: targetPath,
      minify: minifyCode,
    });
    console.log(`JavaScript compiled to "${targetPath}" (${minifyCode ? 'minified' : 'not minified'}).`);
  } catch (error) {
    console.error('esbuild failed during compilation:', error);
    process.exit(1);
  }
}

async function deleteFolderRecursive(folderPath) {
  await fs.promises.rm(folderPath, { recursive: true, force: true });
}
