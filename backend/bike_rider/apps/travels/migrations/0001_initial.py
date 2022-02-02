# Generated by Django 4.0.2 on 2022-02-01 20:07

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('bstations', '0001_initial'),
        ('bikes', '0002_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Travel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start', models.DateTimeField(default=django.utils.timezone.now)),
                ('finish', models.DateTimeField()),
                ('bike', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='travel', to='bikes.bike')),
                ('destination', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='travel_d', to='bstations.bstation')),
                ('origin', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='travel_o', to='bstations.bstation')),
            ],
        ),
    ]
