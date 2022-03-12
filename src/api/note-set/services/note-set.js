'use strict';

/**
 * note-set service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::note-set.note-set');
