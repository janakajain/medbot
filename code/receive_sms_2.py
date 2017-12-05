import os
from flask import Flask, request, redirect, session
from twilio.twiml.messaging_response import MessagingResponse
from twilio.twiml.voice_response import VoiceResponse
import json
import time

app = Flask(__name__)
app.config.from_object(__name__)

# SECRET_KEY = 'medibo'

app.config['SECRET_KEY'] = 'medibo'



# =======================[ READING DATA FILES ]=================================

with open('data/users.json') as users_data:
	users = json.load(users_data)[0]  # This is a dictionary of users indexed
									  # by their phone numbers

with open('data/messages.json') as messages_data:
	messages = json.load(messages_data)[0]  # This is a dictionary of messages 

with open('data/stories.json') as stories_data:
	stories = json.load(stories_data)[0]  # This is a dictionary of stories



# ======================[ DECLARING CODE FLAGS ]================================

# These flags hold sesssion level contextual information

flag = 0



input_keys = ['timestamp','user_id','session_id','tags','targets','intent', \
'text']





@app.route("/sms", methods = ['GET','POST'])
def sms_reply():

	global flag

	timestamp = time.time()
	counter = session.get('counter', 0)
	input_text = request.values.get('Body', None)
	from_number = request.values.get('From', None)

	# human = users[from_number]["name"] if users[from_number] != 0 else None

	if(from_number in users.keys()):
		if("name" in users[from_number].keys()):
			human = users[from_number]["name"]
		else:
			human = None
	else:
		human = None

	if(from_number not in users.keys()):
		users[from_number] = {}

	print("User input =  " + input_text)


	output = []
	resp = MessagingResponse()


	if("counter" in users[from_number].keys()):
		users[from_number]["counter"] += 1
	else:
		users[from_number]["counter"] = 1
	
	session['counter'] = users[from_number]["counter"]


	
	print("\n\nTalking to " + str(human))

	input_data = dict.fromkeys(input_keys)

	print("Counter = " + str(users[from_number]["counter"]))


	
	if(human == None):  # A record for this user doesn't exist 
		if(users[from_number]["counter"] == 1): # and if this is the first session
			print('First session for number : ' + from_number)
			users[from_number]["phone"] = from_number
			output += [messages[str(_id)]["text"] for _id in stories["welcome"]["messages"]]
			output.append(onboard(from_number))
			flag = 'name'

			resp.message(str(output))
			print("Output = " + str(output))

			output = []
			
			return(str(resp))
	else: 
		resp.message("Hi " + human + "! How are you feeling today?")

	if(flag == 'name'):
		print("User's name is : " + input_text)
		users[from_number]["name"] = input_text
		flag = 'age'
		output = 'Nice to meet you ' + input_text + '. How old are you?'
		resp.message(' '.join(output))
		output = []
		return str(resp)

	if(flag == 'age'):
		print("User's age is : " + input_text)
		users[from_number]["age"] = input_text
		flag = 'sex'
		output = 'Got it. If I may ask, which gender do you identify with ' + users[from_number]["name"] + '?'
		resp.message(' '.join(output))
		output = []
		return str(resp)

	if(flag == 'sex'):
		print("User's gender is : " + input_text)
		users[from_number]["sex"] = input_text
		flag = 1


	if(flag == 1):
		print("Onboarding complete")
		print(" User information is \n\n" + str(users[from_number]))

	return "OK"







# @app.route("/sms", methods = ['GET','POST'])
def onboard(from_number):

	print('-- ONBOARDING --')

	global flag

	# resp = MessagingResponse()
	# resp.message("Hi! Let's get to know you first. They call me MediBo. "\
	# 	"What is your name?")

	resp = "Let's get to know you first. They call me MediBo. "\
		"What is your name?"

	# flag = 'name'

	return str(resp)





if __name__ == "__main__":
	 app.run(debug = True)