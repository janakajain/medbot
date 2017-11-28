'''
	============================================================================
	||                         					  							  ||
	||                          NLP CLEANING CODE  							  ||
	||                         					  							  ||					
	============================================================================

This package contains functionalities to clean text message text such as the
following:
1. Breaking the message into individual sentences.
2. Bursting punctuations
3. Spelling correction
4. Expanding short forms

'''


import re



def break_sentence(x):
	'''
		This function takes in a message string and returns a list of individual
		sentences contained in that message.

		Args: str
		Returns: [str]
	'''

	return x.split('.')



def burst_punc(x):
	'''
		This function takes in a string and returns the string obtained after 
		bursting the punctuations.

		Args: str
		Returns: str
	'''

	pattern = re.compile('\w+')

	return r' '.join(pattern.findall(x))



