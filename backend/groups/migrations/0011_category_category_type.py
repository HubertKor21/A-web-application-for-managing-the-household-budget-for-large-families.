# Generated by Django 5.0.4 on 2024-11-06 15:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('groups', '0010_remove_groups_category_groups_categories'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='category_type',
            field=models.CharField(choices=[('expense', 'Wydatki'), ('income', 'Przychody')], default='expense', max_length=7),
        ),
    ]
