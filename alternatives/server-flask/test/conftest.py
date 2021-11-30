import os
import pytest
import requests
from urllib.parse import urljoin


@pytest.fixture
def client():
    with BaseUrlSession() as session:
        yield session


class BaseUrlSession(requests.Session):
    """Url-prefixed requests.Session class.

    Based on requests_toolbelt.sessions.BaseUrlSession.
    """

    base_url = os.environ["TEST_API_URL"]

    def __init__(self):
        super().__init__()
        if not self.base_url.endswith("/"):
            # urljoin is pretty exact about the slash use
            self.base_url = f"{self.base_url}/"

    def request(self, method, url, *args, **kwargs):
        """Send the request after generating the complete URL."""
        url = self.create_url(url)
        return super().request(method, url, *args, **kwargs)

    def create_url(self, url):
        """Create the URL based off this partial path."""
        if url.startswith("http://") or url.startswith("https://"):
            return url
        if url.startswith("/"):
            # urljoin is pretty exact about the slash use
            url = url[1:]
        return urljoin(self.base_url, url)
