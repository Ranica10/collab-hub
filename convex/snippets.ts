import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";

export const createSnippet = mutation({
    args: {
        title: v.string(),
        language: v.string(),
        code: v.string(),
    },

    handler: async (ctx, args) => {
        // Need to first check if the user is authenticated 
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new ConvexError("Not authenticated");

        const user = await ctx.db
        .query("users")
        .withIndex("by_user_id")
        .filter(q => q.eq(q.field("userId"), identity.subject))
        .first();

        // Check if the user exists in the database, if not throw an error
        if (!user) throw new ConvexError("User not found");

        // Insert the new snippet into the database
        const snippetId = await ctx.db.insert("snippets", {
            userId: identity.subject,
            userName: user.username || "Unknown User",
            title: args.title,
            language: args.language,
            code: args.code
        });

        return snippetId;
    }
});