'use strict';

/**
 *  note controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::note.note', ({ strapi }) => ({

  async create(ctx) {

    // assign author when create note
    ctx.request.body.data.author = ctx.state.user;

    // get and return note and author information when create finished
    ctx.query.populate = 'author,noteSet'
    const { data, meta } = await super.create(ctx)
    const cookedData = {
      id: data.id,
      title: data.attributes.title,
      author: data.attributes.author.data.id,
      noteSet: note.attributes.noteSet.data ? note.attributes.noteSet.data.id : -1,
      hasPublic: data.attributes.hasPublic,
      content: data.attributes.content
    }
    return { data: cookedData, meta };

  },

  async find(ctx) {

    // if user not login, return 401
    // can do more things here in the future
    if (!ctx.state.user) {
      ctx.state = 401
      return
    }

    // get author information
    ctx.query.populate = 'author,noteSet'
    const { data, meta } = await super.find(ctx)

    const cookedData = []
    data.forEach(note => {

      // if note not belong to the current user, drop
      if (note.attributes.author.data.id != ctx.state.user.id) {
        return
      }

      // else, push to note list and return
      cookedData.push({
        id: note.id,
        title: note.attributes.title,
        author: note.attributes.author.data.id,
        noteSet: note.attributes.noteSet.data ? note.attributes.noteSet.data.id : -1,
        hasPublic: note.attributes.hasPublic
      })
    });
    return { data: cookedData, meta }
  },

  async findOne(ctx) {

    // get author information
    ctx.query.populate = 'author,noteSet'
    const { data, meta } = await super.findOne(ctx);

    // if user is not login or is not the author
    if (!ctx.state.user || data.attributes.author.data.id != ctx.state.user.id) {

      // if the note is public, return
      if (data.attributes.hasPublic) {

        const cookedData = {
          id: data.id,
          title: data.attributes.title,
          author: data.attributes.author.data.id,
          noteSet: data.attributes.noteSet.data ? data.attributes.noteSet.data.id : -1,
          content: data.attributes.content
        }
        return { data: cookedData, meta };

      }

      // if the note is not public, 401
      else {
        ctx.status = 401
        return
      }

    }

    // if user is the author
    else {

      // return
      const cookedData = {
        id: data.id,
        title: data.attributes.title,
        author: data.attributes.author.data.id,
        noteSet: data.attributes.noteSet.data ? data.attributes.noteSet.data.id : -1,
        hasPublic: data.attributes.hasPublic,
        content: data.attributes.content
      }
      return { data: cookedData, meta };

    }
    
  },

}));
