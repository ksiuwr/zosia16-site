# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2016-12-17 12:38
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('conferences', '0004_auto_20161210_1317'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userpreferences',
            name='bus',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='conferences.Bus'),
        ),
        migrations.AlterField(
            model_name='userpreferences',
            name='organization',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='users.Organization'),
        ),
    ]
