const { createMacro, MacroError } = require("babel-plugin-macros");
const px2vw = (px) => `${(px / 2560) * 100}vw`;
const getValue = (path) => {
  if (path.type === "CallExpression") {
    return path.node.arguments[0].value;
  }
  if (path.type === "TaggedTemplateExpression") {
    return path.node.quasi.quasis[0].value.cooked;
  }
  return null;
};

module.exports = createMacro(({ babel: { types: t }, references: { default: paths } }) => {
  paths.forEach(({ parentPath }) => {
    const value = getValue(parentPath);
    if (value) {
      const newValue = px2vw(value);
      if (newValue) {
        parentPath.replaceWith(t.stringLiteral(newValue));
      } else {
        const { line } = parentPath.node.loc.start;
        throw new MacroError(`Invalid input given to ms.macro at line ${line}`);
      }
    }
  });
});
