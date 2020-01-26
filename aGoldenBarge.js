// the following line includes the discord.js dependency so we can use the discord API without knowing anything about it or even what we're doing!

const Discord = require('discord.js');

// this line tells the bot to search for and include a configuration file, which tells us what our command prefix is and what our secret login token is.
// see config.json for more information

// const { prefix, token } = require('./config.json');-----------------------------------------------------------------//
// --------------------------------------------------------------------------------------------------------------------//
// --------------------------------------------------------------------------------------------------------------------//
// SPECIAL NOTE, CONFIG VARS CHANGED TO DEPLOY ONLINE VIA HEROKU-------------------------------------------------------//
// CONFIG COMMENTED OUT, USING PROCESS FOR PREFIX AND TOKEN------------------------------------------------------------//
const prefix = process.env.prefix;

// the next line tells the bot that every time we say "bot" it means this bot. essentially this is the line that gives the bot life.

const bot = new Discord.Client();

// this line tells the bot to include tracery, which is the whole reason we're making this thing. tracery is a javascript tool that allows us to make
// bitchin' random table generators using plain english concepts. you need to understand tracery more than javascript, so please go to the following
// website for a good introduction to this wonderful thing: http://air.decontextualize.com/tracery/

const tracery = require('tracery-grammar');

// this is a tracery function, it has nothing to do with node or discord or anything in this bot except your tracery script. it turns the modifiers on
// for your lists; so if you're using .a or .capitalize or similar modifiers to your tracery grammars, you need this. A Golden Barge does not use modifiers
// as of right now, so we are going to comment this line out. that means we put '// ' in front of the line so that the bot will ignore it.

// grammar.addModifiers(tracery.baseEngModifiers);

// we want to be able to make cool RPG generators without fucking up this bot right? this is important to us, because we're not programmers!
// you read the tutorial linked beforehand, so you should know that when i say "grammar" it means the sentence your bot will speak, and
// when i say "symbols" i means all the words tracery uses to make your sentence random. these lines tell the bot to include your symbols from
// external files, so you can change them and add to them without ever having to change this file. it also tells the bot where to find those files.
// each line is a different list of symbols, in their own files, found in a folder called symbolLists.

const { adjective } = require('./symbolLists/adjectiveList.json');
const { expertise } = require('./symbolLists/expertiseList.json');
const { habit } = require('./symbolLists/habitList.json');
const { notoriety } = require('./symbolLists/notorietyList.json');
const { skill } = require('./symbolLists/skillList.json');
const { sphere } = require('./symbolLists/sphereList.json');
const { welcome } = require('./symbolLists/welcomeList.json');

// now we need to tell the bot what to look for in those external files when it goes looking to make our grammar.
// the first line of this part tells the bot to create the tracery grammar. the lines after that tell the bot what to look for in those external files.
// for example, on LINE 45 it says 'adjective': adjective, which is the bot telling itself that the #adjective# symbols for our grammar are the same 'adjective'
// found in adjectiveList.json. since we told the bot on LINE 32 that the "adjective" symbols are in a different file, this section tells the bot what to look at
// in that file.

const grammar = tracery.createGrammar({
	'adjective': adjective,
	'expertise': expertise,
	'habit': habit,
	'notoriety': notoriety,
	'skill': skill,
	'sphere': sphere,
	'welcome': welcome,

	// now we need to make the grammar. we're doing that in this file instead of the external file because this is only a couple lines and if we fuck this up then
	// what are we even doing? if you read the tracery tutorial, this is the same as #origin#, only we're calling it something else thematic to our bot.

	'bargeArrive': [
		'#welcome# `#adjective# #sphere#`, #notoriety# for its #habit# and #expertise# #skill#.',
	],

});


// that is the meat of this bot; it tells the bot exactly what to say using a bevy of random shit written by Daniel Sell, creator of Troika!
// next we will write out the part that checks if the bot works, and tells it to output our grammar when a user types !where in Discord

