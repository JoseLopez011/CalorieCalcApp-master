import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { fetchUserData } from '../firebase';

const ProfileScreen = ({ navigation }) => {
    // State variables to store user and user data
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);

    // Effect to listen to changes in authentication state
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // If user is authenticated, set user and fetch user data
                setUser(user);

                try {
                    const userData = await fetchUserData(user.uid);
                    setUserData(userData);
                } catch (error) {
                    console.error('Error fetching user data:', error.message);
                }
            } else {
                // If user is not authenticated, navigate to login screen
                setUser(null);
                navigation.replace('Login');
            }
        });

        return () => unsubscribe(); // Cleanup function to unsubscribe when the component is unmounted
    }, [navigation]);

    // Function to handle user sign out
    const handleSignOut = async () => {
        const auth = getAuth();

        try {
            // Sign out the user and navigate to the login screen
            await signOut(auth);
            navigation.replace('Login');
        } catch (error) {
            console.error('Error signing out:', error.message);
        }
    };

    return (
        <View style={styles.container}>
            {/* Profile title */}
            <Text style={styles.title}>Profile</Text>
            {/* Display user data if available */}
            {userData && (
                <View style={styles.userInfo}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.info}>{userData.name}</Text>
                </View>
            )}
            {/* Display user email if available */}
            {user && (
                <View style={styles.userInfo}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.info}>{user.email}</Text>
                </View>
            )}
            {/* Button to sign out */}
            <TouchableOpacity onPress={handleSignOut} style={styles.button}>
                <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2C2C2C', // Dark Gray Background
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
    },
    userInfo: {
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        color: 'white',
        marginBottom: 5,
    },
    info: {
        fontSize: 16,
        color: 'white',
    },
    button: {
        backgroundColor: '#4CAF50', // Green Button
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
});

export default ProfileScreen;
