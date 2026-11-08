// pm2 config for the storefront on the VPS. The deploy workflow ships this file
// inside each release and starts it with APP_CURRENT and APP_SHARED set.
//   APP_CURRENT  the "current" symlink, which points at the live release
//   APP_SHARED   a folder that survives deploys and holds the runtime .env
module.exports = {
  apps: [
    {
      // Keep this in step with PM2_FRONT_NAME in the backend, which the System health page reads.
      name: process.env.PM2_APP_NAME || 'bmfront-prod',
      script: 'server.js',
      cwd: process.env.APP_CURRENT,
      // Runtime settings (API_URL for server-side calls, etc.) live on the server, not in git.
      node_args: [`--env-file=${process.env.APP_SHARED}/.env`],
      env: {
        NODE_ENV: 'production',
        PORT: process.env.FRONT_PORT || '3583',
        // Only the reverse proxy (nginx) should reach it.
        HOSTNAME: '127.0.0.1',
      },
      max_memory_restart: '600M',
    },
  ],
};
