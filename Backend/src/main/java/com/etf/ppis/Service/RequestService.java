package com.etf.ppis.Service;

import com.etf.ppis.Model.Change.Change;
import com.etf.ppis.Model.Change.ChangeReport;
import com.etf.ppis.Model.Request.Request;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface RequestService {
    Iterable<Request> getAll();
    Request findById(Long id) throws Exception;
    Request save(Request request);
    void remove(Long id);
    Request createRequest(Long userId, Request newRequest);
    Request closeRequest(Long userId, Long requestId);
    Request updateRequest(Long requestId, Long groupId, Request request);
    Request updateRequest(Long requestId, Request request);
    Request updateRequestResolving(Long requestId, Long groupId, Long id, Request request);
    Request updateRequestResolving(Long requestId, Long id, Request request);
    List<Request> getNoGroup();
    Request assignGroup(Long idRequest, Long idGroup);
    List<Request> getRequestsByGroup(Long groupId);
    List<Request> getClientRequest(Long clientId);
    List<Request> getDeveloperRequest(Long devId);
}
