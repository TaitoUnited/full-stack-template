import { isNil } from 'lodash';
import { useParams } from 'react-router-dom';

/**
 * Hook to get typesafe and properly casted params from the URL.
 * You can use this hook instead of `useParams` from React Router when you
 * need to access to url params that you know are defined based on the route
 * context, eg. if you are in a route like `/companies/:companyId` you know
 * that `companyId` will always be defined.
 *
 * @example
 * const { companyId } = useRequiredParams({ companyId: "number" });
 */
export function useRequiredParams<
  T extends Record<string, 'string' | 'number'>,
>(options: T) {
  const params = useParams();

  // Validate and cast params based on the provided paramTypes
  const castedParams = Object.entries(options).reduce((acc, [key, type]) => {
    const paramValue = params[key];

    // Check if the param exists
    if (isNil(paramValue)) {
      throw new Error(`Missing required parameter: ${key}`);
    }

    // Attempt to cast the param to the specified type
    acc[key] = type === 'number' ? Number(paramValue) : paramValue;

    return acc;
  }, {} as any);

  return castedParams as {
    [K in keyof T]: T[K] extends 'number' ? number : string;
  };
}
