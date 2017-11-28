import os
from flask import Flask, request, redirect, session
from twilio.twiml.messaging_response import MessagingResponse
from twilio.twiml.voice_response import VoiceResponse
import json
import time

app = Flask(__name__)
app.config.from_object(__name__)



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

	timestamp = time.time()
	counter = session.get('counter', 0)
	input_text = request.values.get('Body', None)
	from_number = request.values.get('From', None)


	output = []
	resp = MessagingResponse()


	counter += 1
	session['counter'] = counter

	human = users[from_number]["name"] if from_number in users else None
	print("\n\nTalking to " + str(human))

	input_data = dict.fromkeys(input_keys)

	print("Counter = " + str(counter))


	if(counter == 1): # If this is the first session
	    output += [messages[str(_id)]["text"] for _id in stories["welcome"]["messages"]]

	if(human == None):  # A record for this user doesn't exist
	    
	    output += onboard(from_number)
	else:
	    resp.message("Hi " + human + "! How are you feeling today?")

	for i in range(len(output)):
	    resp.message(output[i])

	output = [] # Empty the output pipeline

	return str(resp)



@app.route("/sms", methods = ['GET','POST'])
def onboard(from_number):

	print('-- ONBOARDING --')

	resp = MessagingResponse()
	resp.message("Hi! Let's get to know you first. They call me MediBo. "\
		"What is your name?")

	flag = 1

	return str(resp)





if __name__ == "__main__":
	 app.run(debug = True)