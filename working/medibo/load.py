'''
================================================================================
||        	                 					  							  ||
||                  	      		LOAD		  						  	  ||
||          	               					  							  ||
================================================================================
This file contains code that loads a data file by a given name passed as an 
argument. Returns the loaded JSON file if the file exists or None otherwise.

@author: Janak A Jain

'''

import json

def load_json(file=None):

	if(file == None):
		return None
	elif(file=='users'):
		with open('data/'+file+'.json') as f:
			file = json.load(f)
	else:
		with open('data/'+file+'.json') as f:
			file = json.load(f)[0]

	return file

