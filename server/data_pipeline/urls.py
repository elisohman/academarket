from django.urls import path
from . import views

urlpatterns = [
    # Development endpoints
    path('get_course_stats/<str:course_code>', views.get_course_stats),
    path('get_local_course_stats/<str:course_code>', views.get_local_course_stats),
    path('get_all_local_data', views.get_all_local_data),
    path('fill_courses_database', views.fill_courses_database),
    path('add_course_to_database/<course_code>', views.add_course_to_database),
    path('fill_course_codes_list', views.fill_course_codes_list),
    path('fill_courses_json', views.fill_courses_json),
    path('test_buy_course/<course_code>/<user>', views.buy_course_test),

]
