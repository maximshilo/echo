export const signinUser = (user) => {
    return {
        type : 'signinUser',
        payload : {...user}
    }
}

export const signout = () => {
    return {
        type : 'signout',
        payload : {}
    }
}