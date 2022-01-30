'use strict';

/**
 * public-note router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::public-note.public-note');
