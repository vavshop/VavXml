# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2018-03-21 17:34
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0018_watchprice_new_watch'),
    ]

    operations = [
        migrations.AddField(
            model_name='watchprice',
            name='type_data',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]