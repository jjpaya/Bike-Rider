# Generated by Django 4.0.2 on 2022-05-15 21:29

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('travels', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='travel',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='travel', to=settings.AUTH_USER_MODEL),
        ),
    ]
