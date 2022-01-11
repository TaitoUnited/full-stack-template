#!/usr/bin/env bash

# Programming language
export language=ts

# SQL file paths
export sql_plan=../database/sqitch.plan
export sql_deploy_dir=../database/deploy
export sql_generated_dataset=../database/data/datasets/generated.sql

# Source file paths
export src_core_types=src/core/types/core.ts

# Entity template source file paths
export entity_template=templates/entity
export entity_template_service=src/core/services/EntityNameService.ts
export entity_template_type=src/core/types/entityName.ts
export entity_template_test=test/core/entityName.test.ts


# -- Implementation --

prepare_dir=templates/_prepare

# Delete temporary files
cleanup() {
  rm -rf ${prepare_dir}
}
trap cleanup EXIT

# Convert snake_case to UPPER_CASE
as_upper_case() {
  echo ${1^^}
}

# Convert snake_case to PascalCase
as_pascal_case() {
  echo $1 | sed -r 's/(^|_)([a-z])/\U\2/g'
}

# Convert snake_case to camelCase
as_camel_case() {
  as_pascal_case $1 | sed -e 's/./\L&/'
}

# Convert camelCase to snake_case
as_snake_case() {
  echo "$1" | perl -pe 's/([a-z0-9])([A-Z])/$1_\L$2/g'
}

# Find item from the given array and return index or -1
find_from_array() {
  local value=$1
  shift
  local items=("$@")

  local index=0
  for item in ${items[@]}; do
    if [[ ${item} == ${value} ]]; then
      echo $index
      return
    fi
    ((index++))
  done

  echo -1
}

# Find value from array after the given value
find_next_to() {
  local value=$1
  shift
  local items=("$@")

  local index=$(find_from_array "$value" "${items[@]}")
  if [[ $index == '-1' ]]; then return; fi

  local next_index=$((index+1))
  echo "${items[$next_index]}"
}

# Returns 0 if the given typescript type is Enum
is_enum_type() {
  local field_type=$1
  local field_type_lowercase="${field_type,,}"
  if [[ $field_type != "$field_type_lowercase" ]] && [[ $field_type != "Date" ]]; then
    return 0
  fi
  return 1
}

# Convert sql column name to target programming language field name
as_field_name() {
  local name=$1
  local language=${2:-ts}

  if [[ $language == "ts" ]]; then
    as_camel_case $name
  else
    echo "unknownLanguage"
  fi
}

# Convert sql type to target programming language type
as_field_type() {
  local type=$1
  local language=${2:-ts}

  if [[ $language == "ts" ]]; then
    type=${type/uuid/string}
    type=${type/text/string}
    type=${type/smallint/number}
    type=${type/integer/number}
    type=${type/decimal/number}
    type=${type/date/Date}
    type=${type/timestamp/Date}
    type=${type/boolean/boolean}

    if [[ $type == $1 ]] && [[ $type != 'boolean' ]]; then
      # Probably Enum
      type=$(as_pascal_case $1)
    fi
  else
    type="unknownLanguage"
  fi

  echo $type
}

# Convert sql type to target programming language simple type
as_simple_type() {
  local field_type=$(as_field_type "$1" "$2")
  echo "${field_type/\[\]/}"
}

# Convert sql type to GraphQL type
as_graphql_type() {
  local type=$1

  type=${type/uuid/ID}
  type=${type/text/String}
  type=${type/smallint/Int}
  type=${type/integer/Int}
  type=${type/decimal/Float}
  type=${type/date/Date}
  type=${type/timestamp/Date}
  type=${type/boolean/Boolean}

  if [[ $type == $1 ]] && [[ $type != 'boolean' ]]; then
    # Probably Enum
    type=$(as_pascal_case $1)
  fi

  # Remove array [] markings
  if [[ ${type} == *"[]" ]]; then
    type="[${type/\[\]/}]"
  fi

  echo $type
}

# Convert sql column to entity name: target_subscription_id uuid -> targetSubscription
as_reference_name() {
  local name=$1
  local language=${2:-ts}

  local short="${name%_id}"

  if [[ $language == "ts" ]]; then
    as_camel_case $short
  else
    echo "unknownLanguage"
  fi
}

