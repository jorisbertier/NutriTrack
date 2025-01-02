const initialState = {
    status: '',
    userData: {}
}

export const userReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'FETCH_USER_SUCCESS':
            return {
                ...state,
                userData: action.payload,
                status: 'succeeded'
            }
        case 'FETCH_USER_FAILURE':
            return {
                ...state,
                status: 'failed'
            }
        case 'ADD_EXPERIENCE_SUCCESS':
            return {
                ...state,
                userData: { ...state.userData, ...action.payload  }
            }
        default:
            return state
    }
}