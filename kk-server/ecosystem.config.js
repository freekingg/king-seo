module.exports = {
  apps: [
    {
      name: 'kk-server',
      script: './index.js',
      env: {
        NODE_ENV: 'production'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
