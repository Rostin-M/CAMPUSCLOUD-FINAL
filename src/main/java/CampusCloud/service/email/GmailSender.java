package CampusCloud.service.email;

import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.model.Message;

import javax.mail.*;
import javax.mail.internet.*;

import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.Properties;

public class GmailSender {

    public static void sendEmail(String to, String subject, String bodyText) throws Exception {
        Gmail service = GmailServiceFactory.getGmailService();

        MimeMessage email = createEmail(to, "me", subject, bodyText);
        Message message = createMessageWithEmail(email);

        service.users().messages().send("me", message).execute();
        System.out.println("📨 Correo enviado a: " + to);
    }

    private static MimeMessage createEmail(String to, String from, String subject, String bodyHtml)
            throws MessagingException {
        Properties props = new Properties();
        Session session = Session.getDefaultInstance(props, null);

        MimeMessage email = new MimeMessage(session);
        email.setFrom(new InternetAddress(from));
        email.addRecipient(javax.mail.Message.RecipientType.TO, new InternetAddress(to));
        email.setSubject(subject);
        email.setContent(bodyHtml, "text/html; charset=utf-8");
        return email;
    }

    private static Message createMessageWithEmail(MimeMessage emailContent) throws Exception {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        emailContent.writeTo(buffer);
        byte[] bytes = buffer.toByteArray();
        String encodedEmail = Base64.getUrlEncoder().encodeToString(bytes);
        Message message = new Message();
        message.setRaw(encodedEmail);
        return message;
    }
}
