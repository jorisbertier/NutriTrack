import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { firestore } from '@/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';


interface UserState {
  user: {
    email: string | null;
    name: string | null;
    xp: number | null,
    level?: number | null,
    consumeByDays?: any,
    proteinsTotal?: any,
    carbsTotal?: any,
    fatsTotal?: any,
    [key: string]: any;
  } | null;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: UserState = {
  user: null,
  status: 'idle',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState['user']>) {
      state.user = action.payload;
      
    },
    clearUser(state) {
      state.user = null;
    },
    updateUserXp(state, action: PayloadAction<{ xp: number; level: number }>) {
      
      if (state.user) {
        state.user.xp = action.payload.xp;
        state.user.level = action.payload.level;
      }
    },
    updateUserCaloriesByDay(state, action: PayloadAction<{consumeByDays: any}>) {

      if(state.user) {
        const updatedConsumeByDays = {
          ...state.user.consumeByDays,
          ...action.payload.consumeByDays,
      };

        state.user.consumeByDays = updatedConsumeByDays;
      }
    },
    updateMacronutrients(state, action: PayloadAction<{proteinsTotal: any; carbsTotal: any; fatsTotal: any}>) {

      if(state.user) {
        const updatedProteins = {
          ...state.user.proteinsTotal,
          ...action.payload.proteinsTotal,
      };
        const updatedCarbs = {
          ...state.user.carbsTotal,
          ...action.payload.carbsTotal,
      };
        const updatedFats = {
          ...state.user.fatsTotal,
          ...action.payload.fatsTotal,
      };
        // state.user.proteinsTotal = action.payload.proteinsTotal;
        // state.user.carbsTotal = action.payload.carbsTotal;
        // state.user.fatsTotal = action.payload.fatsTotal;
        state.user.proteinsTotal = updatedProteins;
        state.user.carbsTotal = updatedCarbs;
        state.user.fatsTotal = updatedFats;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.user = action.payload;
      state.status = 'idle';
    });
    builder.addCase(fetchUserData.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchUserData.rejected, (state) => {
      state.status = 'failed';
    });
  },
});

export const fetchUserData = createAsyncThunk('user/fetchUserData', async (email: string | null) => {
  if (!email) return null;

  const userCollection = collection(firestore, 'User');
  const userSnapshot = await getDocs(userCollection);
  const userList = userSnapshot.docs.map((doc) => ({
    id: doc.id,
    email: doc.data().email,
    name: doc.data().name,
    xp: doc.data().xp,
    consumeByDays: doc.data().consumeByDays,
    ...doc.data(),
  }));

  return userList.find((user) => user.email === email) || null;
});


export const { setUser, clearUser, updateUserXp, updateUserCaloriesByDay, updateMacronutrients } = userSlice.actions;

export default userSlice.reducer;