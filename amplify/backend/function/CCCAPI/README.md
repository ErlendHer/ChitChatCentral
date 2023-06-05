## Development

1. Do not edit files in `src` as this is the compiled typescript output. Only
edit the files in lib/. 
2. To test locally you can run `npm run build` and then test the function
by running `amplify mock function CCCAPI` in the root directory of the project.

**NOTE:** You need to keep the `package.json` file in the src directory synced with the `package.json` in the `lib` folder. Copying the file over during build does not work, as
we need to separate between devDependencies and dependencies. If the lambda function fails due to a import error, make sure that the two package.json files are in sync.