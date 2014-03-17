module.exports = function ( program ) {

    var colors = require('colors'),
        fs = require('fs'),
        mkdirp = require('mkdirp'),
        wrench = require('wrench'),
        ncp = require('ncp').ncp;

    return {

        // ABORT
        abort : function (msg) {
            console.log('');
            console.error(msg);
            console.log('');
            process.exit(1);
        },

        // Generate application
        createApplication : function ( program, path ) {

            var self = this;

            self.emptyDirectory(path, function(empty){

                if (empty || program.force) {
                    self.createApplicationAt( program, path );
                } else {
                    console.log();
                    program.confirm('WARNING: '.red + 'Destination directory is not empty, continue? ', function(ok){
                        if (ok) {
                            process.stdin.destroy();
                            self.createApplicationAt(path);
                        } else {
                            self.abort('ABORTED: '.red + 'Installation cancelled (directory not empty).');
                        }
                    });
                }
            });
        },

        createApplicationAt : function( program, path ) {

            var self = this;

            console.log('');
            console.log('   Configuring Tesla server...');
            console.log('   - - - - - - - - - - - - - - - - - - - - - - -');

            self.mkdir(path, function(){

                ncp(__dirname + '/_src', path, function (err) {

                    // HANDLE ERRORS
                    if (err) {
                        return console.error(err);
                    }

                    // UPDATE PACKAGE FILE
                    var pkgFile = path + '/package.json',
                        fileContent = fs.readFileSync(pkgFile),
                        pkg = JSON.parse(fileContent);


                    // UPDATE PACKAGE FILE
                    var bowerFile = path + '/bower.json',
                        fileContent = fs.readFileSync(bowerFile),
                        bower = JSON.parse(fileContent);


                    pkg.name = path;

                    // OPEN CONFIG FILE
                    var cfgFile = path + '/config/config.js';

                    fs.readFile( cfgFile, function (err, data) {

                        if (err) {
                            return console.error(err);
                        }

                        data = data.toString();

                        // UPDATE APP NAME
                        data = data.replace(new RegExp('tesla.js', 'g'), path);

                        // SET CSS ENGINE
                        switch (program.css) {
                            case 'sass':

                                pkg.dependencies['node-sass'] = 'latest';
                                data = data.replace(new RegExp('css: "stylus"', 'g'), 'css: "sass"');
                                fs.createReadStream(__dirname + '/_src/lib/templates/css/styles.scss').pipe(fs.createWriteStream(path + '/public/css/styles.scss'));
                                console.log('   Setting CSS preprocessor to '.white + 'SASS'.blue);
                                break;

                            case 'less':

                                pkg.dependencies['less-middleware'] = 'latest';
                                data = data.replace(new RegExp('css: "stylus"', 'g'), 'css: "less"');
                                fs.createReadStream(__dirname + '/_src/lib/templates/css/styles.less').pipe(fs.createWriteStream(path + '/public/css/styles.less'));
                                console.log('   Setting CSS preprocessor to '.white + 'LESS'.blue);
                                break;

                            case 'stylus':

                                pkg.dependencies.stylus = 'latest';
                                fs.createReadStream(__dirname + '/_src/lib/templates/css/styles.styl').pipe(fs.createWriteStream(path + '/public/css/styles.styl'));
                                console.log('   Setting CSS preprocessor to '.white + 'Stylus'.blue);
                                break;

                            default:
                                fs.createReadStream(__dirname + '/_src/lib/templates/css/styles.css').pipe(fs.createWriteStream(path + '/public/css/styles.css'));
                                data = data.replace(new RegExp('css: "stylus"', 'g'), 'css: false');
                        }


                        // SET TEMPLATING ENGINE
                        switch (program.template) {

                            case 'ejs':

                                console.log('   Setting view template to '.white + 'EJS'.blue);

                                pkg.dependencies.ejs = 'latest';
                                scriptTemplate = '<script src="<%= site.dir.lib %>{{src}}" ></script>' + "\n";
                                styleTemplate = '<link rel="stylesheet" href="<%= site.dir.lib %>{{src}}">' + "\n";
                                data = data.replace(new RegExp('html: "jade"', 'g'), 'html: "ejs"');
                                wrench.rmdirSyncRecursive(path + '/app/views');
                                wrench.copyDirSyncRecursive(__dirname + '/_src/lib/templates/views/ejs', path + '/app/views/');

                                // UPDATE SCRIPT FILE
                                var scriptFile = path + '/app/views/_inc/footer.ejs',
                                    scriptContent = fs.readFileSync(scriptFile);

                                // UPDATE STYLE FILE
                                var styleFile = path + '/app/views/_inc/header.ejs',
                                    styleContent = fs.readFileSync(styleFile);

                                break;

                            case 'handlebars':

                                console.log('   Setting view template to '.white + 'Handlebars'.blue);

                                pkg.dependencies['hbs'] = 'latest';
                                scriptTemplate = '<script src="{{site.dir.lib}}{{src}}" ></script>' + "\n";
                                styleTemplate = '<link rel="stylesheet" href="{{site.dir.lib}}{{src}}">' + "\n";
                                data = data.replace(new RegExp('html: "jade"', 'g'), 'html: "hbs"');
                                wrench.rmdirSyncRecursive(path + '/app/views');
                                wrench.copyDirSyncRecursive(__dirname + '/_src/lib/templates/views/handlebars', path + '/app/views/');

                                // UPDATE SCRIPT FILE
                                var scriptFile = path + '/app/views/partials/footer.hbs',
                                    scriptContent = fs.readFileSync(scriptFile);

                                // UPDATE STYLE FILE
                                var styleFile = path + '/app/views/partials/header.hbs',
                                    styleContent = fs.readFileSync(styleFile);


                                break;

                            case 'hogan':

                                console.log('   Setting view template to '.white + 'Hogan'.blue);

                                pkg.dependencies['hogan-middleware'] = 'latest';
                                scriptTemplate = '<script src="{{site.dir.lib}}{{src}}" ></script>' + "\n";
                                styleTemplate = '<link rel="stylesheet" href="{{site.dir.lib}}{{src}}">' + "\n";
                                data = data.replace(new RegExp('html: "jade"', 'g'), 'html: "hogan"');
                                wrench.rmdirSyncRecursive(path + '/app/views');
                                wrench.copyDirSyncRecursive(__dirname + '/_src/lib/templates/views/hogan', path + '/app/views/');

                                // UPDATE SCRIPT FILE
                                var scriptFile = path + '/app/views/_inc/footer.mustache',
                                    scriptContent = fs.readFileSync(scriptFile);

                                // UPDATE STYLE FILE
                                var styleFile = path + '/app/views/_inc/header.mustache',
                                    styleContent = fs.readFileSync(styleFile);

                                break;

                            case 'jade':

                                console.log('   Setting view template to '.white + 'Jade'.blue);

                                pkg.dependencies.jade = 'latest';
                                scriptTemplate = "script(src='#{site.dir.lib}{{src}}')\n";
                                styleTemplate = 'link(rel="stylesheet", href="#{site.dir.lib}{{src}}")' + "\n";

                                wrench.rmdirSyncRecursive(path + '/app/views');
                                wrench.copyDirSyncRecursive(__dirname + '/_src/lib/templates/views/jade', path + '/app/views/');

                                // UPDATE SCRIPT FILE
                                var scriptFile = path + '/app/views/_inc/footer.jade',
                                    scriptContent = fs.readFileSync(scriptFile);

                                // UPDATE STYLE FILE
                                var styleFile = path + '/app/views/_inc/header.jade',
                                    styleContent = fs.readFileSync(styleFile);

                                break;

                            case 'mustache':

                                console.log('   Setting view template to '.white + 'Mustache'.blue);

                                pkg.dependencies['mustache-express'] = 'latest';
                                scriptTemplate = '<script src="{{site.dir.lib}}{{src}}" ></script>' + "\n";
                                styleTemplate = '<link rel="stylesheet" href="{{site.dir.lib}}{{src}}">' + "\n";

                                data = data.replace(new RegExp('html: "jade"', 'g'), 'html: "mustache"');
                                wrench.rmdirSyncRecursive(path + '/app/views');
                                wrench.copyDirSyncRecursive(__dirname + '/_src/lib/templates/views/mustache', path + '/app/views/');

                                // UPDATE SCRIPT FILE
                                var scriptFile = path + '/app/views/_inc/footer.mustache',
                                    scriptContent = fs.readFileSync(scriptFile);

                                // UPDATE STYLE FILE
                                var styleFile = path + '/app/views/_inc/header.mustache',
                                    styleContent = fs.readFileSync(styleFile);

                                break;

                            default:

                        }


                        // PREPROCESSOR LIBRARIES
                        if (program.axis) {
                            pkg.dependencies['axis-css'] = "latest";
                            data = data.replace(new RegExp('cssLibrary: false', 'g'), 'cssLibrary: "axis"');
                            console.log('   Adding support for '.white + 'Axis'.blue);
                        }
                        if (program.bourbon) {
                            pkg.dependencies['node-bourbon'] = 'latest';
                            data = data.replace(new RegExp('cssLibrary: false', 'g'), 'cssLibrary: "bourbon"');
                            console.log('   Adding support for '.white + 'Bourbon'.blue);
                        }
                        if (program.nib) {
                            pkg.dependencies.nib = "latest";
                            data = data.replace(new RegExp('cssLibrary: false', 'g'), 'cssLibrary: "nib"');
                            console.log('   Adding support for '.white + 'Nib'.blue);
                        }

                        var self = this, bowerScripts = '', bowerStyles = '';

                        scriptContent = scriptContent.toString();
                        styleContent = styleContent.toString();

                        // ADD PACKAGES TO BOWER


                        // FE FRAMEWORKS
                        if (program.angular) {
                            bowerScripts = bowerScripts + scriptTemplate.replace('{{src}}', 'angular/angular.min.js');
                            bower.dependencies.angular = 'latest';
                            console.log('   Adding support for '.white + 'Angular'.blue);
                        }
                        if (program.backbone) {
                            bowerScripts = bowerScripts + scriptTemplate.replace('{{src}}', 'backbone/backbone-min.js');
                            bower.dependencies.backbone = 'latest';
                            console.log('   Adding support for '.white + 'Backbone'.blue);
                        }
                        if (program.ember) {
                            bowerScripts = bowerScripts + scriptTemplate.replace('{{src}}', 'ember/ember.min.js');
                            bower.dependencies.ember = 'latest';
                            console.log('   Adding support for '.white + 'Ember'.blue);
                        }

                        // JS LIBRARIES
                        if (program.jquery) {
                            bowerScripts = bowerScripts + scriptTemplate.replace('{{src}}', 'jquery/jquery.min/js');
                            bower.dependencies.jquery = 'latest';
                            console.log('   Adding support for '.white + 'jQuery'.blue);
                        }
                        if (program.mootools) {
                            bowerScripts = bowerScripts + scriptTemplate.replace('{{src}}', 'mootools/Source/Core/Core.js');
                            bowerScripts = bowerScripts + scriptTemplate.replace('{{src}}', 'mootools/Source/Browser/Browser.js');
                            bowerScripts = bowerScripts + scriptTemplate.replace('{{src}}', 'mootools/Source/Class/Class.js');
                            bowerScripts = bowerScripts + scriptTemplate.replace('{{src}}', 'mootools/Source/Element/Element.js');
                            bower.dependencies['mootools'] = 'latest';
                            console.log('   Adding support for '.white + 'MooTools'.blue);
                        }
                        if (program.zepto) {
                            bowerScripts = bowerScripts + scriptTemplate.replace('{{src}}', 'zepto/zepto.min/js');
                            bower.dependencies.zepto = 'latest';
                            console.log('   Adding support for '.white + 'Zepot.js'.blue);
                        }


                        // CSS LIBRARIES
                        if (program.bootstrap) {
                            bowerScripts = bowerScripts + scriptTemplate.replace('{{src}}', 'bootstrap/bootstrap.min.js');
                            bower.dependencies.bootstrap = 'latest';
                            console.log('   Adding support for '.white + 'Bootstrap'.blue);
                        }
                        if (program.foundation) {
                            bowerStyles = bowerStyles + styleTemplate.replace('{{src}}', 'foundation/css/foundation.min.css');
                            bowerScripts = bowerScripts + scriptTemplate.replace('{{src}}', 'foundation/js/foundation.min.js');
                            bower.dependencies.foundation = 'latest';
                            console.log('   Adding support for '.white + 'Foundation'.blue);
                        }
                        if (program.gumby) {
                            bowerStyles = bowerStyles + styleTemplate.replace('{{src}}', 'gumby/css/gumby.css');
                            bowerStyles = bowerStyles + styleTemplate.replace('{{src}}', 'gumby/css/style.css');
                            bowerScripts = bowerScripts + scriptTemplate.replace('{{src}}', 'gumby/js/main.js');
                            bowerScripts = bowerScripts + scriptTemplate.replace('{{src}}', 'gumby/js/plugins.js');
                            bower.dependencies.gumby = 'latest';
                            console.log('   Adding support for '.white + 'Gumby'.blue);
                        }
                        if (program.skeleton) {
                            bowerStyles = bowerStyles + styleTemplate.replace('{{src}}', 'skeleton/stylesheets/base.css');
                            bowerStyles = bowerStyles + styleTemplate.replace('{{src}}', 'skeleton/stylesheets/skeleton.css');
                            bowerStyles = bowerStyles + styleTemplate.replace('{{src}}', 'skeleton/stylesheets/layout.css');
                            bower.dependencies.skeleton = 'latest';
                            console.log('   Adding support for '.white + 'Skeleton'.blue);
                        }


                        styleContent = styleContent.replace(new RegExp('{{bowerHead}}', 'g'), bowerStyles);
                        scriptContent = scriptContent.replace(new RegExp('{{bowerFoot}}', 'g'), bowerScripts);


                        fs.writeFileSync(styleFile, styleContent); // WRITE STYLES TO HEAD
                        fs.writeFileSync(scriptFile, scriptContent); // WRITE SCRIPTS TO FOOT
                        fs.writeFileSync(bowerFile, JSON.stringify(bower, null, 4)); // WRITE BOWER FILE
                        fs.writeFileSync(cfgFile, data); // WRITE CONFIG FILE
                        fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, 4)); // WRITE PACKAGE FILE

                    });

                    // REMOVE UNNEEDED FILES

                });
            });

            process.on('exit', function(){

                // CLEANUP UNUSED STUFF

                ncp(__dirname + '/_src/app/_templates', path + '_lib', function (err) {
                    self.rmdir(path + '/app/_templates');
                });

                fs.unlink(path + '/.git');

                // LET USER KNOW WE'RE DONE
                console.log('   - - - - - - - - - - - - - - - - - - - - - - -');
                console.log('');
                console.log('   Success! You\'re new application is all setup!'.green);
                console.log('');
                console.log('   To get up & running, you just need to run these 2 commands:'.white);
                console.log();
                console.log('   1. install dependencies:'.blue + '      you only need to do this once'.grey);
                console.log('      $'.grey + ' cd %s && sudo npm install'.white, path);
                console.log();
                console.log('   2. launch the app with grunt:'.blue);
                console.log('      $'.grey + ' tesla start'.white);
                console.log('');
                console.log('');
                console.log('   Check out the docs for help or more info: '.white);
                console.log('   https://github.com/teslajs/tesla.js'.blue);
                console.log('');

            });

        }, // END CREATE APPLICATION AT


        packages : function ( program, path, scriptFile, scriptContent, scriptTemplate, styleFile, styleContent ) {

            // UPDATE PACKAGE FILE
            var bowerFile = path + '/bower.json',
                fileContent = fs.readFileSync(bowerFile),
                bower = JSON.parse(fileContent);

            console.log('Setting packages');

            var self = this, bowerScripts = '', bowerStyles = '';

            console.log('script file: ' + scriptFile);

            scriptContent = scriptContent.toString();
            styleContent = styleContent.toString();

            // ADD PACKAGES TO BOWER


            // FE FRAMEWORKS
            if (program.angular) {
                bowerScripts = bowerScripts + scriptTemplate.replace('{{src}}', 'angular/angular.min.js');
                bower.dependencies.angular = 'latest';
            }
            if (program.backbone) {
                bowerScripts = bowerScripts + scriptTemplate.replace('{{src}}', 'backbone/backbone-min.js');
                bower.dependencies.backbone = 'latest';
            }
            if (program.ember) {
                bowerScripts = bowerScripts + scriptTemplate.replace('{{src}}', 'ember/ember.min.js');
                bower.dependencies.ember = 'latest';
            }

            // JS LIBRARIES
            if (program.jquery) {
                bowerScripts = bowerScripts + scriptTemplate.replace('{{src}}', 'jquery/jquery.min/js');
                bower.dependencies.jquery = 'latest';
            }
            if (program.mootools) {
                bowerScripts = bowerScripts + scriptTemplate.replace('{{src}}', 'mootools/Source/Core/Core.js');
                bowerScripts = bowerScripts + scriptTemplate.replace('{{src}}', 'mootools/Source/Browser/Browser.js');
                bowerScripts = bowerScripts + scriptTemplate.replace('{{src}}', 'mootools/Source/Class/Class.js');
                bowerScripts = bowerScripts + scriptTemplate.replace('{{src}}', 'mootools/Source/Element/Element.js');
                bower.dependencies['mootools'] = 'latest';
            }
            if (program.zepto) {
                bowerScripts = bowerScripts + scriptTemplate.replace('{{src}}', 'zepto/zepto.min/js');
                bower.dependencies.zepto = 'latest';
            }


            // CSS LIBRARIES
            if (program.bootstrap) {
                bowerScripts = 'bootstrap/bootstrap.min.js';
                bowerScripts = bowerScripts + scriptTemplate.replace('{{src}}', '');
                bower.dependencies.bootstrap = 'latest';
            }
            if (program.foundation) {
                bowerStyles = 'foundation/css/foundation.min.css';
                bowerScripts = bowerScripts + scriptTemplate.replace('{{src}}', 'foundation/js/foundation.min.js');
                bower.dependencies.foundation = 'latest';
            }
            if (program.gumby) {
                bowerStyles = 'gumby/css/gumby.css';
                bowerStyles = 'gumby/css/style.css';
                bowerScripts = bowerScripts + scriptTemplate.replace('{{src}}', 'gumby/js/main.js');
                bowerScripts = bowerScripts + scriptTemplate.replace('{{src}}', 'gumby/js/plugins.js');
                bower.dependencies.gumby = 'latest';
            }
            if (program.skeleton) {
                bowerStyles = 'skeleton/stylesheets/base.css';
                bowerStyles = 'skeleton/stylesheets/skeleton.css';
                bowerStyles = 'skeleton/stylesheets/layout.css';
                bower.dependencies.skeleton = 'latest';
            }

            // console.log(scriptContent);
            scriptContent = scriptContent.replace(new RegExp('{{bower}}', 'g'), bowerScripts);

            fs.writeFileSync(bowerFile, JSON.stringify(bower, null, 4)); // WRITE PACKAGE FILE
            fs.writeFileSync(scriptFile, scriptContent); // WRITE PACKAGE FILE

        },


        // Check if the given directory `path` is empty.
        emptyDirectory : function (path, fn) {
            fs.readdir(path, function(err, files){
                if (err && 'ENOENT' != err.code) throw err;
                fn(!files || !files.length);
            });
        },

        // CREATE DIRECTORY
        mkdir : function (path, fn) {
            mkdirp(path, 0755, function(err){
                if (err) throw err;
                // console.log('   \033[36mcreate\033[0m : ' + path);
                fn && fn();
            });
        },

        // REMOVE A DIRECTORY
        rmdir : function (path) {

            var self = this;

          if( fs.existsSync(path) ) {
            fs.readdirSync(path).forEach(function(file,index){
              var curPath = path + "/" + file;
              if(fs.statSync(curPath).isDirectory()) { // recurse
                self.rmdir(curPath);
              } else { // delete file
                fs.unlinkSync(curPath);
              }
            });
            fs.rmdirSync(path);
          }
        }, // END RMDIR


        // CREATE FILE
        write : function (path, str) {
            fs.writeFile(path, str);
            console.log('   \x1b[36mcreate\x1b[0m : ' + path);
        }


    }

};