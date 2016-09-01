# Kiekie
## Introduction
Kiekie is a simple, Free and Open Source, on-line photo gallery app. It can connect to any compatible [Kiekie Server](https://github.com/walterl/kiekie-server).

Kiekie was originally written as part of a free, modern (mobile based) take on disposable cameras at a wedding, to let guests take candid photos. It should be usable in the same way for most events.

It was build using the following technologies:

* [Cordova](https://cordova.apache.org/)
* [ES2015](https://git.io/es6features)
* [React](https://facebook.github.io/react/)
* [Redux](http://redux.js.org/)
* [React Router](https://github.com/reactjs/react-router)
* [Material-UI](http://www.material-ui.com/)
* Built using a very simple [webpack](https://webpack.github.io/docs/) configuration.

## Build
```
$ git clone https://github.com/walterl/kiekie-app.git
$ cd kiekie-app
kiekie-app $ npm install
kiekie-app $ NODE_ENV=development webpack
```

## Run
Run debug version in browser:
```
kiekie-app $ cordova platform add browser
kiekie-app $ cordova run browser --debug --target=chromium
```

Run debug version in Android emulator:
```
kiekie-app $ cordova platform add android
kiekie-app $ cordova run android --debug --emulator
```

## License
MIT License

Copyright (c) 2016-present Walter Leibbrandt

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
