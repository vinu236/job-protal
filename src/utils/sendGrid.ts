// Import the necessary types and modules
import sgMail from "@sendgrid/mail";
import { BadRequestError } from "../errors/badRequestError";
import { IEmail } from "../helpers/interface";

// Define the sendMail function
export const sendMail = async (data: IEmail) => {
  try {
    // Destructure the data object to extract email properties
    const { from, to, subject, text, html, isHtml, attachments = [] } = data;

    // Create the message object based on whether the email is HTML or plain text
    const msg = isHtml
      ? {
          to,
          from,
          subject,
          html,
          attachments,
        }
      : {
          from,
          to,
          subject,
          text,
        };

    // Send the email using sgMail.send method
    const repSendMail = await sgMail.send(msg);
    console.log("Successfully sent email to", to);
  } catch (error) {
    // If an error occurs, call the next middleware function with a BadRequestError
    throw new BadRequestError("Error on sending email", 404);
  }
};
