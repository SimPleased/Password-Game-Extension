# Password Game Extension

A tool to help complete password game.
This doesn't read ANY data from the site.

Current tools are:
`Video Search`: finds a video of certain length.
    -Input the time.
    -Choose a filter if you want to.
    -Click Search

`Chess Solver`: finds the solution to the puzzle.
    -Right click the image of the chess problem
    -Expand the div that came up
    -You should see a `<img>` element
    -Inside that element you should see something like: `src="/password-game/chess/puzzle134.svg"`
    -Input the number between `puzzle` and `.svg` into the solver
    -You should get a solution, just press `Copy` then paste it into the password.

`Input Validator`
    -Currently only rules: 5, 9 and 18 are supported
    -Copy and Paste the password into the text area
    -You should get a result of all the rules that you passed and failed.

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
