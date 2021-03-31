#  Squarelet: A cooperative online pinboard

Squarelet is an online pinboard that enables **pupils** (from age 10), **students** and **knowledge workers** to develop, display and share ideas together without barriers, by creating and connecting squares of different types such as text, links, images and embedded open content.

!["Squarelet Board"](https://edulabs.de/assets/img/static/squarelet.png)

maintained by: 

[<img src="https://okfn.de/files/blog/2021/03/Logo_okfde_black_centered.png" width=300>](https://www.okfn.de)  [<img src="https://edulabs.de/assets/img/static/edulabs-logo.svg" width=300>](https://edulabs.de/)

Prototype: [squarelet.org](https://squarelet.org) (works best on Firefox desktop currently)

Wireframes: [Google Slides (public comments)](https://docs.google.com/presentation/d/1NvHgqwmQuJguAoU0G2bbBaeWv8Zr5yRbvQd_LWUeYW4)

### Want to jump in?
* [Improve the Design](https://docs.google.com/presentation/d/1NvHgqwmQuJguAoU0G2bbBaeWv8Zr5yRbvQd_LWUeYW4): Comment the Wireframes in our google slides presentation
* [Bug hunt](https://github.com/okfde/squarelet/issues/): Did you find a bug in the [prototype](https://squarelet.org)? Please check existing [github issues](https://github.com/okfde/squarelet/issues/) and create a new one if it is not listed yet.
* [Use Cases](): How would you like to use squarelet, in class or in your work? Please describe your idea as a comment to this issue
* [Writing code](https://github.com/okfde/squarelet/labels/development): Ready to write some javascript with us? These issues are waiting..
* [Discuss](https://github.com/okfde/squarelet/labels/question): There are still some open ended questions for this prototype. Join in on the discussion.

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

## Roadmap
### Short term - What we are working on now :tada:
* Explain project and open it to the community 
	* :white_check_mark: create [wireframes](https://docs.google.com/presentation/d/1NvHgqwmQuJguAoU0G2bbBaeWv8Zr5yRbvQd_LWUeYW4)
	* :white_check_mark: collect use cases
	* :pencil2: create gifs of use cases
	* :pencil2: create landing page
* create an MVP
	* :white_check_mark: squarelets can be saved online 
	    * :pencil2: simple backend options
		* (more detailed description follows)
	* :white_check_mark: squarelets can be shared with others
		* (more detailed description follows)
	* architecture is prepared for future extensions
		* change UI library to prepare for easier mobile interface
		* option to include new square types
	* improve usability
		*  fix main bugs
	* improve design
	

### Medium term - what we're working on next! :art:
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


### Longer term items - working on this soon! :fast_forward: 
* Different views
* Option to include different square types
* "Content pickers" from open licensed content (Wiki commons / flickr etc)

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
