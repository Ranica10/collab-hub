import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // Table to store user information  
    users: defineTable({
            userId: v.string(), // clerk user id
            email: v.string(),
            name: v.string(),
            isPro: v.boolean(),
            proSince: v.optional(v.number()), // date of when user became pro
            lemonSqueezyCustomerId: v.optional(v.string()), // for subscription management
            lemonSqueezyOrderId: v.optional(v.string()), // for subscription management 
    }).index("by_user_id", ["userId"]), // allows to get user by their clerk user id

    // Table to store code execution for each user
    codeExecutions: defineTable({
        userId: v.string(),
        language: v.string(), // programming language of the code
        code: v.string(), // the code to be executed
        output: v.optional(v.string()), // the output if code execution is successful
        error: v.optional(v.string()), // error message if code execution fails
    }).index("by_user_id", ["userId"]),

    // Table to store code snippets for each user
    snippets: defineTable({
        userId: v.string(),
        title: v.string(),
        language: v.string(),
        code: v.string(),
        userName: v.string(), // store user name for easy retrieval
    }).index("by_user_id", ["userId"]),

    // Table to store comments on code snippets
    snippetComments: defineTable({
        snippetId: v.id("snippets"), // each comment is linked to a specific code snippet
        userId: v.string(), // owner of the comment
        userName: v.string(),
        content: v.string(), // stores HTML content
    }).index("by_snippet_id", ["snippetId"]),

    // Table to store stars for code snippets
    stars: defineTable({
        userId: v.id("users"), // the user who starred the snippet
        snippetId: v.id("snippets"), // the snippet that was starred
    })
    .index("by_user_id", ["userId"])
    .index("by_snippet_id", ["snippetId"])
    .index("by_user_id_and_snippet_id", ["userId", "snippetId"]),
});