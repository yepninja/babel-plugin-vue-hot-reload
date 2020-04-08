/**
 * @typedef { import("@babel/types") } BabelTypes
 */

module.exports = function(babel) {
	
	/** @type {BabelTypes} */
    const t = babel.types
    const componentExportName = '__component__'

    // const id = Math.random().toString()
    const id = 'abc'
    const ast = babel.parse(`if (module.hot) {
        var api = require('vue-hot-reload-api')
        api.install(require('vue'))
        if (api.compatible) {
          module.hot.accept()
          if (!api.isRecorded(id)) {
            api.createRecord('${id}', ${componentExportName}.options)
          } else {
            api.reload('${id}', ${componentExportName}.options)
          }
        }
      }`).program.body
    //   console.log(ast)

	// plugin contents
	return {
		name: 'vuex-simple',
		visitor: {
            ExportDefaultDeclaration(path) {
                // const {filename} = path.hub.file.opt
                // console.log(filename)
                // if (!/tsx$/.test(filename)) {
                //     return
                // }

                // const id = Math.random().toString()
                const {node} = path
                const component = path.get('declaration')
                const scope = component.scope

                path.insertBefore(
                    t.variableDeclaration(
                        'const',
                        [
                            t.variableDeclarator(
                                t.identifier(componentExportName),
                                t.isClassDeclaration(component.node)
                                 ? t.classExpression(component.node.id, null, component.node.body)
                                 : component.node,
                            )
                        ]
                    )
                );
                component.replaceWith(t.identifier(componentExportName))
                scope.registerDeclaration(component)

                path.insertAfter(ast)
                return
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
            }
		}
	}
}
