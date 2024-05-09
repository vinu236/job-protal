import { CustomError } from "./custom-error";

// Define the BadRequestError class, extending CustomError
// bad request error will properties and methods from the customError base class
export class BadRequestError extends CustomError {
  // receiving the message and statusCode when instantiate new badRequest error class
  // statusCode set to 400 (Bad-request) if no status code is not passed
  constructor(public message: string, public statusCode: number = 400) {
    // Call the constructor of the superclass which is CustomError class
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  // Define the serializeError method
  serializeError() {
    return { message: this.message };
  }
}
