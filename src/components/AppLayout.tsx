import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

interface AppLayoutProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

const AppLayout = ({ children, style }: AppLayoutProps) => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar style={'dark'} />
            <View style={[{ flex: 1 }, style]}>
                {children}
            </View>
        </SafeAreaView>
    );
};

export default AppLayout;