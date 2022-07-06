package com.etf.ppis.Repository;

import com.etf.ppis.Model.Change.Change;
import com.etf.ppis.Model.Change.ChangeStatus;
import com.etf.ppis.Model.Change.RequestGroup;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChangeRepository extends CrudRepository<Change, Long> {
    List<Change> findByGroup(RequestGroup groupId);
    List<Change> findByApproverIsNotNull();
    List<Change> findByStatus(ChangeStatus status);
}
