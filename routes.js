'use strict';

exports.plugin = {
  name: 'routesPlugin',
  version: '1.0.0',
  register: async (server, options) => {
    server.route({
      method: 'GET',
      path: '/users/{name}',
      handler: async (request, h) => {
        const user = await server.db.User.findOne({ where: { name: request.params.name } });
        const accesses = await user.getAccesses({ where: { read: true } });
        return accesses;
      }
    })
  }  
}