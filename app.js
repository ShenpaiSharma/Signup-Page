const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public")); //as our signin.css file is hosted locally on folder 
                                   //so our localhost server can't fetch it so we use this express way to make it acess to server

app.get("/", function(req, res){
	res.sendFile(__dirname +  "/signup.html")
})

app.post("/", function(req,res){
	const First = req.body.fname;
	const Last = req.body.lname;
	const Email = req.body.email;

	const data = {
		members: [
			{
				email_address: Email,
				status: "subscribed",
				merge_fields: {
					FNAME: First,
					LNAME: Last
				}
			}
		]
	};

	const jsonData = JSON.stringify(data);

	const url = "https://us2.api.mailchimp.com/3.0/lists/4341335d90";

	const options = {
		method: "POST",
		auth: "Shenpai_Sharma:169e7e2e8eb9863eb65ce5627b832e3e-us2"
	}

	const request = https.request(url, options, function(response){
		if(response.statusCode === 200){
			res.sendFile(__dirname + "/success.html");
		}
		else{
			res.sendFile(__dirname + "/failure.html");
		}

		response.on("data", function(data){
			//console.log(JSON.parse(data));
		})
	}) 


	request.write(jsonData);
	request.end();

	console.log(First ,Last , Email);
});

app.post("/failure", function(req, res){
	res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
	console.log("The server is setup at port 3000");
})

//api key 169e7e2e8eb9863eb65ce5627b832e3e-us2
//audience id 4341335d90