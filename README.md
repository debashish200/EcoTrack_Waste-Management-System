# ♻️ Rural Waste Management System

A Django-based web application designed to streamline waste complaint management in rural areas. The system enables users to raise complaints, while administrators can track, manage, and update the status efficiently.

---

## 🚀 Features

### 👤 User Features

* User Registration & Login
* Submit Waste Complaints
* View Complaint Status
* Upload Images (optional)
* Email notification on status updates

### 🛠️ Admin Features

* Admin Dashboard
* View all complaints
* Update complaint status
* Status workflow control (Pending → In Progress → Resolved)
* Prevent backward status changes
* Sort & filter complaints (Latest, Pending, Resolved)
* Pagination for better performance

---

## 🔐 Role-Based Access Control

* **Admin**

  * Access to dashboard
  * Manage all complaints
* **User**

  * Submit and track their own complaints

---

## 🔄 Complaint Workflow

```text
Pending → In Progress → Resolved
```

* Backward transitions are restricted
* Ensures proper tracking and data integrity

---

## 📧 Email Notification

* Users receive email when complaint status is updated
* Integrated using Django email backend

---

## ⚙️ Tech Stack

* **Backend:** Python, Django
* **Database:** SQLite / MySQL
* **Frontend:** HTML, CSS, Bootstrap
* **Other:** Django Messages Framework, Pagination, Email Services

---

## 📂 Project Structure

```
rural_waste_management/
│
├── waste_app/
│   ├── migrations/
│   ├── templates/
│   │   └── waste_app/
│   ├── static/
│   │   ├── css/
│   │   └── js/
│   ├── models.py
│   ├── views.py
│   ├── forms.py
│   ├── urls.py
│
├── rural_waste_management/
│   ├── settings.py
│   ├── urls.py
│
├── manage.py
```

---

## 🧠 Key Backend Concepts Implemented

* Django ORM (CRUD operations)
* Authentication & Authorization
* Role-based access system
* Form handling & validation
* Status transition validation logic
* Pagination (Django Paginator)
* Email integration
* Timezone handling (IST)

---

## 🖥️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/rural-waste-management.git
cd rural-waste-management
```

### 2️⃣ Create Virtual Environment

```bash
python -m venv venv
venv\Scripts\activate   # Windows
```

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 4️⃣ Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5️⃣ Create Superuser (Admin)

```bash
python manage.py createsuperuser
```

### 6️⃣ Run Server

```bash
python manage.py runserver
```

---

## 📸 Screens (Optional)

* Login Page
* Registration Page
* User Complaint Dashboard
* Admin Dashboard

---

## 📈 Future Enhancements

* Search functionality
* AJAX-based live updates
* Complaint history tracking
* Analytics dashboard (charts)
* Geo-location integration for waste tracking

---

## 🧑‍💻 Author

**Debashish Das**

---

## ⭐ If you like this project, consider giving it a star!
