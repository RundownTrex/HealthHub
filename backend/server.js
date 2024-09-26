const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cron = require("node-cron");
const admin = require("firebase-admin");
const { format, parse, addMinutes, isWithinInterval } = require("date-fns");

const userRooms = {};

const app = express();
app.use(cors());

const server = http.createServer(app);

const serviceAccount = require("./healthhub-2cbba-firebase-adminsdk-aej53-cb62774064.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

const sendNotification = async (recipientId, message, title, pfp) => {
  try {
    const userDoc = await firestore.collection("users").doc(recipientId).get();
    const userData = userDoc.data();
    const fcmToken = userData.fcmToken;

    console.log("Receivers pfp: ", pfp);

    if (fcmToken) {
      const notificationMessage = {
        notification: {
          title: title,
          body: message,
          image: pfp,
        },
        token: fcmToken,
      };

      await admin.messaging().send(notificationMessage);
      console.log("Notification sent successfully");
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

const recentChatsCollection = firestore.collection("recentChats");

recentChatsCollection.onSnapshot((snapshot) => {
  snapshot.docChanges().forEach(async (change) => {
    if (change.type === "modified") {
      const chatData = change.doc.data();

      const doctorUnread = chatData.doctorUnread;
      const patientUnread = chatData.patientUnread;
      const latestMessage = chatData.latestMessage;
      const patientId = chatData.patientId;
      const doctorId = chatData.doctorId;
      const chatId = `${patientId}_${doctorId}`;

      const doctorConnected = Object.values(userRooms).some(
        (user) => user.userId === doctorId && user.chatId === chatId
      );

      const patientConnected = Object.values(userRooms).some(
        (user) => user.userId === patientId && user.chatId === chatId
      );

      if (doctorUnread > 0 && !doctorConnected) {
        await sendNotification(
          doctorId,
          `${latestMessage}`,
          chatData.patientName,
          chatData.patientPfp
        );
      }

      if (patientUnread > 0 && !patientConnected) {
        await sendNotification(
          patientId,
          `${latestMessage}`,
          chatData.doctorName,
          chatData.doctorPfp
        );
      }
    }
  });
});

cron.schedule("* * * * *", async () => {
  console.log("Checking for upcoming appointments...");

  const now = new Date();
  const thirtyMinutesLater = addMinutes(now, 30);
  const tenMinutesLater = addMinutes(now, 10);

  try {
    const appointmentsSnapshot = await firestore
      .collection("appointments")
      .get();

    if (!appointmentsSnapshot.empty) {
      appointmentsSnapshot.forEach((doc) => {
        const appointment = doc.data();

        // if (appointment.reminderSent && appointment.doctorReminder) {
        //   return;
        // }

        const appointmentDateTimeStr = `${appointment.appointmentDate} ${appointment.slotTime}`;
        const appointmentDateTime = parse(
          appointmentDateTimeStr,
          "yyyy-MM-dd hh:mm a",
          new Date()
        );

        if (
          !appointment.reminderSent &&
          isWithinInterval(appointmentDateTime, {
            start: now,
            end: thirtyMinutesLater,
          })
        ) {
          firestore
            .collection("users")
            .doc(appointment.patientId)
            .get()
            .then((userDoc) => {
              const userData = userDoc.data();
              const fcmToken = userData.fcmToken;

              // Fetch doctor's firstName and lastName
              firestore
                .collection("users")
                .doc(appointment.doctorId)
                .get()
                .then((docDoc) => {
                  const doctorData = docDoc.data();
                  const doctorName = `${doctorData.firstname} ${doctorData.lastname}`;

                  if (fcmToken) {
                    const message = {
                      notification: {
                        title: "Appointment Reminder",
                        body: `Your appointment is in 30 minutes with Dr. ${doctorName}`,
                      },
                      token: fcmToken,
                    };

                    admin
                      .messaging()
                      .send(message)
                      .then(async (response) => {
                        await firestore
                          .collection("appointments")
                          .doc(doc.id)
                          .update({ reminderSent: true });
                        console.log("Successfully sent message:", response);
                      })
                      .catch((error) => {
                        console.error("Error sending message:", error);
                      });
                  }
                });
            });
        }

        if (
          !appointment.doctorReminder &&
          isWithinInterval(appointmentDateTime, {
            start: now,
            end: tenMinutesLater,
          })
        ) {
          firestore
            .collection("users")
            .doc(appointment.doctorId)
            .get()
            .then((doctorDoc) => {
              const doctorData = doctorDoc.data();
              const fcmToken = doctorData.fcmToken;

              firestore
                .collection("users")
                .doc(appointment.patientId)
                .get()
                .then((patDoc) => {
                  const patientData = patDoc.data();
                  const patientName = `${patientData.firstname} ${patientData.lastname}`;

                  if (fcmToken) {
                    const message = {
                      notification: {
                        title: "Upcoming Appointment",
                        body: `You have an appointment in 10 minutes with ${patientName}`,
                      },
                      token: fcmToken,
                    };

                    admin
                      .messaging()
                      .send(message)
                      .then(async (response) => {
                        await firestore
                          .collection("appointments")
                          .doc(doc.id)
                          .update({ doctorReminder: true });
                        console.log(
                          "Successfully sent doctor reminder:",
                          response
                        );
                      })
                      .catch((error) => {
                        console.error("Error sending doctor reminder:", error);
                      });
                  }
                });
            });
        }
      });
    } else {
      console.log("No upcoming appointments within 30 minutes.");
    }
  } catch (error) {
    console.error("Error fetching appointments:", error);
  }
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (chatId, userId) => {
    socket.join(chatId);
    userRooms[socket.id] = { chatId, userId };
    console.log(`User joined chat room: ${chatId} (User ID: ${userId})`);
  });

  socket.on("userTyping", ({ chatId, userId, isTyping }) => {
    socket.to(chatId).emit("userTyping", {
      chatId,
      userId,
      isTyping,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    delete userRooms[socket.id];
    console.log(`User removed from userRooms: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
