//Axios configuration
import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";
import { Activity } from "../models/activity";
import { store } from "../stores/store";

const sleep = (delay: number) => {
    return new Promise(resolve => {
        setTimeout(resolve, delay);
    });
};

axios.defaults.baseURL = "http://localhost:5000/api";

//give a 1 second delay below fetching the activities
axios.interceptors.response.use(
    async response => {
        await sleep(1000);
        return response;
    },
    (error: AxiosError) => {
        const { data, status, config } = error.response!;
        switch (status) {
            case 400:
                //Bad request check.
                if (typeof data === "string") {
                    toast.error(data);
                }
                //Bad Guid check. If true send to not-found route
                if (
                    config.method === "get" &&
                    data.errors.hasOwnProperty("id")
                ) {
                    history.push("/not-found");
                }
                //Validation Error check.
                if (data.errors) {
                    const modalStateErrors = [];
                    for (const key in data.errors) {
                        if (data.errors[key]) {
                            modalStateErrors.push(data.errors[key]);
                        }
                    }
                    //Throw an array of error strings.
                    //Array passed into ValidationErrors component in App.tsx
                    throw modalStateErrors.flat();
                }
                break;
            case 401:
                toast.error("unauthorised");
                break;
            case 404:
                history.push("/not-found");
                break;
            case 500:
                store.commonStore.setServerError(data);
                history.push("/server-error");
                break;
        }
        return Promise.reject(error);
    }
);

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) =>
        axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) =>
        axios.put<T>(url, body).then(responseBody),
    delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Activities = {
    list: () => requests.get<Activity[]>("/activities"),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: Activity) =>
        requests.post<void>("/activities", activity),
    update: (activity: Activity) =>
        requests.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.delete<void>(`/activities/${id}`),
};

const agent = {
    Activities,
};

export default agent;
