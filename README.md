# Tesla.js Command Line Interface (beta)
[![Build Status](https://travis-ci.org/teslajs/tesla-cli.png?branch=master)](https://travis-ci.org/teslajs/tesla-cli)
[![NPM version](https://badge.fury.io/js/tesla-cli.png)](http://badge.fury.io/js/tesla-cli)
[![Dependency Status](https://gemnasium.com/teslajs/tesla-cli.png)](https://gemnasium.com/teslajs/tesla-cli)


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
  -c, --css           add stylesheet  support (less|sass|stylus) (defaults to plain css)
  --nib               add support for nib to stylus
  --axis              add support for axis to stylus
  -f, --force         force on non-empty directory
  generate <name>     generate new model + controller with basic CRUD functionality
  start               start the web server (still a bit buggy, best just just run "grunt" for now)
```

For example, if you want to generate an application called "foobar" with Jade & Stylus support you would simply execute:

```
$ tesla --css stylus foobar
```


Or to generate an application with EJS & SASS support:

```
$ tesla --css sass --ejs foobar
```

## Working with data

Creating models & working with data in Tesla is super simple. It takes only 2 steps:

1) To work with data, make sure you set the URL for your database (config.db.url) in the [config file](https://github.com/teslajs/tesla.js/blob/master/config/config.js).

2) Generate new model: let's say you have a collection called "user" you want to use with your app, all you need to do is run the following command:

```
$ tesla generate user
```

this will create 2 new files for you:
- app/models/user.js
- app/controllers/userController.js


#### Models

As long as your databse URL is set properly, this is all you need to do. However, you will almost certainly want to open up your new model and define the schema for your collection or table.

In this file, you will see a block that looks something like this:

```
// DEFINE MODEL SCHEMA
// Be sure to add some files to the schema below or you will not have success quering or adding to the database
var Model = db.define("user", {
    created   : { type: "date", time: true },
    updated   : { type: "date", time: true }
    // _id : { type: "text" },
    // name      : { type: "text", required: true },
    // isAdmin : { type: "boolean", defaultValue: false },
}, {
    validations: {
        // EXAMPLE VALIDATIONS
        // password: orm.enforce.security.password('luns5', 'Passowrd does not meet min security requirements.'),
        // email: orm.enforce.patterns.email('Please enter a valid email address.')
        // More Options : https://github.com/dresende/node-enforce
    }
});
```

Here you will want to define what fields you want to be able to read/update in the collection. In the example above, this model only has access to "created" and "updated" fields. But it's almost certain that you will need to add more fields than this. There are a few commented out examples included to get you started.

Tesla uses [Node-ORM](https://github.com/dresende/node-orm2) to provide add basic ORM functionality. For more info on definifing models & validations,[have a look at the ORM wiki](https://github.com/dresende/node-orm2/wiki).

Once you have your schema setup, that should be about all you need to with the model do in most cases. But feel free to muck about further down in the file if you need to do some more customization.

#### Controllers

By default, Tesla will serve up your data via a RESTful JSON api. If this is the result you want, you shouldn't need to make any changes to the generated controller. You get the following URI scheme by default:

```
http://localhost:3000/user/all
http://localhost:3000/user/create?data&goes&here
http://localhost:3000/user/delete/:id
http://localhost:3000/user/find?query&terms&here
http://localhost:3000/user/update/:id
```

It's worth noting that delete & update require to pass the databse ID, while create & find accept arguments via GET parameters. Create maps each GET parameter to a field in the databse (POST/PUT support will come in the next iteration). For example, if you want add the following data to your collection/table:

```
name: Bob
email: bob@marley.com
```

you would simple enter this into the browser:

```
http://localhost:3000/user/create?name=Bob&email=bob@marley.com
```

Similarly, if you want to retrieve all the records of people names Bob, you would build a request like this:

```
http://localhost:3000/user/find?name=Bob
```

and you will get back something like this:

```
[
	{
		name: "Bob"
		email: "bob@marley.com"
	},
	{
		name: "Bob"
		email: "bob@dylan.com"
	}
]
```

Now, if you would rather serve up a proper HTML view, it's a simple change, just open up your [config file]() and set "config.api.enabled" to "false". Now, it will map the request to the appropriate view. By default, you get 5 (all, create, delete, find, update) views. Continuing with our user example, you will get the following url > view mapping:

```
http://localhost:3000/user/all  >  app/views/all
http://localhost:3000/user/create?data&goes&here  >  app/views/create
http://localhost:3000/user/delete/:id  >  app/views/delete
http://localhost:3000/user/find?query&terms&here  >  app/views/find
http://localhost:3000/user/update/:id  >  app/views/update
```

These are all setup in the controller, however you will need to create the appropriate view files or you will get a 404 error. The data from each request (which was previously spit out as a JSON view) will be sent to the view as an object called "data".


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/teslajs/tesla-cli/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

