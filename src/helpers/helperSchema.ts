  export const professionalDetailSchema = {
    positions: [
      {
        designation: {
          type: String,
          required: true,
        },
        fromDate: {
          type: Date,
          required: true,
        },
        toDate: {
          type: Date,
          required: true,
        },
      },
    ],
    workExperiences: {
      type: String,
      required: true,
    },
  };
