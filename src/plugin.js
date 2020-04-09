const genId = require('./genId')
const hmrAst = require('./hmr')
const syntaxTs = require('@babel/plugin-syntax-typescript')

/**
 * @typedef { import("@babel/types") } BabelTypes
 * @typedef { import("@babel/core") } Babel
 * @typedef { import("@babel/core").PluginObj } PluginObj
 * @typedef { import("@babel/core").NodePath } NodePath
 */


/**
 * Check path has JSX
 * @param {BabelTypes} t
 * @param {NodePath} path
 * @returns {Array.<NodePath['node']>}
 */
const getProps = (t, {node}) => {
    if (t.isObjectExpression(node)) {
        return node.properties
    }
    if (t.isClassDeclaration(node)) {
        return node.body.body
    }
    return []
}

/**
 * Check path has JSX
 * @param {BabelTypes} t
 * @param {NodePath} path
 * @returns {boolean}
 */
const checkRender = (t, path) => {
    return getProps(t, path).some(prop => {
        const name = prop.key.name
        return prop.key.name === 'render' || prop.key.name === 'template'
    })
}

/**
 * Check path has JSX
 * @param {BabelTypes} t
 * @param {NodePath} path
 * @returns {boolean}
 */
const checkJSX = (t, path) => {
    let hasJSX = false

    path.traverse({
        JSXElement(elPath) {
            hasJSX = true
        },
    })

    return hasJSX
}

/**
 * @param {Babel} babel
 * @returns {PluginObj}
 */
module.exports = function(babel) {
	
    const t = babel.types
    const componentExportName = '__component__'

	return {
        name: 'vue-hot-reload',
        inherits: require('@babel/plugin-syntax-jsx').default,
		visitor: {
            ExportDefaultDeclaration(exportPath, {filename, cwd, opts}) {
                const { requireJSX = true, requireRender = true } = opts

                const id = genId(filename, cwd)
                const exportNode = exportPath.node
                const componentPath = exportPath.get('declaration')
                const componentNode = componentPath.node
                const isClass = t.isClassDeclaration(componentNode)

                const hasJSX = checkJSX(t, componentPath)
                const hasRender = checkRender(t, componentPath)

                if (requireJSX && !hasJSX) {
                    return
                }

                if (requireRender && !hasRender) {
                    return
                }

                // component replace with __component__
                componentPath.replaceWith(t.identifier(componentExportName))

                // if class insert in before export
                if (isClass) {
                    exportPath.insertBefore(componentNode)
                }

                // insert hmr script
                exportPath.insertAfter(hmrAst(babel, id, componentExportName))

                // insert: var __component__ = component
                exportPath.insertBefore(
                    t.variableDeclaration(
                        'var',
                        [
                            t.variableDeclarator(
                                t.identifier(componentExportName),
                                isClass
                                 ? componentNode.id
                                 : componentNode,
                            )
                        ]
                    )
                );
            }
		}
	}
}
