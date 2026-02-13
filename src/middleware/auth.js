// middleware/auth.js
import { supabaseAnon } from "../supabase.js";

export const requireAuth = async (req, res, next) => {
    const auth = req.headers.authorization;

    if (!auth) {
        return res.status(401).json({ error: "No Authorization header" });
    }

    const token = auth.replace("Bearer ", "");

    const { data, error } = await supabaseAnon.auth.getUser(token);

    if (error || !data.user) {
        return res.status(401).json({ error: "Invalid token" });
    }

    req.user = data.user;
    next();
};
