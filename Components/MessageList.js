import React from 'react';
import {Message} from "./Message";
import {ScrollView} from "react-native";

export const MessageList = ({messages}) => {

  return (
    <ScrollView>
      {[...messages].reverse().map(message => <Message key={message.timestamp} message={message} /> )}
    </ScrollView>
  )
}
