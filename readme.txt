Setup boiler plate for NodeJS and ExpressJS
Boiler Plate:

It is a generic code or function that we are using in project repeatedly at different places. So programmers code like boiler plate to save their time to write same line of code in every module, also can use in different projects.

NodeJS:

It is free open source, cross-platform runtime environment for developing server-side and networking applications.

It runs on various platforms (Windows, Linux, Mac OS etc.) and uses JavaScript on the server.

It is embedded in C++ and compile JavaScript by using goggle’s v8 engine.

It uses asynchronous programming and can do massive things for you.

For more information go to the link below:

https://nodejs.org/en/

ExpressJS:

It is Node.js web framework that has gained great popularity because of its simplicity. It has easy-to-use routing and simple support for view engines.

Let’s Start

For setting up a boiler plate for node.js and express.js we must use folder structure.

Public Folder:

​Everything in this folder is accessible to people connecting to your application. This folder contains images folder and style-sheet folder.

In images folder we store IMAGES that we will use in our project.

In style-sheet folder we CSS files.

Routes Folder:

In this folder we will put our modules like AUTH and in it we have files login.js, signup.js and forgotPassword.js etc.

Middleware Folder:

In this folder we write logger.js file, we use middleware functions to manage application’s request-response lifecycle. Middleware functions have access to the request object(req), the response object(res), and the next middleware function.

Middleware functions can perform the following tasks:

Execute any code.

Make changes to the request and the response objects.

End the request-response cycle.

Call the next middleware function in the stack.

We can also use third party middleware like “morgan”, “helmet” and can easily install e.g., “npm i morgan”.

Error Handling:

I have used Winston for error handling and created 2 file in middleware folder error.js and logger.js. In logger.js I write some Winston code about error level and create a .log file to store error details init and in error.js file error will send to server and Winston. Install it with npm command. “npm i winston”.

Utils:

In this folder we add some reused functions.

Run:

To run the projects we can install nodemon “npm i nodemon”, Why nodemon? When we are developing the node app we keep changing on the project we just need to save the changes nodemon will update it on server without stopping and then starting project every-time. See the attached picture of command prompt how to run project by using nodemon.

Validate Data:

I have used JOI to validate incoming data to the API, first install it by this command “npm i joi”. I have attached the picture how to validate data using JOI.

.env file:

Variables or keys that you don’t want to share so you use environment variables. For multiple variables we can install “npm dotenv --save”. To know how use environment variables with dotenv see the picture.

.gitignore file:

To ignore some file or folder we use .gitignore file. whatever file name you will write in .gitignore that will not pull or push in github.

Prettier:

Prettier is a code formatter that format your code, not only .js files also .css files code. open VS Code go to “Setting” then “Extensions” and search for “Prettier-Code Formatter”.

ESLint:

There are some code quality rules such as variable assigned but never used, prefer-promise-reject-errors or no-implicit-global etc. ESlint catch bugs in your code according code quality rules. Installing procedure “npm install eslint --save-dev”, then set up a configuration file “npx eslint --init”.

Note: things you need to install. “npm init --yes”, “npm i express” etc. 

