# ESN-F16-SA6
SA6 team project repo (PLEASE DO NOT CREATE ANY PUBLIC REPO INSIDE CMUSV-FSE)

Team Member: Fengnan, Peng, AmyZ, Wanya, Xiaohan Shen

# Environment Setup Instruction

> **Prerequisite**
> 1. Make sure you have NodeJS, MongoDB installed in your OS
> 2. Install Bower: `$ npm install -g bower`
> 3. Install Grunt: `$ npm install -g grunt-cli`
>
> **Run the App:**
> 1. Clone the github repo to your local

> 2. Locate to the directory that contains `package.json`

> 3. Run `npm install`

> 4. Type `mongod` in your command line tool

> 5. Type `grunt` in your command line tool

> 6. Make sure you can see this in following :
>  
>  > Running "nodemon:dev" (nodemon) task
    [nodemon] 1.10.2
    [nodemon] to restart at any time, enter `rs`
    [nodemon] watching: *.*
    [nodemon] starting `node server.js`
    Server Up on: 5001
	MongoDB connected successfully!

>Go to http://localhost:5001

# Testing

 > 1. Run `$ npm install --global mocha --save` (you may need `sudo`)
 > 2. Type `grunt test` into the command line.

# Application Folder Structure
* **controllers/** – defines your app routes and their logic

* **helpers/** – code and functionality to be shared by *different parts of the project

* **middlewares/** – Express middlewares which process the  *incoming requests before handling them down to the *routes

* **models/** – represents data, implements business logic *and handles storage

* **public/** – contains all static files like images, styles and javascript(AngularJS), views(AngularJS)

* **views/** – provides templates which are rendered and served by your routes

* **test/** – tests everything which is in the other folders

* **server.js** – initializes the app and glues everything together
* **package.json** – remembers all packages that your app depends on and their versions

* **bower_componenets/** - dependencies installed by bower, like angular, bootstrap, jquery
