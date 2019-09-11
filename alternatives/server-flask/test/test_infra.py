from src.config import TestConfig


def test_get_config(client):
    response = client.get('/config')
    assert response.status_code == 200
    assert response.mimetype == 'application/json'
    config = response.get_json()
    assert type(config) is dict
    assert 'data' in config
    assert type(config['data']) is dict
    assert 'APP_VERSION' in config['data']
    assert config['data']['APP_VERSION'] == TestConfig.APP_VERSION


def test_get_uptimez(client):
    response = client.get('/uptimez')
    assert response.status_code == 200


def test_get_healthz(client):
    response = client.get('/healthz')
    assert response.status_code == 200
