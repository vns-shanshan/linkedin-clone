import { mailtrapClient, sender } from "../lib/mailtrap.js";
import { createWelcomeEmailTemplate, createCommentNotificationEmailTemplate } from "./emailTemplates.js";

export const sendWelcomeEmail = async (email, name, profileUrl) => {
    const recipient = [{ email }]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Welcome to UnLinked ",
            html: createWelcomeEmailTemplate(name, profileUrl),
            category: "welcome"
        });

        console.log("Welcome email sent successfully:", response);
    } catch (error) {
        throw error;
    }
}

export const sendCommentNotificationEmail = async (recipientEmail, recipientName, commenterName, postUrl, commentContent) => {
    const recipient = [{ email: recipientEmail }]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "New Comment on Your Post",
            html: createCommentNotificationEmailTemplate(recipientName, commenterName, postUrl, commentContent),
            category: "comment_notification"
        })

        console.log("Comment notification email sent successfully:", response);
    } catch (error) {
        throw error;
    }
}