from django.http import HttpResponse, HttpRequest, JsonResponse
from api.models import User, Course, Stock, Portfolio
import json, requests, traceback

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status

from .serializers import SignUpSerializer, SignInSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate


#-- Views! --#


def test(request: HttpRequest) -> HttpResponse:
    return HttpResponse("Hello world. :)")


# Account related views (sign in, sign out, etc).


class SignUpView(APIView):
    """
    API view for user sign up.

    This view handles the HTTP POST request for user sign up and 
    expects a JSON payload with user registration data.

    Methods:
        post(request): Handles the POST request for user sign up.

    Returns:
        A response with the serialized user data and HTTP status code 201 if the registration is successful.
        A response with the validation errors and HTTP status code 400 if the registration is unsuccessful.
    """
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        serializer = SignUpSerializer(data=request.data)
        if(serializer.is_valid()):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SignInView(APIView):
    """
    API view for user sign-in, handles POST request for user sign-in. Expects a JSON payload
    with username and password fields.

    Methods:
        post(request): Handles the POST request for user sign-in.

    Returns: 
        If provided credentials are valid, returns a response with a refresh token
        and an access token. Otherwise, returns an error response.

    """
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        print(request.data)

        serializer = SignInSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password']
            )
            
            if user is not None:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }, status=status.HTTP_200_OK)
            return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetUserInfoView(APIView):
    """
    API view for getting user information.

    Methods:
        get(request): Handles the GET request for getting user information.
    
    Returns:
        A response with the user information and HTTP status code 200 if the user is authenticated.
        A response with HTTP status code 400 if the user is not authenticated.
    
    """
    permission = [permissions.IsAuthenticated]
    def get(self, request):
        user = request.user

        if (user):
            user_info = {
                'username' : str(user),
                'email' : str(user.email),
                'balance' : str(user.balance),
            }

            return Response(user_info, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class BuyStockView(APIView):
    """
    API view for buying stocks.

    This view handles the HTTP POST request for buying stocks.

    Methods:
        post(request): Handles the POST request for buying stocks.

    Returns:
        A response with the success message and HTTP status code 200 if the purchase is successful.
        A response with the error message and HTTP status code 400 if the purchase is unsuccessful.
    """
    permission = [permissions.IsAuthenticated]
    def post(self, request):
        course_code = request.data["course_code"]
        amount = request.data["amount"]
        user = User.objects.get(username=request.user)
        course = Course.objects.get(course_code=course_code)
        if user:
            if course:
                if user.balance >= course.price * amount:
                    portfolio = Portfolio.objects.get(user=user)
                    if portfolio:
                        user.balance -= course.price * amount
                        user.save()
                        new_stock = Stock.objects.create(course=course, amount=amount)
                        portfolio.stocks.add(new_stock)
                        portfolio.save()
                        return Response({'message': 'Stocks bought successfully'}, status=status.HTTP_200_OK)
                    else:
                        return Response({'message': 'Portfolio not found for user (should not be possible)'}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({'message': 'Insufficient balance'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'message': 'Course not found'}, status=status.HTTP_400_BAD_REQUEST)

        else:
            return Response({'message': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)


class SellStockView(APIView):
    """
    API view for selling stocks.

    This view handles the HTTP POST request for selling stocks.

    """
    permission = [permissions.IsAuthenticated]
    def get(self, request):
        course_code = request.data["course_code"]
        amount = request.data["amount"]
        user = User.objects.get(username=request.user)
        course = Course.objects.get(course_code=course_code)

        if user:
            if course:
                portfolio = Portfolio.objects.get(user=user)
                if portfolio:
                    stock = Stock.objects.get(course=course)
                    if stock:
                        if stock.amount >= amount:
                            user.balance += course.price * amount
                            user.save()
                            stock.amount -= amount
                            stock.save()
                            return Response({'message': 'Stocks sold successfully'}, status=status.HTTP_200_OK)
                        else:
                            return Response({'message': 'Insufficient stocks'}, status=status.HTTP_400_BAD_REQUEST)
                    else:
                        return Response({'message': 'Stock not found'}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({'message': 'Portfolio not found for user (should not be possible)'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'message': 'Course not found'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'message': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)


class GetPortfolioStocksView(APIView):
    """
    API view for getting user portfolio.

    This view handles the HTTP GET request for getting user portfolio.

    """
    permission = [permissions.IsAuthenticated]
    def get(self, request):
        user = User.objects.get(username=request.user)
        if user:
            portfolio = None
            if Portfolio.objects.filter(user=user).exists():
                portfolio = Portfolio.objects.get(user=user)
            else:
                new_portfolio = Portfolio(user=user)
                new_portfolio.save()
                portfolio = new_portfolio
            if portfolio:
                stocks = portfolio.stocks.all()
                stock_data = []
                for stock in stocks:
                    stock_data += [[stock.course.course_code, stock.course.name, stock.amount, str(stock.amount * stock.course.price), "diff%"]]        

                data_json = {
                    'headers': ['Course Code', 'Course Name', 'Amount', 'Total Value', 'Price Change (24h)'],
                    'items': stock_data
                }
                return Response(data_json, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Portfolio not found for user (should not be possible)'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'message': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)


class GetAllCoursesView(APIView):
    """
    API view for getting all courses in the database.

    Methods:
        get(request): Handles the GET request for all courses.

    Returns: 
        Returns header naming given course attributes and items with the course data, on this form:
        {
        headers: ['Course Code', 'Course Name', 'Price', 'Price Change (24h)'],
        items: [
            ['LNCH01', 'Lunchföreläsning med Dr. Göran Östlund', 6000, '+5%'],
            ['TÄTÄ24', "Urbans linjär algebra crash course", 900, '-2%'],
            ]
        }
        
        Otherwise, returns an error response.
    """
    permission = [permissions.IsAuthenticated]
    def get(self, request):
        courses = Course.objects.all()
        
        course_data = []
        for course in courses:
            course_data += [[course.course_code, course.name, course.price, "diff%"]]        

        data_json = {
            'headers': ['Course Code', 'Course Name', 'Price', 'Price Change (24h)'],
            'items': course_data
        }
        if (data_json):
            return Response(data_json, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class GetCourseDataView(APIView):
    """
    View for getting the data of a specific course.
    """
    permission = [permissions.IsAuthenticated]
    def get(self, request):
        course_code = request.query_params.get('course')
        course = Course.objects.get(course_code=course_code)
        if course:
            course_data = {
                'course_code': course.course_code,
                'name': course.name,
                'price': course.price,
                'price_history': course.price_history
            }
            return Response(course_data, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Course not found'}, status=status.HTTP_400_BAD_REQUEST)