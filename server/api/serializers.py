from rest_framework import serializers
from .models import User

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