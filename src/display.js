const helpers = require( './helpers' );

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
<div><strong>${helpers.parseDate(dateAdded)}</strong> | <strong>${helpers.parseDate(dateUpdated)}</strong></div>
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
<div><strong>${helpers.parseDate(dateAdded)}</strong> | <strong>${helpers.parseDate(dateUpdated)}</strong></div>
<p>${brief}</p>` );
				break;
			case 'blog-left':
			case 'blog-right':
				let align = ( 'blog-left' === STYLE ) ? 'left' : 'right';
				markdown.push( `<p align="left">
${helpers.img( coverImage, url, title, align, '250px' )}
${helpers.a( url, title, `<strong>${title}</strong>` )}
<div><strong>${helpers.parseDate(dateAdded)}</strong> | <strong>${helpers.parseDate(dateUpdated)}</strong></div>
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
