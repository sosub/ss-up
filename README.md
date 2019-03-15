# How to run project on development?

0. You need node version 8.x and npm version 5.x or higher.

1. Install packages by run command:

`npm install`

2. Install proxy to bypass CORS:

`npm install -g local-cors-proxy`

3. Run proxy to API server:

`lcp --proxyUrl http://13.229.53.164:8088`

4. Run project

`npm start`

5. Open browser at http://localhost:3000


# How to build and run project on production?

1. Build project:

`npm run build`

2. Run project:

`serve -s build/`

3. Open browser at http://localhost:5000

May be you need install `serve` package by command `npm i -g serve`

# No need proxy

Change configuration at `app/config/app.js`
