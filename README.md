# Tesla.js Command Line Interface
[![Build Status](https://travis-ci.org/teslajs/tesla-cli.png?branch=master)](https://travis-ci.org/teslajs/tesla-cli)
[![NPM version](https://badge.fury.io/js/tesla-cli.png)](http://badge.fury.io/js/tesla-cli)
[![Dependency Status](https://gemnasium.com/teslajs/tesla-cli.png)](https://gemnasium.com/teslajs/tesla-cli)

###### Documentation: [teslajs.com](http://teslajs.com/)
###### Updates: [twitter.com/teslajs](http://twitter.com/teslajs/)

## About 
Tesla is a modern MVC style framework built on to of [Node.js](http://nodejs.org/) and [Express](http://expressjs.com/). It's designed to be as flexible as possible, and includes sane default and easily configurable boilerplates to get you up an running as quickly as possible.

It's still a work in progress, with more features being added, and while the current build seems stable, bug reports are always apreciated!

## Features

#### MVC
Simple but useful MVC structure with optional scaffolding to auto-create models, controllers & even a simple JSON API for you. Models use Node-ORM so you’re not tied to a specific database.

#### Auto-routing
If your url’s follow the domain.com/controller/action/:id format, there’s no need to create any custom routing, it will just automatically load the controller/view if it’s found, and throw a 404 if it’s not.

#### Flexible Templates
You can choose from EJS, Handlebars, Hogan, Jade or Handlebars for templates. Less, Sass & Stylus are available for css pre-processors (with additional support for Bourbon, Axis & Nib libraries).

#### Boilerplates
Tesla uses a combination of npm and Bower to help create some useful boilerplates when setting up a new app. You can choose to have Tesla add things like jQuery, AngularJS, Foundation, etc. to your view templates automatically when it creates the project.

#### Auto-watch & LiveReload
Tesla utilizes the Grunt task runner to watch for file changes, restarting the server when necessary. It also comes with LiveReload out of the box to auto refresh your browser when files change.

#### Easy Configuration
Almost all of the server settings (port number, database settings, etc.) can be easily updated in the config file.


## Installation

###### Install Tesla globally (recommended):

```
$ npm install tesla-cli -g
```

###### Or, install Tesla locally:

```
$ npm install tesla-cli
```

## Quick Start

Now that you have the command-line tool installed, you can create your first app:

```
$ tesla mysite
```

This will create a new barebones site with the name "mysite". Next, install dependencies:

```
$ cd mysite && npm install
```

Start the server:

```
$ gulp
```

Once the server has started, simply point your browser to: [http://localhost:3000](http://localhost:3000)

If you choose not to use Grunt, you can start the server by running ```node server.js```. But using Grunt gives you some extras such as livereload, and watching for changes your files & restarting the server whenever necesary.



## DOCUMENTATION

#### For Full documentation, please visit [teslajs.com](http://teslajs.com)

###### * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/teslajs/tesla-cli/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

