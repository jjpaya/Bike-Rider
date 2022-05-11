from django.db import models
from bike_rider.apps.users.models import User

class Payment(models.Model):
    user = models.ForeignKey(User, null=True, related_name="payment", on_delete=models.SET_NULL)
    total_eur_cent = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    checkout_session_id = models.CharField(max_length=128, null=False, unique=True)
    confirmed = models.BooleanField(default=False)

class Charge(models.Model):
    user = models.ForeignKey(User, null=True, related_name="charge", on_delete=models.SET_NULL)
    total_eur_cent = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    reason = models.CharField(max_length=24, null=False)
