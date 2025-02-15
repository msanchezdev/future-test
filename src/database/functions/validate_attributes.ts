/**
 * I am currently building an ORM for the SurrealDB database.
 * This implementation is just something I made for this assessment project.
 *
 * SurrealDB is an amazing project that I would encourage you to check out.
 * It is a NoSQL database that is super fast and has a lot of features.
 * I am using it for my personal projects and I think it is a great fit for
 * this project.
 */
import type Surreal from "surrealdb";

export async function define(db: Surreal) {
  await db.query(/* surql */ `
    DEFINE FUNCTION OVERWRITE fn::validate_attributes($value: object, $entity_type_id: record<entity_type>) {
      LET $attributes = (SELECT attributes FROM entity_type WHERE id = $entity_type_id).attributes[0];
      FOR $attribute IN object::entries($attributes) {
          LET $attr_name = $attribute[0];
          LET $attr_type = $attribute[1].type;
          
          IF $value[$attr_name] IS NONE {
              THROW string::concat('Attribute "', $attr_name, '" is missing');
          };
          
          IF $attr_type = 'string' && $value[$attr_name] IS NOT string {
              THROW string::concat('Attribute "', $attr_name, '" is not a string');
          } ELSE IF $attr_type = 'number' && $value[$attr_name] IS NOT number {
              THROW string::concat('Attribute "', $attr_name, '" is not a number');
          } ELSE IF $attr_type = 'boolean' && $value[$attr_name] IS NOT bool {
              THROW string::concat('Attribute "', $attr_name, '" is not a bool');
          } ELSE IF $attr_type = 'date' && $value[$attr_name] IS NOT date {
              THROW string::concat('Attribute "', $attr_name, '" is not a date');
          } ELSE IF $attr_type = 'datetime' && $value[$attr_name] IS NOT datetime {
              THROW string::concat('Attribute "', $attr_name, '" is not a datetime');
          } ELSE IF $attr_type = 'enum' && $value[$attr_name] IS NOT string && false /* TODO */ {
              THROW string::concat('Attribute "', $attr_name, '" is not a string');
          } ELSE {
              THROW string::concat('Attribute "', $attr_name, '" is of unknown type');
          }
      };
      
      RETURN true; // All attributes match
    }
    COMMENT "Validates the state of an entity so it matches the entity's attributes configuration while resolving base entiy types";
  `);
}
