const kafka = require("../config/kafka");
const { handleFileChange }  = require('../services/airflow-file-service');

const consumer = kafka.consumer({ groupId: "folder-monitor-group" });

const runConsumer = async () => {
    await consumer.connect();
    console.log("Kafka Consumer connected ✅");

    await consumer.subscribe({ topic: "folder-monitor", fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(`📥 Received message: ${message.value.toString()}`);
            const parsedMessage = JSON.parse(message.value.toString());
            try{
                const windowsPath = parsedMessage.windows_path;
                handleFileChange(windowsPath)
            }
            catch (error) {
                console.error("Invalid JSON received:", message.value.toString());
            }
        },
    });
};

module.exports = runConsumer;
