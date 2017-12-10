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
from twilio.twiml.messaging_response import Message, MessagingResponse
from twilio.twiml.voice_response import VoiceResponse
from load import *
from response import *
from pprint import pprint
import pandas as pd
from pymetamap import MetaMap
import pickle
import json
import time
import os
from recommend import *
import spacy
from medibo.cleaning import *
from medibo.nlp import *

app = Flask(__name__)
app.config.from_object(__name__)


app.config['SECRET_KEY'] = 'ThisIsNotATest'

data = pd.read_pickle(open('updated_data.pickle', 'rb'))  
# mm = MetaMap.get_instance('/Users/janakajain/Janak/MS-in-Data-Science/Fall-2017/Capstone/public_mm/bin/metamap16')
nlp = spacy.load('en')
symptoms = pd.read_pickle('data/symptoms_data_20_drugs.pickle')



# =======================[ READING DATA FILES ]=================================

users = load_json('users')
messages = load_json('messages')
stories = load_json('stories')




# ===========================[ DECLARATIONS ]===================================

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

user_keys = ['name','age','sex','phone','medication']

leadgen_keys = ["name","age","sex","medication","phone"]

# Set the first set of targets and intent labels

targets = ["welcome","onboarding","register"]
intent = ["hello","description","onboarding","leadgen"]

u_rec = dict.fromkeys(user_keys)  # Create a record for the user

request_add_words = ['add','append','added','appended']
request_view_words = ['view','display','show','see','describe','list','tell']
request_modify_words = ['change','modify','alter','changed','modified',\
'altered']









# ==========================[ MAIN FUNCTION ]===================================


