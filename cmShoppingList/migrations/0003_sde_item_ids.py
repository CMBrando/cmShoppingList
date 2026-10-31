from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("cmShoppingList", "0002_itemequivalence"),
    ]

    operations = [
        migrations.AlterField(
            model_name="itemequivalence",
            name="original_item",
            field=models.BigIntegerField(db_column="original_item_id"),
        ),
        migrations.AlterField(
            model_name="itemequivalence",
            name="equivalent_item",
            field=models.BigIntegerField(db_column="equivalent_item_id"),
        ),
        migrations.RenameField(
            model_name="itemequivalence",
            old_name="original_item",
            new_name="original_item_id",
        ),
        migrations.RenameField(
            model_name="itemequivalence",
            old_name="equivalent_item",
            new_name="equivalent_item_id",
        ),
        migrations.AlterUniqueTogether(
            name="itemequivalence",
            unique_together={("original_item_id", "equivalent_item_id")},
        ),
        migrations.DeleteModel(name="MarketType"),
    ]
