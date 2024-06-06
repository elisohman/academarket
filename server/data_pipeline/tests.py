from django.test import TestCase

# Create your tests here.

from django.test import TestCase
CONTENT_TYPE_JSON = "application/json"
ADD_COURSE_DB_PATH = "/data_pipeline/add_course_to_database"

# Create your tests here.
class ApiTest(TestCase):
    def setUp(self) -> None:
        pass

    def test_add_course_to_db(self) -> None:
        """
        Tests that the add course to database endpoint returns a 200 status code
        when the course is added successfully.
        """
        response = self.client.get(ADD_COURSE_DB_PATH + "/TATA24")
        self.assertEqual(response.status_code, 201)

        response = self.client.get(ADD_COURSE_DB_PATH + "/TDDD27")
        self.assertEqual(response.status_code, 201)

        response = self.client.get(ADD_COURSE_DB_PATH + "/TDDD27")
        self.assertEqual(response.status_code, 403)

        response = self.client.get(ADD_COURSE_DB_PATH + "/")
        self.assertEqual(response.status_code, 404)

        response = self.client.get(ADD_COURSE_DB_PATH + "")
        self.assertEqual(response.status_code, 404)

        response = self.client.get(ADD_COURSE_DB_PATH + "/TOTA69")
        self.assertEqual(response.status_code, 404)

        response = self.client.get(ADD_COURSE_DB_PATH + "/AAAAAAAAAAA")
        self.assertEqual(response.status_code, 404)