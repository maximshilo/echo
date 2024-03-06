var initialState = {
}

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case 'signinUser' :
            return {
                ...state,
                currentUser : {...action.payload}
            }

        case 'signout' : 
            return {
                ...state,
                currentUser : null
            }
        
        default: return state
    }
}