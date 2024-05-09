import passport from "passport";
import passportJwt from "passport-jwt";
import dotenv from "dotenv";
import { User, UserDoc } from "../models/user";

// load env=> to accessing env variables
dotenv.config();
//load env variables
const SECRET_KEY = process.env.JWT_SECRET;

// create a jwt strategy for user authentication, (2 arguments)
const userAuthStrategy = new passportJwt.Strategy(
  {
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET_KEY as string,
    passReqToCallback: true,
  },
  // call back function is executing
  async (request: any, payload: any, done: any) => {
    try {
      // finding the user on the db based on the payload information
      // return either UserDoc type or null (if the user is not present)
      const user: UserDoc | null = await User.findOne({
        _id: payload._id,
      }).lean();

      // if the user is not present  sending err response
      if (!user) return done(null, false, { message: "User not found !" });
    } catch (error) {
      return done(error, false, { message: "Unauthorized" });
    }
  }
);

// Use the created strategy with Passport
passport.use(userAuthStrategy);

export default passport;
