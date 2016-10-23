# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2016-10-19 19:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('conferences', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='place',
            old_name='place_address',
            new_name='address',
        ),
        migrations.RenameField(
            model_name='place',
            old_name='place_name',
            new_name='name',
        ),
        migrations.RemoveField(
            model_name='place',
            name='place_url',
        ),
        migrations.AddField(
            model_name='place',
            name='url',
            field=models.CharField(blank=True, max_length=300),
        ),
        migrations.AlterField(
            model_name='zosia',
            name='banner',
            field=models.ImageField(blank=True, null=True, upload_to=''),
        ),
    ]