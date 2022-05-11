from django.apps import AppConfig
from django.conf import settings
import stripe

class PaymentsConfig(AppConfig):
    name = 'bike_rider.apps.payments'
    def ready(self):
        import bike_rider.apps.payments.signals
        stripe.api_key = settings.STRIPE_PRIVATE_KEY
