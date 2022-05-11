from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db.models import Sum

from .models import Payment, Charge
from ..users.models import User

@receiver(post_save, sender=Payment)
def update_user_balance_s_payment(sender, instance, *args, **kwargs):
    if not (instance and instance.confirmed):
        return

    update_user_balance(sender, instance)

@receiver(post_save, sender=Charge)
def update_user_balance_s_payment(sender, instance, *args, **kwargs):
    if not (instance and instance.confirmed):
        return

    update_user_balance(sender, instance)

def update_user_balance(sender, instance):
    sum_payments = Payment.objects.aggregate(Sum('total_eur_cent'))['total_eur_cent__sum']
    sum_charges = Charge.objects.aggregate(Sum('total_eur_cent'))['total_eur_cent__sum']

    sum_payments = sum_payments if sum_payments is not None else 0
    sum_charges = sum_charges if sum_charges is not None else 0

    instance.user.balance_eur_cent = sum_payments - sum_charges
    instance.user.save()
