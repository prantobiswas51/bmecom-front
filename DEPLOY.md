# Deploying the storefront to the VPS

Two GitHub Actions workflows live in `.github/workflows/`:

| File | Runs on | Does |
| --- | --- | --- |
| `ci.yml` | pull requests and any branch except main | lint and build, to catch problems early |
| `deploy.yml` | push to main, or "Run workflow" by hand | lint, build, upload a release over SSH, switch to it with pm2, roll back if it does not answer |

## GitHub settings

The deploy job runs in the GitHub Environment named `bmfront-prod`, so you can store the values either there
(Settings > Environments > bmfront-prod) or at repository level (Settings > Secrets and variables > Actions).
Names may only use letters, numbers and underscores, so `PM2_APP_NAME` is a valid variable name and `bmfront-prod` is its value, not a name.

Secrets:

- `SSH_HOST`, `SSH_USER`, `APP_PATH` (for example `/var/www/bmcom-front`)
- `SSH_PRIVATE_KEY`: a key made only for deploys, with its public half in the server user's `~/.ssh/authorized_keys`
- `SSH_PORT` (optional, default 22)
- `SSH_KNOWN_HOSTS` (optional but better): output of `ssh-keyscan -p 22 your-host`. Without it the first connection is trusted blindly.

Variables:

- `NEXT_PUBLIC_API_URL` (required): the public URL of the backend, baked into the browser bundle. A secret of the same name also works.
- `NEXT_PUBLIC_GTM_ID` (optional): your Google Tag Manager id; empty turns tracking off. Changing it needs a new deploy. A secret works too.
- `FRONT_PORT` (optional, default 3583)
- `PM2_APP_NAME` (optional, default `bmfront-prod`): the process name in pm2

## One-time server setup

The deploy user needs Node 20.6 or newer and pm2 (`npm i -g pm2`), then:

```bash
mkdir -p /var/www/bmcom-front/shared
# Server-side settings; read at runtime, never committed
echo 'API_URL=http://127.0.0.1:3034' > /var/www/bmcom-front/shared/.env
# Start pm2 on boot (run the command it prints)
pm2 startup
```

Point nginx at `http://127.0.0.1:3583` (the app only listens locally):

```nginx
location / {
    proxy_pass http://127.0.0.1:3583;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## Good to know

- Releases are kept in `releases/<commit>`; `current` points at the live one and the three newest are kept.
- To roll back by hand: `ln -sfn releases/<older> current && pm2 reload bmfront-prod`.
- The pm2 process is named `bmfront-prod`. The admin System health page looks for `bmcom-front` by default, so set `PM2_FRONT_NAME=bmfront-prod` in the backend `.env` on the VPS.
