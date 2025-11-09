import { createAsyncThunk } from '../../hooks'

export const getCsrfToken = createAsyncThunk<void, void>(
    'csrf/getCsrfToken',
    async (_, { extra: api }) => {
        await api.getCsrftoken()
    }
)
