import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, MACHINE_URL } from './config';

const User = mongoose.model('User');

// SerializeUser is used to provide some identifying token that can be saved
// in the users session.  We traditionally use the 'ID' for this.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// The counterpart of 'serializeUser'.  Given only a user's ID, we must return
// the user object.  This object is placed on 'req.user'.
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

/*
 * Local auth system setup.
 */

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: true,
      passReqToCallback: true
    },
    (req, email, password, done) => {
      User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, 'Invalid Credentials');
        }
        user.comparePassword(password, (err, isMatch) => {
          if (err) {
            return done(err);
          }
          if (isMatch) {
            return done(null, user);
          }
          return done(null, false, 'Invalid credentials.');
        });
      });
    }
  )
);

// Creates a new user account.  We first check to see if a user already exists
// with this email address to avoid making multiple accounts with identical addresses
// If it does not, we save the existing user.  After the user is created, it is
// provided to the 'req.logIn' function.  This is apart of Passport JS.
// Notice the Promise created in the second 'then' statement.  This is done
// because Passport only supports callbacks, while GraphQL only supports promises
// for async code!  Awkward!
const signInWithLocal = ({ email, password, fullname, req }) => {
  if (req.user)
    throw new Error('Debes cerrar la sesión actual para registrarte.');

  const user = new User({ email, password, fullname, accountType: 'local' });
  if (!email || !password || !fullname) {
    throw new Error('Debes indicar email, password y nombre completo.');
  }

  return User.findOne({ email })
    .then(existingUser => {
      if (existingUser) {
        throw new Error('El correo indicado ya se encuentra registrado');
      }
      return user.save();
    })
    .then(user => {
      return new Promise((resolve, reject) => {
        req.logIn(user, err => {
          if (err) {
            reject(err);
          }
          resolve(user);
        });
      });
    });
};

// Logs in a user.  This will invoke the 'local-strategy' defined above in this
// file. Notice the strange method signature here: the 'passport.authenticate'
// function returns a function, as its indended to be used as a middleware with
// Express.  We have another compatibility layer here to make it work nicely with
// GraphQL, as GraphQL always expects to see a promise for handling async code.
const loginWithLocal = ({ email, password, req }) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('local', (err, user) => {
      if (!user) {
        reject('Invalid credentials.');
      }

      req.logIn(user, () => resolve(user));
    })({ body: { email, password } });
  });
};

/*
 * Google OAuth API Config.
 */

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: MACHINE_URL+'/auth/google/callback',
      proxy: true
    },
    async function(accessToken, refreshToken, profile, done) {
      const existingUser = await User.findOne({
        email: profile.emails[0].value
      });

      if (existingUser) {
        return done(null, existingUser);
      }

      const userData = {
        email: profile.emails[0].value,
        fullname: profile.displayName,
        accountType: 'google',
        image: profile.photos[0].value.replace('?sz=50', '')
      };

      try {
        const user = await new User(userData).save();
        done(null, user);
      } catch (e) {
        console.log(e.message);
      }
    }
  )
);

/*
 * Module exports.
 */

export { signInWithLocal, loginWithLocal };
