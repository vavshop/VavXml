# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2018-01-04 13:37
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0003_auto_20180103_1607'),
    ]

    operations = [
        migrations.CreateModel(
            name='Eshop',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('col1', models.CharField(blank=True, max_length=250, null=True)),
                ('col2', models.CharField(blank=True, max_length=250, null=True)),
                ('col3', models.CharField(blank=True, max_length=250, null=True)),
                ('col4', models.TextField(blank=True, null=True)),
                ('col5', models.CharField(blank=True, max_length=250, null=True)),
                ('col6', models.CharField(blank=True, max_length=250, null=True)),
                ('col7', models.CharField(blank=True, max_length=250, null=True)),
                ('col8', models.CharField(blank=True, max_length=250, null=True)),
                ('col9', models.CharField(blank=True, max_length=250, null=True)),
                ('col10', models.CharField(blank=True, max_length=250, null=True)),
                ('col11', models.CharField(blank=True, max_length=250, null=True)),
                ('col12', models.CharField(blank=True, max_length=250, null=True)),
                ('col13', models.CharField(blank=True, max_length=250, null=True)),
                ('col14', models.CharField(blank=True, max_length=250, null=True)),
                ('col15', models.CharField(blank=True, max_length=250, null=True)),
                ('col16', models.CharField(blank=True, max_length=250, null=True)),
                ('col17', models.CharField(blank=True, max_length=250, null=True)),
                ('col18', models.CharField(blank=True, max_length=250, null=True)),
                ('col19', models.CharField(blank=True, max_length=250, null=True)),
                ('col20', models.CharField(blank=True, max_length=250, null=True)),
                ('col21', models.CharField(blank=True, max_length=250, null=True)),
                ('col22', models.CharField(blank=True, max_length=250, null=True)),
                ('col23', models.CharField(blank=True, max_length=250, null=True)),
                ('col24', models.CharField(blank=True, max_length=250, null=True)),
                ('col25', models.CharField(blank=True, max_length=250, null=True)),
                ('col26', models.CharField(blank=True, max_length=250, null=True)),
                ('col27', models.CharField(blank=True, max_length=250, null=True)),
                ('col28', models.CharField(blank=True, max_length=250, null=True)),
                ('col29', models.CharField(blank=True, max_length=250, null=True)),
                ('col30', models.CharField(blank=True, max_length=250, null=True)),
                ('col31', models.CharField(blank=True, max_length=250, null=True)),
                ('col32', models.CharField(blank=True, max_length=250, null=True)),
                ('col33', models.CharField(blank=True, max_length=250, null=True)),
                ('col34', models.CharField(blank=True, max_length=250, null=True)),
                ('col35', models.CharField(blank=True, max_length=250, null=True)),
                ('col36', models.CharField(blank=True, max_length=250, null=True)),
                ('col37', models.CharField(blank=True, max_length=250, null=True)),
                ('col38', models.CharField(blank=True, max_length=250, null=True)),
                ('col39', models.CharField(blank=True, max_length=250, null=True)),
                ('col40', models.CharField(blank=True, max_length=250, null=True)),
                ('col41', models.CharField(blank=True, max_length=250, null=True)),
                ('col42', models.CharField(blank=True, max_length=250, null=True)),
                ('col43', models.CharField(blank=True, max_length=250, null=True)),
                ('col44', models.CharField(blank=True, max_length=250, null=True)),
                ('col45', models.CharField(blank=True, max_length=250, null=True)),
                ('col46', models.CharField(blank=True, max_length=250, null=True)),
                ('col47', models.CharField(blank=True, max_length=250, null=True)),
                ('col48', models.CharField(blank=True, max_length=250, null=True)),
                ('col49', models.CharField(blank=True, max_length=250, null=True)),
                ('col50', models.CharField(blank=True, max_length=250, null=True)),
                ('col51', models.CharField(blank=True, max_length=250, null=True)),
                ('col52', models.CharField(blank=True, max_length=250, null=True)),
                ('col53', models.CharField(blank=True, max_length=250, null=True)),
                ('col54', models.CharField(blank=True, max_length=250, null=True)),
                ('col55', models.CharField(blank=True, max_length=250, null=True)),
                ('col56', models.CharField(blank=True, max_length=250, null=True)),
                ('col57', models.CharField(blank=True, max_length=250, null=True)),
                ('col58', models.CharField(blank=True, max_length=250, null=True)),
                ('col59', models.CharField(blank=True, max_length=250, null=True)),
                ('col60', models.CharField(blank=True, max_length=250, null=True)),
                ('col61', models.CharField(blank=True, max_length=250, null=True)),
                ('col62', models.CharField(blank=True, max_length=250, null=True)),
                ('col63', models.CharField(blank=True, max_length=250, null=True)),
                ('col64', models.CharField(blank=True, max_length=250, null=True)),
                ('col65', models.CharField(blank=True, max_length=250, null=True)),
                ('col66', models.CharField(blank=True, max_length=250, null=True)),
                ('col67', models.CharField(blank=True, max_length=250, null=True)),
                ('col68', models.CharField(blank=True, max_length=250, null=True)),
                ('col69', models.CharField(blank=True, max_length=250, null=True)),
                ('col70', models.CharField(blank=True, max_length=250, null=True)),
                ('col71', models.CharField(blank=True, max_length=250, null=True)),
                ('col72', models.CharField(blank=True, max_length=250, null=True)),
                ('col73', models.CharField(blank=True, max_length=250, null=True)),
                ('col74', models.CharField(blank=True, max_length=250, null=True)),
                ('col75', models.CharField(blank=True, max_length=250, null=True)),
                ('col76', models.CharField(blank=True, max_length=250, null=True)),
                ('col77', models.CharField(blank=True, max_length=250, null=True)),
                ('col78', models.CharField(blank=True, max_length=250, null=True)),
                ('col79', models.CharField(blank=True, max_length=250, null=True)),
                ('col80', models.CharField(blank=True, max_length=250, null=True)),
                ('col81', models.CharField(blank=True, max_length=250, null=True)),
                ('col82', models.CharField(blank=True, max_length=250, null=True)),
                ('col83', models.CharField(blank=True, max_length=250, null=True)),
                ('col84', models.CharField(blank=True, max_length=250, null=True)),
                ('col85', models.CharField(blank=True, max_length=250, null=True)),
                ('col86', models.CharField(blank=True, max_length=250, null=True)),
                ('col87', models.CharField(blank=True, max_length=250, null=True)),
            ],
            options={
                'db_table': 'parce_eshop',
            },
        ),
    ]
