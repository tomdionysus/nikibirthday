 #!/bin/bash
 ./build.js

 rm -rf dist/Remake-darwin-x64
 electron-packager build Remake --all --overwrite --icon=./gfx/icon_source2.icns --out ./dist