# Convert sql column reference to programming language class/type
as_reference_type() {
  local table=$1
  local language=${2:-ts}

  if [[ $language == "ts" ]]; then
    as_pascal_case $table
  else
    echo "unknownLanguage"
  fi
}

# Convert sql column reference to programming language class/type import
as_reference_import() {
  local table=$1
  local language=${2:-ts}

  if [[ $language == "ts" ]]; then
    as_camel_case $table
  else
    echo "unknownLanguage"
  fi
}

# Add entity field to source code based on the given sql column definition
add_entity_field() {

  # Determine programming language specific field names and types
  local field_name=$(as_field_name "$sql_name" "$language")
  local field_type=$(as_field_type "$sql_type" "$language")
  local simple_type=$(as_simple_type "$sql_type" "$language")
  local graphql_type=$(as_graphql_type "$sql_type")
  local reference_name=$(as_reference_name "$sql_name" "$language")
  local reference_type=$(as_reference_type "$sql_table_reference" "$language")
  local reference_import=$(as_reference_import "$sql_table_reference" "$language")

  # Check language
  # TODO: implement for other languages
  if [[ $language != 'ts' ]]; then
    echo "Only TypeScript is currently supported"
    exit 1
  fi

  # Compose field definitions
  if [[ $nullable == true ]]; then
    if [[ $graphql_type != 'ID' ]] || [[ $sql_name == "id" ]]; then
      field_read="@Field(() => ${graphql_type}, { nullable: true }) ${field_name}: ${field_type} | null;"
    else
      field_read="${field_name}: ${field_type} | null;"
    fi
    field_create="@Field(() => ${graphql_type}, { nullable: true }) ${field_name}?: ${field_type} | null;"
    field_update=$field_create
  else
    if [[ $graphql_type != 'ID' ]] || [[ $sql_name == "id" ]]; then
      field_read="@Field(() => ${graphql_type}) ${field_name}: ${field_type};"
    else
      field_read="${field_name}: ${field_type};"
    fi
    field_create="@Field(() => ${graphql_type}) ${field_name}: ${field_type};"
    field_update="@Field(() => ${graphql_type}, { nullable: true }) ${field_name}?: ${field_type};"
  fi

  if [[ ${reference_type} ]]; then
    field_read="${field_read}\n\ \ ${reference_name}?: ${reference_type}; // For prefetch optimization\n"
  fi

  # Compose field examples
  if [[ ${field_type} == 'number' ]]; then
    test_field_example1="${field_name}: 1,"
    test_field_example2="${field_name}: 2,"
    field_example=$test_field_example1
  elif [[ ${field_type} == 'Date' ]]; then
    test_field_example1="${field_name}: '2022-01-11T00:00:00.000Z',"
    test_field_example2="${field_name}: '2022-01-12T00:00:00.000Z',"
    field_example="${field_name}: new Date(),"
  elif [[ ${field_type} == 'boolean' ]]; then
    test_field_example1="${field_name}: false,"
    test_field_example2="${field_name}: true,"
    field_example=$test_field_example1
  elif is_enum_type $field_type; then
    test_field_example1="${field_name}: ${simple_type}.TODO_VALUE,"
    test_field_example2="${field_name}: ${simple_type}.TODO_VALUE2,"
    field_example=$test_field_example1
  else
    test_field_example1="${field_name}: '${field_name}',"    
    test_field_example2="${field_name}: '${field_name}2',"
    field_example=$test_field_example1

    if [[ $graphql_type == 'ID' ]]; then
      test_field_example1="${field_name}: 'TODO: Add existing ${field_name} here',"
    fi
  fi

  if [[ ${field_type} == *"[]" ]]; then
    field_example="${field_example/: /: [}"
    field_example="${field_example/,/],}"
    test_field_example1="${test_field_example1/: /: [}"
    test_field_example1="${test_field_example1/,/],}"
    test_field_example2="${test_field_example2/: /: [}"
    test_field_example2="${test_field_example2/,/],}"
  fi

  # Add Enum import
  if is_enum_type $field_type; then
    sed -i "/.*TEMPLATE_GENERATE: Imports.*/i import { $simple_type } from './core';" "${prepare_dir}/${entity_template_type}"
    sed -i "/.*TEMPLATE_GENERATE: Imports.*/i import { $simple_type } from '../common/sdk';" "${prepare_dir}/${entity_template_test}"
  fi

  # Add Entity import
  if [[ ${reference_type} ]]; then
    sed -i "/.*TEMPLATE_GENERATE: Imports.*/i import { $reference_type } from './${reference_import}';" "${prepare_dir}/${entity_template_type}"
  fi

  # Add fields to source code
  sed -i "/.*TEMPLATE_GENERATE: Read entity fields.*/i\ \ $field_read" "${prepare_dir}/${entity_template_type}"
  sed -i "/.*TEMPLATE_GENERATE: Read entity field examples.*/i\ \ $field_example" "${prepare_dir}/${entity_template_type}"

  if [[ $sql_name != "id" ]] && [[ $sql_name != "created_at" ]] && [[ $sql_name != "updated_at" ]]; then
    sed -i "/.*TEMPLATE_GENERATE: Create entity fields.*/i\ \ $field_create" "${prepare_dir}/${entity_template_type}"
    sed -i "/.*TEMPLATE_GENERATE: Create entity field examples.*/i\ \ $field_example" "${prepare_dir}/${entity_template_type}"

    sed -i "/.*TEMPLATE_GENERATE: Update entity fields.*/i\ \ $field_update" "${prepare_dir}/${entity_template_type}"
    sed -i "/.*TEMPLATE_GENERATE: Update entity field examples.*/i\ \ $field_example" "${prepare_dir}/${entity_template_type}"

    if [[ $graphql_type == 'ID' ]]; then
      sed -i "/.*TEMPLATE_GENERATE: Entity reference id values.*/i\ \ $test_field_example1" "${prepare_dir}/${entity_template_test}"
    else
      sed -i "/.*TEMPLATE_GENERATE: Entity field values.*/i\ \ $test_field_example1" "${prepare_dir}/${entity_template_test}"
      sed -i "/.*TEMPLATE_GENERATE: Entity field updated values.*/i\ \ \ \ \ \ $test_field_example2" "${prepare_dir}/${entity_template_test}"
    fi
  fi
}

