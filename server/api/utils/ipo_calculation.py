from django.http import HttpResponse
from api.utils.courses_json_utils import read_course_data_from_code, get_grade_data_dict_on_date, get_module_data_dict_on_date

def calculate_price(course_data):
    if course_data:
        try:
            module_data = course_data['exams']['TEN1']
        
            data = get_module_data_dict_on_date(module_data)
            MAX_AMOUNT = 5
            latest_exams = dict(list(data.items())[-MAX_AMOUNT:])
            exam_amount = len(latest_exams)
            
            total_price = 0
            for grades in latest_exams.values():
                # (3x+4y+5z) / antal kuggade) * antal studenter
                exam_points = 0
                total_students = 0
                num_of_failed_students = 0
                # (3x+4y+5z)
                for grade in grades:
                    grade_name = grade[1]
                    num_of_students = grade[0]
                    match grade_name:
                        case '5':
                            exam_points += 5 * num_of_students
                            total_students += num_of_students
                            break
                        case '4':
                            exam_points += 4 * num_of_students
                            total_students += num_of_students
                            break
                        case '3':
                            exam_points += 3 * num_of_students
                            total_students += num_of_students
                            break
                        case 'U':
                            num_of_failed_students = num_of_students
                            total_students += num_of_students
                            break
                # dividera med antal kuggade och multiplicera med total_students
                if (num_of_failed_students == 0):
                    num_of_failed_students = 1
                total_price += (exam_points / num_of_failed_students) * total_students
            # Få average price från tentorna
            total_price = total_price / exam_amount
            print(total_price)

            return total_price

        except KeyError as e:
            print(e)
            return 1
    
    
        

    return HttpResponse(status=404, content="Course not found in local JSON.")


'''
{'course_name': 'Grafteori', 
'course_code': 'TATA64', 
'exam_codes': ['TEN1', 'UPG1'], 
'prio_code': None, 
'exams': {'TEN1': {'dates': ['2012-05-28', '2012-08-15', '2013-05-30', '2013-08-21', '2013-10-23', '2014-08-20', '2014-10-22', '2015-06-03', '2015-08-19', '2015-08-24', '2017-05-29', '2017-08-16', '2017-10-27', '2018-05-31', '2018-11-01'], 
'name': 'Skriftlig tentamen', 
'data': [{'data': [0, 0, 3, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1], 'name': '5', 'color': '#0262A7'}
        , {'data': [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 2, 1, 0, 0], 'name': '4', 'color': '#3390BB'}
        , {'data': [0, 0, 0, 0, 0, 1, 1, 4, 1, 0, 4, 1, 1, 1, 0], 'name': '3', 'color': '#C0D4E4'}
        , {'data': [1, 1, 0, 1, 1, 0, 1, 2, 0, 0, 4, 1, 0, 0, 0], 'name': 'U', 'color': '#303030'}]}, 
        'UPG1': {'dates': ['2019-06-13', '2019-09-09', '2021-06-03', '2022-06-14'], 
        'name': 'Inlämningsuppgifter', 
        'data': [{'data': [5, 0, 2, 1], 'name': '5', 'color': '#0262A7'}
            , {'data': [5, 1, 4, 2], 'name': '4', 'color': '#3390BB'}
            , {'data': [4, 0, 5, 9], 'name': '3', 'color': '#C0D4E4'}]}}, 'success': True}
'''
