from django.http import HttpResponse, HttpRequest, JsonResponse
from api.models import User, Course, Stock, Portfolio, PricePoint
import json, requests, traceback, datetime

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status

from .serializers import SignUpSerializer, SignInSerializer, ChangePasswordSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate

from collections import OrderedDict

import api.utils.stock_manager as stock_manager

from django.db.models import OuterRef, Subquery, F, FloatField, ExpressionWrapper, Sum

#--- Views! ---#


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


class SignInView(APIView): # To be removed?
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

class ChangePasswordView(APIView):
    """
    API view for changing user password. Handles the HTTP PUT request for changing user password and expects a JSON payload
    with old_password, new_password and rpt_new_password fields.

    Methods:
        put(request): Handles the PUT request for changing user password.

    Returns:
        A response with the success message and HTTP status code 200 if the password is changed successfully.
        A response with the validation errors and HTTP status code 400 if the password change is unsuccessful.
    """
    permission_classes = [permissions.IsAuthenticated]
    def put(self, request):
        user = request.user
        print(user)
        print(request.data)
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            if user.check_password(serializer.validated_data['old_password']):
                user.set_password(serializer.validated_data['new_password'])
                user.save()
                return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)
            return Response({'error': 'Invalid old password'}, status=status.HTTP_400_BAD_REQUEST)
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
            formatted_balance = round(user.balance, 2)
            user_info = {
                'username' : str(user),
                'email' : str(user.email),
                'balance' : str(formatted_balance),
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
        user = User.objects.filter(username=request.user).first()
        course = Course.objects.filter(course_code=course_code).first()
        if user:
            if course:
                if stock_manager.place_buy_order(user, course, amount):
                    return Response({'message': 'Stocks bought successfully'}, status=status.HTTP_200_OK)
                else:
                    return Response({'message': 'Insufficient balance'}, status=status.HTTP_400_BAD_REQUEST)
                """
                if user.balance >= course.price * amount:
                    portfolio = Portfolio.objects.filter(user=user).first()
                    if portfolio:
                        user.balance -= course.price * amount
                        user.save()

                        existing_stock = portfolio.stocks.filter(course=course).first()
                        if existing_stock:
                            existing_stock.amount += amount
                            existing_stock.save()
                        else:
                            new_stock = Stock.objects.create(course=course, amount=amount)
                            portfolio.stocks.add(new_stock)
                        portfolio.save()
                        return Response({'message': 'Stocks bought successfully'}, status=status.HTTP_200_OK)
                    else:
                        return Response({'message': 'Portfolio not found for user (should not be possible)'}, status=status.HTTP_400_BAD_REQUEST)
                    """
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
    def post(self, request):
        course_code = request.data["course_code"]
        amount = request.data["amount"]
        user = User.objects.filter(username=request.user).first()
        course = Course.objects.filter(course_code=course_code).first()

        if user:
            if course:
                portfolio = Portfolio.objects.filter(user=user).first()
                if portfolio:
                    stock = portfolio.stocks.filter(course=course).first()
                    print(f'stock amount: {stock.amount}, stock name: {stock.course.course_code}')
                    if stock:
                        if stock_manager.place_sell_order(user, stock, amount):
                            return Response({'message': 'Stock sell order placed successfully'}, status=status.HTTP_200_OK)

                            """
                            if stock.amount >= amount:
                                user.balance += course.price * amount
                                user.save()
                                stock.amount -= amount
                                stock.save()
                            """
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
                daily_portfolio_change = 0
                total_portfolio_value = 0
                for stock in stocks:
                    formatted_price = round(stock.amount * stock.course.price)
                    stock_data += [[stock.course.course_code, stock.course.name, stock.amount, formatted_price, stock.course.daily_change_percent]]        
                    daily_portfolio_change += stock.course.daily_change
                    total_portfolio_value += formatted_price
                data_json = {
                    'headers': ['Course Code', 'Course Name', 'Amount', 'Total Value', 'Price Change (24h)'],
                    'items': stock_data,
                    'daily_portfolio_change': round(daily_portfolio_change, 2),
                    'total_portfolio_value': round(total_portfolio_value, 2)
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

            formatted_price = round(course.price, 2)
            course_data += [[course.course_code, course.name, formatted_price, course.daily_change_percent]]    

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
            price_points_per_day = {}
            for price_point in PricePoint.objects.filter(course=course):
                dt = price_point.date.date()
                timestamp = price_point.timestamp
                formatted_price = round(price_point.price, 2)
                if price_points_per_day.get(timestamp):
                    price_points_per_day[timestamp] += [formatted_price]
                else:
                    price_points_per_day[timestamp] = [formatted_price]
            formatted_price_history = []
            for date_key in price_points_per_day:
                day_info = OrderedDict({
                            "time": date_key, 
                            "open": price_points_per_day[date_key][0],
                            "high": max(price_points_per_day[date_key]),
                            "low": min(price_points_per_day[date_key]),
                            "close": price_points_per_day[date_key][-1]
                            })
                formatted_price_history.append(day_info)
            sorted_formatted_price_history_on_timestamp_date_key = sorted(formatted_price_history, key=lambda x: x['time'])
            user = User.objects.get(username=request.user)
            stock_amount = 0
            if user:
                portfolio = Portfolio.objects.filter(user=user).first()
                if portfolio:
                    stock = portfolio.stocks.filter(course=course).first()
                    if stock:
                        stock_amount = stock.amount
                        
            formatted_price = round(stock_manager.calculate_price(course.base_price), 2)
            course_data = {
                'course_code': course.course_code,
                'name': course.name,
                'price': formatted_price,
                'price_history': sorted_formatted_price_history_on_timestamp_date_key,
                'stock_amount': stock_amount,
                'base_price': course.base_price,
            }
            return Response(course_data, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Course not found'}, status=status.HTTP_400_BAD_REQUEST)

class DashboardView(APIView):
    """
    View for getting dashboard stuff.
    """
    permission = [permissions.IsAuthenticated]
    def get(self, request):
        courses = Course.objects.all().order_by('-daily_change_percent')
        trending_course = courses.first()
        worst_course = courses.last()
        # best_users = User.objects.annotate( 
        #     total_portfolio_value=Sum(
        #         F('portfolios__stocks__amount') * F('portfolios__stocks__course__price'),
        #         output_field=FloatField()
        #     )
        # ).order_by('-total_portfolio_value')[:5]
        ## Note: The code above worked for SQLLITE but not for PostgreSQL, implemented code below worked for PostgreSQL

        subquery = Portfolio.objects.filter(
            user=OuterRef('pk')
        ).values(
            'user'
        ).annotate(
            total_value=Sum(
                ExpressionWrapper(
                    F('stocks__amount') * F('stocks__course__price'),
                    output_field=FloatField()
                )
            )
        ).values('total_value')

        # Main query to annotate users with the calculated total portfolio value
        best_users = User.objects.annotate(
            total_portfolio_value=Subquery(subquery)
        ).order_by('-total_portfolio_value')[:5]
        best_users_names_only = [user.username for user in best_users]
        best_users_balances = [user.total_portfolio_value for user in best_users]
        print(best_users_balances)
        current_user = User.objects.get(username=request.user)
        if current_user:
            portfolio = Portfolio.objects.filter(user=current_user).first()
            if portfolio:
                dashboard_data = {}
                best_portfolio_stock = portfolio.stocks.all().order_by('-course__daily_change_percent').first()
                if best_portfolio_stock:
                    dashboard_data = {
                        'best_course': trending_course.course_code,
                        'best_course_change': trending_course.daily_change_percent,
                        'worst_course': worst_course.course_code,
                        'worst_course_change': worst_course.daily_change_percent,
                        'best_users': best_users_names_only,
                        'best_users_balances': best_users_balances,
                        'best_portfolio_stock': best_portfolio_stock.course.course_code,
                        'best_portfolio_stock_change': best_portfolio_stock.course.daily_change_percent
                        }
                else:
                    dashboard_data = {
                        'best_course': trending_course.course_code,
                        'best_course_change': trending_course.daily_change_percent,
                        'worst_course': worst_course.course_code,
                        'worst_course_change': worst_course.daily_change_percent,
                        'best_users': best_users_names_only,
                        'best_users_balances': best_users_balances,
                        'best_portfolio_stock': None,
                        'best_portfolio_stock_change': None
                        }

                return Response(dashboard_data, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Portfolio not found for user (should not be possible)'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'message': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)

