'''
================================================================================
||                         					  								  ||
||                         	 NLP CLEANING CODE  							  ||
||                         					  								  ||
================================================================================

This package contains functionalities to clean text message text such as the
following:
1. Breaking the message into individual sentences.
2. Bursting punctuations
3. Spelling correction
4. Expanding short forms


@author: Janak A Jain

'''


import re
from autocorrect import spell



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


def spell_check(x):
	'''
		This function takes in a word, checks it for spelling mistake and
		returns the corrected spelling of the word.

		Args: str
		Returns: str
	'''

	return spell(x)


def clean(x):
	'''
		This function takes the open text message string and returns the cleaned
		list of individual sentences in the message after the following 
		processing steps:
		1. Breaking the message into individual sentences.
		2. Bursting punctuations
		3. Spelling correction
		4. Expanding short forms

		Args: str
		Returns: str
	'''
	return [[spell_check(w) for w in burst_punc(s).split(' ')] \
	for s in x.split('.')]
	






