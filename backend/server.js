require("dotenv").config({ path: "../.env" });

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cron = require("node-cron");
const admin = require("firebase-admin");
const {
  format,
  parse,
  addMinutes,
  isWithinInterval,
  parseISO,
  isBefore,
} = require("date-fns");

const userRooms = {};

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// const serviceAccount = require("./healthhub-2cbba-firebase-adminsdk-aej53-cb62774064.json");
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

const sendNotification = async (recipientId, message, title, pfp) => {
  try {
    console.log("Trying to send notification here!");
    const userDoc = await firestore.collection("users").doc(recipientId).get();
    const userData = userDoc.data();
    const fcmToken = userData.fcmToken;

    console.log("Receivers pfp: ", pfp);

    if (fcmToken) {
      const notificationMessage = {
        notification: {
          title: title,
          body: message,
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

const isPastDate = (dateStr) => {
  const slotDate = parseISO(dateStr);
  const today = new Date();

  const slotDay = new Date(slotDate.setHours(0, 0, 0, 0));
  const todayDay = new Date(today.setHours(0, 0, 0, 0));

  return isBefore(slotDay, todayDay);
};
const deleteOldSlots = async () => {
  try {
    const profileCollection = firestore.collection("profile");

    const profilesSnapshot = await profileCollection.get();

    profilesSnapshot.forEach(async (profileDoc) => {
      const clinicSlotsRef = profileDoc.ref.collection("clinicSlots");
      const virtualSlotsRef = profileDoc.ref.collection("virtualSlots");

      const clinicSlotsSnapshot = await clinicSlotsRef.get();
      clinicSlotsSnapshot.forEach(async (doc) => {
        if (isPastDate(doc.id)) {
          await doc.ref.delete();
          console.log(`Deleted clinic slot: ${doc.id}`);
        }
      });

      const virtualSlotsSnapshot = await virtualSlotsRef.get();
      virtualSlotsSnapshot.forEach(async (doc) => {
        if (isPastDate(doc.id)) {
          await doc.ref.delete();
          console.log(`Deleted virtual slot: ${doc.id}`);
        }
      });
    });

    console.log("Old slots cleanup completed!");
  } catch (error) {
    console.error("Error deleting old slots: ", error);
  }
};

cron.schedule("0 0 * * *", () => {
  console.log("Running daily cleanup task...");
  deleteOldSlots();
});

const sendNotificationForNewMedicalRecord = async (
  appointmentId,
  doctorName
) => {
  try {
    const appointmentDoc = await firestore
      .collection("appointments")
      .doc(appointmentId)
      .get();
    const appointmentData = appointmentDoc.data();
    const patientId = appointmentData.patientId;

    const patientDoc = await firestore.collection("users").doc(patientId).get();
    const patientData = patientDoc.data();
    const fcmToken = patientData.fcmToken;

    if (fcmToken) {
      const notificationMessage = {
        notification: {
          title: "New Medical Record Added",
          body: `Dr. ${doctorName} has uploaded a new medical record for you.`,
        },
        token: fcmToken,
      };

      await admin.messaging().send(notificationMessage);
      console.log("Notification sent to patient successfully");
    } else {
      console.log("FCM Token not available for this patient.");
    }
  } catch (error) {
    console.error("Error sending notification for medical record:", error);
  }
};

app.post("/add-medical-record", async (req, res) => {
  const { appointmentId, doctorName } = req.body;

  if (!appointmentId || !doctorName) {
    return res
      .status(400)
      .json({ error: "appointmentId and doctorName are required" });
  }

  try {
    await sendNotificationForNewMedicalRecord(appointmentId, doctorName);

    res.status(200).json({ success: true, message: "Notification sent" });
  } catch (error) {
    console.error("Error in /add-medical-record route:", error);
    res.status(500).json({ error: "Failed to send notification" });
  }
});
