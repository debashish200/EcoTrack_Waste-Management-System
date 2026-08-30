from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User

from .models import Profile


print("Signal triggered")
# CREATE PROFILE AUTOMATICALLY
@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    print(
        "Signal fired:",
        instance.username,
        "created=",
        created
    )

    if created:
        print("Creating profile")
        Profile.objects.create(
            user=instance,
            role='user'
        )


# SAVE PROFILE AUTOMATICALLY
# @receiver(post_save, sender=User)
# def save_profile(sender, instance, **kwargs):

#     instance.profile.save()