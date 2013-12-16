# Tesla.js Command Line Interface (beta)
[![NPM version](https://badge.fury.io/js/tesla-cli.png)](http://badge.fury.io/js/tesla-cli)

Git repo for the [Tesla.js](https://github.com/teslajs/tesla.js) command line interface.

It's a work in progress, and for now will just generate a boilerplate app structure. But there's much more useful features in the works.

## Installation

Install Tesla globally (recommended):
```
$ npm install -g tesla-cli
```

Install Tesla locally:
```
$ npm install tesla-cli
```

## Quick Start

Once Tesla is installed, simply run the following command anytime you want to create a new app:

```
$ tesla app-name
```

This will create a new app with the name "app-name". Next, switch into your new apps directory:

```
$ cd app-name
```

Than install dependencies:
```
$ npm install
```

And finally start the server:
```
$ grunt
```



### Options
```
Usage: tesla [options]

Options:

  -V, --version       output the version number
  -e, --ejs           add ejs engine support (defaults to jade)
  -J, --jshtml        add jshtml engine support (defaults to jade)
  -H, --hogan         add hogan.js engine support (defaults to jade)
  -c, --css   add stylesheet  support (less|sass|stylus) (defaults to plain css)
  -f, --force         force on non-empty directory
```

For example, if you want to generate an application called "foobar" with Jade & Stylus support you would simply execute:

```
$ tesla --css stylus foobar
```


Or to generate an application with EJS & SASS support:

```
$ tesla --css sass --ejs foobar
```
