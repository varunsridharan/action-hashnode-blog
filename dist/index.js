require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 293:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const spawn = __nccwpck_require__(129).spawn;
const path  = __nccwpck_require__( 622 );

const exec = ( cmd, args = [] ) => new Promise( ( resolve, reject ) => {
	const app = spawn( cmd, args, { stdio: 'inherit' } );
	app.on( 'close', code => {
		if( code !== 0 ) {
			err      = new Error( `Invalid status code: ${code}` );
			err.code = code;
			return reject( err );
		}
		return resolve( code );
	} );
	app.on( 'error', reject );
} );

const main = async() => {
	await exec( 'bash', [ path.join( __dirname, './commit.sh' ) ] );
};


module.exports = main;


/***/ }),

/***/ 652:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const helpers = __nccwpck_require__( 342 );

function blog_table( posts, style ) {
	let column = style.split( '-' );
	column     = ( typeof column[ 2 ] !== 'undefined' ) ? column[ 2 ] : 2;

	let html = '<table><tr>';

	posts.forEach( ( post, index ) => {
		const {url, title, brief, coverImage, dateUpdated, dateAdded} = post;

		if( 0 !== index && ( index % column ) === 0 ) {
			html += '</tr><tr>';
		}

		html += `<td>${helpers.img( coverImage, url, title, '', '' )}
${helpers.a( url, title, `<strong>${title}</strong>` )}
${dateAdded} ${dateUpdated}
<br/> ${brief}</td>`;
	} );

	return html += '</tr></table>';
}

async function lists( posts, STYLE ) {
	let markdown = [];
	STYLE        = STYLE.toLowerCase();
	posts.forEach( ( post, index ) => {
		switch( STYLE ) {
			case 'list':
			case 'list-unordered':
				markdown.push( `- [${post.title}](${post.url})` );
				break;
			case 'list-ordered':
				markdown.push( `1. [${post.title}](${post.url})` );
				break;
			case 'list-gist':
				markdown.push( `${index + 1}. ${post.title}` );
				break;
		}

	} );
	return markdown.join( '\n' );
}

async function blog( posts, STYLE ) {
	let markdown    = [];
	STYLE           = STYLE.toLowerCase();
	let isalternate = ( 'blog-alternate' === STYLE );
	STYLE           = ( 'blog-alternate' === STYLE ) ? 'blog-left' : STYLE;

	if( STYLE.startsWith( 'blog-grid' ) ) {
		return blog_table( posts, STYLE );
	}

	posts.forEach( post => {
		const {url, title, brief, coverImage, dateUpdated, dateAdded} = post;

		switch( STYLE ) {
			case 'blog':
				markdown.push( `<h3>${helpers.a( url, title, title )}</h3>
${helpers.img( coverImage, url, title, '', '400px' )}
<div>Created: ${dateAdded}</div><div>Last Updated: ${dateUpdated}</div>
<p>${brief}</p>` );
				break;
			case 'blog-left':
			case 'blog-right':
				let align = ( 'blog-left' === STYLE ) ? 'left' : 'right';
				markdown.push( `<p align="left">
${helpers.img( coverImage, url, title, align, '250px' )}
${helpers.a( url, title, `<strong>${title}</strong>` )}
<div>Created: ${dateAdded}</div><div>Last Updated: ${dateUpdated}</div>
<br/> ${brief} </p> <br/> <br/>` );
				if( isalternate ) {
					STYLE = ( 'blog-left' === STYLE ) ? 'blog-right' : 'blog-left';
				}
				break;
		}

	} );
	return markdown.join( `\n` );
}

module.exports = {
	list: lists,
	blog: blog
};


/***/ }),

/***/ 342:
/***/ ((module) => {

function atag( link, title, content ) {
	return ( link !== '' ) ? `<a href="${link}" title="${title}">${content}</a>` : content;
}

function imgtag( src, link, title, align, width ) {
	width   = ( width !== '' ) ? `width="${width}"` : '';
	align   = ( width !== '' ) ? `align="${align}"` : '';
	let alt = ( title !== '' ) ? `alt="${title}"` : '';
	return ( src !== '' ) ? atag( link, title, `<img src="${src}" ${alt} ${width} ${align} />` ) : '';
}

module.exports = {
	a: atag,
	img: imgtag,
	post_link: function( post, username, BLOG_URL = false ) {
		return ( '' !== BLOG_URL ) ? `${BLOG_URL}/${post.slug}` : `https://${username}.hashnode.dev/${post.slug}-${post.cuid}`;
	},
	image_size: function( user_value, _default, small, large ) {
		if( 'small' === user_value ) {
			return small;
		}

		if( 'large' === user_value ) {
			return large;
		}

		if( '' === user_value ) {
			return _default;
		}
		return user_value;
	}
};



/***/ }),