@app.route("/sms", methods = ['GET','POST'])
def sms_reply():

	resp = MessagingResponse()

	
	#--------[Get the current contextual information from global labels]--------

	global timestamp, user_id, session_id, tags, targets, intent, text, u_rec

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

		print(u_rec)

		
		if(u_rec["phone"] == None):
			u_rec["phone"] = from_number
			print("Added phone number to u_rec")


		if("demog" in targets):       # If the targets contain "leadgen"

			if("medication" in targets):
				users[from_number] = u_rec
				users[from_number]["medication"] = [input_text]
				print('\n--- Leadgen complete -----\n')
				print(u_rec)
				with open('data/users.json', 'w') as outfile:
					print("Saving file")
					json.dump(users, outfile)
					print("Saved file")
					# u_rec = dict.fromkeys(user_keys)

			else:
				for target in targets:      # Then iterate over targets and 
						
					if(target in leadgen_keys): # if a target is in leadgen keys
						print('    Found target leadgen : ' + target)
						u_rec[target] = input_text # store the leadgen value in 
												   # in the user record
						print(u_rec)


		
		# Get the response for the given set of labels

		r = respond(user = u_rec, type = "story", targets = \
			targets, intent = intent)


	else: # if the user record exists

		# SOS
		# Request
		# Symptom

		u_rec = users[from_number]

		
		text = " ".join(clean(input_text)[0])
		print("Cleaned text = "  + text)
		text_json = parse_to_json(nlp(text))

		print("Text JSON = ")
		print(str(text_json))

		targets = text_json['targets']
		intent = text_json['intent']
		entities = text_json['entities']

		
		# --------------[ Case: Service request ]-------------------------------
		
		if(intent == ['request']): 

			# Identify which information is this request about

			request_id_flag = 0 # To check if identification is successful

			for info in leadgen_keys:
				
				if(info in targets):
					
					request_id_flag = 1




					#-----------------[ Case: Add request ]---------------------
					
					if(any(t in request_add_words for t in targets)):

						print("add loop entered")

						# If any entity information is present
						if(len(entities) > 0):

							print("inner add loop entered")

							users[from_number][info] += [e.lower() for e \
							in entities]

							users[from_number][info] = list\
							(set(users[from_number][info]))

							with open('data/users.json', 'w') as outfile:
								print("Saving file")
								json.dump(users, outfile)
								print("Saved file")

							r = respond(intent = "confirmation",
								targets = ["add","request","successful"],
								user = users[from_number],
								type = "message",
								embed_key = info)

							print(users[from_number])
							print(r)



						else:
							# Send confusion message
							r = {}
							r["text"] = "Confusion message"
							print("confusion message - add")

							r = respond(intent = "confusion",
								targets = ["request","confusion"],
								user = users[from_number],
								type = "message")




					#--------------[ Case: Modify request ]---------------------

					elif(any(t in request_modify_words for t in targets)):

						# If any entity information is present
						if(len(entities) > 0):
							users[from_number][info] = entities
						else:
							# Send confusion message
							r["text"] = "Confusion message"
							print("confusion message - modify")

							r = respond(intent = "confusion",
								targets = ["request","confusion"],
								user = users[from_number],
								type = "message")






					#-----------[ Case: View request ]--------------------------

					elif(any(t.lower() in request_view_words for t in targets)):

						# If any entity information is present
						if(any(t.lower() in leadgen_keys for t in targets)):

							entities  = [t for t in targets if t in leadgen_keys]

							# Show the relevant information

							print("show relevant information")

							r = respond(type="message",
								intent = intent,
								targets = targets,
								user = users[from_number],
								entities = entities
								)

							print("Entities = ")
							print(entities)
							print("Record to be shown: ")
							print(users[from_number][entities[0]])

							if(type(users[from_number][entities[0]]) == list):
								show_rec = "\n".join(users[from_number][entities[0]])
							else:
								show_rec = users[from_number][entities[0]]

							r["text"].append(show_rec)


						else:
							# Send confusion message
							# r["text"] = "Confusion message"
							print("confusion message - view")

							r = respond(intent = "confusion",
								targets = ["request","confusion"],
								user = users[from_number],
								type = "message")

			if(request_id_flag == 0): # Request info target not identified
				
				print("Unconventional request identified")

				# r["text"] = "Unsuccessul identification of request target"

				r = respond(user = users[from_number],
					intent = intent,
					targets = targets,
					entities=entities,
					type="message")

		

		# ----------------[ Case: Symptom addressal ]---------------------------

		elif(intent == ['symptom']):
			print("Symptom addressal")
			# r = {}
			# r["text"] = "Symptom addressal"

			print(symptoms.columns)

			symp_df = symptoms[symptoms['drug'].isin(users[from_number]\
				["medication"])]

			print("User's current medication on record = " + str(users[from_number]["medication"]))


			if(symp_df.shape[0] > 0):

				print("Symp_df len > 0 ")

				df = symp_df[symp_df['targets'].\
				apply(lambda x: any(t in targets for t in x))].\
				sort_values('flag',ascending = False)

				num_matches = df.shape[0]

				print("Number of matches = " + str(num_matches))

				dfx = df.head(1).iloc[0]

				print(dfx)

				advise = {
				"noneed" : " it is not something to worry about. Give it some time and let me know if you have any new symptoms. I'm right here if you need me.",
				"doctor" : " I think you should visit your doctor as soon as possible.",
				"emergency": " you need to go to the ER immediately."
				}

				resp_text = ["Based on your current medication involving use of " + \
				dfx['drug'] + ", " + dfx["symptom"] + " is/are " + \
				dfx["severity_desc"] + " " + dfx["connector"] + \
				advise[dfx["action"]]]

				print("Response text for symptom = ")
				print(resp_text)

				r = respond(intent = intent, targets = targets, \
					user = users[from_number], text = resp_text,
					type = "symptom")
			else:
				resp_text = ["I am sorry. I don't have a record of symptoms for your current medication"]
				r = respond(intent = intent, targets = targets, \
					user = users[from_number], text = resp_text,
					type = intent)
			




		else:

			print(" Else loop ")
			# resp_text = ["I am sorry. I don't have a record of symptoms for your current medication"]
			r = respond(intent = intent, targets = targets, \
					user = users[from_number],
					type = "message")


	
	print("R = ")
	pprint(r)


		# lookup_names, triggers = get_umls_concepts(input_text, mm)
		# print('RESULTS')
		# print(recommend(data, ['betaxolol'],lookup_names, triggers ))



	# ==========[ TAKE ACTION BASED ON THE GENERATED RESPONSE JSON ]============

	if(r == None):
		print("None response")


	# Update the labels

	intent = r["return_intent"]
	targets = r["return_targets"]
	tags = r["tags"]

	print("---- Updated labels -----")
	print("Intent = " + str(intent))
	print("Targets = " + str(targets))

	# print("u_rec now is : ")
	# print(str(u_rec))

		
	if(r["text"] != None):
		for sms in r["text"]:
			if(len(r["embed"]) > 0):
				resp.message(str(sms%tuple([str(u_rec[i]) for i in r["embed"]])))
			else:
				resp.message(sms)
	else:
		resp.message("There seems to be some \
			error. \n\n Sorry for the inconvenience")


		targets, intent, entities, tags = [],[],[],[]

	# print("Last step variables")
	# print("targets = ")
	# print(targets)
	# print("intent = ")
	# print(intent)


	return str(resp)




	








if __name__ == "__main__":
	 app.run(debug = True)