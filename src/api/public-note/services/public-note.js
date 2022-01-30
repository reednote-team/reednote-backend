'use strict';

/**
 * public-note service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::public-note.public-note');
