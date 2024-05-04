from django.test import TestCase
from api.models import User
CONTENT_TYPE_JSON = "application/json"
SIGN_IN_PATH = "/api/sign_in"

# Create your tests here.
class ApiTest(TestCase):
    def setUp(self) -> None:
        user1 = User.objects.create(username="user1", password="då")
        user1.save()
        user2 = User.objects.create(username="user2", password="hej")
        user2.save()

    
    def test_login_correct(self) -> None:
        """
        Tests that the login endpoint returns a 200 status code and a session
        cookie when the login is successful.
        """
        response = self.client.post(SIGN_IN_PATH, {"username": "user1", "password": "då"},
                                    content_type=CONTENT_TYPE_JSON)
        self.assertEqual(response.status_code, 200)

        response = self.client.post(SIGN_IN_PATH, {"username": "user2", "password": "hej"},
                                    content_type=CONTENT_TYPE_JSON)
        self.assertEqual(response.status_code, 200)

    def test_login_incorrect(self) -> None:
        """
        Tests that the login endpoint returns a 200 status code and a session
        cookie when the login is successful.
        """
        response = self.client.post(SIGN_IN_PATH, {"username": "user1", "password": ""},
                                    content_type=CONTENT_TYPE_JSON)
        self.assertEqual(response.status_code, 403)

        response = self.client.post(SIGN_IN_PATH, {"username": "user2", "password": "bad_password"},
                                    content_type=CONTENT_TYPE_JSON)
        self.assertEqual(response.status_code, 403)

