import React, { useRef } from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ListRenderItemInfo,
} from 'react-native';
import { useTheme } from '../../theme';
import { MessageBubble } from '../molecules/MessageBubble';
import { Divider } from '../atoms/Divider';

export interface Message {
  id: string;
  text: string;
  senderName: string;
  senderAvatarUri?: string;
  timestamp: string;
  isSelf: boolean;
  isEdited?: boolean;
  reactions?: Array<{ emoji: string; count: number }>;
  dateDivider?: string; // e.g. "Today", "Yesterday", "Jan 15"
}

export interface MessageThreadProps {
  messages: Message[];
  style?: StyleProp<ViewStyle>;
}

export function MessageThread({ messages, style }: MessageThreadProps) {
  const { space } = useTheme();
  const listRef = useRef<FlatList>(null);

  const renderItem = ({ item, index }: ListRenderItemInfo<Message>) => {
    const prev = index > 0 ? messages[index - 1] : null;
    const showAvatar = !item.isSelf && (prev?.senderName !== item.senderName || !!item.dateDivider);
    const showSenderName = showAvatar;

    return (
      <View>
        {item.dateDivider && (
          <Divider
            label={item.dateDivider}
            style={{ marginVertical: space.md }}
          />
        )}
        <MessageBubble
          message={item.text}
          senderName={item.senderName}
          senderAvatarUri={item.senderAvatarUri}
          timestamp={item.timestamp}
          variant={item.isSelf ? 'sent' : 'received'}
          showAvatar={showAvatar}
          showSenderName={showSenderName}
          isEdited={item.isEdited}
          reactions={item.reactions}
          style={{ paddingHorizontal: space.md }}
        />
      </View>
    );
  };

  return (
    <FlatList
      ref={listRef}
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      style={[styles.list, style]}
      contentContainerStyle={{ paddingVertical: space.md }}
      onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    alignSelf: 'stretch',
  },
});
