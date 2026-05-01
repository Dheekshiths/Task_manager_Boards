import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async ({ projectId, filters = {} }, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
    if (filters.priority) params.append('priority', filters.priority);
    const { data } = await api.get(`/projects/${projectId}/tasks?${params}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch tasks');
  }
});

export const createTask = createAsyncThunk('tasks/create', async ({ projectId, taskData }, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/projects/${projectId}/tasks`, taskData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create task');
  }
});

export const updateTask = createAsyncThunk('tasks/update', async ({ projectId, taskId, taskData }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/projects/${projectId}/tasks/${taskId}`, taskData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update task');
  }
});

export const updateTaskStatus = createAsyncThunk('tasks/updateStatus', async ({ projectId, taskId, status }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/projects/${projectId}/tasks/${taskId}/status`, { status });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update status');
  }
});

export const deleteTask = createAsyncThunk('tasks/delete', async ({ projectId, taskId }, { rejectWithValue }) => {
  try {
    await api.delete(`/projects/${projectId}/tasks/${taskId}`);
    return taskId;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete task');
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearTasks: (state) => { state.list = []; },
    optimisticStatusUpdate: (state, action) => {
      const { taskId, status } = action.payload;
      const task = state.list.find((t) => t._id === taskId);
      if (task) task.status = status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => { state.loading = true; })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.list.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const idx = state.list.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.list = state.list.filter((t) => t._id !== action.payload);
      });
  },
});

export const { clearTasks, optimisticStatusUpdate } = taskSlice.actions;
export default taskSlice.reducer;
