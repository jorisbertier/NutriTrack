import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDocs, updateDoc } from 'firebase/firestore';
import { firestore } from "@/firebaseConfig";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userData1: null,
        status: 'idle', // Peut être 'loading', 'succeeded', 'failed'
        error: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.userData1 = action.payload;
        },
        setLoading: (state) => {
            state.status = 'loading';
        },
        setError: (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        setSuccess: (state) => {
            state.status = 'succeeded';
        },
    },
});

export const { setUser, setLoading, setError, setSuccess } = userSlice.actions;

// Action pour récupérer l'utilisateur depuis Firebase
export const fetchUser = (user) => async (dispatch) => {
    console.log('usererer' , user)
    try {
        const email = user[0]?.email;
        console.log('email', email)
        const userCollection = collection(firestore, 'User');
        const userSnapshot = await getDocs(userCollection);
        
        const userList = userSnapshot.docs.map((doc, index) => ({
            index: index + 1,
            id: doc.id,
            email: doc.data().email,
            name: doc.data().name,
            firstName: doc.data().firstName,
            dateOfBirth: doc.data().dateOfBirth,
            gender: doc.data().gender,
            height: doc.data().height,
            weight: doc.data().weight,
            activityLevel: doc.data().activityLevel,
            profilPicture: doc.data().profilPicture,
            xp: doc.data().xp,
            level: doc.data().level,
            xpLogs: doc.data().xpLogs,
        }));
        
        const user = userList.find(user => user.email === userEmail);
        
        if (!user) {
            dispatch(setError('User not found'));
            return;
        }
        
        dispatch(setUser(user));
        dispatch(setSuccess());
    } catch (error) {
        dispatch(setError(error.message));
    }
};

// Action pour ajouter de l'expérience
export const addExperience = ({ userId, xpGained, date }) => async (dispatch, getState) => {
    try {
        const state = getState().user;
        const userDocRef = doc(firestore, 'User', userId);
        const userData = state.userData1;

        if (userData) {
            const currentXP = userData.xp || 0;
            const xpLogs = userData.xpLogs || {};
            const xpToday = xpLogs[date] || 0;

            const xpToAdd = Math.min(20 - xpToday, xpGained);
            const newXpToday = xpToday + xpToAdd;
            const newXP = currentXP + xpToAdd;

            let currentLevel = userData.level || 1;
            let levelXP = 20;
            for (let i = 1; i < currentLevel; i++) {
                levelXP *= 2;
            }

            if (newXP >= levelXP) currentLevel++;
            if (currentLevel > 10) currentLevel = 10;

            await updateDoc(userDocRef, {
                xp: newXP,
                level: currentLevel,
                [`xpLogs.${date}`]: newXpToday,
            });

            // Mettez à jour les données dans le Redux store
            dispatch(setUser({ ...userData, xp: newXP, level: currentLevel, xpLogs: { ...xpLogs, [date]: newXpToday } }));
        } else {
            dispatch(setError('User not found'));
        }
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export default userSlice.reducer;