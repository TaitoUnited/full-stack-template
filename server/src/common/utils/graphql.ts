import { FieldNode, SelectionNode } from 'graphql';
import {
  createMethodDecorator,
  createParamDecorator,
  getMetadataStorage,
} from 'type-graphql';
import { FieldMetadata } from 'type-graphql/dist/metadata/definitions';

type IdGetter<T> = (obj: T) => string | null | undefined;

/**
 * Decorator for optimizing GraphQL queries where the only
 * field being fetched on a relational object is 'id'.
 *
 * @param idGetter method that returns the relational id from the root-object, or just a property key
 * for the relational id. For example, if we have Space-object and we are decorating it's blueprint-field,
 * that should correspond to a blueprint with id space.blueprintId, we could pass in
 * `(space) => space.blueprintId` or just `'blueprintId'`
 *
 * Should only be used on FieldResolvers
 */
// TODO: could make more verbose and allow optimizing other fields as well
export function Relation<T = any>(idGetter: IdGetter<T> | keyof T) {
  return createMethodDecorator(async ({ root, info }, next) => {
    /*
      info.fieldNodes contains all the fields of the resource we're fetching this field from.

      for example if we're fetching:
      ```
      {
        space {
          blueprint {
            id
          }
        }
      }
      ```
      and blueprint is decorated with @Relation, info.fieldNodes contains all the fields of Space-object

      ... so we're getting the fieldNode that matches the decorated field (info.fieldName contains the decorated field's name,
      so in the previous example it would contain "blueprint")
    */
    const fieldNode = info.fieldNodes.find(
      (node) => node.name.value === info.fieldName
    );

    // I don't know when this situation might occur but I guess it might? if it does just
    // execute the decorated method like nothing happened
    if (!fieldNode) {
      return next();
    }

    /*
      this will contain all the fields we're selecting on the field decorated by this decorator

      so in the previous example it would contain ['id']. And if we were to fetch instead
      {
        space {
          blueprint {
            __typename
            id
            name
          }
        }
      }
      .. it would contain ['__typename', 'id', 'name']
    */
    const selections = fieldNode.selectionSet?.selections ?? [];

    /*
      and then we check if we're only selecting 'id' or '__typename'
    */
    const idOnlySelected =
      selections.length > 0 &&
      selections.every((sel) => {
        return (
          sel.kind === 'Field' && ['id', '__typename'].includes(sel.name.value)
        );
      });

    if (idOnlySelected) {
      /*
        ... and if we are, we can return the result based on the idGetter-parameter
        and we don't have to execute the fieldResolver method that would probably
        go to the database and fetch the entire object
      */
      const id =
        typeof idGetter === 'function' ? idGetter(root) : root[idGetter];

      if (!id) {
        return null;
      }

      /*
        Handle the case when the value of the property returned
        by idGetter-parameter is an array of strings
      */
      return Array.isArray(id)
        ? id.map((id) => ({
            id,
          }))
        : {
            id,
          };
    }

    return next();
  });
}

/**
 * Conditionally construct supplied parameter. If the parameter
 * is a function, returns the result of calling it.
 * If it is a constructable (i.e. a class), return an instance of the class.
 * Otherwise, the supplied parameter itself
 *
 * @example
 * // evaluates to ''
 * construct(String)
 *
 * // evaluates to an instance [Clazz]
 * construct(Clazz)
 *
 * // evaluates to 5
 * construct(5)
 */
function construct<T>(F: new (...args: any[]) => T): T;
function construct<T>(F: T): T;
function construct(F: any) {
  try {
    return F();
  } catch {}
  try {
    return new F();
  } catch {}
  return F;
}

type ClassType<T = any, TParams = any[]> = new (...args: TParams[]) => T;

