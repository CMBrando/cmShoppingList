import csv
import os
from django.apps import apps
from django.conf import settings
from django.core.management.base import BaseCommand
from cmShoppingList.models import MarketType

class Command(BaseCommand):
    help = 'Populate Market Types'

    def handle(self, *args, **kwargs):

        # Get the absolute path
        current_directory = os.path.dirname(__file__)

        file_path = os.path.join(current_directory, 'data', 'market_types.tsv')

        # Process Market Types
        with open(file_path, newline='') as file:
            reader = csv.reader(file, delimiter="\t")
            for item in reader:

                region, created = MarketType.objects.update_or_create(
                    id=int(item[0]),
                    defaults = {
                        'name': item[1]
                    }
                )

        

