# Password Game Extension

A tool to help complete password game.

This doesn't read ANY data from the website.
The input for all the tools are from the user not the website.

This extension isn't on `Chrome Web Store` because you need to pay a $5 "verification" fee to sign up as a developer to upload any extensions.

# Current Tools

1) `Video Search`: Finds a video of certain length.
    1) Input the time.
    2) Choose a filter if you want to.
    3) Click Search

2) `Chess Solver`: Finds the solution to the Chess problem.
    1) Right click the image of the chess problem
    2) Click `Inspect` in the menu
    3) Expand the div that came up
    4) You should see a `<img>` element
    5) Inside that element you should see something like: `src="/password-game/chess/puzzle134.svg"`
    6) Input the number between `puzzle` and `.svg` into the solver
    7) You should get a solution, just press `Copy` then paste it into the password.

3) `Input Validator`: Checks if any rules are broken.
    1) Currently only rules: 5, 9 and 18 are supported
    2) Copy and Paste the password into the text area
    3) You should get a result of all the rules that you passed and failed.

# Loading the extension

1) Find a place you want to store the extension
2) Unzip the extension
3) Go to `Google Chrome`(or perfered browser)
4) Go to browser `Settings`
5) Find the `Extensions` area in settings
6) Click `Manage Extensions`
7) Find the toggle called `Developer Mode` and turn that on
8) Click `Load Unpacked`
9) Navigate and Select the folder of the Extension
    - Example: `C:\Users\user\Downloads\Password Game Extension\`

The extension should now be loaded.
You can pin the extension to make it easier to use.
