import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";

passport.use(new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return done(null, false, { message: "Incorrect email." });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return done(null, false, { message: "Incorrect password." });
		}

		done(null, user);
	} catch (error) {
		done(error);
	}
}));

passport.serializeUser((user, done) => {
	done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById({_id: id});
		if (!user) return done(new Error("User not found"));
		done(null, user);
	} catch (error) {
		done(error);
	}
});
