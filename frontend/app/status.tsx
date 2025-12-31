import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  AppState,
  Platform,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

import MapSection from '../components/MapSection';
import StatusCard from '../components/statusCard';
import AlertBanner from '../components/AlertBanner';

import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import alarmSound from '../assets/alarm.mp3';

/* 🔔 Notification handler (NO SOUND here) */
Notifications.setNotificationHandler({
  handleNotification: async () =>
    ({
      shouldShowAlert: true,
      shouldPlaySound: false, // ❗ important to avoid double alarm
      shouldSetBadge: false,
    } as Notifications.NotificationBehavior),
});

/* 🔔 Android notification channel */
if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('alarm', {
    name: 'Alarm',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 500, 500, 500],
  });
}

export default function StatusScreen() {
  const { journeyData } = useLocalSearchParams();

  const [monitoringActive, setMonitoringActive] = useState(false);
  const [alarmActive, setAlarmActive] = useState(false);

  const alarmPlayedRef = useRef(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const appState = useRef(AppState.currentState);

  /* Track app foreground / background */
  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      appState.current = state;
    });
    return () => sub.remove();
  }, []);

  /* Request notification permission */
  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  /* Activate monitoring after screen mount */
  useEffect(() => {
    setMonitoringActive(true);
  }, []);

  const data = journeyData
    ? JSON.parse(journeyData as string)
    : null;

  if (!data) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ margin: 20 }}>Loading...</Text>
      </SafeAreaView>
    );
  }
  console.log('ROUTE STATUS:', data.route_status);


  const origin = data.origin;
  const destination = data.destination_coords;

  const currentEta = data.live_eta.eta_min;
  const alertBefore = data.trip.alert_before;
  const alertTriggered = currentEta <= alertBefore;

  /* 🚨 MAIN ALERT LOGIC */
  useEffect(() => {
    if (!monitoringActive) return;

    if (alertTriggered && !alarmPlayedRef.current) {
      alarmPlayedRef.current = true;
      setAlarmActive(true);

      // 📱 FOREGROUND → play alarm
      if (appState.current === 'active') {
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Warning
        );

        (async () => {
          const { sound } = await Audio.Sound.createAsync(
            alarmSound,
            { shouldPlay: true, isLooping: true }
          );
          soundRef.current = sound;
        })();
      } else {
        // 🔔 BACKGROUND → notification only
        Notifications.cancelAllScheduledNotificationsAsync();

        setTimeout(() => {
          Notifications.scheduleNotificationAsync({
            content: {
              title: '⏰ Wake Up!',
              body: 'Your destination is approaching.',
            },
            trigger: null,
          });
        }, 1500);
      }
    }
  }, [alertTriggered, monitoringActive]);

  /* 🛑 STOP ALARM */
  const stopAlarm = async () => {
    setAlarmActive(false);
    alarmPlayedRef.current = true;

    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  /* ⏱️ SNOOZE 5 MIN */
  const snoozeAlarm = async () => {
    await stopAlarm();
    alarmPlayedRef.current = false;

    setTimeout(() => {
      alarmPlayedRef.current = false;
      setAlarmActive(true);

      if (appState.current === 'active') {
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Warning
        );

        (async () => {
          const { sound } = await Audio.Sound.createAsync(
            alarmSound,
            { shouldPlay: true, isLooping: true }
          );
          soundRef.current = sound;
        })();
      } else {
        Notifications.scheduleNotificationAsync({
          content: {
            title: '⏰ Snoozed Alarm',
            body: 'Time to wake up!',
          },
          trigger: null,
        });
      }
    }, 5 * 60 * 1000);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <MapSection origin={origin} destination={destination} />

      <ScrollView contentContainerStyle={styles.container}>
        {alertTriggered && <AlertBanner />}

        {alarmActive && (
          <>
            <TouchableOpacity
              style={styles.stopButton}
              onPress={stopAlarm}
            >
              <Text style={styles.stopButtonText}>STOP ALARM</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.snoozeButton}
              onPress={snoozeAlarm}
            >
              <Text style={styles.snoozeButtonText}>
                SNOOZE 5 MIN
              </Text>
            </TouchableOpacity>
          </>
        )}

        <StatusCard title="Journey">
          <Text>Destination: {data.trip.destination}</Text>
          <Text>Alert Before: {alertBefore} min</Text>
        </StatusCard>

        <StatusCard title="Live ETA">
          <Text>ETA: {currentEta} min</Text>
          <Text>Distance: {data.live_eta.distance_km} km</Text>
        </StatusCard>

        <StatusCard title="Movement">
          <Text>Status: {data.movement.status}</Text>
          <Text>Speed: {data.movement.speed} km/h</Text>
        </StatusCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  stopButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 12,
  },
  stopButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 16,
  },
  snoozeButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 16,
  },
  snoozeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 15,
  },
});
