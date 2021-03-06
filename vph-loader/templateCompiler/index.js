const tagAnalyse = require('./tagAnalyse');
const { TAGS, SPLITED_TAGS } = require('./constants');

function basicIterator(container) {

  let code = '';
  const tagName = container.getTagName();
  const attr = container.getAttr();
  const ifDirective = container.getIf();
  const forDirective = container.getFor();
  const onDirective = container.getOn();
  const bindDirective = container.getBind();
  const slotDirective = container.getSlot();
  const props = container.getProps();
  const children = container.getChildren();
  // code += 'basicTagConstruct({';
  // code += `tag:'${tagName}',`;
  code += ComponentAnalyse(tagName);
  code += attr ? `attr:[${attr.map(item => `"${item}"`).join(',')}],` : '';
  code += props ? `props:[${props.join(',')}],` : '';
  code += ifDirective ? `ifDirective:${ifDirective},` : '';
  code += forDirective ? `forDirective:${forDirective},` : '';
  code += onDirective ? `onDirective:${onDirective},` : '';
  code += bindDirective ? `valueBind:${bindDirective},` : '';
  code += slotDirective ? `slotDirective:${slotDirective},` : '';
  if (children && children.length > 0) {
    const childrenCode = children.map(item => {
      if (typeof item === 'string') {
        return '"' + item + '"';
      } else {
        return basicIterator(item);
      }
    });
    code += `children:[${childrenCode.join(',')}],`;
  }
  code += '})';
  return code.replace(/\n/g, ' ').replace(/ +/g, ' ');
}

function basicReconstruct(tmp, components) {
  const analysed = tagAnalyse(tmp);
  let code;
  code = basicIterator(analysed, components);

  return code;
}

function ComponentAnalyse(tagName) {
  const isBasic = SPLITED_TAGS.find(item => item === tagName);
  if (isBasic) {//基本
    return `({tag:'${tagName}',`;
  } else {//组件
    return `components.${tagName}({`;
  }
}

module.exports = basicReconstruct;


function _basicIterator(container, components) {
  const tagName = container.getTagName();
  const attr = container.getAttr();
  const ifDirective = container.getIf();
  const forDirective = container.getFor();
  const onDirective = container.getOn();
  const bindDirective = container.getBind();
  const props = container.getProps();
  const children = container.getChildren();

  let childrenPt = [];
  if (children && children.length > 0) {
    childrenPt = children.map(item => {
      if (typeof item === 'string') {
        return '' + item + '';
      } else {
        return _basicIterator(item, components);
      }
    });
  }
  const code = _ComponentAnalyse({
    tag: tagName,
    attr: attr,
    props: props,
    ifDirective: ifDirective,
    forDirective: forDirective,
    onDirective: onDirective,
    valueBind: bindDirective,
    children: childrenPt,
  }, components);
  return code;
}


function _ComponentAnalyse(code, components) {
  const isBasic = SPLITED_TAGS.find(item => item === code.tag);
  if (isBasic) {//基本
    return code;
  } else {//组件
    const tag = code.tag.replace(/^[a-z]/, i => i.toUpperCase());
    const found = components[tag];
    if (!found) {
      throw (`Component ${tag} is NOT found! `);
    }
    const _code = { ...code };
    delete _code.tag;
    return found(_code);
  }
}