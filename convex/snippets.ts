import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

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

export const getSnippets = query({
    handler: async (ctx) => {
        const snippets = await ctx.db.query("snippets")
        .order("desc") // order by creation time, newest first
        .collect();

        return snippets;
    }
})

export const isSnippetStarred = query({
    args: {
        snippetId: v.id("snippets") // ensure the snippetId is a valid ID for the snippets table
    },

    handler: async (ctx, args) => {
        // Check if the user is authenticated
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return false; // if not authenticated, return false b/c it is not being starred by the user
        
        const star = await ctx.db.query("stars")
        .withIndex("by_user_id_and_snippet_id")
        .filter( // check if there is a star for this user and snippet
            (q) => q.eq(q.field("userId"), identity.subject) && q.eq(q.field("snippetId"), args.snippetId) 
        )
        .first();

        return !!star; // return true if a star is found, false otherwise
    }
})

export const getSnippetStarCount = query({
  args: { snippetId: v.id("snippets") },
  handler: async (ctx, args) => {
    const stars = await ctx.db
      .query("stars")
      .withIndex("by_snippet_id")
      .filter((q) => q.eq(q.field("snippetId"), args.snippetId))
      .collect();

    return stars.length;
  },
});