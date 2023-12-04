import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, Text, View } from 'react-native';
import HomeScreen from './HomeScreen';
import FoodJournalTabScreen from './FoodJournalTabScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

const FoodJournalScreen = () => {
    const navigation = useNavigation();

    return (
        <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Food Journal" component={FoodJournalTabScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

const CustomTabBar = ({ state, descriptors, navigation }) => {
    return (
        <View
            style={{
                flexDirection: 'row',
                height: 60,
                backgroundColor: 'lightgrey',
                justifyContent: 'space-around',
                alignItems: 'center',
                position: 'absolute',
                bottom: 0,
                width: '100%',
            }}
        >
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityStates={isFocused ? ['selected'] : []}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        key={index}
                    >
                        <Text style={{ color: isFocused ? '#673ab7' : '#222' }}>{label}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default FoodJournalScreen;
