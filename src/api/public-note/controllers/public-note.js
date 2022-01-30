'use strict';

/**
 *  public-note controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::public-note.public-note', ({ strapi }) => ({

  async find(ctx) {
    const { data, meta } = await super.find(ctx);
    const cookedData = []
    data.forEach(note => {
      cookedData.push({
        'id': note.id,
        'title': note.attributes.title
      })
    });
    return { data: cookedData, meta };
  },
  async findOne(ctx) {
    const { data, meta } = await super.findOne(ctx);
    const cookedData = {
      id: data.id,
      title: data.attributes.title,
      content: data.attributes.content
    }
    return { data: cookedData, meta };
  },

}));
