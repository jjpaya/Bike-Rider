import stripe
from django.conf import settings
from .models import Payment

def fulfill_order(checkout_session):
    meta=checkout_session['metadata']
    Payment.objects.create(
        user_id=int(meta['user']),
        checkout_session_id=checkout_session['id'],
        confirmed=True,
        total_eur_cent=checkout_session['amount_total']
    )


def create_checkout_session_user_balance_buy(total_eur_cent, user):
    domain_url = settings.DOMAIN_URL

    return stripe.checkout.Session.create(
        success_url=domain_url + '/payment?ok=true&sid={CHECKOUT_SESSION_ID}',
        cancel_url=domain_url + '/payment?ok=false',
        payment_method_types=['card'],
        mode='payment',
        customer_email=user.email,
        line_items=[{
            'price_data': {
                'currency': 'EUR',
                'product_data': {
                    'name': 'BikeRider Balance'
                },
                'unit_amount': int(total_eur_cent)
            },
            'quantity': 1
        }],
        metadata={
            'user': user.id
        }
    )
