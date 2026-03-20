import camelCase from "lodash/camelCase";
import isPlainObject from "lodash/isPlainObject";
import snakeCase from "lodash/snakeCase";

type JsonLike =
  | null
  | boolean
  | number
  | string
  | JsonLike[]
  | { [key: string]: JsonLike };

const convertObjectKeys = (
  input: unknown,
  converter: (key: string) => string,
): JsonLike => {
  if (Array.isArray(input)) {
    return input.map((item) => convertObjectKeys(item, converter));
  }

  if (isPlainObject(input)) {
    const objectInput = input as Record<string, unknown>;

    return Object.entries(objectInput).reduce<Record<string, JsonLike>>(
      (result, [key, value]) => {
        result[converter(key)] = convertObjectKeys(value, converter);
        return result;
      },
      {},
    );
  }

  return input as JsonLike;
};

export const keysToCamelCase = <T = Object>(input: unknown): T =>
  convertObjectKeys(input, camelCase) as T;

export const keysToSnakeCase = <T = Object>(input: unknown): T =>
  convertObjectKeys(input, snakeCase) as T;
