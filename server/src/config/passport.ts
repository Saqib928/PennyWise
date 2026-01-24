import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { ENV } from "./env";
import { User } from "../modules/users/user.model";

passport.use(
  new GoogleStrategy(
    {
      clientID: ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
      callbackURL: ENV.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile: Profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(null, false);

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            provider: "google",
            avatarUrl: profile.photos?.[0]?.value,
            country: profile._json?.locale || "India",
          });
        }

        done(null, { id: user.id, email: user.email || undefined });
      } catch (err) {
        done(err, false);
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
    if (!user) return done(null, false);
    done(null, { id: user.id, email: user.email || undefined });
  } catch (err) {
    done(err, false);
  }
});

export default passport;
