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
	post_link: function( post, username ) {
		if( typeof process.env.BLOG_URL !== 'undefined' && process.env.BLOG_URL !== '' ) {
			return `${process.env.BLOG_URL}/${post.slug}`;
		}
		return `https://${username}.hashnode.dev/${post.slug}-${post.cuid}`;
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
