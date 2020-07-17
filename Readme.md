## ArtViva school backend
![Heroku](https://heroku-badge.herokuapp.com/?app=heroku-badge)
### Node.js, Express, MongoDB, Mongoose, Jest, ESLint

Master branch is on https://artviva.herokuapp.com

Link to front-end [repo](https://github.com/GavrilenkoGeorgi/artviva-frontend)

Users can register, login, activate account, reset password.
Two types of users, admins and users. Users can create groups and pupils, admin all the
other stuff like approving/deleting user accounts, creating teachers and departments.

### Build Setup

``` bash
# install dependencies
npm install

# start server
npm start

# nodemon watch
npm run watch

# run tests
npm run test

# run api test
npm run test:userapi

#build react user ui
npm run build:ui

#build ui and deploy
npm run deploy:full

#start in a test environment mode
npm run start:test
```
