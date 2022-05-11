from django.contrib import admin
from .models import Charge, Payment
from django.contrib.admin import ModelAdmin

class PaymentAdmin(ModelAdmin):
    list_display = [f.name for f in Payment._meta.fields]
    list_filter = ()
    fieldsets = (
        ('Payment', {'fields': ('user', 'total_eur_cent','checkout_session_id', 'confirmed', 'created_at')}),
    )
    add_fieldsets = (
        ('Payment', {'fields': ('user', 'total_eur_cent','checkout_session_id', 'confirmed')}),
    )
    search_fields = ('user', 'checkout_session_id',)
    ordering = ('total_eur_cent','user', 'created_at')

class ChargeAdmin(ModelAdmin):
    list_display = [f.name for f in Charge._meta.fields]
    list_filter = ()
    fieldsets = (
        ('Charge', {'fields': ('user', 'total_eur_cent','reason', 'created_at')}),
    )
    add_fieldsets = (
        ('Charge', {'fields': ('user', 'total_eur_cent','reason')}),
    )
    search_fields = ('user', 'reason',)
    ordering = ('total_eur_cent','user', 'created_at')

admin.site.register(Payment, PaymentAdmin)
admin.site.register(Charge, ChargeAdmin)
