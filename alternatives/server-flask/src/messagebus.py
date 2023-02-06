from dataclasses import dataclass
from inspect import signature, Parameter
from logging import getLogger
from typing import Any, Callable, ParamSpec, Protocol, TypeVar

from makefun import wraps
from punq import Container, MissingDependencyError


Interface = Any
T_Interface = TypeVar("T_Interface", bound=Interface)
Message = Any
Resource = Any


class Handler(Protocol):
    """Handler protocol."""

    def handle(self, msg: Message) -> None:
        pass


Runnable_P = ParamSpec("Runnable_P")
Runnable_R = TypeVar("Runnable_R")


@dataclass(frozen=True)
class Recap:
    """Recap of the message passing that happened."""

    message: Message
    queue: list["Recap"]



NOT_FOUND = object()

def get_conf_val(conf: dict[str, Any], key: str) -> Any:
    """Do case-insensitive search of config value."""
    if key in conf:
        return conf[key]
    elif key.upper() in conf:
        return conf[key.upper()]
    return NOT_FOUND


class Messagebus:
    """Taking your code for a spin.

    A platform for passing messages,
    a utility for running functions and locating resources.

    With dependency injection.

    The way this works is you
    1. register your resources and message handlers,
    2. and, either
        a. start passing messages, or
        b. run functions, or
        c. locate resources.

    Resources are the dependencies that get injected. Resources may depend
    on other resources. Resources are injected on type-basis.
    Config parameters are also considered as dependencies,
    but are injected on name-basis.

    Handlers take care of dealing with messages. A single message may be
    delivered to multiple handlers. A handler is always instantiated anew
    upon receiving a message.

    Some shortcomings:
    * The used DI-framework (punq) doesn't support overriding a previously
      registered resource and instead you can register multiple resources
      for a single interface. This is somewhat cumbersome because you can't
      override e.g. DB resource in tests with a dummy-service, which in turn
      means you can't use the same bootstrapping mechanism in tests as in
      production.
    * The used DI-framework (punq) doesn't support resolving dependencies
      for a function (you can only instantiate classes), so we need to
      construct a class from any function that's provided to the runner.
    """

    def __init__(self, config: dict[str, Any]) -> None:
        self.logger = getLogger(self.__class__.__name__)
        self.config = config
        self.container = Container()

    def register_resource(
        self,
        resource: Resource,
        interface: Interface | None = None,
        singleton: bool = False,
        **resource_kwargs: Any,
    ) -> None:
        """Register a resource.

        Each resource provides some service, defined by an interface.
        The interface can be provided explicitly
        when registering a resource, else it will be inferred
        from a "Interface" -class variable,
        and if the class variable is not present
        then the resource itself is used as the interface.

        The initialization argument resolving goes like:
        1. provided arguments when registering the resource
        2. check the config for arguments on name-basis
        3. resolve dependencies from the registered resources on type-basis

        Arguments:
            resource: The resource.
            interface: Optionally pass in the service interface.
            singleton: Boolean indicating if this resource is a singleton.
            resource_kwargs: Keyword arguments to pass to the resource.
        """
        if interface is None:
            interface = getattr(resource, "Interface", resource)

        if singleton:
            self.container.register(interface, instance=resource)
        else:
            config_kwargs = {
                param.name: param.annotation(val)
                for param in signature(resource).parameters.values()
                if (val := get_conf_val(self.config, param.name)) is not NOT_FOUND
            }
            self.container.register(
                interface,
                resource,
                **(config_kwargs | resource_kwargs),
            )

        self.logger.info(
            f"Registered {'singleton ' if singleton else ''}"
            f"{resource} for interface {interface}"
        )

    def register_handler(
        self,
        handler_cls: type[Handler],
        **handler_kwargs: Any,
    ) -> None:
        """Register a handler.

        The message the handler will be registered for
        is interpreted from the handler's handle-method's
        first parameter's type.

        The initialization argument resolving goes like:
        1. provided arguments when registering the handler
        2. check the config for arguments on name-basis (case insensitive)
        3. resolve dependencies from the registered resources on type-basis

        Arguments:
            handler_cls: The handler factory.
            handler_kwargs: Keyword arguments to pass to the handler.
        """
        try:
            msg_cls = next(
                param.annotation
                for param in signature(handler_cls.handle).parameters.values()
                if param.name == "msg"
            )
        except StopIteration:
            self.logger.error(
                f"Could not infer the message for the handler: {handler_cls}"
            )
            return None


        config_kwargs = {
            param.name: param.annotation(val)
            for param in signature(handler_cls).parameters.values()
            if (val := get_conf_val(self.config, param.name)) is not NOT_FOUND
        }
        self.container.register(
            msg_cls,
            handler_cls,
            **(config_kwargs | handler_kwargs),
        )

        self.logger.info(f"Registered {handler_cls} for message {msg_cls}")

    def run(
        self,
        runnable: Callable[Runnable_P, Runnable_R],
        **runnable_kwargs: Any,
    ) -> Runnable_R:
        """Inject arguments, run and return the result.

        The given runnable is called with the given keyword arguments
        and the output is returned.

        The argument resolving goes like:
        1. provided arguments
        2. check the config for arguments on name-basis (case insensitive)
        3. resolve dependencies from the registered resources on type-basis

        Arguments:
            runnable: Any callable object.
            runnable_kwargs: Keyword arguments for the runnable.

        Returns:
            The output from the given runnable.
        """
        # Since we need to copy the runnable's signature
        # to a class __init__-method, we need to include
        # the "self" in there.
        runnable_sig = signature(runnable)
        params = list(runnable_sig.parameters.values())
        params.insert(0, Parameter("self", kind=Parameter.POSITIONAL_ONLY))
        runner_sig = runnable_sig.replace(parameters=params)

        class Runner:
            """Ad-hoc class to wrap the runnable function.

            The punq.Container allows only instantiating classes
            and thus we need to construct a class whose __init__
            signature matches that of the given runnable,
            which is handled by the wraps-decorator.
            """

            @wraps(runnable, new_sig=runner_sig)
            def __init__(
                self,
                *args: Runnable_P.args,
                **kwargs: Runnable_P.kwargs,
            ) -> None:
                self.args = args
                self.kwargs = kwargs

            def __call__(self) -> Runnable_R:
                return runnable(*self.args, **self.kwargs)

        config_kwargs = {
            param.name: param.annotation(val)
            for param in signature(runnable).parameters.values()
            if (val := self.config.get(param.name))
        }
        runner: Runner = self.container.instantiate(
            Runner,
            **(config_kwargs | runnable_kwargs),
        )
        return runner()

    def handle(self, msg: Message) -> Recap:
        """Pass the message to all interested parties.

        Call each registered handlers for the message.

        Arguments:
            msg: The message to deliver.

        Returns:
            A recap of what happened.
        """
        self.logger.debug(f"Message received: {msg}")

        queue: list[Message] = []
        handlers: list[Handler] = self.container.resolve_all(type(msg))
        for handler in handlers:
            self.logger.debug(f"Found handler: {handler}")
            handler.handle(msg)

            self.logger.debug("Collecting events")
            queue += getattr(handler, "messages", [])

        self.logger.debug(f"Message delivered, processing queue")

        return Recap(
            message=msg,
            queue=[self.handle(message) for message in queue],
        )

    def resolve(self, interface: type[T_Interface]) -> T_Interface:
        """Resolve implementation for the given interface.

        If the interface is not registered a RuntimeError is raised.

        Arguments:
            interface: A previously registered interface.

        Returns:
            The registered implementation for the interface.
        """
        try:
            return self.container.resolve(interface)
        except MissingDependencyError as exc:
            raise RuntimeError("Unable to resolve interface") from exc

