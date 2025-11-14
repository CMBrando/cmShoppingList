"""App settings."""

from django.conf import settings

CM_VERSION = "0.02"
HEADER_MESSAGE = getattr(settings, "SHOPPING_LIST_HEADER_MESSAGE", "OMG daddy, please take me shopping at JITA!")