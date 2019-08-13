"use strict"

const miss = require('mississippi2');
const argv = require('minimist')(process.argv.slice(2));
const Convert = require('ansi-to-html');
const toHtml = (new Convert()).toHtml;

miss.toString(process.stdin, function (err, text) {
	text = text.split('\n');
	text = text.map(l => {
		if (!l) return '';
		if (l.startsWith('# '))   return '<h1>'+toHtml(l.substr(2))+'</h1>';
		if (l.startsWith('## '))  return '<h2>'+toHtml(l.substr(3))+'</h2>';
		if (l.startsWith('### ')) return '<h3>'+toHtml(l.substr(4))+'</h3>';
		return '<small>'+toHtml(l)+'</small>';
	})
	text = text.join('<br>\n');

	text = [
		'From: '+argv.from,
		'To: '+argv.to,
		'Subject: '+argv.subject,
		'Content-Type: text/html; charset="utf8"',

		'',
		'<html>',
		'<style>',
			'small {color:#aaa;font-size:9px}',
		'</style>',
		'<body>',
		text,
		'</body>',
		'</html>',
		'',
		''
	].join('\n');

	miss.fromValue(text).pipe(process.stdout);
})