// Interface that define position details
export interface IPosition {
  designation: string;
  fromDate: Date;
  toDate: Date;
}
// Interface that define professional details
export interface IProfessionalDetail {
  positions: IPosition[];
  workExperiences: string;
}

// enum for user role
export enum UserRole {
  JobSeeker = "JobSeeker", // jobSeeker
  SuperAdmin = "SuperAdmin",
  Company = "Company",
}

export enum Gender {
  Male = "Male",
  Female = "Female",
}
