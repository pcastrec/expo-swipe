import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { PanelPan } from './components/PanelPan';

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar style="light" />
            <View style={styles.container}>
                {/* <PanelPan position={'LEFT'}>
                    <View style={{ flex: 1, backgroundColor: '#568432', borderWidth: 1 }} />
                </PanelPan>

                <PanelPan position={'RIGHT'}>
                    <View style={{ flex: 1, backgroundColor: '#568432', borderWidth: 1 }} />
                </PanelPan> */}

                <PanelPan position={'BOTTOM'}>
                    <View style={{ flex: 1, backgroundColor: '#568432', borderWidth: 1 }}>
                        <Text>Coucou</Text>
                    </View>
                </PanelPan>

            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#333',
        justifyContent: 'center',
    },
});
