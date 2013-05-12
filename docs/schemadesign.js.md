{
  type: 'object' // Implicitly object if not set
  string_field_name: {
    type: 'string',
    required: true
  },
  array_field_name: {
    type: 'array',
    non_empty: true,
    schema: {
      // Exactly like the schema for the base object.
      // This schema is for each element in the array
    }
  },
  object_field_name: {
    type: 'object', // If this type is not defined, object is assumed
    schema: {
      // Exactly like the schema for the base object
      // This schema is for the object itself
    }
  }
}
