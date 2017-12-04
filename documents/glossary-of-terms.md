# Glossary of terms

In order to understand the working and structure of the chatbot, it is important to understand some basic terms that define the experience and several components contained within this experience. These have collectively been termed as “elements” of the chatbot. We have provided a details walkthrough through these elements below:

### User  
A user is any human who consumes the experience of the product MediBo. Specifically, a user can be a medical practitioner, a patient or even a pharmacist.

### Chatbot  
The artificially intelligent computer program that communicates with the users through SMS channel.

###Thread  
A conversation thread (or simply a ‘thread’) is composed of one or more interactions between the user and the chatbot in a contiguous unit of time. A thread is composed of several elements such as messages, stories etc.

###Message  
A message is delivered as a “bubble” on the screen of the user and essentially contains some text. It also contains metadata such as intent, targets, return_intent, return_targets, tags etc.  

### Story  
A story is a message or collection of messages that delivers a specific piece of dialogue. Example: A story titled “welcome” serving three messages each targeting one of the following steps:  
 * Greeting - greeting the user and welcoming
 * Introduction - introducing the chatbot service
 * Onboarding - signaling the beginning of onboarding.  

### Intent  
Intent can be defined as the purpose of a message or a story. A special form of intent is return_intent which is a pre-emptive attempt to set the context labels to inform the chatbot in advance about the anticipated intent of the response.  

### Target  
A target can be defined as the specific elements of a message or context that the message intends to serve. Example: A message asking for the user’s age would have “age” in the targets list of the message. A special form of targets is return_targets which is a pre-emptive attempt to set the context labels to inform the chatbot in advance about the anticipated targets of the response.  

### Tags
Tags are essentially a union set of intents and targets and can be used for look-up of messages and stories.  
