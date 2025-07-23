import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.greeting.morning': 'Good Morning',
    'dashboard.greeting.afternoon': 'Good Afternoon',
    'dashboard.greeting.evening': 'Good Evening',
    'dashboard.status.online': 'Currently Online',
    'dashboard.status.offline': 'Currently Offline',
    'dashboard.online': 'Online',
    'dashboard.offline': 'Offline',
    'dashboard.bus.status': 'Bus Status',
    'dashboard.interested': 'Interested',
    'dashboard.today.trips': "Today's Trips",
    'dashboard.bus.details': 'Your Bus Details',
    'dashboard.plate.number': 'Plate Number',
    'dashboard.capacity': 'Capacity',
    'dashboard.route': 'Route',
    'dashboard.fare': 'Fare',
    'dashboard.passengers': 'passengers',
    'dashboard.no.route': 'No Route Assigned',
    'dashboard.next.schedule': 'Next Schedule',
    'dashboard.quick.actions': 'Quick Actions',
    'dashboard.start.trip': 'Start Trip',
    'dashboard.end.trip': 'End Trip',
    'dashboard.performance': "Today's Performance",
    'dashboard.trips.completed': 'Trips Completed',
    'dashboard.total.passengers': 'Total Passengers',
    'dashboard.estimated.earnings': 'Estimated Earnings',
    'dashboard.rwf': 'RWF',

    // Location
    'location.title': 'Location Tracking',
    'location.subtitle': 'Monitor and share your location',
    'location.tracking.status': 'Tracking Status',
    'location.status.active': 'Active',
    'location.status.inactive': 'Inactive',
    'location.status.available': 'Available',
    'location.status.unavailable': 'Unavailable',
    'location.last.update': 'Last Update',
    'location.never': 'Never',
    'location.current.location': 'Current Location',
    'location.your.bus': 'Your Bus',
    'location.bus.location': 'Bus Location',
    'location.not.available': 'Location not available',
    'location.enable.services': 'Please enable location services',
    'location.details': 'Location Details',
    'location.latitude': 'Latitude:',
    'location.longitude': 'Longitude:',
    'location.accuracy': 'Accuracy:',
    'location.start.tracking': 'Start Tracking',
    'location.stop.tracking': 'Stop Tracking',
    'location.tracking.started': 'Tracking Started',
    'location.tracking.stopped': 'Tracking Stopped',
    'location.sharing.enabled': 'Your location is now being shared with passengers',
    'location.sharing.disabled': 'Location sharing has been disabled',

    // Passengers
    'passengers.title': 'Interested Passengers',
    'passengers.found': 'passengers found',
    'passengers.total.interested': 'Total Interested',
    'passengers.confirmed': 'Confirmed',
    'passengers.pending': 'Pending',
    'passengers.all': 'All',
    'passengers.interested': 'Interested',
    'passengers.confirm': 'Confirm',
    'passengers.deny': 'Deny',
    'passengers.confirming': 'Confirming...',
    'passengers.denying': 'Denying...',
    'passengers.pickup.point': 'Pickup Point:',
    'passengers.interested.since': 'Interested Since:',
    'passengers.unknown': 'Unknown',
    'passengers.no.found': 'No passengers found',
    'passengers.no.interest': 'No one has shown interest in your bus yet',
    'passengers.no.pending': 'No pending passengers found',

    // My Bus
    'bus.title': 'My Bus',
    'bus.no.assigned': 'No Bus Assigned',
    'bus.no.assigned.subtitle': "You haven't been assigned a bus yet. Please contact your administrator.",
    'bus.details': 'Bus Details',
    'bus.performance': "Today's Performance",
    'bus.upcoming.schedules': 'Upcoming Schedules',
    'bus.quick.actions': 'Quick Actions',
    'bus.start.trip': 'Start Trip',
    'bus.end.trip': 'End Trip',
    'bus.settings': 'Bus Settings',

    // Settings
    'settings.title': 'Settings',
    'settings.subtitle': 'Manage your preferences and account',
    'settings.profile': 'Profile',
    'settings.preferences': 'Preferences',
    'settings.dark.mode': 'Dark Mode',
    'settings.dark.mode.description': 'Switch between light and dark themes',
    'settings.language': 'Language',
    'settings.support': 'Support',
    'settings.contact.support': 'Contact Support',
    'settings.contact.support.description': 'Get help from our support team',
    'settings.about': 'About',
    'settings.about.description': 'App version and information',
    'settings.logout': 'Logout',
    'settings.logout.confirm': 'Are you sure you want to logout?',
    'settings.logout.cancel': 'Cancel',
    'settings.logout.confirm.button': 'Logout',
    'settings.support.info': 'Support contact information:',
    'settings.support.email': 'Email: support@ridra.com',
    'settings.support.phone': 'Phone: +250 781 012 050',
    'settings.about.title': 'About Ridra Driver App',
    'settings.about.version': 'Version: 1.0.0',
    'settings.about.description': 'A modern bus driver management application designed to help drivers efficiently manage their routes, passengers, and schedules.',
    'settings.about.copyright': '© 2024 Ridra. All rights reserved.',
    'settings.language.select': 'Select your preferred language:',
    'settings.language.english': 'English',
    'settings.language.kinyarwanda': 'Kinyarwanda',

    // Common
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.ok': 'OK',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.loading': 'Loading...',
    'common.retry': 'Retry',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.close': 'Close',
  },
  rw: {
    // Dashboard
    'dashboard.title': 'Ikibaho',
    'dashboard.greeting.morning': 'Mwaramutse',
    'dashboard.greeting.afternoon': 'Mwiriwe',
    'dashboard.greeting.evening': 'Mugororotse',
    'dashboard.status.online': 'Ubu uri kumurongo',
    'dashboard.status.offline': 'Ubu utari kumurongo',
    'dashboard.online': 'Kumurongo',
    'dashboard.offline': 'Ntibumurongo',
    'dashboard.bus.status': 'Imiterere y\'ibisi',
    'dashboard.interested': 'Bifuza',
    'dashboard.today.trips': 'Urugendo rwa uyu munsi',
    'dashboard.bus.details': 'Ibisobanura by\'ibisi',
    'dashboard.plate.number': 'Imibare y\'ibisi',
    'dashboard.capacity': 'Ubushobozi',
    'dashboard.route': 'Inzira',
    'dashboard.fare': 'Amafaranga',
    'dashboard.passengers': 'abagenzi',
    'dashboard.no.route': 'Nta nzira yatanzwe',
    'dashboard.next.schedule': 'Igihe gikurikira',
    'dashboard.quick.actions': 'Ibikorwa by\'ihuse',
    'dashboard.start.trip': 'Tangira urugendo',
    'dashboard.end.trip': 'Reka urugendo',
    'dashboard.performance': 'Ibikorwa by\'uyu munsi',
    'dashboard.trips.completed': 'Urugendo rwaranze',
    'dashboard.total.passengers': 'Abagenzi bose',
    'dashboard.estimated.earnings': 'Amafaranga y\'umwaka',
    'dashboard.rwf': 'RWF',

    // Location
    'location.title': 'Gukurikirana aho uri',
    'location.subtitle': 'Reba kandi wagereranire aho uri',
    'location.tracking.status': 'Imiterere yo gukurikirana',
    'location.status.active': 'Bikora',
    'location.status.inactive': 'Ntibikora',
    'location.status.available': 'Bihagije',
    'location.status.unavailable': 'Ntibihagije',
    'location.last.update': 'Gusubiramo kw\'ishize',
    'location.never': 'Nta ngihe',
    'location.current.location': 'Aho uri ubu',
    'location.your.bus': 'Ibisi ryawe',
    'location.bus.location': 'Aho ibisi riri',
    'location.not.available': 'Aho uri ntibihagije',
    'location.enable.services': 'Nyongera serivisi z\'aho uri',
    'location.details': 'Ibisobanura by\'aho uri',
    'location.latitude': 'Latitude:',
    'location.longitude': 'Longitude:',
    'location.accuracy': 'Ubwumvikane:',
    'location.start.tracking': 'Tangira gukurikirana',
    'location.stop.tracking': 'Reka gukurikirana',
    'location.tracking.started': 'Gukurikirana gatangiriye',
    'location.tracking.stopped': 'Gukurikirana garekuwe',
    'location.sharing.enabled': 'Aho uri ubu wagenereranijwe n\'abagenzi',
    'location.sharing.disabled': 'Gusangira aho uri garekuwe',

    // Passengers
    'passengers.title': 'Abagenzi bifuza',
    'passengers.found': 'abagenzi bagezweho',
    'passengers.total.interested': 'Bose bifuza',
    'passengers.confirmed': 'Byemejwe',
    'passengers.pending': 'Biteganyijwe',
    'passengers.all': 'Bose',
    'passengers.interested': 'Bifuza',
    'passengers.confirm': 'Emeza',
    'passengers.deny': 'Wanga',
    'passengers.confirming': 'Uremera...',
    'passengers.denying': 'Urenga...',
    'passengers.pickup.point': 'Aho gufata:',
    'passengers.interested.since': 'Bifuza kuva:',
    'passengers.unknown': 'Ntibizwi',
    'passengers.no.found': 'Nta mugenzi wagezweho',
    'passengers.no.interest': 'Nta muntu yagaragaje ko bifuza ibisi ryawe',
    'passengers.no.pending': 'Nta mugenzi witeganyijwe wagezweho',

    // My Bus
    'bus.title': 'Ibisi ryanjye',
    'bus.no.assigned': 'Nta bisi byatanzwe',
    'bus.no.assigned.subtitle': 'Nta bisi byatanzwe. Nyongera ubuyobozi.',
    'bus.details': 'Ibisobanura by\'ibisi',
    'bus.performance': 'Ibikorwa by\'uyu munsi',
    'bus.upcoming.schedules': 'Igihe gikurikira',
    'bus.quick.actions': 'Ibikorwa by\'ihuse',
    'bus.start.trip': 'Tangira urugendo',
    'bus.end.trip': 'Reka urugendo',
    'bus.settings': 'Igenamiterere rya bisi',

    // Settings
    'settings.title': 'Igenamiterere',
    'settings.subtitle': 'Gukurikirana ibyifuzo byawe na konte',
    'settings.profile': 'Ibisobanura',
    'settings.preferences': 'Ibyifuzo',
    'settings.dark.mode': 'Urukurikirane rw\'umwijima',
    'settings.dark.mode.description': 'Hindura hagati y\'urukurikirane rw\'umweru n\'umwijima',
    'settings.language': 'Ururimi',
    'settings.support': 'Gufasha',
    'settings.contact.support': 'Twandikire gufasha',
    'settings.contact.support.description': 'Fata ubufasha ku ishyirahamwe ryawe',
    'settings.about': 'Ibyerekeye',
    'settings.about.description': 'Verisiyo y\'ibikoresho n\'amakuru',
    'settings.logout': 'Sohoka',
    'settings.logout.confirm': 'Uzi neza ko ushaka gusohoka?',
    'settings.logout.cancel': 'Reka',
    'settings.logout.confirm.button': 'Sohoka',
    'settings.support.info': 'Amakuru yo gufasha:',
    'settings.support.email': 'Imeri: support@ridra.com',
    'settings.support.phone': 'Telefoni: +250 781 012 050',
    'settings.about.title': 'Ibyerekeye Ridra Driver App',
    'settings.about.version': 'Verisiyo: 1.0.0',
    'settings.about.description': 'Ibikoresho by\'ubuyobozi bw\'ibisi by\'ikinyagihugu byateguwe gufasha abashoferi gukurikirana neza inzira, abagenzi, n\'igihe.',
    'settings.about.copyright': '© 2024 Ridra. Amahoro yose yarafunguwe.',
    'settings.language.select': 'Hitamo ururimi rwawe:',
    'settings.language.english': 'Icyongereza',
    'settings.language.kinyarwanda': 'Kinyarwanda',

    // Common
    'common.error': 'Ikibazo',
    'common.success': 'Byagenze neza',
    'common.cancel': 'Reka',
    'common.ok': 'Sawa',
    'common.yes': 'Yego',
    'common.no': 'Oya',
    'common.loading': 'Birakora...',
    'common.retry': 'Ongera ugerageze',
    'common.back': 'Subira inyuma',
    'common.next': 'Gukurikira',
    'common.save': 'Bika',
    'common.delete': 'Siba',
    'common.edit': 'Hindura',
    'common.view': 'Reba',
    'common.close': 'Funga',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState('en');

  useEffect(() => {
    loadLanguagePreference();
  }, []);

  const loadLanguagePreference = async () => {
    try {
      const storedLanguage = await AsyncStorage.getItem('driver_language');
      if (storedLanguage) {
        setLanguageState(storedLanguage);
      }
    } catch (error) {
      console.error('Error loading language preference:', error);
    }
  };

  const setLanguage = async (lang: string) => {
    try {
      setLanguageState(lang);
      await AsyncStorage.setItem('driver_language', lang);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 