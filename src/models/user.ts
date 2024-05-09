/* This schema is define for the Customer/Jobseeker */
import { Schema, model, Model, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { professionalDetailSchema } from "../helpers/helperSchema";
import { Gender, IProfessionalDetail, UserRole } from "./interface";
// An interface that describes the properties
// that are required to create a new User
export interface IUser {
  email: string;
  password: string;
  dob: Date;
  phone: number;
  gender: Gender;
  isDeleted: boolean;
  fullName: string;
  addressNoOne: string;
  addressNoTwo: string;
  profilePic: string;
  role: string;
  referralCode: string;
  isProfileCompleted: boolean;
  professionalDetails: IProfessionalDetail;
  files:string[]
}

//An interface that describes the properties
// that a User Model has:
interface UserModel extends Model<UserDoc> {
  build(attrs: IUser): UserDoc; // return UserDoc
}

// An interface that describes the properties
// that a User Doc has (a single doc has)
export interface UserDoc extends Document {
  email: string;
  password: string;
  dob: Date;
  gender: Gender;
  phone: number;
  isDeleted: boolean;
  fullName: string;
  addressNoOne: string;
  addressNoTwo: string;
  role: string;
  profilePic: string;
  referralCode: string;
  isProfileCompleted: boolean;
  professionalDetails: IProfessionalDetail;
  files:string[]
}

// Define user schema
const userSchema = new Schema<UserDoc>(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: Gender,
    },
    fullName: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    addressNoOne: {
      type: String,
    },
    addressNoTwo: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: UserRole.JobSeeker,
    },
    profilePic: String,
    professionalDetails: professionalDetailSchema,
    referralCode: {
      type: String,
    },
    files:{
      type:[String],
    }
  },
  { timestamps: true }
);

// Middleware pre hook: before saving to db, hash the password
userSchema.pre("save", async function (next) {
  // Check if the password field is modified
  if (this.isModified("password")) {
    try {
      // Generate a salt and hash the password
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.password, salt);

      // Replace the plain password with the hashed one
      this.password = hash;
    } catch (error) {
      // If an error occurs during hashing, pass it to the next middleware
      next(error as Error); // Cast error to Error type;
    }
  }

  // Move to the next middleware
  next();
});

// for allow typescript checking we need  buildUser function . which enable to check types
userSchema.statics.build = (attrs: IUser) => {
  return new User(attrs);
};

//Mongoose give userModal => the modal function return second generic type UserModal
const User = model<UserDoc, UserModel>("User", userSchema);

export { User };
