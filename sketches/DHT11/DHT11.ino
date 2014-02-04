// Version 0.1

#include <EtherCard.h>
#include <dht.h>

#define SEND_INTERVAL  6000
#define TIMEOUT        5000
#define dht_dpin A0

#define STATUS_IDLE    0
#define STATUS_SENT    1

dht DHT;
static byte mymac[] = {
  0xDA,0xD1,0xDD,0x00,0x00,0x01};
byte Ethernet::buffer[700];

char website[] PROGMEM = "192.168.1.133";

unsigned long previousMillis = 0;
static byte session_id;
static byte myip[] = { 
  192,168,1,199 };
// gateway ip address
static byte gwip[] = { 
  192,168,1,133 };
static byte hisip[] = { 
  192,168,1,133};
static byte mask[] = {
  255,255,255,0};

byte actual_status;

void setup () {

  Serial.begin(57600);
  Serial.println("WebTemperature demo");
  Serial.println();

  if (!ether.begin(sizeof Ethernet::buffer, mymac, 10)) {
    Serial.println( "Failed to access Ethernet controller");
    while(1); 
  } 
  else Serial.println("Ethernet controller initialized");

  ether.staticSetup(myip, gwip);
  ether.copyIp(ether.mymask, mask);

  // if (!ether.dnsLookup(website))
  //  Serial.println("DNS failed");
  //else
  ether.copyIp(ether.hisip, hisip);

  Serial.println();
  ether.printIp("IP Address:\t", ether.myip);
  ether.printIp("Netmask:\t", ether.mymask);
  ether.printIp("Gateway:\t", ether.gwip);
  ether.printIp("Website IP:\t", ether.hisip);
  Serial.println();
}

void loop() {

  ether.packetLoop(ether.packetReceive());
  unsigned long currentMillis = millis();

  switch(actual_status) {
  case STATUS_IDLE: 
    if(currentMillis - previousMillis > SEND_INTERVAL) {
      previousMillis = currentMillis;
      sendTemperature();        
    }
    break;
  case STATUS_SENT:
    if(currentMillis - previousMillis > TIMEOUT) {
      Serial.println("No response");
      previousMillis = currentMillis;
      actual_status = STATUS_IDLE;
    }
    checkResponse();
  }
}   

static void my_callback (byte status, word off, word len) {
  Serial.println(">>>");
  Ethernet::buffer[off+300] = 0;
  Serial.print((const char*) Ethernet::buffer + off);
  Serial.println("...");
}

void sendTemperature() {

  DHT.read11(dht_dpin);

  char string_temp[7];

  Stash stash;
  byte sd = stash.create();
  dtostrf(DHT.humidity, 2, 2, string_temp);
  stash.print("{\"sensors\":[{\"source\":\"DHT11\",\"token\":\"dht11token\",\"params\":{");
  stash.print("\"homeHumidity\":");
  stash.print(string_temp);
  dtostrf(DHT.temperature, 2, 2, string_temp);
  stash.print(",\"homeTemp\":");
  stash.print(string_temp);
  stash.print("}}]}");
  stash.save();

  Stash::prepare(PSTR("POST http://$F/api/ HTTP/1.0" "\r\n"
    "Host: $F" "\r\n"
    "Content-Type: application/json" "\r\n"
    "Content-Length: $D" "\r\n"
    "\r\n"
    "$H"),
  website, website, stash.size(), sd);


  session_id = ether.tcpSend();
  Serial.print("Temperature ");
  Serial.print(string_temp);
  Serial.print(" sent to website... ");
  actual_status = STATUS_SENT;
}

void checkResponse() {

  const char* reply = ether.tcpReply(session_id);
  if(reply > 0) {
    if(strstr(reply, "KO - ") != 0) Serial.println(strstr(reply, "KO - "));
    else Serial.println("OK");
    actual_status = STATUS_IDLE;  
  }
}