parse_sql_column_definitions() {
  local table_name=$1
  local sql_column_definitions=$2

  # Add delete clause to the generated dataset
  sed -i "1s/^/DELETE FROM $table_name;\n/" $sql_generated_dataset

  # Open insert clause
  printf "\nINSERT INTO $table_name (" >> $sql_generated_dataset

  # Add insert column names
  while IFS= read -r sql_column_definition; do
    local sql_column=(${sql_column_definition})
    local sql_name=${sql_column[0]}
    printf "$sql_name, " >> $sql_generated_dataset
  done <<< "$sql_column_definitions"

  # Close the insert column names section and open the values section
  sed -i '$ s/, $//' $sql_generated_dataset
  printf ")\nvalues (" >> $sql_generated_dataset

  # Loop through sql column defitions again to add fields in source code
  # and values on generated dataset.
  while IFS= read -r sql_column_definition; do
    local sql_column=(${sql_column_definition})

    # Parse the given sql column definition, for example:
    #   target_subscription_id uuid NOT NULL REFERENCES subscription (id),
    local sql_name=${sql_column[0]}       # target_subscription_id
    local sql_type=${sql_column[1]}       # uuid
    local nullable=true                   # NOT NULL -> false
    if [[ ${sql_column_definition} == *" NOT NULL"* ]] ||
       [[ ${sql_column_definition} == *" PRIMARY KEY"* ]]; then
      nullable=false
    fi
    local sql_table_reference=$(          # subscription
      find_next_to "REFERENCES" "${sql_column[@]}"
    )

    # Add entity field
    add_entity_field

    # Add values on the insert clause
    local value="'$sql_name'"
    if [[ $sql_type == "uuid" ]]; then    
      value="'00a67f95-5ea9-41b8-a4f8-110f53c54727'"
    elif [[ $sql_type == "boolean" ]]; then
      value="false"
    elif [[ $sql_type == "date" ]] || [[ $sql_type == "timestamp" ]]; then
      value="now()"
    elif [[ $sql_type == "smallint" ]] || [[ $sql_type == "integer" ]]; then
      value="1"
    elif [[ $sql_type == "decimal" ]]; then
      value="1.1"
    fi
    printf "$value, " >> $sql_generated_dataset

  done <<< "$sql_column_definitions"

  # Close the insert clause
  sed -i '$ s/, $//' $sql_generated_dataset
  printf ");\n" >> $sql_generated_dataset
}

