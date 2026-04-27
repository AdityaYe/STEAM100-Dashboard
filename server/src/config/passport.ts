import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
} from "passport-google-oauth20";

import { User } from "../models/User.models";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "/api/auth/google/callback",
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done
    ) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(null, false);
        }

        let user = await User.findOne({ email });

        if (user) {
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
        } else {
          user = await User.create({
            username: profile.displayName,
            email,
            googleId: profile.id,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);