import React from 'react';
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
import { ListItem } from '../molecules/ListItem';
import { PresenceStatus } from '../atoms/Avatar';

export interface Channel {
  id: string;
  name: string;
  subtitle?: string;
  timestamp?: string;
  avatarName?: string;
  avatarUri?: string;
  presence?: PresenceStatus;
  unreadCount?: number;
  isMuted?: boolean;
  isDM?: boolean;
}

export interface ChannelListProps {
  channels: Channel[];
  selectedId?: string;
  onChannelPress?: (channel: Channel) => void;
  sectionTitle?: string;
  style?: StyleProp<ViewStyle>;
}

export function ChannelList({
  channels,
  selectedId,
  onChannelPress,
  sectionTitle,
  style,
}: ChannelListProps) {
  const { colors, space, textStyles } = useTheme();

  const renderItem = ({ item }: ListRenderItemInfo<Channel>) => (
    <ListItem
      title={item.isDM ? item.name : `# ${item.name}`}
      subtitle={item.subtitle}
      timestamp={item.timestamp}
      avatarName={item.isDM ? item.avatarName ?? item.name : undefined}
      avatarUri={item.isDM ? item.avatarUri : undefined}
      presence={item.isDM ? (item.presence ?? 'none') : 'none'}
      unreadCount={item.unreadCount}
      isMuted={item.isMuted}
      isSelected={item.id === selectedId}
      onPress={() => onChannelPress?.(item)}
    />
  );

  return (
    <View style={[styles.container, style]}>
      {sectionTitle && (
        <View style={[styles.sectionHeader, { paddingHorizontal: space.md, paddingVertical: space.xs }]}>
          <Text style={[textStyles.labelSM, { color: colors.textSecondary }]}>
            {sectionTitle.toUpperCase()}
          </Text>
        </View>
      )}
      <FlatList
        data={channels}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        scrollEnabled={false}
        ItemSeparatorComponent={() => null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
