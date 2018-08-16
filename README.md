# Deep Insider: A Neural Network Playground

[This playground][playground page] is an interactive visualization of neural networks, written in
TypeScript using d3.js. We use GitHub issues for tracking new requests and bugs.
Your feedback is highly appreciated!

**If you'd like to contribute to original repository [tensorflow/playground (Deep playground)][original page], be sure to review the [contribution guidelines](CONTRIBUTING.md).**

## Development

To run the visualization locally, run:
- `npm i` to install dependencies
- `npm run build` to compile the app and place it in the `dist/` directory
- `npm run serve` to serve from the `dist/` directory and open a page on your browser.

For a fast edit-refresh cycle when developing run `npm run serve-watch`.
This will start an http server and automatically re-compile the TypeScript,
HTML and CSS files whenever they change.

## For owners
To push to production: `git subtree push --prefix dist origin gh-pages`.

This is not an official Google product.

## License

Copyright 2018 Digital Advantage Inc. All Rights Reserved.  
Licensed under the Apache License, Version 2.0.

### The licenses of using open-source code

This project is forked from [tensorflow/playground (Deep playground)][original page].  
Licensed under the Apache License, Version 2.0.

[playground page]: https://deepinsider.github.io/playground/
[original page]: https://github.com/tensorflow/playground
