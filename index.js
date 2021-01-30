const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client();
const login = client.login(process.env["TOKEN"]);
let logChannel = null;
let mostRecentLogs = [];
client.on('ready', successLogin);
client.on('message', message => {
    const { content, author } = message;

    if (content.startsWith('dc ')) {
        let mem = message.mentions.members.first();
        if (mem !== null) {
            if (mem.voice.channel !== null) {
                mem.voice.kick();
                logChannel.send(client.user.username + ' disconnected ' + mem.user.username + ' from channel ' + mem.voice.channel.name);
            }
        }
    }
    else if(content.startsWith('kick ')){

    }
    else if(content.startsWith('hey Bot')){
        for (let i = 0; i < 4; i++) {
            console.log(i + '---------------');
            console.log(mostRecentLogs[i]);
        }
           message.reply('hello human');
    }
    else {
        if (author.id !== client.user.id) {
            console.log(content);
        }
    }
});

client.on('voiceStateUpdate', async voiceStateUpdate => {
    const { guild } = voiceStateUpdate;
    const logDC = await guild.fetchAuditLogs({limit : 1, type : 'MEMBER_DISCONNECT'});
    const logM = await guild.fetchAuditLogs({limit : 1, type : 'MEMBER_MOVE'});

    const { entries } = logs;
    const { executor , target , action} = entries.first();
    console.log(entries.first().createdTimestamp);
            if (action === 'MEMBER_DISCONNECT') {
                logChannel.send(executor.username + ' disconnected ' + target.username + ' from channel ' + target.voice.channel.name);
            }
            if (action === 'MEMBER_KICK') {
                logChannel.send(executor.username + ' kicked ' + target.username);
            }
    });

function successLogin() {
    logChannel = client.channels.cache.find(channel => channel.id === '802529506132492288');
    const test = client.guilds.cache.find(guild => guild.name === 'yekBotTest');
    getLog("MEMBER_MOVE", test,0);
    getLog("MEMBER_DISCONNECT", test,1);
    getLog("MEMBER_KICK", test,2);
    getLog("MEMBER_BAN_ADD", test,3);
    console.log('logged in');
}

async function getLog(keyWord,guild,index) {
    let log = await guild.fetchAuditLogs({limit : 1, type : keyWord});
    const { entries } = log;
    if (log && entries.first()) {
        let value = entries.first().createdTimestamp;
        mostRecentLogs[index] = value;
    }
}
