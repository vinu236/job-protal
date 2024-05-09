export interface IEmail {
  from: {
    name: string;
    email: string;
  };
  to: string | Array<string>;
  subject: string;
  text: string;
  html: string;
  isHtml: boolean;
  attachments?: Array<any>;
  name?: string;
  userName?: string;
}
