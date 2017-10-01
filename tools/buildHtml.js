import fs from 'file-system';
import cheerio from 'cheerio';
import colors from 'colors';

fs.readFile('src/index.html', 'utf8', (err, markup) => {
	if(err){
		console.log(err);
	}
	const $ = cheerio.load(markup);
	$('head').append('<link rel="stylesheet" href="styles.css" />');
	fs.writeFile('dist/index.html', $.html(), 'utf8', function(err){
		if(err){
			console.log(err);
		}
		console.log('done');
	});
});