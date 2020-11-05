const fetch           = require( "node-fetch" );
const helpers         = require( './helpers' );
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

module.exports = async function( username, limit = 6 ) {
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
					post.url = helpers.post_link( post, username );
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
