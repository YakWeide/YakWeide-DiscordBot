require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const GUILD_NAME = process.env["GUILD_NAME"];
const LOG_CHANNEL_ID = process.env["CHANNEL_ID"];
let thisGuild = null;
let logChannel = null;
let mostRecentLogs = [];

client.login(process.env["TOKEN"]).then();
client.on('ready', successLogin);
client.on('voiceStateUpdate', logVoiceStateUpdate);
//client.on('guildBanAdd');
//client.on('guildMemberRemove');

async function logVoiceStateUpdate() {
    let logs = [];
    logs[0] = await getLogEntry('MEMBER_MOVE',thisGuild);
    logs[1] = await getLogEntry('MEMBER_DISCONNECT',thisGuild);
    if (logs[0]) {
        if (logs[0].createdTimestamp !== mostRecentLogs[0]) {
            mostRecentLogs[0] = logs[0].createdTimestamp;
            logChannel.send(logs[0].executor.username + ' moved a user to ' + logs[0].extra.channel.name);
        }
    }
    if (logs[1]) {
        if (logs[1].createdTimestamp !== mostRecentLogs[1]) {
            mostRecentLogs[1] = logs[1].createdTimestamp;
            logChannel.send(logs[1].executor.username + ' disconnected a user!');
        }
    }
}

async function successLogin() {
    logChannel = client.channels.cache.find(channel => channel.id === LOG_CHANNEL_ID);
    thisGuild = client.guilds.cache.find(guild => guild.name === GUILD_NAME);
    mostRecentLogs[0] = (await getLogEntry('MEMBER_MOVE', thisGuild)).createdTimestamp;
    mostRecentLogs[1] = (await getLogEntry('MEMBER_DISCONNECT', thisGuild)).createdTimestamp;
    logChannel.send('I´m ready');
}

async function getLogEntry(keyWord,guild) {
    let log = await guild.fetchAuditLogs({limit : 1, type : keyWord});
    const { entries } = log;
    if (log && entries.first())
        return entries.first();
    return null;
}