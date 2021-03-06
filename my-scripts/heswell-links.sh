#! /bin/bash
rm -rf ~/git/heswell/grid/node_modules/@heswell/data-remote
rm -rf ~/git/heswell/grid/node_modules/@heswell/data-source
rm -rf ~/git/heswell/grid/node_modules/@heswell/data-store
rm -rf ~/git/heswell/grid/node_modules/@heswell/grid
rm -rf ~/git/heswell/grid/node_modules/@heswell/layout
rm -rf ~/git/heswell/grid/node_modules/@heswell/popup
rm -rf ~/git/heswell/grid/node_modules/@heswell/ui-controls
rm -rf ~/git/heswell/grid/node_modules/@heswell/utils
rm -rf ~/git/heswell/grid/node_modules/@heswell/worker


ln -s ~/git/heswell/heswell/packages/data-remote ~/git/heswell/grid/node_modules/@heswell/data-remote
ln -s ~/git/heswell/heswell/packages/data-source ~/git/heswell/grid/node_modules/@heswell/data-source
ln -s ~/git/heswell/heswell/packages/data-store ~/git/heswell/grid/node_modules/@heswell/data-store
ln -s ~/git/heswell/heswell/packages/grid ~/git/heswell/grid/node_modules/@heswell/grid
ln -s ~/git/heswell/heswell/packages/grid ~/git/heswell/grid/node_modules/@heswell/layout
ln -s ~/git/heswell/heswell/packages/popup ~/git/heswell/grid/node_modules/@heswell/popup
ln -s ~/git/heswell/heswell/packages/grid ~/git/heswell/grid/node_modules/@heswell/ui-controls
ln -s ~/git/heswell/heswell/packages/utils ~/git/heswell/grid/node_modules/@heswell/utils
ln -s ~/git/heswell/heswell/packages/worker ~/git/heswell/grid/node_modules/@heswell/worker
