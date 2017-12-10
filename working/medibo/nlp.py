'''
================================================================================
||        	                 					  							  ||
||                  	     	 MEDIBO NLP		 						  	  ||
||          	               					  							  ||
================================================================================
This file contains code that receives a piece of text, cleans and parses this 
sentence, processes this sentence and returns a response JSON.

@author: Janak A Jain

'''

tags = ['VBZ','VBG','NNS','NNP','NN','RB','VB','JJ','PRP']


request_words = ['show','tell','see','describe','display','list',\
'modify''change','add','delete','remove','enlist','medications',\
'medication','age','name']

def parse_to_json(doc):
	'''
		This function takes a SpaCy object for a cleaned piece of text 
		(cleaned text = output from 'clean' function of cleaning.py module of 
		the package) and a SpaCy doc object and retuns the parsed JSON object.

		Args: str, obj (SpaCy doc)
		Returns: JSON
	'''

	flag = 0

	resp_json = {'intent':[],
       'targets':[],
        'entities':[]
       }

	for token in doc:
		
		if(token.tag_ in tags):
			
			if(token.tag_ in ['VBZ','VB','VBG']):
				resp_json['intent'].append(token.text)
			
			if(token.tag_ in ['NNP','NN']):
				resp_json['entities'].append(token.text)
		
			resp_json['targets'].append(token.text)

		if(token.text in request_words):
			print("request word detected in NLP")
			flag = 1

	if(flag ==1):
		resp_json['intent'] = 'request'


	return resp_json




