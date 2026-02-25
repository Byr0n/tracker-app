import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { BottomSheet } from '../../components/organisms/BottomSheet';
import { Input } from '../../components/atoms/Input';
import { Collaborator } from '../types';

interface CollaboratorModalProps {
  visible: boolean;
  collaborators: Collaborator[];
  onClose: () => void;
  onAdd: (contact: string) => void;
  onRemove: (id: string) => void;
}

function isValidContact(val: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[+]?[\d\s\-(). ]{7,}$/;
  return emailRegex.test(val) || phoneRegex.test(val);
}

export function CollaboratorModal({
  visible,
  collaborators,
  onClose,
  onAdd,
  onRemove,
}: CollaboratorModalProps) {
  const { colors } = useTheme();
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    const trimmed = contact.trim();
    if (!trimmed) {
      setError('Enter an email or phone number');
      return;
    }
    if (!isValidContact(trimmed)) {
      setError('Enter a valid email address or phone number');
      return;
    }
    onAdd(trimmed);
    setContact('');
    setError('');
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Collaborators" snapHeight="55%">
      <View style={styles.container}>
        <Input
          value={contact}
          onChangeText={val => {
            setContact(val);
            setError('');
          }}
          placeholder="Email or phone number"
          errorText={error}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="done"
          onSubmitEditing={handleAdd}
          rightIcon={
            <TouchableOpacity onPress={handleAdd} style={styles.addBtn}>
              <Text style={[styles.addBtnLabel, { color: colors.textBrand }]}>Add</Text>
            </TouchableOpacity>
          }
          style={styles.input}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          {collaborators.length === 0 ? (
            <Text style={[styles.empty, { color: colors.textTertiary }]}>
              No collaborators yet. Add someone by email or phone.
            </Text>
          ) : (
            collaborators.map(c => (
              <View
                key={c.id}
                style={[styles.collabRow, { borderBottomColor: colors.borderSubtle }]}
              >
                <View style={[styles.avatar, { backgroundColor: colors.bgBrand }]}>
                  <Text style={styles.avatarLetter}>
                    {c.contact[0].toUpperCase()}
                  </Text>
                </View>
                <Text
                  style={[styles.contactText, { color: colors.textPrimary }]}
                  numberOfLines={1}
                >
                  {c.contact}
                </Text>
                <TouchableOpacity
                  onPress={() => onRemove(c.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  accessibilityLabel="Remove collaborator"
                >
                  <Text style={[styles.removeBtn, { color: colors.textTertiary }]}>×</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  input: {
    marginBottom: 16,
  },
  addBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  addBtnLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    paddingVertical: 24,
    fontSize: 14,
    lineHeight: 20,
  },
  collabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  contactText: {
    flex: 1,
    fontSize: 15,
  },
  removeBtn: {
    fontSize: 22,
    lineHeight: 24,
  },
});
