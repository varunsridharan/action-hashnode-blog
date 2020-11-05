const helpers = require( './helpers' );

function blog_table( posts, style ) {
	let column = style.split( '-' );
	column     = ( typeof column[ 2 ] !== 'undefined' ) ? column[ 2 ] : 2;

	let html = '<table><tr>';

	posts.forEach( ( post, index ) => {
		let url        = post.url,
			title      = post.title,
			brief      = post.brief,
			coverImage = post.coverImage;

		if( 0 !== index && ( index % column ) === 0 ) {
			html += '</tr><tr>';
		}

		html += `<td>${helpers.img( coverImage, url, title, '', '' )}
${helpers.a( url, title, `<strong>${title}</strong>` )}
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
		let url        = post.url,
			title      = post.title,
			brief      = post.brief,
			coverImage = post.coverImage;

		switch( STYLE ) {
			case 'blog':
				markdown.push( `<h3>${helpers.a( url, title, title )}</h3>
${helpers.img( coverImage, url, title, '', '400px' )}
<p>${brief}</p>` );
				break;
			case 'blog-left':
			case 'blog-right':
				let align = ( 'blog-left' === STYLE ) ? 'left' : 'right';
				markdown.push( `<p align="left">
${helpers.img( coverImage, url, title, align, '250px' )}
${helpers.a( url, title, `<strong>${title}</strong>` )}
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
