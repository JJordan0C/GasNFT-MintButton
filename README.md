# GasNFT MintButton

![badmath](https://img.shields.io/github/languages/top/lernantino/badmath)
![Bitbucket open issues](https://img.shields.io/bitbucket/issues/JJordan0C/GasNFT-MintButton?style=flat-square)
![GitLab](https://img.shields.io/gitlab/license/GasNFT-MintButton)

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="assets/img/logo-gas.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">GasNFT Mint Button</h3>

  <p align="center">
    A simple extension for integrate mint button on your own website!
    <br />
    <a href="https://github.com/othneildrew/Best-README-Template"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/JJordan0C/GasNFT-MintButton/issues">Report Bug</a>
    ·
    <a href="https://github.com/JJordan0C/GasNFT-MintButton/issues">Request Feature</a>
  </p>
</div>

## Before Start
Our JS extension uses Web3.js to work correctly, but if it has not been loaded within the project, our extension will load Web3.js via CDN so that we can always guarantee its correct functioning.<br>
Once you have learned this, we can move on to the next step, which is to copy the script of our extension to the end of the body.
```html
<body>
  ...
  <script src="https://gasnft.s3.eu-west-1.amazonaws.com/sdk/js/mint.min.js" defer></script>
</body>
```
<b>N.B. <br>If you have already uploaded the Web3.js script to your HTML page, remember that our script will always have to go after.</b><br>An example of how the project should be set up before starting is this:
```html
<head>
  ...
  <script src="https://cdnjs.cloudflare.com/ajax/libs/web3/1.8.0/web3.min.js"></script>
  ...
</head>
<body>
  ...
  <script src="https://gasnft.s3.eu-west-1.amazonaws.com/sdk/js/mint.min.js" defer></script>
</body>
```

## Quick Start
Ok now you can start, this is an example of how you could configure your button within the page:

```html
<body>
  ...
  <gnft-mint-button class="btn gnft-button" inp-mint="true" show-cost="true" address="0x4Eb4f7A8F3B7646432e0E1b9bE8Fd2136C1dc6Bd" abi="JWToken"></gnft-mint-button>
  ...
</body>
```
