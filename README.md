# context-level-logger
> Lib to enforce the use of context and level on logging


## Usage

```sh
npm i --save context-level-logger
```

```javascript
// infra.js
import { createParentContext } from 'context-level-logger'
export const loggerParentContext = createParentContext('my-app-name');

// my-contexts.js
import { loggerParentContext } from './infra'
const loggerContext1 = loggerParentContext.createChildContext('my-context-1')
const loggerContext2 = loggerParentContext.createChildContext('my-context-2')

loggerContext1.info('just saying 1...')
loggerContext2.info('just saying 2...')

loggerContext1.debug('debugging a problem...')

loggerContext2.error('some error happened', new Error())
loggerContext2.warning('unexpected behavior here...')
```

Since this lib is a wrapper for [debug module](https://www.npmjs.com/package/debug), it is necessary to set the `DEBUG` environment variable up as described on the `debug` repo.

For instance, based on the above code, if I set the following DEBUG environment variable:

```bash
# log only info logs
export DEBUG=*:info
```

it will log at *stdout* the following output:

```bash 
my-app-name:my-context-1:info just saying 1...
my-app-name:my-context-2:info just saying 2... 
```

```bash
# log info only from my-contxt-1 and any errors
export DEBUG=*:my-context-1:info,*:error
```
it will log at *stdout* the following output:

```bash
my-app-name:my-context-1:info just saying 1...
my-app-name:my-context-2:error some error happened Error
```

### Install a local context-level-logger on your project

It's not unusual to need to run a local npm package from your project. In order to do so, follow these steps:

```sh
cd context-level-logger/
npm run build
npm link

cd ../my-awesome-node-api/
npm link context-level-logger
```

Done! You can now use the context-level-logger on your project.

### Testing

```sh
npm run lint && npm test
```