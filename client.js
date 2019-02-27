var io = require('socket.io-client')
var rp = require('request-promise');
var cheerio = require('cheerio');

var _ = require("underscore");
var uuid = require('uuid')

var Promise = require("bluebird");
var processId = process.argv[2];
/*
 * This is the jar (like a cookie container) we will use always
 */





var user_arr = [
				'20674232-9369-40ef-a366-aee1071c184f',
				'9bdfa159-5247-4557-8416-d80cafdad886'];
//单页面admin api TOKEN
var admin_tokens =[];

var asset_arr = [
				{ip:'192.168.1.136',id:'118c826c864f4b8cbe3635e307fd7f04'},
				{ip:'192.168.1.232',id:'29e599253287448bbcdb490dd19aed04'},
				{ip:'192.168.1.234',id:'e3fe078763e5407589312085dd9054cc'},
				// {ip:'192.168.1.245',id:'fa9977f1-2540-4578-9e0a-fd1b7f8076b0'},
				{ip:'192.168.1.240',id:'0127ec8786014c76996c1a312ab74081'},
				{ip:'192.168.1.231',id:'451f4250-247c-411b-8f7a-dbc124d95266'}
				
				
				// 'fa9977f1254045789e0afd1b7f8076b0',
				// '454b50b4c17c4d069711a10ebbdc6251',
				// 'b344d4980aef4e2d8624591d4fc66bfe',
				// '42f3453d1f694949ae2b7e66623a064d',
				// '5371a2395c25432a958eac64983ab28b'
				]


var userAndPass = [
				{username:'testuser',password:'Calong@2015'},
				{username:'testuser2',password:'Calong@2015'},
				{username:'testuser3',password:'Calong@2015'}
				]



var command_list = ['ping 192.168.1.1',
					'top',
					'pwd',
					'history',
					'pwd',
					"tail /var/log/dmesg", 
					"echo hello world"]


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function randomuser(){
	
	var index = getRandomInt(user_arr.length)
	return user_arr[index]
}

function randomasset(){
	var index = getRandomInt(asset_arr.length)
	return asset_arr[index]
}

function randomCmd(){
	var index = getRandomInt(command_list.length)
	return command_list[index]
}


function admin_param(){
	var options = {
		    method: 'POST',
		    url: 'http://192.168.1.74:8088/api/users/v1/auth/',
		  	headers: {
		  		'Content-Type': 'application/json'
			},
		  	body: {
			 "username": 'admin',
			 "password": 'admin'
			},
		    json: true // Automatically stringifies the body to JSON
		};
	
		return options;
}

function getWsOption(){
	var admin_token = admin_tokens[0];
	var asset = randomasset()
	console.log('will connect to :'+asset.ip)
	console.log('will connect to :'+asset.id)
	var auth = 'Bearer ' + admin_token.token;
	var options = {
		method: 'POST',
		url: 'http://192.168.1.74:8088/api/users/v1/connection-token/',
	  	headers: {
	      	'Authorization': auth,
	      	'Content-Type': 'application/json'
    	},
	  	body: {
			 "user": randomuser(),
			 "asset": asset.id,
		  	"system_user": "4fee5d8d-49b7-47ca-a939-6a890f95edf7"
		},
		json: true // Automatically stringifies the body to JSON
	}
	return options;
}

var initUserP = function() {
    return new Promise(function (resolve, reject) {
    	
		rp(admin_param())
		.then(function (body) {
			var user = {token:null,user:{}};

			user.token = body.token;
			user.user = body.user;

			admin_tokens.push(user)
			
		})
		.then(function(){
			resolve(true)
		})	
	});
}




// var promiseList = [];
// for (var i = 0; i < userAndPass.length; i++) {
//     	promiseList.push(initUserP());
// 	}
console.log('------init admin token start--------')
initUserP()
.then(function(){
	console.log('------init admin token finish--------')
	console.log('------create ws option start--------')
	return getWsOption();

})
.then(function(ops){
	console.log('------create ws option finish--------')
	console.log(ops)
	console.log('------get singel page token start--------')
	rp(ops)
	.then(function (body) {
		console.log(body)
	console.log('------get singel page token finish--------')
	return body.token

	})
	.then(function(token){
		console.log(token)
		const socket = io('ws://192.168.1.74:8088/ssh', {
			  path: '/socket.io'
			}
		);

		var room = null;
		var count = 0;

		socket.on('connect', function(){
			console.log('connect to jms')
			
		socket.emit("token",{
			        'token': token, 'secret': uuid.v4(),
			        'size': [100, 140]
			      });
		var tick = setInterval(function(){

			if(room !=null){
				
				if(count<6){
				console.log('wait to connect :')

				}else{
				
				// var processId = 1;
				var cmd = randomCmd()
				// console.log( "process :" + processId + ' send cmd :' + cmd)

				socket.emit("data",{
			        'room': room,
			        'data': '\x03\x0d'
			      });

				socket.emit("data",{
			        'room': room,
			        'data': cmd
			      });
				socket.emit("data",{
			        'room': room,
			        'data': '\x0d'
			      });
				
				}
				
			}else{
				console.log('room is  null ')
				
			}
		},10000);

		

		});

		socket.on('data',function(data){
			
			count++;
			var newroom = data['room'];

			if(room != newroom)
				room = newroom
		})

		socket.on('disconnect',function(){
			console.log('disconnect to jms')
			
		})

	})
})





var auth = function(){

}

var sendmessage = function(){

}