function getClassFields<T extends ClassType>(
  classType: T
): FieldMetadata[] | undefined {
  const prototype = Object.getPrototypeOf(classType);
  /*
    If the prototype of the supplied class has a prototype
    -> the prototype of this class is another class
    -> this class extends another class

    and we'll use the superclass for fetching the superclass' fields
    also. Because the `metadata.objectTypes`-entry for the child class
    won't contain all the fields

    If we have

    @ObjectType()
    class A {
      @Field()
      field: string;
    }

    @ObjectType()
    class B extends A {}

    -> metadata.objectTypes.find(type => type.target === B)?.fields is empty :(
  */
  const superClass =
    'prototype' in Object.getPrototypeOf(classType) ? prototype : undefined;

  const metadata = getMetadataStorage();
  metadata.build({});

  /*
    Fetch metadata for the supplied class from the TypeGraphQL metadatastorage
  */
  const objectType =
    metadata.objectTypes.find((type) => type.target === classType) ||
    metadata.inputTypes.find((type) => type.target === classType);

  if (!objectType) {
    return undefined;
  }

  const superTypeFields = superClass ? getClassFields(superClass) ?? [] : [];

  return [...superTypeFields, ...(objectType?.fields ?? [])];
}

/**
 * Create a template from a TypeGraphQL type.
 *
 * The template will contain all the fields from the specified class
 * marked with the @Field-decorator with an example input. Having another
 * class as field type is supported.
 *
 * @example
 *
 * ＠InputType()
 * export class ThresholdFilter {
 *   ＠Field() id?: string;
 *   ＠Field() createdAt?: Date;
 * }
 *
 * // results in { id: '', createdAt: new Date() }
 * const thresholdFilterExample = createTemplate(ThresholdFilter);
 * ```
 */
export function createTemplate<T extends ClassType>(
  objectTypeClass: T,
  strict?: true
): Record<string, any>;
export function createTemplate<T extends ClassType>(
  objectTypeClass: T,
  strict: false,
  ignoreArray?: ClassType[]
): Record<string, any> | undefined;
export function createTemplate(
  objectTypeClass: ClassType,
  strict = true,
  ignoreArray: ClassType[] = []
) {
  const fields = getClassFields(objectTypeClass);

  if (!fields) {
    if (strict) {
      throw new Error(
        `No GraphQL type found for class '${objectTypeClass.name}'`
      );
    }

    return undefined;
  }

  /*
    Create an object containing the @Fields from the supplied class
  */
  const template = fields.reduce(
    (obj, field) => {
      /*
      This is essentially the return value of the
      type-function supplied to a field. So for

      @Field(() => String) foo: string;
      -> type = String
    */
      const type = field.getType();

      const isArray = field.typeOptions.array;

      /*
      Ignore fields with type specified in `ignoreArray`
    */
      if (ignoreArray.includes(type as any)) {
        return obj;
      }

      /*
      Recursively traverse the type if it contains other types,
      but pass the type in ignoreArray to prevent stackoverflows
    */
      const template = createTemplate(type as any, false, [
        ...ignoreArray,
        objectTypeClass,
      ]);

      /*
      If the template does not exist, construct the type

      ... so most likely type is then just a primitive class (i.e. String or Number),
      or Date or something
    */
      const instance = template ?? construct(type);

      return {
        ...obj,
        [field.name]: isArray ? [instance] : instance,
      };
    },
    {} as Record<string, any>
  );

  return template;
}

/**
 * Parameter decorator for getting the fields selected in a GraphQL query
 *
 * @example
 * class PostResolver {
 *   ＠Query(() => [Post])
 *   searchPosts(＠SelectedFields() fields: Fields) {
 *     // fetch total post count from DB only if it is requested
 *     const total = 'total' in fields ? postDao.getTotal() : undefined;
 *
 *     const data = ...;
 *
 *     return {
 *       total,
 *       data,
 *     }
 *   }
 * }
 */
export function SelectedFields() {
  return createParamDecorator(({ info }) => {
    /*
      Find the node matching the decorated query
    */
    const fieldNode = info.fieldNodes.find(
      (node) => node.name.value === info.fieldName
    );

    if (!fieldNode) {
      return {};
    }

    const getSelectionSet = (
      node: FieldNode | SelectionNode
    ): Record<string, any> | true => {
      const selectionSet =
        'selectionSet' in node ? node.selectionSet : undefined;

      if (!selectionSet) {
        return true;
      }

      return selectionSet?.selections.reduce(
        (obj, cur) => {
          const name = 'name' in cur ? cur.name.value : undefined;

          if (!name) {
            return obj;
          }

          return {
            ...obj,
            [name]: getSelectionSet(cur),
          };
        },
        {} as Record<string, any>
      );
    };

    return getSelectionSet(fieldNode);
  });
}

export type Fields = Record<string, undefined | Record<string, any> | true>;
