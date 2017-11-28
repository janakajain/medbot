import os
from twilio.rest import Client

account_sid = open('credentials','r').readlines()[0].strip()
auth_token = open('credentials','r').readlines()[1].strip()

client = Client(account_sid, auth_token)

users = {
"Andrew":"+17868777177",
"Jonathan":"+16462150333",
"Minghong": "+19518010312",
"Shengyang": "+18056377924",
"Janak": "+19292088929"
}

# for num in team_numbers.values():
# 	client.messages.create(
# 		to = num,
# 		from_ = "+18162392619 ",
# 		body = "Hello! I am MediBo. Just wanted to say Hi and wanted to check if you are feeling fine today. " 
# 	)


