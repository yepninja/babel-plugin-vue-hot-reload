const fs = require('fs')
const path = require('path')
const babel = require('@babel/core')

const checkSnap = (file) => {
  const {code} = babel.transformFileSync(path.resolve(__dirname, file))
  expect(code).toMatchSnapshot()
}

test('class component with decorator', () => {
  checkSnap('../mocks/class-with-decorator+jsx+render.tsx')
});

test('object component', () => {
  checkSnap('../mocks/object-with-jsx+render.tsx')
});

test('object component', () => {
  checkSnap('../mocks/class-tsx-without-render.tsx')
});