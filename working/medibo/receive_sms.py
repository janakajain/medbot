import os
from flask import Flask, request, redirect, session
from twilio.twiml.messaging_response import MessagingResponse
from twilio.twiml.voice_response import VoiceResponse
import json


app = Flask(__name__)


with open('data/users.json') as users_data:
    users = json.load(users_data)[0]  # This is a dictionary of users indexed
    								  # by their phone numbers


flag = 0



@app.route("/sms", methods = ['GET','POST'])
def sms_reply():

	counter = session.get('counter', 0)
	counter += 1


	from_number = request.values.get('From', None)
	human = users[from_number]["name"] if from_number in users else None
	print("\n\nTalking to " + str(human))

	if(human == None):  # A record for this user doesn't exist
		print("Talking to someone new")
		resp = onboard(from_number)
	else:

		resp = MessagingResponse()
		resp.message("Hi " + human + "! How are you feeling today?")

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