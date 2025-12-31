import { Platform } from 'react-native';

// This file exists ONLY for TypeScript resolution.
// Metro will still pick .native.tsx or .web.tsx automatically.

let MapSection: any;

if (Platform.OS === 'web') {
  MapSection = require('./MapSection.web').default;
} else {
  MapSection = require('./MapSection.native').default;
}

export default MapSection;
