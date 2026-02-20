import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { api, internal } from "./_generated/api";

const http = httpRouter();

http.route({    
    path: "/clerk-webhook",
    method: "POST",

    handler: httpAction(async (ctx, request) => {
        // Validate the webhook secret is set in the environment variables
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        if (!webhookSecret) {
            throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
        }

        const svix_id = request.headers.get("svix-id");
        const svix_signature = request.headers.get("svix-signature");
        const svix_timestamp = request.headers.get("svix-timestamp");
        
        // Validate the presence of the required Svix headers to ensure they are sent by Clerk
        if (!svix_id || !svix_signature || !svix_timestamp) {
            return new Response("Error occurred -- no svix headers", {
                status: 400,
            });
        }
        
        // Read the request body as JSON and convert it to a string for verification
        const payload = await request.json();
        const body = JSON.stringify(payload);

        const wh = new Webhook(webhookSecret);
        let evt: WebhookEvent;

        try {
            evt = wh.verify(body, {
                "svix-id": svix_id,
                "svix-signature": svix_signature,
                "svix-timestamp": svix_timestamp,
            }) as WebhookEvent;
        } catch (err) {
            console.error("Error verifying webhook:", err);
            return new Response("Error occured:", { status: 400 });
        }

        const eventType = evt.type;

        // Handle the "user.created" event to save the user to the Convex database
        if (eventType === "user.created") {
            // save the user to the convex database
            const {id, email_addresses, first_name, last_name, username} = evt.data;

            // get primary email address
            const email = email_addresses[0].email_address;

            // save name into a single field
            const name = `${first_name || ""} ${last_name || ""}`.trim();

            try {
                // save user to database
                await ctx.runMutation(api.users.syncUser, {
                    userId: id,
                    email,
                    name,
                    username: username || ""
                })
            } catch (err) {
                console.log("Error saving user to database:", err);
                return new Response("Error creating user", { status: 500 });
            }
        }

        return new Response("Webhook processed successfully", { status: 200 });
    })
})

export default http;