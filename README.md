# Shopping List

This is a Shopping List app for [Alliance Auth](https://gitlab.com/allianceauth/allianceauth) (AA) 

## Features

- Paste in your Eve/FleetUp fit (with optional multiplier) and then paste in your eve list of assets.  It will run a comparison and let you know what still needs to be purchased.  Now includes equivalence checks

## Installation

Once you have cloned the repo or copied all files into place.

Make sure you are in your venv. Then install it with pip from PyPi or pip in editable mode if downloaded from source:

```bash
pip install cmShoppingList 
or
pip install -e {path_to}/cmShoppingList

```

Add `eve_sde` and `cmShoppingList` to `INSTALLED_APPS` in `settings/local.py`. The `django-eveonline-sde` package is installed as a dependency.
For a new SDE installation, also include `modeltranslation` in `INSTALLED_APPS` as described in the SDE setup instructions.

```python
INSTALLED_APPS += ["eve_sde", "cmShoppingList"]
```

Next perform migrations to add models to the database:

```bash
python manage.py migrate
```

Load the EVE SDE item types and dogma data, then build item equivalences:

```bash
python manage.py esde_load_sde
python manage.py populate_equivalences
```

Run `populate_equivalences` again after each SDE update. Existing equivalence mappings are retained during upgrade until you run this command. The old `populate_types` command and local `MarketType` table have been removed.

Next copy all the static data to the output folder

```bash
python manage.py collectstatic --noinput
```

Finally restart your AA setup.

## Permissions

There is only one permission for this application and it's to allow access and show it in the menu

View Shopping List menu item
    *cmShoppingList.basic_access*











