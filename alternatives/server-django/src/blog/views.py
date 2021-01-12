from django.http.response import JsonResponse
import typing

from rest_framework.parsers import JSONParser
from rest_framework import status

from .models import Posts
from .serializers import PostSerializer, PostCreateSerializer
from rest_framework.decorators import api_view


@api_view(['GET', 'POST', 'DELETE'])
def posts(request) -> typing.Any:
    if request.method == 'GET':
        posts = Posts.objects.all()

        title = request.query_params.get('title', None)
        if title is not None:
            posts = posts.filter(title__icontains=title)

        posts_serializer = PostSerializer(posts, many=True)
        return JsonResponse(posts_serializer.data, safe=False)

    elif request.method == 'POST':
        post_data = JSONParser().parse(request)
        posts_create_serializer = PostCreateSerializer(data=post_data)
        if posts_create_serializer.is_valid():
            posts_create_serializer.save()
            return JsonResponse(
                posts_create_serializer.data,
                status=status.HTTP_201_CREATED
            )
        return JsonResponse(
            posts_create_serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    elif request.method == 'DELETE':
        count = Posts.objects.all().delete()
        return JsonResponse(
            {
              'message': '{} Posts were deleted successfully!'.format(count[0])
            },
            status=status.HTTP_204_NO_CONTENT
        )


@api_view(['GET', 'PUT', 'DELETE'])
def post(request, id) -> typing.Any:
    try:
        post = Posts.objects.get(pk=id)
    except Posts.DoesNotExist:
        return JsonResponse(
            {
                'message': 'The post does not exist'
            },
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == 'GET':
        post_serializer = PostSerializer(post)
        return JsonResponse(post_serializer.data)

    elif request.method == 'PUT':
        post_data = JSONParser().parse(request)
        post_serializer = PostCreateSerializer(
            post,
            data=post_data,
            partial=True
        )
        print(post_serializer)
        if post_serializer.is_valid():
            post_serializer.save()
            return JsonResponse(post_serializer.data)
        return JsonResponse(
            post_serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    elif request.method == 'DELETE':
        post.delete()
        return JsonResponse(
            {
                'message': 'Post was deleted successfully!'
            },
            status=status.HTTP_204_NO_CONTENT
        )
