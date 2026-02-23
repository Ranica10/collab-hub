import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Function to sync user data from Clerk to Convex database
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
});

// Function to get user data from Convex database based on userId
export const getUser = query({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        if (!args.userId) return null; // if no userId is provided, return null

        const user = await ctx.db.query("users") // query the users table
        .withIndex("by_user_id") // query using the userId index
        .filter(q => q.eq(q.field("userId"), args.userId)) // filter to find the user with the matching userId
        .first(); // get the first (and should be only) result

        if (!user) return null; // if no user is found, return null

        return user;
    }
})