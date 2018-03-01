import Joi from 'joi'
import Bookshelf from '../db'

const name = Joi.string()
const description = Joi.string()
const sku = Joi.string()

export const schema = Joi.object().keys({
  name: name.required(),
  description: description.required(),
  sku: sku.required()
})

export default Bookshelf.Model.extend({
  tableName: 'product',
  schema: {
    create: schema.keys({ created_at: Joi.date().required() }),
    update: schema.keys({
      name,
      description,
      sku,
      updated_at: Joi.date().required()
    })
  },
  /** 
   * Convert object to JSON.
   * 
   * @example toJSON()
  */
  toJSON() {
    var attrs = Bookshelf.Model.prototype.toJSON.apply(this, arguments)
    attrs.created_at = new Date(attrs.created_at)
    
    if (attrs.updated_at != null) 
      attrs.updated_at = new Date(attrs.updated_at)
      
    return attrs
  }
})