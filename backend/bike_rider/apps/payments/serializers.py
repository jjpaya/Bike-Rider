
from django.conf import settings
from rest_framework import serializers, exceptions

class CheckoutCreatorSerializer(serializers.Serializer):
    total_eur_cent = serializers.IntegerField()
