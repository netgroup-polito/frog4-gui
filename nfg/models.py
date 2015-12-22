from __future__ import unicode_literals

from django.db import models

# Create your models here.

class User(models.Model):
	username = models.CharField(max_length=200)
	password = models.CharField(max_length=200)

	def get_username(self):
		return self.username

	def get_password(self):
		return self.password