// first up, let's check to see if the bot is up and running. this is actually really important, if this isn't in your file then the bot won't work!
// what goes on is our bot checks to see if it's ready, and if it is in fact ready, the bot sends a message to the console. since your bot will only likely
// run on your own server, you can just make it say "Ready." personally, i like making it say cool shit. when the bot is read to go, it signals that it is
// running fine "without hesitation" and tells how many discord users can use the bot (sailors) and how many discord servers the bot is installed on (spheres).
// this function will only happen once, whenever the bot is turned on, so we use bot.once

bot.once('ready', async () => {
	console.log (`The Golden Barge sails without hesitation...\n...The Golden Barge ferries ${bot.users.size} sailors among some ${bot.guilds.size} spheres!`);

	// this line generates a link when the bot starts that a server would use to install A Golden Barge. the link contains the permissions the bot needs
	// to execute the commands we give it. it also "catches" any errors and tells the console what went wrong.
	bot.generateInvite(['MANAGE_MESSAGES', 'READ_MESSAGES', 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL', 'SEND_TTS_MESSAGES']).then(link => {
		console.log(link);
	}).catch(err => {
		console.log(err.stack);
	});

	// discord users can set statuses and activities that show under their names in the people lists, but bots can only show activities. let's give this one something good.
	// you only have a couple options that preceed the name of your activity, and we're choosing the listen one.

	bot.user.setActivity('to The Dead\'s Prayer', { type: 'LISTENING' });
});

// let's send a message to the console whenever a new discord server installs A Golden Barge. this function tells the console how many people are on the server and
// updates the number of active server installs. this function will happen the entire time the bot is on, so we use bot.on

bot.on('guildCreate', guild => {
	console.log(`${bot.users.size} sailors have boarded the Golden Barge—now servicing ${bot.guilds.size} spheres.`);
});

// now let's tell the console when a server uninstalls or yeets the bot

bot.on('guildDelete', guild => {
	console.log(`${bot.users.size} sailors have fallen from the Golden Barge. Service shrinks to ${bot.guilds.size} spheres.`);
});

// finally we come to the part where a user can ask the bot for a random Troika! sphere by typing !where in discord.
// to start this process, we tell our bot that it needs to be reading messages. this is called listening.

bot.on('message', message => {

	// now that the bot is listening for messages, we need to tell it which ones to ignore. this line tells it to ignore the following:
	// messages that don't start with our command prefix (!), messages from other bots (no loops), and it will ignore DMs (no sliding in)

	if (!message.content.startsWith(prefix) || message.author.bot || message.channel.type === 'dm') return;

	// if the message does include the prefix, is not from a bot, and is not a dm, the bot will check to see if it is the right command and then tell it what to do.
	// the bot needs to search for the command by splitting the message up to individual words, and deciding that the first word in the message, after the prefix, is the command.
	// for example, if the user sends a message that says "!eat my shorts" then the bot considers 'eat' the command. if the user's message is "eat my shorts" the bot does nothing.

	// this cuts the message up into individual words after the prefix
	const args = message.content.slice(prefix.length).split(/ +/);

	// this turns the first word into a command (and makes it lowercase for ease of use)
	const command = args.shift().toLowerCase();

	// currently this bot only has the one command, so if the user's message has anything other than !where the bot goes for a cigarette break.
	// but we still need to tell the bot what to do if the user does in fact send a message in the discord server that says !where
	// we already said "dear bot, if the message is a dm, from another bot, or doesn't have a ! then do nothing" so we need to say "but! if the message
	// says !where then you need to do something." javascript uses the statement "else if" instead of "but." this line tells the bot what to do if
	// the !where command is used.

	if (command === 'where') {

		// first first try delete the message the user sent, so the server doesn't get glorped up with a billion commands from users. message deleting can be instant by
		// leaving the parenthesis empty or you can put a timer on it in miliseconds.
		message.delete([0]);

		// after is told to delete the command from the discord server channel it was sent, the bot will now give it a random grammar from tracery.
		// this line tells the bot to put the grammar in the channel where it received the command
		message.channel.send(`${grammar.flatten('#bargeArrive#')}`);
	}
});


// this is the bot login credentials. bots have to login to discord the same way a human does, and the token is like their fast pass through the toll booth.
// our token is hidden in the config file under the entry "token" and this line tells the bot to look in that file under the entry called token.

// bot.login(token);

bot.login(process.env.token);