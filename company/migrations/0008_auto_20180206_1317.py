# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2018-02-06 11:17
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0007_eshop_newcol'),
    ]

    operations = [
        migrations.AddField(
            model_name='eshop',
            name='newcol0',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='eshop',
            name='newedit',
            field=models.BooleanField(default=False),
        ),
    ]
