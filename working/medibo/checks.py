


def is_zip(x):

	flag = ""

	try:
		int(x)
		if(len(x) == 5):
			return True
		else:
			flag = "The zip code should be 5 characters long"
	except ValueError:
		flag = "Please enter a number!"

	return False, flag