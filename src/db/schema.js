import Joi from 'joi'

const config = { abortEarly: false }

/**
 * Schema validations for data operations.
 * 
 * @param {bookshelf} bookshelf - Bookshelf object configured.
 * 
 * @example Bookshelf.plugin(schema)
 */
export default function(bookshelf) {
  var Model = bookshelf.Model

  bookshelf.Model = Model.extend({
    /**
     * Method for model validations setup.
     * 
     * @example Bookshelf.Model.extend({ data...})
     */
    constructor: function() {
      Model.prototype.constructor.apply(this, arguments)

      this.on('creating', this.validateCreate, this)
      this.on('updating', this.validateUpdate, this)
    },

    /**
     * Validate the schema.
     * 
     * @param {Schema} schema - Entity schema.
     * @param {Model} model - Entity model.
     * 
     * @example validate(schema, model)
     */
    validate(schema, model) {
      let input = model && Object.keys(model).length > 0 
        ? model 
        : this.changed

      var result = Joi.validate(input, schema, config)
      if (result.error) throw result.error

      this.set(result.value)
    },  

    /**
     * Validate the schema before create.
     * 
     * @example validateCreate()
     */
    validateCreate: function() {
      var schema = this.schema.create.options({
        noDefaults: true
      })
      this.validate(schema)
    },

    /**
     * Validate the schema before update.
     * 
     * @param {Model} model - = Entity model.
     * @param {Array<Object>} attrs - Attributes.
     * 
     * @example validateUpdate(model, attrs).
     */
    validateUpdate(model, attrs) {
      var schema = this.schema.update
      this.validate(schema, attrs)
    }
  })
}