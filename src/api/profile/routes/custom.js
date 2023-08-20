module.exports = {
    routes: [
      // Route for creating a profile (POST request)
      {
        method: 'POST',
        path: '/profile/me',
        handler: 'profile.createMe',
        config: {
          policies: [], // We don't need any policy for this route.
        },
      },
      {
        method: 'GET',
        path: '/profile/me',
        handler: 'profile.findMe',
        config: {
          policies: [], // We don't need any policy for this route.
        },
      },
      {
        method: 'PUT',
        path: '/profile/me',
        handler: 'profile.updateMe',
        config: {
          policies: [], // We don't need any policy for this route.
        },
      },
    ],
  };
  