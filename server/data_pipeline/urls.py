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
    path('initialize_all_data/', views.initialize_all_data),
    path('test_buy_course/<course_code>/<user>', views.buy_course_test),
    path('generate_price_histories/', views.generate_price_histories),
    path('create_bots/', views.call_create_bots),
    path('create_bots_from_list/', views.call_create_bots_from_list),
    path('delete_all_users/', views.delete_all_users),
    path('setup_bot_economy/', views.calL_setup_bot_economy),
    path('delete_all_orders/', views.delete_all_orders),
    path('fix_course_prices/', views.fix_course_prices),
    path('fix_balances/', views.fix_balances),
    path('update_all_daily_changes/', views.update_all_daily_changes),
    path('start_scheduler/', views.start_scheduler),
    path('stop_scheduler/', views.stop_scheduler),
    path('kill_all_bots/', views.kill_all_bots),
    path('test/', views.test_percentage_data),
    path('flush_courses_database/', views.flush_courses_database),
]
