import axios from 'axios'

export class RequestService {
    getRequestsMedium() {
        return axios.get('assets/demo/data/requests-medium.json')
            .then(res => res.data.data);
    }

    getRequestsLarge() {
        return axios.get('assets/demo/data/requests-large.json')
                .then(res => res.data.data);
    }
    
}