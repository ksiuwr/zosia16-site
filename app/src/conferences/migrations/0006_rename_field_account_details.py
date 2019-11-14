# Generated by Django 2.2.6 on 2019-11-14 22:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('conferences', '0005_rename_field_bus_time'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='zosia',
            name='account_details',
        ),
        migrations.AddField(
            model_name='zosia',
            name='account_owner',
            field=models.TextField(default='KSI UWr', verbose_name='Account owner name'),
        ),
    ]