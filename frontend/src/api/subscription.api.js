import api from "./axios";

export function getSubscribedChannels(userId) {
    return api.get(`/subscriptions/user/${userId}`)
}