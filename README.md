# Squarelet

https://squarelet.org

## Current Features
 * Offline first
    * All data is saved locally in IndexedDB using [localForage](https://localforage.github.io/localForage/).
    * Uses [SW Precache Webpack Plugin](https://github.com/goldhand/sw-precache-webpack-plugin) to make it possible to use Squarelet even without internet connection.

 * Square types
    * Markdown using [SimpleMDE](https://simplemde.com/) editor.
    * Image from an external URL or uploaded to the IndexedDB.
    * Website embedded using iframe.
  
 * Connections
    * Create connection between the squares, automatically where the connection path is the shortest.
    * Change connection width.
    * Make connections dashed.
    * Change connection color.
 * Board
    * Change background color
    * Change background image
    * Create multiple boards
    * Export a board to a file
    * Import a board from a file
 
 ## Development
 
 ```
 $ git clone https://github.com/okfde/squarelet
 $ cd squarelet
 $ npm install # or yarn install
 $ npm run serve # or yarn run server
 ```
 
 To build it:
 
 ```
 $ npm run build # or yarn run build
 ```
 
 the output is going to be generated at _dist/_ folder.
