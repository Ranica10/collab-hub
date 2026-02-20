import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const syncUser = mutation({
    args: {
        userId: v.string(),
        email: v.string(),
        name: v.string(),
        username: v.string()
    },
    handler: async (ctx, args) => {
        // check if user exists already
        const existingUser =  await ctx.db.query("users")
        .filter(q => q.eq(q.field("userId"), args.userId)) // check if user with the same userId already exists
        .first();

        // If the user doesn't exist, insert them into the database
        if (!existingUser) {
            // save the user to the users table
            await ctx.db.insert("users", {
                userId: args.userId,
                email: args.email,
                name: args.name,
                username: args.username,
                isPro: false, // default to false, can be updated later based on subscription status
            });
        }
    }
})