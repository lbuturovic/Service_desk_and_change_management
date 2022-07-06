package com.etf.ppis.Service;

import com.etf.ppis.Model.Request.Request;
import com.etf.ppis.Model.Request.Response;
import com.etf.ppis.Model.Users.User;
import com.etf.ppis.Repository.RequestRepository;
import com.etf.ppis.Repository.ResponseRepository;
import com.etf.ppis.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResponseServiceImplementation implements ResponseService{
    @Autowired
    private ResponseRepository responseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Override
    public Iterable<Response> getAll() {
        return responseRepository.findAll();
    }

    @Override
    public Response findById(Long id) throws Exception {
        return responseRepository.findById(id).orElseThrow(()-> new Exception("Response with provided id not found!"));
    }

    @Override
    public Response save(Response response) {

        return responseRepository.save(response);
    }

    @Override
    public void remove(Long id) {
        responseRepository.deleteById(id);
    }

    @Override
    public List<Response> findByRequestId(Long id) {
        return responseRepository.findByRequestId(id);
    }

    @Override
    public Response addResponse(Response response,Long requestId, Long userId, Long id) throws Exception {
        User sender = userRepository.findById(userId).orElseThrow(()-> new Exception("User with id= "+userId+" not found!"));
        User receiver = userRepository.findById(id).orElseThrow(()-> new Exception("User with id= "+id+" not found!"));
        Request request = requestRepository.findById(requestId).orElseThrow(()-> new Exception("Request with id= "+requestId+" not found!"));
        response.setSender(sender);
        response.setReceiver(receiver);
        response.setRequest(request);
        return responseRepository.save(response);
        //return new Response("opis ");
    }
}
