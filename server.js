const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

//Declare the app variable
const app = express();

app.get('/', (req, res) => {
	res.send("Hello World!!");
});

app.get('/newsHeadlinesIndia/:key', (req, res) => {
	if(req.params.key != "zkufga8762257")
	{
		res.status(400).send({
			message : 'Unauthorized User'
		});
	}
	async function getSiteData()
	{
		const {data} = await axios.get('https://indianexpress.com/section/india/');
		const $ = cheerio.load(data);
		var articlesList = [];

		//Grab all the titles
		$('.nation').find('div.articles').children('h2').each(function(index, element) {
			let newsTitle = $(element).text();
			let obj = {
				id : index,
				title : newsTitle.trim(),
				link : $(element).find('a').attr('href')
			}
			articlesList[index] = obj;
		});

		//Grab All the from Description
		$('.nation').find('div.articles').children('p').each(function(index, element) {
			let newsDesc = $(element).text();
			articlesList[index].description = newsDesc;
		});
		res.send(articlesList);
	}

	getSiteData().
		catch(function handleError(err) {
			err.message;
		}).
		catch(err => { process.nextTick(() => { throw err; }) });
	})

app.listen(process.env.PORT || 3000,() => {
	console.log("Server started");
});
