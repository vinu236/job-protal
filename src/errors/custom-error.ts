// Define an abstract class named CustomError, extending Error
export abstract class CustomError extends Error {
  // Declare an abstract property named statusCode of type number
  abstract statusCode: number;
  // Declare an abstract method named serializeError which returns an object
  // with a message property of type string and an optional field property of type string
  abstract serializeError(): { message: string; field?: string };
}
