# Mini Express boilerplate

Looking for a [Clementine.js](http://www.clementinejs.com/)-like, a boilerplate  that contains the strict minimum so I get started on my projects.

## Features
* ExpressJS `4`
* Uses Mongoose `4.11`
* Passport authentication
  * Local (using email and password)
  * Facebook authentication
  * Twitter authentication
* Uses SASS stylesheets (autocompiled)
* Uses EJS templating language
* MVC structure
* Security
  * Use [Helmet](https://expressjs.com/en/advanced/best-practice-security.html#use-helmet), it helps securing the app by setting various HTTP headers.
  * Use [csurf](https://www.npmjs.com/package/csurf) for [CRSF](https://en.wikipedia.org/wiki/Cross-site_request_forgery) protection. [**Important: How to use it**]()

* User Schema (Authentication, CRUD API)

## Getting Started

### Prerequisites
* [MongoDB](https://www.mongodb.org/downloads)
* [Node.js](http://nodejs.org/)

### Usage
To use this template you need to clone it, install dependencies, add your [API keys](#getting-api-keys) (in order to work with Facebook and Twitter authentication APIs).
```shell
# Clone this repository in a new folder, let's call it "my-boilerplate"
git clone my-boilerplate

# Navigate to "my-boilerplate"
cd my-boilerplate

# Install NPM dependencies
npm install # If you prefer YARN just run "yarn install"

# Copy the .env file example to a new file and place your API keys there
# .env file will be ignored by GIT and it should contain your secret Data/Keys
cp .env.example .env

```

#### Getting API keys

The `.env` file must contain you Facebook and Twitter API keys you can get these keys from:

* [Facebook](https://developers.facebook.com/apps/async/create/platform-setup/dialog/)
* [Twitter](https://apps.twitter.com/app/new)

#### Securing forms against CSRF
You must add this tag to your `<form>` in
```html
<input type="hidden" name="_csrf" value="<%=csrftoken%>" />
```

If you want to disable CSRF protection:
* Comment these lines in `app.js`

```javascript
pp.use(csrf());
app.use(function(req, res, next){
 res.locals.csrftoken = req.csrfToken();
 console.log(req.csrfToken());
 next();
});
```

* Remove tags using `csrftoken` variable ( `views/users/login.ejs` and `views/users/signup.ejs`  )
## Contributing

Feel free to `fork` this project and add whatever you like, if you have any suggestions or any comments please feel free to contact me or to open an issue.

### TODO
- [ ] Link password accounts
- [ ] Work on front-end
- [ ] Add awesome stuffs

## Authors
* [Fortas Abdeldjalil](https://github.com/Fcmam5)
See also the list of [contributors]('./CONTRIBUTORS.md') who participated in this project.

## License
This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details

## Acknowledgments

This project wouldn't be possible without all these amazing tutorials and these precious recourses:
* [Scotch.io](https://scotch.io/series/easy-node-authentication) for their great `Easy Node Authentication series`.
* [Express: Production Best Practices: Security](https://expressjs.com/en/advanced/best-practice-security.html)
* [Basic Security Settings: Express.js Training](https://youtu.be/_mp535F18Qg)
