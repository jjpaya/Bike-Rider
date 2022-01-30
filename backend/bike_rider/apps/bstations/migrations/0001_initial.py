# Generated by Django 3.0.2 on 2022-01-28 15:34

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='BStation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=32)),
                ('lat', models.FloatField(validators=[django.core.validators.MinValueValidator(-90.0), django.core.validators.MaxValueValidator(90.0)])),
                ('lon', models.FloatField(validators=[django.core.validators.MinValueValidator(-180.0), django.core.validators.MaxValueValidator(180.0)])),
                ('image', models.FileField(upload_to='bstations')),
                ('nslots', models.IntegerField(validators=[django.core.validators.MinValueValidator(0)])),
                ('ip', models.GenericIPAddressField(null=True)),
            ],
        ),
    ]
