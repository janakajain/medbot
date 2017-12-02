'''
================================================================================
||        	                 					  							  ||
||                  	      MEDIBO RECEIVE SMS  						  	  ||
||          	               					  							  ||
================================================================================
This file contains code that receives the SMSs sent to Medibo from mobile
phones. The various steps include:
1. Extracting contextual information about the user and based on the user 
   status, either begin onboarding or begin a new conversation.
2. Process the input text to identify the correct labels such as intent, 
   targets, tags etc.
3. Send this processed response to the classification engine to classify this
   text and send the correct response for this input.
4. Receive the suggested response and send this response back to the user.
5. Log this conversation accordingly.

@author: Janak A Jain

'''


from flask import Flask, request, redirect, session
from twilio.twiml.messaging_response import MessagingResponse
from twilio.twiml.voice_response import VoiceResponse
from load import *
from response import *
import json
import time
import os

app = Flask(__name__)
app.config.from_object(__name__)


app.config['SECRET_KEY'] = 'ThisIsNotATest'



# =======================[ READING DATA FILES ]=================================

users = load_json('users')
messages = load_json('messages')
stories = load_json('stories')




# ======================[ DECLARING CODE LABELS ]===============================

# These flags hold sesssion level contextual information

timestamp = 0
user_id = 0
session_id = 0
tags = []
targets = []
intent = []
text = ''


# The input keys are used to create an empty dictionary of processed input 
# structure.
input_keys = ['timestamp','user_id','session_id','tags','targets','intent', \
'text']

user_keys = ['name','age','sex','phone']

resp = MessagingResponse()



@app.route("/sms", methods = ['GET','POST'])
def sms_reply():

	
	#--------[Get the current contextual information from global labels]--------

	global timestamp, user_id, session_id, tags, targets, intent, text

	timestamp = time.time()
	counter = session.get('counter', 0)
	input_text = request.values.get('Body', None)
	from_number = request.values.get('From', None)

	print("User input =  " + input_text)



	#----------[Identify if the user is a new user or an existing user]---------

	if(from_number in users.keys()):
		if("name" in users[from_number].keys()):
			human = users[from_number]["name"]
		else:
			human = None
	else:
		human = None


	#-------------[Take the required action based on the user type]-------------

	if(from_number not in users.keys()):  # If the user is a new user
		u_rec = dict.fromkeys(user_keys)  # Create a record for the user

		r = respond(user = u_rec, type = "story", title = "first_welcome")

		resp.message(r["text"])

		return str(resp)




	output = []
	


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
			
	else:
		output = ["Known user"]







if __name__ == "__main__":
	 app.run(debug = True)