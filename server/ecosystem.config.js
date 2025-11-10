module.exports = {
  apps: [
    {
      name: 'riseready-api',
      script: 'src/index.js',
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'riseready-worker',
      script: 'src/worker.js',
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
