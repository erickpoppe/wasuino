#include <SPI.h>
#include <Ethernet.h>
#include <EthernetUdp.h>

byte arduinoMac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
IPAddress arduinoIP(192, 168, 0, 177); // IP for Arduino
unsigned int arduinoPort = 8888;      // port of Arduino

IPAddress receiverIP(192, 168, 0, 102); // IP of udp packets receiver
unsigned int receiverPort = 6000;      // port to listen on my PC

EthernetUDP Udp;

int sensorPin = A0; //define sensor pin
int sensorValue;

void setup() {
  Ethernet.begin(arduinoMac,arduinoIP);
  Udp.begin(arduinoPort);
}

void loop() {
  sensorValue = analogRead(sensorPin);//read sensor value from 0 to 1023 
  byte valueInBytes[2] = {lowByte(sensorValue), highByte(sensorValue)}; //convert it to byte array
  
  Udp.beginPacket(receiverIP, receiverPort); //start udp packet
  Udp.write(valueInBytes, 2); //write sensor data to udp packet
  Udp.endPacket(); // end packet

  delay(1000);
}
