const query       = require( './query-hashnode' );
const render      = require( './display' );
const core        = require( '@actions/core' );
const fs          = require( "fs" );
const commitFile  = require( './commit-file' );
const { GistBox } = require( 'gist-box' );

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
