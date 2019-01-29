import { schemaToTemplateContext, GraphQLSchema, DocumentFile } from 'graphql-codegen-core';
import { helpers } from 'graphql-codegen-plugin-handlebars-helpers';
import * as Handlebars from 'handlebars';
import gql from 'graphql-tag';

// Import partials
import {
  defineClass,
  fragment,
  enum as enumTemplate,
  operation,
  type,
  schema as schemaHb,
  documents as documentsHb,
  index
} from './templates';

// Import helpers
import {
  log,
  logThis,
  concat,
  eachBackwards,
  takeFirst,
  stripSuffix,
  multilineComment,
  classExtends,
  resolveType,
  resolveMixins,
  hackFragmentFields,
  ignoreType,
  withInputType,
  registerInputType,
  fragmentFieldOnBaseType
} from './helpers';

export const DEFAULT_SCALARS = {
  String: 'string',
  Int: 'number',
  Float: 'number',
  Boolean: 'boolean',
  ID: 'string'
};

export const plugin = async (schema: GraphQLSchema, documents: DocumentFile[], config: any): Promise<string> => {
  const scalars = { ...DEFAULT_SCALARS, ...(config.scalars || {}) };
  const templateContext = schemaToTemplateContext(schema);

  Handlebars.registerPartial('defineClass', defineClass);
  Handlebars.registerPartial('fragment', fragment);
  Handlebars.registerPartial('enum', enumTemplate);
  Handlebars.registerPartial('operation', operation);
  Handlebars.registerPartial('type', type);
  Handlebars.registerPartial('schema', schemaHb);
  Handlebars.registerPartial('documents', documentsHb);
  Handlebars.registerPartial('index', index);

  Handlebars.registerHelper('log', log);
  Handlebars.registerHelper('logThis', logThis);
  Handlebars.registerHelper('concat', concat);
  Handlebars.registerHelper('eachBackwards', eachBackwards);
  Handlebars.registerHelper('takeFirst', takeFirst);
  Handlebars.registerHelper('stripSuffix', stripSuffix);
  Handlebars.registerHelper('multilineComment', multilineComment);
  Handlebars.registerHelper('classExtends', classExtends);
  Handlebars.registerHelper('resolveType', resolveType);
  Handlebars.registerHelper('resolveMixins', resolveMixins);
  Handlebars.registerHelper('hackFragmentFields', hackFragmentFields);
  Handlebars.registerHelper('ignoreType', ignoreType);
  Handlebars.registerHelper('withInputType', withInputType);
  Handlebars.registerHelper('registerInputType', registerInputType);
  Handlebars.registerHelper('fragmentFieldOnBaseType', fragmentFieldOnBaseType);

  Handlebars.registerHelper('blockComment', helpers.blockComment);
  Handlebars.registerHelper('blockCommentIf', helpers.blockCommentIf);
  Handlebars.registerHelper('toComment', helpers.toComment);
  Handlebars.registerHelper('toLowerCase', helpers.toLowerCase);
  Handlebars.registerHelper('toPascalCase', function(value) {
    return value
      .match(/[a-z]+/gi)
      .map(function(word) {
        return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
      })
      .join('');
  });
  Handlebars.registerHelper('toUpperCase', helpers.toUpperCase);
  Handlebars.registerHelper('times', helpers.times);
  Handlebars.registerHelper('stringify', helpers.stringify);
  Handlebars.registerHelper('ifDirective', helpers.ifDirective);
  Handlebars.registerHelper('ifCond', helpers.ifCond);
  Handlebars.registerHelper('unlessDirective', helpers.unlessDirective);
  Handlebars.registerHelper('toPrimitive', type => scalars[type] || type || '');

  return Handlebars.compile(index)({
    ...templateContext,
    config,
    primitives: scalars
  });
};

const addToSchema = gql`
  scalar AWSDateTime
  scalar AWSTime
  scalar AWSDate
  scalar AWSTimestamp
  scalar AWSEmail
  scalar AWSJSON
  scalar AWSURL
  scalar AWSPhone
  scalar AWSIPAddress

  directive @aws_subscribe(mutations: [String]) on FIELD_DEFINITION
`;

export { addToSchema };
// export { addToSchema as DIRECTIVES };

// export const validate: PluginValidateFn<any> = async (
//   schema: GraphQLSchema,
//   documents: DocumentFile[],
//   config: any,
//   outputFile: string
// ) => {
//   // if (!outputFile.endsWith('.d.ts')) {
//   //   throw new Error(`Plugin "typescript-graphql-files-modules" requires extension to be ".d.ts"!`);
//   // }
// };
