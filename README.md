# FirebaseLink

This project enables you to build a temperature and humidity monitoring system using NodeMCU, DHT11 sensor, and Firebase. With this setup, you can remotely monitor real-time temperature and humidity data through the Firebase real-time database.

## Introduction

The NodeMCU DHT11 Firebase project allows you to gather temperature and humidity data from the DHT11 sensor and send it to Firebase for real-time monitoring. The NodeMCU board acts as the main controller, while the DHT11 sensor measures the temperature and humidity values.

## Features

- Send data to Firebase real-time database
- Remotely monitor temperature and humidity readings
- User-friendly web interface

## Prerequisites

Before using this project, make sure you have the following:

- Firebase account

## Installation

1. Clone this repository to your local machine.
2. Connect the NodeMCU board to your computer.
3. Open the Arduino IDE.
4. Install the necessary libraries:
   - ESP8266WiFi
   - FirebaseESP8266
5. Set up your Firebase account and create a real-time database.
6. Update the Firebase credentials in the code with your own.
7. Upload the code to the NodeMCU board.

## Usage

1. Power up the NodeMCU board and make sure it is connected to the internet.
2. The NodeMCU will start reading temperature and humidity data from the DHT11 sensor.
3. The data will be sent to the Firebase real-time database.
4. You can access the Firebase dashboard to monitor the temperature and humidity readings remotely.

## Security Rules

It is essential to configure the security rules for your Firebase real-time database to ensure data privacy and security. Here is an example of the recommended security rules:

```json
{
  "rules": {
    "temperature": {
      ".read": true,
      ".write": false
    },
    "humidity": {
      ".read": true,
      ".write": false
    }
  }
}
```

Please customize the security rules according to your specific requirements.

Contributing
Contributions to this project are welcome. If you have any suggestions, improvements, or bug fixes, please feel free to submit a pull request.

License
This project is licensed under the MIT License.

```
Feel free to modify the contents based on your project's specifics, and make sure to include any additional sections or information that may be relevant.
```
