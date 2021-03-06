# devY Red Pokemon Trainer

The devY Red Pokemon Trainer app is a web application that was built to accompany the live devY Red Javascript course taught at [9 Dots Community Learning Center](http://9dots.org) over the [summer](http://www.9dots.org/summer/) of 2016. It's designed for middle school students with little to no prior programming experience. The course focuses on variables, functions, conditionals, and the basics of object-oriented programming. It also includes some supplementary exercises covering arrays and for-loops that were added for students who completed the course early.

![overview screenshot](https://raw.githubusercontent.com/dqrs/devy-red/master/screenshots/overview.png)

## Table of Contents
1. [Usage](#usage)
  1. [Writing Code](#1-writing-code)
  1. [Executing Code in the App Interface](#2-executing-code-in-the-app-interface)
  1. [Syntax Validation](#3-syntax-validation)
  1. [Testing](#4-testing)
  1. [Code Activation](#5-code-activation)
1. [Live Demo](#live-demo)
1. [Contributing](#contributing)
1. [License](#license)

## Usage

### 1. Writing Code
The course starts in a code editor (in this case Cloud9's Ace Editor), where students are given a technical specification describing a Javascript variable, function, or method that the student is challenged to create.

![writing code screenshot](https://raw.githubusercontent.com/dqrs/devy-red/master/screenshots/0.png)

### 2. Executing Code in the App Interface
After writing and saving her code in the editor, the student can execute her code by switching to the app interface generated by "trainer.html". There the student can click the corresponding 'code tag,' which gives the student a description of the Javascript expression that should be entered to read a variable or call a function/method.

![calling code screenshot](https://raw.githubusercontent.com/dqrs/devy-red/master/screenshots/1.png)

### 3. Syntax Validation
The student's Javascript expression is validated against the expected expression for that code tag. The code is only executed if the expression is entered correctly.

![incorrect syntax screenshot](https://raw.githubusercontent.com/dqrs/devy-red/master/screenshots/2.png)

![correct syntax screenshot](https://raw.githubusercontent.com/dqrs/devy-red/master/screenshots/3.png)

### 4. Testing
Then unit tests are run on the code verifying its correctness, with partial credit given for each test passed.

![testing screenshot](https://raw.githubusercontent.com/dqrs/devy-red/master/screenshots/4.png)

### 5. Code Activation
Finally, the code is 'activated' by the app, visualizing the end-result of the executed expression.

![code activation](https://raw.githubusercontent.com/dqrs/devy-red/master/screenshots/5.png)

**[Back to top](#table-of-contents)**

## Live Demo
To access a live demo, please go to the following Cloud9 Workspace: https://ide.c9.io/devytest/devy-red-demo. Login with username: **devytest** and password: **devytest123**

(Note: a Github account is needed to log in and save your progress through the course.)

Once in the devY Red Demo workspace, look for the file tree on the left-hand side. Right-click on "trainer.html" and select "Preview." This will generate a live-reloadable instance of the application linked to the javascript files in the "js" folder. 

Then open up "app.js" to begin the course. You'll find some basic documentation about the built-in API that some of the specifications require you to use in "docs/api-documentation.txt". Be sure to save your code before trying to execute it in the app. The app should automatically refresh when the code is changed, but if it does not, you should manually refresh the page between code changes. Once you've finished the exercises in "app.js", move on to "trainer.js". 

(For instructions on how to run the application locally, please email me at dgershun AT usc DOT edu. Due to the use of Firebase, running locally is slightly non-trivial.)

**[Back to top](#table-of-contents)**

## Contributing

Open an issue to discuss potential changes/additions.

**[Back to top](#table-of-contents)**

## License

#### (The MIT License)

Copyright (c) 2016 David Gershuni

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: 

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

**[Back to top](#table-of-contents)**







