# ez-consent

> 🍪 Minimal & vanilla JS only cookie consent banner with no dependencies.

[![](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/undergroundwires/ez-consent/issues)
[![](https://github.com/undergroundwires/ez-consent/workflows/Publish/badge.svg)](./.github/workflows/publish.yaml)
[![](https://github.com/undergroundwires/ez-consent/workflows/Build%20&%20test/badge.svg)](./.github/workflows/build-and-test.yaml)
[![](https://github.com/undergroundwires/ez-consent/workflows/Bump%20&%20release/badge.svg)](./.github/workflows/bump-and-release.yaml)
[![](https://github.com/undergroundwires/ez-consent/workflows/Quality%20checks/badge.svg)](./.github/workflows/quality-checks.yaml)
[![](https://img.shields.io/npm/v/ez-consent)](https://www.npmjs.com/package/ez-consent)
[![Auto-versioned by bump-everywhere](https://github.com/undergroundwires/bump-everywhere/blob/master/badge.svg?raw=true)](https://github.com/undergroundwires/bump-everywhere)
<!-- [![](https://img.shields.io/npm/dm/ez-consent)](https://www.npmjs.com/package/ez-consent)
[![](https://data.jsdelivr.com/v1/package/npm/ez-consent/badge?style=rounded)](https://www.jsdelivr.com/package/npm/ez-consent) -->

- Vanilla JavaScript only ✔️
- It does not track you ✔️
- Very lightweight with no dependencies ✔️
- Single line to get going ✔️

[Live example 1](https://cloudarchitecture.io/?force-consent), [Live example 2](https://erkinekici.com/?force-consent), [CodePen examples](https://codepen.io/collection/XRjMGP)

## Usage

1. [Import](#1-import-the-script)
2. [Initialize](#2-initialize-the-script)
3. [Style](#3-style)

### 1. Import the script

#### Option A: CDN

It's the simplest way. Just add it to your page:

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/ez-consent@1.1.1/dist/ez-consent.min.js"></script>
```

#### Option B: Install

- Using NPM (recommended): `npm install ez-consent --save`
- Using bower: `bower install undergroundwires/ez-consent`
- As a git submodule:
  - Go to the folder you wish to have the repository
  - Run `git submodule add https://github.com/undergroundwires/safe-email`
- ❗ Only CDN and NPM solutions [will have minified files with polyfills (`dist/` folder)](#package-contents)

Add it to your page:

```html
<script type="text/javascript" src="/node_modules/ez-consent/dist/ez-consent.min.js"></script>
```

Or you can import `ez_consent` as a module:

```html
<script type="module">
  import { ez_consent } from './ez-consent/src/ez-consent.js'; // /node_modules/ez-consent/ez-consent.js ...
  ez_consent.init();
</script>
```

Or import it via `webpack`, `gulp`, `rollup` etc.:

```js
import { ez_consent } from "./node_modules/ez-consent/src/ez-consent"
```

*[top↑](#ez-consent)*

### 2. Initialize the script

```js
ez_consent.init();
```

or with all optional options:

```js
ez_consent.init(
  {
    always_show: false        // Always shows banner on load, default: false
    privacy_url: "/privacy",  // URL that "more" button goes to, default: "/privacy/"
    texts: {
      main: "We use cookies", // The text that's shown on the banner, default: "This website uses cookies & similar."
      buttons:
      {
        ok: "ok",             // OK button to hide the text, default: "ok"
        more: "more"          // More button that shows the privacy policy, default "more"
      }
    }
  });
```

The banner will be shown if the user has not yet agreed to read & understand the information.
You can also force to show banner always by having `force-consent` query parameter in URL. E.g. : `test.com/fest?force-consent`

*[top↑](#ez-consent)*

### 3. Style

You can choose one from existing themes:

#### Existing themes

You can choose one of the following existing theme to get going:

##### box-bottom-left.css

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ez-consent@1.1.1/dist/themes/box-bottom-left.min.css">
```

- [Source file](./src/themes/box-bottom-left.css)
- [See it live](https://cloudarchitecture.io/?force-consent)
- [Preview on CodePen](https://codepen.io/undergroundwires/pen/qBdzmyj)

![box-bottom-left](./img/themes/box-bottom-left.png)

##### subtle-bottom-right.css

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ez-consent@1.1.1/dist/themes/subtle-bottom-right.min.css">
```

- [Source file](./src/themes/subtle-bottom-right.css)
- [See it live](https://erkinekici.com/?force-consent)
- [Preview on CodePen](https://codepen.io/undergroundwires/pen/MWwMmqw)

![subtle-bottom-right](./img/themes/subtle-bottom-right-light.png)
![subtle-bottom-right-dark](./img/themes/subtle-bottom-right-dark.png)

#### Custom themes

Or you can create your theme very easily & import it just by looking at [existing themes](./src/themes/) or [the HTML](./src/ez-consent.js#L18). The script uses a few classes [BEM](http://getbem.com/naming/) naming convention.

You're welcome to contribute your theme to the project in [`./src/themes`](./src/themes/) folder 👍.

*[top↑](#ez-consent)*

## Package contents

The deployed packages includes a `dist/` folder that adds polyfills to the files and distributes them as:

- minified (`.min.js`, `.min.css`) files for production usage
- non-minified (`.js`, `.css`) files for debugging

*[top↑](#ez-consent)*

## GitOps

CI/CD is fully automated for this repo using different GIT events & GitHub actions.

### Flow

![ez-consent continuous integration and deployment flow](./img/gitops.png)

*[top↑](#ez-consent)*
