
use('mongodbVSCodePlaygroundDB');

// Insert a few documents into the sales collection.

/* db.getCollection('users').findOneAndUpdate(
  { _id: ObjectId("663768b920d0a3dca5787438") },
  { $set: { email: "ajithvinu26@gmail.com" } },
  { 
    returnOriginal: false,
    projection: { email: 1, _id: 0 }, // Only return the email field
    upsert: true // Create a new document if it doesn't exist
  }
) */

db.getCollection("users").find()

const professionalDetails ={
  "positions": [
    {
      "designation": "Software Engineer",
      "fromDate": "2020-01-01",
      "toDate": "2022-12-31"
    },
    {
      "designation": "Senior Software Engineer",
      "fromDate": "2023-01-01",
      "toDate": "2024-12-31"
    }
  ],
  "workExperiences": "6 years"
}

db.getCollection('users').findOneAndUpdate(
  { _id: ObjectId("663768b920d0a3dca5787438") },
  { $set: {professionalDetails:professionalDetails} },
  { new: true }
)



// Run a find command to view items sold on April 4th, 2014.

