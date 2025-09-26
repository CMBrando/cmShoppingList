"""Models."""

from django.db import models


class General(models.Model):
    """A meta model for app permissions."""

    class Meta:
        managed = False
        default_permissions = ()
        permissions = [
                ("basic_access", "Can access application")
        ]
        verbose_name = ("cmShoppingList")

class MarketType(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=200)

    class Meta:
        default_permissions = ()


        