/***/ 711:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const fetch           = __nccwpck_require__( 111 );
const helpers         = __nccwpck_require__( 342 );
const API_URL         = 'https://api.hashnode.com',
	  DEFAULT_HEADERS = {
		  'Content-type': 'application/json',
	  };

async function query_api( username = false, pageno = 1 ) {
	const query       = `
{
  user(username: "${username}"){
    publication{
      posts(page:${pageno}) {
        slug
        title
        cuid
        brief
        coverImage
		dateUpdated
        dateAdded
      }
    }
  }
}
`;
	const result      = await fetch( API_URL, {
		method: 'POST',
		headers: DEFAULT_HEADERS,
		body: JSON.stringify( { query } ),
	} );
	const ApiResponse = await result.json();

	if( 0 === ApiResponse.data.user.publication.posts.length ) {
		return false;
	}

	return ApiResponse.data.user.publication.posts;
}

module.exports = async function( username, limit = 6, BLOG_URL = false ) {
	let loop_status = true,
		posts       = [],
		i           = 0;
	while( loop_status ) {
		let results = await query_api( username, i++ );

		if( false === results ) {
			loop_status = false;
		} else {
			results.forEach( ( post ) => {
				if( posts.length >= limit ) {
					loop_status = false;
				} else {
					post.url = helpers.post_link( post, username, BLOG_URL );
					posts.push( post );
				}
			} );
		}

		if( posts.length >= limit ) {
			loop_status = false;
		}
	}
	return posts;
};


/***/ }),

/***/ 98:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 106:
/***/ ((module) => {

module.exports = eval("require")("gist-box");


/***/ }),

/***/ 111:
/***/ ((module) => {

module.exports = eval("require")("node-fetch");


/***/ }),

/***/ 129:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");;

/***/ }),

/***/ 747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ 622:
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const query       = __nccwpck_require__( 711 );
const render      = __nccwpck_require__( 652 );
const core        = __nccwpck_require__( 98 );
const fs          = __nccwpck_require__( 747 );
const commitFile  = __nccwpck_require__( 293 );
const { GistBox } = __nccwpck_require__( 106 );

// most @actions toolkit packages have async methods
async function run() {
	try {
		const TYPE     = core.getInput( 'TYPE' );
		const FILE     = core.getInput( 'FILE' );
		const USERNAME = core.getInput( 'USERNAME' );
		const STYLE    = core.getInput( 'STYLE' );
		const COUNT    = core.getInput( 'COUNT' );
		const BLOG_URL = core.getInput( 'BLOG_URL' );

		core.startGroup( 'Parsed Config' );
		core.info( `Type                     = ${TYPE}` );
		core.info( `File / Gist ID           = ${FILE}` );
		core.info( `Hashnode Username        = ${USERNAME}` );
		core.info( `Output Style             = ${STYLE}` );
		core.info( `No Of Posts To Display   = ${COUNT}` );
		core.endGroup();


		const results = await query( USERNAME.toLowerCase(), COUNT, BLOG_URL );
		let output    = '';

		core.startGroup( 'Latest Posts data' );
		core.info( JSON.stringify( results, null, 2 ) );
		core.endGroup();
		core.info( ' ' );

		if( 'gist' === TYPE.toLowerCase() ) {
			if( STYLE.toLowerCase().startsWith( 'list' ) ) {
				output = await render.list( results, STYLE );
			} else {
				output = await render.list( results, 'list' );
			}

			let list_data = await render.list( results, 'list-gist' );
			const box     = new GistBox( { id: FILE, token: process.env.GITHUB_TOKEN } );

			await box.update( {
				filename: 'blog.md',
				description: 'My Latest Blogs 👇',
				content: list_data + '\n\n' + output
			} );
		} else {
			const file_path    = `${process.env.GITHUB_WORKSPACE}/${FILE}`;
			const file_content = fs.readFileSync( file_path );

			if( STYLE.toLowerCase().startsWith( 'list' ) ) {
				output = await render.list( results, STYLE );
			} else if( STYLE.toLowerCase().startsWith( 'blog' ) ) {
				output = await render.blog( results, STYLE );
			}


			const regex  = /^(<!--(?:\s|)HASHNODE_BLOG:(?:START|start)(?:\s|)-->)(?:\n|)([\s\S]*?)(?:\n|)(<!--(?:\s|)HASHNODE_BLOG:(?:END|end)(?:\s|)-->)$/gm;
			const result = file_content.toString().replace( regex, `$1\n${output}\n$3` );

			fs.writeFileSync( file_path, result );

			await commitFile().catch( err => {
				core.error( err );
				core.info( err.stack );
				process.exit( err.code || -1 );
			} );
		}

	} catch( error ) {
		core.setFailed( error.message );
	}
}

run();

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map