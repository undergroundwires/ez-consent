const fs = require('fs');
const babel = require("@babel/core");
const path = require("path");
const ClosureCompiler = require('google-closure-compiler').jsCompiler;
const CleanCSS = require('clean-css');

const outputFolder = 'dist';
const inputFile = './src/ez-consent.js';
const cssFolder = './src/themes/';

(async function() {
    await deleteFolderRecursiveAsync(outputFolder);
    await fs.promises.mkdir(outputFolder, { recursive: true });
    const noModulesCode = (await babel.transformFileAsync(inputFile, {
        plugins: ["remove-import-export"]
    })).code;
    await Promise.all([
        compileWithClosureAsync(noModulesCode, path.join(outputFolder, path.basename(inputFile)), {
            compilation_level: 'SIMPLE',
            formatting: 'PRETTY_PRINT',
            env: 'BROWSER',
            debug: true
        }),
        compileWithClosureAsync(noModulesCode, path.join(outputFolder, removeExtension(path.basename(inputFile)) + ".min.js"), {
            compilation_level: 'SIMPLE',
            env: 'BROWSER'
        }),
        minifyCssAsync(cssFolder, path.join(outputFolder, 'themes'))
    ]);
})().catch(err => {
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
        const targetPath = path.join(targetDir, removeExtension(path.basename(name)) + ".min.css");
        await fs.promises.writeFile(targetPath, minified);
        console.log(`CSS minified to "${targetPath}"`);
    }));
}

async function copyFile(src, dest) {
    await fs.promises.mkdir(path.dirname(dest), {recursive: true});
    await fs.promises.copyFile(src, dest);
}

function removeExtension(str) {
    return str.slice(0, -path.extname(str).length);
}

async function compileWithClosureAsync(code, output, options) {
    return new Promise((resolve, reject) => {
        new ClosureCompiler(options).run([{
            path: './',
            src: code,
            sourceMap: null
           }], async (exitCode, stdOut, stdErr) => {
              if(stdErr) {
                  console.error('[ERROR] Google Closure', stdErr);
              }
              if(exitCode !== 0) {
                reject(new Error('Unexpected exit code : ' + exitCode));
              }
              for (const fileResult of stdOut) {
                console.log(`JS compiled to "${output}", with options: ${JSON.stringify(options)}`);
                await fs.promises.writeFile(output, fileResult.src);
              }
              resolve();
          });
    })
}


async function deleteFolderRecursiveAsync(path) {
    if (!fs.existsSync(path)) {
        return;
    }
    for (const entry of await fs.promises.readdir(path)) {
        const curPath = path + "/" + entry;
        if ((await fs.promises.lstat(curPath)).isDirectory())
            {await deleteFolderRecursiveAsync(curPath);}
        else await fs.promises.unlink(curPath);
    }
    await fs.promises.rmdir(path);
}
