from rest_framework import permissions

class HasPositiveBalance(permissions.BasePermission):

    message = 'Your balance is negative, pay it to continue traveling!'

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.balance_eur_cent >= 0
