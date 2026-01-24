import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { ENV } from "./env";
import { User } from "../modules/users/user.model";
import { signToken } from "../utils/jwt";

passport.use(
  new GoogleStrategy(
    {
      clientID: ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
      callbackURL: ENV.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile: Profile, done) => {
      try {
        const existingUser = await User.findOne({ email: profile.emails?.[0].value });
        if (existingUser) return done(null, existingUser);

        const newUser = await User.create({
          name: profile.displayName,
          email: profile.emails?.[0].value,
          provider: "google",
          avatarUrl: profile.photos?.[0].value,
          country: profile._json?.locale || "India",
        });
        done(null, newUser);
      } catch (error) {
        done(error, undefined);

      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
