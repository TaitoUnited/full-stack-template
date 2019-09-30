def test_get_posts(client):
    response = client.get('/posts')
    assert response.status_code == 200
    assert response.headers['Content-Type'] == 'application/json'
    data = response.json()
    assert type(data) is dict
    assert 'data' in data
    assert type(data['data']) is list
