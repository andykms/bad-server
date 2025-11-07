import { createSlice } from '@reduxjs/toolkit'

import { getCsrfToken } from './thunk'
import { TCsrf } from './type'

const initialState: TCsrf = {
    error: false,
}

export const csrfSlice = createSlice({
    name: 'csrf',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getCsrfToken.fulfilled, (state) => {
            state.error = false
        })
        builder.addCase(getCsrfToken.rejected, (state) => {
            state.error = true
        })
        builder.addCase(getCsrfToken.pending, (state) => {
            state.error = false
        })
    },
})
