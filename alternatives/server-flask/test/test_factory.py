from src import create_app
from src.config import TestConfig


def test_config():
    assert not create_app().testing
    assert create_app(TestConfig).testing
