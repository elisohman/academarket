"""
URL configuration for academarket project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from . import views
from .views import SignUpView, SignInView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('test', views.test),
    path('elis', views.test),
    path('', views.test),
    # API endpoints
    path('sign_up', SignUpView.as_view(), name='sign_up'),
    path('sign_in', SignInView.as_view(), name='sign_in'),
    path('get_course_stats/<str:course_code>', views.get_course_stats),
    path('get_local_course_stats/<str:course_code>', views.get_local_course_stats),
    path('get_all_local_data', views.get_all_local_data),
    # Auth endpoints
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Development endpoints
    path('dev/fill_courses_database', views.fill_courses_database),
    path('dev/buy_course/<course_code>/<user>', views.buy_course_test),
    path('dev/add_course_to_database/<course_code>', views.add_course_to_database),
    path('dev/fill_course_codes_list', views.fill_course_codes_list),
    path('dev/fill_courses_json', views.fill_courses_json),
]
