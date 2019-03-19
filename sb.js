const SteamUser = require('steam-user');
const Steam = require('steam');
const SteamTotp = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require('steam-tradeoffer-manager');
const config = require('./config.json');

const steamClient = new Steam.SteamClient();
const client = new SteamUser();
const community = new SteamCommunity();
const steamFriends = new Steam.SteamFriends(steamClient);
const manager = new TradeOfferManager({
	steam: client,
	community: community,
	language: 'en'
});

const logOnOptions = {
	accountName: config.username,
	password: config.password,
	twoFactorCode: SteamTotp.generateAuthCode(config.sharedSecret)
};

client.logOn(logOnOptions);

client.on('loggedOn', () => {
	console.log('Telah login ke steam');
	
	client.setPersona(SteamUser.Steam.EPersonaState.Online, config.botName);
	client.gamesPlayed('Accepting Donation');
});
	
client.on('webSession', (sessionid, cookies) => {
	manager.setCookies(cookies);

	community.setCookies(cookies);
	community.startConfirmationChecker(10000, config.sharedSecret);
});

manager.on('newOffer', (offer) => {
	if (offer.itemsToGive.length = offer.itemToGet.length ) {
		offer.accept((err, status) => {
			if (err) {
				console.log(err);
			} else {
				console.log(`1:1`);
			}
		});
	} else {
		offer.decline((err) => {
			if (err) {
				console.log(err);
			} else {
				console.log('error!');
			}
		});
	}
});

client.on('friendRelationship', (steamid, relationship) => {
    if (relationship === 2) {
        client.addFriend(steamid);
        client.chatMessage(steamid, 'Hai! Terimakasih telah meng-add bot ini, ketik !help untuk melihat commands');
    }
});

steamFriends.on('message', function(source, message, type, chatter) {
     console.log('Received message: ' + message);
          if (message == '!help') {
            steamFriends.sendMessage(source, 'Command yang tersedia : !ping, !owner', Steam.EChatEntryType.ChatMsg); 
          }
        });

steamFriends.on('message', function(source, message, type, chatter) {
  console.log('Received message: ' + message);
  if (message == '!owner') {
    steamFriends.sendMessage(source, 'Hai, saya tiwa, saya dibuat dengan bahasa Node.Js, pembuat saya adalah : steamcommunity.com/id/alandtiwa. ', Steam.EChatEntryType.ChatMsg); // ChatMsg by default
  }
});