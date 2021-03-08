def test_get_uptimez(client):
    response = client.get('/uptimez/')
    assert response.status_code == 200


def test_get_healthz(client):
    response = client.get('/healthz/')
    assert response.status_code == 200
