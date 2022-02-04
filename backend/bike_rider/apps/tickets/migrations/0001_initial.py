# Generated by Django 4.0.2 on 2022-02-04 18:20

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='MaintenanceTicket',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('BIKES', 'bikes'), ('STATION', 'station')], max_length=40)),
                ('message', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='SupportTicket',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('ACCOUNT', 'account'), ('TRAVELS', 'travels')], max_length=40)),
                ('message', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Ticket',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=30)),
                ('type', models.CharField(choices=[('MAINTENANCE', 'maintenance'), ('SUPPORT', 'support')], max_length=40)),
                ('status', models.CharField(choices=[('PENDING', 'pending'), ('RESOLVED', 'resolved'), ('CANCELED', 'canceled')], default='PENDING', max_length=40)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
    ]
