
# Getting started

To get the Node server running locally:

- Clone this repo
- `npm install` and `cd client` `npm install` to install all required dependencies
- Create MongoDb Cluster and Get Connection MongoDb URI
- Set environment variables in `config.env` under `./config`
  * Set `MONGOURI = <YOUR_MONGO_URI>`
  * Set `JWT_SECRET_KEY = <YOUR_SECRET_KEY>`
  * Set `SMTP_EMAIL=<YOUR_GMAIL_EMAIL>`
  * Set `SMTP_PASS=<YOUR_GMAIL_PASSWORD>`
- `npm run dev` to start the local server and client side

# Code Overview

## Dependencies

- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - For generating JWTs used by authentication
- [mongoose](https://github.com/Automattic/mongoose) - For modeling and mapping MongoDB data to JavaScript 
- [slugify](https://github.com/simov/slugify) - For encoding titles into a URL-friendly format
- [bcryptjs](https://github.com/dodo/node-slug) - Hashing Password
- [dotenv](https://github.com/motdotla/dotenv) - Zero-Dependency module that loads environment variables
- [multer](https://github.com/expressjs/multer) - Node.js middleware for uploading files
- [nodemailer](https://github.com/nodemailer/nodemailer) - Send e-mails from Node.js
- [react](https://github.com/reactjs/reactjs.org) - React JS
- [bootstrap](https://github.com/twbs/bootstrap) - Bootstrap
- [axios](https://github.com/axios/axios) - For Sending request to server.
- [redux](https://github.com/reduxjs/redux) - For Global State.
- [react-router-dom]


## Application Structure

- `server.js` - The entry point to our application. This file defines our express server and connects it to MongoDB using mongoose. It also inncludes the routes we'll be using in the application.
- `config/` - This folder contains configuration for central location environment variables and other configurations.
- `routes/` - This folder contains the route definitions (answer, question etc. ) for our API.
- `models/` - This folder contains the schema definitions for our Mongoose models (User, Post,Comment).
- `public/` - This folder contains static files for our API.
- `middleware/` - This folder contains middlewares for our API.
- `helpers/` - This folder contains helper functions for adapting 3rd party libraries for our API.
- `client/src/components` - This folder contains pages.

## Error Handling

In `middleware/customErrorHandler.js`, we define a error-handling middleware for handling Mongoose's errors and our own errors.

## Authentication

Requests are authenticated using the `Authorization` header and value `Bearer: {{token}}`. with a valid JWT. 

We define express middlewares in `middleware/authorization/auth.js` that can be used to authenticate requests. The `required` middlewares returns `401` or `403`

## Project Screens

### Home Page
<a href="https://resimyukle.xyz/i/MaT7AI"><img src="https://i.resimyukle.xyz/MaT7AI.png" /></a>

### Login Page
<a href="https://resimyukle.xyz/i/TK95ef"><img src="https://i.resimyukle.xyz/TK95ef.png" /></a>

### Register Page. A confirmation mail sendded after registiration.
<a href="https://resimyukle.xyz/i/63zcae"><img src="https://i.resimyukle.xyz/63zcae.png" /></a>

### User Search
<a href="https://resimyukle.xyz/i/OJQT1z"><img src="https://i.resimyukle.xyz/OJQT1z.png" /></a>

### Create Post
<a href="https://resimyukle.xyz/i/NRW7bN"><img src="https://i.resimyukle.xyz/NRW7bN.png" /></a>

### Your following Posts
<a href="https://resimyukle.xyz/i/2UTTeR"><img src="https://i.resimyukle.xyz/2UTTeR.png" /></a>

### Your Profile
<a href="https://resimyukle.xyz/i/9H1yxW"><img src="https://i.resimyukle.xyz/9H1yxW.png" /></a>

### User Profile
<a href="https://resimyukle.xyz/i/cxfNHT"><img src="https://i.resimyukle.xyz/cxfNHT.png" /></a>



## API Specifications
## Models

#### User
- name
  * type : String
  * required : true
  * Validation : Please provide a name
- email
  * type : String
  * required : true
  * unique : true
  * Validation with Regex : Please provide a valid email
- password
  * type : String
  * required : true
  * minlength : 6
  * Validation : Please provide a password
- createdAt
  * type : String
  * default : Date.now
- profile_image
  * type : String
- resetPasswordToken
  * type : String
- resetPasswordExpire
  * type : Date
- followers
  * type : ObjectId
- following
  * type : ObjectId
- followingCount
  * type : Number
- followersCount
  * type : Number 


#### Post

- title
  * type : String
  * required : true
  * Validation : Please Provide a title
- title
  * type : String
  * required : true
  * Validation : Please Provide a body
- photo
  * type : String
- createdAt
  * type : Date
- likes
  * type : Array
- comments
  * type : Array
- likeCount
  * type : Number
  * default : 0

#### Comment

- title
  * type : String
  * Validation : Please Provide a min 6 length
- user 
 * type : mongoose.Schema.ObjectId
- post 
 * type : mongoose.Schema.ObjectId
- createdAt
  * type : Date