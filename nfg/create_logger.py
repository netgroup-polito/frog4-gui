import logging

class MyLogger(object):
	def __init__(self,nome_file,nome_application):
		self.logger = logging.getLogger(nome_application)
		self.logger.setLevel(logging.DEBUG)

		self.fh = logging.FileHandler('logfile.log')
		self.fh.setLevel(logging.DEBUG)

		self.ch = logging.StreamHandler()
		self.ch.setLevel(logging.DEBUG)

		self.formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

		self.fh.setFormatter(self.formatter)
		self.ch.setFormatter(self.formatter)
		
		self.logger.addHandler(self.fh)
		self.logger.addHandler(self.ch)

	def getMyLogger(self):
		return self.logger



