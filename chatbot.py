from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer

my_bot = ChatBot(name = 'PyBot', read_only=True, logic_adapters=['chatterbot.logic.MathematicalEvaluation','chatterbot.logic.BestMatch'])
my_bot.get_response("Do you want to ")

my_bot.get_response("Type the website you want to bookmark: ")

converstation = ['']

