var initialState = {
}

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case 'signinUser' :
            console.log('REDUX : ACTION: siginUser, PAYLOAD :', action.payload)
            let newState = {
                ...state,
                currentUser : {...action.payload}
            }

            console.log('REDUX -> NEW STATE')
            console.log(newState)
            return newState

        case 'signout' : 
            return {
                ...state,
                currentUser : null
            }
                
        default: return state
    }
}