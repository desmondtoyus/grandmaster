import axios from "axios";
export default {
    getDates: function (id) {
        return axios.get("/api/dates/" + id, {
            headers: { authorization: localStorage.getItem('token') }
        });
    }
};

