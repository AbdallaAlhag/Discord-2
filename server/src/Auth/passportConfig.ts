import passport from "passport";
import prisma from "../db/prisma";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}
// JWT Strategy for protected routes
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    // jwtPayload is the decoded JWT payload
    async (
      jwtPayload: { id: any },
      done: (
        arg0: unknown,
        arg1:
          | boolean
          | {
              id: string;
              username: string;
              email: string;
              password: string;
              avatarUrl: string | null;
              createdAt: Date;
            }
      ) => any
    ) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: jwtPayload.id },
        });

        return user ? done(null, user) : done(null, false);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;
