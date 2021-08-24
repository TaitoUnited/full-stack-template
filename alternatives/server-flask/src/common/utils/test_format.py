from .formatters import to_camel, to_snake


snake_dict = {"dict_key": 1}
camel_dict = {"dictKey": 1}


def test_common_formatters_to_camel() -> None:
    assert to_camel(snake_dict) == camel_dict


def test_common_formatters_to_snake() -> None:
    assert to_snake(camel_dict) == snake_dict
