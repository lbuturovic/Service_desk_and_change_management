package com.etf.ppis.Repository;

import com.etf.ppis.Model.Request.Response;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResponseRepository extends JpaRepository<Response, Long> {
    List<Response> findByRequestId(Long requestId);
}
