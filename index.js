// CONGIG
// -------
import discord from 'discord.js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const client = new discord.Client();
const CONST_PREFIX = '!';
const CONST_COLOR = '#3B3B3B';
const CONST_OPACITY = '100';
const CONST_MAX_CHECK = 3;


// LOG
// ---
function log(level, message, detail = '') {
    // log color
    let color = '\x1b[37m%s\x1b[0m';
    if (level == 'WARN') {
        color = '\x1b[33m%s\x1b[0m';
    } else if (level == 'ERROR') {
        color = '\x1b[31m%s\x1b[0m';
    }

    // log timestamp
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1);
    const day = (now.getDate() < 10 ? '0' : '') + now.getDate();
    const hours = now.getHours();
    const mins = now.getMinutes();
    const secs = now.getSeconds();
    const timestamp = '(' + year + '-' + month + '-' + day + ' ' + hours + ':' + mins + ':' + secs + ')';

    // actual log
    console.log(
        color,
        '[' + level + '] ' + timestamp + ' ' + message + ' ' + detail
    );
}


// URL REGEX VALIDATOR
// -------------------
function validURL(str) {
    var pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
        'i' // fragment locator
    ); 
    return !!pattern.test(str);
}


// HEXADECIMAL COLOR CODE REGEX VALIDATOR
// --------------------------------------
function validColor(str) {
    return str.match(/^#[a-f0-9]{6}$/i) !== null;
}


// BOT STARTUP EVENT
// -----------------
client.on('ready', () => {
    log('INFO', 'W2G-Bot is up');
});


// MESSAGE RECEIVED EVENT
// --------------------
client.on('message', (message) => {
            
    // check if the command is adressed to the bot (and not by itself)
    if (message.author.bot) return;
    if (!message.content.startsWith(CONST_PREFIX)) return;

    // getting the command and its arguments
    const commandBody = message.content.slice(CONST_PREFIX.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    // HELP COMMAND
    // ------------
    if (command === 'help') {
        try {
            log('INFO', 'Help requested by ' + message.author.tag);
            const answerEmbed = new discord.MessageEmbed()
                .setColor('#241e20')
                .setTitle('W2G-Bot Help')
                .addFields({
                    name: '!w2g',
                    value: `
            Creates a Watch2Gether Room
            You may specify as arguments, in any order:
            **•** A video url, which will be pre-loaded in the room
            **•** An hexadecimal color code for the room background
            **•** A number beetween 0 and 100 for the room opacity \n
            __Example:__
            \`!w2g https://www.youtube.com/watch?v=JOhiWY7XmoY #00ff00 75\`
            This will create a Watch2Gether room with a pre-loaded youtube video and a 75% opaque green background
        `,
                });
            message.channel.send(answerEmbed);
        } catch (error) {
            let detail = {};
            detail.event = 'help';
            detail.authorId = message.author.id;
            detail.authorName = message.author.tag;
            detail.channelType = message.channel.type;
            if (message.channel.type !== 'dm') {
                detail.channelId = message.channel.id;
                detail.channelName = message.channel.name;
                detail.serverId = message.guild.id;
                detail.serverName = message.guild.name;
            }
            log('ERROR', error + '\n' + JSON.stringify(detail, null, 2));
        }
    }

    // W2G COMMAND
    // -----------
    else if (command === 'w2g') {
        let video = null;
        let color = CONST_COLOR;
        let opacity = CONST_OPACITY;

        // setting the max loop number
        let maxLoops = CONST_MAX_CHECK;
        if (args.length < CONST_MAX_CHECK) {
            maxLoops = args.length;
        }

        // arguments check
        for (let i = 0; i < maxLoops; i++) {
            if (typeof args !== 'undefined' && args.length > 0) {
                if (validURL(args[0])) {
                    video = args.shift();
                } else if (validColor(args[0])) {
                    color = args.shift();
                } else if (!isNaN(args[0]) && args[0] >= 0 && args[0] <= 100) {
                    opacity = args.shift();
                }
            }
        }

        // room creation
        axios
            .post('https://api.w2g.tv/rooms/create.json', {
                w2g_api_key: process.env.API_KEY,
                share: video,
                bg_color: color,
                bg_opacity: opacity,
            })
            .then(function (response) {
                const streamKey = response.data.streamkey;
                const videoURL = video ? video : 'No Video';

                log('INFO', 'Room created (' + streamKey + ') by ' + message.author.tag);

                const answerEmbed = new discord.MessageEmbed()
                    .setColor('#face3a')
                    .setTitle('Watch2Gether Room')
                    .setURL('https://api.w2g.tv/rooms/' + streamKey)
                    .attachFiles(['assets/watch2gether-icon.png'])
                    .setThumbnail('attachment://watch2gether-icon.png')
                    .addFields(
                        { name: 'Video', value: videoURL, inline: true },
                        { name: 'Color', value: color, inline: true },
                        { name: 'Opacity', value: opacity, inline: true }
                    )
                    .setFooter(message.author.username, message.author.avatarURL())
                    .setTimestamp();

                message.channel.send(answerEmbed);
                if (message.channel.type !== 'dm') {
                    message.delete();
                }
            })
            .catch(function (error) {
                let detail = {};
                detail.event = 'room';
                detail.video = video;
                detail.color = color;
                detail.opacity = opacity;
                detail.authorId = message.author.id;
                detail.authorName = message.author.tag;
                detail.channelType = message.channel.type;
                if (message.channel.type !== 'dm') {
                    detail.channelId = message.channel.id;
                    detail.channelName = message.channel.name;
                    detail.serverId = message.guild.id;
                    detail.serverName = message.guild.name;
                }
                log('ERROR', error + '\n' + JSON.stringify(detail, null, 2));
            });
    }

    // BORGAR COMMAND
    // --------------
    else if (command === 'borgar') {
        try {
            log('INFO', 'Hamburger requested by ' + message.author.tag);
            message.channel.send(':hamburger:');
        } catch (error) {
            let detail = {};
            detail.event = 'borgar';
            detail.authorId = message.author.id;
            detail.authorName = message.author.tag;
            detail.channelType = message.channel.type;
            if (message.channel.type !== 'dm') {
                detail.channelId = message.channel.id;
                detail.channelName = message.channel.name;
                detail.serverId = message.guild.id;
                detail.serverName = message.guild.name;
            }
            log('ERROR', error + '\n' + JSON.stringify(detail, null, 2));
        }
    }

});


// BOT STARTUP
// -----------
client.login(process.env.BOT_TOKEN);
