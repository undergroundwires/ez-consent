# Changelog

## 1.3.1 (2025-01-18)

* Update diagram in docs | [be09fd7](https://github.com/undergroundwires/ez-consent/commit/be09fd71be033c755cc75facc007e141cdc297a8)
* Improve examples for performance | [8124f57](https://github.com/undergroundwires/ez-consent/commit/8124f57a056251447d82f0963b0b07fa4b93d28e)
* Fix dist folder not being updated | [31ebf4f](https://github.com/undergroundwires/ez-consent/commit/31ebf4fc452c9f71317947a6fe82ebed3c46f537)

[compare](https://github.com/undergroundwires/ez-consent/compare/1.3.0...1.3.1)

## 1.3.0 (2024-12-28)

* automate adding '/dist' folder on release | [805e1db](https://github.com/undergroundwires/ez-consent/commit/805e1db590d2673ae39a9f1a9739416037e19af1)
* Bump dependencies to latest | [e34c3b0](https://github.com/undergroundwires/ez-consent/commit/e34c3b0c0bdf98fb854f601e7e3fcaca558ba329)
* Change JS linter to ESlint | [26b9c52](https://github.com/undergroundwires/ez-consent/commit/26b9c52411b669c011873d8667fa655d0b3f6b67)
* Fix dead example in documentation | [a190dff](https://github.com/undergroundwires/ez-consent/commit/a190dffcdeeb06571f4983fa069a995c4f87c319)
* Update author e-mail | [2128a40](https://github.com/undergroundwires/ez-consent/commit/2128a40b86aec717e0ddd712d0b35f83253b7706)
* Update dependencies to latest | [8f2f12c](https://github.com/undergroundwires/ez-consent/commit/8f2f12c756327d2c381311fd902988bb42e92f9f)
* Fix compiler bug not deleting output folder | [2023abf](https://github.com/undergroundwires/ez-consent/commit/2023abf20f71bc5b4b9deaef85e5979e36d464a7)
* Change compiler from Google Closure to esbuild | [535b35f](https://github.com/undergroundwires/ez-consent/commit/535b35fe2c76ecbbfb43e5214cb9eb94e69ba9d4)
* Fix JS style issues to comply with ESLint | [530187d](https://github.com/undergroundwires/ez-consent/commit/530187d23d68bed9a0c8c9067d232e9cbde11aa0)
* Fix typos and improve language in docs and code | [c0d80c7](https://github.com/undergroundwires/ez-consent/commit/c0d80c7504fc16cf685ccc4d7e38354cfb56a44d)
* Introduce `.editorconfig` and `.gitattributes` | [a29b261](https://github.com/undergroundwires/ez-consent/commit/a29b261b143b7c7b50c0797b364737a58a4221d1)
* Refactor to define dependencies as devDependencies | [1cbd126](https://github.com/undergroundwires/ez-consent/commit/1cbd1263f5d09d5da1d14726f24f484d44078394)
* Refactor compiler to use top level async-await | [86047cc](https://github.com/undergroundwires/ez-consent/commit/86047cc636246bbbe8bebba9efc7b1358315be9c)
* Add ability to overwrite CSS classes | [949a9fe](https://github.com/undergroundwires/ez-consent/commit/949a9fede891dd8be2049011eb86fb425da20506)
* Improve performance by reducing string operations | [1a277ad](https://github.com/undergroundwires/ez-consent/commit/1a277ad8bcdb1f44f832c500d12dc1231d49507b)
* Improve themes with variables, flex scaling, RTL | [25edd66](https://github.com/undergroundwires/ez-consent/commit/25edd6690f1dd04c5b2cbb1d95047b300c246db4)
* Change CSSLint to modern Stylelint | [3d0b483](https://github.com/undergroundwires/ez-consent/commit/3d0b483109eb87f4640bbdbe2b81955331b93dd8)
* Fix BEM convention compatibility #15 | [6465ef2](https://github.com/undergroundwires/ez-consent/commit/6465ef24412983ec0d488900795a1b7ddb5fa193)
* Add `dist/` to `.gitignore` | [05895cc](https://github.com/undergroundwires/ez-consent/commit/05895cc6b984e6059fd33cd53db960550540511b)
* Bump `upload-artifact` and `download-artifact` | [0ffe9f6](https://github.com/undergroundwires/ez-consent/commit/0ffe9f609ced8a75c9fad762207d566c98147848)

[compare](https://github.com/undergroundwires/ez-consent/compare/1.2.2...1.3.0)

## 1.2.2 (2021-02-28)

* remove minor and patch versions in CDN reference example | [a74cae2](https://github.com/undergroundwires/ez-consent/commit/a74cae28c0bea0e8014f14ac55c848e8cf6afae2)
* fix null error when initializing with undefined options | [939db15](https://github.com/undergroundwires/ez-consent/commit/939db152fedb3d397d54742f4b21576c60ffd845)
* bump dependencies to latest | [280f486](https://github.com/undergroundwires/ez-consent/commit/280f48686f045f34575a48d6868bf52d78c94008)

[compare](https://github.com/undergroundwires/ez-consent/compare/1.2.1...1.2.2)

## 1.2.1 (2020-07-20)

* fixed ci-cd publishing older version | [93e982d](https://github.com/undergroundwires/ez-consent/commit/93e982db2fef6017146cc144d4ec605b432a83f9)
* fixed missing shared css class to buttons (#4) | [370afaf](https://github.com/undergroundwires/ez-consent/commit/370afaf8255187d8188b501e7e654da0640d577c)

[compare](https://github.com/undergroundwires/ez-consent/compare/1.2.0...1.2.1)

## 1.2.0 (2020-07-17)

* fixed main path for node `require` support | [b17e097](https://github.com/undergroundwires/ez-consent/commit/b17e0970b22296d3dfcba4296e3351f96c0622d3)
* simplified quality checks | [cbbe078](https://github.com/undergroundwires/ez-consent/commit/cbbe078ce0ff4deda2bc17a01bfd2037228e22bd)
* only release when tags are pushed undergroundwires/bump-everywhere#3 | [06f7704](https://github.com/undergroundwires/ez-consent/commit/06f77043af9c504fd91d566ce010b8dd6cc8d690)
* Added the option 'target_attribute' (#2) | [58c6671](https://github.com/undergroundwires/ez-consent/commit/58c66719781609528ba0e08aa63208ff97f6a4a4)
* removed duplicated documentation #2 | [d42cc11](https://github.com/undergroundwires/ez-consent/commit/d42cc1114812ccc256cedfbfd6089deada4b685a)
* improved README.md | [801ea49](https://github.com/undergroundwires/ez-consent/commit/801ea499bd061d9bf7fff3b0c1409fff2e84b0ed)
* added option to set if more button gives consent #1 | [dbcd133](https://github.com/undergroundwires/ez-consent/commit/dbcd133ffa0c84edd4e9a1794f051f681e127eaf)
* refactored options #1, #2 | [60367ad](https://github.com/undergroundwires/ez-consent/commit/60367ad5684c9d1e221ff85f58b308f2c4338715)
* updated dependencies to latest | [2f53c8e](https://github.com/undergroundwires/ez-consent/commit/2f53c8ef99cb4b220ee4f9cd8c59ebf6a8fa46d7)

[compare](https://github.com/undergroundwires/ez-consent/compare/1.1.1...1.2.0)

## 1.1.1 (2020-05-18)

Initial release | [commits](https://github.com/undergroundwires/ez-consent/commit/61e95fea512192337c5c8cbb3db992a9512727a4)
