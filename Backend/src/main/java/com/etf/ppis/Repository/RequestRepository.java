package com.etf.ppis.Repository;

import com.etf.ppis.Model.Change.Change;
import com.etf.ppis.Model.Change.RequestGroup;
import com.etf.ppis.Model.Request.Request;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends CrudRepository<Request, Long> {
    List<Request> findByGroupNull();
    List<Request> findByGroup(RequestGroup requestGroup);
}
