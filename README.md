This is the README.md for the whole monorepo. from the root

yarn

yarn modular build data-source

yarn modular build data-remote

yarn modular build datagrid

cd packages/remote-worker

yarn build

back to root, then ...

yarn modular build app

that'e everythimng built, then to serve, I suggest

npx serve -s dist/app

To run in dev mode (doesn't require any of the above build steps, just the initial yarn)

yarn start
