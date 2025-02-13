from rest_framework import serializers
from .models import User, Portfolio

class SignUpSerializer(serializers.ModelSerializer):
    rpt_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'rpt_password']
        extra_kwargs = {'password': {'write_only': True}}
        
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'] 
        )
        user.set_password(validated_data['password'])
        user.save()

        # Initializing portfolio (Q: Should it be done here? Like this? /JK)
        new_portfolio = Portfolio(user=user)
        new_portfolio.save()
        return user
        
    def validate(self, data):
        if data['password'] != data['rpt_password']:
            raise serializers.ValidationError({'password': 'Passwords must match.'})
        return data
        
class SignInSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password']

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    rpt_new_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['rpt_new_password']:
            raise serializers.ValidationError({'new_password': 'Passwords must match.'})
        return data
