from rest_framework import viewsets, views, mixins, status
from rest_framework.views import Response
from .utils import create_checkout_session_user_balance_buy, fulfill_order
from .serializers import CheckoutCreatorSerializer
import stripe
from django.conf import settings
from pathlib import Path

from rest_framework.permissions import IsAuthenticated

class CheckoutCreatorViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CheckoutCreatorSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            checkout_session = create_checkout_session_user_balance_buy(serializer.data['total_eur_cent'], request.user)

            return Response({'sessionId': checkout_session['id']})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class StripeWebhookAPIView(views.APIView):

    def post(self, request, format=None):
        if settings.STRIPE_ENDPOINT_SECRET is None:
            settings.STRIPE_ENDPOINT_SECRET = Path('/private/stripe_webhook/stripe_wh.key').read_text().rstrip('\n ')

        ep_secret = settings.STRIPE_ENDPOINT_SECRET
        sig_header = request.META['HTTP_STRIPE_SIGNATURE']
        event = None

        try:
            event = stripe.Webhook.construct_event(
                request.body, sig_header, ep_secret
            )
        except ValueError as e:
            # Invalid payload
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError as e:
            # Invalid signature
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if event['type'] == 'checkout.session.completed':
            fulfill_order(event['data']['object'])

        return Response()
