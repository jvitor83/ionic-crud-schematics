"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const ast_utils_1 = require("@schematics/angular/utility/ast-utils");
const change_1 = require("@schematics/angular/utility/change");
const config_1 = require("@schematics/angular/utility/config");
const find_module_1 = require("@schematics/angular/utility/find-module");
const parse_name_1 = require("@schematics/angular/utility/parse-name");
const rxjs_1 = require("rxjs");
const node_fetch_1 = require("node-fetch");
function findRoutingModuleFromOptions(host, options) {
    if (options.hasOwnProperty('skipImport') && options.skipImport) {
        return undefined;
    }
    if (!options.module) {
        const pathToCheck = (options.path || '')
            + (options.flat ? '' : '/' + core_1.strings.dasherize(options.name));
        return core_1.normalize(findRoutingModule(host, pathToCheck));
    }
    else {
        const modulePath = core_1.normalize('/' + (options.path) + '/' + options.module);
        const moduleBaseName = core_1.normalize(modulePath).split('/').pop();
        if (host.exists(modulePath)) {
            return core_1.normalize(modulePath);
        }
        else if (host.exists(modulePath + '.ts')) {
            return core_1.normalize(modulePath + '.ts');
        }
        else if (host.exists(modulePath + '.module.ts')) {
            return core_1.normalize(modulePath + '.module.ts');
        }
        else if (host.exists(modulePath + '/' + moduleBaseName + '.module.ts')) {
            return core_1.normalize(modulePath + '/' + moduleBaseName + '.module.ts');
        }
        else {
            throw new Error('Specified module does not exist');
        }
    }
}
function findRoutingModule(host, generateDir) {
    let dir = host.getDir('/' + generateDir);
    const routingModuleRe = /-routing\.module\.ts/;
    while (dir) {
        const matches = dir.subfiles.filter(p => routingModuleRe.test(p));
        if (matches.length === 1) {
            return core_1.join(dir.path, matches[0]);
        }
        else if (matches.length > 1) {
            throw new Error('More than one module matches. Use skip-import option to skip importing '
                + 'the component into the closest module.');
        }
        dir = dir.parent;
    }
    throw new Error('Could not find an NgModule. Use the skip-import '
        + 'option to skip importing in NgModule.');
}
function addRouteToNgModule(options) {
    const { module } = options;
    if (!module) {
        throw new schematics_1.SchematicsException('module option is required.');
    }
    return host => {
        const text = host.read(module);
        if (!text) {
            throw new schematics_1.SchematicsException(`File ${module} does not exist.`);
        }
        const sourceText = text.toString('utf8');
        const source = ts.createSourceFile(module, sourceText, ts.ScriptTarget.Latest, true);
        const pagePath = (`/${options.path}/` +
            (options.flat ? '' : `${core_1.strings.dasherize(options.name)}/`) +
            `${core_1.strings.dasherize(options.name)}.module`);
        const relativePath = find_module_1.buildRelativePath(module, pagePath);
        const routePath = options.routePath ? options.routePath : options.name;
        const routeLoadChildren = `${relativePath}#${core_1.strings.classify(options.name)}PageModule`;
        const changes = addRouteToRoutesArray(source, module, routePath, routeLoadChildren);
        const recorder = host.beginUpdate(module);
        for (const change of changes) {
            if (change instanceof change_1.InsertChange) {
                recorder.insertLeft(change.pos, change.toAdd);
            }
        }
        host.commitUpdate(recorder);
        return host;
    };
}
function addRouteToRoutesArray(source, ngModulePath, routePath, routeLoadChildren) {
    const keywords = ast_utils_1.findNodes(source, ts.SyntaxKind.VariableStatement);
    for (const keyword of keywords) {
        if (ts.isVariableStatement(keyword)) {
            const [declaration] = keyword.declarationList.declarations;
            if (ts.isVariableDeclaration(declaration) && declaration.initializer && declaration.name.getText() === 'routes') {
                const node = declaration.initializer.getChildAt(1);
                const lastRouteNode = node.getLastToken();
                const changes = [];
                let trailingCommaFound = false;
                if (lastRouteNode.kind === ts.SyntaxKind.CommaToken) {
                    trailingCommaFound = true;
                }
                else {
                    changes.push(new change_1.InsertChange(ngModulePath, lastRouteNode.getEnd(), ','));
                }
                changes.push(new change_1.InsertChange(ngModulePath, lastRouteNode.getEnd() + 1, `  { path: '${routePath}', loadChildren: '${routeLoadChildren}' }${trailingCommaFound ? ',' : ''}\n`));
                return changes;
            }
        }
    }
    return [];
}
// function buildSelector(options: PageOptions, projectPrefix: string) {
//   let selector = strings.dasherize(options.name);
//   if (options.prefix) {
//     selector = `${options.prefix}-${selector}`;
//   } else if (options.prefix === undefined && projectPrefix) {
//     selector = `${projectPrefix}-${selector}`;
//   }
//   return selector;
// }
function buildProperties(options, templateOptions) {
    return (host) => {
        return new rxjs_1.Observable((observer) => {
            node_fetch_1.default(options.url)
                .then(res => res.json())
                .then(data => {
                console.log(JSON.stringify(data));
                let value = data;
                if (Array.isArray(data) && data.length > 0) {
                    value = data[0];
                }
                const finalObj = {};
                Object.keys(value).forEach(key => {
                    finalObj[key] = typeof value[key];
                    if (finalObj[key] !== 'string' && finalObj[key] !== 'boolean' && finalObj[key] !== 'number') {
                        finalObj[key] = 'string';
                    }
                });
                options.obj = JSON.stringify(finalObj);
                options.parameters = Object.keys(value);
                templateOptions.parameters = Object.keys(value);
                console.log('options.parameters');
                console.log(options.parameters);
                observer.next(host);
                observer.complete();
            })
                .catch(function (err) {
                console.error(`JSON parse error ${err}`);
                observer.error(err);
            });
        });
    };
}
function default_1(options) {
    return (host, context) => {
        console.log(context);
        const workspace = config_1.getWorkspace(host);
        if (!options.project) {
            options.project = Object.keys(workspace.projects)[0];
        }
        const project = workspace.projects[options.project];
        if (options.path === undefined) {
            options.path = `/${project.root}/src/app`;
        }
        options.module = findRoutingModuleFromOptions(host, options);
        const parsedPathRead = parse_name_1.parseName(options.path, options.name);
        const templateOptions = Object.assign({}, core_1.strings, { 'if-flat': (s) => options.flat ? '' : s }, options);
        const rule = schematics_1.chain([
            options.url ? buildProperties(options, templateOptions) : schematics_1.noop(),
            addRouteToNgModule(options),
            schematics_1.mergeWith(schematics_1.apply(schematics_1.url('./files'), [
                options.spec ? schematics_1.noop() : schematics_1.filter(path => !path.endsWith('.spec.ts')),
                schematics_1.template(templateOptions),
                schematics_1.move(parsedPathRead.path),
            ])),
        ]);
        return rule(host, context);
    };
}
exports.default = default_1;
//# sourceMappingURL=index.js.map