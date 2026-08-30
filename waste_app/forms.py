from django import forms
from .models import *
from django.contrib.auth.forms import UserCreationForm

class ComplaintForm(forms.ModelForm):
    class Meta:
        model=Complaint
        fields=['location','description','image']


class RegistrationForm(UserCreationForm):
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        for field in self.fields.values():
            field.help_text = None
            field.widget.attrs['class'] = 'form-control'
    
    
    
    
    
    #email = forms.EmailField(required=True)
    # ROLE_CHOICES = (
    #     ('admin', 'Admin'),
    #     ('user', 'User'),
    # )
    # role = forms.ChoiceField(choices=ROLE_CHOICES)
    # class Meta:
    #     model=User
    #     fields=['username','email','password1','password2']


    # def save(self,commit=True):
    #     user=super().save(commit)

    #     role=self.cleaned_data.get('role')
    #     profile=user.profile
    #     profile.role=role
    #     profile.save()
        
    #     return user
        
    #     #Revomes Help text
    #     for field in self.fields.values():
    #         field.help_text = None
    #         field.widget.attrs['class'] = 'form-control' 