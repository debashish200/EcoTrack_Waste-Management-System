from django.shortcuts import render,redirect
from django.http import HttpResponse
from .models import *
from .forms import *
from django.contrib.auth import login,logout,authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
from django.core.paginator import Paginator

# Create your views here.

def user_register(request):
    print("rigister view called")
    form=RegistrationForm(request.POST or None)
    print('post req recved')
    print("FORM FIELDS:")
    print(form.fields.keys())

    if form.is_valid():
        print('form is valid')
        user=form.save()
        print('user created',user.username)
        messages.success(request,"Registration Successfull")
        return redirect('login')
    else:
        print('form error')
        print("FORM ERRORS =", form.errors)
        print("FORM DATA =", request.POST)
        print(form.errors)
    d={'form':form}
    return render(request,'waste_app/register.html',d)

def user_login(request):
    if request.method=='POST':
        username=request.POST.get('username')
        password=request.POST.get('password')
        user=authenticate(username=username,password=password)
        if user is not None:
            login(request,user)
            if user.profile.role=='admin':
                messages.success(request,'Admin login Successfull')
                return redirect('admin_dashboard')
            else:
                messages.success(request,'User login successfully')
                return redirect('complaint_list')
        else:
            messages.error(request,"invalid unsername or password")

    return render(request,'waste_app/login.html')

def logout_view(request):
    logout(request)
    messages.success(request,'Logout Successfully')
    return redirect('login')

@login_required
def complaint_form(request):
    form=ComplaintForm(request.POST or None,request.FILES or None)

    if form.is_valid():
        complaint = form.save(commit=False)
        complaint.user = request.user
        complaint.save()
        #send mail

        send_mail(
            "Complaint Submitted",
            f"Hi,{request.user.username},Your complaint has been Submitted Successfully",
            settings.EMAIL_HOST_USER,
            [request.user.email],
            fail_silently=True,
        )
        return redirect('complaint_list')
    return render(request, 'waste_app/complaint_form.html', {'form': form})

@login_required
def complaint_list(request):
    complaints = Complaint.objects.filter(user=request.user)
    return render(request, 'waste_app/complaint_list.html', {'complaints': complaints})


STATUS_ORDER = {
    "Pending": 1,
    "In Progress": 2,
    "Resolved": 3
}

@login_required
def admin_dashboard(request):

    if request.user.profile.role != 'admin':
        return HttpResponse("Unauthorized", status=403)
    
    if request.method == "POST":
        print(request.POST)
        cid = (request.POST.get("cid")
               or request.POST.get("complaint_id")
            or request.POST.get("id")
            )

        new_status = request.POST.get("status")
        if not cid:
            messages.error(request, "Complaint ID not received.")
            return redirect("admin_dashboard")

        try:
            complaint = Complaint.objects.get(id=cid)
            current_status = complaint.status

            #VALIDATION (NO BACKWARD)
            if STATUS_ORDER[new_status] < STATUS_ORDER[current_status]:
                messages.error(request, "Cannot move status backward!")

            else:
                complaint.status = new_status
                complaint.save()

                messages.success(request, "Status updated successfully!")

                # SEND EMAIL ONLY IF SUCCESS
                send_mail(
                    "Complaint Status Updated",
                    f"Your complaint status has been updated to: {complaint.status}",
                    settings.EMAIL_HOST_USER,
                    [complaint.user.email],
                    fail_silently=True,
                )

        except Complaint.DoesNotExist:
            messages.error(request, "Complaint not found!")

    #SORTING
    sort = request.GET.get('sort')
    complaints = Complaint.objects.all()

    if sort == 'pending':
        complaints = complaints.filter(status='Pending').order_by('-created_at')

    elif sort == 'resolved':
        complaints = complaints.filter(status='Resolved').order_by('-created_at')

    else:
        complaints = complaints.order_by('-created_at')
        
    context = {
  
      "complaints": complaints,

        "total_complaints": complaints.count(),

        "pending_count":
            complaints.filter(status="Pending").count(),

        "in_progress_count":
            complaints.filter(status="In Progress").count(),

        "resolved_count":
            complaints.filter(status="Resolved").count(),
               
    }

    # PAGINATION
    paginator = Paginator(complaints, 5)  # 5 complaints per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, "waste_app/admin_dashboard.html",
        context,
     )
