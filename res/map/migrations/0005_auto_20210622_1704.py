# Generated by Django 3.1.4 on 2021-06-22 17:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('map', '0004_auto_20210620_1823'),
    ]

    operations = [
        migrations.RenameField(
            model_name='location',
            old_name='technical_ranking',
            new_name='efficiency_ranking',
        ),
        migrations.RenameField(
            model_name='location',
            old_name='ecological_ranking',
            new_name='environmental_ranking',
        ),
    ]
