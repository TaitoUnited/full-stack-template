def test_get_posts(client):
    response = client.get('/posts')
    assert response.status_code == 200
    assert response.mimetype == 'application/json'
    data = response.get_json()
    assert type(data) is dict
    assert 'data' in data
    assert type(data['data']) is list
