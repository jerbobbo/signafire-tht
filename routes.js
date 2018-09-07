'use strict';
const Boom = require('boom');

exports.plugin = {
  name: 'routesPlugin',
  version: '1.0.0',
  register: async (server, options) => {

    const getAccesses = async (userName) => {
      const user = await server.db.User.findOne({
        where: {
          name: userName
        }
      });
      if (!user) {
        throw Boom.notFound('No user by that name exists');
      }
      const accesses = await user.getAccesses({
        where: {
          read: true
        }
      });
      if (accesses.length === 0) {
        throw Boom.notFound('This user does not have access to any indices')
      }
      return accesses;
    }

    const processSearch = async (indices, searchName) => {
      const esResults = await server.esClient.search({
        index: indices,
        type: 'docs',
        body: {
          query: {
            match: {
              first_name: searchName
            }
          }
        }
      });
      return esResults.hits.hits.map((result) => {
        return {
          id: result._id,
          full_name: `${result._source.first_name} ${result._source.last_name}`,
          location: result._source.location
        }
      });
    }

    server.route({
      method: 'GET',
      path: '/users/{name}',
      options: {
        description: 'Lists all elasticsearch indices the user has access to'
      },
      handler: async (request, h) => {
        try {
          return await getAccesses(request.params.name);
        } catch (err) {
          if (Boom.isBoom(err)) {
            return err;
          }
          return Boom.badImplementation();
        }
      }
    });

    server.route({
      method: 'GET',
      path: '/users/{name}/search',
      options: {
        description: 'Returns elasticsearch results for all users whose first name matches the querystring parameter q',
      },
      handler: async (request, h) => {
        try {
          const accesses = await getAccesses(request.params.name);
          const idxNamesToSearch = await Promise.all(accesses.map(async (access) => {
            const idx = await access.getIndex();
            return idx.name;
          }));
          const elasticsearchResults = await processSearch(idxNamesToSearch, request.query.q);
          return elasticsearchResults;

        } catch (err) {
          if (Boom.isBoom(err)) {
            return err;
          }
          return Boom.badImplementation();
        }
      }

    });
  }
}