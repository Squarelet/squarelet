# Squarelet: A cooperative online pinboard

> [!WARNING]
> ⚠️ Deprecated / Unmaintained: This project is no longer maintained and is kept online for historical reference only.  
> It uses outdated dependencies and may contain known security vulnerabilities.  
> Do not install, deploy, or use this code in production.

Squarelet is an online pinboard that enables **pupils** (from age 10), **students** and **knowledge workers** to develop, display and share ideas together without barriers, by creating and connecting squares of different types such as text, links, images and embedded open content.

!["Squarelet Board"](https://edulabs.de/assets/img/static/squarelet.png)

Originally maintained by:

[<img src="https://okfn.de/files/blog/2021/03/Logo_okfde_black_centered.png" width=300>](https://www.okfn.de)  [<img src="https://edulabs.de/assets/img/static/edulabs-logo.svg" width=300>](https://edulabs.de/)

Prototype: [squarelet.org](https://squarelet.org)  
Wireframes: [Google Slides](https://docs.google.com/presentation/d/1NvHgqwmQuJguAoU0G2bbBaeWv8Zr5yRbvQd_LWUeYW4)

## Project Status

This repository is no longer actively maintained.

It remains public for archival and reference purposes only. Issues, pull requests, and installation attempts are discouraged unless someone intentionally forks and takes over maintenance.

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

## Historical Roadmap

The sections below reflect the original project planning and are preserved for historical context. They do not indicate active development.

### Short term
* Explain project and open it to the community
    * create wireframes
    * collect use cases
    * create gifs of use cases
    * create landing page
* create an MVP
    * squarelets can be saved online
    * simple backend options
    * squarelets can be shared with others
    * architecture is prepared for future extensions
    * improve usability
    * improve design

### Medium term
* Collaborative real time editing
* Even better usability
    * Mobile view
* embedding open content
* Export options in other filetypes
    * pdf
    * html
* different views of squares
    * canvas view (standard)
    * structured view
* create templates for squares

### Longer term items
* Different views
* Option to include different square types
* "Content pickers" from open licensed content (Wiki commons / flickr etc)

## Development

The historical development instructions are preserved below for reference only. Please do not install or run this project unless you plan to maintain your own fork.

```sh
$ git clone https://github.com/okfde/squarelet
$ cd squarelet
$ npm install # or yarn install
$ npm run serve # or yarn run server
```

To build it:

```sh
$ npm run build # or yarn run build
```

The output is generated in the `dist/` folder.
