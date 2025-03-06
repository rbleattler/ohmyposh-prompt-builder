module.exports = function override(config, env) {
  // Update devServer configuration if it exists
  if (config.devServer) {
    console.log("Is Dev Server");
    delete config.devServer.onBeforeSetupMiddleware;
    delete config.devServer.onAfterSetupMiddleware;

    config.devServer.setupMiddlewares = (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      // Disable the overlay
      devServer.options.overlay = false;
      console.log("overlay: ", devServer.options.overlay);

      // Add any custom middleware here if needed

      return middlewares;
    };
  }

  return config;
};