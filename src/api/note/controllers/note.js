'use strict';

/**
 *  note controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::note.note', ({ strapi }) => ({

  async create(ctx) {

    ctx.request.body.data.author = ctx.state.user;
    return await super.create(ctx);

  },

  async find(ctx) {
    const populateList = [
      'author',
    ]
    populateList.push(ctx.query.populate)
    ctx.query.populate = populateList.join(',')
    const { data, meta } = await super.find(ctx)
    const cookedData = []
    data.forEach(note => {
      if (note.attributes.author.data.id != ctx.state.user.id) {
        return
      }
      cookedData.push({
        id: note.id,
        title: note.attributes.title,
        author: note.attributes.author.data.id
      })
    });
    
    return { data: cookedData, meta }

  },

  async findOne(ctx) {
    const populateList = [
      'author',
    ]
    populateList.push(ctx.query.populate)
    ctx.query.populate = populateList.join(',')
    const { data, meta } = await super.findOne(ctx);
    if (data.attributes.author.data.id != ctx.state.user.id) {
      ctx.status = 401
      return
    }
    const cookedData = {
      id: data.id,
      title: data.attributes.title,
      author: data.attributes.author.data.id,
      content: data.attributes.content
    }
    return { data: cookedData, meta };
    
  },

}));
