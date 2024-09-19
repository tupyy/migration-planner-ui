## @migration-planner-ui/agent-client@1.0.0-alpha

This package is a TypeScript/JavaScript client for the [Migration Planner - Agent API](https://github.com/kubev2v/migration-planner) that utilizes the [Fetch API](https://fetch.spec.whatwg.org/). It can be used in the following environments:

Environment
* Node.js
* Modern browsers

Language level
* ES6

Module system
* ES6 module system

It can be used in both TypeScript and JavaScript. In TypeScript, the definitions will be automatically resolved via `package.json`. ([Reference](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html))

### Building

To build and transpile the typescript sources to javascript use:
```
yarn install
yarn build
```

### Publishing

First build the package then run `yarn npm publish`

### Consuming

Navigate to the folder of your consuming project and run one of the following commands.

_published:_

```
yarn add @migration-planner-ui/agent-client@1.0.0-alpha
```

_unPublished (not recommended):_

```
yarn add PATH_TO_GENERATED_PACKAGE
```
