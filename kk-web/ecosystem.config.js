module.exports = {
  apps: [
    {
      name: "kk-web",
      script: "./index.js",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
    {
      name: "kk-web",
      script: "./kk-web/index.js",
    },
  ],
};
