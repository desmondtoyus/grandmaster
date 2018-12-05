### Folders and file structure

#### config

Folder contains `config.json` file for the Sequelize ORM. Depends on the environment different db will be used.

#### controllers

Folder contains controller files.

#### models

Folder contains models files for the Sequelize ORM. Models follow the db schema.

`index.js` file combines all the models and creates relations.

#### services

Folder contains `passport.js` file which is auth service for authenticating with a password and JWT token.

#### tests

Tests need to be rewritten and added missing ones.

#### utils

Folder contains different helper files.

* `actions.js` contains different actions constants to use with roles.
* `roles.js` contains roles constants
* `validators.js` contains data input validators
* `vars.js` contains different constants that may needed to be moved to a different location.

#### Top level files

`index.js`

* Entry file of the services app

`router.js`

* Contains all the endpoint routes

`ui.routes.js`

* File that ensures that every request with `/ui/*` returns the same `index.html` file. Essential for single page applications.

`utils.js`

* Older utils file. Should be removed after making sure there is no use of the helper methods inside.