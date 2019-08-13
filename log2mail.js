"use strict"

const miss = require('mississippi2');
const argv = require('minimist')(process.argv.slice(2));
const Ansi = require('ansi-to-html');
const ansi = new Ansi({
	newline: false,
	stream: false,
});

miss.toString(process.stdin, function (err, text) {
	text = text.split('\n');
	text = text.map(l => {
		if (!l) return '';
		if (l.startsWith('# '))   return '<h1>'+ansi.toHtml(l.substr(2))+'</h1>';
		if (l.startsWith('## '))  return '<h2>'+ansi.toHtml(l.substr(3))+'</h2>';
		if (l.startsWith('### ')) return '<h3>'+ansi.toHtml(l.substr(4))+'</h3>';
		return '<small>'+ansi.toHtml(l)+'</small>';
	})
	text = text.join('<br>\n');

	text = [
		'From: '+(argv.from || 'unknown'),
		'To: '+(argv.to || 'unknown'),
		'Subject: '+(argv.subject || 'unknown subject'),
		'Content-Type: text/html; charset="utf8"',

		'',
		'<html>',
		'<style>',
			'body  {color:#000; font-size:12px}',
			'h1 {font-weight:bold; font-size:18px}',
			'h2 {font-weight:bold; font-size:15px}',
			'h3 {font-weight:bold; font-size:12px}',
			'small {color:#aaa; font-size:9px}',
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