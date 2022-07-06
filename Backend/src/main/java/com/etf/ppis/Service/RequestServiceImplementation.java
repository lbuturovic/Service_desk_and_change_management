package com.etf.ppis.Service;

import com.etf.ppis.Exceptions.NotFoundException;
import com.etf.ppis.Model.Change.Change;
import com.etf.ppis.Model.Change.ChangeStatus;
import com.etf.ppis.Model.Change.RequestGroup;
import com.etf.ppis.Model.Request.Request;
import com.etf.ppis.Model.Request.RequestStatus;
import com.etf.ppis.Model.Users.User;
import com.etf.ppis.Repository.RequestGroupRepository;
import com.etf.ppis.Repository.RequestRepository;
import com.etf.ppis.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RequestServiceImplementation implements RequestService{
    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    UserRepository userRepo;

    @Autowired
    RequestGroupRepository groupRepo;

    public Iterable<Request> getAll() {
        return requestRepository.findAll();
    }

    public Request findById(Long id) throws Exception {
        return requestRepository.findById(id).orElseThrow(()-> new Exception("Request with provided id not found!"));
    }

    public Request save(Request request) {
        return requestRepository.save(request);
    }

    public void remove(Long id){ requestRepository.deleteById(id);}

    @Override
    public Request createRequest(Long userId, Request newRequest) {
        Request request = userRepo.findById(userId).map(reporter -> {
            newRequest.setReported(reporter);
            return requestRepository.save(newRequest);
        }).orElseThrow(() -> new NotFoundException("User with id = " + userId + " does not exist!"));
        return request;
    }

    @Override
    public Request closeRequest(Long userId, Long requestId) {
        Request request = requestRepository.findById(requestId).orElseThrow(() -> new NotFoundException("Request with id = " + requestId + " does not exist!"));
        User user = userRepo.findById(userId).orElseThrow(() -> new NotFoundException("User with id = " + userId + " does not exist!"));
        request.setStatus(RequestStatus.CLOSED);
        requestRepository.save(request);
        return request;
    }

    @Override
    public Request updateRequest(Long requestId, Long groupId, Request request) {
        Request oldRequest = requestRepository.findById(requestId).orElseThrow(() -> new NotFoundException("Request with id = " + requestId + " does not exist!"));
        RequestGroup group = groupRepo.findById(groupId).orElseThrow(() -> new NotFoundException("User with id = " + groupId + " does not exist!"));
        oldRequest.setResolving(null);
        oldRequest.setPriority(request.getPriority());
        oldRequest.setDue(request.getDue());
        oldRequest.setCategory(request.getCategory());
        oldRequest.setResponses(request.getResponses());
        oldRequest.setStatus(request.getStatus());
        oldRequest.setSubject(request.getSubject());
        oldRequest.setGroup(group);
        oldRequest.setReported(request.getReported());
        oldRequest.setCreated(request.getCreated());
        oldRequest.setDescription(request.getDescription());
        oldRequest.setFirstResponseDue(request.getFirstResponseDue());

        return requestRepository.save(oldRequest);
    }

    @Override
    public Request updateRequest(Long requestId, Request request) {
        Request oldRequest = requestRepository.findById(requestId).orElseThrow(() -> new NotFoundException("Request with id = " + requestId + " does not exist!"));
        oldRequest.setResolving(null);
        oldRequest.setPriority(request.getPriority());
        oldRequest.setDue(request.getDue());
        oldRequest.setCategory(request.getCategory());
        oldRequest.setResponses(request.getResponses());
        oldRequest.setStatus(request.getStatus());
        oldRequest.setSubject(request.getSubject());
        oldRequest.setGroup(null);
        oldRequest.setReported(request.getReported());
        oldRequest.setCreated(request.getCreated());
        oldRequest.setDescription(request.getDescription());
        oldRequest.setFirstResponseDue(request.getFirstResponseDue());

        return requestRepository.save(oldRequest);
    }

    @Override
    public Request updateRequestResolving(Long requestId, Long groupId, Long id, Request request) {
        User user = userRepo.findById(id).orElseThrow(() -> new NotFoundException("User with id = " + id + " does not exist!"));
        Request oldRequest = requestRepository.findById(requestId).orElseThrow(() -> new NotFoundException("Request with id = " + requestId + " does not exist!"));
        RequestGroup group = groupRepo.findById(groupId).orElseThrow(() -> new NotFoundException("User with id = " + groupId + " does not exist!"));
        oldRequest.setResolving(user);
        oldRequest.setPriority(request.getPriority());
        oldRequest.setDue(request.getDue());
        oldRequest.setCategory(request.getCategory());
        oldRequest.setResponses(request.getResponses());
        oldRequest.setStatus(request.getStatus());
        oldRequest.setSubject(request.getSubject());
        oldRequest.setGroup(group);
        oldRequest.setReported(request.getReported());
        oldRequest.setCreated(request.getCreated());
        oldRequest.setDescription(request.getDescription());
        oldRequest.setFirstResponseDue(request.getFirstResponseDue());

        return requestRepository.save(oldRequest);
    }

    @Override
    public Request updateRequestResolving(Long requestId, Long id, Request request) {
        User user = userRepo.findById(id).orElseThrow(() -> new NotFoundException("User with id = " + id + " does not exist!"));
        Request oldRequest = requestRepository.findById(requestId).orElseThrow(() -> new NotFoundException("Request with id = " + requestId + " does not exist!"));
        oldRequest.setResolving(user);
        oldRequest.setPriority(request.getPriority());
        oldRequest.setDue(request.getDue());
        oldRequest.setCategory(request.getCategory());
        oldRequest.setResponses(request.getResponses());
        oldRequest.setStatus(request.getStatus());
        oldRequest.setSubject(request.getSubject());
        oldRequest.setGroup(null);
        oldRequest.setReported(request.getReported());
        oldRequest.setCreated(request.getCreated());
        oldRequest.setDescription(request.getDescription());
        oldRequest.setFirstResponseDue(request.getFirstResponseDue());

        return requestRepository.save(oldRequest);
    }

    @Override
    public List<Request> getNoGroup() {
        List<Request> requests = new ArrayList<>();
        requestRepository.findByGroupNull().forEach(requests::add);
        return requests;
    }

    @Override
    public Request assignGroup(Long idRequest, Long idGroup) {
        Request _request = requestRepository.findById(idRequest).orElseThrow(() -> new NotFoundException("Request with id = " + idRequest + " does not exist!"));
        RequestGroup requestGroup = groupRepo.findById(idGroup).orElseThrow(() -> new NotFoundException("Group with id = " + idGroup + " does not exist!"));
        _request.setGroup(requestGroup);
        return requestRepository.save(_request);

    }

    @Override
    public List<Request> getRequestsByGroup(Long groupId) {
        RequestGroup requestGroup = groupRepo.findById(groupId).orElseThrow(() -> new NotFoundException("Group with id = " + groupId + " does not exist!"));
        return requestRepository.findByGroup(requestGroup);
    }

    @Override
    public List<Request> getClientRequest(Long clientId) {
        Iterable<Request> allRequests = requestRepository.findAll();
        List<Request> newRequests = ((List<Request>) allRequests)
                .stream()
                .filter(c -> (c.getReported()!=null && c.getReported().getId().equals(clientId)))
                .collect(Collectors.toList());
        return newRequests;
    }

    @Override
    public List<Request> getDeveloperRequest(Long devId) {
        Iterable<Request> allRequests = requestRepository.findAll();
        List<Request> newRequests = ((List<Request>) allRequests)
                .stream()
                .filter(c -> (c.getResolving()!=null && c.getResolving().getId().equals(devId)))
                .collect(Collectors.toList());
        return newRequests;
    }


}
