'''
================================================================================
||        	                 					  							  ||
||                  	    		RESPONSE		  					  	  ||
||          	               					  							  ||
================================================================================
This file contains code that creates an approrpiate response from the given
input

@author: Janak A Jain

'''

import json
import pandas as pd
import time


with open('data/messages.json') as messages_data:
	messages = json.load(messages_data)[0]  # This is a dictionary of messages 

with open('data/stories.json') as stories_data:
	stories = json.load(stories_data)[0]  # This is a dictionary of stories


input_keys = ['timestamp','user_id','session_id','tags','targets','intent', \
'text']

user_keys = ['name','age','sex','phone']


def respond(intent = None, targets = None, entities = None, user = None, \
	type = None, title = None):

	resp_text = []
	intent = []
	targets = []

	if(type == "message"):
		intent_m = []
		targets_m = []


		for i in messages.keys():
			m = messages[i]
			if any(i in m["intent"] for i in intent):
				intent_m.append(m)
				intent = set(intent + m["intent"])

		for m in intent_m:
			if any(t in m["targets"] for t in targets):
				targets_m.append(m)
				targets = set(targets.append(m["targets"]))

		print("Intents messages = " + str(intent_m))
		print()
		print("Targets messages = " + str(targets_m))

	elif(type == "story"):
		if(title != None):
			for m_id in stories[title]["messages"]:
				
				# resp_text += "\n\n" + messages[str(m_id)]["text"]
				resp_text.append(messages[str(m_id)]["text"])
				intent.append(stories[title]["return_intent"])
				targets.append(stories[title]["return_targets"])

				intent.append(stories[title]["return_intent"][0])

				intent = list(set(intent))
				# targets = list(set(targets.append(stories[title]["return_targets"])))

				resp = dict.fromkeys(input_keys)

				resp["user_id"] = user["phone"]
				resp["session_id"] = 1           # TODO - change this later
				resp["tags"] = intent + [t for t in targets]
				resp["intent"] = intent
				resp["targets"] = targets
				resp["text"] = resp_text
				resp["timestamp"] = time.time()
	else:
		resp = dict.fromkeys(intput_keys)
		resp["text"] = "No match"


	return resp




respond(user = dict.fromkeys(user_keys), type = "story", title = "first_welcome")