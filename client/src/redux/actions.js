export const signinUser = (user) => {
    return {
        type: 'signinUser',
        payload: { ...user }
    }
}

export const updateCurrentUserFromDatabase = async (user) => {
    return await fetch('/db/getUserByID', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ _id: user.id })
    })
        .then(res => {
            return res.json()
        })
        .then(json => {
            console.log(json)
            return {
                type: 'signinUser',
                payload: json
            }
        })


}

export const signout = () => {
    return {
        type: 'signout',
        payload: {}
    }
}