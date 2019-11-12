const express = require('express');
const bodyParser = require('body-parser');

const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

var salt = bcrypt.genSaltSync(saltRounds);
var hash = bcrypt.hashSync(myPlaintextPassword, salt);


const app = express();
app.use(bodyParser.json());

const database = {
	users: [
	{
		id:'123',
		name: 'John',
		email: 'john@gmail.com',
		entries: 0,
		joined: new Date()
	},
	{
		id:'125',
		name: 'Sally',
		email: 'sally@gmail.com',
		entries: 0,
		joined: new Date()
	}
	],
	login: [
		{
			id:'987',
			hash:'',
			email:'john@gmail.com'
		}
	]
}

app.get('/', (req, res)=>{
	res.send(database.users);
})

app.post('/signin', (req, res) => {

	// Load hash from your password DB.
	bcrypt.compare(myPlaintextPassword, hash, function(err, res) {
	    // res == true
	});
	bcrypt.compare(someOtherPlaintextPassword, hash, function(err, res) {
	    // res == false
	});
	if (req.body.email===database.users[0].email && req.body.password===database.users[0].password){
		res.json('success');
	}else{
		res.status(400).json('error logging in');
	}
})

app.post('/register', (req,res) => {
	const {email,name,password} = req.body;
	
	bcrypt.hash(password, saltRounds, function(err, hash) {
  	// Store hash in your password DB.	
  		console.log(hash);
	});

	database.users.push({
		id:'122',
		name: name,
		email: email,
		password: password,
		entries: 0,
		joined: new Date()
	})
	res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req, res) =>{
	const { id } = req.params;
	let found = false;
	database.users.forEach(user => {
		if(user.id === id){
			found = true;
			return res.json(user);
		
		}
	})
	if(!found){
		res.status(400).json('not found');
	}
})

app.post('/image' ,(req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach(user => {
		if(user.id === id){
			found = true;
			user.entries++;
			return res.json(user.entries);
		
		}
	})
	if(!found){
		res.status(400).json('not found');
	}
})

app.listen(3000, ()=>{
	console.log('app is running on port 3000');
});


/*
/-->res=this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*/ 