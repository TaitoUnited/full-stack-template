import sys
from setuptools import find_packages, setup


# Workaround for being able to provide "--version=1" on the command
# line when building the app.
number_of_arguments = len(sys.argv)
version_parameter = sys.argv[-1]
version = version_parameter.split("=")[1]
sys.argv = sys.argv[:-1]


setup(
    name="full-stack-template-server",
    version=version,
    packages=find_packages(),
    include_package_data=False,
    zip_safe=False,
    install_requires=[
        "django",
        "psycopg2-binary",
        "pydantic",
        "python-json-logger",
        "uwsgi",
        "uwsgidecorators",
    ],
    extras_require={"test": ["pytest"]},
)
