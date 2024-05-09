/* This schema is define for the Company/client */
import { Schema, model, Model, Document } from "mongoose";
import { UserRole, Gender } from "./interface";

export interface ICompany {
  email: string;
  companyName: string;
  contactName: string;
  gender: Gender;
  password: string;
  companyRole: string;
  phone: number;
  address: string;
  profession: string[];
  isDeleted: boolean;
  role: string;
}

//An interface that describes the properties
// that a company Model has:
interface CompanyModel extends Model<CompanyDoc> {
  builds(attrs: ICompany): CompanyDoc;
}

// An interface that describes the properties
// that a Company Doc has (a single doc ha
export interface CompanyDoc extends Document {
  email: string;
  companyName: string;
  contactName: string;
  companyRole: string;
  gender: Gender;
  password: string;
  phone: number;
  address: string;
  profession: string[];
  role: string;
  isDeleted: boolean;
}

const companySchema = new Schema<CompanyDoc>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: Gender,
  },
  contactName: {
    type: String,
  },
  companyRole: {
    type: String,
  },
  phone: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  profession: {
    type: [String],
    required: true,
  },
  role: {
    type: String,
    default: UserRole.Company,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// for allow typescript checking we need  buildUser function . which enable to check types
companySchema.statics.build = (attrs: ICompany) => {
  return new Company(attrs);
};

const Company = model<CompanyDoc, CompanyModel>("Company", companySchema);

export { Company };
