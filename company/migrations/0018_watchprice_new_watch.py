# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2018-02-27 16:53
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0017_priceattr_watchprice'),
    ]

    operations = [
        migrations.AddField(
            model_name='watchprice',
            name='new_watch',
            field=models.BooleanField(default=False),
        ),
    ]
