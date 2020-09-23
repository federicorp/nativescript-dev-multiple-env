All credits to Brendan Ingham, original creator of this amazing hook.

# @nativescript-dev/multiple-environments

This Hook is made for using multiple environments within a nativescript application.

Actually this is a copy of nativescript-dev-multiple-environments adapted to work on NS 7 CLI.

## What it does

First it changes your packageId to whatever you have stated in your `environment-rules.json`

it also copies any files you have suffixed with the name of the environemnt for example : `App_Resources/Android/google-services.staging.json` will get copied to `App_Resources/Android/google-services.json` before building. 

## Selecting Environment

Once you have a initial `environment-rules.json` file you can change between the environments using `--env.use.ENV_NAME`

for example for ios:
`tns run ios --env.use.staging`

this can also be used with other --env args like:

`tns run ios --bundle --env.aot --env.uglify --env.use.release`

## Environments

a basic environment-rules.json file is generated for you it looks like this: 

```(javascript)

{
    "version": "1.0.0",
    "default": "staging",
    "extraPaths": [
        'app/environments'
    ],
    "environments": [
        {
            name: "staging",
            packageId: "org.nativescript.appName.staging",
            copyRule: "(.*\\.staging\\..*)"
        },
        {
            name: "release",
            packageId: "org.nativescript.appName.release",
            copyRule: "(.*\\.release\\..*)"
        }
    ]
}

```

You can tweak this however you want, and add as many environments as you like.

ExtraPaths is Optional, but can add multiple paths within the app. these will follow the same rules for the rules. 