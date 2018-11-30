# Schematics - jvitor83/ionic-crud-schematics


### Install the tools
- Install [Node.js](https://nodejs.org/en/download/)
```bash
npm i -g @angular/cli ionic
```

### Create your project
```bash
ionic start --type=angular MyProject
cd MyProject
```


## Install:
```bash
npm install --save-dev jvitor83/ionic-crud-schematics
```

## Configure:
```bash
ng config cli.defaultCollection @jvitor83/ionic-crud-schematics
```

## Import module `HttpClientModule` at `app.module.ts`
```typescript
...
import { HttpClientModule } from '@angular/common/http';
...
@NgModule({
    imports: [ 
        HttpClientModule
        ...
    ]
...
```

## Generate:
```bash
ng g crud --name=breweries --url=https://api.openbrewerydb.org/breweries --force
```
