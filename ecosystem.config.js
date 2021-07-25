module.exports = {
  apps: [
    {
      name: "kk-server",
      script: "./kk-server/index.js",
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
  deploy: {
    production: {
      user: "root",
      host: "156.244.79.226",
      ref: "origin/master",
      repo: "git@github.com:freekingg/king-seo.git",
      path: "/www/kk",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production",
    },
  },
};
