import random

quotes_data = []
quotes_list = [   #making list of quotes
    "Great job!",
    "You got this!",
    "Genius!!",
    "YAY!!!",
    "Perfect!",
    "Amazing!",
    "Score!!",
    "WOOHOO!!",
    "SLAY",
    "You are amazing!",
    "Woohoo!!",
    "Keep it up!",
    "Fantastic!",
    "AMAZING!!",
    "SO COOL!",
    "YES!",
    "WOAH!",
    "（っ＾▿＾）",
    "ᕙ(`▿´)ᕗ",
]

def initQuotes():
    # setup dictionary with quotes
    item_id = 0
    for item in quotes_list:
        quotes_list.append({"id": item_id, "quote": item})
        item_id += 1

def getQuote():
    return(quotes_data)

# Getting a quote
def getQuote(id):
    return(quotes_data[id])

#Geting a random quote
def getRandomJoke():
    return(random.choice(quotes_data))
