import re
import typing


def to_camel(d: typing.Dict[str, typing.Any]) -> typing.Dict[str, typing.Any]:
    """Converts dictionary keys from snake case to camel case.
    """
    def convert(key: str) -> str:
        parts = key.split('_')
        return parts[0] + ''.join(part.capitalize() for part in parts[1:])
    return {convert(k): v for k, v in d.items()}


def to_snake(d: typing.Dict[str, typing.Any]) -> typing.Dict[str, typing.Any]:
    """Converts dictionary keys from camel case to snake case.
    """
    def convert(key: str) -> str:
        camel = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', key)
        return re.sub('([a-z0-9])([A-Z])', r'\1_\2', camel).lower()
    return {convert(k): v for k, v in d.items()}
