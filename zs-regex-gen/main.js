import fs         from "fs";
import fetch       from "node-fetch";
import {JSDOM}    from "jsdom";
import path       from "path";

const baseUrl = "https://gutawer.gitlab.io/gzdoom_pk3_doc/docs/git-latest/index.html";

const document = await fetchPage(baseUrl);
const lists = document.querySelectorAll("div.collapsible");

for( const list of lists )
{
	const category = list.getAttribute("id");
	const symbols = [];

	let selector = ".summary_grid_name";

	if( category === "constants.all" )
	{
		selector = ".source";
	}

	for( const child of list.querySelectorAll(selector) )
	{
		if( category === "constants.all" )
		{
			symbols.push(child.textContent.trim().match(/ *([^ ]+?) *=/)[1].replaceAll(/[^A-Za-z0-9_-]/ig,""));
		}
		else
		{
			symbols.push(child.textContent.trim());
		}
	}

	//console.log(`${category}: ${symbols.join("|")}`);
	fs.writeFileSync(category + ".txt", symbols.join("|"));
}
async function fetchPage(url)
{
	const response = await fetch(url);
	const html = await response.text();
	const dom = new JSDOM(html);
	const window = dom.window;
	const document = window.document;
	return document;
}
