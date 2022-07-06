import axios from 'axios';
import AuthService from '../service/security/auth.service';
import authHeader from '../service/security/auth-header';

export class ChangeService {

    getChanges() {
        return axios.get("http://localhost:8080/api/changes", {
          headers: {
            'Authorization': authHeader().Authorization
          }
        }).then((response) => {
            //console.log(JSON.stringify(response.data));
          return response.data;
        }).catch(error => console.error("${error}"));
      }

}