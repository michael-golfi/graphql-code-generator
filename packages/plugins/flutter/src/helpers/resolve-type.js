const { SafeString } = require('handlebars');

const primitives = {
  String: 'String',
  Int: 'int',
  Float: 'double',
  Boolean: 'bool',
  ID: 'String',

  int: 'int',
  bool: 'bool',
  double: 'double',
  num: 'num',
  dynamic: 'dynamic',

  Object: 'Object',
  DateTime: 'DateTime'
};

function serializers(type) {
  return `@JsonKey(fromJson: fromJsonTo${type}, toJson: from${type}ToJson)
  `;
}

function wrap(isArray, fieldType) {
  return isArray ? `List<${fieldType}>` : fieldType;
}

export default function resolveType(
  type,
  contextName,
  contextModels = [],
  scalars = {},
  replace = {},
  isArray,
  irreducibles = [],
  rawTypeText
) {
  if (irreducibles.includes(rawTypeText.replace('!', ''))) {
    return rawTypeText.replace('!', '');
  }

  let fieldType = contextModels.filter(({ modelType }) => modelType === type).length
    ? contextName + type
    : primitives[type] || type || 'Object';

  if (replace[fieldType]) {
    fieldType = replace[fieldType];
  }
  if (scalars[fieldType]) {
    fieldType = scalars[fieldType];
    if (!(fieldType in primitives)) {
      return new SafeString(serializers(fieldType) + wrap(isArray, fieldType));
    } else {
      fieldType = primitives[fieldType];
    }
  }
  return new SafeString(wrap(isArray, fieldType));
}
