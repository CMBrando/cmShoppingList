"""Build item substitutions from the installed EVE SDE data."""

from collections import defaultdict

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from eve_sde.models import ItemType, TypeDogma

from cmShoppingList.models import ItemEquivalence


class Command(BaseCommand):
    help = "Rebuild item equivalences from django-eveonline-sde"

    def handle(self, *args, **kwargs):
        market_types = list(
            ItemType.objects.filter(published=True, market_group__isnull=False)
            .exclude(variation_parent_type_id__isnull=True)
            .exclude(variation_parent_type_id=0)
            .values_list("id", "variation_parent_type_id")
        )
        if not market_types:
            raise CommandError("No market item types found. Run esde_load_sde first.")
        if not TypeDogma.objects.exists():
            raise CommandError("No type dogma found. Run esde_load_sde first.")

        dogma_by_type = defaultdict(list)
        dogma = TypeDogma.objects.filter(
            item_type__published=True,
            item_type__market_group__isnull=False,
            item_type__variation_parent_type_id__isnull=False,
        ).exclude(item_type__variation_parent_type_id=0).values_list(
            "item_type_id", "dogma_attribute_id", "value"
        )
        for type_id, attribute_id, value in dogma.iterator(chunk_size=5000):
            dogma_by_type[type_id].append((attribute_id, value))

        groups = defaultdict(list)
        for type_id, parent_id in market_types:
            attributes = dogma_by_type.get(type_id)
            if attributes:
                groups[(parent_id, tuple(sorted(attributes)))].append(type_id)

        equivalents = []
        for group in groups.values():
            for original_id in group:
                for equivalent_id in group:
                    if original_id != equivalent_id:
                        equivalents.append(
                            ItemEquivalence(
                                original_item_id=original_id,
                                equivalent_item_id=equivalent_id,
                            )
                        )

        with transaction.atomic():
            ItemEquivalence.objects.all().delete()
            ItemEquivalence.objects.bulk_create(equivalents, batch_size=1000)

        self.stdout.write(
            self.style.SUCCESS(f"Created {len(equivalents)} item equivalence mappings.")
        )
