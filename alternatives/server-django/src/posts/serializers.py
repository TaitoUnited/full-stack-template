from rest_framework import serializers
from posts.models import Posts, PostsCreate


class PostReadSerializer(serializers.ModelSerializer):

    class Meta:
        model = Posts
        fields = ('id',
                  'subject',
                  'content',
                  'author')

class PostCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = PostsCreate
        fields = ('subject',
                  'content',
                  'author')

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Posts
        fields = ('__all__')
