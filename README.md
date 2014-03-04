TINYPNG
================================================================

NodeJS script to use [https://tinypng.com/](https://tinypng.com/) API Service

Given an input folder, the script search recursively all `.png` in the folder and replace
all these images with their compressed version

The service needs an API key [https://tinypng.com/developers](https://tinypng.com/developers)

Install
----------------------------------------------------------------

must be installed globally using npm

    npm install -g git+https://github.com/MarcelLab/node-tinypng.git


Use
----------------------------------------------------------------

    # go to your project folder
    $ cd path/to/project
    # launch the binary
    $ tinypng

the script will then ask for a few informations :

-   api key
-   input folder (relative to the path the process is launched)
-   save config for later use
-   abort - remind the user to backup his files before actually calling the service


@TODOS
----------------------------------------------------------------

refactor to allow programatic use inside an application