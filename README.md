# Work test bowling game

- The Game: https://bowling.sharetransition.com/
- The project plan: https://trello.com/b/bJNYK8Hs/bowling
- The node template i made: https://github.com/mickenorlen/docker-node-webpack

It was my first time working in pure node and it took quite some time to set up a nice environment with docker scipts, vue, babel, webpack and linters `yarn lint`. But it felt good to have a solid foundation to work with and I learned new things on the way. I also implemented responsive styling (look at how the results table goes from 10-col to 5-col in smaller screens :D), localstorage caching (try refreshing page and going back-forward in app) and some js code tests `yarn test`.

# Usage

If you want to start the project locally. Here are some useful docker scripts (`docker/docker.sh`):

- **Start app**: `yarn d start`, or `yarn d start prod` for production
- **Get list of scripts**: `yarn d help`
- **Check container log**: `yarn d logs`
- **Clean up everything**: `yarn d rmall`

There is an `.env` file you might want to check out. Default port is 3000 so the app should be available on `http://localhost:3000/` after startup.

`yarn install` is run inside the app container on startup (`docker/startup.sh`), but should be able to run outside as well.

I put some empty placeholder files/folders in the app eg: `package.json`, `startup.sh`, `node_modules` to ensure correct permissions are set when they are mounted in `docker-compose.yml`.
