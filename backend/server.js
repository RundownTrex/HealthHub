const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cron = require("node-cron");
const admin = require("firebase-admin");
const { format, parse, addMinutes, isWithinInterval } = require("date-fns");

const app = express();
app.use(cors());

const server = http.createServer(app);

const serviceAccount = require("./healthhub-2cbba-firebase-adminsdk-aej53-cb62774064.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

cron.schedule("* * * * *", async () => {
  console.log("Checking for upcoming appointments...");

  const now = new Date();
  const thirtyMinutesLater = addMinutes(now, 30);

  try {
    const appointmentsSnapshot = await firestore
      .collection("appointments")
      .get();

    if (!appointmentsSnapshot.empty) {
      appointmentsSnapshot.forEach((doc) => {
        const appointment = doc.data();

        if (appointment.reminderSent) {
          return;
        }

        const appointmentDateTimeStr = `${appointment.appointmentDate} ${appointment.slotTime}`;
        const appointmentDateTime = parse(
          appointmentDateTimeStr,
          "yyyy-MM-dd hh:mm a",
          new Date()
        );

        if (
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
      });
    } else {
      console.log("No upcoming appointments within 30 minutes.");
    }
  } catch (error) {
    console.error("Error fetching appointments:", error);
  }
});

app.get("/", (req, res) => {
  res.send("Hello");
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat room: ${chatId}`);
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
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
