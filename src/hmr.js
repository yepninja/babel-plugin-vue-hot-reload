
const hmrAst = (babel, id, component) => babel.parse(`
    if (module.hot) {
        var options = typeof ${component} === 'function' ? ${component}.options : ${component}
        var api = require('vue-hot-reload-api')

        api.install(require('vue'))

        if (api.compatible) {
            module.hot.accept()
            if (!module.hot.data) {
                api.createRecord('${id}', options)
            } else {
                api.reload('${id}', options)
            }
        }
    }
`).program.body

module.exports = hmrAst

// path.insertAfter(
//     t.ifStatement(
//         // if (module.hot)
//         t.memberExpression(
//             t.identifier('module'),
//             t.identifier('hot')
//         ),
//         t.blockStatement([
//             // var api = require("vue-hot-reload-api");
//             t.variableDeclaration(
//                 'var',
//                 [
//                     t.variableDeclarator(
//                         t.identifier('api'),
//                         t.callExpression(
//                             t.identifier('require'),
//                             [
//                                 t.stringLiteral('vue-hot-reload-api')
//                             ]
//                         )
//                     )
//                 ]
//             ),
//             // api.install(require('vue'))
//             t.expressionStatement(
//                 t.callExpression(
//                     t.memberExpression(
//                         t.identifier('api'),
//                         t.identifier('install')
//                     ),
//                     [
//                         t.callExpression(
//                             t.identifier('require'),
//                             [
//                                 t.stringLiteral('vue')
//                             ]
//                         )
//                     ]
//                 )
//             ),
//             // if (api.compatible) {
//             t.ifStatement(
//                 t.memberExpression(
//                     t.identifier('api'),
//                     t.identifier('compatible')
//                 ),
//                 t.blockStatement([
//                     // module.hot.accept();
//                     t.expressionStatement(
//                         t.callExpression(
//                             t.memberExpression(
//                                 t.memberExpression(
//                                     t.identifier('module'),
//                                     t.identifier('hot')
//                                 ),
//                                 t.identifier('accept')
//                             ),
//                             []
//                         )
//                     ),
//                     // console.log()
//                     t.expressionStatement(
//                         t.callExpression(
//                             t.memberExpression(
//                                 t.identifier('console'),
//                                 t.identifier('log')
//                             ),
//                             [
//                                 t.identifier(componentExportName)
//                             ]
//                         )
//                     ),
//                     // if (!api.isRecorded('${id}')) {
//                     t.ifStatement(
//                         t.unaryExpression(
//                             '!',
//                             t.callExpression(
//                                 t.memberExpression(
//                                     t.identifier('api'),
//                                     t.identifier('isRecorded')
//                                 ),
//                                 [
//                                     t.stringLiteral(id)
//                                 ]
//                             )
//                         ),
//                         // api.createRecord('${id}', component.options)
//                         t.blockStatement([
//                             t.expressionStatement(
//                                 t.callExpression(
//                                     t.memberExpression(
//                                         t.identifier('api'),
//                                         t.identifier('createRecord')
//                                     ),
//                                     [
//                                         t.stringLiteral(id),
//                                         t.memberExpression(
//                                             t.identifier(componentExportName),
//                                             t.identifier('options'),
//                                         )
//                                     ]
//                                 )
//                             )
//                         ]),
//                         // api.reload('${id}', component.options)
//                         t.blockStatement([
//                             t.expressionStatement(
//                                 t.callExpression(
//                                     t.memberExpression(
//                                         t.identifier('api'),
//                                         t.identifier('reload')
//                                     ),
//                                     [
//                                         t.stringLiteral(id),
//                                         t.memberExpression(
//                                             t.identifier(componentExportName),
//                                             t.identifier('options'),
//                                         )
//                                     ]
//                                 )
//                             )
//                         ])
//                     )
//                 ])
//             )
//         ]),
//     )
// )