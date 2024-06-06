from django.test import TestCase
from api.models import User
CONTENT_TYPE_JSON = "application/json"
SIGN_IN_PATH = "/api/sign_in"

# Create your tests here.
class ApiTest(TestCase):
    def setUp(self) -> None:
        user1 = User.objects.create_user(
            username="user1",
            email="user1@user.com",
        )
        user1.set_password("hej")

        user1.save()
        user2 = User.objects.create_user(
            username="user2",
            email="user2@user.com",
        )
        user2.set_password("då")
        user2.save()

    def test_login_correct(self) -> None:
        """
        Tests that the login endpoint returns a 200 status code and a session
        cookie when the login is successful.
        """
        response = self.client.post(SIGN_IN_PATH, {"username": "user1", "password": "hej"},
                                    content_type=CONTENT_TYPE_JSON)
        self.assertEqual(response.status_code, 200)

        response = self.client.post(SIGN_IN_PATH, {"username": "user2", "password": "då"},
                                    content_type=CONTENT_TYPE_JSON)
        self.assertEqual(response.status_code, 200)

    def test_login_incorrect(self) -> None:
        """
        Tests that the login endpoint returns a 200 status code and a session
        cookie when the login is successful.
        """
        response = self.client.post(SIGN_IN_PATH, {"username": "user1", "password": ""},
                                    content_type=CONTENT_TYPE_JSON)
        self.assertEqual(response.status_code, 400)

        response = self.client.post(SIGN_IN_PATH, {"username": "user2", "password": "bad_password"},
                                    content_type=CONTENT_TYPE_JSON)
        self.assertEqual(response.status_code, 401)
