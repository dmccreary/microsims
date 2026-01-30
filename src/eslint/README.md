# Testing the ESLint Program

It needs to be customized for the p5.js program that
had built-in setup() and draw() functions.

## Setup the Default Init file
npx eslint --init
You can also run this command directly using 'npm init @eslint/config@latest'.
Need to install the following packages:
@eslint/create-config@1.11.0
Ok to proceed? (y) y

> npx
> "create-config"

@eslint/create-config: v1.11.0

✔ What do you want to lint? · javascript
✔ How would you like to use ESLint? · problems
✔ What type of modules does your project use? · script
✔ Which framework does your project use? · none
✔ Does your project use TypeScript? · No / Yes
✔ Where does your code run? · browser
ℹ The config that you've selected requires the following dependencies:

eslint, @eslint/js, globals
✔ Would you like to install them now? · No / Yes
✔ Which package manager do you want to use? · npm
☕️Installing...

added 1 package, changed 1 package, and audited 87 packages in 720ms

23 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
✔ Successfully created /Users/dan/Documents/ws/linear-algebra/src/test-eslint/eslint.config.mjs file.