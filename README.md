# mes-result-processing-service

A serverless microservice responsible for responsible for passing practical driving test results to internal DVSA systems for processing, such as TARS.

## Dependencies

DVSA dependencies have been moved from npm to github so in order to install/update any private @DVSA packages
you are required to have an entry in your global `~/.npmrc` file as follows:

```shell
//npm.pkg.github.com/:_authToken=<your auth token here>
```
