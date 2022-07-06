package com.etf.ppis.Service;

import com.etf.ppis.Model.Request.Response;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ResponseService {
    Iterable<Response> getAll();
    Response findById(Long id) throws Exception;
    Response save(Response response);
    void remove(Long id);
    List<Response> findByRequestId(Long id);
    Response addResponse(Response response,Long requestId, Long userId, Long id) throws Exception;
}
