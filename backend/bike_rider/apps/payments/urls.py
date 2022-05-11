from django.urls import path
from .views import CheckoutCreatorViewSet, StripeWebhookAPIView

urlpatterns = [
  path('payments/start/', CheckoutCreatorViewSet.as_view({'post':'create'})),
  path('payments/webhook/', StripeWebhookAPIView.as_view())
]
