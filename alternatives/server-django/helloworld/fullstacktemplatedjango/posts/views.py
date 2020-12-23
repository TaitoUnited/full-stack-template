from django.http import HttpResponse

def get_all_posts() -> typing.Any:
    posts = service.get_all_posts()
    return HttpResponse({'data': transforms.post_server_to_client(posts)})


def create_post() -> typing.Any:
    request_data = request.get_json()
    post_data = transforms.post_client_to_server(request_data['data'])
    post = service.create_post(post_data)
    return {'data': transforms.post_server_to_client(post)}, 201