# Create source files for entity based on the given sql file
create_entity() {
  local table_name=$1
  local snake_case="$table"
  local upper_case=$(as_upper_case $snake_case)
  local pascal_case=$(as_pascal_case $snake_case)
  local camel_case=$(as_camel_case $snake_case)
  local sql_file="$sql_deploy_dir/$table_name.sql"

  # Copy entity template to prepare dir
  mkdir -p ${prepare_dir}
  cp -r ${entity_template}/* ${prepare_dir}

  # Read sql column definitions
  sql_column_definitions=$(
    grep "^[, ] [a-z]" "$sql_file" | \
      tr ',' ' ' | \
      grep -v "^[ \t]\+CONSTRAINT"
  )

  # Generate sql data and entity fields based on sql column definitions
  parse_sql_column_definitions "$table_name" "$sql_column_definitions"

  # Replace entity name in files
  find ${prepare_dir} -type f \
    -exec sed -i "s/entity_name/$snake_case/g" {} \; \
    -exec sed -i "s/ENTITY_NAME/$upper_case/g" {} \; \
    -exec sed -i "s/EntityName/$pascal_case/g" {} \; \
    -exec sed -i "s/entityName/$camel_case/g" {} \; \
    -exec sed -i '/TEMPLATE_GENERATE: /d' {} \; \
    -exec sh -c \
      'mv $1 $(echo $1 | sed s/EntityName/$2/ | sed s/entityName/$3/)' \
      -- {} $pascal_case $camel_case \;

  # Copy prepared files to main dir
  cp -r ${prepare_dir}/* .
  cleanup

  # Add entity to core types
  sed -i "/.*TEMPLATE_GENERATE: Entity types.*/i\ \ $upper_case = '$upper_case'," $src_core_types
}

# Create source files for entities based on sql files located in
# $sql_deploy_dir
create_entities() {
  local name=$1
  local tables=$(
    grep "^[a-z].*" $sql_plan | cut -d " " -f1 | grep -v "_enum\|_trigger\|_function"
  )
  for table in ${tables}; do
    if [[ $name == 'all' ]] || [[ $table == $name ]]; then
      echo "TABLE $table"
      create_entity $table
    fi
  done
}

# Create source files for entity based on the given sql file
create_enum() {
  local enum_name=$1
  local pascal_case=$(as_pascal_case $enum_name)
  local sql_file="$sql_deploy_dir/${enum_name}_enum.sql"

  echo >> $src_core_types
  echo "export enum ${pascal_case} {" >> $src_core_types

  values=$(grep "^  '" $sql_file | sed "s/[,']//g")
  for value in ${values}; do
    echo "  ${value} = '${value}'," >> $src_core_types
  done

  cat >> $src_core_types <<- EOM
}

registerEnumType(${pascal_case}, {
  name: '${pascal_case}',
});
EOM
}

# Add enums to source code based on sql files located in $sql_deploy_dir
create_enums() {
  local name=$1
  local enums=$(
    grep "^[a-z].*" $sql_plan | cut -d " " -f1 | grep "_enum" | sed 's/_enum$//'
  )
  for enum in ${enums}; do
    if [[ $name == 'all' ]] || [[ $enum == $name ]]; then
      echo "ENUM $enum"
      create_enum $enum
    fi
  done
}

filter=$(as_snake_case "${1:-all}")
echo "Generating code from database definitions for $filter"
echo
create_entities "$filter"
create_enums "$filter"
echo
echo "DONE"
