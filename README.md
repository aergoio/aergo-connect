# Aergo Connect

Chrome browser extension built using Vue + Typescript

## Install

### Release version

- [Install Aergo Connect from the Chrome web store](https://chrome.google.com/webstore/detail/aergo-connect/iopigoikekfcpcapjlkcdlokheickhpc)

### Beta version

- Build from source or download [latest release](https://github.com/aergoio/aergo-connect/releases) package
- In Chrome, go to your Extensions
- Enable "Developer mode"
- Click "load unpacked" and select the extracted package
- Aergo Connect should appear in your menu bar

## Issues and Security

Please post any issues or suggestions to the Github issues page.

For security related reports, please contact us at security@aergo.io

## Development

**Install dependencies**

    yarn

**Run dev build**

    yarn build-dev

Add the `dist-dev` folder as an "unpacked extension" to Chrome.

## Build

**Build for production**

    cd packages/@aergo-connect/extension && yarn build

**Package as zip**

    cd packages/@aergo-connect/extension && yarn package

Find the zip in the release folder.