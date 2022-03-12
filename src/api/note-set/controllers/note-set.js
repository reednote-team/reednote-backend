'use strict';

/**
 *  note-set controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::note-set.note-set', ({ strapi }) => ({

  async create(ctx) {

    // assign owner when create noteSet
    ctx.request.body.data.owner = ctx.state.user;

    // get and return noteSet, owner, and notes information when create finished
    ctx.query.populate = 'owner'
    const { data, meta } = await super.create(ctx)
    const cookedData = {
      id: data.id,
      name: data.attributes.name,
      description: data.attributes.description,
      owner: data.attributes.owner.data.id,
      color: data.attributes.color
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
    ctx.query.populate = 'owner,notes'
    const { data, meta } = await super.find(ctx)

    const cookedData = []
    data.forEach(noteSet => {

      // if noteSet not belong to the current user, drop
      if (noteSet.attributes.owner.data.id != ctx.state.user.id) {
        return
      }

      // else, push to note list and return
      cookedData.push({
        id: data.id,
        name: data.attributes.name,
        description: data.attributes.description,
        owner: data.attributes.owner.data.id,
        color: data.attributes.color,
        notes: ((noteSet) => {
          const notes = []
          data.attributes.notes.data.forEach((note) => {
            notes.push(note.id)
          })
          return notes
        })(noteSet)
      })
    });
    return { data: cookedData, meta }
  },

  async findOne(ctx) {

    // get owner and notes information
    ctx.query.populate = 'owner,notes'
    const { data, meta } = await super.findOne(ctx);

    // if user is not login or is not the author
    if (!ctx.state.user || data.attributes.author.data.id != ctx.state.user.id) {

      // if the noteSet is public, return
      if (data.attributes.hasPublic) {

        const cookedData = {
          id: data.id,
          name: data.attributes.name,
          description: data.attributes.description,
          owner: data.attributes.owner.data.id,
          color: data.attributes.color
        }
        return { data: cookedData, meta };

      }

      // if the note is not public, only return id and owner
      else {

        const cookedData = {
          id: data.id,
          owner: data.attributes.owner.data.id,
          color: data.attributes.color
        }
        return { data: cookedData, meta };

      }

    }

    // if user is the author
    else {

      // return
      const cookedData = {
        id: data.id,
        name: data.attributes.name,
        description: data.attributes.description,
        owner: data.attributes.owner.data.id,
        color: data.attributes.color,
        notes: ((noteSet) => {
          const notes = []
          data.attributes.notes.data.forEach((note) => {
            notes.push(note.id)
          })
          return notes
        })(noteSet)
      }
      return { data: cookedData, meta };

    }

  }

}));
