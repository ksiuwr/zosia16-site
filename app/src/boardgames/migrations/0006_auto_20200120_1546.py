# Generated by Django 2.2.8 on 2020-01-20 15:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('boardgames', '0005_auto_20200120_1545'),
    ]

    operations = [
        migrations.RenameField(
            model_name='vote',
            old_name='voter',
            new_name='user',
        ),
    ]