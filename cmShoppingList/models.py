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

class ItemEquivalence(models.Model):
    """Maps EVE SDE item type IDs to interchangeable item type IDs."""

    original_item_id = models.BigIntegerField(db_column="original_item_id")
    equivalent_item_id = models.BigIntegerField(db_column="equivalent_item_id")

    class Meta:
        default_permissions = ()
        unique_together = ("original_item_id", "equivalent_item_id")


